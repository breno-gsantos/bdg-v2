export class SlotAlreadyBlockedError extends Error {
  constructor() {
    super("Este horário já está bloqueado.");
  }
}