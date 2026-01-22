import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsUUID, MaxLength } from 'class-validator';

export class CreateApplicationDto {
  @ApiProperty({
    description: 'Nome da aplicação',
    example: 'Sistema de Vendas',
    maxLength: 255,
  })
  @IsNotEmpty({ message: 'Nome é obrigatório' })
  @IsString({ message: 'Nome deve ser uma string' })
  @MaxLength(255, { message: 'Nome deve ter no máximo 255 caracteres' })
  name: string;

  @ApiProperty({
    description: 'ID do projeto ao qual a aplicação pertence',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @IsNotEmpty({ message: 'ID do projeto é obrigatório' })
  @IsUUID('4', { message: 'ID do projeto deve ser um UUID válido' })
  projectId: string;
}

