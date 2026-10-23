
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
  Query,
} from '@nestjs/common';

import { TodoService } from './todo.service';
import { CreateTodoDto } from './dto/create-todo.dto';
import { UpdateTodoDto } from './dto/update-todo.dto';
import { SearchTodoDto } from './dto/search-todo.dto';

@Controller('todo')
export class TodoController {
  constructor(private readonly todoService: TodoService) {}


  @Get()
  findAll(@Query() searchTodoDto: SearchTodoDto) {
    return this.todoService.findAll(searchTodoDto);
  }
  @Get('stats')
  getStatusStats() {
    return this.todoService.getStatusStats();
  }
  @Get(':id')
  getTodoById(@Param('id', ParseIntPipe) id: number) {
    return this.todoService.getTodoById(id);
  }



  // ajout en mémoire
  @Post()
  @Version('1')
  addTodoV1(@Body() createTodoDto: CreateTodoDto) {
    return this.todoService.addTodoV1(createTodoDto);
  }

  // ajout dans MySQL
  @Post()
  @Version('2')
  addTodo(@Body() createTodoDto: CreateTodoDto) {
    return this.todoService.addTodo(createTodoDto);
  }

  // Modifier un Todo par son ID
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
