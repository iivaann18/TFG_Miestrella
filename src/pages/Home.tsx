import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, Sparkles, Star, Heart } from 'lucide-react';
import Button from '../components/Button';
import NewsletterForm from '../components/NewsletterForm';
import HeroCarousel from '../components/HeroCarousel';
import CreationsGallery from '../components/CreationsGallery';

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

  // Lista de imágenes hardcodeada - las imágenes están en public/uploads/products
  const images = [
    '/uploads/products/Figuraabogada.jpeg',
    '/uploads/products/Figuraboda.jpeg',
    '/uploads/products/Figuraboda2.jpeg',
    '/uploads/products/Figuraboda3.jpeg',
    '/uploads/products/Figuraboda4.jpeg',
    '/uploads/products/Figuraboda5.jpeg',
    '/uploads/products/Figurabola.jpeg',
    '/uploads/products/Figuracaravan.jpeg',
    '/uploads/products/Figuracomunion.jpeg',
    '/uploads/products/Figuradiego.jpeg',
    '/uploads/products/Figuraharry.jpeg',
    '/uploads/products/Figuralucas.jpeg',
    '/uploads/products/Figuranaina.jpeg',
    '/uploads/products/Figuranena.jpeg',
    '/uploads/products/Figuranina.jpeg',
    '/uploads/products/Figuranona.jpeg',
    '/uploads/products/Figuraratica.jpeg',
    '/uploads/products/Figurarobotica.jpeg',
    '/uploads/products/Figuraskater.jpeg',
  ];

  return (
    <div className="min-h-screen">
      {/* Redesigned Hero: two-column block (carousel left, panel right) */}
      <section className="py-12 px-4 bg-[var(--bg-surface,#fff5f2)]">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
          <div className="md:col-span-7">
            {/* Use uploaded product images if present */}
            {/** Images live in public/uploads/products and are served statically */}
            <HeroCarousel images={images.slice(0, 4)} />
          </div>

          <div className="md:col-span-5">
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="bg-white p-8 rounded-xl shadow-lg"
            >
              <h1 className="text-4xl md:text-5xl font-serif text-primary-dark mb-4">Figuras de Porcelana Hechas a Mano</h1>
              <p className="text-gray-600 mb-6 leading-relaxed">Piezas únicas, modeladas y esmaltadas con delicadeza. Cada figura está pensada para transmitir calidez y elegancia artesanal.</p>

              <div className="flex gap-3 mb-4">
                <Link to="/store">
                  <Button variant="primary">Comprar ahora</Button>
                </Link>
                <Link to="/about">
                  <Button variant="outline">Conocer la técnica</Button>
                </Link>
              </div>

              <p className="text-sm text-gray-500">Envíos a toda la península · Personalización por encargo</p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Gallery: Nuestras creaciones (debajo del hero) - Excluye las primeras 4 que están en el carrusel */}
      <CreationsGallery images={images.slice(4)} />


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