import { addressEntity } from '../entities/address.entity';

export class ReturnAddressDto {
  complement: string;
  numberAddress: number;
  cep: string;

  constructor(address: addressEntity){
    this.complement = address.complement;
    this.cep = address.cep;
    this.numberAddress = address.number;
  }
}