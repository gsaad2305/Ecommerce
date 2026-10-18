import { PartialType } from '@nestjs/mapped-types';
import { CreatePedidoDto } from './create-pedido.dto.js';

export class UpdatePedidoDto extends PartialType(CreatePedidoDto) {}
