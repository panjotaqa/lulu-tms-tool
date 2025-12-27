import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Tag } from './models/tag.entity';

@Injectable()
export class TagService {
  constructor(
    @InjectRepository(Tag)
    private readonly tagRepository: Repository<Tag>,
  ) {}

  async findOrCreateByName(name: string): Promise<Tag> {
    const normalizedName = name.trim();
    if (!normalizedName) {
      throw new Error('Tag name cannot be empty');
    }
    const existingTag = await this.tagRepository.findOne({
      where: { name: normalizedName },
    });
    if (existingTag) {
      return existingTag;
    }
    const newTag = this.tagRepository.create({ name: normalizedName });
    return this.tagRepository.save(newTag);
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
    const existingTags = await this.tagRepository.find({
      where: uniqueNames.map((name) => ({ name })),
    });
    const existingNames = new Set(existingTags.map((tag) => tag.name));
    const tagsToCreate = uniqueNames
      .filter((name) => !existingNames.has(name))
      .map((name) => this.tagRepository.create({ name }));
    if (tagsToCreate.length > 0) {
      const createdTags = await this.tagRepository.save(tagsToCreate);
      return [...existingTags, ...createdTags];
    }
    return existingTags;
  }

  async findByIds(ids: string[]): Promise<Tag[]> {
    if (!ids || ids.length === 0) {
      return [];
    }
    return this.tagRepository.find({
      where: ids.map((id) => ({ id })),
    });
  }
}

