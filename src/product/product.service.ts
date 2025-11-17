import { forwardRef, Inject, Injectable, NotFoundException } from '@nestjs/common';
import { In, Repository } from 'typeorm';
import { ProductEntity } from './entities/product.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateProductDto } from './dtos/create-product.dto';
import { CategoryService } from 'src/category/category.service';
import { DeleteResult } from 'typeorm/browser';
import { UpdateProductDto } from './dtos/update-product.dto';
import { CountProductDto } from './dtos/count-product.dto';
import { CorreiosService } from 'src/correios/correios.service';
import { SizeProductDto } from 'src/correios/dtos/size-product.dto';
import { CdServiceEnum } from 'src/correios/enums/cd-service.enum';

@Injectable()
export class ProductService {
  constructor(
    @InjectRepository(ProductEntity)
    private readonly productRepository: Repository<ProductEntity>,

    @Inject(forwardRef(() => CategoryService))
    private readonly categoryService: CategoryService,

    private readonly correiosService: CorreiosService,
  ){}

  async findAll(productId?: number[],
    isFindRelations?: boolean,
  ): Promise<ProductEntity[]> {
    let findOptions = {};

    if (productId && productId.length > 0) {
      findOptions = {
        where: {
          id: In(productId),
        },
      };
    }

    if (isFindRelations){
      findOptions ={
        ...findOptions,
        relations: {
          category: {
            category: true
          }
        }
      }
    }
    
    const products = await this.productRepository.find(findOptions);

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

  async updateProduct(
    updateProduct: UpdateProductDto,
    productId: number,
  ): Promise<ProductEntity> {
    const product = await this.findProducById(productId);

    return this.productRepository.save({
      ...product,
      ...updateProduct,
    });
  }

  async countProductsByCateogryId(): Promise<CountProductDto[]> {
    return this.productRepository
    .createQueryBuilder('product')
    .select('product.category_id, COUNT(*) as total')
    .groupBy('product.category_id')
    .getRawMany();
  }

  async findPriceDelivery(cep: string, idProduct: number): Promise<any> {
    const product = await this.findProducById(idProduct);
    const sizeProduct = new SizeProductDto(product);
    const returnCorreios = await this.correiosService.priceDelivery(
      CdServiceEnum.PAC,
      cep,
      sizeProduct,
    );

    return returnCorreios;
  }
}
