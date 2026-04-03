import { Module } from '@nestjs/common';
import { UploadController } from './upload.controller';
import { UploadService } from './upload.service';
import { UPLOAD_SERVICE } from '@/modules/core/constants/services.constants';
import { TestRunModule } from '../testrun/testrun.module';

@Module({
  imports: [TestRunModule],
  controllers: [UploadController],
  providers: [{ provide: UPLOAD_SERVICE, useClass: UploadService }],
  exports: [UPLOAD_SERVICE],
})
export class UploadModule {}
