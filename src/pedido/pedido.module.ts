import { Module } from '@nestjs/common';
import { PedidoService } from './pedido.service.js';
import { PedidoController } from './pedido.controller.js';
import { PrismaModule } from '../database/prisma.module.js';

@Module({
  imports: [PrismaModule],
  controllers: [PedidoController],
  providers: [PedidoService],
})
export class PedidoModule {}
