import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DebugLoggerService } from '../core/logger/debug-logger.service';
import { FolderModule } from '../folder/folder.module';
import { UserModule } from '../user/user.module';
import { ProjectController } from './controller/project.controller';
import { Project } from './models/entity/project.entity';
import { ProjectService } from './service/project.service';
import { ProjectRepository } from './repository/project.repository';
import { PROJECT_SERVICE } from '@/modules/core/constants/services.constants';
import { PROJECT_REPOSITORY } from '@/modules/core/constants/repositories.constants';

@Module({
  imports: [
    TypeOrmModule.forFeature([Project]),
    UserModule,
    forwardRef(() => FolderModule),
  ],
  controllers: [ProjectController],
  providers: [
    {
      provide: PROJECT_SERVICE,
      useClass: ProjectService,
    },
    {
      provide: PROJECT_REPOSITORY,
      useClass: ProjectRepository,
    },
    DebugLoggerService,
  ],
  exports: [PROJECT_SERVICE, PROJECT_REPOSITORY],
})
export class ProjectModule {}
