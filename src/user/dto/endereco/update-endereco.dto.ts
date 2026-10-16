import { PartialType } from "@nestjs/mapped-types";
import { CreateEnderecoDto } from "./add-endereco.dto.js";
import { IsOptional, IsString } from "class-validator";

export class UpdateEnderecoDto extends PartialType(CreateEnderecoDto) {
  @IsOptional()
  @IsString()
  cep: string;

  @IsString()
  @IsOptional()
  rua: string;

  @IsString()
  @IsOptional()
  numero: string;

  @IsString()
  @IsOptional()
  bairro: string;

  @IsString()
  @IsOptional()
  cidade: string;

  @IsString()
  @IsOptional()
  estado: string;
}
