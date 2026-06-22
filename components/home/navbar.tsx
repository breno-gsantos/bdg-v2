'use client'

import { navLinks } from "@/constants/navbar/data";
import { cn } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { Menu } from "lucide-react";

export function Navbar() {
  const [open, setOpen] = useState<boolean>(false);
  const [scrolled, setScrolled] = useState<boolean>(false);

  useEffect(() => {
    function handleScroll() {
      setScrolled(window.scrollY > 50)
    }

    window.addEventListener('scroll', handleScroll)

    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <header className={cn(
      'fixed h-20 top-0 left-0 right-0 z-50 transition-all duration-500',
      scrolled ?
        'bg-background/95 backdrop-blur-xl border-b border-border/50 shadow-lg shadow-background/20'
        : 'bg-transparent'
    )}>
      <div className="container mx-auto px-6 md:px-8">
        <div className="flex items-center justify-between">

          <Link href='/' className="flex items-center group">
            <Image src='/bdg.png' alt="Boteco do Gonza Logo" width={80} height={80} loading="eager" className="transition-transform duration-300 group-hover:-translate-y-1" />
          </Link>

          <nav className="hidden md:flex items-center gap-10">
            {navLinks.map((item) => (
              <Link key={item.href} href={item.href} className="relative text-base font-medium text-muted-foreground/70 transition-colors hover:text-foreground duration-300 tracking-wide group">
                {item.label}
                <span className="absolute -bottom-1 left-0 w-0 h-px bg-primary transition-all duration-300 group-hover:w-full" />
              </Link> 
            ))}
            <Button className="p-5" asChild>
              <Link href='#reservas'>
                Reservar Mesa
              </Link>
            </Button>
          </nav>

          <div className="md:hidden">
            <Sheet>
              <SheetTrigger asChild>
                <Button variant='ghost' size='sm'>
                  <Menu className="size-6" />
                </Button>
              </SheetTrigger>
              <SheetContent>
                <SheetHeader>
                  <SheetTitle className="sr-only">Menu</SheetTitle>
                  <SheetDescription className="sr-only">Descrição do Menu</SheetDescription>
                </SheetHeader>
                <nav className="py-6 border-t border-border/50">
                  <div className="h-full flex flex-col gap-1">
                    {navLinks.map((item) => (
                      <Link key={item.href} href={item.href} className="text-lg font-medium text-foreground/70 p-4">
                        {item.label}
                      </Link>
                    ))}
                    <div className="pt-28 px-4">
                      <Button asChild className="mt-auto font-medium tracking-wide w-full">
                        <Link href='#reservas'>
                          Reservar Mesa
                        </Link>
                      </Button>
                    </div>
                  </div>
                </nav>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  )
}