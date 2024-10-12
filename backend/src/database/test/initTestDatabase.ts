import { DataSource } from 'typeorm';

export const initTestDatabase = async (
  dataSource: DataSource,
  dbName: string,
) => {
  // データベースの作成
  await dataSource.query(`CREATE DATABASE IF NOT EXISTS ${dbName}`);

  // テーブルの作成
  await dataSource.query(
    `CREATE TABLE IF NOT EXISTS \`todos\` (\`id\` int NOT NULL AUTO_INCREMENT, \`title\` varchar(50) NOT NULL, \`content\` text NOT NULL, \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updated_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
  );
  await dataSource.query(
    `CREATE TABLE \`users\` (\`id\` int NOT NULL AUTO_INCREMENT, \`name\` varchar(50) NOT NULL, \`email\` varchar(255) NOT NULL, \`password\` varchar(255) NOT NULL, \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updated_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`deleted_at\` datetime(6) NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
  );
  await dataSource.query(
    `ALTER TABLE \`users\` ADD UNIQUE INDEX \`IDX_97672ac88f789774dd47f7c8be\` (\`email\`)`,
  );
  await dataSource.query(`ALTER TABLE \`todos\` ADD \`user_id\` int NOT NULL`);
  await dataSource.query(
    `ALTER TABLE \`todos\` ADD CONSTRAINT \`FK_53511787e1f412d746c4bf223ff\` FOREIGN KEY (\`user_id\`) REFERENCES \`users\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
  );
};
