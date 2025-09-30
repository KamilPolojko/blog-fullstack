import { MigrationInterface, QueryRunner } from "typeorm";

export class ArticleIsActiveAndreadingTimeMigration1757254005034 implements MigrationInterface {
    name = 'ArticleIsActiveAndreadingTimeMigration1757254005034'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "saved_articles" DROP CONSTRAINT "FK_e22a09c311adaa46656394c1bda"`);
        await queryRunner.query(`ALTER TABLE "articles" ADD "isActive" boolean NOT NULL DEFAULT true`);
        await queryRunner.query(`ALTER TABLE "articles" ADD "readingTime" integer NOT NULL DEFAULT '5'`);
        await queryRunner.query(`ALTER TABLE "saved_articles" ADD CONSTRAINT "FK_e22a09c311adaa46656394c1bda" FOREIGN KEY ("article_id") REFERENCES "articles"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "saved_articles" DROP CONSTRAINT "FK_e22a09c311adaa46656394c1bda"`);
        await queryRunner.query(`ALTER TABLE "articles" DROP COLUMN "readingTime"`);
        await queryRunner.query(`ALTER TABLE "articles" DROP COLUMN "isActive"`);
        await queryRunner.query(`ALTER TABLE "saved_articles" ADD CONSTRAINT "FK_e22a09c311adaa46656394c1bda" FOREIGN KEY ("article_id") REFERENCES "articles"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
    }

}
