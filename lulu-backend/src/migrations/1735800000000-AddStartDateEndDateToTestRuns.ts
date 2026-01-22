import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm';

export class AddStartDateEndDateToTestRuns1735800000000
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    // Adicionar coluna startDate (permitir NULL temporariamente para dados existentes)
    await queryRunner.addColumn(
      'test_runs',
      new TableColumn({
        name: 'startDate',
        type: 'date',
        isNullable: true,
      }),
    );

    // Adicionar coluna endDate (permitir NULL temporariamente para dados existentes)
    await queryRunner.addColumn(
      'test_runs',
      new TableColumn({
        name: 'endDate',
        type: 'date',
        isNullable: true,
      }),
    );

    // Preencher valores padrão para registros existentes
    await queryRunner.query(`
      UPDATE test_runs 
      SET "startDate" = CURRENT_DATE, "endDate" = CURRENT_DATE 
      WHERE "startDate" IS NULL OR "endDate" IS NULL
    `);

    // Tornar as colunas obrigatórias
    await queryRunner.query(`
      ALTER TABLE test_runs 
      ALTER COLUMN "startDate" SET NOT NULL,
      ALTER COLUMN "endDate" SET NOT NULL
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Remover colunas
    await queryRunner.dropColumn('test_runs', 'endDate');
    await queryRunner.dropColumn('test_runs', 'startDate');
  }
}

