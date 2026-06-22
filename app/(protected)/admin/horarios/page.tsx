import { ClientDisponibility } from "@/components/dashboard/hours/client-disponibility";
import prisma from "@/lib/prisma";

export default async function HorariosPage() {
  const operatingHour = await prisma.operatingHour.findMany({
    where: {
      isActive: true
    },
    orderBy: [
      {dayOfWeek: 'asc'},
      {time: 'asc'}
    ]
  })

  const blockedSlots = await prisma.blockedSlot.findMany({
    orderBy: {
      date: 'asc'
    }
  })

  const reservations = await prisma.reservation.findMany({
    orderBy: [
      { date: 'desc' },
      { time: 'asc' }
    ],
    take: 50
  })

  const serializedReservations = reservations.map(item => ({
    ...item,
    date: item.date.toISOString(),
    guests: item.guests.toString()
  }))

  return (
    <main className="space-y-8">
      <div>
        <h1 className="dashboardTitle">Disponibilidade de Reservas</h1>
        <p className="dashboardDescription">Configure os horários de funcionamento e bloqueios pontuais</p>
      </div>

      <ClientDisponibility operatingHours={operatingHour} blockedSlots={blockedSlots} reservations={serializedReservations} />
    </main>
  )
}