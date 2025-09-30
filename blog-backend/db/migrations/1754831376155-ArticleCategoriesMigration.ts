import { MigrationInterface, QueryRunner } from 'typeorm';

export class ArticleCategoriesMigration1754831376155
  implements MigrationInterface
{
  name = 'ArticleCategoriesMigration1754831376155';

  public async up(queryRunner: QueryRunner): Promise<void> {
    const table = await queryRunner.getTable('articles');
    const categoriesColumn = table?.findColumnByName('categories');

    if (!categoriesColumn) {
      await queryRunner.query(`ALTER TABLE "articles" ADD "categories" jsonb`);
      console.log('✅ Added categories column to articles table');
    } else {
      console.log('✅ Categories column already exists');
    }
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "articles" DROP COLUMN "categories"`);
  }
}