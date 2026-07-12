import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Tag } from '@/modules/tag/models/tag.entity';
import { Bug } from './bug.entity';

@Entity('bug_tags')
export class BugTag {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Bug, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'bugId' })
  bug: Bug;

  @Column({ name: 'bugId' })
  bugId: string;

  @ManyToOne(() => Tag, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'tagId' })
  tag: Tag;

  @Column({ name: 'tagId' })
  tagId: string;
}
