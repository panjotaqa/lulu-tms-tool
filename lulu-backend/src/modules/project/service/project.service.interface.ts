import { CreateProjectDto } from '../models/dto/create-project.dto';
import { LinkUserDto } from '../models/dto/link-user.dto';
import { QueryProjectDto } from '../models/dto/query-project.dto';
import { UpdateProjectDto } from '../models/dto/update-project.dto';
import {
  PaginatedProjectResponse,
  ProjectResponse,
} from '../models/types/project-response.type';

export interface IProjectService {
  create(
    createProjectDto: CreateProjectDto,
    userId: string,
  ): Promise<ProjectResponse>;
  findAll(
    queryDto: QueryProjectDto,
    userId: string,
  ): Promise<PaginatedProjectResponse>;
  findArchived(
    queryDto: QueryProjectDto,
    userId: string,
  ): Promise<PaginatedProjectResponse>;
  findOne(id: string): Promise<ProjectResponse>;
  update(
    id: string,
    updateProjectDto: UpdateProjectDto,
  ): Promise<ProjectResponse>;
  archive(id: string): Promise<ProjectResponse>;
  unarchive(id: string): Promise<ProjectResponse>;
  linkUser(
    projectId: string,
    linkUserDto: LinkUserDto,
  ): Promise<ProjectResponse>;
  unlinkUser(
    projectId: string,
    linkUserDto: LinkUserDto,
  ): Promise<ProjectResponse>;
}
