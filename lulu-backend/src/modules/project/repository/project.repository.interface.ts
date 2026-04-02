import { IBaseRepository } from '../../core/database/interfaces/base-repository.interface';
import { QueryProjectDto } from '../models/dto/query-project.dto';
import { Project } from '../models/entity/project.entity';

export interface IProjectRepository extends IBaseRepository<Project> {
  findPaginated(
    queryDto: QueryProjectDto,
    userId: string,
    isArchived: boolean,
  ): Promise<{ projects: Project[]; total: number }>;

  validateUniqueTitle(title: string, excludeId?: string): Promise<void>;
  validateUniqueSlug(slug: string, excludeId?: string): Promise<void>;
}
