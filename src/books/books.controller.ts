import {
  Controller, Get, Post, Body, Param, ParseIntPipe,
} from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { BooksService } from './books.service';
import { CacheService } from '../cache/cache.service';
import { CreateReviewDto } from '../reviews/dto/create-review.dto';
import { CreateBookDto } from '../reviews/dto/create-book.dto';

@ApiTags('books')
@Controller('books')
export class BooksController {
  constructor(
    private readonly booksSvc: BooksService,
    private readonly cacheSvc: CacheService,
  ) {}

  @Get()
  @ApiOperation({ summary: 'List all books (cached for 60s)' })
  async list() {
    const key = 'books:list';
    const cached = await this.cacheSvc.get(key);
    if (cached) return cached;
    const list = await this.booksSvc.findAll();
    await this.cacheSvc.set(key, list, 60);
    return list;
  }

  @Post()
  @ApiOperation({ summary: 'Create a new book' })
  create(@Body() dto: CreateBookDto) {
    return this.booksSvc.create(dto);
  }

  @Get(':id/reviews')
  @ApiOperation({ summary: 'Get reviews for a book' })
  reviews(@Param('id', ParseIntPipe) id: number) {
    return this.booksSvc.reviews(id);
  }

  @Post(':id/reviews')
  @ApiOperation({ summary: 'Add a review to a book' })
  addReview(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: CreateReviewDto,
  ) {
    return this.booksSvc.addReview(id, dto);
  }
}
