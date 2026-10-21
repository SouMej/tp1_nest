
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { TodoEntity } from './entities/todo.entity';
import { CreateTodoDto } from './dto/create-todo.dto';
import { UpdateTodoDto } from './dto/update-todo.dto';

@Injectable()
export class TodoService {
  constructor(
    @InjectRepository(TodoEntity)
    private readonly todoRepository: Repository<TodoEntity>,
  ) {}

  // Méthode de Nour : ne pas modifier
  findAll(): Promise<TodoEntity[]> {
    return this.todoRepository.find();
  }

  // Slide 9 - Ajouter un Todo
  async addTodo(
    createTodoDto: CreateTodoDto,
  ): Promise<TodoEntity> {
    const newTodo = this.todoRepository.create(createTodoDto);

    const savedTodo = await this.todoRepository.save(newTodo);

    return savedTodo;
  }

  // Slide 10 - Modifier un Todo par son ID
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
}
