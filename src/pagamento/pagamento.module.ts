import { Module } from '@nestjs/common';
import { PagamentoService } from './pagamento.service.js';
import { PagamentoController } from './pagamento.controller.js';
import { PrismaModule } from '../database/prisma.module.js';

@Module({
  imports: [PrismaModule],
  controllers: [PagamentoController],
  providers: [PagamentoService],
  exports: [PagamentoService],
})
export class PagamentoModule {}
