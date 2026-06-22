import { InvalidGuestError, ReservationAlreadyExistsError, ReservationDateInPastError, ReservationNotFoundError } from "@/errors/reservation/reservation-error";
import prisma from "@/lib/prisma";
import { EditReservationDomainData, ReservationDomainData } from "@/lib/validations/reservation/reservation-schema";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/client";

export class ReservationService{
  static async create(data: ReservationDomainData) {
    const reservationDate = new Date(data.date);
    reservationDate.setHours(0, 0, 0, 0);

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    if (reservationDate < today) {
      throw new ReservationDateInPastError();
    }

    if (Number.isNaN(data.guests) || data.guests <= 4) {
      throw new InvalidGuestError();
    }

    const existingReservation = await prisma.reservation.findFirst({
      where: {
        date: reservationDate,
        time: data.time,
        status: {
          not: 'CANCELLED'
      }
      }
    })

    if (existingReservation) {
      throw new ReservationAlreadyExistsError();
    }

    try {
      return await prisma.reservation.create({
        data: {
          name: data.name,
          whatsapp: data.whatsapp,
          date: reservationDate,
          time: data.time,
          guests: data.guests,
          status: 'PENDING',
          notes: data.notes
        }
      });
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError && error.code === 'P2002') {
        throw new ReservationAlreadyExistsError();
      }
      throw error;
    }
  }

  static async delete(id: string) {
    try {
      return await prisma.reservation.delete({
        where: { id }
      })
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError && error.code === "P2025") {
        throw new ReservationNotFoundError();
      }
      throw error
    }
  }

  static async editStatus(data: EditReservationDomainData) {
    if (data.status === 'PENDING' || data.status === 'CONFIRMED') {
      const reservation = await prisma.reservation.findUnique({
        where: { id: data.id }
      })

      if (!reservation) {
        throw new ReservationNotFoundError()
      }

      const conflict = await prisma.reservation.findFirst({
        where: {
          date: reservation.date,
          time: reservation.time,
          status: {
            in: ['PENDING', 'CONFIRMED']
          },
          NOT: {
            id: reservation.id
          }
        }
      })

      if (conflict) {
        throw new ReservationAlreadyExistsError()
      }
    }

    try {
      return await prisma.reservation.update({
        where: { id: data.id },
        data: {
          status: data.status,
          updatedAt: new Date()
        }
      })
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError && error.code === 'P2025') {
        throw new ReservationNotFoundError()
      }
      throw error;
    }
  }
}