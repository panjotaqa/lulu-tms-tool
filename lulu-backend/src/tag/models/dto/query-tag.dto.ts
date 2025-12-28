import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString, MaxLength } from 'class-validator';

export class QueryTagDto {
  @ApiProperty({
    description: 'Termo de busca para filtrar tags por nome',
    example: 'automação',
    required: false,
  })
  @IsOptional()
  @IsString({ message: 'Search deve ser uma string' })
  @MaxLength(255, { message: 'Search não pode ter mais de 255 caracteres' })
  search?: string;
}

