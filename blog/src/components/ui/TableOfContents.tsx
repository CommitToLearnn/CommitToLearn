import { useState, useEffect } from 'react';

interface Heading {
  id: string;
  text: string;
  level: number;
}

export default function TableOfContents() {
  const [headings, setHeadings] = useState<Heading[]>([]);
  const [activeId, setActiveId] = useState<string>('');

  useEffect(() => {
    const articleContent = document.querySelector('.markdown-content');
    if (!articleContent) return;

    const elements = articleContent.querySelectorAll('h2, h3');
    const headingsList: Heading[] = [];

    elements.forEach((element, index) => {
      const id = element.id || `heading-${index}`;
      if (!element.id) {
        element.id = id;
      }

      headingsList.push({
        id,
        text: element.textContent || '',
        level: parseInt(element.tagName[1]),
      });
    });

    setHeadings(headingsList);

    // Intersection Observer para destacar seção ativa
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id);
          }
        });
      },
      { rootMargin: '-100px 0px -66%' }
    );

    elements.forEach((element) => observer.observe(element));

    return () => observer.disconnect();
  }, []);

  if (headings.length < 3) return null;

  return (
    <nav className="sticky top-24 hidden xl:block w-64 shrink-0">
      <div className="border border-gray-800 bg-black p-6">
        <h3 className="text-sm font-bold uppercase tracking-wider mb-4 text-white">
          Neste Artigo
        </h3>
        <ul className="space-y-2 text-sm">
          {headings.map((heading) => (
            <li
              key={heading.id}
              className={heading.level === 3 ? 'ml-4' : ''}
            >
              <a
                href={`#${heading.id}`}
                className={`block py-1 transition-colors ${
                  activeId === heading.id
                    ? 'text-white font-medium'
                    : 'text-gray-500 hover:text-gray-300'
                }`}
              >
                {heading.text}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  );
}
