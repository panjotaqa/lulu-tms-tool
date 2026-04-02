import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
  Inject,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../../auth/decorators/current-user.decorator';
import { CreateProjectDto } from '../models/dto/create-project.dto';
import { LinkUserDto } from '../models/dto/link-user.dto';
import { QueryProjectDto } from '../models/dto/query-project.dto';
import { UpdateProjectDto } from '../models/dto/update-project.dto';
import {
  PaginatedProjectResponse,
  ProjectResponse,
} from '../models/types/project-response.type';
import type { IProjectService } from '../service/project.service.interface';
import { ProjectControllerDocs } from './project.controller.doc';

const docs = ProjectControllerDocs();

@ApiTags('projects')
@Controller('projects')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class ProjectController {
  constructor(
    @Inject('IProjectService')
    private readonly projectService: IProjectService,
  ) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @docs.create
  async create(
    @Body() createProjectDto: CreateProjectDto,
    @CurrentUser() userId: string,
  ): Promise<ProjectResponse> {
    return this.projectService.create(createProjectDto, userId);
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  @docs.findAll
  async findAll(
    @Query() queryDto: QueryProjectDto,
    @CurrentUser() userId: string,
  ): Promise<PaginatedProjectResponse> {
    return this.projectService.findAll(queryDto, userId);
  }

  @Get('archived')
  @HttpCode(HttpStatus.OK)
  @docs.findArchived
  async findArchived(
    @Query() queryDto: QueryProjectDto,
    @CurrentUser() userId: string,
  ): Promise<PaginatedProjectResponse> {
    return this.projectService.findArchived(queryDto, userId);
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  @docs.findOne
  async findOne(@Param('id') id: string): Promise<ProjectResponse> {
    return this.projectService.findOne(id);
  }

  @Patch(':id')
  @HttpCode(HttpStatus.OK)
  @docs.update
  async update(
    @Param('id') id: string,
    @Body() updateProjectDto: UpdateProjectDto,
  ): Promise<ProjectResponse> {
    return this.projectService.update(id, updateProjectDto);
  }

  @Patch(':id/archive')
  @HttpCode(HttpStatus.OK)
  @docs.archive
  async archive(@Param('id') id: string): Promise<ProjectResponse> {
    return this.projectService.archive(id);
  }

  @Patch(':id/unarchive')
  @HttpCode(HttpStatus.OK)
  @docs.unarchive
  async unarchive(@Param('id') id: string): Promise<ProjectResponse> {
    return this.projectService.unarchive(id);
  }

  @Post(':id/users')
  @HttpCode(HttpStatus.OK)
  @docs.linkUser
  async linkUser(
    @Param('id') id: string,
    @Body() linkUserDto: LinkUserDto,
  ): Promise<ProjectResponse> {
    return this.projectService.linkUser(id, linkUserDto);
  }

  @Delete(':id/users')
  @HttpCode(HttpStatus.OK)
  @docs.unlinkUser
  async unlinkUser(
    @Param('id') id: string,
    @Body() linkUserDto: LinkUserDto,
  ): Promise<ProjectResponse> {
    return this.projectService.unlinkUser(id, linkUserDto);
  }
}
