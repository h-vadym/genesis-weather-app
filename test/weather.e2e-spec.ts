import * as request from 'supertest';

import { initApp, closeApp, httpServer } from './utils';

describe('WeatherController (e2e)', () => {
  beforeAll(async () => {
    await initApp();
  });

  afterAll(async () => {
    await closeApp();
  });

  it('/api/weather (GET) should return weather for valid city', async () => {
    const res = await request(httpServer)
      .get('/api/weather')
      .query({ city: 'Kyiv' })
      .expect(200);

    expect(res.body).toEqual(
      expect.objectContaining({
        temperature: expect.any(Number),
        humidity: expect.any(Number),
        description: expect.any(String),
      }),
    );
  });

  it('/api/weather (GET) should return 400 for invalid city', async () => {
    await request(httpServer)
      .get('/api/weather')
      .query({ city: '' })
      .expect(400);
  });
});
