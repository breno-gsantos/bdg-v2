import { ReservationStatus } from "@/lib/generated/prisma/client"
import { LucideIcon } from "lucide-react";

export type ReservationDTO = {
  id: string;
  name: string;
  whatsapp: string;
  date: string;
  time: string;
  guests: string;
  status: ReservationStatus;
  notes: string | null;
}

export type FilterCard = {
  filter: 'all' | ReservationStatus;
  value: number;
  label: string;
  icon: LucideIcon;
  iconClass: string;
  bgClass: string;
}