import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DebugLoggerService } from '../core/logger/debug-logger.service';
import { FolderModule } from '../folder/folder.module';
import { UserModule } from '../user/user.module';
import { ProjectController } from './controller/project.controller';
import { Project } from './models/entity/project.entity';
import { ProjectService } from './service/project.service';
import { ProjectRepository } from './repository/project.repository';

@Module({
  imports: [
    TypeOrmModule.forFeature([Project]),
    UserModule,
    forwardRef(() => FolderModule),
  ],
  controllers: [ProjectController],
  providers: [
    {
      provide: 'IProjectService',
      useClass: ProjectService,
    },
    {
      provide: 'IProjectRepository',
      useClass: ProjectRepository,
    },
    ProjectService,
    ProjectRepository,
    DebugLoggerService,
  ],
  exports: [
    {
      provide: 'IProjectService',
      useClass: ProjectService,
    },
    'IProjectRepository', // Also export repo if needed by others
  ],
})
export class ProjectModule {}
