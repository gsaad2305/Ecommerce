import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  UseGuards,
  Req,
} from '@nestjs/common';
import { PedidoService } from './pedido.service.js';
import { SolicitarDevolucaoDto } from './dto/solicitar-devolucao.dto.js';
import { DecidirDevolucaoDto } from './dto/decidir-devolucao.dto.js';
import { AuthGuard } from '@nestjs/passport';
import type { AuthenticatedRequest } from '../auth/types/autenticated-request.js';
import { RolesGuards } from '../common/guards/roles.guard.js';
import { Roles } from '../common/decorator/roles.decorator.js';
import { Role } from '../common/enums/roles.js';

@Controller('pedido')
@UseGuards(AuthGuard('jwt'))
export class PedidoController {
  constructor(private readonly pedidoService: PedidoService) {}
  @Get('meus-pedidos')
  findMeusPedidos(@Req() req: AuthenticatedRequest) {
    return this.pedidoService.findMeusPedidos(req.user.id);
  }

  @Get(':id')
  findOnePedido(
    @Param('id') id: string,
    @Req() req: AuthenticatedRequest,
  ) {
    return this.pedidoService.findOnePedido(id, req.user.id);
  }

  @Post('devolucao')
  solicitarDevolucao(
    @Req() req: AuthenticatedRequest,
    @Body() dto: SolicitarDevolucaoDto,
  ) {
    return this.pedidoService.solicitarDevolucao(req.user.id, dto);
  }

  @Get('vendedor/devolucoes')
  @UseGuards(RolesGuards)
  @Roles(Role.SALLER)
  findDevolucoesVendedor(@Req() req: AuthenticatedRequest) {
    return this.pedidoService.findDevolucoesVendedor(req.user.id);
  }

  @Patch('devolucao/:id/decidir')
  @UseGuards(RolesGuards)
  @Roles(Role.SALLER)
  decidirDevolucao(
    @Param('id') id: string,
    @Req() req: AuthenticatedRequest,
    @Body() dto: DecidirDevolucaoDto,
  ) {
    return this.pedidoService.decidirDevolucao(id, req.user.id, dto);
  }
}
