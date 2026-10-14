import { PartialType } from '@nestjs/mapped-types';
import { CreateProdutoDto } from './create-produto.dto.js';
import { IsOptional } from 'class-validator';

export class UpdateProdutoDto extends PartialType(CreateProdutoDto) {
  @IsOptional()
  nome?: string;

  @IsOptional()
  descricao?: string;

  @IsOptional()
  preco?: number;

  @IsOptional()
  quantidade?: number;
}
