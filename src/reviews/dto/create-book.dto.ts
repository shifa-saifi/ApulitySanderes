import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsDateString } from 'class-validator';

export class CreateBookDto {
  @ApiProperty({ example: '1984' })
  @IsString()
  title: string;

  @ApiProperty({ example: 'George Orwell' })
  @IsString()
  author: string;

  @ApiProperty({ example: '1949-06-08', type: 'string', format: 'date' })
  @IsDateString()
  publishedAt: string;
}
