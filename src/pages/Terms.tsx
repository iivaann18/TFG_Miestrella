import React from 'react';
import { motion } from 'framer-motion';

const Terms: React.FC = () => {
  return React.createElement('div', { className: "min-h-screen bg-primary-light py-12 px-4" },
    React.createElement('div', { className: "max-w-4xl mx-auto" },
      React.createElement(motion.div, {
        initial: { opacity: 0, y: 20 },
        animate: { opacity: 1, y: 0 },
        transition: { duration: 0.6 },
        className: "bg-white rounded-2xl shadow-custom p-8"
      },
        React.createElement('h1', { className: "text-4xl font-bold text-primary-dark mb-8" }, 
          "Términos y Condiciones"
        ),
        React.createElement('div', { className: "prose prose-lg max-w-none" },
          React.createElement('p', { className: "text-gray-600 mb-6" },
            `Última actualización: ${new Date().toLocaleDateString('es-ES')}`
          ),
          
          React.createElement('section', { className: "mb-8" },
            React.createElement('h2', { className: "text-2xl font-semibold text-primary-dark mb-4" },
              "1. Información General"
            ),
            React.createElement('p', { className: "text-gray-700 mb-4" },
              "Estos términos y condiciones regulan el uso de este sitio web y la compra de productos en Mi Estrella. Al acceder y utilizar este sitio web, usted acepta estos términos y condiciones en su totalidad."
            )
          ),

          React.createElement('section', { className: "mb-8" },
            React.createElement('h2', { className: "text-2xl font-semibold text-primary-dark mb-4" },
              "2. Productos y Servicios"
            ),
            React.createElement('p', { className: "text-gray-700 mb-4" },
              "Mi Estrella ofrece figuras de porcelana artesanales únicas. Todos los productos están sujetos a disponibilidad."
            ),
            React.createElement('ul', { className: "list-disc list-inside text-gray-700 space-y-2" },
              React.createElement('li', null, "Todos los productos son figuras de porcelana hechas a mano"),
              React.createElement('li', null, "Los precios están expresados en euros (€) e incluyen IVA"),
              React.createElement('li', null, "Las imágenes son representativas del producto"),
              React.createElement('li', null, "Nos reservamos el derecho de modificar precios sin previo aviso")
            )
          ),

          React.createElement('section', { className: "mb-8" },
            React.createElement('h2', { className: "text-2xl font-semibold text-primary-dark mb-4" },
              "3. Proceso de Compra"
            ),
            React.createElement('p', { className: "text-gray-700 mb-4" },
              "El proceso de compra se realiza a través de nuestro sistema de checkout seguro:"
            ),
            React.createElement('ul', { className: "list-disc list-inside text-gray-700 space-y-2" },
              React.createElement('li', null, "Seleccione los productos deseados y añádalos al carrito"),
              React.createElement('li', null, "Proceda al checkout e ingrese sus datos de facturación y envío"),
              React.createElement('li', null, "Complete el pago a través de nuestro sistema seguro"),
              React.createElement('li', null, "Recibirá una confirmación de pedido por email")
            )
          ),

          React.createElement('section', { className: "mb-8" },
            React.createElement('h2', { className: "text-2xl font-semibold text-primary-dark mb-4" },
              "4. Métodos de Pago"
            ),
            React.createElement('p', { className: "text-gray-700 mb-4" },
              "Aceptamos los siguientes métodos de pago seguros:"
            ),
            React.createElement('ul', { className: "list-disc list-inside text-gray-700 space-y-2" },
              React.createElement('li', null, "Tarjetas de crédito (Visa, Mastercard, American Express)"),
              React.createElement('li', null, "Tarjetas de débito"),
              React.createElement('li', null, "Otros métodos disponibles a través de Stripe")
            )
          ),

          React.createElement('section', { className: "mb-8" },
            React.createElement('h2', { className: "text-2xl font-semibold text-primary-dark mb-4" },
              "5. Envíos y Entregas"
            ),
            React.createElement('div', { className: "space-y-4" },
              React.createElement('div', null,
                React.createElement('h3', { className: "text-lg font-semibold text-primary-brown mb-2" }, 
                  "Costos de Envío"
                ),
                React.createElement('ul', { className: "list-disc list-inside text-gray-700 space-y-1" },
                  React.createElement('li', null, "Envío gratuito para pedidos superiores a €50"),
                  React.createElement('li', null, "Costo de envío: €5.99 para pedidos inferiores a €50"),
                  React.createElement('li', null, "Entrega en península española: 3-5 días laborables")
                )
              )
            )
          ),

          React.createElement('section', { className: "mb-8" },
            React.createElement('h2', { className: "text-2xl font-semibold text-primary-dark mb-4" },
              "6. Política de Devoluciones"
            ),
            React.createElement('p', { className: "text-gray-700 mb-4" },
              "Ofrecemos una garantía de satisfacción de 30 días:"
            ),
            React.createElement('ul', { className: "list-disc list-inside text-gray-700 space-y-2" },
              React.createElement('li', null, "Puede devolver productos en su estado original dentro de 30 días"),
              React.createElement('li', null, "Los gastos de envío de devolución corren por cuenta del cliente"),
              React.createElement('li', null, "Los productos dañados durante el envío serán reemplazados sin costo"),
              React.createElement('li', null, "Para iniciar una devolución, contacte nuestro servicio al cliente")
            )
          ),

          React.createElement('section', { className: "mb-8" },
            React.createElement('h2', { className: "text-2xl font-semibold text-primary-dark mb-4" },
              "7. Contacto"
            ),
            React.createElement('p', { className: "text-gray-700 mb-4" },
              "Si tiene preguntas sobre estos términos y condiciones, puede contactarnos:"
            ),
            React.createElement('div', { className: "bg-primary-light p-4 rounded-lg" },
              React.createElement('p', { className: "text-primary-dark font-semibold" }, "Mi Estrella"),
              React.createElement('p', { className: "text-gray-700" }, "Email: info@miestrella.com"),
              React.createElement('p', { className: "text-gray-700" }, "Teléfono: +34 XXX XXX XXX"),
              React.createElement('p', { className: "text-gray-700" }, "Dirección: Calle Principal, 123, 12345 Ciudad, España")
            )
          )
        )
      )
    )
  );
};

export default Terms;