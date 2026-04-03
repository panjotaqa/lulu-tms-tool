import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DebugLoggerService } from '@/modules/core/logger/debug-logger.service';
import { ProjectModule } from '@/modules/project/project.module';
import { TestCaseModule } from '@/modules/testcase/testcase.module';
import { ApplicationController } from './controller/application.controller';
import { Application } from './models/entity/application.entity';
import { ApplicationRepository } from './repository/application.repository';
import { ApplicationService } from './service/application.service';
import { APPLICATION_SERVICE } from '@/modules/core/constants/services.constants';
import { APPLICATION_REPOSITORY } from '@/modules/core/constants/repositories.constants';

@Module({
  imports: [TypeOrmModule.forFeature([Application]), ProjectModule, TestCaseModule],
  controllers: [ApplicationController],
  providers: [
    { provide: APPLICATION_SERVICE, useClass: ApplicationService },
    { provide: APPLICATION_REPOSITORY, useClass: ApplicationRepository },
    DebugLoggerService,
  ],
  exports: [APPLICATION_SERVICE, APPLICATION_REPOSITORY],
})
export class ApplicationModule { }
