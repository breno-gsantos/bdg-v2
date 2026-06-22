'use server'

import { ReservationNotFoundError } from "@/errors/reservation/reservation-error";
import { requireAdmin } from "@/lib/auth/require-admin"
import { ReservationService } from "@/services/reservation-service";
import { revalidatePath } from "next/cache";

export async function deleteReservationAction(id: string) {
  await requireAdmin();

  try {
    await ReservationService.delete(id);

    revalidatePath('/admin/cardapio');
    revalidatePath('/')

    return {success: true, message: 'Reserva removida com sucesso'}
  } catch (error) {
    if (error instanceof ReservationNotFoundError) {
      return {success: false, error: error.message}
    }

    return {success: false, error: 'Erro interno do servidor'}
  }
}