import { IsNumber, IsString } from "class-validator";

export class CreateVendedorDto {
  @IsString()
  nomeLoja: string;

  @IsString()
  cnpj: string;

  @IsString()
  telefoneLoja: string;

  @IsString()
  cepLoja: string;
}
