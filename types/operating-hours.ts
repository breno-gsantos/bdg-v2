export type OperatingHoursDTO = {
  id: string;
  dayOfWeek: number;
  time: string;
  isActive: boolean;
}

export type TimeSlot = {
  time: string;
  status: "available" | "blocked" | "booked";
}

export type BlockedSlotDTO = {
  id: string;
  time: string;
  date: Date;
  reason: string | null;
}