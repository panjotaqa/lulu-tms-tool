import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty } from 'class-validator';
import { TestRunCaseStatus } from '../enums/testrun-case-status.enum';

export class UpdateTestRunCaseStatusDto {
  @ApiProperty({
    description: 'Novo status do caso de teste na execução',
    enum: TestRunCaseStatus,
    example: TestRunCaseStatus.PASSED,
  })
  @IsNotEmpty({ message: 'Status é obrigatório' })
  @IsEnum(TestRunCaseStatus, {
    message: 'Status deve ser um dos valores válidos: Pending, Passed, Failed, Blocked, Skipped',
  })
  status: TestRunCaseStatus;
}

