import { Module } from '@nestjs/common';
import { PagamentoService } from './pagamento.service.js';
import { PagamentoController } from './pagamento.controller.js';

@Module({
  controllers: [PagamentoController],
  providers: [PagamentoService],
})
export class PagamentoModule {}
