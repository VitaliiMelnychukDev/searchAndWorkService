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
import { CityMessage } from '../types/message';
import { CityService } from '../services/city.service';
import { CreateDto } from '../dtos/city/create.dto';
import { AuthNeeded } from '../decorators/auth.decorator';
import { Roles } from '../decorators/roles.decorator';
import { AccountRole } from '../types/account';
import { City } from '../entities/City';

@Controller('city')
export class CityController {
  constructor(private cityService: CityService) {}
  @Post('')
  @AuthNeeded()
  @Roles(AccountRole.Admin)
  async create(
    @Body(new ValidationPipe()) createBody: CreateDto,
  ): Promise<IResponse<City>> {
    const city = await this.cityService.create(createBody);

    return {
      success: true,
      data: city,
    };
  }

  @Get('getAll')
  async get(): Promise<IResponse<City[]>> {
    const cities = await this.cityService.getAll();

    return {
      success: true,
      data: cities,
    };
  }

  @Delete(':id')
  @AuthNeeded()
  @Roles(AccountRole.Admin)
  async remove(@Param('id') id: number): Promise<IResponseNoData> {
    await this.cityService.remove(id);

    return {
      success: true,
      message: CityMessage.CitySuccessfullyRemoved,
    };
  }
}
