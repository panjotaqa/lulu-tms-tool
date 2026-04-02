import { TestRun } from '../models/entity/testrun.entity';
import { IBaseRepository } from '@/modules/core/database/interfaces/base-repository.interface';

export const ITestRunRepository = Symbol('ITestRunRepository');

export interface ITestRunRepository extends IBaseRepository<TestRun> {
  // specific methods can be added here if not using queryBuilder outside
}
