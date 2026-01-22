import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString, MaxLength } from 'class-validator';

export class UpdateApplicationDto {
  @ApiProperty({
    description: 'Nome da aplicação',
    example: 'Sistema de Vendas Atualizado',
    maxLength: 255,
    required: false,
  })
  @IsOptional()
  @IsString({ message: 'Nome deve ser uma string' })
  @MaxLength(255, { message: 'Nome deve ter no máximo 255 caracteres' })
  name?: string;
}

