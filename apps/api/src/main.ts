import { Logger, ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import cookieParser from 'cookie-parser';
import helmet from 'helmet';
import { AppModule } from './app/app.module';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  const configService = app.get(ConfigService);

  app.use(helmet());

  app.use(cookieParser(configService.get<string>('COOKIE_SECRET')));

  const corsOrigins = (configService.get('CORS_ORIGINS') || '')
    .split(',')
    .filter((v: string) => !!v.trim());

  if (corsOrigins.length) {
    app.enableCors({
      origin: (configService.get('CORS_ORIGINS') || '').split(','),
      credentials: true,
    });
  } else {
    app.enableCors({ credentials: true });
  }

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
    })
  );

  const port = process.env.PORT || 3000;
  await app.listen(port);
  Logger.log(`🚀 Application is running on: http://localhost:${port}`);
}

bootstrap();
