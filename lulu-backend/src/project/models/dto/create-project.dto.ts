import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString, Matches } from 'class-validator';

export class CreateProjectDto {
  @ApiProperty({
    description: 'Título do projeto',
    example: 'Projeto de Desenvolvimento',
  })
  @IsNotEmpty({ message: 'Título é obrigatório' })
  @IsString({ message: 'Título deve ser uma string' })
  title: string;

  @ApiProperty({
    description: 'Slug do projeto (identificador único na URL)',
    example: 'projeto-desenvolvimento',
  })
  @IsNotEmpty({ message: 'Slug é obrigatório' })
  @IsString({ message: 'Slug deve ser uma string' })
  @Matches(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, {
    message: 'Slug deve conter apenas letras minúsculas, números e hífens',
  })
  slug: string;

  @ApiProperty({
    description: 'Descrição do projeto',
    example: 'Projeto para desenvolvimento de sistema de gestão',
    required: false,
  })
  @IsOptional()
  @IsString({ message: 'Descrição deve ser uma string' })
  description?: string;
}

