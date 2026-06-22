import { LucideIcon } from "lucide-react";

export type Stat = {
  name: string;
  value: string;
  change: string;
  trend: 'up' | 'down';
  icon: LucideIcon
}