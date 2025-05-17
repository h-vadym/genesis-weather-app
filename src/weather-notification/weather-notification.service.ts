import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { InjectRepository } from '@nestjs/typeorm';
import { ConfigService } from '@nestjs/config';
import { Repository } from 'typeorm';

import { Subscription, Frequency } from '@libs/typeorm';
import { NodemailerService } from '@libs/nodemailer';
import { EnvironmentVariables } from '@libs/env';
import { WeatherService } from '../weather/weather.service';

@Injectable()
export class WeatherNotificationService {
  private readonly logger = new Logger(WeatherNotificationService.name);

  constructor(
    @InjectRepository(Subscription)
    private readonly subscriptionRepository: Repository<Subscription>,
    private readonly weatherService: WeatherService,
    private readonly nodeMailService: NodemailerService,
    private readonly configService: ConfigService<EnvironmentVariables>,
  ) {}

  @Cron(CronExpression.EVERY_HOUR)
  async handleHourly() {
    this.logger.log('Running hourly weather notification job...');
    await this.sendWeatherUpdates(Frequency.HOURLY);
  }

  @Cron('0 8 * * *')
  async handleDaily() {
    this.logger.log('Running daily weather notification job...');
    await this.sendWeatherUpdates(Frequency.DAILY);
  }

  private async sendWeatherUpdates(frequency: Frequency) {
    const subs = await this.subscriptionRepository.find({
      where: { confirmed: true, frequency },
    });

    const cityGroups: Record<string, Subscription[]> = {};
    subs.forEach((sub) => {
      if (!cityGroups[sub.city]) {
        cityGroups[sub.city] = [];
      }
      cityGroups[sub.city].push(sub);
    });

    for (const city in cityGroups) {
      try {
        const weather = await this.weatherService.getCurrentWeather(city);
        const subscribers = cityGroups[city];

        for (const sub of subscribers) {
          const data = {
            city,
            unsubscribeUrl: `${this.configService.get('APP_URL')}/api/unsubscribe/${sub.unsubscribeToken}`,
            ...weather,
          };

          await this.nodeMailService.sendWeatherUpdate(sub.email, data);
        }
      } catch (err) {
        this.logger.error(`Failed to send weather for ${city}:`, err);
      }
    }
  }
}
