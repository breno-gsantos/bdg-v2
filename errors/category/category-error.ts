export class CategoryNameAlreadyExistsError extends Error{
  constructor() {
    super('Categoria já cadastrada')
  }
}