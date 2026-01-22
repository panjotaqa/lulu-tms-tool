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
import { Application } from '../../application/models/application.entity';
import { Folder } from '../../folder/models/folder.entity';
import { User } from '../../user/models/user.entity';
import { Tag } from '../../tag/models/tag.entity';
import { AutomationStatus } from './enums/automation-status.enum';
import { Environment } from './enums/environment.enum';
import { Layer } from './enums/layer.enum';
import { Priority } from './enums/priority.enum';
import { Severity } from './enums/severity.enum';
import { Status } from './enums/status.enum';
import { TestType } from './enums/test-type.enum';
import { TestCaseTag } from './testcase-tag.entity';

@Entity('testcases')
export class TestCase {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 50, unique: true, nullable: false })
  testcaseId: string;

  @Column({ type: 'varchar', length: 255 })
  title: string;

  @ManyToOne(() => Folder, { nullable: false })
  @JoinColumn({ name: 'testSuiteId' })
  testSuite: Folder;

  @Column({ name: 'testSuiteId' })
  testSuiteId: string;

  @Column({
    type: 'enum',
    enum: Severity,
    default: Severity.TRIVIAL,
  })
  severity: Severity;

  @Column({
    type: 'enum',
    enum: Status,
    default: Status.ACTIVE,
  })
  status: Status;

  @Column({
    type: 'enum',
    enum: Priority,
    default: Priority.MEDIUM,
  })
  priority: Priority;

  @Column({
    type: 'enum',
    enum: TestType,
    default: TestType.FUNCTIONAL,
  })
  type: TestType;

  @Column({ type: 'boolean', default: false })
  isFlaky: boolean;

  @Column({ type: 'varchar', length: 255, nullable: true })
  milestone: string | null;

  @Column({ type: 'varchar', length: 500, nullable: true })
  userStoryLink: string | null;

  @Column({
    type: 'enum',
    enum: Layer,
    default: Layer.E2E,
  })
  layer: Layer;

  @Column({
    type: 'enum',
    enum: Environment,
    default: Environment.INTEGRATION,
  })
  environment: Environment;

  @Column({
    type: 'enum',
    enum: AutomationStatus,
    default: AutomationStatus.MANUAL,
  })
  automationStatus: AutomationStatus;

  @Column({ type: 'boolean', default: false })
  toBeAutomated: boolean;

  @Column({ type: 'text', nullable: true })
  description: string | null;

  @Column({ type: 'text', nullable: true })
  preConditions: string | null;

  @Column({ type: 'text', array: true, nullable: true })
  steps: string[] | null;

  @ManyToOne(() => User, { nullable: false })
  @JoinColumn({ name: 'createdBy' })
  createdBy: User;

  @Column({ name: 'createdBy' })
  createdById: string;

  @ManyToOne(() => Application, { nullable: true })
  @JoinColumn({ name: 'applicationId' })
  application: Application | null;

  @Column({ name: 'applicationId', nullable: true })
  applicationId: string | null;

  @OneToMany(() => TestCaseTag, (testCaseTag) => testCaseTag.testCase)
  testCaseTags: TestCaseTag[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}

