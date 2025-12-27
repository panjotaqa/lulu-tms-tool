import { ApiProperty } from '@nestjs/swagger';
import {
  ArrayMinSize,
  IsArray,
  IsNotEmpty,
  IsString,
  IsUUID,
  ValidateIf,
} from 'class-validator';

export class CreateBulkTestCasesDto {
  @ApiProperty({
    description: 'Array de títulos dos casos de teste (um por linha)',
    example: [
      'Validar login com credenciais corretas',
      'Validar login com credenciais incorretas',
      'Validar recuperação de senha',
    ],
    type: [String],
  })
  @IsArray({ message: 'Titles deve ser um array' })
  @ArrayMinSize(1, { message: 'Deve haver pelo menos um título' })
  @IsString({ each: true, message: 'Cada título deve ser uma string' })
  @ValidateIf((o, value) => {
    const trimmed = value.map((title: string) => title.trim()).filter((t: string) => t.length > 0);
    return trimmed.length > 0;
  })
  titles: string[];

  @ApiProperty({
    description: 'ID da pasta (Test Suite)',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @IsNotEmpty({ message: 'ID da pasta é obrigatório' })
  @IsString({ message: 'ID da pasta deve ser uma string' })
  @IsUUID('4', { message: 'ID da pasta deve ser um UUID válido' })
  testSuiteId: string;
}

