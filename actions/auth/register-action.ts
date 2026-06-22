'use server'

import { auth } from "@/auth";
import { EmailAlreadyExistsError } from "@/errors/auth/register-error";
import { registerDomainSchema } from "@/lib/validations/auth/register-schema"
import { AuthService } from "@/services/auth-service";
import { ResponseAction } from "@/types/response-action";

export async function registerAction(values: unknown): Promise<ResponseAction> {
  

  const parsed = registerDomainSchema.safeParse(values);

  if (!parsed.success) {
    return {success: false, fieldError: parsed.error.flatten().fieldErrors}
  };

  try {
    await AuthService.register(parsed.data);

    return {success: true, message: 'Conta criada com sucesso!'}
  } catch (error) {
    if (error instanceof EmailAlreadyExistsError) {
      return {
        success: false,
        fieldError: {
          email: [error.message]
        }
      }
    }
    return {success: false, error: 'Erro interno do servidor'}
  }
}