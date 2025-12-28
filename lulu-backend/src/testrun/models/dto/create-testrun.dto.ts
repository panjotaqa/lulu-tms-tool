import { ApiProperty } from '@nestjs/swagger';
import {
  ArrayMinSize,
  IsArray,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
  MaxLength,
} from 'class-validator';

export class CreateTestRunDto {
  @ApiProperty({
    description: 'Título da execução de teste',
    example: 'Test Run - Sprint 1',
  })
  @IsNotEmpty({ message: 'Título é obrigatório' })
  @IsString({ message: 'Título deve ser uma string' })
  @MaxLength(255, { message: 'Título deve ter no máximo 255 caracteres' })
  title: string;

  @ApiProperty({
    description: 'Descrição da execução de teste',
    example: 'Execução de testes para validação da funcionalidade de login',
  })
  @IsNotEmpty({ message: 'Descrição é obrigatória' })
  @IsString({ message: 'Descrição deve ser uma string' })
  description: string;

  @ApiProperty({
    description: 'Marcador/Milestone associado',
    example: 'v1.0',
    required: false,
  })
  @IsOptional()
  @IsString({ message: 'Milestone deve ser uma string' })
  @MaxLength(255, { message: 'Milestone deve ter no máximo 255 caracteres' })
  milestone?: string;

  @ApiProperty({
    description: 'ID do usuário atribuído por padrão a todos os casos de teste',
    example: '123e4567-e89b-12d3-a456-426614174000',
    required: false,
  })
  @IsOptional()
  @IsUUID('4', { message: 'defaultAssigneeId deve ser um UUID válido' })
  defaultAssigneeId?: string;

  @ApiProperty({
    description: 'ID do projeto',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @IsNotEmpty({ message: 'ID do projeto é obrigatório' })
  @IsUUID('4', { message: 'projectId deve ser um UUID válido' })
  projectId: string;

  @ApiProperty({
    description: 'Array de IDs dos casos de teste a serem incluídos na execução',
    example: [
      '123e4567-e89b-12d3-a456-426614174001',
      '123e4567-e89b-12d3-a456-426614174002',
    ],
    type: [String],
    required: false,
  })
  @IsOptional()
  @IsArray({ message: 'testCaseIds deve ser um array' })
  @IsUUID('4', { each: true, message: 'Cada ID deve ser um UUID válido' })
  testCaseIds?: string[];
}

