'use client'

import { iconMap, menuButtonOptions } from "@/constants/menu-preview/data";
import { CategoryType } from "@/lib/generated/prisma/enums"
import { menuItemsDTO } from "@/types/menu-items";
import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Carousel, CarouselContent, CarouselItem } from "../ui/carousel";
import { ImageOff, Wine } from "lucide-react";
import Image from "next/image";
import { Dialog, DialogContent, DialogDescription, DialogTitle } from "../ui/dialog";

interface MenuPreviewProps{
  menuItems: menuItemsDTO[]
}

export function MenuPreview({ menuItems }: MenuPreviewProps) {
  const [menuType, setMenuType] = useState<CategoryType>('foods');

  const currentCategories = [
    ...new Map(
      menuItems.filter(item => item.category.type === menuType).map(item => [item.category.id, item.category])
    ).values()
  ]

  const [activeCategory, setActiveCategory] = useState<string>(currentCategories[0].id)
  const [selectedItem, setSelectedItem] = useState<menuItemsDTO | null>(null);

  const currentCategory = currentCategories.find((cat) => cat.id === activeCategory);
  const currentItems = menuItems.filter(item => item.category.id === activeCategory);

  useEffect(() => {
    setActiveCategory(currentCategories[0].id)
  }, [menuType])

  useEffect(() => {
    const el = document.getElementById('menu-items')
    el?.scrollTo({top: 0, behavior: 'smooth'})
  }, [activeCategory])

  return (
    <section id="cardapio" className="py-8 bg-background relative overflow-hidden">
      <div className="absolute top-1/4 left-0 w-40 h-40 bg-primary/5 rounded-full blur-3xl" />
      <div className="absolute bottom-1/4 right-0 w-60 h-60 bg-primary/5 rounded-full blur-3xl" />

      <div className="mx-auto container px-6 md:px-8 relative">
        <div className="max-w-3xl mx-auto text-center mb-16">
          <span className="inline-block text-primary/80 text-sm tracking-tight uppercase font-medium mb-6">
            Nosso Cardápio
          </span>
          <h2 className="sectionTitle">
            Sabores que <span className="text-gradient">Conquistam</span>
          </h2>
          <div className="w-36 h-1 bg-linear-to-r from-primary to-accent mx-auto my-8 rounded-full" />
          <p className="sectionDescription">
            Cada prato conta uma história, cada drink inspira um brinde.
          </p>
        </div>

        <div className="flex justify-center gap-4 mb-10">
          {menuButtonOptions.map(({ icon: Icon, label, menuType: type }) => (
            <Button key={label} variant='ghost' size='lg' onClick={() => setMenuType(type)} className={cn('font-medium transition', menuType === type ? 'bg-primary text-primary-foreground' : 'text-foreground')}>
              <Icon className="size-6" />
              {label}
            </Button>
          ))}
        </div>

        <div className="flex justify-center gap-3 md:gap-4 mb-16">
          <Carousel opts={{ align: 'start' }} className="w-full max-w-2xl">
            <CarouselContent className="-ml-2">
              {currentCategories.map((cat) => {
                const Icon = iconMap[cat.slug ?? ""] ?? Wine
                
                return (
                  <CarouselItem key={cat.id} className="pl-4 basis-[45%] sm:basis-1/2 md:basis-1/3">
                    <Button className={cn(
                      'group transition-all duration-300 w-full',
                      activeCategory === cat.id ? 'bg-primary text-primary-foreground'
                        : 'bg-card text-muted-foreground hover:text-primary-foreground hover:bg-primary border border-border hover:border-primary/30'
                    )}
                      onClick={() => setActiveCategory(cat.id)}
                    >
                      <Icon className={cn('size-6 transition-transform duration-300', activeCategory === cat.id ? '' : 'grop-hover:-translate-y-100')} />
                      <span className="hidden sm:inline tracking-wide whitespace-nowrap">
                        {cat.name}
                      </span>
                    </Button>
                  </CarouselItem>
                )
              })}
            </CarouselContent>
          </Carousel>
        </div>

        <div id="menu-items" className="max-w-3xl mx-auto h-200 overflow-y-auto p-4">
          <div className="grid gap-4">
            {currentItems.map((item, index) => (
              <div key={index} className="group relative bg-card p-6 md:p-8 rounded-2xl border transition-all duration-300 ease-out hover:-translate-y-0.5 hover:shadow-[0_8px_30px_rgba(212,175,55,0.15)] active:scale-[0.99]" style={{ animationDelay: `${index * 100}ms` }} onClick={() => setSelectedItem(item)}>
                <div className="flex items-center justify-center gap-5">
                  <div className="relative size-24 md:size-28 rounded-xl overflow-hidden shrink-0">
                    {item.imageUrl ? (
                      <>
                        <Image src={item.imageUrl} alt={item.name} fill sizes="(max-width: 768px) 120px, 160px" className="object-cover" />
                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                      </>
                    ) : (
                      <div className="size-full bg-secondary/50 flex items-center justify-center">
                        <ImageOff className="size-6 text-muted-foreground/40" />
                      </div>
                    )}
                  </div>

                  <div className="w-full flex justify-between items-center gap-6">
                    <div className="flex-1 min-w-0">
                      <h3 className="font-serif text-xl md:text-2xl font-semibold text-foreground mb-2 group-hover:text-primary transition-colors duration-300">
                        {item.name}
                      </h3>
                      <p className="hidden md:line-clamp-3 text-muted-foreground leading-relaxed">
                        {item.description}
                      </p>
                    </div>
                    <div className="text-right shrink-0">
                      <span className="text-2xl md:text-3xl font-serif font-bold text-primary whitespace-nowrap">
                        R$ {Number(item.price).toFixed(2).replace('.', ',')}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="absolute bottom-0 left-8 right-8 h-px bg-linear-to-r from-transparent via-border to-transparent scale-x-0 group-hover:scale-x-100 origin-left transition-opacity duration-500" />
              </div>
            ))}
          </div>
        </div>

        <p className="text-center text-muted-foreground/60 mt-10 text-sm tracking-wide">
          * Cardápio sujeito a alterações. Consulte disponibilidade no local.
        </p>
      </div>

      <Dialog open={selectedItem !== null} onOpenChange={(open) => {
        if (!open) setSelectedItem(null)
      }}>
        <DialogContent className="max-w-2xl w-[95vw] p-0 overflow-hidden bg-card border-border/50 rounded-2xl">
          <DialogTitle className="sr-only">{selectedItem?.name || "Detalhes do Item"}</DialogTitle>
          <DialogDescription className="sr-only">{selectedItem?.description || "Descrição do Item"}</DialogDescription>
          {selectedItem && (
            <div className="flex flex-col">
              <div className="relative w-full aspect-video bg-muted overflow-hidden">
                {selectedItem.imageUrl ? (
                  <Image src={selectedItem.imageUrl} alt={selectedItem.name} fill sizes="(max-width: 768px) 100vw, 700px" className="object-contain" priority />
                ) : (
                  <div className="size-full flex items-center justify-center">
                    <ImageOff className="size-10 text-muted-foreground/40" />
                  </div>
                )}

                <div className="absolute inset-0 bg-linear-to-t from-black/50 via-transparent to-transparent" />
              </div>

              <div className="p-5 md:p-6 space-y-4">
                <div className="flex items-start justify-between gap-4">
                  <h2 className="text-xl md:text-2xl font-serif font-bold">
                    {selectedItem.name}
                  </h2>
                  <span className="text-xl md:text-2xl font-serif font-bold text-primary whitespace-nowrap">
                    {Number(selectedItem.price).toFixed(2).replace('.', ',')}
                  </span>
                </div>
                <p className="text-muted-foreground text-sm md:text-base leading-relaxed">
                  {selectedItem.description}
                </p>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </section>
  )
}