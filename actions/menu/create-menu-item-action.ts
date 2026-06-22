'use server'

import { requireAdmin } from "@/lib/auth/require-admin"
import { menuItemDomainSchema } from "@/lib/validations/menu/menu-item-domain";
import { MenuItemService } from "@/services/menu-item-service";
import { MenuItemResponseAction } from "@/types/response-action";
import { revalidatePath } from "next/cache";

export async function createMenuItemAction(values: unknown):Promise<MenuItemResponseAction> {
  await requireAdmin();

  const parsed = menuItemDomainSchema.safeParse(values);

  if (!parsed.success) {
    return {success: false, fieldError: parsed.error.flatten().fieldErrors}
  }

  try {
    await MenuItemService.create(parsed.data);

    revalidatePath('/admin/cardapio')
    revalidatePath('/')

    return {success: true, message: 'Item criado com sucesso'}
  } catch (error) {
    return {success: false, error: 'Erro interno do servidor'}
  }
}