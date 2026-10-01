import { Module } from '@nestjs/common';
import { UserService } from './user.service.js';
import { UserController } from './user.controller.js';
import { PrismaModule } from '../database/prisma.module.js';
import { HashingModule } from '../auth/hashing/hashing.module.js';

@Module({
  imports:[PrismaModule, HashingModule],
  controllers: [UserController],
  providers: [UserService],
})
export class UserModule {}
