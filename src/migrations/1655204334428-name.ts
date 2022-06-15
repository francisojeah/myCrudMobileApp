import { MigrationInterface, QueryRunner } from "typeorm";

export class name1655204334428 implements MigrationInterface {
    name = 'name1655204334428'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE IF NOT EXISTS "transaction_entry" ("id" SERIAL NOT NULL, "txnDay" integer NOT NULL DEFAULT '14', "txnMonth" integer NOT NULL DEFAULT '5', "txnYear" integer NOT NULL DEFAULT '2022', "description" character varying NOT NULL, "amount" integer NOT NULL, "expense" boolean NOT NULL DEFAULT true, CONSTRAINT "PK_82ce33c01f7571c2a246b06cdb3" PRIMARY KEY ("id"))`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "transaction_entry"`);
    }

}
