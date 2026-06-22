import { CategoryNameAlreadyExistsError } from "@/errors/category/category-error";
import prisma from "@/lib/prisma";
import { CategoryDomainData } from "@/lib/validations/menu/category-schema";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/client";

export class CategoryService{
  static async create(data: CategoryDomainData) {
    try {
      return await prisma.category.create({
        data: {
          name: data.name,
          type: data.type
        }
      })
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError && error.code === 'P2002') {
        throw new CategoryNameAlreadyExistsError()
      }
      throw error
    }
  }
}