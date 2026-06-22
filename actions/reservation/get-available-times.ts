'use server'

import prisma from "@/lib/prisma";
import { endOfDay, startOfDay } from "date-fns";

export async function getAvailableTimes(selectedDate: string) {
  const date = new Date(selectedDate + 'T00:00:00-03:00')
  const dayOfWeek = date.getDay();

  const operatingHours = await prisma.operatingHour.findMany({
    where: {
      dayOfWeek,
      isActive: true
    },
    orderBy: {
      time: 'asc'
    },
    select: {
      time: true
    }
  });

  const allPossibleTimes = operatingHours.map(h => h.time);

  const existingReservation = await prisma.reservation.findMany({
    where: {
      date: {
        gte: startOfDay(date),
        lte: endOfDay(date)
      },
      status: { in: ['PENDING', 'CONFIRMED'] }
    },
    select: {
      time: true
    }
  });

  const occupied = new Set(existingReservation.map(r => r.time));

  const blocked = await prisma.blockedSlot.findMany({
    where: {
      date: {
        gte: startOfDay(date),
        lte: endOfDay(date)
      }
    },
    select: {
      time: true
    }
  });

  const blockedTimes = new Set(blocked.map(b => b.time));

  const available = allPossibleTimes.filter(
    time => !occupied.has(time) && !blockedTimes.has(time)
  );

  return available;
}