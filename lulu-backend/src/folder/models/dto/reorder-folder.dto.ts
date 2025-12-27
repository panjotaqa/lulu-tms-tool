import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsNotEmpty, Min } from 'class-validator';
import { Type } from 'class-transformer';

export class ReorderFolderDto {
  @ApiProperty({
    description: 'Nova ordem dentro do mesmo pai',
    example: 2,
  })
  @IsNotEmpty({ message: 'Ordem é obrigatória' })
  @Type(() => Number)
  @IsInt({ message: 'Ordem deve ser um número inteiro' })
  @Min(0, { message: 'Ordem deve ser maior ou igual a 0' })
  newOrder: number;
}

