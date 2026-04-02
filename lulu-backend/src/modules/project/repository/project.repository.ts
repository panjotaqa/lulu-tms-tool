import { ConflictException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BaseRepository } from '../../core/database/base.repository';
import { QueryProjectDto } from '../models/dto/query-project.dto';
import { Project } from '../models/entity/project.entity';
import { IProjectRepository } from './project.repository.interface';

@Injectable()
export class ProjectRepository
  extends BaseRepository<Project>
  implements IProjectRepository
{
  constructor(
    @InjectRepository(Project)
    private readonly projectRepository: Repository<Project>,
  ) {
    super(projectRepository);
  }

  async findPaginated(
    queryDto: QueryProjectDto,
    userId: string,
    isArchived: boolean,
  ): Promise<{ projects: Project[]; total: number }> {
    const { page = 1, limit = 10 } = queryDto;
    const skip = (page - 1) * limit;

    const queryBuilder = this.projectRepository
      .createQueryBuilder('project')
      .leftJoinAndSelect('project.createdBy', 'createdBy')
      .leftJoinAndSelect('project.users', 'users')
      .where('project.isArchived = :isArchived', { isArchived })
      .andWhere('(project.createdBy.id = :userId OR users.id = :userId)', {
        userId,
      })
      .orderBy('project.createdAt', 'DESC')
      .distinct(true);

    const total = await queryBuilder.getCount();
    const projects = await queryBuilder.skip(skip).take(limit).getMany();

    return { projects, total };
  }

  async validateUniqueTitle(title: string, excludeId?: string): Promise<void> {
    const existingProject = await this.findOne({ where: { title } });
    if (existingProject && existingProject.id !== excludeId) {
      throw new ConflictException('Já existe um projeto com este título');
    }
  }

  async validateUniqueSlug(slug: string, excludeId?: string): Promise<void> {
    const existingProject = await this.findOne({ where: { slug } });
    if (existingProject && existingProject.id !== excludeId) {
      throw new ConflictException('Já existe um projeto com este slug');
    }
  }
}
