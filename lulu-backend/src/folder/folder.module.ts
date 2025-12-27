import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProjectModule } from '../project/project.module';
import { UserModule } from '../user/user.module';
import { DebugLoggerService } from '../core/logger/debug-logger.service';
import { FolderController } from './folder.controller';
import { Folder } from './models/folder.entity';
import { FolderService } from './folder.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Folder]),
    forwardRef(() => ProjectModule),
    UserModule,
  ],
  controllers: [FolderController],
  providers: [FolderService, DebugLoggerService],
  exports: [FolderService],
})
export class FolderModule {}

