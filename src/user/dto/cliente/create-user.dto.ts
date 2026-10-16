import {IsEmail, IsEnum, IsNotEmpty, IsNumber, IsString} from 'class-validator'

export class CreateUserDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsNumber()
  @IsNotEmpty()
  telefone: number;

  @IsString()
  @IsNotEmpty()
  password: string;

}
