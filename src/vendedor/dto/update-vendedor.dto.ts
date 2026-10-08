import { PartialType } from '@nestjs/mapped-types';
import { CreateVendedorDto } from './create-vendedor.dto.js';

export class UpdateVendedorDto extends PartialType(CreateVendedorDto) {}
