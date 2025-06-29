// test/books.controller.spec.ts

import { Test, TestingModule } from '@nestjs/testing';
import { BooksController } from '../src/books/books.controller';
import { BooksService } from '../src/books/books.service';
import { CacheService } from '../src/cache/cache.service';
import { CreateBookDto } from '../src/books/dto/create-book.dto';
import { CreateReviewDto } from '../src/reviews/dto/create-review.dto';

describe('BooksController (unit)', () => {
  let controller: BooksController;
  let mockBooksService: Partial<Record<keyof BooksService, jest.Mock>>;
  let mockCacheService: Partial<Record<keyof CacheService, jest.Mock>>;

  beforeEach(async () => {
    mockBooksService = {
      findAll: jest.fn(),
      create: jest.fn(),
      reviews: jest.fn(),
      addReview: jest.fn(),
    };
    mockCacheService = {
      get: jest.fn(),
      set: jest.fn(),
      del: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [BooksController],
      providers: [
        { provide: BooksService, useValue: mockBooksService },
        { provide: CacheService, useValue: mockCacheService },
      ],
    }).compile();

    controller = module.get<BooksController>(BooksController);
  });

  describe('list()', () => {
    it('returns cached list when cache hit', async () => {
      const fake = [{ id: 1, title: 'A', author: 'B', publishedAt: new Date() }];
      mockCacheService.get!.mockResolvedValue(fake);

      const result = await controller.list();
      expect(result).toBe(fake);
      expect(mockCacheService.get).toHaveBeenCalledWith('books:list');
      expect(mockBooksService.findAll).not.toHaveBeenCalled();
    });

    it('fetches from service and sets cache when cache miss', async () => {
      mockCacheService.get!.mockResolvedValue(null);
      const dbList = [{ id: 2, title: 'X', author: 'Y', publishedAt: new Date() }];
      mockBooksService.findAll!.mockResolvedValue(dbList);

      const result = await controller.list();
      expect(result).toBe(dbList);
      expect(mockBooksService.findAll).toHaveBeenCalled();
      expect(mockCacheService.set).toHaveBeenCalledWith('books:list', dbList, 60);
    });
  });

  describe('create()', () => {
    it('calls service.create and returns value', async () => {
      const dto: CreateBookDto = { title: 'T', author: 'A', publishedAt: '2000-01-01' };
      const saved = { id: 5, ...dto, publishedAt: new Date(dto.publishedAt) };
      mockBooksService.create!.mockResolvedValue(saved);

      const result = await controller.create(dto);
      expect(mockBooksService.create).toHaveBeenCalledWith(dto);
      expect(result).toBe(saved);
    });
  });

  describe('reviews()', () => {
    it('calls service.reviews with numeric id', async () => {
      const reviews = [{ id: 1, reviewer: 'R', body: 'B', createdAt: new Date() }];
      mockBooksService.reviews!.mockResolvedValue(reviews);

      const result = await controller.reviews('42' as any);
      expect(mockBooksService.reviews).toHaveBeenCalledWith(42);
      expect(result).toBe(reviews);
    });
  });

  describe('addReview()', () => {
    it('calls service.addReview and returns created review', async () => {
      const dto: CreateReviewDto = { reviewer: 'R', body: 'Good' };
      const saved = { id: 7, ...dto, createdAt: new Date() };
      mockBooksService.addReview!.mockResolvedValue(saved);

      const result = await controller.addReview('3' as any, dto);
      expect(mockBooksService.addReview).toHaveBeenCalledWith(3, dto);
      expect(result).toBe(saved);
    });
  });
});
