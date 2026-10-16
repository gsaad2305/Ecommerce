import { IsArray, IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateProdutoDto {
  @IsString()
  @IsNotEmpty()
  nome: string;

  @IsString()
  @IsOptional()
  descricao?: string;

  @IsNumber()
  @IsNotEmpty()
  preco: number;

  @IsNumber()
  estoque: number;

  @IsArray()
  @IsString({ each: true })
  tags: string[];
}
