export class AppError extends Error {
  constructor(message: string) {
    super(message)
  }
}

export class InvalidGuestError extends AppError{
  constructor() {
    super('A quantidade de convidados deve ser maior que 04 pessoas');
  }
}

export class ReservationAlreadyExistsError extends AppError{
  constructor() {
    super('Já existe uma reserva para este horário')
  }
}

export class ReservationDateInPastError extends AppError{
  constructor() {
    super('Não é possível criar reservas em datas passadas')
  }
}

export class ReservationUnavailableError extends AppError{
  constructor() {
    super('Este horário não está disponível')
  }
}

export class ReservationNotFoundError extends AppError {
  constructor() {
    super('Reserva não encontrada, tente novamente.')
  }
}