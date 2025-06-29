import { Injectable, NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Review } from '../reviews/entities/review.entity';
import { CreateReviewDto } from '../reviews/dto/create-review.dto';
import { Book } from './entities/books.entity';
import { CreateBookDto } from '..//reviews/dto/create-book.dto';

@Injectable()
export class BooksService {
  constructor(
    @InjectRepository(Book) private readonly bookRepo: Repository<Book>,
    @InjectRepository(Review) private readonly reviewRepo: Repository<Review>,
  ) {}

  findAll(): Promise<Book[]> {
    return this.bookRepo.find();
  }

  create(dto: CreateBookDto): Promise<Book> {
    const book = this.bookRepo.create(dto);
    return this.bookRepo.save(book);
  }

  async reviews(bookId: number): Promise<Review[]> {
    const book = await this.bookRepo.findOneBy({ id: bookId });
    if (!book) throw new NotFoundException(`Book ${bookId} not found.`);
    return this.reviewRepo.find({
      where: { book: { id: bookId } },
      order: { createdAt: 'DESC' },
    });
  }

  async addReview(bookId: number, dto: CreateReviewDto): Promise<Review> {
    const book = await this.bookRepo.findOneBy({ id: bookId });
    if (!book) throw new NotFoundException(`Book ${bookId} not found.`);
    const review = this.reviewRepo.create({ ...dto, book });
    return this.reviewRepo.save(review);
  }
}
