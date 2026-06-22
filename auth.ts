import NextAuth from "next-auth"
import { PrismaAdapter } from '@auth/prisma-adapter';
import prisma from "@/lib/prisma";
import Credentials from 'next-auth/providers/credentials'
import { loginFormSchema } from "./lib/validations/auth/login-schema";
import { getUserByEmail } from "./lib/auth/user";
import { comparePassword } from "./lib/auth/password";
 
export const { handlers, signIn, signOut, auth } = NextAuth({
  adapter: PrismaAdapter(prisma),
  providers: [
    Credentials({
      async authorize(credentials) {
        const parsed = loginFormSchema.safeParse(credentials);

        if (!parsed.success) return null;

        const { email, password } = parsed.data;

        const user = await getUserByEmail(email);

        if (!user || !user.password) return null;

        const passwordMatches = await comparePassword(password, user.password);

        if (!passwordMatches) return null;

        return {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role
        }
      }
    })
  ],
  session: { strategy: 'jwt' },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id
        token.role = user.role
        token.email = user.email
      }
      return token;
    },

    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id
        session.user.role = token.role
        session.user.email = token.email
      }
      return session;
    }
  },
  secret: process.env.AUTH_SECRET,
})