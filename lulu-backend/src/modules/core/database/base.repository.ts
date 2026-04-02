import {
  Repository,
  DeepPartial,
  FindManyOptions,
  FindOneOptions,
  ObjectLiteral,
} from 'typeorm';
import { IBaseRepository } from './interfaces/base-repository.interface';

export abstract class BaseRepository<
  T extends ObjectLiteral,
> implements IBaseRepository<T> {
  protected constructor(private readonly entityRepository: Repository<T>) {}

  public save(entity: DeepPartial<T>): Promise<T> {
    return this.entityRepository.save(entity);
  }

  public create(entityLike: DeepPartial<T>): T {
    return this.entityRepository.create(entityLike);
  }

  public findOne(options: FindOneOptions<T>): Promise<T | null> {
    return this.entityRepository.findOne(options);
  }

  public find(options?: FindManyOptions<T>): Promise<T[]> {
    return this.entityRepository.find(options);
  }

  public remove(entity: T): Promise<T> {
    return this.entityRepository.remove(entity);
  }
}
