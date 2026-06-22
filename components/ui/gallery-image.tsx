'use client'

import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import Image from "next/image";
import { galleryImages } from "@/constants/gallery/data";
import { SiInstagram } from "react-icons/si";
import { Eye } from "lucide-react";

interface GalleryImageProps{
    image: typeof galleryImages[0];
    index: number;
    onClick: () => void;
}

export function GalleryImage({image, index, onClick}: GalleryImageProps){
    const [isLoaded, setIsLoaded] = useState<boolean>(false);
    const [isVisible, setIsVisible] = useState<boolean>(false);

    useEffect(() => {
        const timer = setTimeout(() => {
            setIsVisible(true)
        }, index * 50)
        return () => clearTimeout(timer)
    }, [index])
    
    return(
        <div className={cn('group relative aspect-square rounded-2xl overflow-hidden cursor-pointer transition-all duration-500', isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8')} onClick={onClick}>
            {!isLoaded && (
                <Skeleton className="absolute inset-0 rounded-2xl" />
            )}

            <Image src={image.src} alt={image.alt} fill className={cn('object-cover transition-transform duration-500 group-hover:scale-105', isLoaded ? 'opacity-100' : 'opacity-0')} onLoad={() => setIsLoaded(true)} sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw" loading="eager" />

            <div className="absolute inset-0 bg-linear-to-t from-background/90 via-background/40 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300">
                <div className="absolute inset-0 flex flex-col items-center justify-center gap-4">

                    <div className="size-14 rounded-full bg-primary/20 backdrop-blur-sm border border-primary/30 flex items-center justify-center transform translate-y-4 group-hover:translate-y-0 transition-all duration-300 delay-75">
                        <Eye className="size-6 text-primary" />
                    </div>

                    <span className="text-foreground font-medium text-sm transform translate-y-4 group-hover:translate-y-0 transition-all duration-300 delay-100">
                        Olhar
                    </span>
                </div>
            </div>
            <div className="absolute inset-0 rounded-2xl border-2 border-transparent group-hover:border-primary/30 transition-colors duration-300" />
        </div>
    )
}