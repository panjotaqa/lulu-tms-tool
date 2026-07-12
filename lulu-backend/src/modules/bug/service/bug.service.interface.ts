import { CreateBugDto } from '../models/dto/create-bug.dto';
import { QueryBugDto } from '../models/dto/query-bug.dto';
import { UpdateBugDto } from '../models/dto/update-bug.dto';
import {
  BugResponse,
  PaginatedBugResponse,
} from '../models/types/bug-response.type';

export interface IBugService {
  create(createBugDto: CreateBugDto, userId: string): Promise<BugResponse>;
  findAll(queryDto: QueryBugDto, userId: string): Promise<PaginatedBugResponse>;
  findOne(id: string, userId: string): Promise<BugResponse>;
  update(
    id: string,
    updateBugDto: UpdateBugDto,
    userId: string,
  ): Promise<BugResponse>;
  remove(id: string, userId: string): Promise<void>;
}
