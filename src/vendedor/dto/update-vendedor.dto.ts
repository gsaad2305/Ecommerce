import { PartialType } from '@nestjs/mapped-types';
import { CreateVendedorDto } from './create-vendedor.dto.js';
import { IsOptional } from 'class-validator';

export class UpdateVendedorDto extends PartialType(CreateVendedorDto) {
  @IsOptional()
  cepLoja?: string;
  nomeLoja?: string;
  telefoneLoja?: string;
}
