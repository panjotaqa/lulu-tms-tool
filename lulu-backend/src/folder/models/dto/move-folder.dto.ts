import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsNotEmpty, IsOptional, IsString, IsUUID, Min } from 'class-validator';
import { Type } from 'class-transformer';

export class MoveFolderDto {
  @ApiProperty({
    description: 'ID da pasta pai de destino (opcional - se não fornecido, mantém o pai atual)',
    example: '123e4567-e89b-12d3-a456-426614174001',
    required: false,
  })
  @IsOptional()
  @IsString({ message: 'ID da pasta pai deve ser uma string' })
  @IsUUID('4', { message: 'ID da pasta pai deve ser um UUID válido' })
  targetParentId?: string | null;

  @ApiProperty({
    description: 'Nova posição na lista de irmãos (0 = início)',
    example: 2,
  })
  @IsNotEmpty({ message: 'Posição é obrigatória' })
  @Type(() => Number)
  @IsInt({ message: 'Posição deve ser um número inteiro' })
  @Min(0, { message: 'Posição deve ser maior ou igual a 0' })
  newPosition: number;
}

