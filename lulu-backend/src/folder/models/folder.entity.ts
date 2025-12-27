import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Project } from '../../project/models/project.entity';
import { User } from '../../user/models/user.entity';

@Entity('folders')
@Index(['projectId', 'parentFolderId', 'position'])
@Index(['projectId', 'parentFolderId', 'position'], { unique: true })
export class Folder {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 255 })
  title: string;

  @Column({ type: 'integer', default: 0 })
  position: number;

  @ManyToOne(() => Project, { nullable: false })
  @JoinColumn({ name: 'projectId' })
  project: Project;

  @Column({ name: 'projectId' })
  projectId: string;

  @ManyToOne(() => Folder, { nullable: true })
  @JoinColumn({ name: 'parentFolderId' })
  parentFolder: Folder | null;

  @Column({ name: 'parentFolderId', nullable: true })
  parentFolderId: string | null;

  @ManyToOne(() => User, { nullable: false })
  @JoinColumn({ name: 'createdBy' })
  createdBy: User;

  @Column({ name: 'createdBy' })
  createdById: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}

