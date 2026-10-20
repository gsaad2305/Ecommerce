import { IsInt, IsNotEmpty, IsPositive, IsString } from 'class-validator';

export class SolicitarDevolucaoDto {
  @IsString()
  @IsNotEmpty()
  itemPedidoId: string;

  @IsInt()
  @IsPositive()
  quantidade: number;

  @IsString()
  @IsNotEmpty()
  motivo: string;
}
