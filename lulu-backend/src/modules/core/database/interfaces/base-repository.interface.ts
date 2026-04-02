import { FindManyOptions, FindOneOptions, DeepPartial } from 'typeorm';

export interface IBaseRepository<T> {
  save(entity: DeepPartial<T>): Promise<T>;
  create(entityLike: DeepPartial<T>): T;
  findOne(options: FindOneOptions<T>): Promise<T | null>;
  find(options?: FindManyOptions<T>): Promise<T[]>;
  remove(entity: T): Promise<T>;
}
