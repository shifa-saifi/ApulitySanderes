import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Review } from './entities/review.entity';
import { CreateReviewDto } from './dto/create-review.dto';
import { Book } from '../books/entities/books.entity';

@Injectable()
export class ReviewsService {
  constructor(
    @InjectRepository(Review) private readonly revRepo: Repository<Review>,
    @InjectRepository(Book) private readonly bookRepo: Repository<Book>,
  ) {}

  async findByBook(bookId: number): Promise<Review[]> {
    const book = await this.bookRepo.findOneBy({ id: bookId });
    if (!book) throw new NotFoundException(`Book ${bookId} not found.`);
    return this.revRepo.find({
      where: { book: { id: bookId } },
      order: { createdAt: 'DESC' },
    });
  }

  async create(bookId: number, dto: CreateReviewDto): Promise<Review> {
    const book = await this.bookRepo.findOneBy({ id: bookId });
    if (!book) throw new NotFoundException(`Book ${bookId} not found.`);
    const review = this.revRepo.create({ ...dto, book });
    return this.revRepo.save(review);
  }
}
