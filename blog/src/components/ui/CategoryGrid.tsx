import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';

interface Category {
  name: string;
  slug: string;
  icon: string;
}

const categories: Category[] = [
  { name: 'Algoritmos', slug: 'algoritmos', icon: '🔄' },
  { name: 'APIs', slug: 'apis', icon: '🔌' },
  { name: 'AWS', slug: 'AWS', icon: '☁️' },
  { name: 'Bancos de Dados', slug: 'banco', icon: '💾' },
  { name: 'Containerização', slug: 'containerizacao', icon: '🐳' },
  { name: 'Dados', slug: 'dados', icon: '📊' },
  { name: 'Deep Learning', slug: 'deep-learning', icon: '🧠' },
  { name: 'DevOps', slug: 'devops', icon: '🚀' },
  { name: 'Eng. de Software', slug: 'engenharia-de-software', icon: '⚙️' },
  { name: 'Git', slug: 'git', icon: '📝' },
  { name: 'Go', slug: 'go', icon: '🐹' },
  { name: 'Grafana', slug: 'Grafana', icon: '📈' },
  { name: 'Java', slug: 'java', icon: '☕' },
  { name: 'Machine Learning', slug: 'machine-learning', icon: '🤖' },
  { name: 'Node-RED', slug: 'node-red', icon: '🔴' },
  { name: 'ORM', slug: 'orm', icon: '🗃️' },
  { name: 'Power BI', slug: 'Power BI', icon: '📊' },
  { name: 'Python', slug: 'python', icon: '🐍' },
  { name: 'Redes', slug: 'redes', icon: '🌐' },
  { name: 'Sistemas', slug: 'sistemas', icon: '💻' },
  { name: 'SQL', slug: 'SQL', icon: '🗄️' },
  { name: 'Testes', slug: 'Testes', icon: '🧪' },
];

export default function CategoryGrid() {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
      {categories.map((category, index) => (
        <motion.a
          key={category.slug}
          href={`/notes/${category.slug}`}
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: index * 0.1 }}
          onHoverStart={() => setHoveredIndex(index)}
          onHoverEnd={() => setHoveredIndex(null)}
          className="relative group"
        >
          <motion.div
            className="relative overflow-hidden bg-black border border-gray-800 p-6 h-32 flex flex-col items-center justify-center"
            whileHover={{ scale: 1.02, borderColor: '#4b5563' }}
          >
            <motion.div
              className="text-4xl mb-2"
              animate={{
                scale: hoveredIndex === index ? 1.2 : 1,
              }}
              transition={{ duration: 0.3 }}
            >
              {category.icon}
            </motion.div>
            <h3 className="text-white font-semibold text-center">
              {category.name}
            </h3>
            
            {/* Subtle border effect on hover */}
            <AnimatePresence>
              {hoveredIndex === index && (
                <motion.div
                  className="absolute inset-0 bg-gray-900/50"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                />
              )}
            </AnimatePresence>
          </motion.div>
        </motion.a>
      ))}
    </div>
  );
}

