import { Facebook, Instagram, Twitter, Mail, Phone, MapPin } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function Footer() {
  const currentYear = new Date().getFullYear();
  const navigate = useNavigate();

  return (
    <footer className="bg-gray-900 text-gray-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-2xl font-bold bg-gradient-to-r from-amber-400 to-orange-500 bg-clip-text text-transparent mb-4">
              Afro-Furniture
            </h3>
            <p className="text-sm text-gray-400 mb-4">
              Bringing the warmth and elegance of African-inspired design to your home.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="hover:text-amber-500 transition-colors">
                <Facebook size={20} />
              </a>
              <a href="#" className="hover:text-amber-500 transition-colors">
                <Instagram size={20} />
              </a>
              <a href="#" className="hover:text-amber-500 transition-colors">
                <Twitter size={20} />
              </a>
            </div>
          </div>

          <div>
            <h4 className="text-white font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <button onClick={() => navigate('/')} className="hover:text-amber-500 transition-colors">
                  Home
                </button>
              </li>
              <li>
                <button onClick={() => navigate('/products')} className="hover:text-amber-500 transition-colors">
                  Products
                </button>
              </li>
              <li>
                <button onClick={() => navigate('/blog')} className="hover:text-amber-500 transition-colors">
                  Blog
                </button>
              </li>
              <li>
                <button onClick={() => navigate('/about')} className="hover:text-amber-500 transition-colors">
                  About Us
                </button>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-semibold mb-4">Customer Service</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <button onClick={() => navigate('/contact')} className="hover:text-amber-500 transition-colors">
                  Contact Us
                </button>
              </li>
              <li>
                <a href="#" className="hover:text-amber-500 transition-colors">
                  Shipping Info
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-amber-500 transition-colors">
                  Returns
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-amber-500 transition-colors">
                  FAQ
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-semibold mb-4">Contact Info</h4>
            <ul className="space-y-3 text-sm">
              <li className="flex items-start space-x-2">
                <MapPin size={18} className="flex-shrink-0 mt-0.5" />
                <span>123 Heritage Street, Addis Ababa, Ethiopia</span>
              </li>
              <li className="flex items-center space-x-2">
                <Phone size={18} />
                <span>+251 11 234 5678</span>
              </li>
              <li className="flex items-center space-x-2">
                <Mail size={18} />
                <span>info@afro-furniture.com</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-sm text-gray-500">
          <p>&copy; {currentYear} Afro-Furniture. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
