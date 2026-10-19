import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { StatusEnum } from '../enums/status.enum';

@Entity('todo')
export class TodoEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({ type: 'text' })
  description: string;

  @CreateDateColumn()
  createdAt: Date;

  @Column({ type: 'enum', enum: StatusEnum, default: StatusEnum.WAITING })
  status: StatusEnum;
}