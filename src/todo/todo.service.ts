
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { randomUUID } from 'node:crypto';

import { TodoEntity } from './entities/todo.entity';
import { CreateTodoDto } from './dto/create-todo.dto';
import { UpdateTodoDto } from './dto/update-todo.dto';

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

  // Méthode de Nour : inchangée
  findAll(): Promise<TodoEntity[]> {
    return this.todoRepository.find();
  }

  // Slide 9 - V1 : ajouter un Todo en mémoire
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

  // Slide 9 - V2 : ajouter un Todo dans MySQL
  async addTodo(
    createTodoDto: CreateTodoDto,
  ): Promise<TodoEntity> {
    const newTodo = this.todoRepository.create(createTodoDto);

    const savedTodo = await this.todoRepository.save(newTodo);

    return savedTodo;
  }

  // Slide 10 : modifier un Todo par son ID
  async updateTodo(
    id: number,
    updateTodoDto: UpdateTodoDto,
  ): Promise<TodoEntity> {
    const existingTodo = await this.todoRepository.findOneBy({
      id,
    });

    if (!existingTodo) {
      throw new NotFoundException(
        `Todo avec l'id ${id} introuvable`,
      );
    }

    const updatedTodo = this.todoRepository.merge(
      existingTodo,
      updateTodoDto,
    );

    return await this.todoRepository.save(updatedTodo);
  }

  async deleteTodo(id: number): Promise<void> {
  const todo = await this.todoRepository.findOneBy({ id });

  if (!todo) {
    throw new NotFoundException(
      `Todo avec l'id ${id} introuvable`,
    );
  }

  await this.todoRepository.delete(id);
}
}
