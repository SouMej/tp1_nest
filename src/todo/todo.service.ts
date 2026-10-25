
import { Injectable, NotFoundException } from '@nestjs/common';
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

  // Stockage temporaire des Todos V1 en mémoire
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
    // Une seule requête : regrouper par statut et compter
    const rows = await this.todoRepository
      .createQueryBuilder('todo')
      .select('todo.status AS status, COUNT(todo.id) AS total')
      .groupBy('todo.status')
      .getRawMany();

    // Partir de 0 pour chacun des trois statuts
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

  // V1 : ajouter un Todo en mémoire
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


  // V2 : ajouter un Todo dans MySQL
  addTodoV2(createTodoDto: CreateTodoDto,): Promise<TodoEntity> {
    return  this.todoRepository.save(createTodoDto);
  }


  // modifier un Todo par son ID
  async updateTodo(id: number,updateTodoDto: UpdateTodoDto,): Promise<TodoEntity> {
    const existingTodo = await this.todoRepository.findOneBy({id,});
    if (!existingTodo) {
      throw new NotFoundException(`Todo avec l'id ${id} introuvable`,);
    }

    const updatedTodo = this.todoRepository.merge(existingTodo,updateTodoDto,);
    return await this.todoRepository.save(updatedTodo);
  }

  async deleteTodo(id: number): Promise<void> {
  const todo = await this.todoRepository.findOneBy({ id });
  if (!todo) {
    throw new NotFoundException(`Todo avec l'id ${id} introuvable`,);}

  await this.todoRepository.delete(id);
 }

 
  async softDeleteTodo(id: number): Promise<void> {
    const todo = await this.todoRepository.findOneBy({ id });
    if (!todo) {
      throw new NotFoundException(`Todo avec l'id ${id} introuvable`,);}

    await this.todoRepository.softDelete(id);
  }
  
  async restoreTodo(id: number): Promise<void> {
    const todo = await this.todoRepository.findOne({
      where: { id },
      withDeleted: true,
    });

    if (!todo) {
      throw new NotFoundException(`Todo avec l'id ${id} introuvable`,);}
    await this.todoRepository.restore(id);
  }


}
