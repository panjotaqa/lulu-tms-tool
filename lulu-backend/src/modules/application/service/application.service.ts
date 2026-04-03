import {
  BadRequestException,
  ConflictException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { DebugLoggerService } from '@/modules/core/logger/debug-logger.service';
import { ProjectService } from '@/modules/project/service/project.service';
import { CreateApplicationDto } from '../models/dto/create-application.dto';
import { QueryApplicationDto } from '../models/dto/query-application.dto';
import { UpdateApplicationDto } from '../models/dto/update-application.dto';
import { Application } from '../models/entity/application.entity';
import {
  ApplicationResponse,
  PaginatedApplicationResponse,
} from '../models/types/application-response.type';

import { IApplicationService } from './application.service.interface';
import { APPLICATION_REPOSITORY } from '@/modules/core/constants/repositories.constants';
import { TESTCASE_REPOSITORY } from '@/modules/core/constants/repositories.constants';
import { PROJECT_SERVICE } from '@/modules/core/constants/services.constants';

import { ApplicationRepository } from '../repository/application.repository';
import { TestCaseRepository } from '@/modules/testcase/repository/testcase.repository';

@Injectable()
export class ApplicationService implements IApplicationService {
  constructor(
    @Inject(APPLICATION_REPOSITORY)
    private readonly applicationRepository: ApplicationRepository,
    @Inject(TESTCASE_REPOSITORY)
    private readonly testCaseRepository: TestCaseRepository,
    @Inject(PROJECT_SERVICE)
    private readonly projectService: ProjectService,
    private readonly debugLogger: DebugLoggerService,
  ) {}

  async create(
    createApplicationDto: CreateApplicationDto,
    userId: string,
  ): Promise<ApplicationResponse> {
    this.debugLogger.debug('ApplicationService', 'Criando nova aplicação', {
      name: createApplicationDto.name,
      projectId: createApplicationDto.projectId,
      userId,
    });

    // Verificar se o projeto existe
    const existingProject = await this.projectService.findOne(
      createApplicationDto.projectId,
    );

    if (!existingProject) throw new NotFoundException('Projeto não encontrado');

    // Verificar se já existe aplicação com o mesmo nome no projeto
    const existingApplication = await this.applicationRepository.findOne({
      where: {
        name: createApplicationDto.name,
        projectId: createApplicationDto.projectId,
      },
    });

    if (existingApplication) {
      throw new ConflictException(
        'Já existe uma aplicação com este nome neste projeto',
      );
    }

    // Criar aplicação
    const application = this.applicationRepository.create({
      name: createApplicationDto.name,
      projectId: createApplicationDto.projectId,
    });

    const savedApplication = await this.applicationRepository.save(application);

    this.debugLogger.debug('ApplicationService', 'Aplicação criada', {
      id: savedApplication.id,
      name: savedApplication.name,
    });

    return this.mapToResponse(savedApplication);
  }

  async findAll(
    queryDto: QueryApplicationDto,
    _userId: string,
  ): Promise<PaginatedApplicationResponse> {
    const { projectId, page = 1, limit = 10 } = queryDto;
    const skip = (page - 1) * limit;

    // Verificar se o projeto existe
    try {
      await this.projectService.findOne(projectId);
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw new NotFoundException('Projeto não encontrado');
      }
      throw error;
    }

    const [applications, total] = await this.applicationRepository.findAndCount(
      {
        where: { projectId },
        skip,
        take: limit,
        order: { createdAt: 'DESC' },
      },
    );

    const totalPages = Math.ceil(total / limit);

    return {
      data: applications.map((app) => this.mapToResponse(app)),
      total,
      page,
      limit,
      totalPages,
    };
  }

  async findOne(id: string, _userId: string): Promise<ApplicationResponse> {
    const application = await this.applicationRepository.findOne({
      where: { id },
    });

    if (!application) {
      throw new NotFoundException('Aplicação não encontrada');
    }

    // Verificar se o projeto existe
    try {
      await this.projectService.findOne(application.projectId);
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw new NotFoundException('Projeto não encontrado');
      }
      throw error;
    }

    return this.mapToResponse(application);
  }

  async update(
    id: string,
    updateApplicationDto: UpdateApplicationDto,
    _userId: string,
  ): Promise<ApplicationResponse> {
    const application = await this.applicationRepository.findOne({
      where: { id },
    });

    if (!application) {
      throw new NotFoundException('Aplicação não encontrada');
    }

    // Verificar se o projeto existe
    try {
      await this.projectService.findOne(application.projectId);
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw new NotFoundException('Projeto não encontrado');
      }
      throw error;
    }

    // Se o nome está sendo atualizado, verificar se já existe outro com o mesmo nome
    if (
      updateApplicationDto.name &&
      updateApplicationDto.name !== application.name
    ) {
      const existingApplication = await this.applicationRepository.findOne({
        where: {
          name: updateApplicationDto.name,
          projectId: application.projectId,
        },
      });

      if (existingApplication && existingApplication.id !== id) {
        throw new ConflictException(
          'Já existe uma aplicação com este nome neste projeto',
        );
      }
    }

    // Atualizar aplicação
    if (updateApplicationDto.name) {
      application.name = updateApplicationDto.name;
    }

    const updatedApplication =
      await this.applicationRepository.save(application);

    this.debugLogger.debug('ApplicationService', 'Aplicação atualizada', {
      id: updatedApplication.id,
      name: updatedApplication.name,
    });

    return this.mapToResponse(updatedApplication);
  }

  async remove(id: string, _userId: string): Promise<void> {
    const application = await this.applicationRepository.findOne({
      where: { id },
    });

    if (!application) {
      throw new NotFoundException('Aplicação não encontrada');
    }

    // Verificar se o projeto existe
    try {
      await this.projectService.findOne(application.projectId);
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw new NotFoundException('Projeto não encontrado');
      }
      throw error;
    }

    // Verificar se a aplicação está em uso em casos de teste
    const testCasesUsingApplication = await this.testCaseRepository.count({
      where: { applicationId: id },
    });

    if (testCasesUsingApplication > 0) {
      throw new BadRequestException(
        `Não é possível deletar a aplicação pois ela está sendo usada em ${testCasesUsingApplication} caso(s) de teste`,
      );
    }

    await this.applicationRepository.remove(application);

    this.debugLogger.debug('ApplicationService', 'Aplicação deletada', {
      id,
    });
  }

  private mapToResponse(application: Application): ApplicationResponse {
    return {
      id: application.id,
      name: application.name,
      projectId: application.projectId,
      createdAt: application.createdAt,
      updatedAt: application.updatedAt,
    };
  }
}
