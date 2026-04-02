import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BaseRepository } from '@/modules/core/database/base.repository';
import { TestRun } from '../models/entity/testrun.entity';
import { ITestRunRepository } from './testrun.repository.interface';

@Injectable()
export class TestRunRepository
  extends BaseRepository<TestRun>
  implements ITestRunRepository
{
  constructor(
    @InjectRepository(TestRun)
    private readonly testRunRepository: Repository<TestRun>,
  ) {
    super(testRunRepository);
  }

  // Se necessário, métodos customizados adicionais para queries de TestRun
  createQueryBuilder(alias: string) {
    return this.testRunRepository.createQueryBuilder(alias);
  }
}
