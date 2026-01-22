import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DebugLoggerService } from '../core/logger/debug-logger.service';
import { ProjectModule } from '../project/project.module';
import { TestCase } from '../testcase/models/testcase.entity';
import { ApplicationController } from './application.controller';
import { Application } from './models/application.entity';
import { ApplicationService } from './application.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Application, TestCase]),
    ProjectModule,
  ],
  controllers: [ApplicationController],
  providers: [ApplicationService, DebugLoggerService],
  exports: [ApplicationService],
})
export class ApplicationModule {}

