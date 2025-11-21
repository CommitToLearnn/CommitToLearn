import rss from '@astrojs/rss';
import { getAllArticles } from '../utils/content';
import type { APIContext } from 'astro';

export async function GET(context: APIContext) {
  const articles = getAllArticles('pt-BR');
  
  return rss({
    title: 'CommitToLearn',
    description: 'Blog de estudos sobre tecnologia, algoritmos e desenvolvimento',
    site: context.site || 'https://committolearn.com',
    items: articles.map((article) => ({
      title: article.title,
      pubDate: article.date ? new Date(article.date) : new Date(),
      description: article.excerpt || '',
      link: `/articles/${article.slug}/`,
      categories: article.tags || [],
    })),
    customData: `<language>pt-br</language>`,
  });
}
