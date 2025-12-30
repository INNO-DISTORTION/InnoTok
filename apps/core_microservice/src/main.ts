import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Global validation pipe
<<<<<<< HEAD
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,
    forbidNonWhitelisted: true,
    transform: true,
  }));
=======
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );
>>>>>>> d2fe01e01f7beb54a8417a4612a3f926d0251227

  // CORS configuration
  app.enableCors({
    origin: process.env.CLIENT_URL || 'http://localhost:3000',
    credentials: true,
  });

  // Swagger documentation
  const config = new DocumentBuilder()
    .setTitle('Innogram Core API')
<<<<<<< HEAD
    .setDescription('Core Microservice API for Innogram Social Media Application')
    .setVersion('1.0')
    .addBearerAuth()
    .build();
  
=======
    .setDescription(
      'Core Microservice API for Innogram Social Media Application',
    )
    .setVersion('1.0')
    .addBearerAuth()
    .build();

>>>>>>> d2fe01e01f7beb54a8417a4612a3f926d0251227
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document);

  const port = process.env.PORT || 3001;
  await app.listen(port);
<<<<<<< HEAD
  
  console.log(`Core Microservice running on port ${port}`);
  console.log(`API Documentation available at http://localhost:${port}/api/docs`);
=======

  console.log(`Core Microservice running on port ${port}`);
  console.log(
    `API Documentation available at http://localhost:${port}/api/docs`,
  );
>>>>>>> d2fe01e01f7beb54a8417a4612a3f926d0251227
}

bootstrap();
