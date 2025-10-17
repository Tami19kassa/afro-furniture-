import { useState, useEffect } from 'react';
import { Menu, X } from 'lucide-react';

export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems = [
    { name: 'Home', id: '/' },
    { name: 'Products', id: '/products' },
    { name: 'Blog', id: '/blog' },
    { name: 'About', id: '/about' },
    { name: 'Contact', id: '/contact' },
    { name: 'Reviews', id: '/reviews' },
  ]; // Removed Admin

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled ? 'bg-white shadow-md' : 'bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          <a
            href="/"
            className="flex items-center space-x-3 group"
            aria-label="Go to Home"
          >
            <div className="relative flex items-baseline">
              {/* Amharic + English brand: አፍሮ Furniture */}
              <div className="text-3xl font-extrabold bg-gradient-to-r from-amber-600 via-orange-500 to-red-600 bg-clip-text text-transparent transform transition-transform group-hover:scale-110 duration-300 animate-brand-float">
                አፍሮ
              </div>
              <div className="ml-2 text-2xl font-light text-gray-700">Furniture</div>
              <span className="sr-only">አፍሮ Furniture</span>
            </div>
          </a>

          <nav className="hidden md:flex space-x-8">
            {navItems.map((item) => (
              <a
                key={item.id}
                href={item.id}
                className={`relative text-sm font-medium transition-colors duration-200 text-gray-800 hover:text-amber-600`}
              >
                {item.name}
              </a>
            ))}
          </nav>

          <button
            className="md:hidden text-gray-700"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {isMobileMenuOpen && (
        <div className="md:hidden bg-white border-t border-gray-200 shadow-lg">
          <nav className="px-4 py-4 space-y-3">
            {navItems.map((item) => (
              <a
                key={item.id}
                href={item.id}
                className={`block w-full text-left px-4 py-2 rounded-lg transition-colors text-gray-700 hover:bg-gray-50`}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                {item.name}
              </a>
            ))}
          </nav>
        </div>
      )}
    </header>
  );
}
