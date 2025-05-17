import * as request from 'supertest';
import { DataSource } from 'typeorm';
import { randomUUID } from 'crypto';

import { Subscription } from '@libs/typeorm';
import { initApp, closeApp, httpServer, nestApp } from './utils';

describe('SubscriptionController (e2e)', () => {
  let db: DataSource;
  const testEmail = 'test@example.com';
  let confirmToken: string;
  let unsubscribeToken: string;

  beforeAll(async () => {
    await initApp();
    db = nestApp.get(DataSource);
  });

  afterAll(async () => {
    await closeApp();
  });

  it('/api/subscribe (POST) should create a subscription', async () => {
    const res = await request(httpServer)
      .post('/api/subscribe')
      .send({
        email: testEmail,
        city: 'Kyiv',
        frequency: 'daily',
      })
      .expect(201);

    expect(res.body.message).toContain('Subscription created');
  });

  it('/api/subscribe (POST) should fail with duplicate email', async () => {
    await request(httpServer)
      .post('/api/subscribe')
      .send({
        email: testEmail,
        city: 'Kyiv',
        frequency: 'daily',
      })
      .expect(400);
  });

  it('/api/confirm/:token (GET) should confirm subscription', async () => {
    const sub = await db.getRepository(Subscription).findOneByOrFail({
      email: testEmail,
    });
    confirmToken = sub.confirmToken!;

    const res = await request(httpServer)
      .get(`/api/confirm/${confirmToken}`)
      .expect(302);

    expect(res.header.location).toMatch(/confirmed\.html|error\.html/);
  });

  it('/api/unsubscribe/:token (GET) should unsubscribe', async () => {
    const sub = await db.getRepository(Subscription).findOneByOrFail({
      email: testEmail,
    });
    unsubscribeToken = sub.unsubscribeToken!;

    const res = await request(httpServer)
      .get(`/api/unsubscribe/${unsubscribeToken}`)
      .expect(302);

    expect(res.header.location).toMatch(/unsubscribed\.html|error\.html/);
  });

  it('/api/confirm/:token (GET) should return error for invalid token', async () => {
    await request(httpServer)
      .get(`/api/confirm/${randomUUID()}`)
      .expect(302)
      .expect('Location', '/error.html');
  });

  it('/api/unsubscribe/:token (GET) should return error for invalid token', async () => {
    await request(httpServer)
      .get(`/api/unsubscribe/${randomUUID()}`)
      .expect(302)
      .expect('Location', '/error.html');
  });
});
