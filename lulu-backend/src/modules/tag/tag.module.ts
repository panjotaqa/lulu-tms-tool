import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Tag } from './models/tag.entity';
import { TagController } from './controller/tag.controller';
import { TagService } from './service/tag.service';
import { TagRepository } from './repository/tag.repository';

@Module({
  imports: [TypeOrmModule.forFeature([Tag])],
  controllers: [TagController],
  providers: [TagService, TagRepository],
  exports: [TagService, TagRepository],
})
export class TagModule {}
