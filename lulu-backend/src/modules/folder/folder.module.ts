import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProjectModule } from '@/modules/project/project.module';
import { UserModule } from '@/modules/user/user.module';
import { DebugLoggerService } from '@/modules/core/logger/debug-logger.service';
import { FolderController } from './controller/folder.controller';
import { Folder } from './models/entity/folder.entity';
import { FolderService } from './service/folder.service';
import { FolderRepository } from './repository/folder.repository';
import { FOLDER_SERVICE } from '@/modules/core/constants/services.constants';
import { FOLDER_REPOSITORY } from '@/modules/core/constants/repositories.constants';
@Module({
  imports: [
    TypeOrmModule.forFeature([Folder]),
    forwardRef(() => ProjectModule),
    UserModule,
  ],
  controllers: [FolderController],
  providers: [
    {
      provide: FOLDER_SERVICE,
      useClass: FolderService,
    },
    {
      provide: FOLDER_REPOSITORY,
      useClass: FolderRepository,
    },
    DebugLoggerService,
  ],
  exports: [FOLDER_SERVICE, FOLDER_REPOSITORY],
})
export class FolderModule {}
