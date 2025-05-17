import {
  Injectable,
  InternalServerErrorException,
  BadRequestException,
} from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { firstValueFrom } from 'rxjs';
import { AxiosError } from 'axios';

import { EnvironmentVariables } from '@libs/env';
import { WeatherReqResponse, WeatherApiResponse } from './weather.interface';

@Injectable()
export class WeatherService {
  private readonly apiKey: string;
  private apiUrl = 'http://api.weatherapi.com/v1/current.json';

  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService<EnvironmentVariables>,
  ) {
    this.apiKey = this.configService.get<string>('WEATHER_API_KEY')!;
  }

  async getCurrentWeather(city: string): Promise<WeatherReqResponse> {
    try {
      const url = `${this.apiUrl}?key=${this.apiKey}&q=${city}&aqi=no`;
      const res = this.httpService.get(url);

      const response: WeatherApiResponse = await firstValueFrom(res);

      return {
        temperature: response.data.current.temp_c,
        humidity: response.data.current.humidity,
        description: response.data.current.condition.text,
      };
    } catch (error: unknown) {
      if ((error as AxiosError).response?.status === 400) {
        throw new BadRequestException('Invalid city name');
      }

      throw new InternalServerErrorException('Failed to fetch weather data');
    }
  }
}
