'use server'

import { requireAdmin } from "@/lib/auth/require-admin";
import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function deleteOperatingHour(dayOfWeek: number, time: string) {
  await requireAdmin()

  await prisma.operatingHour.delete({
    where: {
      dayOfWeek_time: { dayOfWeek, time }
    }
  });

  revalidatePath('/admin/horarios');
  revalidatePath('/');
}