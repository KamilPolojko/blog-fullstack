export class AddToSaveArticlesCommand {
  constructor(
    public readonly clientId: string,
    public readonly articleId: string,
  ) {}
}
