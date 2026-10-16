import { IsNotEmpty, IsOptional, IsString } from "class-validator";

export class CreateEnderecoDto {
  @IsString()
  @IsNotEmpty()
  cep: string;

  @IsString()
  @IsNotEmpty()
  rua: string;

  @IsString()
  @IsNotEmpty()
  numero: string;

  @IsString()
  @IsNotEmpty()
  cidade: string;

  @IsString()
  @IsNotEmpty()
  bairro: string;

  @IsString()
  @IsOptional()
  complemento: string

  @IsString()
  @IsNotEmpty()
  estado: string;
}
