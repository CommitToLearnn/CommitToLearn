import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import readingTime from 'reading-time';

const articlesDir = path.join(process.cwd(), 'articles');
const notesDir = path.join(process.cwd(), '../notes');

export interface Article {
  slug: string;
  title: string;
  content: string;
  excerpt?: string;
  date?: string;
  category?: string;
  tags?: string[];
  lang: string;
  readingTime?: string;
}

function stripMarkdown(text: string): string {
  return text
    .replace(/#{1,6}\s+/g, '') // Remove headers
    .replace(/\*\*(.+?)\*\*/g, '$1') // Remove bold
    .replace(/\*(.+?)\*/g, '$1') // Remove italic
    .replace(/\[(.+?)\]\(.+?\)/g, '$1') // Remove links
    .replace(/`{1,3}(.+?)`{1,3}/g, '$1') // Remove code
    .replace(/^[-*+]\s+/gm, '') // Remove list markers
    .replace(/^>\s+/gm, '') // Remove blockquotes
    .replace(/\n{2,}/g, ' ') // Multiple newlines to space
    .replace(/\n/g, ' ') // Single newlines to space
    .trim();
}

function capitalizeTitle(text: string): string {
  return text.charAt(0).toUpperCase() + text.slice(1);
}

export function getArticleBySlug(slug: string, lang: string = 'pt-BR'): Article | null {
  try {
    const articlesPath = lang === 'en-US' 
      ? path.join(articlesDir, 'en-US', `${slug}.md`)
      : path.join(articlesDir, `${slug}.md`);

    if (!fs.existsSync(articlesPath)) {
      return null;
    }

    const fileContents = fs.readFileSync(articlesPath, 'utf8');
    const { data, content } = matter(fileContents);

    const cleanContent = stripMarkdown(content);
    const excerpt = data.excerpt 
      ? stripMarkdown(data.excerpt)
      : cleanContent.substring(0, 200) + '...';

    const title = data.title || slug.replace(/-/g, ' ').replace(/_/g, ' ');
    const stats = readingTime(content);
    
    return {
      slug,
      title: capitalizeTitle(title),
      content,
      excerpt,
      date: data.date,
      category: data.category,
      tags: data.tags,
      lang,
      readingTime: stats.text,
    };
  } catch (error) {
    console.error(`Error reading article ${slug}:`, error);
    return null;
  }
}

export function getAllArticles(lang: string = 'pt-BR'): Article[] {
  try {
    const articlesPath = lang === 'en-US' 
      ? path.join(articlesDir, 'en-US')
      : articlesDir;

    if (!fs.existsSync(articlesPath)) {
      return [];
    }

    const files = fs.readdirSync(articlesPath).filter(file => file.endsWith('.md'));

    return files.map(file => {
      const slug = file.replace(/\.md$/, '');
      return getArticleBySlug(slug, lang);
    }).filter((article): article is Article => article !== null);
  } catch (error) {
    console.error('Error reading articles:', error);
    return [];
  }
}

export interface Note {
  slug: string;
  title: string;
  content: string;
  category: string;
  path: string;
}

export function getAllNotes(lang: string = 'pt-BR'): Note[] {
  const notes: Note[] = [];
  const langPath = path.join(notesDir, lang);

  if (!fs.existsSync(langPath)) {
    return notes;
  }

  function walkDir(dir: string, category: string = '') {
    const files = fs.readdirSync(dir);

    files.forEach(file => {
      const filePath = path.join(dir, file);
      const stat = fs.statSync(filePath);

      if (stat.isDirectory()) {
        walkDir(filePath, file);
      } else if (file.endsWith('.md')) {
        const content = fs.readFileSync(filePath, 'utf8');
        const { data } = matter(content);
        
        notes.push({
          slug: file.replace(/\.md$/, ''),
          title: data.title || file.replace(/\.md$/, '').replace(/-/g, ' '),
          content,
          category,
          path: filePath,
        });
      }
    });
  }

  walkDir(langPath);
  return notes;
}
