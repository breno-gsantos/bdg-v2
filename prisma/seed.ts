import { PrismaClient } from "@/lib/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import "dotenv/config";

const adapter = new PrismaPg({
connectionString: process.env.DATABASE_URL,
});

const prisma = new PrismaClient({
adapter,
});

const schedule: Record<number, string[]> = {
  // Domingo
  0: [
    "13:00",
    "14:00",
    "15:00",
    "16:00",
    "17:00",
    "18:00",
    "19:00",
    "20:00",
    "21:00",
  ],

  // Segunda
  1: ["18:00", "19:00", "20:00", "21:00"],

  // Terça
  2: ["18:00", "19:00", "20:00", "21:00"],

  // Quarta
  3: ["18:00", "19:00", "20:00", "21:00"],

  // Quinta
  4: ["18:00", "19:00", "20:00", "21:00"],

  // Sexta
  5: ["18:00", "19:00", "20:00", "21:00"],

  // Sábado
  6: [
    "13:00",
    "14:00",
    "15:00",
    "16:00",
    "17:00",
    "18:00",
    "19:00",
    "20:00",
    "21:00",
  ],
}

export async function main() {
console.log("🌱 Iniciando seed de horários...");

for (const [dayOfWeek, times] of Object.entries(schedule)) {
for (const time of times) {
  await prisma.operatingHour.upsert({
    where: {
      dayOfWeek_time: {
        dayOfWeek: Number(dayOfWeek),
        time,
      },
    },
    update: {},
    create: {
      dayOfWeek: Number(dayOfWeek),
      time,
      isActive: true,
    },
  })
  }
  }

console.log("✅ Seed finalizado");
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  })
