import { Column, CreateDateColumn, DeleteDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import { StatusEnum } from '../enums/status.enum';

@Entity('todo')
export class TodoEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({ type: 'text' })
  description: string;

  @CreateDateColumn({update: false})
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt?: Date;

  @Column({ type: 'enum', enum: StatusEnum, default: StatusEnum.WAITING })
  status: StatusEnum;
}