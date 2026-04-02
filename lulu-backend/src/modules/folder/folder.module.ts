import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProjectModule } from '@/modules/project/project.module';
import { UserModule } from '@/modules/user/user.module';
import { DebugLoggerService } from '@/modules/core/logger/debug-logger.service';
import { FolderController } from './controller/folder.controller';
import { Folder } from './models/entity/folder.entity';
import { FolderService } from './service/folder.service';
import { FolderRepository } from './repository/folder.repository';

@Module({
  imports: [
    TypeOrmModule.forFeature([Folder]),
    forwardRef(() => ProjectModule),
    UserModule,
  ],
  controllers: [FolderController],
  providers: [
    {
      provide: 'IFolderService',
      useClass: FolderService,
    },
    {
      provide: 'IFolderRepository',
      useClass: FolderRepository,
    },
    FolderService,
    FolderRepository,
    DebugLoggerService,
  ],
  exports: [
    {
      provide: 'IFolderService',
      useClass: FolderService,
    },
    'IFolderRepository',
  ],
})
export class FolderModule {}
