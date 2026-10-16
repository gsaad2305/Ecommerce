import { Module } from '@nestjs/common';
import { CarrinhoService } from './carrinho.service.js';
import { CarrinhoController } from './carrinho.controller.js';
import { PrismaModule } from '../database/prisma.module.js';
@Module({
  imports: [PrismaModule],
  controllers: [CarrinhoController],
  providers: [CarrinhoService],
})
export class CarrinhoModule {}
