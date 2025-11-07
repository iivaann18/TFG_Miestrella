import React from 'react';
import { motion } from 'framer-motion';

const Privacy: React.FC = () => {
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
            Política de Privacidad
          </h1>
          
          <div className="prose prose-lg max-w-none">
            <p className="text-gray-600 mb-6">
              Última actualización: {new Date().toLocaleDateString('es-ES')}
            </p>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-primary-dark mb-4">
                1. Información que Recopilamos
              </h2>
              <p className="text-gray-700 mb-4">
                En Mi Estrella recopilamos la siguiente información:
              </p>
              <ul className="list-disc list-inside text-gray-700 space-y-2">
                <li>Información de contacto (nombre, email, teléfono)</li>
                <li>Información de facturación y envío</li>
                <li>Historial de pedidos y preferencias</li>
                <li>Información técnica (cookies, dirección IP)</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-primary-dark mb-4">
                2. Cómo Utilizamos su Información
              </h2>
              <p className="text-gray-700 mb-4">
                Utilizamos su información para:
              </p>
              <ul className="list-disc list-inside text-gray-700 space-y-2">
                <li>Procesar y gestionar sus pedidos</li>
                <li>Comunicarnos con usted sobre su pedido</li>
                <li>Mejorar nuestros productos y servicios</li>
                <li>Enviar información promocional (con su consentimiento)</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-primary-dark mb-4">
                3. Protección de Datos
              </h2>
              <p className="text-gray-700 mb-4">
                Implementamos medidas de seguridad técnicas y organizativas adecuadas para proteger 
                sus datos personales contra el acceso no autorizado, la alteración, divulgación o destrucción.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-primary-dark mb-4">
                4. Sus Derechos
              </h2>
              <p className="text-gray-700 mb-4">
                Bajo el RGPD, usted tiene derecho a:
              </p>
              <ul className="list-disc list-inside text-gray-700 space-y-2">
                <li>Acceder a sus datos personales</li>
                <li>Rectificar datos incorrectos</li>
                <li>Suprimir sus datos</li>
                <li>Limitar el tratamiento de sus datos</li>
                <li>Portabilidad de datos</li>
                <li>Oponerse al tratamiento</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-primary-dark mb-4">
                5. Cookies
              </h2>
              <p className="text-gray-700 mb-4">
                Utilizamos cookies para mejorar su experiencia en nuestro sitio web. 
                Puede gestionar sus preferencias de cookies en la configuración de su navegador.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-primary-dark mb-4">
                6. Contacto
              </h2>
              <p className="text-gray-700 mb-4">
                Para ejercer sus derechos o hacer consultas sobre privacidad:
              </p>
              <div className="bg-primary-light p-4 rounded-lg">
                <p className="text-primary-dark font-semibold">Responsable de Protección de Datos</p>
                <p className="text-gray-700">Email: privacy@miestrella.com</p>
                <p className="text-gray-700">Mi Estrella</p>
              </div>
            </section>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Privacy;