import { Module } from '@nestjs/common';
import { AuthService } from './auth.service.js';
import { AuthController } from './auth.controller.js';
import { JwtStrategy } from './jwt.strategy.js';
import { PrismaModule } from '../database/prisma.module.js';
import { HashingModule } from './hashing/hashing.module.js';
import { ConfigModule } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import jwtConfig from './config/jwt.config.js';

@Module({
  imports: [
    PrismaModule,
    HashingModule,
    ConfigModule,
    JwtModule.registerAsync({
      imports:[ConfigModule],
      inject:[jwtConfig.KEY],
      useFactory: (config: ReturnType<typeof jwtConfig>)=>({
        secret: config.secret,
        signOptions: {
          expiresIn: config.jwtttl,
          issuer: config.issuer,
          audience: config.audience,
        }
      })
    })
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy],
})
export class AuthModule {}
