import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShoppingCart, User, Menu, X, LogOut, Settings } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';

const Navbar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const { items, getTotalItems } = useCart();
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const totalItems = getTotalItems();

  const handleLogout = () => {
    logout();
    setShowUserMenu(false);
    navigate('/');
  };

  return (
    <nav className="bg-primary-dark shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <img 
              src="/assets/logo.png" 
              alt="Mi Estrella Logo" 
              className="h-10 w-10"
              onError={(e) => {
                (e.target as HTMLImageElement).src = 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="40" height="40"><text y="30" font-size="30">⭐</text></svg>';
              }}
            />
            <span className="text-2xl font-bold text-white">Mi Estrella</span>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-8">
            <Link to="/" className="text-white hover:text-primary-gold transition-colors">
              Inicio
            </Link>
            <Link to="/store" className="text-white hover:text-primary-gold transition-colors">
              Tienda
            </Link>
            
            {/* Cart */}
            <Link to="/cart" className="relative text-white hover:text-primary-gold transition-colors">
              <ShoppingCart className="w-6 h-6" />
              {totalItems > 0 && (
                <span className="absolute -top-2 -right-2 bg-primary-rose text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {totalItems}
                </span>
              )}
            </Link>

            {/* User Menu */}
            {user ? (
              <div className="relative">
                <button
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  className="flex items-center space-x-2 text-white hover:text-primary-gold transition-colors"
                >
                  <User className="w-6 h-6" />
                  <span className="hidden lg:block">{user.firstName}</span>
                </button>

                <AnimatePresence>
                  {showUserMenu && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-xl py-2 z-50"
                    >
                      <Link
                        to="/profile"
                        onClick={() => setShowUserMenu(false)}
                        className="block px-4 py-2 text-primary-dark hover:bg-primary-light transition-colors"
                      >
                        <User className="w-4 h-4 inline-block mr-2" />
                        Mi Perfil
                      </Link>
                      
                      {(user.role === 'admin' || user.role === 'employee') && (
                        <Link
                          to="/admin"
                          onClick={() => setShowUserMenu(false)}
                          className="block px-4 py-2 text-primary-dark hover:bg-primary-light transition-colors"
                        >
                          <Settings className="w-4 h-4 inline-block mr-2" />
                          Panel Admin
                        </Link>
                      )}

                      <hr className="my-2" />
                      
                      <button
                        onClick={handleLogout}
                        className="w-full text-left px-4 py-2 text-red-600 hover:bg-red-50 transition-colors"
                      >
                        <LogOut className="w-4 h-4 inline-block mr-2" />
                        Cerrar Sesión
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <Link
                to="/login"
                className="bg-primary-gold text-white px-4 py-2 rounded-lg hover:bg-primary-brown transition-colors"
              >
                Ingresar
              </Link>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden text-white"
          >
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-primary-brown"
          >
            <div className="px-4 py-4 space-y-4">
              <Link
                to="/"
                onClick={() => setIsOpen(false)}
                className="block text-white hover:text-primary-gold transition-colors"
              >
                Inicio
              </Link>
              <Link
                to="/store"
                onClick={() => setIsOpen(false)}
                className="block text-white hover:text-primary-gold transition-colors"
              >
                Tienda
              </Link>
              <Link
                to="/cart"
                onClick={() => setIsOpen(false)}
                className="flex items-center space-x-2 text-white hover:text-primary-gold transition-colors"
              >
                <ShoppingCart className="w-5 h-5" />
                <span>Carrito ({totalItems})</span>
              </Link>

              {user ? (
                <>
                  <Link
                    to="/profile"
                    onClick={() => setIsOpen(false)}
                    className="block text-white hover:text-primary-gold transition-colors"
                  >
                    <User className="w-5 h-5 inline-block mr-2" />
                    Mi Perfil
                  </Link>
                  
                  {(user.role === 'admin' || user.role === 'employee') && (
                    <Link
                      to="/admin"
                      onClick={() => setIsOpen(false)}
                      className="block text-white hover:text-primary-gold transition-colors"
                    >
                      <Settings className="w-5 h-5 inline-block mr-2" />
                      Panel Admin
                    </Link>
                  )}

                  <button
                    onClick={() => {
                      handleLogout();
                      setIsOpen(false);
                    }}
                    className="w-full text-left text-red-400 hover:text-red-300 transition-colors"
                  >
                    <LogOut className="w-5 h-5 inline-block mr-2" />
                    Cerrar Sesión
                  </button>
                </>
              ) : (
                <Link
                  to="/login"
                  onClick={() => setIsOpen(false)}
                  className="block bg-primary-gold text-white px-4 py-2 rounded-lg text-center hover:bg-primary-brown transition-colors"
                >
                  Ingresar
                </Link>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;