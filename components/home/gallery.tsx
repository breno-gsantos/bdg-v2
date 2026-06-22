'use client'

import { galleryImages } from "@/constants/gallery/data";
import { useState } from "react";
import { GalleryImage } from "@/components/ui/gallery-image";
import Link from "next/link";
import { SiInstagram } from "react-icons/si";
import { Dialog, DialogContent, DialogDescription, DialogTitle } from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import Image from "next/image";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import { Button } from "../ui/button";

export function Gallery() {
  const [selectedImage, setSelectedImage] = useState<number | null>(null);

  function handlePrevious() {
    if (selectedImage !== null) {
      setSelectedImage(selectedImage === 0 ? galleryImages.length - 1 : selectedImage - 1)
    }
  }

  function handleNext() {
    if (selectedImage !== null) {
      setSelectedImage(selectedImage === galleryImages.length - 1 ? 0: selectedImage + 1)
    }
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === 'ArrowLeft') handlePrevious
    if (e.key === 'ArrowRight') handleNext
  }

  return (
    <section id="galeria" className="py-8 bg-background relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-px bg-linear-to-r from-transparent via-primary/20 to-transparent" />
      <div className="absolute top-40 left-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
      <div className="absolute bottom-40 right-0 w-80 h-80 bg-primary/5 rounded-full blur-3xl" />

      <div className="mx-auto container px-6 md:px-8 relative">
        <div className="mx-auto max-w-3xl text-center mb-16">
          <span className="inline-block text-primary/80 text-sm tracking-tight uppercase font-medium mb-6">
            Galeria
          </span>
          <h2 className="sectionTitle">
            Momentos <span className="text-gradient">Inesquecíveis</span>
          </h2>
          <div className="w-48 h-1 bg-linear-to-r from-primary to-accent mx-auto mt-2 mb-8 rounded-full" />
          <p className="sectionDescription">
            Cada noite no Boteco do Gonza é uma nova história. Confira alguns dos
            <span className="text-foreground font-medium"> melhores momentos </span>
            capturados em nosso espaço.
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-8">
          {galleryImages.map((image, index) => (
            <GalleryImage key={image.id} image={image} index={index} onClick={() => setSelectedImage(index)} />
          ))}
        </div>

        <div className="mt-16 text-center">
          <Link href='https://instagram.com/botecodogonza' target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-3 px-8 py-4 rounded-full bg-card border border-border/50 hover:border-primary/50 text-foreground hover:text-primary transition-all duration-300 group hover-lift">
            <SiInstagram className="size-5 group-hover:-translate-y-0.5 transition-transform duration-300" />
            <span className="font-medium">Siga @botecodogonza</span>
          </Link>
        </div>
      </div>

      <Dialog open={selectedImage !== null} onOpenChange={() => setSelectedImage(null)}>
        <DialogContent className="max-w-5xl w-[95vw] p-0 bg-background/90 backdrop-blur-xl border-border/50 overflow-hidden">
          <DialogTitle className="sr-only">Visualização da imagem da galeria</DialogTitle>
          <DialogDescription className="sr-only">Descrição da imagem</DialogDescription>
          {selectedImage !== null && (
            <div className="relative">
              <Button variant='ghost' size='icon' className="absolute top-4 right-4 z-10 rounded-full bg-background/50 backdrop-blur-sm hover:bg-background/80" onClick={() => setSelectedImage(null)}>
                <X className="size-5" />
              </Button>

              <Button variant="ghost" size="icon" className="absolute left-4 top-1/2 -translate-y-1/2 z-10 rounded-full bg-background/50 backdrop-blur-sm hover:bg-background/80" onClick={handlePrevious}>
                <ChevronLeft className="size-6" />
              </Button>

              <Button variant="ghost" size="icon" className="absolute right-4 top-1/2 -translate-y-1/2 z-10 rounded-full bg-background/50 backdrop-blur-sm hover:bg-background/80" onClick={handleNext}>
                <ChevronRight className="size-6" />
              </Button>

              <div className="relative aspect-square md:aspect-video max-h-[80vh]">
                <Image src={galleryImages[selectedImage].src.replace("w=600&h=600", "w=1200&h=800")} alt={galleryImages[selectedImage].alt} fill className="object-contain" priority sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 1200px" />
              </div>

              <div className="p-6 border-t border-border/50">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-foreground font-medium">{galleryImages[selectedImage].caption}</p>
                    <p className="text-muted-foreground text-sm mt-1">{galleryImages[selectedImage].alt}</p>
                  </div>
                  <Link href="https://instagram.com/botecodogonza" target="_blank" rel="noopener noreferrer" className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-primary hover:bg-primary/20 transition-colors duration-200">
                    <SiInstagram className="size-4" />
                    <span className="text-sm font-medium">Ver no Instagram</span>
                  </Link>
                </div>

                <div className="flex items-center justify-center gap-2 mt-4">
                  {galleryImages.map((_, index) => (
                    <button key={index} className={cn('size-2 rounded-full transition-all duration-300', index === selectedImage ? "bg-primary w-6" : "bg-muted-foreground/30 hover:bg-muted-foreground/50")} onClick={() => setSelectedImage(index)} />
                  ))}
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </section>
  )
}