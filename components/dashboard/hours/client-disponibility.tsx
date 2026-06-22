'use client'

import { addOperatingHour } from "@/actions/schedule/add-operating-hour"
import { deleteOperatingHour } from "@/actions/schedule/delete-operating-hour"
import { toggleBlockedSlot } from "@/actions/schedule/toggle-block-slot"
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Switch } from "@/components/ui/switch"
import { cn } from "@/lib/utils"
import { BlockedSlotDTO, OperatingHoursDTO, TimeSlot } from "@/types/operating-hours"
import { ReservationDTO } from "@/types/reservation"
import { format } from "date-fns"
import { ptBR } from "date-fns/locale"
import { AlertCircle, Ban, CalendarIcon, Check, Clock, Lock, Plus, Trash2, Unlock } from "lucide-react"
import { useMemo, useState } from "react"
import { toast } from "sonner"

interface ClientDisponibilityProps {
  operatingHours: OperatingHoursDTO[];
  blockedSlots: BlockedSlotDTO[];
  reservations: ReservationDTO[];
}


export function ClientDisponibility({operatingHours, blockedSlots, reservations}: ClientDisponibilityProps) {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date())
  const [isAddDialogOpen, setIsAddDialogOpen] = useState<boolean>(false)
  const [newTime, setNewTime] = useState<string>("")
  const [loadingTime, setLoadingTime] = useState<string | null>(null)
  const [bulkLoading, setBulkLoading] = useState<boolean>(false)

  const getDayName = (date: Date) => {
    return format(date, "EEEE", { locale: ptBR })
  }

  const dateKey = format(selectedDate, "yyyy-MM-dd")
  const dayOfWeek = selectedDate.getDay()

  const baseSlots = useMemo(() => {
    return operatingHours.filter(h => h.dayOfWeek === dayOfWeek && h.isActive).map(h => h.time).sort()
  }, [operatingHours, dayOfWeek])

  const blockedForDate = useMemo(() => {
    return blockedSlots
      .filter(b => format(b.date, "yyyy-MM-dd") === dateKey)
      .map(b => b.time)
  }, [blockedSlots, dateKey])

  const bookedForDate = useMemo(() => {
  return reservations
    .filter(r =>
      format(new Date(r.date), "yyyy-MM-dd") === dateKey &&
      ['PENDING', 'CONFIRMED'].includes(r.status)
    )
    .map(r => r.time)
}, [reservations, dateKey])

  const timeSlots: TimeSlot[] = useMemo(() => {
    return baseSlots.map(time => {
      if (bookedForDate.includes(time)) {
        return { time, status: 'booked' }
      }

      if (blockedForDate.includes(time)) {
        return { time, status: 'blocked' }
      }

      return { time, status: 'available' }
    })
  }, [baseSlots, blockedForDate, bookedForDate])

  const stats = {
    total: timeSlots.length,
    available: timeSlots.filter(t => t.status === 'available').length,
    blocked: timeSlots.filter(t => t.status === 'blocked').length,
    booked: timeSlots.filter(t => t.status === 'booked').length,
  }

  const statsData = [
    { iconClass: 'text-primary', value: stats.total, label: 'Total', icon: Clock, bgClass: 'bg-primary/20' },
    { iconClass: 'text-green-500', value: stats.available, label: 'Disponível', icon: Check, bgClass: 'bg-green-500/10' },
    { iconClass: 'text-red-500', value: stats.blocked, label: 'Bloqueados', icon: Ban, bgClass: 'bg-red-500/10' },
    { iconClass: 'text-amber-500', value: stats.booked, label: 'Ocupados', icon: AlertCircle, bgClass: 'bg-amber-500/10' },
  ]

  async function handleToggleBlock(time: string) {
    if (loadingTime) return;

    try {
      setLoadingTime(time)
      await toggleBlockedSlot(dateKey, time)
      toast.success("Horário atualizado")
    } catch (error) {
      toast.error("Erro ao atualizar horário")
    } finally {
      setLoadingTime(null)
    }
  }

  async function handleBlockAll() {
    try {
      setBulkLoading(true)

      const availableTimes = timeSlots
        .filter(t => t.status === 'available')
        .map(t => t.time)

      await Promise.all(
        availableTimes.map(time => toggleBlockedSlot(dateKey, time))
      )

      toast.success("Todos horários bloqueados")
    } catch {
      toast.error("Erro ao bloquear horários")
    } finally {
      setBulkLoading(false)
    }
  }

  async function handleUnblockAll() {
    try {
      setBulkLoading(true)

      await Promise.all(
        blockedForDate.map(time => toggleBlockedSlot(dateKey, time))
      )

      toast.success("Horários liberados")
    } catch {
      toast.error("Erro ao liberar horários")
    } finally {
      setBulkLoading(false)
    }
  }

  async function handleAddTimeSlot() {
    if (!newTime) return

    if (baseSlots.includes(newTime)) {
      toast.error("Horário já existe")
      return
    }

    try {
      await addOperatingHour(dayOfWeek, newTime)
      toast.success("Horário adicionado")
      setNewTime("")
      setIsAddDialogOpen(false)
    } catch {
      toast.error("Erro ao adicionar horário")
    }
  }

  async function handleDelete(time: string) {
    if (loadingTime) return;

    try {
      setLoadingTime(time);

      await deleteOperatingHour(dayOfWeek, time);

      toast.success("Horário removido");
    } catch (error) {
      toast.error("Erro ao remover horário");
    } finally {
      setLoadingTime(null);
    }
  } 

  return (
    <div className="space-y-8">
      <Card className="bg-card border-border">
        <CardContent className="p-4 sm:p-6">
          <div className="flex flex-col sm:flex-row sm:items-center gap-6">
            <div className="flex items-center gap-4">
              <div className="size-10 rounded-xl bg-primary/10 flex items-center justify-center">
                <CalendarIcon className="size-6 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Data Selecionada</p>
                <p className="font-medium text-foreground capitalize">
                  {format(selectedDate, "dd 'de' MMMM 'de' yyyy", { locale: ptBR })}
                </p>
                <p className="text-sm text-muted-foreground capitalize">
                  {getDayName(selectedDate)}
                </p>
              </div>
            </div>
            <div className="sm:ml-auto">
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant='outline' className="w-full sm:w-auto gap-2">
                    <CalendarIcon className="size-4" />
                    Selecionar Data
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="end">
                  <Calendar
                    mode="single"
                    selected={selectedDate}
                    onSelect={(date) => date && setSelectedDate(date)}
                    disabled={(date) => date < new Date(new Date().setHours(0, 0, 0, 0))}
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-4 grid-cols-2 lg:grid-cols-4">
        {statsData.map(({ icon: Icon, iconClass, label, value, bgClass }) => (
          <Card key={label} className="bg-card border-border">
            <CardContent className="p-4 flex items-center gap-4">
              <div className={cn("size-10 rounded-full flex items-center justify-center", bgClass)}>
                <Icon className={cn('size-4', iconClass)} />
              </div>
              <div>
                <p className="text-2xl font-bold">{value}</p>
                <p className="text-sm text-muted-foreground">{label}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="flex flex-wrap items-center justify-center gap-3">
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button variant='destructive' disabled={stats.available === 0 || bulkLoading}>
              <Lock className="size-4" />
              Bloquear Todos
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Bloquear o dia inteiro?</AlertDialogTitle>
              <AlertDialogDescription>
                Isso vai bloquear todos os horários disponíveis.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancelar</AlertDialogCancel>
              <AlertDialogAction onClick={handleBlockAll}>
                Confirmar
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>

        <Button variant="outline" onClick={handleUnblockAll} disabled={stats.blocked === 0 || bulkLoading}>
          <Unlock className="size-4 mr-2" />
          Liberar Todos
        </Button>

        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button variant="outline">
              <Plus className="size-4 mr-2" />
              Adicionar Horário
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Novo Horário</DialogTitle>
              <DialogDescription>
                Adicione um horário extra
              </DialogDescription>
            </DialogHeader>

            <Input
              type="time"
              value={newTime}
              onChange={(e) => setNewTime(e.target.value)}
            />

            <DialogFooter>
              <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                Cancelar
              </Button>
              <Button onClick={handleAddTimeSlot}>
                Adicionar
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>
            Horários • {format(selectedDate, "dd 'de' MMMM", { locale: ptBR })}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          {timeSlots.map(slot => (
            <div key={slot.time} className="flex justify-between items-center p-3 rounded-lg bg-muted">
              <span>{slot.time}</span>

              <div className="flex items-center gap-3">
                <Badge variant={slot.status === 'blocked' ? 'destructive' : slot.status === 'booked' ? 'secondary' : 'default'}>
                  {slot.status === 'blocked' ? 'Bloqueado' : slot.status === 'booked' ? 'Reservado' : 'Disponível'}
                </Badge>

                <Switch
                  checked={slot.status === 'available'}
                  onCheckedChange={() => handleToggleBlock(slot.time)}
                  disabled={slot.status === 'booked' || loadingTime === slot.time}
                  className="cursor-pointer bg-primary"
                />

                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button size='icon' variant='ghost' disabled={slot.status === 'booked' || loadingTime === slot.time} className="text-muted-foreground hover:text-red-500">
                      <Trash2 className="size-4" />
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Remover horário?</AlertDialogTitle>
                      <AlertDialogDescription>
                        Isso vai remover permanentemente o horário <strong>{slot.time}</strong>.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <DialogFooter>
                      <AlertDialogCancel>Cancelar</AlertDialogCancel>
                      <AlertDialogAction onClick={() => handleDelete(slot.time)}>
                        Remover
                      </AlertDialogAction>
                    </DialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  )
}