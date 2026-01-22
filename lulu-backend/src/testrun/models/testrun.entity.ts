import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Project } from '../../project/models/project.entity';
import { User } from '../../user/models/user.entity';
import { TestRunStatus } from './enums/testrun-status.enum';
import type { TestRunCase } from './testrun-case.entity';

@Entity('test_runs')
export class TestRun {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 255 })
  title: string;

  @Column({ type: 'text' })
  description: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  milestone: string | null;

  @Column({ type: 'date' })
  startDate: Date;

  @Column({ type: 'date' })
  endDate: Date;

  @Column({
    type: 'enum',
    enum: TestRunStatus,
    default: TestRunStatus.NOT_STARTED,
  })
  status: TestRunStatus;

  @ManyToOne(() => User, { nullable: true })
  @JoinColumn({ name: 'defaultAssigneeId' })
  defaultAssignee: User | null;

  @Column({ name: 'defaultAssigneeId', nullable: true })
  defaultAssigneeId: string | null;

  @ManyToOne(() => Project, { nullable: false })
  @JoinColumn({ name: 'projectId' })
  project: Project;

  @Column({ name: 'projectId' })
  projectId: string;

  @ManyToOne(() => User, { nullable: false })
  @JoinColumn({ name: 'createdById' })
  createdBy: User;

  @Column({ name: 'createdById' })
  createdById: string;

  @OneToMany('TestRunCase', 'testRun')
  testRunCases: TestRunCase[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}

