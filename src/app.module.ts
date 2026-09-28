import { Module } from '@nestjs/common';
import { createObserveModule } from '@nestjs/observe';
import { AppController } from './app.controller.js';
import { AppService } from './app.service.js';
import { ThrottlerModule } from '@nestjs/throttler';
import { UserModule } from './user/user.module.js';
import { AuthModule } from './auth/auth.module.js';
import { ProdutosModule } from './produtos/produtos.module.js';
import { PedidosModule } from './pedidos/pedidos.module.js';
import { PagamentoModule } from './pagamento/pagamento.module.js';
import { VendedorModule } from './vendedor/vendedor.module.js';
import { PagamentoModule } from './pagamento/pagamento.module.js';
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
    // Distributed tracing, auto-correlated logs, request/job metrics, error
    // telemetry, alarms, and more — out of the box. Sign up at https://observe.nestjs.com
    ObserveModule.forRoot({
      appKey: 'YOUR_APP_KEY',
      appSecret: 'YOUR_APP_SECRET',
      serviceId: 'ecomerce',
    }),
    UserModule,
    AuthModule,
    ProdutosModule,
    PedidosModule,
    PagamentoModule,
    VendedorModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
