import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, Sparkles, Star, Heart } from 'lucide-react';
import Button from '../components/Button';
import NewsletterForm from '../components/NewsletterForm';

const Home: React.FC = () => {
  const features = [
    {
      icon: <Sparkles className="w-8 h-8" />,
      title: 'Artesanía Única',
      description: 'Cada pieza es hecha a mano con dedicación y cuidado especial',
    },
    {
      icon: <Star className="w-8 h-8" />,
      title: 'Calidad Premium',
      description: 'Utilizamos porcelana de la más alta calidad para garantizar durabilidad',
    },
    {
      icon: <Heart className="w-8 h-8" />,
      title: 'Diseños Exclusivos',
      description: 'Colecciones limitadas y diseños que no encontrarás en otro lugar',
    },
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-primary-light via-primary-pink to-primary-teal py-20 px-4 overflow-hidden">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="max-w-7xl mx-auto text-center"
        >
          <motion.h1
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2, duration: 0.8 }}
            className="text-5xl md:text-7xl font-bold text-primary-dark mb-6"
          >
            Arte en Porcelana
          </motion.h1>
          
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.8 }}
            className="text-xl md:text-2xl text-primary-brown mb-8 max-w-3xl mx-auto"
          >
            Descubre nuestra colección exclusiva de figuras artesanales. 
            Cada pieza cuenta una historia única.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.8 }}
          >
            <Link to="/store">
              <Button variant="primary" size="lg">
                Explorar Colección
                <ArrowRight className="w-5 h-5 ml-2 inline-block" />
              </Button>
            </Link>
          </motion.div>
        </motion.div>

        {/* Decorative Elements */}
        <motion.div
          animate={{
            y: [0, -20, 0],
            rotate: [0, 5, 0],
          }}
          transition={{
            duration: 5,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
          className="absolute top-10 left-10 w-20 h-20 bg-primary-gold opacity-20 rounded-full blur-xl"
        />
        <motion.div
          animate={{
            y: [0, 20, 0],
            rotate: [0, -5, 0],
          }}
          transition={{
            duration: 7,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
          className="absolute bottom-10 right-10 w-32 h-32 bg-primary-rose opacity-20 rounded-full blur-xl"
        />
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl font-bold text-center text-primary-dark mb-12"
          >
            ¿Por qué elegirnos?
          </motion.h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.2 }}
                whileHover={{ y: -10 }}
                className="bg-primary-light p-8 rounded-xl shadow-custom text-center"
              >
                <div className="inline-flex items-center justify-center w-16 h-16 bg-primary-brown text-white rounded-full mb-6">
                  {feature.icon}
                </div>
                <h3 className="text-2xl font-semibold text-primary-dark mb-4">
                  {feature.title}
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter Section */}
      <NewsletterForm />

      {/* CTA Section */}
      <section className="py-20 px-4 bg-gradient-to-r from-primary-brown via-primary-gold to-primary-rose">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="max-w-4xl mx-auto text-center"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Encuentra tu Pieza Perfecta
          </h2>
          <p className="text-xl text-white opacity-90 mb-8">
            Explora nuestra colección completa y descubre la figura de porcelana 
            que complementará tu hogar.
          </p>
          <Link to="/store">
            <Button variant="outline" size="lg" className="bg-white text-primary-brown border-white hover:bg-primary-light">
              Ver Tienda Completa
              <ArrowRight className="w-5 h-5 ml-2 inline-block" />
            </Button>
          </Link>
        </motion.div>
      </section>
    </div>
  );
};

export default Home;