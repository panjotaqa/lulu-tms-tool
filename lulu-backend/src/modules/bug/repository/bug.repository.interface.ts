import { EntityManager } from 'typeorm';
import { IBaseRepository } from '@/modules/core/database/interfaces/base-repository.interface';
import { BugStatus } from '../models/enums/bug-status.enum';
import { Bug } from '../models/entity/bug.entity';
import { Priority } from '@/modules/testcase/models/enums/priority.enum';
import { Severity } from '@/modules/testcase/models/enums/severity.enum';

export interface FindBugsByProjectParams {
  projectId: string;
  status?: BugStatus;
  severity?: Severity;
  priority?: Priority;
  assignedToId?: string;
  search?: string;
  page?: number;
  limit?: number;
}

export interface IBugRepository extends IBaseRepository<Bug> {
  getNextBugSequence(projectId: string, entityManager?: EntityManager): Promise<number>;
  findByProjectWithFilters(params: FindBugsByProjectParams): Promise<[Bug[], number]>;
  findOneWithRelations(id: string): Promise<Bug | null>;
}
