import { IsNotEmpty, IsUUID } from 'class-validator';

export class CreateCarrinhoDto {
  @IsUUID()
  @IsNotEmpty()
  userId: string;
}
