import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Req } from '@nestjs/common';
import { VendedorService } from './vendedor.service.js';
import { CreateVendedorDto } from './dto/create-vendedor.dto.js';
import { UpdateVendedorDto } from './dto/update-vendedor.dto.js';
import { AutoTokenGuard } from '../auth/guards/auth.guard.js';
import type { AuthenticatedRequest } from '../auth/types/autenticated-request.js';
import { AuthGuard } from '@nestjs/passport';

@Controller('vendedor')
export class VendedorController {
  constructor(private readonly vendedorService: VendedorService) {}
  @UseGuards(AuthGuard('jwt'))
  @Post()
  create(@Body() createVendedorDto: CreateVendedorDto, @Req() request: AuthenticatedRequest) {
    return this.vendedorService.criarContaVendedor(createVendedorDto, request.user.id);
  }
  @UseGuards(AuthGuard('jwt'))
  @Get()
  findAll() {
    return this.vendedorService.verificarContaVendedor();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.vendedorService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateVendedorDto: UpdateVendedorDto) {
    return this.vendedorService.update(+id, updateVendedorDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.vendedorService.remove(+id);
  }
}
