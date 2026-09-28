import {IsEmail, IsEnum, IsNotEmpty, IsNumber, IsString} from 'class-validator'
import { TIPOPESSOA } from '../../../generated/prisma/enums.js';

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

  @IsEnum(TIPOPESSOA)
  type: TIPOPESSOA;
  
  @IsString()
  @IsNotEmpty()
  password: string;

}
