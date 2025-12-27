import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Folder } from '../folder/models/folder.entity';
import { TagModule } from '../tag/tag.module';
import { UserModule } from '../user/user.module';
import { DebugLoggerService } from '../core/logger/debug-logger.service';
import { TestCaseController } from './testcase.controller';
import { TestCase } from './models/testcase.entity';
import { TestCaseTag } from './models/testcase-tag.entity';
import { TestCaseService } from './testcase.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([TestCase, TestCaseTag, Folder]),
    TagModule,
    UserModule,
  ],
  controllers: [TestCaseController],
  providers: [TestCaseService, DebugLoggerService],
  exports: [TestCaseService],
})
export class TestCaseModule {}

