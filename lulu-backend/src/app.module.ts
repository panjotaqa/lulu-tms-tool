import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { DatabaseModule } from './core/database/database.module';
import { FolderModule } from './folder/folder.module';
import { ProjectModule } from './project/project.module';
import { TagModule } from './tag/tag.module';
import { TestCaseModule } from './testcase/testcase.module';
import { TestRunModule } from './testrun/testrun.module';
import { UserModule } from './user/user.module';

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
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
