import {
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Query,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { QueryTagDto } from './models/dto/query-tag.dto';
import { TagService } from './tag.service';
import { TagResponse } from './models/types/tag-response.type';

@ApiTags('tags')
@Controller('tags')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class TagController {
  constructor(private readonly tagService: TagService) {}

  @Get()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Buscar tags' })
  @ApiQuery({
    name: 'search',
    required: false,
    type: String,
    description: 'Termo de busca para filtrar tags por nome',
    example: 'automação',
  })
  @ApiResponse({
    status: 200,
    description: 'Lista de tags retornada com sucesso',
    schema: {
      example: [
        {
          id: '123e4567-e89b-12d3-a456-426614174000',
          name: 'automação',
        },
        {
          id: '123e4567-e89b-12d3-a456-426614174001',
          name: 'regressão',
        },
      ],
    },
  })
  async findAll(@Query() queryDto: QueryTagDto): Promise<TagResponse[]> {
    const tags = await this.tagService.findAll(queryDto.search);
    return tags.map((tag) => ({
      id: tag.id,
      name: tag.name,
    }));
  }
}

