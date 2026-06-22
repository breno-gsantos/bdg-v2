import { localizationData } from "@/constants/localization/data";
import { Button } from "../ui/button";
import Link from "next/link";
import { Navigation } from "lucide-react";

export function Localization() {
  return (
    <section id="localizacao" className="py-8 bg-background relative overflow-hidden">
      <div className="absolute top-20 left-0 w-80 h-80 bg-primary/5 rounded-full blur-3xl" />
      <div className="absolute bottom-20 right-0 w-60 h-60 bg-primary/5 rounded-full blur-3xl" />

      <div className="mx-auto container px-6 md:px-8 relative">
        <div className="max-w-3xl mx-auto text-center mb-16">
          <span className="inline-block text-primary/80 text-sm tracking-[0.3em] uppercase font-medium mb-6">
            Localização
          </span>
          <h2 className="sectionTitle">
            Venha nos <span className="text-gradient">Visitar</span>
          </h2>
          <div className="w-20 h-1 bg-linear-to-r from-primary to-accent mx-auto mb-8 rounded-full" />
          <p className="sectionDescription">
            Estamos no coração do Gonzaga, o bairro mais vibrante de Santos.
          </p>
        </div>

        <div className="grid lg:grid-cols-5 gap-8 lg:gap-12 items-center max-w-6xl mx-auto">

          <div className="lg:col-span-2 space-y-6">
            {localizationData.map(({ icon: Icon, lines, title }) => (
              <div key={title} className="group bg-card p-6 md:p-8 rounded-2xl border border-border/50 hover:border-primary/30 transition-all duration-300 hover-lift">
                <div className="flex items-start gap-5">
                  <div className="size-14 rounded-2xl bg-primary/10 flex items-center justify-center shrink-0 group-hover:bg-primary/20 transition-colors duration-300">
                    <Icon className="size-7 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-serif text-xl font-semibold text-foreground mb-3 group-hover:text-primary transition-colors duration-300">
                      {title}
                    </h3>
                    <div className="space-y-1.5">
                      {lines.map((line, index) => (
                        <p key={index} className="text-muted-foreground">{line}</p>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ))}

            <Button asChild className="w-full bg-primary text-primary-foreground hover:bg-primary/90 h-14 text-base font-medium tracking-wide rounded-xl transition-all duration-300 hover:shadow-[0_0_30px_rgba(212,175,55,0.3)]">
              <Link href='https://www.google.com/maps/place/boteco+do+gonza/data=!4m2!3m1!1s0x94ce033893ca3c45:0xe82b7170091ef5ee?sa=X&ved=1t:242&ictx=111' target="_blank" rel="noopener noreferrer" className="flex items-center justify-center gap-2">
                <Navigation className="size-5" />
                Como chegar
              </Link>
            </Button>
          </div>

          <div className="lg:col-span-3 rounded-2xl overflow-hidden border border-border/50 h-100 lg:h-130 relative group">
            <div className="absolute inset-0 bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none z-10" />
            <iframe
              src="https://www.google.com/maps?q=boteco+do+gonza&output=embed"
              width="100%"
              height="100%"
              style={{ border: 0, filter: "grayscale(30%) contrast(1.1)" }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="Localização do Boteco do Gonza"
            />
          </div>

        </div>
      </div>
    </section>
  )
}