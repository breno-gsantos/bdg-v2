import { EmailAlreadyExistsError } from "@/errors/auth/register-error";
import { hashPassword } from "@/lib/auth/password";
import prisma from "@/lib/prisma";
import { RegisterDTO } from "@/lib/validations/auth/register-schema";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/client";

export class AuthService{
  static async register(data: RegisterDTO) {
    const hashedPassword = await hashPassword(data.password);

    try {
      return await prisma.user.create({
        data: {
          name: data.name,
          email: data.email,
          password: hashedPassword,
          role: data.role
        }
      })
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError && error.code === 'P2002') {
        throw new EmailAlreadyExistsError()
      }
      throw error;
    }
  }
}