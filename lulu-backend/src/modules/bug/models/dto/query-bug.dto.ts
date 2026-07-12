import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
  Min,
} from 'class-validator';
import { BugStatus } from '../enums/bug-status.enum';
import { Priority } from '@/modules/testcase/models/enums/priority.enum';
import { Severity } from '@/modules/testcase/models/enums/severity.enum';

export class QueryBugDto {
  @ApiProperty({
    description: 'ID do projeto',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @IsNotEmpty({ message: 'ID do projeto é obrigatório' })
  @IsUUID('4', { message: 'ID do projeto deve ser um UUID válido' })
  projectId: string;

  @ApiProperty({ required: false, default: 1 })
  @IsOptional()
  @Type(() => Number)
  @IsInt({ message: 'Página deve ser um número inteiro' })
  @Min(1, { message: 'Página deve ser maior que 0' })
  page?: number = 1;

  @ApiProperty({ required: false, default: 10 })
  @IsOptional()
  @Type(() => Number)
  @IsInt({ message: 'Limite deve ser um número inteiro' })
  @Min(1, { message: 'Limite deve ser maior que 0' })
  limit?: number = 10;

  @ApiProperty({ enum: BugStatus, required: false })
  @IsOptional()
  @IsEnum(BugStatus, { message: 'Status deve ser um valor válido' })
  status?: BugStatus;

  @ApiProperty({ enum: Severity, required: false })
  @IsOptional()
  @IsEnum(Severity, { message: 'Severity deve ser um valor válido' })
  severity?: Severity;

  @ApiProperty({ enum: Priority, required: false })
  @IsOptional()
  @IsEnum(Priority, { message: 'Priority deve ser um valor válido' })
  priority?: Priority;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsUUID('4', { message: 'ID do responsável deve ser um UUID válido' })
  assignedToId?: string;

  @ApiProperty({
    description: 'Busca por título ou bugId',
    required: false,
  })
  @IsOptional()
  @IsString({ message: 'Busca deve ser uma string' })
  search?: string;
}
