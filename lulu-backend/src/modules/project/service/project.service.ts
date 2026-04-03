import {
  BadRequestException,
  ConflictException,
  Inject,
  Injectable,
  NotFoundException,
  forwardRef,
} from '@nestjs/common';
import { DataSource } from 'typeorm';
import { DebugLoggerService } from '../../core/logger/debug-logger.service';
import { FolderService } from '../../folder/service/folder.service';
import { UserService } from '../../user/service/user.service';
import { CreateProjectDto } from '../models/dto/create-project.dto';
import { LinkUserDto } from '../models/dto/link-user.dto';
import { QueryProjectDto } from '../models/dto/query-project.dto';
import { UpdateProjectDto } from '../models/dto/update-project.dto';
import { Project } from '../models/entity/project.entity';
import { User } from '../../user/models/entity/user.entity';
import {
  PaginatedProjectResponse,
  ProjectResponse,
} from '../models/types/project-response.type';
import type { IProjectRepository } from '../repository/project.repository.interface';
import { IProjectService } from './project.service.interface';
import { PROJECT_REPOSITORY } from '@/modules/core/constants/repositories.constants';
import {
  USER_SERVICE,
  FOLDER_SERVICE,
} from '@/modules/core/constants/services.constants';

@Injectable()
export class ProjectService implements IProjectService {
  constructor(
    @Inject(PROJECT_REPOSITORY)
    private readonly projectRepository: IProjectRepository,
    @Inject(USER_SERVICE)
    private readonly userService: UserService,
    @Inject(forwardRef(() => FOLDER_SERVICE))
    private readonly _folderService: FolderService,
    private readonly dataSource: DataSource,
    private readonly debugLogger: DebugLoggerService,
  ) {}

  async create(
    createProjectDto: CreateProjectDto,
    userId: string,
  ): Promise<ProjectResponse> {
    this.debugLogger.debug('ProjectService', 'Criando novo projeto', {
      title: createProjectDto.title,
      slug: createProjectDto.slug,
      userId,
    });

    await this.projectRepository.validateUniqueTitle(createProjectDto.title);
    await this.projectRepository.validateUniqueSlug(createProjectDto.slug);
    const creator = await this.userService.findOne(userId);

    // Usar transação para garantir atomicidade
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      // Criar projeto
      const project = this.projectRepository.create({
        ...createProjectDto,
        createdBy: creator,
      });
      const savedProject = await queryRunner.manager.save(Project, project);
      savedProject.users = [creator];
      const projectWithUsers = await queryRunner.manager.save(
        Project,
        savedProject,
      );

      this.debugLogger.debug('ProjectService', 'Projeto criado', {
        id: projectWithUsers.id,
        title: projectWithUsers.title,
      });

      await queryRunner.commitTransaction();

      this.debugLogger.debug('ProjectService', 'Projeto criado com sucesso', {
        id: projectWithUsers.id,
      });

      return this.mapToResponse(projectWithUsers);
    } catch (error) {
      this.debugLogger.debug('ProjectService', 'Erro ao criar projeto', {
        error: error instanceof Error ? error.message : String(error),
      });
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  async findAll(
    queryDto: QueryProjectDto,
    userId: string,
  ): Promise<PaginatedProjectResponse> {
    const { page = 1, limit = 10, isArchived = false } = queryDto;

    const { projects, total } = await this.projectRepository.findPaginated(
      queryDto,
      userId,
      isArchived,
    );

    return {
      data: projects.map((project) => this.mapToResponse(project)),
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async findArchived(
    queryDto: QueryProjectDto,
    userId: string,
  ): Promise<PaginatedProjectResponse> {
    const { page = 1, limit = 10 } = queryDto;

    const { projects, total } = await this.projectRepository.findPaginated(
      queryDto,
      userId,
      true, // isArchived = true
    );

    return {
      data: projects.map((project) => this.mapToResponse(project)),
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async findOne(id: string): Promise<ProjectResponse> {
    const project = await this.projectRepository.findOne({
      where: { id },
      relations: ['createdBy', 'users'],
    });
    if (!project) {
      throw new NotFoundException('Projeto não encontrado');
    }
    return this.mapToResponse(project);
  }

  async update(
    id: string,
    updateProjectDto: UpdateProjectDto,
  ): Promise<ProjectResponse> {
    const project = await this.projectRepository.findOne({
      where: { id },
      relations: ['createdBy', 'users'],
    });
    if (!project) {
      throw new NotFoundException('Projeto não encontrado');
    }
    if (updateProjectDto.title && updateProjectDto.title !== project.title) {
      await this.projectRepository.validateUniqueTitle(
        updateProjectDto.title,
        id,
      );
    }
    if (updateProjectDto.slug && updateProjectDto.slug !== project.slug) {
      await this.projectRepository.validateUniqueSlug(
        updateProjectDto.slug,
        id,
      );
    }
    Object.assign(project, updateProjectDto);
    const updatedProject = await this.projectRepository.save(project);
    return this.mapToResponse(updatedProject);
  }

  async archive(id: string): Promise<ProjectResponse> {
    const project = await this.projectRepository.findOne({
      where: { id },
      relations: ['createdBy', 'users'],
    });
    if (!project) {
      throw new NotFoundException('Projeto não encontrado');
    }
    project.isArchived = true;
    const archivedProject = await this.projectRepository.save(project);
    return this.mapToResponse(archivedProject);
  }

  async unarchive(id: string): Promise<ProjectResponse> {
    const project = await this.projectRepository.findOne({
      where: { id },
      relations: ['createdBy', 'users'],
    });
    if (!project) {
      throw new NotFoundException('Projeto não encontrado');
    }
    project.isArchived = false;
    const unarchivedProject = await this.projectRepository.save(project);
    return this.mapToResponse(unarchivedProject);
  }

  async linkUser(
    projectId: string,
    linkUserDto: LinkUserDto,
  ): Promise<ProjectResponse> {
    const project = await this.projectRepository.findOne({
      where: { id: projectId },
      relations: ['createdBy', 'users'],
    });
    if (!project) {
      throw new NotFoundException('Projeto não encontrado');
    }
    try {
      await this.userService.findOne(linkUserDto.userId);
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw new NotFoundException('Usuário não encontrado');
      }
      throw error;
    }
    const isUserAlreadyLinked = project.users.some(
      (user) => user.id === linkUserDto.userId,
    );
    if (isUserAlreadyLinked) {
      throw new ConflictException('Usuário já está vinculado ao projeto');
    }
    const userToLink = await this.userService.findOne(linkUserDto.userId);
    project.users.push(userToLink as unknown as User);
    const updatedProject = await this.projectRepository.save(project);
    return this.mapToResponse(updatedProject);
  }

  async unlinkUser(
    projectId: string,
    linkUserDto: LinkUserDto,
  ): Promise<ProjectResponse> {
    const project = await this.projectRepository.findOne({
      where: { id: projectId },
      relations: ['createdBy', 'users'],
    });
    if (!project) {
      throw new NotFoundException('Projeto não encontrado');
    }
    try {
      await this.userService.findOne(linkUserDto.userId);
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw new NotFoundException('Usuário não encontrado');
      }
      throw error;
    }
    const isUserLinked = project.users.some(
      (user) => user.id === linkUserDto.userId,
    );
    if (!isUserLinked) {
      throw new BadRequestException('Usuário não está vinculado ao projeto');
    }
    project.users = project.users.filter(
      (user) => user.id !== linkUserDto.userId,
    );
    const updatedProject = await this.projectRepository.save(project);
    return this.mapToResponse(updatedProject);
  }

  private mapToResponse(project: Project): ProjectResponse {
    return {
      id: project.id,
      title: project.title,
      slug: project.slug,
      description: project.description,
      isArchived: project.isArchived,
      createdBy: {
        id: project.createdBy.id,
        name: project.createdBy.name,
        email: project.createdBy.email,
      },
      users: project.users.map((user) => ({
        id: user.id,
        name: user.name,
        email: user.email,
      })),
      createdAt: project.createdAt,
      updatedAt: project.updatedAt,
    };
  }
}
