import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm';

export class PopulateTestcaseIdAndMakeNotNull1735510000000
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    // Script para povoar testcaseId
    // Agrupa por projeto e gera IDs sequenciais
    const result = await queryRunner.query(`
      WITH project_testcases AS (
        SELECT 
          tc.id as testcase_id,
          p.slug as project_slug,
          ROW_NUMBER() OVER (PARTITION BY p.id ORDER BY tc."createdAt" ASC) as seq_num
        FROM testcases tc
        INNER JOIN folders f ON tc."testSuiteId" = f.id
        INNER JOIN projects p ON f."projectId" = p.id
        WHERE tc."testcaseId" IS NULL
      )
      UPDATE testcases
      SET "testcaseId" = UPPER(pt.project_slug) || '-' || TO_CHAR(pt.seq_num, 'FM00')
      FROM project_testcases pt
      WHERE testcases.id = pt.testcase_id;
    `);

    // Tornar a coluna NOT NULL
    await queryRunner.changeColumn(
      'testcases',
      'testcaseId',
      new TableColumn({
        name: 'testcaseId',
        type: 'varchar',
        length: '50',
        isNullable: false,
      }),
    );

    // Recriar índice único sem a condição WHERE (agora que não há nulls)
    await queryRunner.query(`
      DROP INDEX IF EXISTS "IDX_testcases_testcaseId_unique";
    `);

    await queryRunner.query(`
      CREATE UNIQUE INDEX "IDX_testcases_testcaseId_unique" 
      ON testcases ("testcaseId");
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Reverter para nullable
    await queryRunner.changeColumn(
      'testcases',
      'testcaseId',
      new TableColumn({
        name: 'testcaseId',
        type: 'varchar',
        length: '50',
        isNullable: true,
      }),
    );

    // Limpar valores
    await queryRunner.query(`
      UPDATE testcases SET "testcaseId" = NULL;
    `);
  }
}

