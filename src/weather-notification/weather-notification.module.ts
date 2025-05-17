import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { HttpModule } from '@nestjs/axios';

import { Subscription } from '@libs/typeorm';
import { NodemailerService } from '@libs/nodemailer';
import { WeatherService } from '../weather/weather.service';
import { WeatherNotificationService } from './weather-notification.service';

@Module({
  imports: [TypeOrmModule.forFeature([Subscription]), HttpModule],
  providers: [WeatherNotificationService, WeatherService, NodemailerService],
})
export class WeatherNotificationModule {}
