import {
  Controller,
  Get,
  Post,
  Param,
  Body,
  ParseIntPipe,
} from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { ReviewsService } from './reviews.service';
import { CreateReviewDto } from './dto/create-review.dto';

@ApiTags('reviews')
@Controller('books/:id/reviews')
export class ReviewsController {
  constructor(private readonly reviewsSvc: ReviewsService) {}

  @Get()
  @ApiOperation({ summary: 'List reviews for a specific book' })
  getReviews(@Param('id', ParseIntPipe) id: number) {
    return this.reviewsSvc.findByBook(id);
  }

  @Post()
  @ApiOperation({ summary: 'Add a review to a book' })
  addReview(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: CreateReviewDto,
  ) {
    return this.reviewsSvc.create(id, dto);
  }
}
