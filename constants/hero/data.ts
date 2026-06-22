import { Button } from "@/components/ui/button";
import { ArrowRight, LucideProps } from "lucide-react";

type HeroButton = {
  label: string;
  href: string;
  variant?: React.ComponentProps<typeof Button>['variant'];
  icon?: React.ForwardRefExoticComponent<Omit<LucideProps, "ref"> & React.RefAttributes<SVGSVGElement>>;
  className?: string;
}

export const heroButtons: HeroButton[] = [
  {
    label: 'Reservar Mesa',
    href: '#reservas',
    variant: 'default',
    className: "h-14 rounded-full px-8 text-base shadow-[0_0_30px_rgba(212,175,55,0.25)] transition-all duration-300 hover:-translate-y-1"
  },
  {
    label: 'Explorar Cardápio',
    href: '#cardapio',
    variant: 'secondary',
    icon: ArrowRight,
    className: "h-14 rounded-full px-8 text-base group"
  }
] as const

export const heroCard = [
  {
    title: '+5.000',
    subtitle: 'Clientes Atendidos'
  },
  {
    title: '+1000',
    subtitle: 'Happy Hours Realizados'
  },
  {
    title: '4+',
    subtitle: 'Anos de História'
  },
] as const