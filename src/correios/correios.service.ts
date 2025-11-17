import { HttpService } from '@nestjs/axios';
import { BadRequestException, Injectable } from '@nestjs/common';
import { AxiosError } from 'axios';
import { ReturnCepExternalDto } from './dtos/return-cep-external.dto';
import { CityService } from 'src/city/city.service';

const URL_CORREIOS = 'http://viacep.com.br/ws/35164056/json';

@Injectable()
export class CorreiosService {
  constructor(
    private readonly httpService: HttpService,
    private readonly cityService: CityService,
  ) {}

  async findAddressByCep(cep: string): Promise<ReturnCepExternalDto> {
    const returnCep: ReturnCepExternalDto = await this.httpService.axiosRef
      .get<ReturnCepExternalDto>(URL_CORREIOS.replace('{CEP}', cep))
      .then((result) => {
        return result.data;
      })
      .catch((error: AxiosError) => {
        throw new BadRequestException(
          `Error in connection request ${error.message}`
        )
      });
    

    const city = await this.cityService.findCityByName(
      returnCep.localidade,
      returnCep.uf,
    );
    
    return returnCep;
  }
}
