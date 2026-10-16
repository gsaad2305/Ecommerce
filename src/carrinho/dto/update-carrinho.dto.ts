import { PartialType } from '@nestjs/mapped-types';
import { CreateCarrinhoDto } from './create-carrinho.dto.js';

export class UpdateCarrinhoDto extends PartialType(CreateCarrinhoDto) {}
