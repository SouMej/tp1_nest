import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOptionsWhere, Like, Repository } from 'typeorm';
import { randomUUID } from 'node:crypto';

import { TodoEntity } from './entities/todo.entity';
import { CreateTodoDto } from './dto/create-todo.dto';
import { UpdateTodoDto } from './dto/update-todo.dto';
import { SearchTodoDto } from './dto/search-todo.dto';

import { StatusEnum } from './enums/status.enum';

@Injectable()
export class TodoService {

  private readonly todosV1: Array<{
    id: string;
    name: string;
    description: string;
    createdAt: Date;
    status: string;
  }> = [];

  constructor(
    @InjectRepository(TodoEntity)
    private readonly todoRepository: Repository<TodoEntity>,
  ) {}

  async findAll({search,status,page = 1,limit = 10,}: Partial<SearchTodoDto> = {}): Promise<{
    data: TodoEntity[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  }> {
    const textFilter = search ? Like(`%${search}%`) : undefined;
    let where: FindOptionsWhere<TodoEntity> | FindOptionsWhere<TodoEntity>[];

    if (search && status) {
      where = [{ name: textFilter, status },{ description: textFilter, status },];
    } else if (search) {
      where = [{ name: textFilter }, { description: textFilter }];
    } else if (status) {
      where = { status };
    } else {
      where = {};
    }

    const [data, total] = await this.todoRepository.findAndCount({
      where,
      skip: (page - 1) * limit,
      take: limit,
    });

    return {
      data,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }


  async getStatusStats(): Promise<Record<string, number>> {
    const rows = await this.todoRepository
      .createQueryBuilder('todo')
      .select('todo.status AS status, COUNT(todo.id) AS total')
      .groupBy('todo.status')
      .getRawMany();

    const result: Record<string, number> = {};
    Object.values(StatusEnum).forEach((s) => (result[s] = 0));
    rows.forEach((r) => (result[r.status] = Number(r.total)));

    return result;
  }

  async getTodoById(id: number): Promise<TodoEntity> {
    const todo = await this.todoRepository.findOne({ where: { id } });

    if (!todo) {
      throw new NotFoundException(`Todo avec l'id ${id} introuvable`);
    }

    return todo;
  }

  addTodoV1(createTodoDto: CreateTodoDto) {
    const newTodo = {
      id: randomUUID(),
      name: createTodoDto.name,
      description: createTodoDto.description,
      createdAt: new Date(),
      status: 'En attente',
    };

    this.todosV1.push(newTodo);

    return newTodo;
  }


  addTodoV2(createTodoDto: CreateTodoDto, userId?: string): Promise<TodoEntity> {
    const newTodo = this.todoRepository.create(createTodoDto);
    if (userId) {
      newTodo.userId = userId;
    }
    return this.todoRepository.save(newTodo);
  }


  async updateTodo(id: number, updateTodoDto: UpdateTodoDto, userId?: string): Promise<TodoEntity> {
    const existingTodo = await this.todoRepository.findOneBy({ id });
    if (!existingTodo) {
      throw new NotFoundException(`Todo avec l'id ${id} introuvable`);
    }

    if (existingTodo.userId && existingTodo.userId !== userId) {
      throw new UnauthorizedException(`Vous n'avez pas le droit de modifier ce Todo`);
    }

    const updatedTodo = this.todoRepository.merge(existingTodo, updateTodoDto);
    return await this.todoRepository.save(updatedTodo);
  }

  async deleteTodo(id: number, userId?: string): Promise<void> {
    const todo = await this.todoRepository.findOneBy({ id });
    if (!todo) {
      throw new NotFoundException(`Todo avec l'id ${id} introuvable`);
    }

    if (todo.userId && todo.userId !== userId) {
      throw new UnauthorizedException(`Vous n'avez pas le droit de supprimer ce Todo`);
    }

    await this.todoRepository.delete(id);
  }

  
  async softDeleteTodo(id: number, userId?: string): Promise<void> {
    const todo = await this.todoRepository.findOneBy({ id });
    if (!todo) {
      throw new NotFoundException(`Todo avec l'id ${id} introuvable`);
    }

    if (todo.userId && todo.userId !== userId) {
      throw new UnauthorizedException(`Vous n'avez pas le droit de supprimer ce Todo`);
    }

    await this.todoRepository.softDelete(id);
  }
  
  async restoreTodo(id: number): Promise<void> {
    const todo = await this.todoRepository.findOne({
      where: { id },
      withDeleted: true,
    });

    if (!todo) {
      throw new NotFoundException(`Todo avec l'id ${id} introuvable`);
    }
    await this.todoRepository.restore(id);
  }

}
