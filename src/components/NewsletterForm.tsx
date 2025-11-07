import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, CheckCircle } from 'lucide-react';
import Button from './Button';
import { newsletterAPI } from '../services/api';

const NewsletterForm: React.FC = () => {
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await newsletterAPI.subscribe({ email, name });
      setSuccess(true);
      setEmail('');
      setName('');
      setTimeout(() => setSuccess(false), 5000);
    } catch (err: any) {
      setError(err.response?.data?.error || 'Error al suscribirse');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-gradient-to-r from-primary-brown to-primary-gold py-16 px-4">
      <div className="max-w-4xl mx-auto text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <Mail className="w-16 h-16 text-white mx-auto mb-6" />
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Suscríbete a Nuestro Newsletter
          </h2>
          <p className="text-white text-lg mb-8 opacity-90">
            Recibe ofertas exclusivas, novedades y consejos sobre porcelana
          </p>

          {success ? (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="bg-white rounded-lg p-6 inline-flex items-center space-x-3"
            >
              <CheckCircle className="w-8 h-8 text-green-600" />
              <span className="text-primary-dark font-semibold">
                ¡Suscripción exitosa! Revisa tu correo.
              </span>
            </motion.div>
          ) : (
            <form onSubmit={handleSubmit} className="max-w-2xl mx-auto">
              <div className="flex flex-col md:flex-row gap-4">
                <input
                  type="text"
                  placeholder="Tu nombre (opcional)"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="flex-1 px-6 py-4 rounded-lg text-primary-dark focus:outline-none focus:ring-2 focus:ring-white"
                />
                <input
                  type="email"
                  placeholder="Tu correo electrónico"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="flex-1 px-6 py-4 rounded-lg text-primary-dark focus:outline-none focus:ring-2 focus:ring-white"
                />
                <Button
                  type="submit"
                  disabled={loading}
                  className="bg-white text-primary-brown hover:bg-primary-light"
                  size="lg"
                >
                  {loading ? 'Enviando...' : 'Suscribirse'}
                </Button>
              </div>
              {error && (
                <p className="text-white mt-4 bg-red-500 bg-opacity-50 px-4 py-2 rounded">
                  {error}
                </p>
              )}
            </form>
          )}

          <p className="text-white text-sm mt-6 opacity-75">
            Nunca compartiremos tu información. Puedes cancelar en cualquier momento.
          </p>
        </motion.div>
      </div>
    </div>
  );
};

export default NewsletterForm;