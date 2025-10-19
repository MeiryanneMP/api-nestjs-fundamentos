import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { addressEntity } from './entities/address.entity';
import { Repository } from 'typeorm';
import { CreateAddressDto } from './dtos/createAddress.dto';
import { UserService } from 'src/user/user.service';
import { CityService } from 'src/city/city.service';

@Injectable()
export class AddressService {
  constructor(
    @InjectRepository(addressEntity)
    private readonly addressRepository: Repository<addressEntity>,
    private readonly userService: UserService,
    private readonly cityService: CityService,
  ){}

  async createAddress(
    createAddressDto: CreateAddressDto,
    userId: number,
  ): Promise<addressEntity> {
    await this.userService.findUserById(userId);
    await this.cityService.findCityById(createAddressDto.cityId);
    
    return this.addressRepository.save({
      ...createAddressDto,
      userId,
    });
  }
}
