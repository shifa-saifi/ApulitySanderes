// test/books.e2e-spec.ts

import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { DataSource } from 'typeorm';
import { AppModule } from '../src/app.module';

describe('Book-Review API (e2e)', () => {
  let app: INestApplication;
  let db: DataSource;
  let createdBookId: number;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    // enable global validation for DTOs
    app.useGlobalPipes(new ValidationPipe({ whitelist: true }));
    await app.init();

    // grab TypeORM DataSource and sync schema
    db = app.get(DataSource);
    await db.synchronize(true);  // drop & recreate tables
  });

  afterAll(async () => {
    await db.dropDatabase();      // clean up
    await app.close();
  });

  const bookDto = {
    title: '1984',
    author: 'George Orwell',
    publishedAt: '1949-06-08',
  };

  it(`POST   /books → 201 & book created`, async () => {
    const res = await request(app.getHttpServer())
      .post('/books')
      .send(bookDto)
      .expect(201);
    expect(res.body).toMatchObject(bookDto);
    expect(res.body.id).toBeDefined();
    createdBookId = res.body.id;
  });

  it(`GET    /books → 200 & array containing the created book`, async () => {
    const res = await request(app.getHttpServer())
      .get('/books')
      .expect(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.find((b: any) => b.id === createdBookId)).toBeDefined();
  });

  it(`GET    /books/:id/reviews → 200 & empty array`, async () => {
    const res = await request(app.getHttpServer())
      .get(`/books/${createdBookId}/reviews`)
      .expect(200);
    expect(res.body).toEqual([]);
  });

  it(`POST   /books/:id/reviews → 201 & review created`, async () => {
    const reviewDto = { reviewer: 'Alice', body: 'A masterpiece!' };
    const res = await request(app.getHttpServer())
      .post(`/books/${createdBookId}/reviews`)
      .send(reviewDto)
      .expect(201);
    expect(res.body).toMatchObject(reviewDto);
    expect(res.body.id).toBeDefined();
  });

  it(`GET    /books/:id/reviews → 200 & array containing the review`, async () => {
    const res = await request(app.getHttpServer())
      .get(`/books/${createdBookId}/reviews`)
      .expect(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body[0]).toHaveProperty('reviewer', 'Alice');
  });
});
