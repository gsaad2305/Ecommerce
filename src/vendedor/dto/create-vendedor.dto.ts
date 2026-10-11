import { IsNumber, IsString } from "class-validator";

export class CreateVendedorDto {
  @IsString()
  nomeLoja: string;

  @IsString()
  cnpj: string;

  @IsNumber()
  telefoneLoja: number;

  @IsString()
  cepLoja: string;
}
