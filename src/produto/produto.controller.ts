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
  Query,
} from '@nestjs/common';
import { ProdutoService } from './produto.service.js';
import { CreateProdutoDto } from './dto/create-produto.dto.js';
import { UpdateProdutoDto } from './dto/update-produto.dto.js';
import { AuthGuard } from '@nestjs/passport';
import type { AuthenticatedRequest } from '../auth/types/autenticated-request.js';
import { RolesGuards } from '../common/guards/roles.guard.js';
import { Roles } from '../common/decorator/roles.decorator.js';
import { Role } from '../common/enums/roles.js';
import { addFavorite } from './dto/favorito.dto.js';

@Controller('produto')
export class ProdutoController {
  constructor(private readonly produtoService: ProdutoService) {}

  @UseGuards(AuthGuard('jwt'), RolesGuards)
  @Roles(Role.SALLER)
  @Post()
  create(
    @Req() request: AuthenticatedRequest,
    @Body() createProdutoDto: CreateProdutoDto,
  ) {
    return this.produtoService.create(createProdutoDto, request.user.id);
  }

  @UseGuards(AuthGuard('jwt'))
  @Get()
  findAll(@Query("nome") nome?: string) {
    return this.produtoService.findAll(nome);
  }

  @UseGuards(AuthGuard('jwt'), RolesGuards)
  @Roles(Role.USER)
  @Patch('add-favorite')
  addFavorite(@Body() addFavorite: addFavorite, @Req() request: AuthenticatedRequest) {
    return this.produtoService.addFavorite(addFavorite, request.user.id);
  }

  @UseGuards(AuthGuard('jwt'), RolesGuards)
  @Roles(Role.USER)
  @Get('all-favorites')
  findAllFavorites(@Req() request: AuthenticatedRequest) {
    return this.produtoService.findAllFavorites(request.user.id);
  }

  @UseGuards(AuthGuard('jwt'))
  @Get(':id')
  findById(@Param('id') id: string) {
    return this.produtoService.findById(id);
  }

  @UseGuards(AuthGuard('jwt'), RolesGuards)
  @Roles(Role.SALLER)
  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateProdutoDto: UpdateProdutoDto,
    @Req() request: AuthenticatedRequest,
  ) {
    return this.produtoService.update(id, updateProdutoDto, request.user.id);
  }

  @UseGuards(AuthGuard('jwt'))
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.produtoService.remove(id);
  }
}
