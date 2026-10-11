import { Decimal } from "@prisma/client/runtime/index-browser";
import { IsDate, IsDecimal, IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator";

export class CreateProdutoDto {
  @IsString()
  vendedorId: string;

  @IsString()
  @IsNotEmpty()
  nome: string;

  @IsString()
  @IsOptional()
  descricao: string;

  @IsDecimal()
  @IsNotEmpty()
  preco: Decimal;

  @IsNumber()
  estoque: number;

  @IsString()
  tags: string[];

  @IsDate()
  tempoEntrega: Date;



}
