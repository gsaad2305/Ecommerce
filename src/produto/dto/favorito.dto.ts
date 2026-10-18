import { IsBoolean, IsNotEmpty, IsOptional, IsString } from "class-validator";

export class addFavorite {
  @IsString()
  @IsNotEmpty()
  produtoId: string

  @IsBoolean()
  @IsOptional()
  readonly favorito: boolean
}
