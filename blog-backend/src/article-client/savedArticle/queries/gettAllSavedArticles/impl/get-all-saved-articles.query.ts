export class GetAllSavedArticlesQuery {
  constructor(
    public readonly userId: string,
    public readonly offset: number,
    public readonly limit: number,
  ) {}
}
