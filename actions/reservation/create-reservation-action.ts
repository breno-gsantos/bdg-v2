'use server'

import { InvalidGuestError, ReservationAlreadyExistsError, ReservationDateInPastError, ReservationUnavailableError } from "@/errors/reservation/reservation-error";
import { reservationDomainSchema } from "@/lib/validations/reservation/reservation-schema";
import { ReservationService } from "@/services/reservation-service";
import { ReservationResponseAction } from "@/types/response-action";

export async function createReservationAction(values: unknown): Promise<ReservationResponseAction>{
  const parsed = reservationDomainSchema.safeParse(values);

  if (!parsed.success) {
    return { success: false, fieldError: parsed.error.flatten().fieldErrors }
  }

  try {
    await ReservationService.create(parsed.data);

    return {success: true, message: 'Reserva solicitada com sucesso! Entraremos em contato em breve.'}
  } catch (error) {
    if (error instanceof InvalidGuestError) {
      return {
        success: false,
        fieldError: {
          guests: [error.message]
        }
      }
    }

    if (error instanceof ReservationUnavailableError || error instanceof ReservationAlreadyExistsError) {
      return {
        success: false,
        fieldError: {
          time: [error.message]
        }
      }
    }

    if (error instanceof ReservationDateInPastError) {
      return {
        success: false,
        fieldError: {
          date: [error.message]
        }
      }
    }

    return {success: false, error: 'Erro interno do servidor'}
  }
}