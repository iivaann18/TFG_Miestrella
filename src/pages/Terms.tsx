import React from 'react';
import { motion } from 'framer-motion';

const Terms: React.FC = () => {
  return (
    <div className="min-h-screen bg-primary-light py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="bg-white rounded-2xl shadow-custom p-8"
        >
          <h1 className="text-4xl font-bold text-primary-dark mb-8">
            Términos y Condiciones
          </h1>
          
          <div className="prose prose-lg max-w-none">
            <p className="text-gray-600 mb-6">
              Última actualización: {new Date().toLocaleDateString('es-ES')}
            </p>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-primary-dark mb-4">
                1. Información General
              </h2>
              <p className="text-gray-700 mb-4">
                Estos términos y condiciones regulan el uso de este sitio web y la compra de productos en Mi Estrella. 
                Al acceder y utilizar este sitio web, usted acepta estos términos y condiciones en su totalidad.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-primary-dark mb-4">
                2. Productos y Servicios
              </h2>
              <p className="text-gray-700 mb-4">
                Mi Estrella ofrece figuras de porcelana artesanales únicas. Todos los productos están sujetos a disponibilidad.
              </p>
              <ul className="list-disc list-inside text-gray-700 space-y-2">
                <li>Todos los productos son figuras de porcelana hechas a mano</li>
                <li>Los precios están expresados en euros (€) e incluyen IVA</li>
                <li>Las imágenes son representativas del producto</li>
                <li>Nos reservamos el derecho de modificar precios sin previo aviso</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-primary-dark mb-4">
                3. Proceso de Compra
              </h2>
              <p className="text-gray-700 mb-4">
                El proceso de compra se realiza a través de nuestro sistema de checkout seguro:
              </p>
              <ul className="list-disc list-inside text-gray-700 space-y-2">
                <li>Seleccione los productos deseados y añádalos al carrito</li>
                <li>Proceda al checkout e ingrese sus datos de facturación y envío</li>
                <li>Complete el pago a través de nuestro sistema seguro</li>
                <li>Recibirá una confirmación de pedido por email</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-primary-dark mb-4">
                4. Métodos de Pago
              </h2>
              <p className="text-gray-700 mb-4">
                Aceptamos los siguientes métodos de pago seguros:
              </p>
              <ul className="list-disc list-inside text-gray-700 space-y-2">
                <li>Tarjetas de crédito (Visa, Mastercard, American Express)</li>
                <li>Tarjetas de débito</li>
                <li>Otros métodos disponibles a través de Stripe</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-primary-dark mb-4">
                5. Envíos y Entregas
              </h2>
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-semibold text-primary-brown mb-2">Costos de Envío</h3>
                  <ul className="list-disc list-inside text-gray-700 space-y-1">
                    <li>Envío gratuito para pedidos superiores a €50</li>
                    <li>Costo de envío: €5.99 para pedidos inferiores a €50</li>
                    <li>Entrega en península española: 3-5 días laborables</li>
                  </ul>
                </div>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-primary-dark mb-4">
                6. Política de Devoluciones
              </h2>
              <p className="text-gray-700 mb-4">
                Ofrecemos una garantía de satisfacción de 30 días:
              </p>
              <ul className="list-disc list-inside text-gray-700 space-y-2">
                <li>Puede devolver productos en su estado original dentro de 30 días</li>
                <li>Los gastos de envío de devolución corren por cuenta del cliente</li>
                <li>Los productos dañados durante el envío serán reemplazados sin costo</li>
                <li>Para iniciar una devolución, contacte nuestro servicio al cliente</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-primary-dark mb-4">
                7. Privacidad y Protección de Datos
              </h2>
              <p className="text-gray-700 mb-4">
                Su privacidad es importante para nosotros. Consulte nuestra Política de Privacidad para obtener 
                información detallada sobre cómo recopilamos, utilizamos y protegemos sus datos personales.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-primary-dark mb-4">
                8. Limitación de Responsabilidad
              </h2>
              <p className="text-gray-700 mb-4">
                Mi Estrella no será responsable de daños indirectos, incidentales o consecuentes que puedan 
                surgir del uso de nuestros productos o servicios.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-primary-dark mb-4">
                9. Modificaciones de los Términos
              </h2>
              <p className="text-gray-700 mb-4">
                Nos reservamos el derecho de modificar estos términos y condiciones en cualquier momento. 
                Los cambios entrarán en vigor inmediatamente después de su publicación en el sitio web.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-primary-dark mb-4">
                10. Contacto
              </h2>
              <p className="text-gray-700 mb-4">
                Si tiene preguntas sobre estos términos y condiciones, puede contactarnos:
              </p>
              <div className="bg-primary-light p-4 rounded-lg">
                <p className="text-primary-dark font-semibold">Mi Estrella</p>
                <p className="text-gray-700">Email: info@miestrella.com</p>
                <p className="text-gray-700">Teléfono: +34 XXX XXX XXX</p>
                <p className="text-gray-700">Dirección: Calle Principal, 123, 12345 Ciudad, España</p>
              </div>
            </section>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Terms;