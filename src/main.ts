import { Logger } from '@nestjs/common';
import { HttpAdapterHost, NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { PrismaClientExceptionFilter } from './filters/prisma-exception.filter';
import { ValidationPipe } from './pipes/validation.pipe';

async function bootstrap() {
  const logger = new Logger('main');
  const app = await NestFactory.create(AppModule);

  app.enableCors({ credentials: true, origin: true });

  app.useGlobalPipes(new ValidationPipe());
  app.setGlobalPrefix('api');

  const { httpAdapter } = app.get(HttpAdapterHost);
  app.useGlobalFilters(new PrismaClientExceptionFilter(httpAdapter));

  const swaggerConfig = new DocumentBuilder()
    .setTitle('mkgroup API')
    .setDescription('mkgroup')
    .setVersion('1.0.1')
    .addTag('APP')
    .build();
  const swaggerDocument = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup('api/docs', app, swaggerDocument, {
    swaggerOptions: {
      tagsSorter: 'alpha',
      operationsSorter: 'alpha',
    },
  });
  const PORT = process.env.PORT || 5000;
  await app.listen(PORT, () => {
    logger.log(`Server is running on port: ${PORT}`);
  });
}
bootstrap();
