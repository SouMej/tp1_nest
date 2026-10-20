import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TodoEntity } from './entities/todo.entity';
import { CreateTodoDto } from './dto/create-todo.dto';
import { NotFoundException } from '@nestjs/common';
import { UpdateTodoDto } from './dto/update-todo.dto';
@Injectable()
export class TodoService {
  constructor(
    @InjectRepository(TodoEntity)
    private readonly todoRepository: Repository<TodoEntity>,
  ) {}
  
findAll(): Promise<TodoEntity[]> {
  return this.todoRepository.find();
}

  
create(createTodoDto: CreateTodoDto): Promise<TodoEntity> {
  const todo = this.todoRepository.create(createTodoDto);
  return this.todoRepository.save(todo);
}
async update(
  id: number,
  updateTodoDto: UpdateTodoDto,
): Promise<TodoEntity> {
  const todo = await this.todoRepository.findOneBy({ id });

  if (!todo) {
    throw new NotFoundException(`Todo avec l'id ${id} introuvable`);
  }

  Object.assign(todo, updateTodoDto);

  return this.todoRepository.save(todo);
}


}