// data-source.ts
import 'dotenv/config';
import { DataSource } from 'typeorm';
import { Book } from './books/entities/books.entity';
import { Review } from './reviews/entities/review.entity';


export default new DataSource({
  type: 'postgres',
  url: process.env.DATABASE_URL,
  entities: [Book, Review],
  migrations: ['./dist/migration/*.js'],
});
