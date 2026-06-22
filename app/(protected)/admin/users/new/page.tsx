import { RegisterForm } from "@/components/auth/register-form";
import { Button } from "@/components/ui/button";
import { ChevronLeft } from "lucide-react";
import Link from "next/link";

export default function NewUserPage() {
  return (
    <main className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <Button variant='ghost' asChild>
            <Link href='/admin/users' className="group">
              <ChevronLeft className="size-4 transition-transform duration-200 group-hover:-translate-x-1" />
              Voltar
            </Link>
          </Button>
          <h1 className="dashboardTitle">Criar Usuário</h1>
          <p className="dashboardDescription">Adicione um novo usuário ao sistema</p>
        </div>
      </div>
      <RegisterForm />
    </main>
  )
}