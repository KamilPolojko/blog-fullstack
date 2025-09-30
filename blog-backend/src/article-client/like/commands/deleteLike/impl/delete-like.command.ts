export class DeleteLikeCommand {
  constructor(
    public readonly articleId: string,
    public readonly userId: string,
  ) {}
}
