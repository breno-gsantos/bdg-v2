'use server'

import { requireAdmin } from "@/lib/auth/require-admin";
import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function addOperatingHour(dayOfWeek: number, time: string) {
  await requireAdmin();

  await prisma.operatingHour.upsert({
    where: {
      dayOfWeek_time: { dayOfWeek, time }
    },
    update: {
      isActive: true
    },
    create: {
      dayOfWeek,
      time,
      isActive: true
    }
  });

  revalidatePath('/admin/horarios');

  return { success: true }
}