import { MigrationInterface, QueryRunner } from "typeorm";

export class AlterTableCart1761866153202 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        queryRunner.query(`
            ALTER TABLE cart ADD active boolean NOT NULL;
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        queryRunner.query(`
            ALTER TABLE cart drop active;
        `);
    }

}
