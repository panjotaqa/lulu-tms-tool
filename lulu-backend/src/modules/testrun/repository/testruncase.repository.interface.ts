import { IBaseRepository } from '@/modules/core/database/interfaces/base-repository.interface';
import { TestRunCase } from '../models/entity/testrun-case.entity';
import { TestRunCaseStatus } from '../models/enums/testrun-case-status.enum';

export interface ITestRunCaseRepository extends IBaseRepository<TestRunCase> {
  updateStatus(
    testRunCaseId: string,
    status: TestRunCaseStatus,
  ): Promise<TestRunCase>;
  updateEvidence(testRunCaseId: string, evidence: string): Promise<TestRunCase>;
}
