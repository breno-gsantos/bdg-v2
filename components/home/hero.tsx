'use client'

import { cn } from "@/lib/utils";
import Image from "next/image";
import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { heroButtons, heroCard } from "@/constants/hero/data";

export function Hero() {
  const [mounted, setMounted] = useState<boolean>(false);

  useEffect(() => {
    setMounted(true)
  }, [])

  return (
    <section className="relative min-h-screen overflow-hidden">
      <div className="absolute inset-0">
        <Image src='/bdg-wall.jpg' alt="Boteco do Gonza" fill priority className="object-cover scale-105" loading="eager" />
        <div className="absolute inset-0 bg-black/70" />
        <div className="absolute inset-0 bg-linear-to-r from-background via-background/70 to-background/40" />
        <div className="absolute inset-0 bg-linear-to-b from-background/50 via-transparent to-background" />
        <div className="absolute left-1/2 top-1/2 size-175 -translate-y-1/2 -translate-x-1/2 rounded-full bg-primary/10 blur-[140px]" />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-size-[80px_80px]" />
      </div>

      <div className="relative container mx-auto z-10 min-h-screen px-6 md:px-8">
        <div className="min-h-screen grid items-center pt-16 gap-16 lg:grid-cols-[1fr_380px]">

          <div>
            <div className={cn('mb-8', mounted ? 'animate-fade-in-down' : 'opacity-0')}>
              <div className="inline-flex items-center gap-3 rounded-full border border-primary/20 bg-background/30 px-5 py-2 backdrop-blur-xl">
                <div className="size-2 rounded-full bg-primary animate-pulse" />
                <span className="text-xs uppercase tracking-[0.25em] text-primary">
                  Santos • São Paulo
                </span>
              </div>
            </div>

            <h1 className={cn('max-w-5xl sectionTitle', mounted ? 'animate-fade-in-up' : 'opacity-0')}>
              O ponto de encontro
              <span className="block text-primary">
                para noites memoráveis
              </span>
            </h1>
            <p className={cn('sectionDescription', mounted ? 'animate-fade-in-up delay-200' : 'opacity-0')}>
              Drinks autorais, boa música e um ambiente pensado
              para transformar qualquer encontro em uma experiência
              única.
            </p>

            <div className={cn('mt-5 flex flex-col gap-4 sm:flex-row', mounted ? 'animate-fade-in-up delay-300' : 'opacity-0')}>
              {heroButtons.map(({ href, label, className, icon: Icon, variant }) => (
                <Button key={href} variant={variant} className={className} asChild>
                  <Link href={href}>
                    {label}
                    {Icon && (
                      <Icon className="size-6 transition-transform duration-200 group-hover:translate-x-2" />
                    )}
                  </Link>
                </Button>
              ))}
            </div>
          </div>

          <div className={cn('hidden lg:block', mounted ? 'animate-fade-in-up delay-500' : 'opacity-0')}>
            <div className="rounded-4xl border border-card bg-background/30 p-8 backdrop-blur-2xl">
              <div className="mb-6 flex items-center gap-2">
                <span className="text-primary text-lg">★★★★★</span>
                <span className="text-sm text-muted-foreground">Experiência Premium</span>
              </div>

              <div className="space-y-5">
                {heroCard.map((item) => (
                  <div key={item.title}>
                    <div className="text-4xl font-bold text-primary">
                      {item.title}
                    </div>
                    <p className="mt-1 text-sm text-muted-foreground">
                      {item.subtitle}
                    </p>
                  </div>
                ))}
              </div>

              <div className="my-8 h-px bg-white/10" />

              <div>
                <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground">
                  Localização
                </p>

                <p className="mt-3 text-lg text-foreground">
                  Rua Tolentino Filgueiras, 30
                </p>

                <p className="text-muted-foreground">
                  Santos • SP
                </p>
              </div>
            </div>
          </div>

        </div>

        <div className="absolute bottom-10 left-1/2 hidden -translate-x-1/2 lg:flex flex-col items-center gap-3">
          <span className="text-[10px] uppercase tracking-[0.35em] text-muted-foreground">
            Explore
          </span>
          <div className="h-12 w-px bg-linear-to-b from-primary/60 to-transparent" />
        </div>
      </div>
    </section>
  )
}