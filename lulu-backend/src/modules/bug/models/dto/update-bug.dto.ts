import { ApiProperty } from '@nestjs/swagger';
import {
  IsArray,
  IsEnum,
  IsOptional,
  IsString,
  IsUUID,
  MaxLength,
} from 'class-validator';
import { BugStatus } from '../enums/bug-status.enum';
import { Environment } from '@/modules/testcase/models/enums/environment.enum';
import { Priority } from '@/modules/testcase/models/enums/priority.enum';
import { Severity } from '@/modules/testcase/models/enums/severity.enum';

export class UpdateBugDto {
  @ApiProperty({ required: false })
  @IsOptional()
  @IsString({ message: 'Título deve ser uma string' })
  @MaxLength(255, { message: 'Título deve ter no máximo 255 caracteres' })
  title?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString({ message: 'Descrição deve ser uma string' })
  description?: string;

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

  @ApiProperty({ enum: Environment, required: false })
  @IsOptional()
  @IsEnum(Environment, { message: 'Environment deve ser um valor válido' })
  environment?: Environment;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsUUID('4', { message: 'ID da aplicação deve ser um UUID válido' })
  applicationId?: string | null;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsUUID('4', { message: 'ID do caso de teste deve ser um UUID válido' })
  testCaseId?: string | null;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsUUID('4', { message: 'ID do caso de execução deve ser um UUID válido' })
  testRunCaseId?: string | null;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsUUID('4', { message: 'ID do responsável deve ser um UUID válido' })
  assignedToId?: string | null;

  @ApiProperty({ type: [String], required: false })
  @IsOptional()
  @IsArray({ message: 'Tags deve ser um array' })
  @IsString({ each: true, message: 'Cada tag deve ser uma string' })
  tags?: string[];
}
