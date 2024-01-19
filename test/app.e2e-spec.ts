import type { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import request from 'supertest';

import { nanoid } from 'nanoid';
import { AppModule } from '../src/app/app.module';

describe('AuthController (e2e)', () => {
  let app: INestApplication;
  let accessToken: string;

  const userData = {
    firstName: 'John',
    lastName: 'Smith',
    email: `john_${nanoid()}@email.com`,
    password: 'password',
  };

  beforeAll(async () => {
    const moduleFixture = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('/auth/signup (POST)', async () => {
    await request(app.getHttpServer())
      .post('/auth/signup')
      .send(userData)
      .expect(201);
  });

  it('/auth/login (POST)', async () => {
    const response = await request(app.getHttpServer())
      .post('/auth/login')
      .send({
        email: userData.email,
        password: userData.password,
      })
      .expect(201);

    accessToken = response.body.accessToken;
  });

  it('/auth/me (GET)', () =>
    request(app.getHttpServer())
      .get('/auth/me')
      .set({ Authorization: `Bearer ${accessToken}` })
      .expect(200));

  afterAll(() => {
    app.close();
  });
});
