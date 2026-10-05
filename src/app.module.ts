import { Module } from '@nestjs/common';
import { createObserveModule } from '@nestjs/observe';
import { AppController } from './app.controller.js';
import { AppService } from './app.service.js';
import { ThrottlerModule } from '@nestjs/throttler';
import { UserModule } from './user/user.module.js';
import { HashingModule } from './auth/hashing/hashing.module.js';
import { AuthModule } from './auth/auth.module.js';
import { ConfigModule } from '@nestjs/config';
import jwtConfig from './auth/config/jwt.config.js';
import { APP_GUARD } from '@nestjs/core';

export const { ObserveModule, ObserveInstrument } = createObserveModule();
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [jwtConfig]
    }),
    ThrottlerModule.forRoot({
      throttlers:[
      {
        ttl: 600000,
        limit: 15,
      },
      ]
    }),
    UserModule,
    HashingModule,
    AuthModule
  ],
  controllers: [AppController],
  providers: [AppService,
    {
      provide: APP_GUARD,
      useClass: ThrottlerModule
    }
  ],
})
export class AppModule {}
