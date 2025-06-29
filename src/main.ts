import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { AllExceptionsFilter } from './common/filters/http-exception.filter';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  
  app.useGlobalFilters(new AllExceptionsFilter());

  
  app.enableCors();

  
  const config = new DocumentBuilder()
    .setTitle('Book Review API')
    .setDescription('REST endpoints to manage books & reviews')
    .setVersion('1.0')
    .addTag('books')
    .addTag('reviews')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  await app.listen(process.env.PORT || 3000);
}
bootstrap();
