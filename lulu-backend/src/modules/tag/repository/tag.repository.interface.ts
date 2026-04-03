import { IBaseRepository } from '@/modules/core/database/interfaces/base-repository.interface';
import { Tag } from '../models/tag.entity';

export interface ITagRepository extends IBaseRepository<Tag> {
  findOrCreateByName(name: string): Promise<Tag>;
  findOrCreateManyByNames(names: string[]): Promise<Tag[]>;
  search(query?: string): Promise<Tag[]>;
}
