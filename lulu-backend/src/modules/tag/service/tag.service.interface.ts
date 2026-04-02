import { Tag } from '../models/tag.entity';

export const ITagService = Symbol('ITagService');

export interface ITagService {
  findOrCreateByName(name: string): Promise<Tag>;
  findOrCreateManyByNames(names: string[]): Promise<Tag[]>;
  findByIds(ids: string[]): Promise<Tag[]>;
  findAll(search?: string): Promise<Tag[]>;
}
