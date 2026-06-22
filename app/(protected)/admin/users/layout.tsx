import { auth } from "@/auth"
import { forbidden } from "next/navigation";

interface AdminUserProps{
  children: React.ReactNode
}

export default async function AdminUserLayout({ children }: AdminUserProps) {
  const session = await auth();

  if (session?.user.role !== 'ROOT') {
    forbidden()
  }

  return (
    <>
      {children}
    </>
  )
}