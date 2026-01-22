import {
  MigrationInterface,
  QueryRunner,
  TableColumn,
  TableForeignKey,
} from 'typeorm';

export class AddApplicationToTestCases1736100000000
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.addColumn(
      'testcases',
      new TableColumn({
        name: 'applicationId',
        type: 'uuid',
        isNullable: true,
      }),
    );

    // Foreign key para applications
    await queryRunner.createForeignKey(
      'testcases',
      new TableForeignKey({
        columnNames: ['applicationId'],
        referencedColumnNames: ['id'],
        referencedTableName: 'applications',
        onDelete: 'SET NULL',
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Remover foreign key
    const table = await queryRunner.getTable('testcases');
    const foreignKey = table?.foreignKeys.find(
      (fk) => fk.columnNames.indexOf('applicationId') !== -1,
    );
    if (foreignKey) {
      await queryRunner.dropForeignKey('testcases', foreignKey);
    }

    // Remover coluna
    await queryRunner.dropColumn('testcases', 'applicationId');
  }
}

