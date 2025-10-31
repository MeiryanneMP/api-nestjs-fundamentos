import { Module } from '@nestjs/common';
import { CartProductEntity } from './entities/cart-product.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([CartProductEntity])],
})
export class CartProductModule {}
