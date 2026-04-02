import {
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { TagControllerDocs } from './tag.controller.doc';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { QueryTagDto } from '../models/dto/query-tag.dto';
import { TagService } from '../service/tag.service';
import { TagResponse } from '../models/types/tag-response.type';

@ApiTags('tags')
@Controller('tags')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class TagController {
  constructor(private readonly tagService: TagService) {}

  @Get()
  @HttpCode(HttpStatus.OK)
  @TagControllerDocs.findAll()
  async findAll(@Query() queryDto: QueryTagDto): Promise<TagResponse[]> {
    const tags = await this.tagService.findAll(queryDto.search);
    return tags.map((tag) => ({
      id: tag.id,
      name: tag.name,
    }));
  }
}
