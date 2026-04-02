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

@Module({
  imports: [
    TypeOrmModule.forFeature([TestCase, TestCaseTag, Folder, Application]),
    TagModule,
    UserModule,
  ],
  controllers: [TestCaseController],
  providers: [TestCaseService, DebugLoggerService, TestCaseRepository],
  exports: [TestCaseService, TestCaseRepository],
})
export class TestCaseModule {}
