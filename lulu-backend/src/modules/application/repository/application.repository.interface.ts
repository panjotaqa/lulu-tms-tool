import { Application } from '../models/entity/application.entity';
import { IBaseRepository } from '@/modules/core/database/interfaces/base-repository.interface';

export type IApplicationRepository = IBaseRepository<Application>;
