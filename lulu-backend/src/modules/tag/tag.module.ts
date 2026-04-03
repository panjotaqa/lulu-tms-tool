import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Tag } from './models/tag.entity';
import { TagController } from './controller/tag.controller';
import { TagService } from './service/tag.service';
import { TagRepository } from './repository/tag.repository';
import { TAG_SERVICE } from '@/modules/core/constants/services.constants';
import { TAG_REPOSITORY } from '@/modules/core/constants/repositories.constants';

@Module({
  imports: [TypeOrmModule.forFeature([Tag])],
  controllers: [TagController],
  providers: [
    { provide: TAG_SERVICE, useClass: TagService },
    { provide: TAG_REPOSITORY, useClass: TagRepository },
  ],
  exports: [TAG_SERVICE, TAG_REPOSITORY],
})
export class TagModule {}
