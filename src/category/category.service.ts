import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CategoryEntity } from './entities/category.entity';
import { DeleteResult, Repository } from 'typeorm';
import { CreateCategoryDto } from './dtos/create-category.dto';
import { ProductService } from 'src/product/product.service';
import { ReturnCategoryDto } from './dtos/return-category.dto';
import { CountProductDto } from 'src/product/dtos/count-product.dto';
import { UpdateCategoryDto } from './dtos/update-category.dto';

@Injectable()
export class CategoryService {
  constructor(
    @InjectRepository(CategoryEntity)
    private readonly categoryRepository: Repository<CategoryEntity>,
    private readonly productService: ProductService,
  ){}

  findAmountCategoryInProducts(category: CategoryEntity, countList: CountProductDto[]){
    const count = countList.find((itemCount) => itemCount.category_id === category.id);

    if (count) {
      return count.total;
    }

    return 0;
  }

  async findAllCategories(): Promise<ReturnCategoryDto[]> {
    const categories = await this.categoryRepository.find();

    const count = await this.productService.countProductsByCateogryId();

    if(!categories || categories.length === 0) {
      throw new NotFoundException('Categories empty');
    }

    return categories.map(
      (category) => 
        new ReturnCategoryDto(
          category,
          this.findAmountCategoryInProducts(category, count),
        ),
      );
  }

  async findCategoryByName(name: string): Promise<CategoryEntity> {
    const category = await this.categoryRepository.findOne({
      where: {
        name,
      },
    });

    if (!category) {
      throw new NotFoundException(`Category name ${name} not found`);
    }
    
    return category;
  }

  async findCategoryById(categoryId: number, isRelations?: boolean): Promise<CategoryEntity> {
    const relations = isRelations
      ? {
         products: true,
        }
      : undefined;
      
      
    const category = await this.categoryRepository.findOne({
      where: {
        id: categoryId,
      },

      relations,
    });

    if(!category) {
      throw new NotFoundException(`Category id: ${categoryId} not found`);
    }

    return category;
  }

  async createCategory(
    createCategory: CreateCategoryDto,
  ): Promise<CategoryEntity> {
    const category = await this.findCategoryByName(createCategory.name).catch(
      () => undefined,
    );

    if (category) {
      throw new BadRequestException(
        `Category name ${createCategory.name} exist`,
      );
    }
    return this.categoryRepository.save(createCategory);
  }

  async deleteCategory(categoryId: number): Promise<DeleteResult> {
    const category = await this.findCategoryById(categoryId, true);

    if (category.products?.length > 0) {
      throw new BadRequestException('Category with relations.');
    }
    return this.categoryRepository.delete({ id: categoryId });
  }

  async editCategory(
    categoryId: number,
    updateCategory: UpdateCategoryDto
  ): Promise<CategoryEntity> {

    const category = await this.findCategoryById(categoryId);

    return this.categoryRepository.save({
      ...category,
      ...updateCategory,
    });

  }
}
