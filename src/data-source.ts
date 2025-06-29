import 'dotenv/config';
import { DataSource } from 'typeorm';
import { Review } from './reviews/entities/review.entity';
import { Book } from './books/entities/books.entity';

export default new DataSource({
  type: 'postgres',
  url: process.env.DATABASE_URL || 'postgresql://postgres:mynewpassword@localhost:5432/bookdb',
  entities: [Review, Book],
  migrations: ['./dist/migration/*.js'],
  synchronize: true,
  logging: true,
  extra: {
    connectionLimit: 10,
  },
  cache: {
    type: 'redis',
    options: {
      host: 'redis',
      port: 6379,
      password: process.env.REDIS_PASSWORD || 'mynewpassword',
    },
  },
  subscribers: [],
  
});
