import { CreateCategoryModal } from "@/components/dashboard/menu/create-category-modal";
import { CreateMenuItem } from "@/components/dashboard/menu/create-menu-item";
import { MenuItemLIst } from "@/components/dashboard/menu/menu-item-list";
import { Button } from "@/components/ui/button";
import prisma from "@/lib/prisma";
import { Plus } from "lucide-react";
import Link from "next/link";

export default async function MenuPage() {
  const menuItems = await prisma.menuItem.findMany({
    include: {
      category: true
    }
  })

  const serializedMenuItems = menuItems.map(item => ({
    ...item,
    price: item.price.toString()
  }))

  return (
    <main className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="dashboardTitle">Cardápio</h1>
          <p className="dashboardDescription">Gerencie os itens do seu cardápio</p>
        </div>
        <div className="flex gap-4">
          <Button asChild className="bg-primary">
            <Link href='/admin/cardapio/novo'>
              <Plus className="size-4" />
              Novo Item
            </Link>
          </Button>
          <CreateCategoryModal />
        </div>
      </div>

      <MenuItemLIst menuItems={serializedMenuItems} />
    </main>
  )
}