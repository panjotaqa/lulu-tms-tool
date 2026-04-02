import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
  UseGuards,
  Inject,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '@/modules/auth/guards/jwt-auth.guard';
import { CurrentUser } from '@/modules/auth/decorators/current-user.decorator';
import { CreateFolderDto } from '../models/dto/create-folder.dto';
import { MoveFolderDto } from '../models/dto/move-folder.dto';
import { ReorderFolderDto } from '../models/dto/reorder-folder.dto';
import { UpdateFolderTitleDto } from '../models/dto/update-folder-title.dto';
import {
  FolderResponse,
  FolderTreeResponse,
} from '../models/types/folder-response.type';
import type { IFolderService } from '../service/folder.service.interface';
import { FolderControllerDocs } from './folder.controller.doc';

const docs = FolderControllerDocs;

@ApiTags('folders')
@Controller('folders')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class FolderController {
  constructor(
    @Inject('IFolderService')
    private readonly folderService: IFolderService,
  ) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @docs.create()
  async create(
    @Body() createFolderDto: CreateFolderDto,
    @CurrentUser() userId: string,
  ): Promise<FolderResponse> {
    return this.folderService.create(createFolderDto, userId);
  }

  @Patch(':id/title')
  @HttpCode(HttpStatus.OK)
  @docs.updateTitle()
  async updateTitle(
    @Param('id') id: string,
    @Body() updateDto: UpdateFolderTitleDto,
  ): Promise<FolderResponse> {
    return this.folderService.updateTitle(id, updateDto);
  }

  @Patch(':id/move')
  @HttpCode(HttpStatus.OK)
  @docs.move()
  async move(
    @Param('id') id: string,
    @Body() moveDto: MoveFolderDto,
  ): Promise<FolderResponse> {
    return this.folderService.move(id, moveDto);
  }

  @Patch(':id/reorder')
  @HttpCode(HttpStatus.OK)
  @docs.reorder()
  async reorder(
    @Param('id') id: string,
    @Body() reorderDto: ReorderFolderDto,
  ): Promise<FolderResponse> {
    return this.folderService.reorder(id, reorderDto);
  }

  @Get('projects/:projectId')
  @HttpCode(HttpStatus.OK)
  @docs.findByProject()
  async findByProject(
    @Param('projectId') projectId: string,
  ): Promise<FolderTreeResponse> {
    return this.folderService.findByProject(projectId);
  }

  @Get(':id/hierarchy')
  @HttpCode(HttpStatus.OK)
  @docs.getHierarchy()
  async getHierarchy(@Param('id') id: string): Promise<FolderResponse[]> {
    return this.folderService.getFolderHierarchy(id);
  }
}
