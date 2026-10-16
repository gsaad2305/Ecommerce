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
import { CarrinhoService } from './carrinho.service.js';
import { AddItemCarrinhoDto } from './dto/add-item-carrinho.dto.js';
import { UpdateItemCarrinhoDto } from './dto/update-item-carrinho.dto.js';
import { RolesGuards } from '../common/guards/roles.guard.js';
import { Roles } from '../common/decorator/roles.decorator.js';
import { Role } from '../common/enums/roles.js';
import { AuthGuard } from '@nestjs/passport';
import type { AuthenticatedRequest } from '../auth/types/autenticated-request.js';

@UseGuards(AuthGuard('jwt'), RolesGuards)
@Roles(Role.USER)
@Controller('carrinho')
export class CarrinhoController {
  constructor(private readonly carrinhoService: CarrinhoService) {}

  @Get()
  getCarrinho(@Req() request: AuthenticatedRequest) {
    return this.carrinhoService.getCarrinhoUsuario(request.user.id);
  }

  @Post('items')
  adicionarItem(
    @Req() request: AuthenticatedRequest,
    @Body() addItemDto: AddItemCarrinhoDto,
  ) {
    return this.carrinhoService.adicionarItem(request.user.id, addItemDto);
  }

  @Patch('items/:itemId')
  atualizarQuantidade(
    @Req() request: AuthenticatedRequest,
    @Param('itemId') itemId: string,
    @Body() updateDto: UpdateItemCarrinhoDto,
  ) {
    return this.carrinhoService.atualizarQuantidadeItem(
      request.user.id,
      itemId,
      updateDto,
    );
  }

  @Delete('items/:itemId')
  removerItem(
    @Req() request: AuthenticatedRequest,
    @Param('itemId') itemId: string,
  ) {
    return this.carrinhoService.removerItem(request.user.id, itemId);
  }

  @Delete()
  limparCarrinho(@Req() request: AuthenticatedRequest) {
    return this.carrinhoService.limparCarrinho(request.user.id);
  }
}
