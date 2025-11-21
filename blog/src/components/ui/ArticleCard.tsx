import { motion } from 'framer-motion';

interface ArticleCardProps {
  title: string;
  excerpt: string;
  category?: string;
  href: string;
}

export default function ArticleCard({ title, excerpt, category, href }: ArticleCardProps) {
  return (
    <motion.a
      href={href}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ borderColor: '#525252' }}
      transition={{ duration: 0.2 }}
      className="block h-full border border-gray-800 hover:border-gray-600 transition-colors p-6 bg-black"
    >
      {category && (
        <span className="inline-block px-3 py-1 text-xs font-medium text-gray-400 border border-gray-800 mb-3">
          {category}
        </span>
      )}
      
      <h3 className="text-xl font-bold mb-3 text-white hover:text-gray-300 transition-colors line-clamp-2 min-h-[3.5rem]">
        {title}
      </h3>
      
      <p className="text-gray-400 text-sm line-clamp-3 mb-4 min-h-[4.5rem]">
        {excerpt}
      </p>
      
      <div className="flex items-center text-gray-500 text-sm">
        <span>Ler mais →</span>
      </div>
    </motion.a>
  );
}
