import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { ConfigService } from '@nestjs/config';
import { randomUUID } from 'crypto';

import { NodemailerService } from '@libs/nodemailer';
import { Subscription, Frequency } from '@libs/typeorm';
import { WeatherNotificationService } from './weather-notification.service';
import { WeatherService } from '../weather/weather.service';

const testUUID = randomUUID();
const mockSubscription: Subscription = {
  id: '1',
  email: 'test@example.com',
  city: 'Kyiv',
  frequency: Frequency.HOURLY,
  confirmed: true,
  confirmToken: null,
  unsubscribeToken: testUUID,
  created_at: new Date().toDateString(),
  updated_at: new Date().toDateString(),
};

describe('WeatherNotificationService', () => {
  let service: WeatherNotificationService;

  const mockRepo = {
    find: jest.fn(),
  };

  const mockWeatherService = {
    getCurrentWeather: jest.fn(),
  };

  const mockMailerService = {
    sendWeatherUpdate: jest.fn(),
  };

  const mockConfigService = {
    get: jest.fn().mockReturnValue('http://localhost:9000'),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        WeatherNotificationService,
        { provide: getRepositoryToken(Subscription), useValue: mockRepo },
        { provide: WeatherService, useValue: mockWeatherService },
        { provide: NodemailerService, useValue: mockMailerService },
        { provide: ConfigService, useValue: mockConfigService },
      ],
    }).compile();

    service = module.get<WeatherNotificationService>(
      WeatherNotificationService,
    );
    service = module.get<WeatherNotificationService>(
      WeatherNotificationService,
    );
  });

  afterEach(() => jest.clearAllMocks());

  it('should send weather updates to confirmed subscribers by city', async () => {
    mockRepo.find.mockResolvedValue([mockSubscription]);
    mockWeatherService.getCurrentWeather.mockResolvedValue({
      temperature: 20,
      humidity: 50,
      description: 'Sunny',
    });

    await (service as any).sendWeatherUpdates(Frequency.HOURLY);

    expect(mockRepo.find).toHaveBeenCalledWith({
      where: { confirmed: true, frequency: Frequency.HOURLY },
    });

    expect(mockWeatherService.getCurrentWeather).toHaveBeenCalledWith('Kyiv');
    expect(mockMailerService.sendWeatherUpdate).toHaveBeenCalledWith(
      'test@example.com',
      expect.objectContaining({
        city: 'Kyiv',
        unsubscribeUrl: `http://localhost:9000/api/unsubscribe/${testUUID}`,
        temperature: 20,
        humidity: 50,
        description: 'Sunny',
      }),
    );
  });

  it('should log error and continue if weather API fails', async () => {
    mockRepo.find.mockResolvedValue([mockSubscription]);
    mockWeatherService.getCurrentWeather.mockRejectedValue(
      new Error('API failed'),
    );

    const loggerSpy = jest.spyOn(console, 'error').mockImplementation();

    await (service as any).sendWeatherUpdates(Frequency.HOURLY);

    expect(mockMailerService.sendWeatherUpdate).not.toHaveBeenCalled();
    loggerSpy.mockRestore();
  });
});
