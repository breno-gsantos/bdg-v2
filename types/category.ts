import { CategoryType } from "@/lib/generated/prisma/enums";

export type CategoryDTO = {
  id: string;
  name: string;
  type: CategoryType
}