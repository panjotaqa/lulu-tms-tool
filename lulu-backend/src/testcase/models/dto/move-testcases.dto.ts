import { ApiProperty } from '@nestjs/swagger';
import {
  IsArray,
  IsNotEmpty,
  IsString,
  IsUUID,
  ArrayMinSize,
} from 'class-validator';

export class MoveTestCasesDto {
  @ApiProperty({
    description: 'Array de IDs dos casos de teste a serem movidos',
    example: [
      '123e4567-e89b-12d3-a456-426614174000',
      '123e4567-e89b-12d3-a456-426614174001',
    ],
    type: [String],
  })
  @IsArray({ message: 'testCaseIds deve ser um array' })
  @ArrayMinSize(1, {
    message: 'É necessário selecionar pelo menos um caso de teste',
  })
  @IsUUID('4', { each: true, message: 'Cada ID deve ser um UUID válido' })
  testCaseIds: string[];

  @ApiProperty({
    description: 'ID da pasta destino para onde os casos de teste serão movidos',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @IsNotEmpty({ message: 'targetFolderId é obrigatório' })
  @IsString({ message: 'targetFolderId deve ser uma string' })
  @IsUUID('4', { message: 'targetFolderId deve ser um UUID válido' })
  targetFolderId: string;
}

