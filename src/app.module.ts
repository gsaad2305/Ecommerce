import { Module } from '@nestjs/common';
import { createObserveModule } from '@nestjs/observe';
import { AppController } from './app.controller.js';
import { AppService } from './app.service.js';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { UserModule } from './user/user.module.js';
import { HashingModule } from './auth/hashing/hashing.module.js';
import { AuthModule } from './auth/auth.module.js';
import { ConfigModule } from '@nestjs/config';
import jwtConfig from './auth/config/jwt.config.js';
import { APP_GUARD } from '@nestjs/core';
import { ProdutoModule } from './produto/produto.module.js';
import { VendedorModule } from './vendedor/vendedor.module.js';
import { CarrinhoModule } from './carrinho/carrinho.module.js';
import { PagamentoModule } from './pagamento/pagamento.module.js';
import { PedidoModule } from './pedido/pedido.module.js';

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
        ttl: 10000,
        limit: 15,
        blockDuration: 60000
      },
      ]
    }),
    UserModule,
    HashingModule,
    AuthModule,
    ProdutoModule,
    VendedorModule,
    CarrinhoModule,
    PagamentoModule,
    PedidoModule
  ],
  controllers: [AppController],
  providers: [AppService,
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard
    }
  ],
})
export class AppModule {}
