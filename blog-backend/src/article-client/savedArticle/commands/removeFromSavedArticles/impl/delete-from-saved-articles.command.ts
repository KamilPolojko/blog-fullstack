export class DeleteFromSavedArticlesCommand {
  constructor(
    public readonly userId: string,
    public readonly articleId: string,
  ) {}
}
