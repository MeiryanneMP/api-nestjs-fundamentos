import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { addressEntity } from './entities/address.entity';
import { Repository } from 'typeorm';
import { CreateAddressDto } from './dtos/createAddress.dto';

@Injectable()
export class AddressService {
  constructor(
    @InjectRepository(addressEntity)
    private readonly addressRepository: Repository<addressEntity>,
  ){}

  async createAddress(createAddressDto: CreateAddressDto, userId: number): Promise<addressEntity>{
    return this.addressRepository.save({
      ...createAddressDto,
      userId,
    });
  }
}
