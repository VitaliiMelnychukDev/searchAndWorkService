import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { City } from '../entities/City';
import { CreateDto } from '../dtos/city/create.dto';
import { CityError } from '../types/error';

@Injectable()
export class CityService {
  constructor(
    @InjectRepository(City)
    private readonly cityRepository: Repository<City>,
  ) {}

  async create(createDto: CreateDto): Promise<City> {
    let city: City | null = null;
    try {
      city = await this.cityRepository.findOne({
        where: { title: createDto.title },
      });
    } catch {
      throw new BadRequestException(CityError.CreateCityFail);
    }

    if (city) {
      throw new BadRequestException(CityError.CityAlreadyExist);
    }

    const newCity = new City();
    newCity.title = createDto.title;

    try {
      return await this.cityRepository.save(newCity);
    } catch {
      throw new BadRequestException(CityError.CreateCityFail);
    }
  }

  async getAll(): Promise<City[]> {
    try {
      return await this.cityRepository.find();
    } catch {
      throw new BadRequestException(CityError.GetCityFail);
    }
  }

  async remove(cityId: number): Promise<void> {
    let city: City | null = null;

    try {
      city = await this.cityRepository.findOne({
        where: { id: cityId },
      });
    } catch {
      throw new BadRequestException(CityError.DeleteCityFail);
    }

    if (!city) {
      throw new NotFoundException(CityError.CityDoesNotExist);
    }

    try {
      await this.cityRepository.delete(city);
    } catch {
      throw new BadRequestException(CityError.DeleteCityFail);
    }
  }
}
