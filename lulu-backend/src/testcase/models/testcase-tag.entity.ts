import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Tag } from '../../tag/models/tag.entity';
import { TestCase } from './testcase.entity';

@Entity('testcase_tags')
export class TestCaseTag {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => TestCase, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'testCaseId' })
  testCase: TestCase;

  @Column({ name: 'testCaseId' })
  testCaseId: string;

  @ManyToOne(() => Tag, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'tagId' })
  tag: Tag;

  @Column({ name: 'tagId' })
  tagId: string;
}

