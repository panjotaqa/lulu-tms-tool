import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsEnum, IsInt, IsOptional, IsUUID, Max, Min } from 'class-validator';
import { TestRunStatus } from '../enums/testrun-status.enum';

export class QueryTestRunDto {
  @ApiProperty({
    description: 'Número da página',
    example: 1,
    default: 1,
    required: false,
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt({ message: 'Página deve ser um número inteiro' })
  @Min(1, { message: 'Página deve ser no mínimo 1' })
  page?: number = 1;

  @ApiProperty({
    description: 'Quantidade de itens por página',
    example: 10,
    default: 10,
    minimum: 10,
    maximum: 100,
    required: false,
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt({ message: 'Limite deve ser um número inteiro' })
  @Min(10, { message: 'Limite deve ser no mínimo 10' })
  @Max(100, { message: 'Limite deve ser no máximo 100' })
  limit?: number = 10;

  @ApiProperty({
    description: 'ID do projeto para filtrar',
    example: '123e4567-e89b-12d3-a456-426614174000',
    required: false,
  })
  @IsOptional()
  @IsUUID('4', { message: 'projectId deve ser um UUID válido' })
  projectId?: string;

  @ApiProperty({
    description: 'Status da execução de teste para filtrar',
    enum: TestRunStatus,
    example: TestRunStatus.IN_PROGRESS,
    required: false,
  })
  @IsOptional()
  @IsEnum(TestRunStatus, { message: 'Status inválido' })
  status?: TestRunStatus;
}

