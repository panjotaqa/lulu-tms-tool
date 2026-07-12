import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ApplicationModule } from '@/modules/application/application.module';
import { DebugLoggerService } from '@/modules/core/logger/debug-logger.service';
import { BUG_REPOSITORY } from '@/modules/core/constants/repositories.constants';
import { BUG_SERVICE } from '@/modules/core/constants/services.constants';
import { ProjectModule } from '@/modules/project/project.module';
import { TagModule } from '@/modules/tag/tag.module';
import { TestCaseModule } from '@/modules/testcase/testcase.module';
import { TestRunCase } from '@/modules/testrun/models/entity/testrun-case.entity';
import { UserModule } from '@/modules/user/user.module';
import { BugController } from './controller/bug.controller';
import { Bug } from './models/entity/bug.entity';
import { BugTag } from './models/entity/bug-tag.entity';
import { BugRepository } from './repository/bug.repository';
import { BugService } from './service/bug.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Bug, BugTag, TestRunCase]),
    ProjectModule,
    UserModule,
    TagModule,
    TestCaseModule,
    ApplicationModule,
  ],
  controllers: [BugController],
  providers: [
    { provide: BUG_SERVICE, useClass: BugService },
    { provide: BUG_REPOSITORY, useClass: BugRepository },
    DebugLoggerService,
  ],
  exports: [BUG_SERVICE, BUG_REPOSITORY],
})
export class BugModule {}
