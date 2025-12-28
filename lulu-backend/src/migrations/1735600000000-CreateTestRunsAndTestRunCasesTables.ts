import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableForeignKey,
  TableIndex,
} from 'typeorm';

export class CreateTestRunsAndTestRunCasesTables1735600000000
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    // Criar tabela test_runs
    await queryRunner.createTable(
      new Table({
        name: 'test_runs',
        columns: [
          {
            name: 'id',
            type: 'uuid',
            isPrimary: true,
            generationStrategy: 'uuid',
            default: 'uuid_generate_v4()',
          },
          {
            name: 'title',
            type: 'varchar',
            length: '255',
            isNullable: false,
          },
          {
            name: 'description',
            type: 'text',
            isNullable: false,
          },
          {
            name: 'milestone',
            type: 'varchar',
            length: '255',
            isNullable: true,
          },
          {
            name: 'defaultAssigneeId',
            type: 'uuid',
            isNullable: true,
          },
          {
            name: 'projectId',
            type: 'uuid',
            isNullable: false,
          },
          {
            name: 'createdById',
            type: 'uuid',
            isNullable: false,
          },
          {
            name: 'createdAt',
            type: 'timestamp',
            default: 'CURRENT_TIMESTAMP',
            isNullable: false,
          },
          {
            name: 'updatedAt',
            type: 'timestamp',
            default: 'CURRENT_TIMESTAMP',
            onUpdate: 'CURRENT_TIMESTAMP',
            isNullable: false,
          },
        ],
      }),
      true,
    );

    // Criar tabela test_run_cases
    await queryRunner.createTable(
      new Table({
        name: 'test_run_cases',
        columns: [
          {
            name: 'id',
            type: 'uuid',
            isPrimary: true,
            generationStrategy: 'uuid',
            default: 'uuid_generate_v4()',
          },
          {
            name: 'testRunId',
            type: 'uuid',
            isNullable: false,
          },
          {
            name: 'testCaseId',
            type: 'uuid',
            isNullable: false,
          },
          {
            name: 'assignedToId',
            type: 'uuid',
            isNullable: true,
          },
          {
            name: 'testCaseSnapshot',
            type: 'jsonb',
            isNullable: false,
          },
          {
            name: 'snapshotCreatedAt',
            type: 'timestamp',
            default: 'CURRENT_TIMESTAMP',
            isNullable: false,
          },
          {
            name: 'createdAt',
            type: 'timestamp',
            default: 'CURRENT_TIMESTAMP',
            isNullable: false,
          },
          {
            name: 'updatedAt',
            type: 'timestamp',
            default: 'CURRENT_TIMESTAMP',
            onUpdate: 'CURRENT_TIMESTAMP',
            isNullable: false,
          },
        ],
      }),
      true,
    );

    // Foreign keys para test_runs
    await queryRunner.createForeignKey(
      'test_runs',
      new TableForeignKey({
        columnNames: ['projectId'],
        referencedColumnNames: ['id'],
        referencedTableName: 'projects',
        onDelete: 'CASCADE',
      }),
    );

    await queryRunner.createForeignKey(
      'test_runs',
      new TableForeignKey({
        columnNames: ['createdById'],
        referencedColumnNames: ['id'],
        referencedTableName: 'users',
        onDelete: 'CASCADE',
      }),
    );

    await queryRunner.createForeignKey(
      'test_runs',
      new TableForeignKey({
        columnNames: ['defaultAssigneeId'],
        referencedColumnNames: ['id'],
        referencedTableName: 'users',
        onDelete: 'SET NULL',
      }),
    );

    // Foreign keys para test_run_cases
    await queryRunner.createForeignKey(
      'test_run_cases',
      new TableForeignKey({
        columnNames: ['testRunId'],
        referencedColumnNames: ['id'],
        referencedTableName: 'test_runs',
        onDelete: 'CASCADE',
      }),
    );

    await queryRunner.createForeignKey(
      'test_run_cases',
      new TableForeignKey({
        columnNames: ['testCaseId'],
        referencedColumnNames: ['id'],
        referencedTableName: 'testcases',
        onDelete: 'CASCADE',
      }),
    );

    await queryRunner.createForeignKey(
      'test_run_cases',
      new TableForeignKey({
        columnNames: ['assignedToId'],
        referencedColumnNames: ['id'],
        referencedTableName: 'users',
        onDelete: 'SET NULL',
      }),
    );

    // Índices para performance
    await queryRunner.createIndex(
      'test_runs',
      new TableIndex({
        name: 'IDX_test_runs_projectId',
        columnNames: ['projectId'],
      }),
    );

    await queryRunner.createIndex(
      'test_runs',
      new TableIndex({
        name: 'IDX_test_runs_createdById',
        columnNames: ['createdById'],
      }),
    );

    await queryRunner.createIndex(
      'test_run_cases',
      new TableIndex({
        name: 'IDX_test_run_cases_testRunId',
        columnNames: ['testRunId'],
      }),
    );

    await queryRunner.createIndex(
      'test_run_cases',
      new TableIndex({
        name: 'IDX_test_run_cases_testCaseId',
        columnNames: ['testCaseId'],
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Remover índices
    await queryRunner.dropIndex('test_run_cases', 'IDX_test_run_cases_testCaseId');
    await queryRunner.dropIndex('test_run_cases', 'IDX_test_run_cases_testRunId');
    await queryRunner.dropIndex('test_runs', 'IDX_test_runs_createdById');
    await queryRunner.dropIndex('test_runs', 'IDX_test_runs_projectId');

    // Remover foreign keys (serão removidas automaticamente ao dropar as tabelas)
    // Mas vamos remover explicitamente para garantir ordem correta
    const testRunCasesTable = await queryRunner.getTable('test_run_cases');
    if (testRunCasesTable) {
      const foreignKeys = testRunCasesTable.foreignKeys;
      for (const fk of foreignKeys) {
        await queryRunner.dropForeignKey('test_run_cases', fk);
      }
    }

    const testRunsTable = await queryRunner.getTable('test_runs');
    if (testRunsTable) {
      const foreignKeys = testRunsTable.foreignKeys;
      for (const fk of foreignKeys) {
        await queryRunner.dropForeignKey('test_runs', fk);
      }
    }

    // Remover tabelas
    await queryRunner.dropTable('test_run_cases');
    await queryRunner.dropTable('test_runs');
  }
}

