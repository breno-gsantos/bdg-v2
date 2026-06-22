import { CategoryType } from "@/lib/generated/prisma/enums";
import z from "zod";

export const categorySchema = z.object({
  name: z.string().trim().min(1, 'Nome obrigatório').max(30, 'Nome muito longo'),
  type: z.enum(CategoryType)
})

export type CategoryFormData = z.input<typeof categorySchema>;
export type CategoryDomainData = z.output<typeof categorySchema>;