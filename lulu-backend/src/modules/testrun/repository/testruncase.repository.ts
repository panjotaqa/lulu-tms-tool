import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BaseRepository } from '@/modules/core/database/base.repository';
import { TestRunCase } from '../models/entity/testrun-case.entity';
import { TestRunCaseStatus } from '../models/enums/testrun-case-status.enum';
import { ITestRunCaseRepository } from './testruncase.repository.interface';

@Injectable()
export class TestRunCaseRepository
  extends BaseRepository<TestRunCase>
  implements ITestRunCaseRepository
{
  constructor(
    @InjectRepository(TestRunCase)
    private readonly testRunCaseRepository: Repository<TestRunCase>,
  ) {
    super(testRunCaseRepository);
  }

  async updateStatus(
    testRunCaseId: string,
    status: TestRunCaseStatus,
  ): Promise<TestRunCase> {
    const testRunCase = await this.findOne({
      where: { id: testRunCaseId },
      relations: ['testRun'],
    });

    if (!testRunCase) {
      throw new NotFoundException('Caso de teste da execução não encontrado');
    }

    testRunCase.status = status;
    return this.save(testRunCase);
  }

  async updateEvidence(
    testRunCaseId: string,
    evidence: string | null,
  ): Promise<TestRunCase> {
    const testRunCase = await this.findOne({
      where: { id: testRunCaseId },
      relations: ['testRun'],
    });

    if (!testRunCase) {
      throw new NotFoundException('Caso de teste da execução não encontrado');
    }

    testRunCase.evidence = evidence;
    return this.save(testRunCase);
  }
}
