import {
  MigrationInterface,
  QueryRunner,
  TableColumn,
  TableIndex,
} from 'typeorm';

export class AddStatusToTestRunsAndTestRunCases1735700000000
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    // Adicionar coluna status na tabela test_runs
    await queryRunner.addColumn(
      'test_runs',
      new TableColumn({
        name: 'status',
        type: 'enum',
        enum: ['Not Started', 'In Progress', 'Completed', 'Cancelled'],
        default: "'Not Started'",
        isNullable: false,
      }),
    );

    // Adicionar coluna status na tabela test_run_cases
    await queryRunner.addColumn(
      'test_run_cases',
      new TableColumn({
        name: 'status',
        type: 'enum',
        enum: ['Pending', 'Passed', 'Failed', 'Blocked', 'Skipped'],
        default: "'Pending'",
        isNullable: false,
      }),
    );

    // Criar índices para performance
    await queryRunner.createIndex(
      'test_runs',
      new TableIndex({
        name: 'IDX_test_runs_status',
        columnNames: ['status'],
      }),
    );

    await queryRunner.createIndex(
      'test_run_cases',
      new TableIndex({
        name: 'IDX_test_run_cases_status',
        columnNames: ['status'],
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Remover índices
    await queryRunner.dropIndex('test_run_cases', 'IDX_test_run_cases_status');
    await queryRunner.dropIndex('test_runs', 'IDX_test_runs_status');

    // Remover colunas
    await queryRunner.dropColumn('test_run_cases', 'status');
    await queryRunner.dropColumn('test_runs', 'status');
  }
}

