import { IsInt, IsPositive } from "class-validator";

export class UpdateItemCarrinhoDto {
  @IsInt()
  @IsPositive()
  quantidade: number;
}
