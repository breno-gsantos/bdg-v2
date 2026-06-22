'use server'

import { requireAdmin } from "@/lib/auth/require-admin";
import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function toggleBlockedSlot(date: string, time: string, reason?: string) {
  await requireAdmin()

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
      where: { id: existing.id }
    });

    revalidatePath('/admin/horarios');
    revalidatePath('/');

    return { status: 'unblocked' }
  }

  await prisma.blockedSlot.create({
    data: {
      date: normalizedDate,
      time,
      reason
    }
  });

  revalidatePath('/admin/horarios');
  revalidatePath('/');

  return { status: 'blocked' }
}