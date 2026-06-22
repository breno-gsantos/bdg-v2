'use server'

import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
})

export async function deleteImage(imageUrl: string) {
  try {
    const parts = imageUrl.split('/');

    const fileName = parts.at(-1)?.split('.')[0];

    const folder = parts.slice(
      parts.indexOf('upload') + 2,
      -1
    ).join('/');

    const publicId = `${folder}/${fileName}`;

    await cloudinary.uploader.destroy(publicId);

    return {
      success: true
    }

  } catch (error) {
    console.log(error);

    return {
      success: false,
      error: 'Erro ao deletar imagem'
    }
  }
}