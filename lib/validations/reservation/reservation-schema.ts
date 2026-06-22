import { ReservationStatus } from "@/lib/generated/prisma/enums";
import z from "zod";

export const reservationFormSchema = z.object({
  name: z.string().trim().min(2, 'Nome muito curto').max(50, 'Nome muito longo'),
 whatsapp: z.string()
  .transform((val) => val.replace(/\D/g, ""))
  .refine((val) => val.length === 0 || val.length === 11, { 
    message: "WhatsApp deve ter 11 dígitos (DDD + número)" 
  })
  .refine((val) => val.length === 0 || /^[1-9]{2}9\d{8}$/.test(val), { 
    message: "WhatsApp inválido" 
  }),
  date: z.date('Selecione uma data'),
  time: z.string().min(1, 'Selecione um horário'),
  notes: z.string().max(50, 'Observação muito longa').optional(),
  guests: z.string().min(1, "Selecione o número de pessoas"),
})

export const reservationDomainSchema = z.object({
  name: z.string(),
  whatsapp: z.string(),
  date: z.date('Selecione uma data'),
  time: z.string(),
  guests: z.coerce.number().int().positive(),
  notes: z.string().optional()
})

export const editReservationDomainSchema = z.object({
  id: z.string(),
  status: z.enum(ReservationStatus)
})

export type ReservationFormData = z.input<typeof reservationFormSchema>;
export type ReservationDomainData = z.output<typeof reservationDomainSchema>;
export type EditReservationDomainData = z.infer<typeof editReservationDomainSchema>;