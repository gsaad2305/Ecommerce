import 'dotenv/config';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module.js';
import helmet from 'helmet';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  if(process.env.NODE_ENV === "production"){
    app.use(helmet()),
    app.enableCors({
      origin: "",
      methods: "GET, POST, PUT, PATCH, DELETE",
      credentials: true
    })
  }

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true
    }),
  );

  app.useSecurityHeaders({
    xFrameOptions: false
  });
  app.enableCsrfProtection();

  await app.listen(process.env.PORT ?? 3004);
}

await bootstrap();
