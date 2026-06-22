import type { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://www.botecodogonza.com.br';
  
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      // disallow: '/admin/', // se tiver área admin
    },
    sitemap: `${baseUrl}/sitemap.xml`,
    host: baseUrl,
  };
}