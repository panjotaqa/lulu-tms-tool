import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DebugLoggerService } from '@/modules/core/logger/debug-logger.service';
import { TestCase } from '@/modules/testcase/models/entity/testcase.entity';
import { UserModule } from '@/modules/user/user.module';
import { TestRun } from './models/entity/testrun.entity';
import { TestRunCase } from './models/entity/testrun-case.entity';
import { TestRunController } from './controller/testrun.controller';
import { TestRunService } from './service/testrun.service';
import { Project } from '@/modules/project/models/entity/project.entity';
import { TestRunRepository } from './repository/testrun.repository';
import { TestRunCaseRepository } from './repository/testruncase.repository';
import { TESTRUN_SERVICE } from '@/modules/core/constants/services.constants';
import {
  TESTRUN_REPOSITORY,
  TESTRUNCASE_REPOSITORY,
} from '@/modules/core/constants/repositories.constants';

@Module({
  imports: [
    TypeOrmModule.forFeature([TestRun, TestRunCase, TestCase, Project]),
    UserModule,
  ],
  controllers: [TestRunController],
  providers: [
    { provide: TESTRUN_SERVICE, useClass: TestRunService },
    { provide: TESTRUN_REPOSITORY, useClass: TestRunRepository },
    { provide: TESTRUNCASE_REPOSITORY, useClass: TestRunCaseRepository },
    DebugLoggerService,
  ],
  exports: [TESTRUN_SERVICE, TESTRUN_REPOSITORY, TESTRUNCASE_REPOSITORY],
})
export class TestRunModule {}
