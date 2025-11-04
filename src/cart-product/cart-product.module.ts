import { Module } from '@nestjs/common';
import { CartProductEntity } from './entities/cart-product.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CartProductService } from './cart-product.service';

@Module({
  imports: [TypeOrmModule.forFeature([CartProductEntity]), CartProductModule],
  providers: [CartProductService],
  exports: [CartProductService],
})
export class CartProductModule {}
