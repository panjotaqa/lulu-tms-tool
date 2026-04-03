import {
  Body,
  Controller,
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
import { TestCaseControllerDocs } from './testcase.controller.doc';
import { TESTCASE_SERVICE } from '@/modules/core/constants/services.constants';
import { JwtAuthGuard } from '@/modules/auth/guards/jwt-auth.guard';
import { CurrentUser } from '@/modules/auth/decorators/current-user.decorator';
import { CreateTestCaseDto } from '../models/dto/create-testcase.dto';
import { CreateBulkTestCasesDto } from '../models/dto/create-bulk-testcases.dto';
import { UpdateTestCaseDto } from '../models/dto/update-testcase.dto';
import { QueryTestCaseDto } from '../models/dto/query-testcase.dto';
import { MoveTestCasesDto } from '../models/dto/move-testcases.dto';
import {
  BulkCreateTestCaseResponse,
  PaginatedTestCaseResponse,
  TestCaseListItemResponse,
  TestCaseResponse,
} from '../models/types/testcase-response.type';
import { TestCaseService } from '../service/testcase.service';

@ApiTags('testcases')
@Controller('testcases')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class TestCaseController {
  constructor(
    @Inject(TESTCASE_SERVICE)
    private readonly testCaseService: TestCaseService,
  ) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @TestCaseControllerDocs.create()
  async create(
    @Body() createTestCaseDto: CreateTestCaseDto,
    @CurrentUser() userId: string,
  ): Promise<TestCaseResponse> {
    return this.testCaseService.create(createTestCaseDto, userId);
  }

  @Post('bulk')
  @HttpCode(HttpStatus.CREATED)
  @TestCaseControllerDocs.createBulk()
  async createBulk(
    @Body() createBulkDto: CreateBulkTestCasesDto,
    @CurrentUser() userId: string,
  ): Promise<BulkCreateTestCaseResponse> {
    return this.testCaseService.createBulk(createBulkDto, userId);
  }

  @Patch('move')
  @HttpCode(HttpStatus.OK)
  @TestCaseControllerDocs.moveTestCases()
  async moveTestCases(
    @Body() moveDto: MoveTestCasesDto,
    @CurrentUser('id') userId: string,
  ): Promise<TestCaseResponse[]> {
    return this.testCaseService.moveTestCases(
      moveDto.testCaseIds,
      moveDto.targetFolderId,
      userId,
    );
  }

  @Patch(':id')
  @HttpCode(HttpStatus.OK)
  @TestCaseControllerDocs.update()
  async update(
    @Param('id') id: string,
    @Body() updateDto: UpdateTestCaseDto,
  ): Promise<TestCaseResponse> {
    return this.testCaseService.update(id, updateDto);
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  @TestCaseControllerDocs.findOne()
  async findOne(@Param('id') id: string): Promise<TestCaseResponse> {
    return this.testCaseService.findOne(id);
  }

  @Get('project/:projectId/list')
  @HttpCode(HttpStatus.OK)
  @TestCaseControllerDocs.findByProjectForSelection()
  async findByProjectForSelection(
    @Param('projectId') projectId: string,
  ): Promise<TestCaseListItemResponse[]> {
    return this.testCaseService.findByProjectForSelection(projectId);
  }

  @Get('folder/:folderId')
  @HttpCode(HttpStatus.OK)
  @TestCaseControllerDocs.findByFolder()
  async findByFolder(
    @Param('folderId') folderId: string,
    @Query() queryDto: QueryTestCaseDto,
  ): Promise<PaginatedTestCaseResponse> {
    return this.testCaseService.findByFolder(folderId, queryDto);
  }
}
