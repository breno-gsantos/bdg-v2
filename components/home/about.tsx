import { features } from "@/constants/about/data";
import { Card, CardContent } from "../ui/card";

export function About() {
  return (
    <section id="#sobre" className="relative bg-card py-8 overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-px bg-linear-to-r from-transparent via-primary/20 to-transparent" />
      <div className="absolute bottom-0 left-0 w-full h-px bg-linear-to-r from-transparent via-primary/20 to-transparent" />
      <div className="absolute top-20 right-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl" />
      <div className="absolute bottom-20 left-0 w-80 h-80 bg-primary/5 rounded-full blur-3xl" />

      <div className="mx-auto container px-6 md:px-8 relative">
        <div className="max-w-3xl mx-auto text-center text-3xl mb-20">
          <span className="inline-block text-primary/80 uppercase text-sm tracking-tight font-medium mb-6">
            Nossa História
          </span>
          <h2 className="sectionTitle">
            A esquina <span className="text-gradient">Mais Charmosa</span> de Santos
          </h2>
          <div className="w-36 h-1 bg-linear-to-r from-primary to-accent mx-auto mb-8 rounded-full" />
          <p className="sectionDescription">
            Há mais de 04 anos, o Boteco do Gonza é o ponto de encontro favorito dos santistas. 
            Um lugar onde a <span className="text-foreground font-medium">boa comida</span>, drinks de qualidade e ambiente envolvente se encontram 
            para criar <span className="text-foreground font-medium">experiências memoráveis</span>.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 lg:gap-12">
          {features.map(({ icon: Icon, description, highlight, title }) => (
            <Card key={title} className="relative bg-background group shadow-md transition-all hover:-translate-y-1 hover:shadow-primary/10 duration-300">
              <div className="absolute inset-0 rounded-2xl bg-linear-to-b from-primary/5 to-transparent opacity-10 group-hover:opacity-90 transition-opacity duration-100" />
              
              <CardContent className="p-8 flex flex-col h-full">
                <div className="size-16 rounded-2xl bg-primary/10 flex items-center justify-center mb-8 group-hover:bg-primary/20 transition-all duration-300 group-hover:-translate-y-1">
                  <Icon className="size-8 text-primary" />
                </div>

                <h3 className="font-serif text-2xl font-semibold text-foreground mb-4 group-hover:text-primary transition-colors duration-300">
                  {title}
                </h3>

                <p className="text-muted-foreground leading-relaxed mb-6">
                  {description}
                </p>

                <div className="mt-auto inline-flex justify-center items-center gap-2 p-2 rounded-full bg-primary/10 border border-primary/20">
                <span className="size-1.5 rounded-full bg-primary animate-pulse" />
                <span className="text-sm font-medium text-primary">{highlight}</span>
              </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}