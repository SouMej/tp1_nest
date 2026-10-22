
import {
  Body,
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Param,
  ParseIntPipe,
  Version,
} from '@nestjs/common';

import { TodoService } from './todo.service';
import { CreateTodoDto } from './dto/create-todo.dto';
import { UpdateTodoDto } from './dto/update-todo.dto';

@Controller('todo')
export class TodoController {
  constructor(private readonly todoService: TodoService) {}

  // Méthode de Nour : inchangée
  @Get()
  findAll() {
    return this.todoService.findAll();
  }

  // Slide 9 - Version 1 : ajout en mémoire
  @Post()
  @Version('1')
  addTodoV1(@Body() createTodoDto: CreateTodoDto) {
    return this.todoService.addTodoV1(createTodoDto);
  }

  // Slide 9 - Version 2 : ajout dans MySQL
  @Post()
  @Version('2')
  addTodo(@Body() createTodoDto: CreateTodoDto) {
    return this.todoService.addTodo(createTodoDto);
  }

  // Slide 10 : Modifier un Todo par son ID
  @Patch(':id')
  updateTodo(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateTodoDto: UpdateTodoDto,
  ) {
    return this.todoService.updateTodo(id, updateTodoDto);
  }

  @Delete(':id')
  deleteTodo(@Param('id', ParseIntPipe) id: number) {
  return this.todoService.deleteTodo(id);
  }

  
  @Delete(':id/soft')
  softDeleteTodo(@Param('id', ParseIntPipe) id: number) {
    return this.todoService.softDeleteTodo(id);
  }
  
  @Patch(':id/restore')
  restoreTodo(@Param('id', ParseIntPipe) id: number) {
    return this.todoService.restoreTodo(id);
  }


}
