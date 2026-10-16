import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  UseGuards,
  Req,
} from '@nestjs/common';
import { PagamentoService } from './pagamento.service.js';
import { ProcessPaymentDto } from './dto/process-payment.dto.js';
import { CreatePagamentoDto } from './dto/create-pagamento.dto.js';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuards } from '../common/guards/roles.guard.js';
import { Roles } from '../common/decorator/roles.decorator.js';
import { Role } from '../common/enums/roles.js';
import type { AuthenticatedRequest } from '../auth/types/autenticated-request.js';

@UseGuards(AuthGuard('jwt'), RolesGuards)
@Roles(Role.USER)
@Controller('pagamento')
export class PagamentoController {
  constructor(private readonly pagamentoService: PagamentoService) {}

  @Post('checkout')
  checkout(
    @Req() request: AuthenticatedRequest,
    @Body() processPaymentDto: ProcessPaymentDto,
  ) {
    return this.pagamentoService.checkout(request.user.id, processPaymentDto);
  }

  @Post('processar')
  processPayment(
    @Req() request: AuthenticatedRequest,
    @Body() createPagamentoDto: CreatePagamentoDto,
  ) {
    return this.pagamentoService.processExistingOrderPayment(
      request.user.id,
      createPagamentoDto,
    );
  }

  @Get()
  findAll(@Req() request: AuthenticatedRequest) {
    return this.pagamentoService.findAll(request.user.id);
  }

  @Get(':id')
  findById(@Param('id') id: string, @Req() request: AuthenticatedRequest) {
    return this.pagamentoService.findById(id, request.user.id);
  }
}
