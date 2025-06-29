import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Review } from '../reviews/entities/review.entity';
import { BooksService } from './books.service';
import { BooksController } from './books.controller';
import { Book } from './entities/books.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Book, Review]),  
  ],
  providers: [BooksService],
  controllers: [BooksController],
})
export class BooksModule {}
