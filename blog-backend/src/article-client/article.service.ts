import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository, SelectQueryBuilder } from 'typeorm';
import { Article } from './entities/article.entity';
import { CreateArticleDto } from './commands/createArticle/dto/create-article.dto';
import { Client } from '../user-client/entities/client.entity';
import { CloudinaryService } from '../Cloudinary/cloudinary.service';
import { ArticleDto } from './queries/getArticles/dto/article.dto';
import { UpdateArticleDto } from './commands/editArticle/dto/update-article.dto';
import { GetArticlesQueryDto } from './queries/getArticlesCreatedByClient/dto/get.articles.query.dto';
import { PaginatedArticlesDto } from './queries/getArticlesCreatedByClient/dto/PaginatedArticlesDto';

type ArticleWithCounts = ArticleDto & {
  likesCount: number;
  commentsCount: number;
  savedByCount: number;
};

@Injectable()
export class ArticleService {
  constructor(
    @InjectRepository(Article)
    private articleRepository: Repository<Article>,
    @InjectRepository(Client)
    private clientRepository: Repository<Client>,
    private cloudinaryService: CloudinaryService,
  ) {}

  async findOneById(id: string): Promise<ArticleDto | null> {
    const article = await this.articleRepository.findOne({
      where: { id },
      relations: [
        'author',
        'author.profile',
        'comments',
        'likes',
        'likes.user',
        'savedBy',
      ],
    });

    if (!article) {
      return null;
    }

    return {
      ...article,
      savedByCount: article.savedBy?.length ?? 0,
    };
  }

  async remove(id: string): Promise<void> {
    const article = await this.articleRepository.findOne({
      where: { id },
      relations: [
        'comments',
        'likes',
        'likes.user',
        'author',
        'author.profile',
        'savedBy',
      ],
    });

    if (!article) {
      throw new NotFoundException(`Article with id ${id} not found`);
    }
    if (article.cloudinaryPublicId) {
      try {
        await this.cloudinaryService.deleteFromCloudinary(
          article.cloudinaryPublicId,
        );
      } catch (e) {
        throw new BadRequestException(
          `Could not delete image from Cloudinary with id ${article.cloudinaryPublicId}`,
        );
      }
    }
    await this.articleRepository.remove(article);
  }

  async createArticleWithImage(
    dto: CreateArticleDto,
    file: Express.Multer.File,
  ) {
    const author = await this.clientRepository.findOneBy({ id: dto.authorId });
    if (!author) throw new NotFoundException('Author not found');
    if (!file) throw new BadRequestException('Image file is required!');

    const parsedCategories = dto.categories ?? [];

    const imageResult =
      await this.cloudinaryService.uploadImageToCloudinary(file);

    let readingTime: number = 0;
    if (dto?.readingTime) {
      const parsed = parseInt(dto.readingTime, 10);
      if (isNaN(parsed) || parsed < 1 || parsed > 300) {
        throw new BadRequestException(
          'readingTime must be a number between 1 and 300 minutes',
        );
      }
      readingTime = parsed;
    }

    const isActiveBool: boolean = dto.isActive ? dto.isActive === 'true' : true;

    const createdAtDate = new Date(dto.createdAt);

    if (isNaN(createdAtDate.getTime())) {
      throw new BadRequestException(`Invalid creation date:: ${dto.createdAt}`);
    }

    const article = this.articleRepository.create({
      title: dto.title,
      content: dto.content,
      linkIImage: imageResult.url,
      cloudinaryPublicId: imageResult.public_id,
      author,
      categories: parsedCategories,
      description: dto.description,
      isActive: isActiveBool,
      readingTime: readingTime ?? 5,
      createdAt: createdAtDate,
    });

    return this.articleRepository.save(article);
  }

  async updateArticleWithImage(
    dto: UpdateArticleDto,
    file?: Express.Multer.File,
  ) {
    const article = await this.articleRepository.findOne({
      where: { id: dto.articleId },
    });

    if (!article) {
      throw new NotFoundException('Article not found');
    }

    const parsedCategories = dto.categories ?? article.categories;

    let readingTime: number = article.readingTime;
    if (dto?.readingTime) {
      const parsed = parseInt(dto.readingTime, 10);
      if (isNaN(parsed) || parsed < 1 || parsed > 300) {
        throw new BadRequestException(
          'readingTime must be a number between 1 and 300 minutes',
        );
      }
      readingTime = parsed;
    }

    const isActiveBool: boolean =
      dto.isActive !== undefined ? dto.isActive === 'true' : article.isActive;

    if (file) {
      if (article.cloudinaryPublicId) {
        await this.cloudinaryService.deleteFromCloudinary(
          article.cloudinaryPublicId,
        );
      }

      const imageResult =
        await this.cloudinaryService.uploadImageToCloudinary(file);

      article.linkIImage = imageResult.url;
      article.cloudinaryPublicId = imageResult.public_id;
    }

    article.title = dto.title ?? article.title;
    article.content = dto.content ?? article.content;
    article.description = dto.description ?? article.description;
    article.categories = parsedCategories;
    article.isActive = isActiveBool;
    article.readingTime = readingTime;

    if (dto.createdAt) {
      const parsedDate = new Date(dto.createdAt);
      if (isNaN(parsedDate.getTime())) {
        throw new BadRequestException(
          `Invalid creation date: ${dto.createdAt}`,
        );
      }
      article.createdAt = parsedDate;
    }

    return this.articleRepository.save(article);
  }

  async findAll(
    skip = 0,
    take = 10,
    sortBy?: string,
    order?: 'ASC' | 'DESC',
    categories?: string[],
  ): Promise<{ articles: ArticleDto[]; total: number }> {
    const qb = this.articleRepository
      .createQueryBuilder('Article')
      .leftJoinAndSelect('Article.author', 'author')
      .leftJoinAndSelect('author.profile', 'profile')
      .leftJoinAndSelect('Article.comments', 'comments')
      .leftJoinAndSelect('Article.likes', 'likes')
      .leftJoinAndSelect('likes.user', 'likeUser')
      .leftJoinAndSelect('Article.savedBy', 'savedBy')
      .where('Article.is_active = :active', { active: true })
      .skip(skip)
      .take(take);

    if (sortBy && order) {
      qb.orderBy(`Article.${sortBy}`, order).addOrderBy('Article.id', 'DESC');
    }

    if (categories && categories.length > 0) {
      qb.andWhere(`"Article"."categories" ?| array[:...categories]`, {
        categories,
      });
    }

    const [articles, total] = await qb.getManyAndCount();

    const transformed: ArticleDto[] = articles.map((article) => ({
      ...article,
      savedByCount: article.savedBy?.length ?? 0,
    }));

    return { articles: transformed, total };
  }

  async findPopular(
    skip = 0,
    take = 4,
  ): Promise<{ articles: ArticleWithCounts[]; total: number }> {
    const rawQuery = `
    SELECT article.id, COUNT(likes.id) as "likesCount"
    FROM articles article
    LEFT JOIN likes ON likes."articleId" = article.id
    WHERE article.is_active = true
    GROUP BY article.id
    ORDER BY COUNT(likes.id) DESC, article.created_at DESC
    LIMIT $1 OFFSET $2
  `;

    const rawRows = await this.articleRepository.query(rawQuery, [take, skip]);

    const ids: string[] = rawRows.map((r: any) => r.id);

    if (ids.length === 0) {
      return { articles: [], total: 0 };
    }

    const likesMap = new Map<string, number>();
    rawRows.forEach((r: any) => {
      likesMap.set(r.id, Number(r.likesCount));
    });

    const articlesEntities = await this.articleRepository.find({
      where: { id: In(ids) },
      relations: ['author', 'author.profile', 'comments', 'likes', 'savedBy'],
    });

    const entityMap = new Map<string, (typeof articlesEntities)[number]>();
    articlesEntities.forEach((a) => entityMap.set(a.id, a));

    const orderedEntities = ids
      .map((id) => entityMap.get(id))
      .filter(Boolean) as typeof articlesEntities;

    const transformed: ArticleWithCounts[] = orderedEntities.map((article) => ({
      ...article,
      likesCount: likesMap.get(article.id) ?? 0,
      commentsCount: article.comments?.length ?? 0,
      savedByCount: article.savedBy?.length ?? 0,
    }));

    const total = await this.articleRepository.count({
      where: { isActive: true },
    });

    return { articles: transformed, total };
  }

  async findAllByAuthor(
    clientId: string,
    {
      page = 1,
      limit = 10,
      sortBy = 'createdAt',
      sortOrder = 'desc',
      filters = {},
    }: GetArticlesQueryDto,
  ): Promise<PaginatedArticlesDto> {
    const offset = (page - 1) * limit;
    const direction = sortOrder.toUpperCase() === 'ASC' ? 'ASC' : 'DESC';

    const qb = this.articleRepository
      .createQueryBuilder('article')
      .leftJoinAndSelect('article.author', 'author')
      .leftJoinAndSelect('author.profile', 'profile')
      .where('author.id = :authorId', { authorId: clientId });

    const counts = {
      likesCount: `SELECT COUNT(*) FROM likes l WHERE l."articleId" = article.id`,
      commentsCount: `SELECT COUNT(*) FROM comments c WHERE c."articleId" = article.id`,
      savedByCount: `SELECT COUNT(*) FROM saved_articles sa WHERE sa.article_id = article.id`,
    };
    Object.entries(counts).forEach(([alias, sql]) =>
      qb.addSelect(`(${sql})`, alias),
    );

    const clauses: string[] = [];
    const params: Record<string, any> = {};
    Object.entries(filters || {}).forEach(([field, raw], i) => {
      if (raw == null || raw === '') return;
      const val = String(raw).trim();
      const p = `f_${field}_${i}`;
      switch (field) {
        case 'id':
          clauses.push(`article.id::text ILIKE :${p}`);
          params[p] = `%${val}%`;
          break;
        case 'title':
          clauses.push(`article.title ILIKE :${p}`);
          params[p] = `%${val}%`;
          break;
        case 'isActive':
          clauses.push(`article.is_active = :${p}`);
          params[p] = ['true', '1', 'yes', 'tak'].includes(val.toLowerCase());
          break;
        case 'readingTime':
          clauses.push(`CAST(article.readingTime AS TEXT) ILIKE :${p}`);
          params[p] = `%${val}%`;
          break;
        case 'createdAt':
          clauses.push(`TO_CHAR(article.created_at, 'YYYY-MM-DD') ILIKE :${p}`);
          params[p] = `%${val}%`;
          break;
        case 'likes':
          clauses.push(`(${counts.likesCount}) = :${p}`);
          params[p] = +val;
          break;
        case 'comments':
          clauses.push(`(${counts.commentsCount}) = :${p}`);
          params[p] = +val;
          break;
        case 'savedByCount':
          clauses.push(`(${counts.savedByCount}) = :${p}`);
          params[p] = +val;
          break;
        default:
          clauses.push(`article.${field}::text ILIKE :${p}`);
          params[p] = `%${val}%`;
      }
    });
    if (clauses.length) qb.andWhere(clauses.join(' AND '), params);

    const totalQb = this.articleRepository
      .createQueryBuilder('article')
      .leftJoin('article.author', 'author')
      .where('author.id = :authorId', { authorId: clientId });

    if (clauses.length) {
      totalQb.andWhere(clauses.join(' AND '), params);
    }

    const total = await totalQb.getCount();

    const map: Record<string, string> = {
      createdAt: 'article.created_at',
      title: 'article.title',
      id: 'article.id',
      isActive: 'article.is_active',
      readingTime: 'article.readingTime',
    };
    qb.orderBy(map[sortBy] || `"${sortBy}"`, direction)
      .limit(limit)
      .offset(offset);

    const { entities, raw } = await qb.getRawAndEntities();
    const data = entities.map((a, i) => ({
      ...a,
      likesCount: +raw[i].likesCount || 0,
      commentsCount: +raw[i].commentsCount || 0,
      savedByCount: +raw[i].savedByCount || 0,
    }));

    return {
      data,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
        hasNext: page < Math.ceil(total / limit),
        hasPrev: page > 1,
      },
    };
  }
}
