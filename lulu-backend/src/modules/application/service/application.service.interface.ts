import { CreateApplicationDto } from '../models/dto/create-application.dto';
import { QueryApplicationDto } from '../models/dto/query-application.dto';
import { UpdateApplicationDto } from '../models/dto/update-application.dto';
import {
  ApplicationResponse,
  PaginatedApplicationResponse,
} from '../models/types/application-response.type';

export interface IApplicationService {
  create(
    createApplicationDto: CreateApplicationDto,
    userId: string,
  ): Promise<ApplicationResponse>;
  findAll(
    queryDto: QueryApplicationDto,
    userId: string,
  ): Promise<PaginatedApplicationResponse>;
  findOne(id: string, userId: string): Promise<ApplicationResponse>;
  update(
    id: string,
    updateApplicationDto: UpdateApplicationDto,
    userId: string,
  ): Promise<ApplicationResponse>;
  remove(id: string, userId: string): Promise<void>;
}
