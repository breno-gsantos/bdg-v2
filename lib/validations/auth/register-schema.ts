import { UserRole } from '@/lib/generated/prisma/enums'
import { z } from 'zod'

export const registerDomainSchema = z.object({
  name: z.string().trim().min(2, 'Nome obrigatório').max(100, 'Nome muito longo'),
  email: z.email('Email inválido').trim().transform((data) => data.toLowerCase()),
  password: z
    .string()
    .min(8, 'Senha deve conter ao menos 8 caracteres')
    .max(20, 'Senha muito longa')
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^\w\s]).+$/,
      'A senha deve conter letra maiúscula, minúscula, número e caractere especial'
  ),
  role: z.enum(UserRole)
})

export const registerFormSchema = registerDomainSchema.extend({
  confirmPassword: z.string()
}).refine((data) => data.password === data.confirmPassword, {
  path: ['confirmPassword'],
  error: 'As senhas não coincidem'
})

export type RegisterData = z.input<typeof registerFormSchema>;
export type RegisterDTO = z.output<typeof registerDomainSchema>;