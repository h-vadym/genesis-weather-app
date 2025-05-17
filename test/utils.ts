import { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';

import { AppModule } from '../src/app/app.module';

let app: INestApplication;

export let httpServer: any;
export let nestApp: INestApplication;

export async function initApp() {
  const moduleRef = await Test.createTestingModule({
    imports: [AppModule],
  }).compile();

  app = moduleRef.createNestApplication();
  await app.init();

  httpServer = app.getHttpServer();
  nestApp = app;
}

export async function closeApp() {
  await app.close();
}
