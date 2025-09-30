import { MigrationInterface, QueryRunner } from "typeorm";

export class ArticleCreatedAtMigration1757543339918 implements MigrationInterface {
    name = 'ArticleCreatedAtMigration1757543339918'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "articles" ADD "createdAt" TIMESTAMP NOT NULL DEFAULT now()`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "articles" DROP COLUMN "createdAt"`);
    }

}
