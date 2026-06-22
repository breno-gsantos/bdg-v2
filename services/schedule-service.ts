import { SlotAlreadyBlockedError } from "@/errors/schedule/error";
import prisma from "@/lib/prisma";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/client";

export class ScheduleService{
  static async toggleBlock(date: string, time: string, reason?: string) {
    const normalizedDate = new Date(date + "T00:00:00");
    
    const existing = await prisma.blockedSlot.findUnique({
      where: {
        date_time: {
          date: normalizedDate,
          time
        }
      }
    });

    if (existing) {
      await prisma.blockedSlot.delete({
        where: {
          id: existing.id
        }
      })
    };

    return await prisma.blockedSlot.create({
      data: {
        date: normalizedDate,
        time,
        reason
      }
    })
  }
}