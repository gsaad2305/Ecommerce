import { PartialType } from '@nestjs/mapped-types';
import { CreatePagamentoDto } from './create-pagamento.dto.js';

export class UpdatePagamentoDto extends PartialType(CreatePagamentoDto) {}
