import { IsEnum, IsNotEmpty, IsUUID } from 'class-validator';
import { METODOPAGAMENTO } from '../../../generated/prisma/client.js';

export class CreatePagamentoDto {
  @IsUUID('4', { message: 'pedidoId deve ser um UUID válido' })
  @IsNotEmpty({ message: 'pedidoId é obrigatório' })
  pedidoId: string;

  @IsEnum(METODOPAGAMENTO, {
    message: 'metodoPagamento deve ser PIX, CARTAO_CREDITO ou CARTAO_DEBITO',
  })
  @IsNotEmpty({ message: 'metodoPagamento é obrigatório' })
  metodoPagamento: METODOPAGAMENTO;
}
