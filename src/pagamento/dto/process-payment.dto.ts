import { IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { METODOPAGAMENTO } from '../../../generated/prisma/client.js';

export class ProcessPaymentDto {
  @IsEnum(METODOPAGAMENTO, {
    message: 'metodoPagamento deve ser PIX, CARTAO_CREDITO ou CARTAO_DEBITO',
  })
  @IsNotEmpty({ message: 'metodoPagamento é obrigatório' })
  metodoPagamento: METODOPAGAMENTO;

  @IsOptional()
  @IsString()
  numeroCartao?: string;

  @IsOptional()
  @IsString()
  titularCartao?: string;

  @IsOptional()
  @IsString()
  expiracaoCartao?: string;

  @IsOptional()
  @IsString()
  cvvCartao?: string;
}
