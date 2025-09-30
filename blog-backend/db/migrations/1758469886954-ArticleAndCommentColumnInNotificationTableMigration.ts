import { MigrationInterface, QueryRunner } from "typeorm";

export class ArticleAndCommentColumnInNotificationTableMigration1758469886954 implements MigrationInterface {
    name = 'ArticleAndCommentColumnInNotificationTableMigration1758469886954'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "notifications" DROP COLUMN "targetId"`);
        await queryRunner.query(`ALTER TABLE "notifications" DROP COLUMN "targetType"`);
        await queryRunner.query(`ALTER TABLE "notifications" ADD "articleId" uuid`);
        await queryRunner.query(`ALTER TABLE "notifications" ADD "commentId" uuid`);
        await queryRunner.query(`ALTER TABLE "notifications" ADD CONSTRAINT "FK_1fa1ba18cdeae638833dfa100bb" FOREIGN KEY ("articleId") REFERENCES "articles"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "notifications" ADD CONSTRAINT "FK_9faba56a12931cf4e38f9dddb49" FOREIGN KEY ("commentId") REFERENCES "comments"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "notifications" DROP CONSTRAINT "FK_9faba56a12931cf4e38f9dddb49"`);
        await queryRunner.query(`ALTER TABLE "notifications" DROP CONSTRAINT "FK_1fa1ba18cdeae638833dfa100bb"`);
        await queryRunner.query(`ALTER TABLE "notifications" DROP COLUMN "commentId"`);
        await queryRunner.query(`ALTER TABLE "notifications" DROP COLUMN "articleId"`);
        await queryRunner.query(`ALTER TABLE "notifications" ADD "targetType" character varying`);
        await queryRunner.query(`ALTER TABLE "notifications" ADD "targetId" character varying`);
    }

}
