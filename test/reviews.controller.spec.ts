// test/reviews.controller.spec.ts

import { Test, TestingModule } from '@nestjs/testing';
import { ReviewsController } from '../src/reviews/reviews.controller';
import { ReviewsService } from '../src/reviews/reviews.service';
import { CreateReviewDto } from '../src/reviews/dto/create-review.dto';

describe('ReviewsController (unit)', () => {
  let controller: ReviewsController;
  let mockReviewsService: Partial<Record<keyof ReviewsService, jest.Mock>>;

  beforeEach(async () => {
    mockReviewsService = {
      findByBook: jest.fn(),
      create: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [ReviewsController],
      providers: [
        { provide: ReviewsService, useValue: mockReviewsService },
      ],
    }).compile();

    controller = module.get<ReviewsController>(ReviewsController);
  });

  describe('getReviews()', () => {
    it('calls service.findByBook with numeric id', async () => {
      const rv = [{ id: 1, reviewer: 'X', body: 'Y', createdAt: new Date() }];
      mockReviewsService.findByBook!.mockResolvedValue(rv);

      const result = await controller.getReviews('10' as any);
      expect(mockReviewsService.findByBook).toHaveBeenCalledWith(10);
      expect(result).toBe(rv);
    });
  });

  describe('addReview()', () => {
    it('calls service.create with numeric id and DTO', async () => {
      const dto: CreateReviewDto = { reviewer: 'A', body: 'Nice' };
      const saved = { id: 2, ...dto, createdAt: new Date() };
      mockReviewsService.create!.mockResolvedValue(saved);

      const result = await controller.addReview('20' as any, dto);
      expect(mockReviewsService.create).toHaveBeenCalledWith(20, dto);
      expect(result).toBe(saved);
    });
  });
});
