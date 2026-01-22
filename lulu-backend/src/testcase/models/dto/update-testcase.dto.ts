import { ApiProperty } from '@nestjs/swagger';
import {
  IsArray,
  IsBoolean,
  IsEnum,
  IsOptional,
  IsString,
  IsUUID,
  MaxLength,
} from 'class-validator';
import { AutomationStatus } from '../enums/automation-status.enum';
import { Environment } from '../enums/environment.enum';
import { Layer } from '../enums/layer.enum';
import { Priority } from '../enums/priority.enum';
import { Severity } from '../enums/severity.enum';
import { Status } from '../enums/status.enum';
import { TestType } from '../enums/test-type.enum';

export class UpdateTestCaseDto {
  @ApiProperty({
    description: 'Título do caso de teste',
    example: 'Validar login com credenciais corretas',
    required: false,
  })
  @IsOptional()
  @IsString({ message: 'Título deve ser uma string' })
  @MaxLength(255, { message: 'Título deve ter no máximo 255 caracteres' })
  title?: string;

  @ApiProperty({
    description: 'ID da pasta (Test Suite)',
    example: '123e4567-e89b-12d3-a456-426614174000',
    required: false,
  })
  @IsOptional()
  @IsString({ message: 'ID da pasta deve ser uma string' })
  @IsUUID('4', { message: 'ID da pasta deve ser um UUID válido' })
  testSuiteId?: string;

  @ApiProperty({
    description: 'Severidade do caso de teste',
    enum: Severity,
    example: Severity.MAJOR,
    required: false,
  })
  @IsOptional()
  @IsEnum(Severity, { message: 'Severity deve ser um valor válido' })
  severity?: Severity;

  @ApiProperty({
    description: 'Status do caso de teste',
    enum: Status,
    example: Status.ACTIVE,
    required: false,
  })
  @IsOptional()
  @IsEnum(Status, { message: 'Status deve ser um valor válido' })
  status?: Status;

  @ApiProperty({
    description: 'Prioridade do caso de teste',
    enum: Priority,
    example: Priority.HIGH,
    required: false,
  })
  @IsOptional()
  @IsEnum(Priority, { message: 'Priority deve ser um valor válido' })
  priority?: Priority;

  @ApiProperty({
    description: 'Tipo do caso de teste',
    enum: TestType,
    example: TestType.FUNCTIONAL,
    required: false,
  })
  @IsOptional()
  @IsEnum(TestType, { message: 'Type deve ser um valor válido' })
  type?: TestType;

  @ApiProperty({
    description: 'Indica se o caso de teste é flaky',
    example: false,
    required: false,
  })
  @IsOptional()
  @IsBoolean({ message: 'isFlaky deve ser um booleano' })
  isFlaky?: boolean;

  @ApiProperty({
    description: 'Milestone do caso de teste',
    example: 'v1.0',
    required: false,
  })
  @IsOptional()
  @IsString({ message: 'Milestone deve ser uma string' })
  @MaxLength(255, { message: 'Milestone deve ter no máximo 255 caracteres' })
  milestone?: string;

  @ApiProperty({
    description: 'Link da User Story',
    example: 'https://jira.example.com/STORY-123',
    required: false,
  })
  @IsOptional()
  @IsString({ message: 'User Story Link deve ser uma string' })
  @MaxLength(500, {
    message: 'User Story Link deve ter no máximo 500 caracteres',
  })
  userStoryLink?: string;

  @ApiProperty({
    description: 'Camada do teste',
    enum: Layer,
    example: Layer.E2E,
    required: false,
  })
  @IsOptional()
  @IsEnum(Layer, { message: 'Layer deve ser um valor válido' })
  layer?: Layer;

  @ApiProperty({
    description: 'Ambiente do teste',
    enum: Environment,
    example: Environment.INTEGRATION,
    required: false,
  })
  @IsOptional()
  @IsEnum(Environment, { message: 'Environment deve ser um valor válido' })
  environment?: Environment;

  @ApiProperty({
    description: 'Status de automação',
    enum: AutomationStatus,
    example: AutomationStatus.MANUAL,
    required: false,
  })
  @IsOptional()
  @IsEnum(AutomationStatus, {
    message: 'Automation Status deve ser um valor válido',
  })
  automationStatus?: AutomationStatus;

  @ApiProperty({
    description: 'Indica se deve ser automatizado',
    example: false,
    required: false,
  })
  @IsOptional()
  @IsBoolean({ message: 'toBeAutomated deve ser um booleano' })
  toBeAutomated?: boolean;

  @ApiProperty({
    description: 'Descrição do caso de teste (Markdown)',
    example: 'Este teste valida o fluxo de login...',
    required: false,
  })
  @IsOptional()
  @IsString({ message: 'Description deve ser uma string' })
  description?: string;

  @ApiProperty({
    description: 'Pré-condições do caso de teste (Markdown)',
    example: '1. Usuário deve estar cadastrado\n2. Sistema deve estar online',
    required: false,
  })
  @IsOptional()
  @IsString({ message: 'Pre-conditions deve ser uma string' })
  preConditions?: string;

  @ApiProperty({
    description: 'Passos do caso de teste (BDD Gherkin)',
    example: [
      'Given I am on the login page',
      'When I enter valid credentials',
      'Then I should be logged in',
    ],
    required: false,
    type: [String],
  })
  @IsOptional()
  @IsArray({ message: 'Steps deve ser um array' })
  @IsString({ each: true, message: 'Cada step deve ser uma string' })
  steps?: string[];

  @ApiProperty({
    description: 'Tags do caso de teste',
    example: ['UI', 'API', 'Checkout'],
    required: false,
    type: [String],
  })
  @IsOptional()
  @IsArray({ message: 'Tags deve ser um array' })
  @IsString({ each: true, message: 'Cada tag deve ser uma string' })
  tags?: string[];

  @ApiProperty({
    description: 'ID da aplicação',
    example: '123e4567-e89b-12d3-a456-426614174000',
    required: false,
  })
  @IsOptional()
  @IsUUID('4', { message: 'ID da aplicação deve ser um UUID válido' })
  applicationId?: string | null;
}

