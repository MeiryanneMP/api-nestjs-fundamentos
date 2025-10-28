import { Column, CreateDateColumn, PrimaryGeneratedColumn } from 'typeorm';

export class CartEntity {

  @PrimaryGeneratedColumn('rowid')
  id: number;

  @Column({name: 'name', nullable: false})
  name: string;

  @CreateDateColumn({name: 'created_at'})
  createdAt: Date;

  @CreateDateColumn({name: 'updated_at'})
  updatedAt: Date;
}