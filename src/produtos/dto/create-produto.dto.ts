import { IsNotEmpty, IsNumber, IsString } from "class-validator";

export class CreateProdutoDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsNumber()
  preco: number;

  @IsNotEmpty()
  @IsNumber()
  estoque: number;

  @IsNotEmpty()
  @IsString()
  descricao: string;

  @IsNotEmpty()
  tags: []

}
