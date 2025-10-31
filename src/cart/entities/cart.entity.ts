import { CartProductEntity } from 'src/cart-product/entities/cart-product.entity';
import { Column, CreateDateColumn, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

export class CartEntity {

  @PrimaryGeneratedColumn('rowid')
  id: number;

  @Column({name: 'user_id', nullable: false})
  userId:number;

  @Column({ name: 'active', nullable: false})
  active: boolean;

  @CreateDateColumn({name: 'created_at'})
  createdAt: Date;

  @CreateDateColumn({name: 'updated_at'})
  updatedAt: Date;

  @OneToMany(() => CartProductEntity, (cartProduct) => cartProduct.cart)
  cartProduct?: CartProductEntity[];
}