import { HttpService } from '@nestjs/axios';
import { BadRequestException, Injectable } from '@nestjs/common';
import { AxiosError, AxiosResponse } from 'axios';

const URL_CORREIOS = 'http://viacep.com.br/ws/35164056/json';

@Injectable()
export class CorreiosService {
  constructor(private readonly httpService: HttpService) {}

  async findAddressByCep(cep: string): Promise<AxiosResponse<any>> {
    return this.httpService.axiosRef.get(URL_CORREIOS.replace('{CEP}', cep))
    .then((result) => {
      return result.data;
    })
    .catch((error: AxiosError) => {
      throw new BadRequestException(
        `Error in connection request ${error.message}`
      )
    });
  }
}
