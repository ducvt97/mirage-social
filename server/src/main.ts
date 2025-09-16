import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { BadRequestException, ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { STATUS_CODES } from 'http';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      exceptionFactory: (errors) => {
        const error = errors.reduce(
          (res, error) => ({
            ...res,
            [error.property]:
              error.constraints[Object.keys(error.constraints)[0]],
          }),
          {},
        );
        return new BadRequestException({
          data: null,
          message: STATUS_CODES[400],
          error,
          success: false,
          status: 400,
        });
      },
    }),
  );
  app.enableCors();

  // Swagger setup
  // Documentation for the API
  const config = new DocumentBuilder()
    .setTitle('Mirage Social API')
    .setDescription('API documentation for Mirage Social App.')
    .setVersion('1.0')
    .addBearerAuth()
    .build();
  const documentFactory = () => SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, documentFactory);

  await app.listen(9000);
}
bootstrap();
