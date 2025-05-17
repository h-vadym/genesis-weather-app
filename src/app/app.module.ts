import { Module } from '@nestjs/common';
import { ServeStaticModule } from '@nestjs/serve-static';
import { ScheduleModule } from '@nestjs/schedule';
import { join } from 'path';

import { CustomConfigModule } from '@libs/env';
import { ormConfig } from '@libs/typeorm';
import { NodemailerModule } from '@libs/nodemailer';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { SubscriptionModule } from '../subscription/subscription.module';
import { WeatherModule } from '../weather/weather.module';
import { WeatherNotificationModule } from '../weather-notification/weather-notification.module';

@Module({
  imports: [
    CustomConfigModule,
    ormConfig,
    NodemailerModule,
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', '..', 'public'),
    }),
    ScheduleModule.forRoot(),
    SubscriptionModule,
    WeatherModule,
    WeatherNotificationModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
