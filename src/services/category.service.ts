import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateDto } from '../dtos/category/create.dto';
import { CategoryError } from '../types/error';
import { Category } from '../entities/Category';

@Injectable()
export class CategoryService {
  constructor(
    @InjectRepository(Category)
    private readonly categoryRepository: Repository<Category>,
  ) {}

  async create(createDto: CreateDto): Promise<Category> {
    let category: Category | null = null;
    try {
      category = await this.categoryRepository.findOne({
        where: { title: createDto.title },
      });
    } catch {
      throw new BadRequestException(CategoryError.CreateCategoryFail);
    }

    if (category) {
      throw new BadRequestException(CategoryError.CategoryAlreadyExist);
    }

    const newCategory = new Category();
    newCategory.title = createDto.title;

    try {
      return await this.categoryRepository.save(newCategory);
    } catch {
      throw new BadRequestException(CategoryError.CreateCategoryFail);
    }
  }

  async getAll(): Promise<Category[]> {
    try {
      return await this.categoryRepository.find();
    } catch {
      throw new BadRequestException(CategoryError.GetCategoryFail);
    }
  }

  async remove(categoryId: number): Promise<void> {
    let category: Category | null = null;

    try {
      category = await this.categoryRepository.findOne({
        where: { id: categoryId },
      });
    } catch {
      throw new BadRequestException(CategoryError.DeleteCategoryFail);
    }

    if (!category) {
      throw new NotFoundException(CategoryError.CategoryDoesNotExist);
    }

    try {
      await this.categoryRepository.delete(category);
    } catch {
      throw new BadRequestException(CategoryError.DeleteCategoryFail);
    }
  }
}
