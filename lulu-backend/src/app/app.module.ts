import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './controller/app.controller';
import { AppService } from './service/app.service';
import { ApplicationModule } from '@/modules/application/application.module';
import { AuthModule } from '@/modules/auth/auth.module';
import { DatabaseModule } from '@/modules/core/database/database.module';
import { FolderModule } from '@/modules/folder/folder.module';
import { ProjectModule } from '@/modules/project/project.module';
import { TagModule } from '@/modules/tag/tag.module';
import { TestCaseModule } from '@/modules/testcase/testcase.module';
import { TestRunModule } from '@/modules/testrun/testrun.module';
import { UploadModule } from '@/modules/upload/upload.module';
import { UserModule } from '@/modules/user/user.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    DatabaseModule,
    UserModule,
    AuthModule,
    ProjectModule,
    FolderModule,
    TagModule,
    TestCaseModule,
    TestRunModule,
    UploadModule,
    ApplicationModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
