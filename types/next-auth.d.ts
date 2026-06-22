import { UserRole } from "@/lib/generated/prisma/enums";
import NextAuth, { type DefaultSession } from "next-auth"
import { JWT } from "next-auth/jwt"

declare module 'next-auth' {
  interface Session{
    user: {
      id: string;
      role: UserRole;
      email: string;
    } & DefaultSession['user']
  }
  interface User {
    id: string;
    role: UserRole;
    email: string;
  }
}

declare module 'next-auth/jwt' {
  interface JWT{
    id: string;
    role: UserRole;
    email: string;
  }
}