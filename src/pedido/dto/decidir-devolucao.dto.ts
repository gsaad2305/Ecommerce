import { IsEnum } from 'class-validator';
import { STATUSDEVOLUCAO } from '../../../generated/prisma/enums.js';

export class DecidirDevolucaoDto {
  @IsEnum(STATUSDEVOLUCAO)
  decisao: (typeof STATUSDEVOLUCAO)['APROVADA'] | (typeof STATUSDEVOLUCAO)['RECUSADA'];
}
