import { ApiProperty } from '@nestjs/swagger';
import {
  IsArray,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
  MaxLength,
} from 'class-validator';
import { BugStatus } from '../enums/bug-status.enum';
import { Environment } from '@/modules/testcase/models/enums/environment.enum';
import { Priority } from '@/modules/testcase/models/enums/priority.enum';
import { Severity } from '@/modules/testcase/models/enums/severity.enum';

export class CreateBugDto {
  @ApiProperty({
    description: 'Título do bug',
    example: 'Botão de login não responde',
  })
  @IsNotEmpty({ message: 'Título é obrigatório' })
  @IsString({ message: 'Título deve ser uma string' })
  @MaxLength(255, { message: 'Título deve ter no máximo 255 caracteres' })
  title: string;

  @ApiProperty({
    description: 'ID do projeto',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @IsNotEmpty({ message: 'ID do projeto é obrigatório' })
  @IsUUID('4', { message: 'ID do projeto deve ser um UUID válido' })
  projectId: string;

  @ApiProperty({
    description: 'Descrição do bug',
    required: false,
  })
  @IsOptional()
  @IsString({ message: 'Descrição deve ser uma string' })
  description?: string;

  @ApiProperty({
    description: 'Status do bug',
    enum: BugStatus,
    required: false,
    default: BugStatus.OPEN,
  })
  @IsOptional()
  @IsEnum(BugStatus, { message: 'Status deve ser um valor válido' })
  status?: BugStatus;

  @ApiProperty({
    description: 'Severidade',
    enum: Severity,
    required: false,
  })
  @IsOptional()
  @IsEnum(Severity, { message: 'Severity deve ser um valor válido' })
  severity?: Severity;

  @ApiProperty({
    description: 'Prioridade',
    enum: Priority,
    required: false,
  })
  @IsOptional()
  @IsEnum(Priority, { message: 'Priority deve ser um valor válido' })
  priority?: Priority;

  @ApiProperty({
    description: 'Ambiente',
    enum: Environment,
    required: false,
  })
  @IsOptional()
  @IsEnum(Environment, { message: 'Environment deve ser um valor válido' })
  environment?: Environment;

  @ApiProperty({
    description: 'ID da aplicação vinculada',
    required: false,
  })
  @IsOptional()
  @IsUUID('4', { message: 'ID da aplicação deve ser um UUID válido' })
  applicationId?: string;

  @ApiProperty({
    description: 'ID do caso de teste vinculado',
    required: false,
  })
  @IsOptional()
  @IsUUID('4', { message: 'ID do caso de teste deve ser um UUID válido' })
  testCaseId?: string;

  @ApiProperty({
    description: 'ID do caso de execução de test run vinculado',
    required: false,
  })
  @IsOptional()
  @IsUUID('4', { message: 'ID do caso de execução deve ser um UUID válido' })
  testRunCaseId?: string;

  @ApiProperty({
    description: 'ID do usuário responsável',
    required: false,
  })
  @IsOptional()
  @IsUUID('4', { message: 'ID do responsável deve ser um UUID válido' })
  assignedToId?: string;

  @ApiProperty({
    description: 'Tags do bug',
    example: ['UI', 'Regression'],
    required: false,
    type: [String],
  })
  @IsOptional()
  @IsArray({ message: 'Tags deve ser um array' })
  @IsString({ each: true, message: 'Cada tag deve ser uma string' })
  tags?: string[];
}
