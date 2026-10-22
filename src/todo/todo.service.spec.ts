import { jest } from '@jest/globals';
import { NotFoundException } from '@nestjs/common';
import { TodoService } from './todo.service';
import { Repository } from 'typeorm';
import { TodoEntity } from './entities/todo.entity';

describe('TodoService - addTodo et updateTodo', () => {
  let service: TodoService;
  let repository: jest.Mocked<Repository<TodoEntity>>;

  beforeEach(() => {
    repository = {
      create: jest.fn(),
      save: jest.fn(),
      findOneBy: jest.fn(),
      merge: jest.fn(),
      delete: jest.fn(),
      softDelete: jest.fn(),
    } as unknown as jest.Mocked<Repository<TodoEntity>>;

    service = new TodoService(repository);
  });

  // Slide 9 - Version 1 : tester l'ajout en mémoire
  describe('addTodoV1', () => {
    it('doit créer un Todo en mémoire avec un UUID', () => {
      const dto = {
        name: 'Test V1',
        description: 'Ajout en memoire',
      };

      const result = service.addTodoV1(dto);

      expect(result.name).toBe('Test V1');
      expect(result.description).toBe('Ajout en memoire');

      // Vérifier que l'ID est un UUID
      expect(result.id).toMatch(
        /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i,
      );

      // Vérifier la date et le statut
      expect(result.createdAt).toBeInstanceOf(Date);
      expect(result.status).toBe('En attente');

      // Vérifier que MySQL n'est pas utilisé
      expect(repository.create).not.toHaveBeenCalled();
      expect(repository.save).not.toHaveBeenCalled();
    });
  });

  // Slide 9 - Version 2 : tester l'ajout dans MySQL
  describe('addTodo', () => {
    it('doit ajouter un nouveau Todo', async () => {
      const dto = {
        name: 'Revision',
        description: 'Reviser le cours NestJS',
      };

      const todo = { id: 1, ...dto } as TodoEntity;

      repository.create.mockReturnValue(todo);
      repository.save.mockResolvedValue(todo);

      const result = await service.addTodo(dto);

      expect(repository.create).toHaveBeenCalledWith(dto);
      expect(repository.save).toHaveBeenCalledWith(todo);
      expect(result).toEqual(todo);
    });
  });

  // Slide 10 : tester updateTodo
  describe('updateTodo', () => {
    it('doit modifier un Todo existant', async () => {
      const todo = {
        id: 1,
        name: 'Revision',
        description: 'Reviser le cours NestJS',
      } as TodoEntity;

      const dto = { name: 'Examen' };

      const updatedTodo = {
        ...todo,
        ...dto,
      } as TodoEntity;

      repository.findOneBy.mockResolvedValue(todo);
      repository.merge.mockReturnValue(updatedTodo);
      repository.save.mockResolvedValue(updatedTodo);

      const result = await service.updateTodo(1, dto);

      expect(repository.findOneBy).toHaveBeenCalledWith({ id: 1 });
      expect(repository.merge).toHaveBeenCalledWith(todo, dto);
      expect(repository.save).toHaveBeenCalledWith(updatedTodo);
      expect(result.name).toBe('Examen');
    });

    it('doit retourner une erreur 404 si le Todo est introuvable', async () => {
      repository.findOneBy.mockResolvedValue(null);

      await expect(
        service.updateTodo(9999, { name: 'Test' }),
      ).rejects.toThrow(NotFoundException);

      expect(repository.save).not.toHaveBeenCalled();
    });
  });

  
  describe('deleteTodo', () => {
    it('should permanently delete an existing Todo', async () => {
      const todo = {
        id: 1,
        name: 'Revision',
        description: 'Reviser NestJS',
      } as TodoEntity;

      repository.findOneBy.mockResolvedValue(todo);
      repository.delete.mockResolvedValue({
        affected: 1,
        raw: {},
      } as any);

      await service.deleteTodo(1);

      expect(repository.findOneBy).toHaveBeenCalledWith({ id: 1 });
      expect(repository.delete).toHaveBeenCalledWith(1);
    });

    it('should throw NotFoundException if the Todo does not exist', async () => {
      repository.findOneBy.mockResolvedValue(null);

      await expect(service.deleteTodo(9999)).rejects.toThrow(
        NotFoundException,
      );

      expect(repository.delete).not.toHaveBeenCalled();
    });
  });

  
  describe('softDeleteTodo', () => {
    it('should soft delete an existing Todo', async () => {
      const todo = {
        id: 1,
        name: 'Revision',
        description: 'Reviser NestJS',
      } as TodoEntity;

      repository.findOneBy.mockResolvedValue(todo);
      repository.softDelete.mockResolvedValue({
        affected: 1,
        raw: {},
        generatedMaps: [],
      });

      await service.softDeleteTodo(1);

      expect(repository.findOneBy).toHaveBeenCalledWith({ id: 1 });
      expect(repository.softDelete).toHaveBeenCalledWith(1);
    });

    it('should throw NotFoundException if the Todo does not exist', async () => {
      repository.findOneBy.mockResolvedValue(null);

      await expect(service.softDeleteTodo(9999)).rejects.toThrow(
        NotFoundException,
      );

      expect(repository.softDelete).not.toHaveBeenCalled();
    });
  });

});
