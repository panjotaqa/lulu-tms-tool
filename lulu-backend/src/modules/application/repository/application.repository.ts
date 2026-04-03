import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BaseRepository } from '@/modules/core/database/base.repository';
import { Application } from '../models/entity/application.entity';
import { IApplicationRepository } from './application.repository.interface';

@Injectable()
export class ApplicationRepository
  extends BaseRepository<Application>
  implements IApplicationRepository
{
  constructor(
    @InjectRepository(Application)
    private readonly applicationRepository: Repository<Application>,
  ) {
    super(applicationRepository);
  }
}
