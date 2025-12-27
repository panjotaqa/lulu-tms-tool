import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DebugLoggerService } from '../core/logger/debug-logger.service';
import { FolderModule } from '../folder/folder.module';
import { UserModule } from '../user/user.module';
import { ProjectController } from './project.controller';
import { Project } from './models/project.entity';
import { ProjectService } from './project.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Project]),
    UserModule,
    forwardRef(() => FolderModule),
  ],
  controllers: [ProjectController],
  providers: [ProjectService, DebugLoggerService],
  exports: [ProjectService],
})
export class ProjectModule {}

