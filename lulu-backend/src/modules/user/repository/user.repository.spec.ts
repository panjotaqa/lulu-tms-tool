import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BaseRepository } from '../../core/database/base.repository';
import { User } from '../models/entity/user.entity';
import { UserRepository } from '../repository/user.repository';
import { createRepositoryMock } from './user.repository.mock';

describe('UserRepository', () => {
  let repository: UserRepository;
  let _typeOrmRepository: Repository<User>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserRepository,
        {
          provide: getRepositoryToken(User),
          useValue: createRepositoryMock(),
        },
      ],
    }).compile();

    repository = module.get<UserRepository>(UserRepository);
    _typeOrmRepository = module.get<Repository<User>>(getRepositoryToken(User));
  });

  it('should be defined', () => {
    expect(repository).toBeDefined();
  });

  it('should extend BaseRepository', () => {
    expect(repository).toBeInstanceOf(BaseRepository);
  });
});
