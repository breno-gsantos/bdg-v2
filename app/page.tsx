import { About } from "@/components/home/about";
import { Footer } from "@/components/home/footer";
import { Gallery } from "@/components/home/gallery";
import { Hero } from "@/components/home/hero";
import { Localization } from "@/components/home/localization";
import { MenuPreview } from "@/components/home/menu-preview";
import { Navbar } from "@/components/home/navbar";
import { Reservation } from "@/components/home/reservation";
import prisma from "@/lib/prisma";

export default async function Home() {
  const menuItems = await prisma.menuItem.findMany({
    include: {
      category: true
    }
  })

  const serializedMenuItems = menuItems.map(item => ({
    ...item,
    price: item.price.toString()
  }))

  return (
    <main>
      <Navbar />
      <Hero />
      <About />
      <Gallery />
      <MenuPreview menuItems={serializedMenuItems} />
      <Reservation />
      <Localization />
      <Footer />
    </main>
  );
}
