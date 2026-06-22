import z from "zod";

export const loginFormSchema = z.object({
  email: z.email('Email inválido'),
  password: z.string().min(1, 'Senha obrigatória')
});

export type LoginData = z.infer<typeof loginFormSchema>;