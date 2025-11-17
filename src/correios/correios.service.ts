import { HttpService } from '@nestjs/axios';
import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { AxiosError } from 'axios';
import { ReturnCepExternalDto } from './dtos/return-cep-external.dto';
import { CityService } from 'src/city/city.service';
import { CityEntity } from 'src/city/entities/city.entity';
import { ReturnCepDto } from './dtos/return-cep.dto';
import { Client } from 'nestjs-soap';
import { CdFormatEnum } from './enums/cd-format.enum';
import { SizeProductDto } from './dtos/size-product.dto';

const URL_CORREIOS = 'http://viacep.com.br/ws/35164056/json';

@Injectable()
export class CorreiosService {
  constructor(
    @Inject('SOAP_CORREIOS') private readonly soapClient: Client,
    private readonly httpService: HttpService,
    private readonly cityService: CityService,
  ) {}

  async findAddressByCep(cep: string): Promise<ReturnCepDto> {
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
    

    const city: CityEntity | undefined = await this.cityService
      .findCityByName(returnCep.localidade, returnCep.uf)
      .catch(() => undefined);
    
    return new ReturnCepDto(returnCep, city?.id, city?.state?.id);
  }

  async priceDelivery(
    cdService: string,
    cep: string,
    sizeProduct: SizeProductDto,
  ): Promise<any> {
    return new Promise((resolve, reject) => {
      this.soapClient.CalcPrecoPrazo(

        {
          nCdServico: cdService,
          sCepOrigem: '01029010',
          sCepDestino: cep,
          nCdFormato:CdFormatEnum.BOX,
          nVlPeso:sizeProduct.weight,
          nVlComprimento:sizeProduct.length,
          nVlAltura:sizeProduct.height,
          nVlLargura:sizeProduct.width,
          nVlDiamento:sizeProduct.diameter,
          nCdEmpresa:'',
          sDsSenha:'',
          sCdMaoPropria:'N',
          nVlValorDeclarado: sizeProduct.productValue < 25 ? 0 : sizeProduct.productValue,
          sCdAvisoRecebimento: 'N',
        },

        (err, res) => {
        if (res) {
          resolve(res);
        } else{
          reject(err);
        }
      });
    });
  }
}
