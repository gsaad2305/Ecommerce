import { Module } from '@nestjs/common';
import { PedidosService } from './pedidos.service.js';
import { PedidosController } from './pedidos.controller.js';

@Module({
  controllers: [PedidosController],
  providers: [PedidosService],
})
export class PedidosModule {}
