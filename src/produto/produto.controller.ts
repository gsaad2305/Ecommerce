import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Req} from '@nestjs/common';
import { ProdutoService } from './produto.service.js';
import { CreateProdutoDto } from './dto/create-produto.dto.js';
import { UpdateProdutoDto } from './dto/update-produto.dto.js';
import { AuthGuard } from '@nestjs/passport';
import type { AuthenticatedRequest } from '../auth/types/autenticated-request.js';
import { RolesGuards } from '../common/guards/roles.guard.js';
import { Roles } from '../common/decorator/roles.decorator.js';
import { Role } from '../common/enums/roles.js';

@Controller('produto')
export class ProdutoController {
  constructor(private readonly produtoService: ProdutoService) {}

  @UseGuards(AuthGuard('jwt'), RolesGuards)
  @Roles(Role.SALLER)
  @Post()
  create(@Req() request: AuthenticatedRequest,@Body() createProdutoDto: CreateProdutoDto,) {
    return this.produtoService.criarProduto(createProdutoDto, request.user.id);
  }

  @Get()
  findAll() {
    return this.produtoService.todosProdutos();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.produtoService.encontrarProduto(id);
  }

  @UseGuards(AuthGuard('jwt'), RolesGuards)
  @Roles(Role.SALLER)
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateProdutoDto: UpdateProdutoDto, @Req() request: AuthenticatedRequest) {
    return this.produtoService.atualizarProduto(id, updateProdutoDto, request.user.id );
  }

  @UseGuards(AuthGuard('jwt'))
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.produtoService.deletarProduto(id);
  }
}
