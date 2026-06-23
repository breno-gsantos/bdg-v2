import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";
import { Toaster } from "@/components/ui/sonner";

const inter = Inter({subsets:['latin'],variable:'--font-sans'});

const playfair_display = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-serif'
});

export const metadata: Metadata = {
  title: "Boteco do Gonza | Bar & Gastronomia em Santos",
  description: "A esquina mais charmosa de Santos ✨. Comida irresistível, bebida gelada e resenha garantida. Reserve sua mesa agora!",
  keywords: ["boteco santos", "bar santos", "gastronomia santos", "happy hour santos",
    "restaurante santos", "restaurante", "gonzaga", "chopp gelado", "cerveja gelada"
  ],
  authors: [{ name: 'Boteco do Gonza' }],
  creator: "Boteco do Gonza",
  openGraph: {
    title: "Boteco do Gonza | Bar & Gastronomia em Santos",
    description: "A esquina mais charmosa de Santos. Comida boa, bebida gelada e resenha garantida.",
    url: "https://bdg-v2.vercel.app/", // ← Troque pelo domínio final
    siteName: "Boteco do Gonza",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Boteco do Gonza - Fachada e interior",
      },
    ],
    locale: "pt_BR",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Boteco do Gonza | Bar em Santos",
    description: "Comida irresistível, bebida gelada e resenha garantida.",
    images: ["/og-image.jpg"],
  },
  icons: {
    icon: '/favicon.ico',
    shortcut: "/favicon.ico",
    apple: "/bdg.png", // Recomendado
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" className={cn("h-full", "antialiased", playfair_display.variable, "font-sans", inter.variable)}>
      <body className="min-h-full flex flex-col">
        {children}
        <Toaster richColors />
      </body>
    </html>
  );
}
