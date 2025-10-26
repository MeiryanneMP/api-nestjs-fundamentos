import { Injectable, NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { ProductEntity } from './entities/product.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateProductDto } from './dtos/create-product.dto';
import { CategoryService } from 'src/category/category.service';
import { DeleteResult } from 'typeorm/browser';

@Injectable()
export class ProductService {
  constructor(
    @InjectRepository(ProductEntity)
    private readonly productRepository: Repository<ProductEntity>,
    private readonly categoryService: CategoryService,
  ){}

  async findAll(): Promise<ProductEntity[]> {
    const products = await this.productRepository.find();

    if (!products || products.length === 0){
      throw new NotFoundException('Not found products');
    }

    return products;
  }

  async findProducById(productId: number): Promise<ProductEntity> {
    const product = await this.productRepository.findOne({
      where: {
        id: productId,
      },
    });

    if (!product) {
      throw new NotFoundException(`Product id ${productId} not found`);
    }
    
    return product;
  }

  async createProduct(
      createProduct: CreateProductDto,
    ): Promise<ProductEntity> {

      await this.categoryService.findCategoryById(createProduct.categoryId);
      
      return this.productRepository.save({
        ...createProduct,
      });
    }

  async deleteProduct(productId: number): Promise<DeleteResult> {
    await this.findProducById(productId);
    return this.productRepository.delete({ id: productId});
  }  
}
