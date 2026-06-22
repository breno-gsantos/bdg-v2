'use server'

import { CategoryNameAlreadyExistsError } from "@/errors/category/category-error";
import { requireAdmin } from "@/lib/auth/require-admin";
import { categorySchema } from "@/lib/validations/menu/category-schema";
import { CategoryService } from "@/services/category-service";
import { CategoryResponseAction } from "@/types/response-action";

export async function createCategoryAction(values: unknown): Promise<CategoryResponseAction>{
  await requireAdmin();

  const parsed = categorySchema.safeParse(values);

  if(!parsed.success){
    return {success: false, fieldError: parsed.error.flatten().fieldErrors}
  };

  try {
    await CategoryService.create(parsed.data);

    return {success: true, message: 'Categoria criada com sucesso'}
  } catch (error) {
    if (error instanceof CategoryNameAlreadyExistsError) {
      return {
        success: false,
        fieldError: {
          name: [error.message]
        }
      }
    }
    return {success: false, error: 'Erro interno do servidor'}
  }
}