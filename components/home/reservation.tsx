'use client'

import { getAvailableTimes } from "@/actions/reservation/get-available-times";
import { benefits } from "@/constants/reservation/data";
import { ReservationFormData, reservationFormSchema } from "@/lib/validations/reservation/reservation-schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { format } from "date-fns";
import { ArrowRight, CalendarIcon, CheckCircle2, Clock, Users } from "lucide-react";
import { useEffect, useState } from "react"
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";
import { Card } from "@/components/ui/card";
import { Field, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { InputGroup, InputGroupAddon, InputGroupInput, InputGroupText, InputGroupTextarea } from "@/components/ui/input-group";
import { IMaskInput } from 'react-imask';
import { SiWhatsapp } from "react-icons/si";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { cn } from "@/lib/utils";
import { ptBR } from "date-fns/locale";
import { Calendar } from "@/components/ui/calendar";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { createReservationAction } from "@/actions/reservation/create-reservation-action";

export function Reservation() {
  const [availableTimes, setAvailableTimes] = useState<string[]>([]);
  const [isLoadingTimes, setIsLoadingTimes] = useState<boolean>(false);

  const form = useForm<ReservationFormData>({
    resolver: zodResolver(reservationFormSchema),
    defaultValues: {
      name: '',
      whatsapp: '',
      date: undefined,
      time: '',
      guests: '',
      notes: undefined
    }
  })

  const { control, handleSubmit, formState, watch, getValues, setValue, setError, reset } = form
  const { isSubmitting } = formState;

  const selectedDate = watch('date');

  function disabledDates(date: Date) {
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    return date < today
  }

  useEffect(() => {
    if (!selectedDate) {
      setAvailableTimes([])
      return;
    }

    async function loadTimes() {
      setIsLoadingTimes(true);

      try {
        const times = await getAvailableTimes(format(selectedDate, 'yyyy-MM-dd'))
        setAvailableTimes(times);

        const currentTime = getValues('time')
        if (currentTime && !times.includes(currentTime)) {
          setValue('time', '')
        }
      } catch (error) {
        toast.error('Erro ao carregar horários')
      } finally {
        setIsLoadingTimes(false);
      }
    }

    loadTimes()
  }, [selectedDate, form, setValue, getValues])

  async function onSubmit(values: ReservationFormData) {
    try {
      const response = await createReservationAction(values);

      if (!response.success) {
        if (response.fieldError) {
          Object.entries(response.fieldError).forEach(([field, messages]) => {
            setError(field as keyof ReservationFormData, {
              type: 'server',
              message: messages[0]
            });
          });
          return;
        }
        toast.error(response.error);
        return;
      }

      toast.success(response.message);

      reset({
        name: '',
        whatsapp: '',
        date: undefined,
        time: '',
        guests: '',
        notes: '',
      })
    
      form.clearErrors();

      setValue('whatsapp', '', { shouldValidate: false, shouldDirty: false });
    } catch (error) {
      toast.error('Erro interno do servidor')
    }
  }

  return (
    <section id="reservas" className="py-8 bg-card relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-px bg-linear-to-r from-transparent via-primary/20 to-transparent" />
      <div className="absolute bottom-0 left-0 w-full h-px bg-linear-to-r from-transparent via-primary/20 to-transparent" />
      <div className="absolute top-1/3 right-0 w-80 h-80 bg-primary/5 rounded-full blur-3xl" />
      <div className="absolute bottom-1/3 left-0 w-60 h-60 bg-primary/5 rounded-full blur-3xl" />

      <div className="container mx-auto px-6 md:px-8 relative">
        <div className="grid lg:grid-cols-2 gap-10 lg:gap-20 items-center max-w-6xl mx-auto">

          <div>
            <span className="inline-block text-primary/80 text-sm tracking-[0.3em] uppercase font-medium mb-6">
              Reservas
            </span>
            <h2 className="sectionTitle">
              Reserve sua <span className="text-gradient">Mesa</span>
            </h2>
            <div className="w-36 h-1 bg-linear-to-r from-primary to-accent mb-8 rounded-full" />
            <p className="sectionDescription mb-10">
              Garanta seu lugar para uma noite inesquecível. Nosso time entrará em contato para confirmar sua reserva
            </p>
            <div className="space-y-4">
              {benefits.map((benefit, index) => (
                <div key={index} className="flex items-center gap-3 text-foreground/80">
                  <div className="size-6 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                    <CheckCircle2 className="size-4 text-primary" />
                  </div>
                  <span>{benefit}</span>
                </div>
              ))}
            </div>
          </div>

          <Card className="w-full sm:max-w-lg shadow-xl">
            <form onSubmit={handleSubmit(onSubmit)} className="p-8">
              <FieldGroup>
                <Controller control={control} name="name" render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor={field.name}>Nome e Sobrenome</FieldLabel>
                    <InputGroup>
                      <InputGroupInput placeholder="Seu nome" id={field.name} aria-invalid={fieldState.invalid} {...field} disabled={isSubmitting} />
                      <InputGroupAddon>
                        <Users className="size-5 text-muted-foreground group-focus-within:text-primary transition-color" />
                      </InputGroupAddon>
                    </InputGroup>
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )} />

                <Controller control={control} name="whatsapp" render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor={field.name}>Número do WhatsApp</FieldLabel>
                    <div className="relative group">
                      <SiWhatsapp className="absolute left-2 top-1/2 -translate-y-1/2 size-5 text-muted-foreground group-focus-within:text-primary transition-colors" />
                      <IMaskInput
                        mask="(00) 00000-0000"
                        value={field.value || ''}
                        onAccept={(unmaskedValue) => field.onChange(unmaskedValue)}
                        onBlur={field.onBlur}
                        name={field.name}
                        id={field.name}
                        inputRef={field.ref}
                        placeholder="(13) 99999-9999"
                        className="imaskInput pl-8"
                        disabled={isSubmitting}
                        aria-invalid={fieldState.invalid}
                      />
                    </div>
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )} />

                <div className="grid grid-cols-2 gap-4">
                  <Controller control={control} name="date" render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                      <FieldLabel htmlFor={field.name}>Data da Reserva</FieldLabel>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button variant='outline' className={cn('justify-start text-left font-normal bg-card border-border', !field.value && 'text-muted-foreground')}>
                            <CalendarIcon className="mr-1 size-5 text-muted-foreground" />
                            {field.value ? format(field.value, "dd 'de' MMMM yyyy", { locale: ptBR }) : 'Selecione uma data'}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar mode="single" selected={field.value} onSelect={field.onChange} disabled={disabledDates} autoFocus locale={ptBR} />
                        </PopoverContent>
                      </Popover>
                      {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                    </Field>
                  )} />

                  <Controller control={control} name="time" render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                      <FieldLabel htmlFor={field.name}>Horário</FieldLabel>
                      <Select value={field.value} onValueChange={field.onChange} disabled={isLoadingTimes || availableTimes.length === 0}>
                        <SelectTrigger id={field.name} aria-invalid={fieldState.invalid} className="w-full justify-start text-left font-normal bg-card border-border">
                          <Clock className="size-5" />
                          <SelectValue placeholder={isLoadingTimes ? 'Carregando...' : 'Selecione um horário'} />
                        </SelectTrigger>
                        <SelectContent>
                          {availableTimes.length > 0 ? (
                            availableTimes.map((time) => (
                              <SelectItem key={time} value={time}>{time}</SelectItem>
                            ))
                          ) : (
                            <div className="px-4 py-3 text-sm text-muted-foreground">
                              Selecione uma data para ver horários disponíveis
                            </div>
                          )}
                        </SelectContent>
                      </Select>
                      {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                    </Field>
                  )} />
                </div>

                <Controller control={control} name="guests" render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor={field.name}>Número de Pessoas</FieldLabel>
                      <Select value={field.value} onValueChange={field.onChange} disabled={isSubmitting}>
                      <SelectTrigger id={field.name} aria-invalid={fieldState.invalid} className="max-w-50 justify-start text-left font-normal bg-card border-border">
                         <Users className="size-5 text-muted-foreground pointer-events-none z-10 group-focus-within:text-primary transition-colors" />
                          <SelectValue placeholder="Quantas pessoas?" />
                        </SelectTrigger>
                        <SelectContent>
                          {[5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20].map((n) => (
                            <SelectItem key={n} value={n.toString()}>
                              {n} pessoa{n > 1 ? 's' : ''}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                  </Field>
                )} />

                <Controller control={control} name="notes" render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor={field.name}>Observação (opcional)</FieldLabel>
                    <InputGroup>
                      <InputGroupTextarea placeholder="Andar superior, calçada, assistir jogo..." id={field.name} aria-invalid={fieldState.invalid} {...field} disabled={isSubmitting} className="min-h-10 resize-none" />
                      <InputGroupAddon align="block-end">
                        <InputGroupText className="tabular-nums">
                          {field.value?.length}/50
                        </InputGroupText>
                      </InputGroupAddon>
                    </InputGroup>
                    {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                  </Field>
                )} />

                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? (
                    <>
                      <Spinner />
                      Enviando...
                    </>
                  ) : (
                      <>
                        <ArrowRight className="size-5" />
                        Solicitar Reserva
                      </>
                  )}
                </Button>
              </FieldGroup>
            </form>
          </Card>


        </div>
      </div>
    </section>
  )
}