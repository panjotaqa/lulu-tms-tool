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
import { ApplicationControllerDocs } from './application.controller.doc';
import { JwtAuthGuard } from '@/modules/auth/guards/jwt-auth.guard';
import { CurrentUser } from '@/modules/auth/decorators/current-user.decorator';
import { APPLICATION_SERVICE } from '@/modules/core/constants/services.constants';
import { CreateApplicationDto } from '../models/dto/create-application.dto';
import { QueryApplicationDto } from '../models/dto/query-application.dto';
import { UpdateApplicationDto } from '../models/dto/update-application.dto';
import {
  ApplicationResponse,
  PaginatedApplicationResponse,
} from '../models/types/application-response.type';
import { ApplicationService } from '../service/application.service';

@ApiTags('applications')
@Controller('applications')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class ApplicationController {
  constructor(
    @Inject(APPLICATION_SERVICE)
    private readonly applicationService: ApplicationService,
  ) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApplicationControllerDocs.create()
  async create(
    @Body() createApplicationDto: CreateApplicationDto,
    @CurrentUser() userId: string,
  ): Promise<ApplicationResponse> {
    return this.applicationService.create(createApplicationDto, userId);
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  @ApplicationControllerDocs.findAll()
  async findAll(
    @Query() queryDto: QueryApplicationDto,
    @CurrentUser() userId: string,
  ): Promise<PaginatedApplicationResponse> {
    return this.applicationService.findAll(queryDto, userId);
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  @ApplicationControllerDocs.findOne()
  async findOne(
    @Param('id') id: string,
    @CurrentUser() userId: string,
  ): Promise<ApplicationResponse> {
    return this.applicationService.findOne(id, userId);
  }

  @Patch(':id')
  @HttpCode(HttpStatus.OK)
  @ApplicationControllerDocs.update()
  async update(
    @Param('id') id: string,
    @Body() updateApplicationDto: UpdateApplicationDto,
    @CurrentUser() userId: string,
  ): Promise<ApplicationResponse> {
    return this.applicationService.update(id, updateApplicationDto, userId);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApplicationControllerDocs.remove()
  async remove(
    @Param('id') id: string,
    @CurrentUser() userId: string,
  ): Promise<void> {
    return this.applicationService.remove(id, userId);
  }
}
