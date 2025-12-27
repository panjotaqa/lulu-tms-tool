import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class UpdateFolderTitleDto {
  @ApiProperty({
    description: 'Novo título da pasta',
    example: 'Pasta Renomeada',
  })
  @IsNotEmpty({ message: 'Título é obrigatório' })
  @IsString({ message: 'Título deve ser uma string' })
  title: string;
}

