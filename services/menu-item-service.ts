import { deleteImage } from "@/actions/images/delete-image";
import { CategoryNameAlreadyExistsError } from "@/errors/category/category-error";
import { MenuItemNotFoundError } from "@/errors/menu/menu-item-not-found";
import prisma from "@/lib/prisma";
import { menuItemDomainData } from "@/lib/validations/menu/menu-item-domain";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/client";

export class MenuItemService{
  static async create(data: menuItemDomainData) {
    const categoryExists = await prisma.category.findUnique({
      where: {
        id: data.categoryId
      }
    })

    if (!categoryExists) {
      throw new CategoryNameAlreadyExistsError()
    }

    try {
      return await prisma.menuItem.create({
        data: {
          name: data.name,
          description: data.description,
          price: data.price,
          isAvailable: data.isAvailable,
          isFeatured: data.isFeatured,
          imageUrl: data.imageUrl,
          categoryId: data.categoryId
        }
      })
    } catch (error) {
      throw error
    }
  }

  static async delete(id: string) {
    try {
      return await prisma.menuItem.delete({
        where: { id }
      })
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError && error.code === 'P2025') {
        throw new MenuItemNotFoundError()
      }
      throw error;
    }
  }

  static async update(id: string, data: menuItemDomainData) {
    const categoryExists = await prisma.category.findUnique({
    where: {
      id: data.categoryId
    }
  })

  if (!categoryExists) {
    throw new CategoryNameAlreadyExistsError();
  }

  const menuItem = await prisma.menuItem.findUnique({
    where: { id },
    select: { imageUrl: true }
  })

  if (menuItem?.imageUrl && data.imageUrl && menuItem.imageUrl !== data.imageUrl) {
    await deleteImage(menuItem.imageUrl);
  }

    try {
      return await prisma.menuItem.update({
        where: { id },
        data: {
          name: data.name,
          description: data.description,
          price: data.price,
          isAvailable: data.isAvailable,
          imageUrl: data.imageUrl,
          categoryId: data.categoryId,
          isFeatured: data.isFeatured
        }
      })
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError && error.code === 'P2025') {
        throw new MenuItemNotFoundError()
      }
      throw error;
    }
  }
}