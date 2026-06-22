import { CategoryType } from "@/lib/generated/prisma/enums";
import { Beef, Beer, ChefHat, Citrus, CupSoda, Dessert, Drumstick, Glasses, GlassWater, Hamburger, IceCreamBowl, LucideIcon, Martini, Sandwich, Sparkles, UtensilsCrossed, Wine } from "lucide-react";

type menuButtonTypes = {
  label: string;
  icon: LucideIcon;
  menuType: CategoryType
}

export const menuButtonOptions: menuButtonTypes[] = [
  { label: 'Comida', icon: ChefHat, menuType: 'foods' },
  { label: 'Bebida', icon: GlassWater, menuType: 'drinks' },
  { label: 'Sobremesa', icon: Dessert, menuType: 'desserts' },
];

export const iconMap: Record<string, LucideIcon> = {
    entradas: UtensilsCrossed,
    porcoes: Drumstick,
    pasteis: Sandwich,
    "tabuas-e-grelhados": Beef,
    lanches: Hamburger,
    sobremesas: IceCreamBowl,
    "drinks-classicos": Martini,
    "drinks-da-casa": Sparkles,
    cervejas: Beer,
    softs: CupSoda,                    
    combos: Glasses,                   
    garrafas: Wine,                    
    gt: Martini,                       
    caipirinha: Citrus,
}