import { IsInt, IsNotEmpty, IsPositive, IsUUID } from "class-validator";

export class AddItemCarrinhoDto {
  @IsUUID()
  @IsNotEmpty()
  produtoId: string;

  @IsInt()
  @IsPositive()
  quantidade: number;
}
