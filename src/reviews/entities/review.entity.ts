import { Book } from '../../books/entities/books.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
  Index,
} from 'typeorm';

@Entity('reviews')
@Index(['book', 'createdAt']) 
export class Review {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  reviewer: string;

  @Column('text')
  body: string;

  @ManyToOne(() => Book, (book) => book.reviews, { onDelete: 'CASCADE' })
  book: Book;

  @CreateDateColumn()
  createdAt: Date;
}
