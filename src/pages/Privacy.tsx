import React from 'react';
import { motion } from 'framer-motion';

const Privacy: React.FC = () => {
  return React.createElement('div', { className: "min-h-screen bg-primary-light py-12 px-4" },
    React.createElement('div', { className: "max-w-4xl mx-auto" },
      React.createElement(motion.div, {
        initial: { opacity: 0, y: 20 },
        animate: { opacity: 1, y: 0 },
        transition: { duration: 0.6 },
        className: "bg-white rounded-2xl shadow-custom p-8"
      },
        React.createElement('h1', { className: "text-4xl font-bold text-primary-dark mb-8" }, 
          "Política de Privacidad"
        ),
        React.createElement('div', { className: "prose prose-lg max-w-none" },
          React.createElement('p', { className: "text-gray-600 mb-6" },
            `Última actualización: ${new Date().toLocaleDateString('es-ES')}`
          ),
          
          React.createElement('section', { className: "mb-8" },
            React.createElement('h2', { className: "text-2xl font-semibold text-primary-dark mb-4" },
              "1. Información que Recopilamos"
            ),
            React.createElement('p', { className: "text-gray-700 mb-4" },
              "En Mi Estrella recopilamos la siguiente información:"
            ),
            React.createElement('ul', { className: "list-disc list-inside text-gray-700 space-y-2" },
              React.createElement('li', null, "Información de contacto (nombre, email, teléfono)"),
              React.createElement('li', null, "Información de facturación y envío"),
              React.createElement('li', null, "Historial de pedidos y preferencias"),
              React.createElement('li', null, "Información técnica (cookies, dirección IP)")
            )
          ),

          React.createElement('section', { className: "mb-8" },
            React.createElement('h2', { className: "text-2xl font-semibold text-primary-dark mb-4" },
              "2. Cómo Utilizamos su Información"
            ),
            React.createElement('p', { className: "text-gray-700 mb-4" },
              "Utilizamos su información para:"
            ),
            React.createElement('ul', { className: "list-disc list-inside text-gray-700 space-y-2" },
              React.createElement('li', null, "Procesar y gestionar sus pedidos"),
              React.createElement('li', null, "Comunicarnos con usted sobre su pedido"),
              React.createElement('li', null, "Mejorar nuestros productos y servicios"),
              React.createElement('li', null, "Enviar información promocional (con su consentimiento)")
            )
          ),

          React.createElement('section', { className: "mb-8" },
            React.createElement('h2', { className: "text-2xl font-semibold text-primary-dark mb-4" },
              "3. Sus Derechos"
            ),
            React.createElement('p', { className: "text-gray-700 mb-4" },
              "Bajo el RGPD, usted tiene derecho a:"
            ),
            React.createElement('ul', { className: "list-disc list-inside text-gray-700 space-y-2" },
              React.createElement('li', null, "Acceder a sus datos personales"),
              React.createElement('li', null, "Rectificar datos incorrectos"),
              React.createElement('li', null, "Suprimir sus datos"),
              React.createElement('li', null, "Limitar el tratamiento de sus datos"),
              React.createElement('li', null, "Portabilidad de datos"),
              React.createElement('li', null, "Oponerse al tratamiento")
            )
          ),

          React.createElement('section', { className: "mb-8" },
            React.createElement('h2', { className: "text-2xl font-semibold text-primary-dark mb-4" },
              "4. Contacto"
            ),
            React.createElement('p', { className: "text-gray-700 mb-4" },
              "Para ejercer sus derechos o hacer consultas sobre privacidad:"
            ),
            React.createElement('div', { className: "bg-primary-light p-4 rounded-lg" },
              React.createElement('p', { className: "text-primary-dark font-semibold" }, "Responsable de Protección de Datos"),
              React.createElement('p', { className: "text-gray-700" }, "Email: privacy@miestrella.com"),
              React.createElement('p', { className: "text-gray-700" }, "Mi Estrella")
            )
          )
        )
      )
    )
  );
};

export default Privacy;