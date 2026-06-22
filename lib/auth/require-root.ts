import { auth } from "@/auth";

export async function requireRoot() {
  const session = await auth();

  if (!session) {
    throw new Error('Unauthorized')
  }

  if (session.user.role !== 'ROOT') {
    throw new Error('Only ROOT can perform this action')
  }

  return session;
}