import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EntityManager, Repository } from 'typeorm';
import { BaseRepository } from '@/modules/core/database/base.repository';
import { QueryTestCaseDto } from '../models/dto/query-testcase.dto';
import { TestCase } from '../models/entity/testcase.entity';
import { TestCaseListItemResponse } from '../models/types/testcase-response.type';
import { ITestCaseRepository } from './testcase.repository.interface';

@Injectable()
export class TestCaseRepository
  extends BaseRepository<TestCase>
  implements ITestCaseRepository
{
  constructor(
    @InjectRepository(TestCase)
    private readonly testCaseRepository: Repository<TestCase>,
  ) {
    super(testCaseRepository);
  }

  async findForSelection(
    projectId: string,
  ): Promise<TestCaseListItemResponse[]> {
    const testCases = await this.testCaseRepository
      .createQueryBuilder('testCase')
      .leftJoin('testCase.testSuite', 'testSuite')
      .leftJoin('testSuite.project', 'project')
      .select([
        'testCase.id',
        'testCase.testcaseId',
        'testCase.title',
        'testCase.testSuiteId',
      ])
      .where('project.id = :projectId', { projectId })
      .orderBy('testCase.createdAt', 'DESC')
      .getMany();

    return testCases.map((testCase) => ({
      id: testCase.id,
      testcaseId: testCase.testcaseId,
      title: testCase.title,
      testSuiteId: testCase.testSuiteId,
    }));
  }

  async findByFolderPaginated(
    folderId: string,
    queryDto: QueryTestCaseDto,
  ): Promise<{ testCases: TestCase[]; total: number }> {
    const { page = 1, limit = 10 } = queryDto;
    const skip = (page - 1) * limit;

    const queryBuilder = this.testCaseRepository
      .createQueryBuilder('testCase')
      .leftJoinAndSelect('testCase.testSuite', 'testSuite')
      .leftJoinAndSelect('testCase.createdBy', 'createdBy')
      .leftJoinAndSelect('testCase.testCaseTags', 'testCaseTags')
      .leftJoinAndSelect('testCaseTags.tag', 'tag')
      .where('testCase.testSuiteId = :folderId', { folderId })
      .orderBy('testCase.createdAt', 'DESC');

    const total = await queryBuilder.getCount();
    const testCases = await queryBuilder.skip(skip).take(limit).getMany();

    return { testCases, total };
  }

  async getNextTestCaseSequence(
    projectId: string,
    entityManager?: EntityManager,
  ): Promise<number> {
    const manager = entityManager || this.testCaseRepository.manager;
    const countResult = await manager
      .createQueryBuilder(TestCase, 'tc')
      .innerJoin('tc.testSuite', 'folder')
      .innerJoin('folder.project', 'project')
      .where('project.id = :projectId', { projectId })
      .getCount();
    return countResult + 1;
  }

  async updateFolderIds(
    testCaseIds: string[],
    targetFolderId: string,
  ): Promise<void> {
    await this.testCaseRepository
      .createQueryBuilder()
      .update(TestCase)
      .set({ testSuiteId: targetFolderId })
      .whereInIds(testCaseIds)
      .execute();
  }
}
