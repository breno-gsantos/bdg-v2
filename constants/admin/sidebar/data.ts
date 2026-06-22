import { CalendarDays, Clock, LayoutDashboard, UserCog, UtensilsCrossed } from "lucide-react";

export const sidebarNavigation = [
  { name: "Dashboard", href: "/admin", icon: LayoutDashboard },
  { name: "Reservas", href: "/admin/reservas", icon: CalendarDays },
  { name: "Cardápio", href: "/admin/cardapio", icon: UtensilsCrossed },
  { name: "Horários", href: "/admin/horarios", icon: Clock },
  { name: 'Usuários', href: '/admin/users', icon: UserCog, roles: ['ROOT'] }
] as const