export class ToggleLikeCommand {
  constructor(
    public readonly commentId: string,
    public readonly userId: string,
  ) {}
}
