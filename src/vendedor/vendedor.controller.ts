import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Delete,
  UseGuards,
  Req,
} from '@nestjs/common';
import { VendedorService } from './vendedor.service.js';
import { CreateVendedorDto } from './dto/create-vendedor.dto.js';
import { UpdateVendedorDto } from './dto/update-vendedor.dto.js';
import type { AuthenticatedRequest } from '../auth/types/autenticated-request.js';
import { AuthGuard } from '@nestjs/passport';
import { Roles } from '../common/decorator/roles.decorator.js';
import { Role } from '../common/enums/roles.js';
import { RolesGuards } from '../common/guards/roles.guard.js';

@Controller()
export class VendedorController {
  constructor(private readonly vendedorService: VendedorService) {}

  @UseGuards(AuthGuard('jwt'))
  @Post('criar-conta-vendedor')
  create(
    @Body() createVendedorDto: CreateVendedorDto,
    @Req() request: AuthenticatedRequest,
  ) {
    return this.vendedorService.create(createVendedorDto, request.user.id);
  }

  @UseGuards(AuthGuard('jwt'), RolesGuards)
  @Roles(Role.SALLER)
  @Get('lojas')
  findAll() {
    return this.vendedorService.findAll();
  }

  @UseGuards(AuthGuard('jwt'), RolesGuards)
  @Roles(Role.SALLER)
  @Get('loja')
  findByUserId(@Req() request: AuthenticatedRequest) {
    return this.vendedorService.findByUserId(request.user.id);
  }

  @UseGuards(AuthGuard('jwt'), RolesGuards)
  @Roles(Role.SALLER)
  @Patch('loja')
  update(
    @Req() request: AuthenticatedRequest,
    @Body() updateVendedorDto: UpdateVendedorDto,
  ) {
    return this.vendedorService.update(request.user.id, updateVendedorDto);
  }

  @UseGuards(AuthGuard('jwt'), RolesGuards)
  @Roles(Role.SALLER)
  @Delete('loja')
  remove(@Req() request: AuthenticatedRequest) {
    return this.vendedorService.remove(request.user.id);
  }
}
