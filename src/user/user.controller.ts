import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Req,
} from '@nestjs/common';
import { UserService } from './user.service.js';
import { CreateUserDto } from './dto/cliente/create-user.dto.js';
import { UpdateUserDto } from './dto/cliente/update-user.dto.js';
import { AuthGuard } from '@nestjs/passport';
import type { AuthenticatedRequest } from '../auth/types/autenticated-request.js';
import { CreateEnderecoDto } from './dto/endereco/add-endereco.dto.js';
import { RolesGuards } from '../common/guards/roles.guard.js';
import { Roles } from '../common/decorator/roles.decorator.js';
import { Role } from '../common/enums/roles.js';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('registrar')
  create(@Body() createUserDto: CreateUserDto) {
    return this.userService.create(createUserDto);
  }

  @UseGuards(AuthGuard('jwt'), RolesGuards)
  @Roles(Role.USER)
  @Post('endereco')
  createAddress(
    @Body() createEnderecoDto: CreateEnderecoDto,
    @Req() request: AuthenticatedRequest,
  ) {
    return this.userService.createAddress(createEnderecoDto, request.user.id);
  }


  @UseGuards(AuthGuard('jwt'), RolesGuards)
  @Roles(Role.USER)
  @Get()
  findByUserId(@Req() request: AuthenticatedRequest) {
    return this.userService.findByUserId(request.user.id);
  }

  @UseGuards(AuthGuard('jwt'), RolesGuards)
  @Roles(Role.USER)
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.userService.update(id, updateUserDto);
  }

  @UseGuards(AuthGuard('jwt'), RolesGuards)
  @Roles(Role.USER)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.userService.remove(id);
  }
}
