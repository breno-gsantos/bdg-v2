import { Prisma } from "@/lib/generated/prisma/client";
import z from "zod";

export const menuItemDomainSchema = z.object({
  name: z.string(),
  description: z.string().optional(),
  price: z.string().transform((data) => new Prisma.Decimal(data.replace("," , "."))),
  imageUrl: z.url().optional(),
  isAvailable: z.boolean(),
  isFeatured: z.boolean(),
  categoryId: z.string().min(1),
})

export type menuItemDomainData = z.output<typeof menuItemDomainSchema>;