import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as cookieParser from 'cookie-parser';
import helmet from 'helmet';
import { rateLimit } from 'express-rate-limit';
import * as dotenv from 'dotenv';
dotenv.config();

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.use(helmet());
  app.use(cookieParser());

  app.use(rateLimit({ windowMs: 15 * 60 * 1000, limit: 100 }));

  app.enableCors({
    origin: process.env.FRONTEND_ORIGIN,
    credentials: true,
  });

  await app.listen(Number(process.env.PORT) || 3000);
  console.log(`Backend running on ${Number(process.env.PORT) || 3000}`);
}
bootstrap();
