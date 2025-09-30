export class MarkNotificationAsReadCommand {
  constructor(
    public readonly notificationId: string,
    public readonly clientId: string,
  ) {}
}
