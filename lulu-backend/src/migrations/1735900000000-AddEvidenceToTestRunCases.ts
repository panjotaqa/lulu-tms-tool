import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm';

export class AddEvidenceToTestRunCases1735900000000
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.addColumn(
      'test_run_cases',
      new TableColumn({
        name: 'evidence',
        type: 'text',
        isNullable: true,
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropColumn('test_run_cases', 'evidence');
  }
}

