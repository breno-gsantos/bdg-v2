import { Prisma } from "./generated/prisma/client";

export function transformPriceToDecimal(value: string) {
  const normalized = value.replace(',', '.');

  return new Prisma.Decimal(normalized)
}

export function formatDate(date: Date) {
  return new Intl.DateTimeFormat("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }).format(date)
}