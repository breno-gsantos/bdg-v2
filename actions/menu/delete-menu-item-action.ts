'use server'

import { MenuItemNotFoundError } from "@/errors/menu/menu-item-not-found";
import { requireAdmin } from "@/lib/auth/require-admin";
import { MenuItemService } from "@/services/menu-item-service";
import { DeleteResponseAction } from "@/types/response-action";
import { revalidatePath } from "next/cache";

export async function deleteMenuItemAction(id: string): Promise<DeleteResponseAction> {
  await requireAdmin()

  try {
    await MenuItemService.delete(id);

    revalidatePath('/admin/cardapio');
    revalidatePath('/')

    return {success: true, message: 'Item removido com sucesso'}
  } catch (error) {
    if (error instanceof MenuItemNotFoundError) {
      return {
        success: false,
        error: error.message
      }
    }
    return {success: false, error: 'Erro interno do servidor'}
  }
}