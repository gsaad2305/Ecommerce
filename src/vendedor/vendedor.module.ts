import { Module } from '@nestjs/common';
import { VendedorService } from './vendedor.service.js';
import { VendedorController } from './vendedor.controller.js';
import { PrismaModule } from '../database/prisma.module.js';
import { AuthModule } from '../auth/auth.module.js';

@Module({
  imports: [PrismaModule, AuthModule],
  controllers: [VendedorController],
  providers: [VendedorService],
})
export class VendedorModule {}
