'use client'

import { deleteMenuItemAction } from "@/actions/menu/delete-menu-item-action";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { DialogFooter } from "@/components/ui/dialog";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { InputGroup, InputGroupAddon, InputGroupInput } from "@/components/ui/input-group";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { menuTypes } from "@/constants/admin/menu/data";
import { CategoryType } from "@/lib/generated/prisma/enums"
import { cn } from "@/lib/utils";
import { menuItemsDTO } from "@/types/menu-items";
import { Eye, EyeOff, MoreVertical, Pencil, Search, Trash } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react"
import { toast } from "sonner";

interface MenuItemListProps {
  menuItems: menuItemsDTO[]
}

export function MenuItemLIst({menuItems}: MenuItemListProps) {
  const [menuType, setMenuType] = useState<CategoryType>('foods');
  const [filter, setFilter] = useState<'all' | string>('all');
  const [search, setSearch] = useState<string>('');

  const currentCategories = [
    ...new Map(
      menuItems.filter(item => item.category.type === menuType).map(item => [item.category.id, item.category])
    ).values()
  ]

  const totalByType = menuItems.filter(item => item.category.type === menuType).length

  const filteredItems = menuItems.filter((item) => {
    const matchesType = item.category.type === menuType

    const matchesFilter = filter === 'all' || item.category.name === filter

    const matchesSearch =
      item.name.toLowerCase().includes(search.toLowerCase()) ||
      item.description?.toLowerCase().includes(search.toLowerCase())
    
    return matchesType && matchesFilter && matchesSearch
  });

  async function handleToggle(id: string, current: boolean) {
    console.log(id)
  }

  async function handleDelete(id: string) {
    try {
      const response = await deleteMenuItemAction(id);

      if (!response.success) {
        toast.error(response.error);
        return;
      }

      toast.success(response.message)
    } catch (error) {
      toast.error('Erro interno do servidor');
    }
  }

  return (
    <div className="space-y-6">
      <Tabs value={menuType} onValueChange={(value) => {
        setMenuType(value as CategoryType)
        setFilter('all')
      }}>
        <TabsList>
          {menuTypes.map((type) => (
            <TabsTrigger key={type.value} value={type.value}>
              {type.label}
            </TabsTrigger>
          ))}
        </TabsList>
      </Tabs>

      <div className="flex gap-2 overflow-x-auto pb-1">
        <Button variant={filter === 'all' ? 'default' : 'outline'} size='sm' onClick={() => setFilter('all')}>
          Totals ({totalByType})
        </Button>

        {currentCategories.map((cat) => (
          <Button key={cat.id} variant={filter === cat.name ? 'default' : 'outline'} size='sm' onClick={() => setFilter(cat.name)}>
            {cat.name}
          </Button>
        ))}
      </div>

      <div className="max-w-md">
        <InputGroup>
          <InputGroupInput placeholder="Buscar item..." value={search} onChange={(e) => setSearch(e.target.value)} />
          <InputGroupAddon>
            <Search className="size-4 text-muted-foreground" />
          </InputGroupAddon>
        </InputGroup>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredItems.map((item) => (
          <Card key={item.id} className={cn('h-full bg-card border-border transition-all hover:border-primary/30', !item.isAvailable && 'opacity-60')}>
            <CardHeader className="p-0">
              <div className="relative h-48 w-full overflow-hidden rounded-t-lg">
                {item.imageUrl && (
                  <Image src={item.imageUrl} alt={item.name} fill className="object-contain" sizes="192px" loading="eager" />
                )}
                {!item.isAvailable && (
                  <div className="absolute inset-0 flex items-center justify-center bg-black/60">
                    <Badge variant='destructive'>Indisponível</Badge>
                  </div>
                )}
              </div>
            </CardHeader>
            <CardContent className="p-4">
              <div className="mb-2 flex items-start justify-between">
                <h3 className="font-semibold text-foreground">{item.name}</h3>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant='ghost' size='icon' className="size-8">
                      <MoreVertical className="size-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem asChild>
                      <Link href={`/admin/cardapio/${item.id}`}>
                        <Pencil className="size-4" />
                        Editar
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleToggle(item.id, item.isAvailable)}>
                      {item.isAvailable ? (
                        <>
                          <EyeOff className="size-4" />
                          Desativar
                        </>
                      ) : (
                          <>
                            <Eye className="size-4" />
                            Ativar
                          </>
                      )}
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                          <Trash className="size-4" />
                          Excluir
                        </DropdownMenuItem>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Excluir Item do Cardápio?</AlertDialogTitle>
                          <AlertDialogDescription>
                            Essa ação não pode ser desfeita. Isso removerá
                            permanentemente o item do cardápio e todas informações relacionadas.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <DialogFooter>
                          <AlertDialogCancel>Cancelar</AlertDialogCancel>
                          <AlertDialogAction onClick={() => handleDelete(item.id)} className="bg-destructive transition-colors duration-150 hover:bg-destruictive/90">
                            Excluir item
                          </AlertDialogAction>
                        </DialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
              <p className="mb-3 text-sm text-muted-foreground line-clamp-2">
                {item.description}
              </p>
              <div className="flex items-center justify-between">
                <span className="text-lg font-bold text-foreground">
                  R$ {Number(item.price).toFixed(2).replace('.' , ',')}
                </span>
                <Badge variant={item.category ? 'default' : 'secondary'}>
                  {item.category.name}
                </Badge>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredItems.length === 0 && (
        <p className="text-center text-muted-foreground py-10">
          Nenhum item encontrado
        </p>
      )}
    </div>
  )
}