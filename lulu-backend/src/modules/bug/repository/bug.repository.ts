import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EntityManager, Repository } from 'typeorm';
import { BaseRepository } from '@/modules/core/database/base.repository';
import { Bug } from '../models/entity/bug.entity';
import {
  FindBugsByProjectParams,
  IBugRepository,
} from './bug.repository.interface';

@Injectable()
export class BugRepository extends BaseRepository<Bug> implements IBugRepository {
  constructor(
    @InjectRepository(Bug)
    private readonly bugRepository: Repository<Bug>,
  ) {
    super(bugRepository);
  }

  async getNextBugSequence(
    projectId: string,
    entityManager?: EntityManager,
  ): Promise<number> {
    const manager = entityManager || this.bugRepository.manager;
    const count = await manager.count(Bug, { where: { projectId } });
    return count + 1;
  }

  async findByProjectWithFilters(
    params: FindBugsByProjectParams,
  ): Promise<[Bug[], number]> {
    const {
      projectId,
      status,
      severity,
      priority,
      assignedToId,
      search,
      page = 1,
      limit = 10,
    } = params;
    const skip = (page - 1) * limit;
    const queryBuilder = this.bugRepository
      .createQueryBuilder('bug')
      .leftJoinAndSelect('bug.bugTags', 'bugTags')
      .leftJoinAndSelect('bugTags.tag', 'tag')
      .leftJoinAndSelect('bug.assignedTo', 'assignedTo')
      .leftJoinAndSelect('bug.createdBy', 'createdBy')
      .leftJoinAndSelect('bug.testCase', 'testCase')
      .where('bug.projectId = :projectId', { projectId });
    if (status) {
      queryBuilder.andWhere('bug.status = :status', { status });
    }
    if (severity) {
      queryBuilder.andWhere('bug.severity = :severity', { severity });
    }
    if (priority) {
      queryBuilder.andWhere('bug.priority = :priority', { priority });
    }
    if (assignedToId) {
      queryBuilder.andWhere('bug.assignedToId = :assignedToId', {
        assignedToId,
      });
    }
    if (search) {
      queryBuilder.andWhere(
        '(bug.title ILIKE :search OR bug.bugId ILIKE :search)',
        { search: `%${search}%` },
      );
    }
    queryBuilder.orderBy('bug.createdAt', 'DESC');
    const total = await queryBuilder.getCount();
    const bugs = await queryBuilder.skip(skip).take(limit).getMany();
    return [bugs, total];
  }

  async findOneWithRelations(id: string): Promise<Bug | null> {
    return this.bugRepository.findOne({
      where: { id },
      relations: [
        'project',
        'bugTags',
        'bugTags.tag',
        'application',
        'testCase',
        'testRunCase',
        'assignedTo',
        'createdBy',
      ],
    });
  }
}
