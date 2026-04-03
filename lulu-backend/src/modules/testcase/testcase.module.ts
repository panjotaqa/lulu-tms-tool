import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Application } from '../application/models/entity/application.entity';
import { Folder } from '../folder/models/entity/folder.entity';
import { TagModule } from '../tag/tag.module';
import { UserModule } from '../user/user.module';
import { DebugLoggerService } from '../core/logger/debug-logger.service';
import { TestCase } from './models/entity/testcase.entity';
import { TestCaseTag } from './models/entity/testcase-tag.entity';
import { TestCaseService } from './service/testcase.service';
import { TestCaseRepository } from './repository/testcase.repository';
import { TestCaseController } from './controller/testcase.controller';
import { TESTCASE_SERVICE } from '@/modules/core/constants/services.constants';
import { TESTCASE_REPOSITORY } from '@/modules/core/constants/repositories.constants';

@Module({
  imports: [
    TypeOrmModule.forFeature([TestCase, TestCaseTag, Folder, Application]),
    TagModule,
    UserModule,
  ],
  controllers: [TestCaseController],
  providers: [
    { provide: TESTCASE_SERVICE, useClass: TestCaseService },
    { provide: TESTCASE_REPOSITORY, useClass: TestCaseRepository },
    DebugLoggerService,
  ],
  exports: [TESTCASE_SERVICE, TESTCASE_REPOSITORY],
})
export class TestCaseModule {}
