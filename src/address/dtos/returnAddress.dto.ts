import { ReturnCityDto } from 'src/city/dtos/returnCity.dto';
import { addressEntity } from '../entities/address.entity';

export class ReturnAddressDto {
  complement: string;
  numberAddress: number;
  cep: string;
  city?: ReturnCityDto;

  constructor(address: addressEntity){
    this.complement = address.complement;
    this.cep = address.cep;
    this.numberAddress = address.number;
    this.city = address.city ? new ReturnCityDto(address.city): undefined;
  }
}