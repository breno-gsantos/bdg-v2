'use server'

import { signIn } from "@/auth";
import { loginFormSchema } from "@/lib/validations/auth/login-schema";
import { ResponseAction } from "@/types/response-action";

export async function loginAction(values: unknown): Promise<ResponseAction>{
  const parsed = loginFormSchema.safeParse(values);

  if (!parsed.success) {
    return {success: false, error: 'Não foi possível concluir o login. Verifique os dados informados.'}
  }

  const { email, password } = parsed.data

  try {
    await signIn('credentials', {
      email,
      password,
      redirect: false
    });

    return {success: true, message: 'Bem-vindo'}
  } catch (error) {
    return {success: false, error: 'Email ou senha inválidos'}
  }
}