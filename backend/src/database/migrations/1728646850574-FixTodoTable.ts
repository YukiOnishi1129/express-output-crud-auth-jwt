import { MigrationInterface, QueryRunner } from "typeorm";

export class FixTodoTable1728646850574 implements MigrationInterface {
    name = 'FixTodoTable1728646850574'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`todos\` ADD \`user_id\` int NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`todos\` ADD CONSTRAINT \`FK_53511787e1f412d746c4bf223ff\` FOREIGN KEY (\`user_id\`) REFERENCES \`users\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`todos\` DROP FOREIGN KEY \`FK_53511787e1f412d746c4bf223ff\``);
        await queryRunner.query(`ALTER TABLE \`todos\` DROP COLUMN \`user_id\``);
    }

}
