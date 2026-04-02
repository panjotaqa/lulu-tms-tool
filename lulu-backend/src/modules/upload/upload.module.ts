import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TestRunCase } from '../testrun/models/entity/testrun-case.entity';
import { UploadController } from './upload.controller';
import { UploadService } from './upload.service';

@Module({
  imports: [TypeOrmModule.forFeature([TestRunCase])],
  controllers: [UploadController],
  providers: [UploadService],
  exports: [UploadService],
})
export class UploadModule {}
