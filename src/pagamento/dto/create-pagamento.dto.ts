import { IsEnum } from "class-validator";
import { METODOPAGAMENTO } from "../../../generated/prisma/enums.js";

export class CreatePagamentoDto {
  @IsEnum(METODOPAGAMENTO)
  type: METODOPAGAMENTO;
}
