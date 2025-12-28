import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { TestCase } from '../../testcase/models/testcase.entity';
import { User } from '../../user/models/user.entity';
import { TestRunCaseStatus } from './enums/testrun-case-status.enum';
import { TestRun } from './testrun.entity';

@Entity('test_run_cases')
export class TestRunCase {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => TestRun, { nullable: false, onDelete: 'CASCADE' })
  @JoinColumn({ name: 'testRunId' })
  testRun: TestRun;

  @Column({ name: 'testRunId' })
  testRunId: string;

  @ManyToOne(() => TestCase, { nullable: false })
  @JoinColumn({ name: 'testCaseId' })
  testCase: TestCase;

  @Column({ name: 'testCaseId' })
  testCaseId: string;

  @ManyToOne(() => User, { nullable: true })
  @JoinColumn({ name: 'assignedToId' })
  assignedTo: User | null;

  @Column({ name: 'assignedToId', nullable: true })
  assignedToId: string | null;

  @Column({
    type: 'enum',
    enum: TestRunCaseStatus,
    default: TestRunCaseStatus.PENDING,
  })
  status: TestRunCaseStatus;

  @Column({ type: 'jsonb' })
  testCaseSnapshot: object;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  snapshotCreatedAt: Date;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}

