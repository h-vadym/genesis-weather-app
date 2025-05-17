import { Controller, Get, Query } from '@nestjs/common';

import { GetWeatherQueryDto } from './dto/query.dto';
import { WeatherService } from './weather.service';
import { WeatherReqResponse } from './weather.interface';

@Controller('api/weather')
export class WeatherController {
  constructor(private readonly weatherService: WeatherService) {}

  @Get()
  async getWeather(
    @Query() query: GetWeatherQueryDto,
  ): Promise<WeatherReqResponse> {
    return this.weatherService.getCurrentWeather(query.city);
  }
}
