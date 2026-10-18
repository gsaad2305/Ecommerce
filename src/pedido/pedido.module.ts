import { Module } from '@nestjs/common';
import { PedidoService } from './pedido.service.js';
import { PedidoController } from './pedido.controller.js';

@Module({
  controllers: [PedidoController],
  providers: [PedidoService],
})
export class PedidoModule {}
