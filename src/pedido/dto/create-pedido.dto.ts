import { IsUUID, IsEnum, IsDate } from "class-validator";
import { STATUSPEDIDO } from "../../../generated/prisma/enums.js";

export class CreatePedidoDto {
  @IsUUID()
  userId: string;

  @IsEnum(STATUSPEDIDO)
  status: STATUSPEDIDO;

}
