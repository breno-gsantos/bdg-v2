import { ReservationList } from "@/components/dashboard/reservation/reservation-list";
import { DashboardWrapper } from "@/components/shared/dashboardWrapper";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import prisma from "@/lib/prisma";

export default async function ReservasPage() {
  const reservations = await prisma.reservation.findMany({
    orderBy: [
      { date: 'desc' },
      { time: 'asc' }
    ],
    take: 50
  })

  const serializedReservations = reservations.map(item => ({
    ...item,
    guests: item.guests.toString(),
    date: item.date.toISOString()
  }))

  return (
    <DashboardWrapper
      title="Reservas"
      description="Gerencie as reservas do seu estabelecimento"
      btnTitle="Nova Reserva"
      backHref="/reservas/novo"
    >
      <Card>
        <CardHeader>
          <CardTitle>Lista de Reservas</CardTitle>
        </CardHeader>
        <CardContent>
          <ReservationList reservations={serializedReservations} />
        </CardContent>
      </Card>
    </DashboardWrapper>
  )
}