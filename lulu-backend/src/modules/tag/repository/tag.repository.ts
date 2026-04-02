import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BaseRepository } from '@/modules/core/database/base.repository';
import { Tag } from '../models/tag.entity';
import { ITagRepository } from './tag.repository.interface';

@Injectable()
export class TagRepository
  extends BaseRepository<Tag>
  implements ITagRepository
{
  constructor(
    @InjectRepository(Tag)
    private readonly tagRepository: Repository<Tag>,
  ) {
    super(tagRepository);
  }

  async findOrCreateByName(name: string): Promise<Tag> {
    const normalizedName = name.trim();
    if (!normalizedName) {
      throw new Error('Tag name cannot be empty');
    }
    const existingTag = await this.findOne({
      where: { name: normalizedName },
    });
    if (existingTag) {
      return existingTag;
    }
    const newTag = this.create({ name: normalizedName });
    return this.save(newTag);
  }

  async findOrCreateManyByNames(names: string[]): Promise<Tag[]> {
    if (!names || names.length === 0) {
      return [];
    }
    const normalizedNames = names
      .map((name) => name.trim())
      .filter((name) => name.length > 0);
    if (normalizedNames.length === 0) {
      return [];
    }
    const uniqueNames = [...new Set(normalizedNames)];
    const existingTags = await this.find({
      where: uniqueNames.map((name) => ({ name })),
    });
    const existingNames = new Set(existingTags.map((tag) => tag.name));
    const tagsToCreate = uniqueNames
      .filter((name) => !existingNames.has(name))
      .map((name) => this.create({ name }));
    if (tagsToCreate.length > 0) {
      const createdTags = await this.tagRepository.save(tagsToCreate);
      return [...existingTags, ...createdTags];
    }
    return existingTags;
  }

  async search(search?: string): Promise<Tag[]> {
    const queryBuilder = this.tagRepository
      .createQueryBuilder('tag')
      .orderBy('tag.name', 'ASC')
      .limit(50);

    if (search && search.trim()) {
      queryBuilder.where('tag.name ILIKE :search', {
        search: `%${search.trim()}%`,
      });
    }

    return queryBuilder.getMany();
  }
}
