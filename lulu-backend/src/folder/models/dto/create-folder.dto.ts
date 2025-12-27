import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString, IsUUID } from 'class-validator';

export class CreateFolderDto {
  @ApiProperty({
    description: 'Título da pasta',
    example: 'Pasta de Testes',
  })
  @IsNotEmpty({ message: 'Título é obrigatório' })
  @IsString({ message: 'Título deve ser uma string' })
  title: string;

  @ApiProperty({
    description: 'ID do projeto',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @IsNotEmpty({ message: 'ID do projeto é obrigatório' })
  @IsString({ message: 'ID do projeto deve ser uma string' })
  @IsUUID('4', { message: 'ID do projeto deve ser um UUID válido' })
  projectId: string;

  @ApiProperty({
    description: 'ID da pasta pai (opcional - se não fornecido, vincula à ROOT)',
    example: '123e4567-e89b-12d3-a456-426614174001',
    required: false,
  })
  @IsOptional()
  @IsString({ message: 'ID da pasta pai deve ser uma string' })
  @IsUUID('4', { message: 'ID da pasta pai deve ser um UUID válido' })
  parentFolderId?: string;
}

