import { Module } from '@nestjs/common';
import { createObserveModule } from '@nestjs/observe';
import { AppController } from './app.controller.js';
import { AppService } from './app.service.js';
import { ThrottlerModule } from '@nestjs/throttler';
import { UserModule } from './user/user.module.js';
import { AuthModule } from './auth/auth.module.js';
import { HashingModule } from './auth/hashing/hashing.module.js';

export const { ObserveModule, ObserveInstrument } = createObserveModule();
@Module({
  imports: [
    ThrottlerModule.forRoot({
      throttlers:[
      {
        ttl: 600000,
        limit: 15,
      },
      ]
    }),
    UserModule,
    AuthModule,
    HashingModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
