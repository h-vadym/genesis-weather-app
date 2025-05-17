import * as request from 'supertest';

import { initApp, closeApp, httpServer } from './utils';

describe('AppController (e2e)', () => {
  beforeAll(async () => {
    await initApp();
  });

  afterAll(async () => {
    await closeApp();
  });

  it('GET / should return HTML page', async () => {
    const res = await request(httpServer)
      .get('/')
      .expect(200)
      .expect('Content-Type', /html/);

    expect(res.text).toContain('<!DOCTYPE html>');
    expect(res.text).toMatch(/<html.*?>/i);
    expect(res.text).toMatch(/<\/html>/i);
  });
});
