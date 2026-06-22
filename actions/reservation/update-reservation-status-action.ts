'use server'

import { ReservationDateInPastError, ReservationNotFoundError } from "@/errors/reservation/reservation-error";
import { requireAdmin } from "@/lib/auth/require-admin"
import { editReservationDomainSchema } from "@/lib/validations/reservation/reservation-schema";
import { ReservationService } from "@/services/reservation-service";
import { revalidatePath } from "next/cache";

export async function updateReservationStatus(values: unknown) {
  await requireAdmin();

  const parsed = editReservationDomainSchema.safeParse(values);

  if (!parsed.success) {
    return {success: false, error: 'Dados inválidos'}
  }

  try {
    await ReservationService.editStatus(parsed.data);

    revalidatePath('/admin/reservas');

    return {success: true, message: `Reserva ${parsed.data.status === 'CONFIRMED' ? 'confirmada' : parsed.data.status === 'CANCELLED' ? 'cancelada' : 'atualizada'} com sucesso!`}
  } catch (error) {
    if (error instanceof ReservationNotFoundError) {
      return {success: false, error: error.message}
    }

    if (error instanceof ReservationDateInPastError) {
      return {success: false, error: error.message}
    }

    return {success: false, error: 'Erro interno do servidor'}
  }
}