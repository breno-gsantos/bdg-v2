export class MenuItemNotFoundError extends Error {
  constructor() {
    super('Item não encontrado, tente novamente.')
  }
}