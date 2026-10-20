import {
  Body,
  Controller,
  Get,
  Post,
  Patch,
  Param,
  ParseIntPipe,
} from '@nestjs/common';

import { TodoService } from './todo.service';
import { CreateTodoDto } from './dto/create-todo.dto';
import { UpdateTodoDto } from './dto/update-todo.dto';


@Controller('todo')
export class TodoController {
  constructor(private readonly todoService: TodoService) {}

  @Get()
  findAll() {
    return this.todoService.findAll();
  }

  @Post()
  create(@Body() createTodoDto: CreateTodoDto) {
    return this.todoService.create(createTodoDto);
  }
  @Patch(':id')
update(
  @Param('id', ParseIntPipe) id: number,
  @Body() updateTodoDto: UpdateTodoDto,
) {
  return this.todoService.update(id, updateTodoDto);
}
}
