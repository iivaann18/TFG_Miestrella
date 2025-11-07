import React from 'react';
import { Link } from 'react-router-dom';
import { Mail, Phone, MapPin, Facebook, Instagram, Twitter } from 'lucide-react';
import { motion } from 'framer-motion';

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-primary-dark text-white mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Columna 1: Acerca de */}
          <div>
            <h3 className="text-xl font-bold mb-4 text-primary-gold">Mi Estrella</h3>
            <p className="text-gray-300 text-sm leading-relaxed">
              Figuras de porcelana artesanales hechas con dedicación y amor. 
              Cada pieza es única y cuenta su propia historia.
            </p>
          </div>

          {/* Columna 2: Enlaces rápidos */}
          <div>
            <h3 className="text-xl font-bold mb-4 text-primary-gold">Enlaces</h3>
            <ul className="space-y-2">
              <li>
                <Link 
                  to="/" 
                  className="text-gray-300 hover:text-primary-gold transition-colors text-sm"
                >
                  Inicio
                </Link>
              </li>
              <li>
                <Link 
                  to="/store" 
                  className="text-gray-300 hover:text-primary-gold transition-colors text-sm"
                >
                  Tienda
                </Link>
              </li>
              <li>
                <Link 
                  to="/cart" 
                  className="text-gray-300 hover:text-primary-gold transition-colors text-sm"
                >
                  Carrito
                </Link>
              </li>
            </ul>
          </div>

          {/* Columna 3: Contacto */}
          <div>
            <h3 className="text-xl font-bold mb-4 text-primary-gold">Contacto</h3>
            <ul className="space-y-3">
              <li className="flex items-center space-x-2 text-sm text-gray-300">
                <Mail className="w-4 h-4 text-primary-rose" />
                <span>info@miestrella.com</span>
              </li>
              <li className="flex items-center space-x-2 text-sm text-gray-300">
                <Phone className="w-4 h-4 text-primary-rose" />
                <span>+34 123 456 789</span>
              </li>
              <li className="flex items-center space-x-2 text-sm text-gray-300">
                <MapPin className="w-4 h-4 text-primary-rose" />
                <span>Madrid, España</span>
              </li>
            </ul>
          </div>

          {/* Columna 4: Redes sociales */}
          <div>
            <h3 className="text-xl font-bold mb-4 text-primary-gold">Síguenos</h3>
            <div className="flex space-x-4">
              <motion.a
                whileHover={{ scale: 1.2, rotate: 5 }}
                href="#"
                className="bg-primary-brown p-2 rounded-full hover:bg-primary-gold transition-colors"
              >
                <Facebook className="w-5 h-5" />
              </motion.a>
              <motion.a
                whileHover={{ scale: 1.2, rotate: 5 }}
                href="#"
                className="bg-primary-brown p-2 rounded-full hover:bg-primary-gold transition-colors"
              >
                <Instagram className="w-5 h-5" />
              </motion.a>
              <motion.a
                whileHover={{ scale: 1.2, rotate: 5 }}
                href="#"
                className="bg-primary-brown p-2 rounded-full hover:bg-primary-gold transition-colors"
              >
                <Twitter className="w-5 h-5" />
              </motion.a>
            </div>
          </div>
        </div>

        {/* Línea divisoria */}
        <div className="border-t border-primary-brown mt-8 pt-6">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-sm text-gray-400">
              © {currentYear} Mi Estrella. Todos los derechos reservados.
            </p>
            <div className="flex space-x-6 mt-4 md:mt-0">
              <Link 
                to="/privacy" 
                className="text-sm text-gray-400 hover:text-primary-gold transition-colors"
              >
                Política de Privacidad
              </Link>
              <Link 
                to="/terms" 
                className="text-sm text-gray-400 hover:text-primary-gold transition-colors"
              >
                Términos y Condiciones
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;