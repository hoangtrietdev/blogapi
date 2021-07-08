import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix('api');

  const options = new DocumentBuilder()
    .setTitle('In-House Tool API')
    .setDescription('Powered by GearInc')
    .setVersion('0.1.0')
    .build();

  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup('api', app, document);

  await app.listen(3001, () => {
    Logger.log(
      `🚀 API server listenning on http://localhost:${3001}/api`,
      'Bootstrap',
    );
  });
}
bootstrap();
