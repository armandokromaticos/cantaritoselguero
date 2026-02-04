export class InvalidStateTransitionException extends Error {
  constructor(entityName: string, from: string, to: string) {
    super(`Invalid state transition for ${entityName}: ${from} -> ${to}`);
    this.name = "InvalidStateTransitionException";
  }
}
