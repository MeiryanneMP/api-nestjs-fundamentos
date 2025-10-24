import { Module } from '@nestjs/common';
import { ServiceModule } from './service/service.module';
import { ProductController } from './product.controller';
import { ProductService } from './product.service';

@Module({
  imports: [ServiceModule],
  controllers: [ProductController],
  providers: [ProductService]
})
export class ProductModule {}
