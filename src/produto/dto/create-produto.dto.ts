import { Decimal } from "@prisma/client/runtime/index-browser";
import {  IsArray, IsDecimal, IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator";

export class CreateProdutoDto {

  @IsString()
  @IsNotEmpty()
  nome: string;

  @IsString()
  @IsOptional()
  descricao: string;

  @IsNumber()
  @IsNotEmpty()
  preco: number;

  @IsNumber()
  estoque: number;

  @IsArray()
  @IsString({each: true})
  tags: string[];



}
