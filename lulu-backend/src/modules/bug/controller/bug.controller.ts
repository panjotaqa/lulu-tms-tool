import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Inject,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '@/modules/auth/guards/jwt-auth.guard';
import { CurrentUser } from '@/modules/auth/decorators/current-user.decorator';
import { BUG_SERVICE } from '@/modules/core/constants/services.constants';
import { BugControllerDocs } from './bug.controller.doc';
import { CreateBugDto } from '../models/dto/create-bug.dto';
import { QueryBugDto } from '../models/dto/query-bug.dto';
import { UpdateBugDto } from '../models/dto/update-bug.dto';
import {
  BugResponse,
  PaginatedBugResponse,
} from '../models/types/bug-response.type';
import type { IBugService } from '../service/bug.service.interface';

@ApiTags('bugs')
@Controller('bugs')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class BugController {
  constructor(
    @Inject(BUG_SERVICE)
    private readonly bugService: IBugService,
  ) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @BugControllerDocs.create()
  async create(
    @Body() createBugDto: CreateBugDto,
    @CurrentUser() userId: string,
  ): Promise<BugResponse> {
    return this.bugService.create(createBugDto, userId);
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  @BugControllerDocs.findAll()
  async findAll(
    @Query() queryDto: QueryBugDto,
    @CurrentUser() userId: string,
  ): Promise<PaginatedBugResponse> {
    return this.bugService.findAll(queryDto, userId);
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  @BugControllerDocs.findOne()
  async findOne(
    @Param('id') id: string,
    @CurrentUser() userId: string,
  ): Promise<BugResponse> {
    return this.bugService.findOne(id, userId);
  }

  @Patch(':id')
  @HttpCode(HttpStatus.OK)
  @BugControllerDocs.update()
  async update(
    @Param('id') id: string,
    @Body() updateBugDto: UpdateBugDto,
    @CurrentUser() userId: string,
  ): Promise<BugResponse> {
    return this.bugService.update(id, updateBugDto, userId);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @BugControllerDocs.remove()
  async remove(
    @Param('id') id: string,
    @CurrentUser() userId: string,
  ): Promise<void> {
    return this.bugService.remove(id, userId);
  }
}
