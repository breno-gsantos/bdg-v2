import { EditMenuItem } from "@/components/dashboard/menu/edit-menu-item";
import { Button } from "@/components/ui/button";
import prisma from "@/lib/prisma";
import { ChevronLeft } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";

interface MenuItemDetailPageProps{
  params: Promise<{
    id: string;
  }>
}

export default async function MenuItemDetailPage({ params }: MenuItemDetailPageProps) {
  const { id } = await params

  const menuItem = await prisma.menuItem.findUnique({
    where: { id },
    include: {
      category: true
    }
  })

  const categories = await prisma.category.findMany()

  if (!menuItem) {
    notFound();
  }

  const serializedMenuItem = {
    ...menuItem,
    price: menuItem.price.toString()
  }

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
          <h1 className="dashboardTitle">Editar item {menuItem.name}</h1>
          <p className="dashboardDescription">Edite o item ao cardápio</p>
        </div>
      </div>
      <EditMenuItem menuItems={serializedMenuItem} categories={categories} />
    </main>
  )
}