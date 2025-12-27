import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString, Matches } from 'class-validator';

export class UpdateProjectDto {
  @ApiProperty({
    description: 'Título do projeto',
    example: 'Projeto de Desenvolvimento Atualizado',
    required: false,
  })
  @IsOptional()
  @IsString({ message: 'Título deve ser uma string' })
  title?: string;

  @ApiProperty({
    description: 'Slug do projeto (identificador único na URL)',
    example: 'projeto-desenvolvimento-atualizado',
    required: false,
  })
  @IsOptional()
  @IsString({ message: 'Slug deve ser uma string' })
  @Matches(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, {
    message: 'Slug deve conter apenas letras minúsculas, números e hífens',
  })
  slug?: string;

  @ApiProperty({
    description: 'Descrição do projeto',
    example: 'Projeto para desenvolvimento de sistema de gestão atualizado',
    required: false,
  })
  @IsOptional()
  @IsString({ message: 'Descrição deve ser uma string' })
  description?: string;
}

