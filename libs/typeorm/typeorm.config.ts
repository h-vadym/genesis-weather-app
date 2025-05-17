import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigService } from '@nestjs/config';

import { EnvironmentVariables, Environment } from '@libs/env';

export const ormConfig = TypeOrmModule.forRootAsync({
  inject: [ConfigService],
  useFactory: (configService: ConfigService<EnvironmentVariables>) => {
    return {
      type: 'postgres',
      host: configService.get('DATABASE_HOST'),
      port: configService.get('DATABASE_PORT'),
      username: configService.get('DATABASE_USERNAME'),
      password: configService.get('DATABASE_PASSWORD'),
      database: configService.get('DATABASE_NAME'),
      entities: [__dirname + '/entities/app-entities/*.entity{.ts,.js}'],
      synchronize: configService.get('NODE_ENV') === Environment.production,
      logging: false,
    };
  },
});
