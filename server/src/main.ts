import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { BadRequestException, ValidationPipe } from '@nestjs/common';
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
  await app.listen(9000);
}
bootstrap();
