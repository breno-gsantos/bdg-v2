import prisma from "../prisma";

export async function getUserByEmail(email: string) {
  return prisma.user.findUnique({
    where: { email },
    select: {
      name: true,
      email: true,
      role: true,
      password: true,
      id: true
    }
  })
}