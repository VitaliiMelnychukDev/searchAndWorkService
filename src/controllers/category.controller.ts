import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  ValidationPipe,
} from '@nestjs/common';
import { IResponse, IResponseNoData } from '../types/general';
import { CategoryMessage } from '../types/message';
import { CreateDto } from '../dtos/category/create.dto';
import { AuthNeeded } from '../decorators/auth.decorator';
import { Roles } from '../decorators/roles.decorator';
import { AccountRole } from '../types/account';
import { CategoryService } from '../services/category.service';
import { Category } from '../entities/Category';

@Controller('category')
export class CategoryController {
  constructor(private categoryService: CategoryService) {}

  @Post('')
  @AuthNeeded()
  @Roles(AccountRole.Admin)
  async create(
    @Body(new ValidationPipe()) createBody: CreateDto,
  ): Promise<IResponse<Category>> {
    const category = await this.categoryService.create(createBody);

    return {
      success: true,
      data: category,
    };
  }

  @Get('getAll')
  async get(): Promise<IResponse<Category[]>> {
    const categories = await this.categoryService.getAll();

    return {
      success: true,
      data: categories,
    };
  }

  @Delete(':id')
  @AuthNeeded()
  @Roles(AccountRole.Admin)
  async remove(@Param('id') id: number): Promise<IResponseNoData> {
    await this.categoryService.remove(id);

    return {
      success: true,
      message: CategoryMessage.CategorySuccessfullyRemoved,
    };
  }
}
