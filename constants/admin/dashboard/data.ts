import { CalendarDays, ClipboardList, TrendingUp, XCircle } from "lucide-react"

export const popularItems = [
  { name: "Caipirinha Original", orders: 45, revenue: "R$ 675" },
  { name: "Bolinho de Bacalhau", orders: 38, revenue: "R$ 570" },
  { name: "Picanha na Chapa", orders: 32, revenue: "R$ 1.280" },
  { name: "Chopp Pilsen", orders: 67, revenue: "R$ 670" },
] as const

export const quickActions = [
  { label: "Nova Reserva", href: '#', icon: CalendarDays, className: "bg-primary/10 text-primary hover:bg-primary/20 border border-primary/20" },
  { label: "Gerenciar Cardápio", href: '/admin/cardapio', icon: ClipboardList, className: "bg-secondary text-foreground hover:bg-secondary/80 border border-border" },
  { label: "Bloquear Horário", href: '/admin/horarios', icon: XCircle, className: "bg-secondary text-foreground hover:bg-secondary/80 border border-border" },
  { label: "Ver Relatórios", href: '#', icon: TrendingUp, className: "bg-secondary text-foreground hover:bg-secondary/80 border border-border" },
] as const