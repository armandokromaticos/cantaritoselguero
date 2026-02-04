export class UnauthorizedActionException extends Error {
  constructor(action: string, reason?: string) {
    const message = reason
      ? `Unauthorized to ${action}: ${reason}`
      : `Unauthorized to ${action}`;
    super(message);
    this.name = "UnauthorizedActionException";
  }
}
