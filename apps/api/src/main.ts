import { NestFactory, } from '@nestjs/core';
import { Logger, ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import helmet from 'helmet';
import { AppModule } from './app.module';
import { HttpExceptionFilter } from './common/filters/http-exception.filter';

const logger = new Logger('Bootstrap');

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { bufferLogs: true });

  // Security
  app.use(helmet());

  // CORS
  const corsOrigin = process.env['CORS_ORIGIN'];
  const isProduction = process.env['NODE_ENV'] === 'production';

  if (isProduction && !corsOrigin) {
    throw new Error('CORS_ORIGIN environment variable is required in production');
  }

  app.enableCors({
    origin: corsOrigin ?? '*',
    methods: ['GET', 'POST', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  });

  // Global pipes & filters
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );
  app.useGlobalFilters(new HttpExceptionFilter());

  // Swagger (dev only)
  if (!isProduction) {
    const config = new DocumentBuilder()
      .setTitle('AI모두 계산기 API')
      .setDescription('금융 계산기 REST API')
      .setVersion('1.0')
      .build();
    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('docs', app, document);
  }

  const port = process.env['PORT'] ?? 3001;
  await app.listen(port);
  logger.log(`API listening on port ${port}`);
}

bootstrap();
