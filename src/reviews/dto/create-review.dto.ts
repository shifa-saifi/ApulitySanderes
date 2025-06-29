import { IsString } from 'class-validator';

export class CreateReviewDto {
  @IsString()
  reviewer: string;

  @IsString()
  body: string;
}
