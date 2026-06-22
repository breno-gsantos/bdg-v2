import { CategoryType } from "@/lib/generated/prisma/enums";

export type menuItemsDTO = {
  id: string;
  name: string;
  description: string | null;
  price: string;
  imageUrl: string | null;
  isAvailable: boolean;
  isFeatured: boolean;
  categoryId: string;
  category: {
    id: string;
    name: string;
    type: CategoryType;
    slug: string;
  }
}