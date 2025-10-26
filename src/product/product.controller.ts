import { Body, Controller, Get, Post, UsePipes, ValidationPipe } from '@nestjs/common';
import { Roles } from 'src/decorators/roles.decorator';
import { UserType } from 'src/user/enum/user-type.enum';
import { ProductService } from './product.service';
import { ReturnProductDto } from './dtos/return-product.dto';
import { CreateProductDto } from './dtos/create-product.dto';
import { ProductEntity } from './entities/product.entity';

@Roles(UserType.Admin, UserType.User)
@Controller('product')
export class ProductController {
  constructor(
    private readonly productService: ProductService
  ){}

  @Get()
  async findAll(): Promise<ReturnProductDto[]> {
    return ( await this.productService.findAll()).map(
      (product) => new ReturnProductDto(product),
    );
  }

  @Roles(UserType.User)
  @UsePipes(ValidationPipe)
  @Post()
  async createProduct(
    @Body() createProduct: CreateProductDto,
  ): Promise<ProductEntity> {
    return this.productService.createProduct(createProduct);
  }
}
