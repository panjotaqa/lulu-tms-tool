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
import { TestRunControllerDocs } from './testrun.controller.doc';
import { TESTRUN_SERVICE } from '@/modules/core/constants/services.constants';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../../auth/decorators/current-user.decorator';
import { CreateTestRunDto } from '../models/dto/create-testrun.dto';
import { QueryTestRunDto } from '../models/dto/query-testrun.dto';
import { UpdateTestRunCaseStatusDto } from '../models/dto/update-testrun-case-status.dto';
import { UpdateTestRunCaseEvidenceDto } from '../models/dto/update-testrun-case-evidence.dto';
import {
  PaginatedTestRunListItemResponse,
  TestRunCaseResponse,
  TestRunResponse,
} from '../models/types/testrun-response.type';
import { TestRunService } from '../service/testrun.service';

@ApiTags('testruns')
@Controller('testruns')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class TestRunController {
  constructor(
    @Inject(TESTRUN_SERVICE)
    private readonly testRunService: TestRunService,
  ) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @TestRunControllerDocs.create()
  async create(
    @Body() createTestRunDto: CreateTestRunDto,
    @CurrentUser('id') userId: string,
  ): Promise<TestRunResponse> {
    return this.testRunService.create(createTestRunDto, userId);
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  @TestRunControllerDocs.findAll()
  async findAll(
    @Query() queryDto: QueryTestRunDto,
  ): Promise<PaginatedTestRunListItemResponse> {
    return this.testRunService.findAllList(queryDto);
  }

  @Get('project/:projectId')
  @HttpCode(HttpStatus.OK)
  @TestRunControllerDocs.findByProject()
  async findByProject(
    @Param('projectId') projectId: string,
    @Query() queryDto: QueryTestRunDto,
  ): Promise<PaginatedTestRunListItemResponse> {
    const queryWithProjectId: QueryTestRunDto = {
      ...queryDto,
      projectId,
    };
    return this.testRunService.findAllList(queryWithProjectId);
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  @TestRunControllerDocs.findOne()
  async findOne(@Param('id') id: string): Promise<TestRunResponse> {
    return this.testRunService.findOne(id);
  }

  @Patch(':testRunId/cases/:testRunCaseId/status')
  @HttpCode(HttpStatus.OK)
  @TestRunControllerDocs.updateTestCaseStatus()
  async updateTestCaseStatus(
    @Param('testRunId') testRunId: string,
    @Param('testRunCaseId') testRunCaseId: string,
    @Body() updateDto: UpdateTestRunCaseStatusDto,
  ): Promise<TestRunCaseResponse> {
    return this.testRunService.updateTestCaseStatus(
      testRunId,
      testRunCaseId,
      updateDto,
    );
  }

  @Patch('cases/:testRunCaseId/evidence')
  @HttpCode(HttpStatus.OK)
  @TestRunControllerDocs.updateTestCaseEvidence()
  async updateTestCaseEvidence(
    @Param('testRunCaseId') testRunCaseId: string,
    @Body() updateDto: UpdateTestRunCaseEvidenceDto,
  ): Promise<TestRunCaseResponse> {
    return this.testRunService.updateTestCaseEvidenceById(
      testRunCaseId,
      updateDto,
    );
  }
}
