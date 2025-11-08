import { MigrationInterface, QueryRunner } from "typeorm";

export class AlterTablePayment1762458273973 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        queryRunner.query(`
            ALTER TABLE public.payment alter column amount_payments drop not null;
            ALTER TABLE public.payment alter column code drop not null;
            ALTER TABLE public.payment alter column date_payment drop not null;
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        queryRunner.query(`
        `);
    }

}
