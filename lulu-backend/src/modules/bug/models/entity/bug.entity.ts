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
import { Application } from '@/modules/application/models/entity/application.entity';
import { Project } from '@/modules/project/models/entity/project.entity';
import { TestCase } from '@/modules/testcase/models/entity/testcase.entity';
import { Environment } from '@/modules/testcase/models/enums/environment.enum';
import { Priority } from '@/modules/testcase/models/enums/priority.enum';
import { Severity } from '@/modules/testcase/models/enums/severity.enum';
import { TestRunCase } from '@/modules/testrun/models/entity/testrun-case.entity';
import { User } from '@/modules/user/models/entity/user.entity';
import { BugStatus } from '../enums/bug-status.enum';
import { BugTag } from './bug-tag.entity';

@Entity('bugs')
export class Bug {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 50, unique: true, nullable: false })
  bugId: string;

  @Column({ type: 'varchar', length: 255 })
  title: string;

  @Column({ type: 'text', nullable: true })
  description: string | null;

  @Column({
    type: 'enum',
    enum: BugStatus,
    default: BugStatus.OPEN,
  })
  status: BugStatus;

  @Column({
    type: 'enum',
    enum: Severity,
    default: Severity.TRIVIAL,
  })
  severity: Severity;

  @Column({
    type: 'enum',
    enum: Priority,
    default: Priority.MEDIUM,
  })
  priority: Priority;

  @Column({
    type: 'enum',
    enum: Environment,
    nullable: true,
  })
  environment: Environment | null;

  @ManyToOne(() => Project, { nullable: false, onDelete: 'CASCADE' })
  @JoinColumn({ name: 'projectId' })
  project: Project;

  @Column({ name: 'projectId' })
  projectId: string;

  @ManyToOne(() => Application, { nullable: true })
  @JoinColumn({ name: 'applicationId' })
  application: Application | null;

  @Column({ name: 'applicationId', nullable: true })
  applicationId: string | null;

  @ManyToOne(() => TestCase, { nullable: true })
  @JoinColumn({ name: 'testCaseId' })
  testCase: TestCase | null;

  @Column({ name: 'testCaseId', nullable: true })
  testCaseId: string | null;

  @ManyToOne(() => TestRunCase, { nullable: true })
  @JoinColumn({ name: 'testRunCaseId' })
  testRunCase: TestRunCase | null;

  @Column({ name: 'testRunCaseId', nullable: true })
  testRunCaseId: string | null;

  @ManyToOne(() => User, { nullable: true })
  @JoinColumn({ name: 'assignedToId' })
  assignedTo: User | null;

  @Column({ name: 'assignedToId', nullable: true })
  assignedToId: string | null;

  @ManyToOne(() => User, { nullable: false })
  @JoinColumn({ name: 'createdById' })
  createdBy: User;

  @Column({ name: 'createdById' })
  createdById: string;

  @OneToMany(() => BugTag, (bugTag) => bugTag.bug)
  bugTags: BugTag[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
