import { DataSource } from 'typeorm';
import { config } from 'dotenv';
import { User } from '@/modules/user/models/entity/user.entity';
import { TestCase } from '@/modules/testcase/models/entity/testcase.entity';
import { TestRunCase } from '@/modules/testrun/models/entity/testrun-case.entity';
import { Project } from '@/modules/project/models/entity/project.entity';
import { Application } from '@/modules/application/models/entity/application.entity';
import { Tag } from '@/modules/tag/models/tag.entity';
import { TestCaseTag } from '@/modules/testcase/models/entity/testcase-tag.entity';
import { TestRun } from '@/modules/testrun/models/entity/testrun.entity';
import { Folder } from '@/modules/folder/models/entity/folder.entity';

config();

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: process.env.DATABASE_HOST || 'localhost',
  port: parseInt(process.env.DATABASE_PORT || '5432', 10),
  username: process.env.DATABASE_USERNAME || 'postgres',
  password: process.env.DATABASE_PASSWORD || 'postgres',
  database: process.env.DATABASE_NAME || 'lulu_db',
  entities: [User, TestCase, TestCaseTag, TestRunCase, TestRun, Project, Application, Tag, Folder],
  migrations: [__dirname + '/migrations/**/*{.ts,.js}'],
  synchronize: false,
  migrationsTableName: 'migrations',
});
