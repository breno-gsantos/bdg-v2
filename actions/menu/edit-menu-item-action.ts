'use server'

import { MenuItemNotFoundError } from "@/errors/menu/menu-item-not-found";
import { requireAdmin } from "@/lib/auth/require-admin";
import { menuItemDomainSchema } from "@/lib/validations/menu/menu-item-domain";
import { MenuItemService } from "@/services/menu-item-service";
import { EditResponseAction } from "@/types/response-action";
import { revalidatePath } from "next/cache";

export async function editMenuItemAction(id: string, values: unknown): Promise<EditResponseAction>{
  await requireAdmin();

  const parsed = menuItemDomainSchema.safeParse(values);

  if (!parsed.success) {
    return {success: false, error: 'Dados inválidos'}
  }

  try {
    await MenuItemService.update(id, parsed.data)

    revalidatePath('/admin/cardapio');
    revalidatePath('/');

    return {success: true, message: 'Item atualizado com sucesso'}
  } catch (error) {
    if (error instanceof MenuItemNotFoundError) {
      return {success: false, error: error.message}
    }

    return {success: false, error: 'Erro interno do servidor'}
  }
}