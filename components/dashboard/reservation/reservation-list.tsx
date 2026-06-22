'use client'

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { InputGroup, InputGroupAddon, InputGroupInput } from "@/components/ui/input-group";
import { statusConfig } from "@/constants/admin/reservation/data";
import { ReservationStatus } from "@/lib/generated/prisma/enums";
import { cn } from "@/lib/utils";
import { FilterCard, ReservationDTO } from "@/types/reservation"
import { Calendar, CheckCircle2, Clock, Filter, MoreHorizontal, Phone, Search, Trash, User, UserCheck, XCircle } from "lucide-react";
import { useState } from "react";
import { format } from 'date-fns'
import { ptBR } from "date-fns/locale";
import { SiWhatsapp } from 'react-icons/si';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { DialogFooter } from "@/components/ui/dialog";
import { deleteReservationAction } from "@/actions/reservation/delete-reservation-action";
import { toast } from "sonner";
import { updateReservationStatus } from "@/actions/reservation/update-reservation-status-action";

interface ReservationListProps {
  reservations: ReservationDTO[]
}

export function ReservationList({ reservations }: ReservationListProps) {
  const [filter, setFilter] = useState<'all' | ReservationStatus>('all');
  const [search, setSearch] = useState<string>('');
  const [loadingId, setLoadingId] = useState<string | null>(null);

  const stats = {
    total: reservations.length,
    confirmed: reservations.filter(r => r.status === 'CONFIRMED').length,
    pending: reservations.filter(r => r.status === 'PENDING').length,
    cancelled: reservations.filter(r => r.status === 'CANCELLED').length,
    no_show: reservations.filter(r => r.status === 'NO_SHOW').length
  }

  const filteredReservations = reservations.filter((r) => {
    const matchesFilter = filter === 'all' || r.status === filter

    const matchesSearch = r.name.toLowerCase().includes(search.toLowerCase()) || r.whatsapp.includes(search)

    return matchesFilter && matchesSearch
  })

  async function handleStatusChange(id: string, newStatus: ReservationStatus) {
    if (loadingId === id) return;

    setLoadingId(id);

    try {
      const response = await updateReservationStatus({id, status: newStatus});

      if (!response.success) {
        toast.error(response.error);
        return;
      }

      toast.success(response.message)
    } catch (error) {
      toast.error('Erro inesperado do servidor')
    } finally {
      setLoadingId(null);
    }
  }

  async function handleDelete(id: string) {
    try {
      const response = await deleteReservationAction(id);

      if (!response.success) {
        toast.error(response.error)
      }

      toast.success(response.message)
    } catch (error) {
      toast.error('Erro interno do servidor')
    }
  }

  const filterCards: FilterCard[] = [
    {
      filter: 'CONFIRMED',
      value: stats.confirmed,
      label: 'Confirmadas',
      icon: CheckCircle2,
      iconClass: 'text-green-500',
      bgClass: 'bg-green-500/10'
    },
    {
      filter: 'PENDING',
      value: stats.pending,
      label: 'Pendentes',
      icon: Clock,
      iconClass: 'text-amber-500',
      bgClass: 'bg-amber-500/10'
    },
    {
      filter: 'CANCELLED',
      value: stats.cancelled,
      label: 'Canceladas',
      icon: XCircle ,
      iconClass: 'text-destructive',
      bgClass: 'bg-destructive/10'
    },
  ]

  return (
    <div className="space-y-8">
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className={cn('cursor-pointer transition-all', filter === 'all' ? 'border-primary bg-primary/5' : 'bg-card border-border hover:border-primary/30')} onClick={() => setFilter('all')}>
          <CardContent className="p-4 flex items-center gap-4">
            <div className="size-10 rounded-xl bg-primary/10 flex items-center justify-center">
              <Calendar className="size-5 text-primary" />
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground">{stats.total}</p>
              <p className="text-sm text-muted-foreground">Total</p>
            </div>
          </CardContent>
        </Card>
        {filterCards.map(({ bgClass, filter, icon: Icon, iconClass, label, value }) => (
          <Card key={filter} className="cursor-pointer transition" onClick={() => setFilter(filter)}>
            <CardContent className="p-4 flex items-center gap-4">
              <div className={cn("size-10 rounded-xl flex items-center justify-center", bgClass)}>
                <Icon className={cn('size-5', iconClass)} />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">{value}</p>
                <p className="text-sm text-muted-foreground">{label}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1">
          <InputGroup>
            <InputGroupInput placeholder="Buscar por nome ou whatsapp..." value={search} onChange={(e) => setSearch(e.target.value)} />
            <InputGroupAddon>
              <Search className="size-4 text-muted-foreground" />
            </InputGroupAddon>
          </InputGroup>
        </div>
        <Button variant='outline' className="gap-2 border-border">
          <Filter className="size-4" />
          Filtros
        </Button>
      </div>

      <Card className="bg-card border-border">
        <CardHeader>
          <CardTitle className="text-xl">
            {filter === 'all' ? 'Todas Reservas' : `Reservas ${statusConfig[filter].label}s`}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {reservations.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">Nenhuma reserva encontrada</div>
          ) : (
            filteredReservations.map((reservation) => {
              const status = statusConfig[reservation.status]
              const Icon = status.icon
                 
              return (
                <div key={reservation.name} className="flex items-center justify-between p-4 rounded-xl bg-secondary/30 hover:bg-secondary/50 transition-colors">

                  <div className="flex items-center gap-4">
                    <div className="size-12 rounded-full bg-primary/10 flex items-center justify-center">
                      <span className="text-lg font-semibold text-primary">{reservation.name.charAt(0)}</span>
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <p className="font-medium text-foreground">{reservation.name}</p>
                        {reservation.notes && (
                          <span className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full">
                            {reservation.notes}
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground mt-1">
                        <span className="flex items-center gap-1">
                          <Phone className="size-3" />
                          {reservation.whatsapp}
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="size-3" />
                          {format(new Date(reservation.date), "dd 'de' MMMM yyyy", { locale: ptBR })}, {reservation.time}
                        </span>
                        <span className="flex items-center gap-1">
                          <User className="size-3" />
                          {reservation.guests} pessoas
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className={cn('flex items-center gap-1 text-xs font-medium px-3 py-1.5 rounded-full', status.color)}>
                      <Icon className="size-3" />
                      {status.label}
                    </span>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant='ghost' size='icon' className="size-8">
                          <MoreHorizontal className="size-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="bg-card border-border">
                        {reservation.status === 'PENDING' && (
                          <>
                            <DropdownMenuItem onClick={() => handleStatusChange(reservation.id, 'CONFIRMED')} disabled={loadingId === reservation.id}>
                              <CheckCircle2 className="size-4 text-green-500" />
                              Confirmar
                            </DropdownMenuItem>

                            <DropdownMenuItem className="text-red-500" onClick={() => handleStatusChange(reservation.id, 'CANCELLED')} disabled={loadingId === reservation.id}>
                              <XCircle className="size-4" />
                              Cancelar
                            </DropdownMenuItem>
                          </>
                        )}

                        {reservation.status === 'CONFIRMED' && (
                          <>
                            <DropdownMenuItem onClick={() => handleStatusChange(reservation.id, 'NO_SHOW')} disabled={loadingId === reservation.id}>
                              <UserCheck className="size-4" />
                              Marcar No-Show
                            </DropdownMenuItem>

                            <DropdownMenuItem className="text-red-500" onClick={() => handleStatusChange(reservation.id, 'CANCELLED')} disabled={loadingId === reservation.id}>
                              <XCircle className="size-4" />
                              Cancelar
                            </DropdownMenuItem>
                          </>
                        )}

                        {reservation.status === 'CANCELLED' && (
                          <DropdownMenuItem onClick={() => handleStatusChange(reservation.id, 'PENDING')} disabled={loadingId === reservation.id}>
                            <Clock className="size-4 text-amber-500" />
                            Reativar
                          </DropdownMenuItem>
                        )}

                        {reservation.status === 'NO_SHOW' && (
                          <DropdownMenuItem onClick={() => handleStatusChange(reservation.id, 'CONFIRMED')} disabled={loadingId === reservation.id}>
                            <CheckCircle2 className="size-4 text-green-500" />
                            Marcar como compareceu
                          </DropdownMenuItem>
                        )}

                        <DropdownMenuItem onClick={() => window.open(`https://wa.me/55${reservation.whatsapp}`)}>
                          <SiWhatsapp className="size-4" />
                          Whatsapp
                        </DropdownMenuItem>

                        <DropdownMenuSeparator />

                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                              <Trash className="size-4" />
                              Excluir
                            </DropdownMenuItem>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Excluir a reserva?</AlertDialogTitle>
                              <AlertDialogDescription>
                                Essa ação não pode ser desfeita. Isso removerá
                                permanentemente a reserva e todas informações relacionadas.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <DialogFooter>
                              <AlertDialogCancel>Cancelar</AlertDialogCancel>
                              <AlertDialogAction onClick={() => handleDelete(reservation.id)} className="bg-destructive transition-colors duration-150 hover:bg-destructive/90">
                                Excluir reserva
                              </AlertDialogAction>
                            </DialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>


                </div>
              )
            })
          )}
        </CardContent>
      </Card>
    </div>
  )
}