import { motion } from 'framer-motion';

interface NavbarProps {
  currentLang?: string;
}

export default function Navbar({ currentLang = 'pt-BR' }: NavbarProps) {
  const toggleLang = () => {
    const currentPath = window.location.pathname;
    
    if (currentLang === 'pt-BR') {
      // Mudando de PT para EN
      if (currentPath === '/' || currentPath === '/index.html') {
        window.location.href = '/en';
      } else if (currentPath.startsWith('/articles')) {
        window.location.href = '/en/articles';
      } else if (currentPath.startsWith('/notes')) {
        window.location.href = '/en';
      } else {
        window.location.href = '/en';
      }
    } else {
      // Mudando de EN para PT
      window.location.href = '/';
    }
  };

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className="fixed top-0 left-0 right-0 z-50 bg-black/95 backdrop-blur-sm border-b border-gray-800"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <motion.a
            href={currentLang === 'pt-BR' ? '/' : '/en'}
            className="text-xl font-bold text-white hover:text-gray-300 transition-colors"
            whileHover={{ scale: 1.02 }}
          >
            CommitToLearn
          </motion.a>

          <div className="flex items-center gap-8">
            <a
              href={currentLang === 'pt-BR' ? '/articles' : '/en/articles'}
              className="text-gray-400 hover:text-white transition-colors text-sm font-medium"
            >
              {currentLang === 'pt-BR' ? 'Artigos' : 'Articles'}
            </a>
            <a
              href={currentLang === 'pt-BR' ? '/notes' : '/en'}
              className="text-gray-400 hover:text-white transition-colors text-sm font-medium"
            >
              {currentLang === 'pt-BR' ? 'Notas' : 'Notes'}
            </a>
            
            <button
              onClick={toggleLang}
              className="px-4 py-1.5 text-sm border border-gray-700 text-gray-300 hover:bg-gray-900 transition-colors"
            >
              {currentLang === 'pt-BR' ? 'EN' : 'PT'}
            </button>
          </div>
        </div>
      </div>
    </motion.nav>
  );
}
