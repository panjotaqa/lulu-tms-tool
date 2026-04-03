import { TestRun } from '../models/entity/testrun.entity';
import { IBaseRepository } from '@/modules/core/database/interfaces/base-repository.interface';

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export interface ITestRunRepository extends IBaseRepository<TestRun> {}
