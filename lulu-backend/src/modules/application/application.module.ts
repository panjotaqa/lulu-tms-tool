import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DebugLoggerService } from '@/modules/core/logger/debug-logger.service';
import { ProjectModule } from '@/modules/project/project.module';
import { TestCase } from '@/modules/testcase/models/entity/testcase.entity';
import { ApplicationController } from './controller/application.controller';
import { Application } from './models/entity/application.entity';
import { ApplicationService } from './service/application.service';

@Module({
  imports: [TypeOrmModule.forFeature([Application, TestCase]), ProjectModule],
  controllers: [ApplicationController],
  providers: [ApplicationService, DebugLoggerService],
  exports: [ApplicationService],
})
export class ApplicationModule {}
