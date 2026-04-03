import { Inject, Injectable } from '@nestjs/common';
import { TagRepository } from '../repository/tag.repository';
import { Tag } from '../models/tag.entity';
import { ITagService } from './tag.service.interface';
import { TAG_REPOSITORY } from '@/modules/core/constants/repositories.constants';

@Injectable()
export class TagService implements ITagService {
  constructor(
    @Inject(TAG_REPOSITORY)
    private readonly tagRepository: TagRepository,
  ) {}

  async findOrCreateByName(name: string): Promise<Tag> {
    return this.tagRepository.findOrCreateByName(name);
  }

  async findOrCreateManyByNames(names: string[]): Promise<Tag[]> {
    return this.tagRepository.findOrCreateManyByNames(names);
  }

  async findByIds(ids: string[]): Promise<Tag[]> {
    if (!ids || ids.length === 0) {
      return [];
    }
    return this.tagRepository.find({
      where: ids.map((id) => ({ id })),
    });
  }

  async findAll(search?: string): Promise<Tag[]> {
    return this.tagRepository.search(search);
  }
}
