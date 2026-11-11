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
  Req,
} from '@nestjs/common';
import type { Request } from 'express';
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

  // ajouter todo v1
  @Post()
  @Version('1')
  addTodoV1(@Body() createTodoDto: CreateTodoDto) {
    return this.todoService.addTodoV1(createTodoDto);
  }

  // ajouter todo v2
  @Post()
  @Version('2')
  addTodoV2(
    @Body() createTodoDto: CreateTodoDto,
    @Req() req: Request,
  ) {
    return this.todoService.addTodoV2(createTodoDto, (req as any).userId);
  }

  // Modifier un Todo par son ID
  @Patch(':id')
  updateTodo(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateTodoDto: UpdateTodoDto,
    @Req() req: Request,
  ) {
    return this.todoService.updateTodo(id, updateTodoDto, (req as any).userId);
  }

  @Delete(':id')
  deleteTodo(
    @Param('id', ParseIntPipe) id: number,
    @Req() req: Request,
  ) {
    return this.todoService.deleteTodo(id, (req as any).userId);
  }

  @Delete(':id/soft')
  softDeleteTodo(
    @Param('id', ParseIntPipe) id: number,
    @Req() req: Request,
  ) {
    return this.todoService.softDeleteTodo(id, (req as any).userId);
  }

  @Patch(':id/restore')
  restoreTodo(@Param('id', ParseIntPipe) id: number) {
    return this.todoService.restoreTodo(id);
  }
}
