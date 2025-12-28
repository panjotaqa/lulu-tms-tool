import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DebugLoggerService } from '../core/logger/debug-logger.service';
import { Project } from '../project/models/project.entity';
import { TestCase } from '../testcase/models/testcase.entity';
import { UserModule } from '../user/user.module';
import { TestRun } from './models/testrun.entity';
import { TestRunCase } from './models/testrun-case.entity';
import { TestRunController } from './testrun.controller';
import { TestRunService } from './testrun.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([TestRun, TestRunCase, TestCase, Project]),
    UserModule,
  ],
  controllers: [TestRunController],
  providers: [TestRunService, DebugLoggerService],
  exports: [TestRunService],
})
export class TestRunModule {}

