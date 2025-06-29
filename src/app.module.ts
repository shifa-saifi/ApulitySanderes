import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RedisModule } from './cache/redis.module';
import { BooksModule } from './books/books.module';
import { ReviewsModule } from './reviews/reviews.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      url: process.env.DATABASE_URL || 'postgresql://postgres:mynewpassword@localhost:5432/bookdb',
      autoLoadEntities: true,
      synchronize: false,               
      migrations: [__dirname + '/migration/*.js'],
    }),
    RedisModule,
    BooksModule,
    ReviewsModule,
  ],
})
export class AppModule {}
