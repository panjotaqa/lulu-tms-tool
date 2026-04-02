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
