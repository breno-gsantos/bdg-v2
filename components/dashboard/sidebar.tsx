'use client'

import { cn } from "@/lib/utils";
import { Session } from "next-auth";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ChevronRight, Menu, X } from "lucide-react";
import { sidebarNavigation } from "@/constants/admin/sidebar/data";
import { LogoutButton } from "../ui/logout-button";

interface SidebarProps {
  children: React.ReactNode;
  session: Session;
}

export function Sidebar({ children, session }: SidebarProps) {
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState<boolean>(false);

  return (
    <div className="relative min-h-screen bg-background">
      {sidebarOpen && (
        <div className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm lg:hidden" />
      )}

      <aside className={cn('fixed inset-y-0 left-0 z-50 w-72 bg-card border-r border-border transform transition-transform duration-300 ease-out lg:translate-x-0', sidebarOpen ? 'translate-x-0' : '-translate-x-full')}>
        <div className="flex flex-col h-full">
          <div className="h-20 flex items-center justify-between px-6 border-b border-border">
            <Link href='/admin' className="flex items-center gap-3">
              <Image src='/bdg.png' alt="Logo" width={48} height={48} loading="eager" className="rounded-lg" />
              <div>
                <span className="font-serif text-lg font-semibold text-foreground">
                  {session.user.name}
                </span>
                <span className="block text-xs text-muted-foreground tracking-wider">
                  {session.user.role}
                </span>
              </div>
            </Link>
            <Button variant='ghost' size='icon' className="lg:hidden" onClick={() => setSidebarOpen(false)}>
              <X className="size-5" />
            </Button>
          </div>

          <nav className="flex-1 px-4 py-6 space-y-1">
            {sidebarNavigation.map(({ href, icon: Icon, name }) => {
              if (href === '/admin/users' && session.user.role !== 'ROOT') {
                return null;
              }

              const isActive = pathname === href || (href !== '/admin' && pathname.startsWith(href));

              return (
                <Link key={href} href={href} className={cn('flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 group', isActive ? 'bg-primary/10 text-primary' : 'text-muted-foreground hover:bg-secondary hover:text-foreground')}>
                  <Icon className={cn('size-5 transition-transform duration-300 group-hover:-translate-y-0.5', isActive ? 'text-primary' : '')} />
                  <span>{name}</span>
                  {isActive && (
                    <ChevronRight className="size-4 ml-auto" />
                  )}
                </Link>
              )
            })}
          </nav>

          <div className="p-4 border-t border-border">
            <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-secondary/50">
              <Avatar>
                <AvatarImage src='https://github.com/shadcn.png' alt="root" />
                <AvatarFallback>Breno</AvatarFallback>
              </Avatar>

              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-foreground truncate">
                  {session.user.name}
                </p>
                <p className="text-xs text-muted-foreground truncate">
                  {session.user.email}
                </p>
              </div>

              <LogoutButton variant='ghost' size='icon' className="text-muted-foreground hover:text-foreground" />
            </div>
          </div>
        </div>
      </aside>

      <div className="lg:pl-72">
        <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b border-border bg-background/80 backdrop-blur-xl px-6">
          <Button variant='ghost' size='icon' className="lg:hidden" onClick={() => setSidebarOpen(true)}>
            <Menu className="size-5" />
          </Button>

          <div className="flex-1" />

          <Link href='/' className="text-sm text-muted-foreground hover:text-primary transition-colors">
            Ver Site
          </Link>
        </header>

        <main className="p-6 lg:p-8">
          {children}
        </main>
      </div>
    </div>
  )
}