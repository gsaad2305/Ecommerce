import { Module } from '@nestjs/common';
import { VendedorService } from './vendedor.service.js';
import { VendedorController } from './vendedor.controller.js';

@Module({
  controllers: [VendedorController],
  providers: [VendedorService],
})
export class VendedorModule {}
