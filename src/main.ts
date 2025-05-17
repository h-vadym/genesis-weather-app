import { NestFactory } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';

import { CustomConfigModule, EnvironmentVariables } from '@libs/env';
import { CustomValidationPipe } from '../utils/pipes/custom-validation.pipe';
import { AppModule } from './app/app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors();
  app.useGlobalPipes(new CustomValidationPipe());

  const configService = app
    .select(CustomConfigModule)
    .get(ConfigService<EnvironmentVariables>);

  const port = configService.get<number>('REST_APP_PORT') || 9000;

  await app.listen(port ?? 9000);
}
bootstrap();
