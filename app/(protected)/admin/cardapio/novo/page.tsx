import { CreateMenuItem } from "@/components/dashboard/menu/create-menu-item";
import { Button } from "@/components/ui/button";
import prisma from "@/lib/prisma";
import { ChevronLeft } from "lucide-react";
import Link from "next/link";

export default async function NewMenuItemPage() {
  const categories = await prisma.category.findMany({
    select: {
      name: true,
      type: true,
      id: true
    }
  })

  return (
    <main className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <Button variant='ghost' asChild>
            <Link href='/admin/cardapio' className="group">
              <ChevronLeft className="size-4 transition-transform duration-200 group-hover:-translate-x-1" />
              Voltar
            </Link>
          </Button>
          <h1 className="dashboardTitle">Criar item</h1>
          <p className="dashboardDescription">Adicione um novo item ao cardápio</p>
        </div>
      </div>
      <CreateMenuItem categories={categories} />
    </main>
  )
}