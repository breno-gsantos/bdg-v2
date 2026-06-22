import z from "zod";

export const menuItemFormSchema = z.object({
  name: z.string().trim().min(2),
  description: z.string().max(500).optional(),
  price: z.string().min(1, 'Preço obrigatório').refine(
    (v) => /^\d+([.,]\d{1,2})?$/.test(v),
    'Preço Inválido'
  ),
  imageUrl: z.file().optional(),
  isAvailable: z.boolean().default(true),
  isFeatured: z.boolean().default(false),
  categoryId: z.string().min(1, 'Selecione uma categoria'),
});

export type menuItemFormData = z.input<typeof menuItemFormSchema>;