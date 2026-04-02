import { IBaseRepository } from '@/modules/core/database/interfaces/base-repository.interface';
import { QueryTestCaseDto } from '../models/dto/query-testcase.dto';
import { TestCase } from '../models/entity/testcase.entity';
import { TestCaseListItemResponse } from '../models/types/testcase-response.type';

export interface ITestCaseRepository extends IBaseRepository<TestCase> {
  findForSelection(projectId: string): Promise<TestCaseListItemResponse[]>;
  findByFolderPaginated(
    folderId: string,
    queryDto: QueryTestCaseDto,
  ): Promise<{ testCases: TestCase[]; total: number }>;
  getNextTestCaseSequence(projectId: string): Promise<number>;
  updateFolderIds(testCaseIds: string[], targetFolderId: string): Promise<void>;
}
