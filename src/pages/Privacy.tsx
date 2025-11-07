import React from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Privacy: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-primary-light py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <motion.button
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          onClick={() => navigate('/')}
          className="flex items-center space-x-2 text-primary-brown hover:text-primary-gold mb-8 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>Volver al inicio</span>
        </motion.button>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-xl shadow-custom p-8 md:p-12"
        >
          <h1 className="text-4xl font-bold text-primary-dark mb-6">
            Política de Privacidad
          </h1>
          
          <p className="text-gray-600 mb-8">
            Última actualización: {new Date().toLocaleDateString('es-ES')}
          </p>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-primary-dark mb-4">
              1. Información que Recopilamos
            </h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              En Mi Estrella, recopilamos información que usted nos proporciona directamente cuando:
            </p>
            <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4">
              <li>Crea una cuenta en nuestro sitio web</li>
              <li>Realiza una compra</li>
              <li>Se suscribe a nuestro newsletter</li>
              <li>Se comunica con nosotros</li>
            </ul>
            <p className="text-gray-700 leading-relaxed mt-4">
              Esta información puede incluir: nombre, dirección de correo electrónico, número de teléfono, dirección de envío, información de pago y preferencias de compra.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-primary-dark mb-4">
              2. Uso de la Información
            </h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              Utilizamos la información recopilada para:
            </p>
            <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4">
              <li>Procesar y enviar sus pedidos</li>
              <li>Comunicarnos con usted sobre sus pedidos</li>
              <li>Enviarle información sobre productos y ofertas (si se ha suscrito)</li>
              <li>Mejorar nuestros productos y servicios</li>
              <li>Prevenir fraudes y garantizar la seguridad</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-primary-dark mb-4">
              3. Cookies
            </h2>
            <p className="text-gray-700 leading-relaxed">
              Utilizamos cookies para mejorar su experiencia en nuestro sitio web. Las cookies son pequeños archivos de texto que se almacenan en su dispositivo. Puede configurar su navegador para rechazar las cookies, aunque esto puede afectar la funcionalidad del sitio.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-primary-dark mb-4">
              4. Compartir Información
            </h2>
            <p className="text-gray-700 leading-relaxed">
              No vendemos ni compartimos su información personal con terceros para fines de marketing. Solo compartimos información con proveedores de servicios que nos ayudan a operar nuestro negocio (como procesadores de pago y servicios de envío).
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-primary-dark mb-4">
              5. Seguridad de los Datos
            </h2>
            <p className="text-gray-700 leading-relaxed">
              Implementamos medidas de seguridad técnicas y organizativas para proteger su información personal contra acceso no autorizado, alteración, divulgación o destrucción.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-primary-dark mb-4">
              6. Sus Derechos
            </h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              Usted tiene derecho a:
            </p>
            <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4">
              <li>Acceder a su información personal</li>
              <li>Corregir información inexacta</li>
              <li>Solicitar la eliminación de su información</li>
              <li>Oponerse al procesamiento de su información</li>
              <li>Cancelar su suscripción al newsletter en cualquier momento</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-primary-dark mb-4">
              7. Contacto
            </h2>
            <p className="text-gray-700 leading-relaxed">
              Si tiene preguntas sobre esta Política de Privacidad, puede contactarnos en:
            </p>
            <div className="mt-4 p-4 bg-primary-light rounded-lg">
              <p className="text-gray-700">
                <strong>Email:</strong> info@miestrella.com<br />
                <strong>Teléfono:</strong> +34 123 456 789
              </p>
            </div>
          </section>
        </motion.div>
      </div>
    </div>
  );
};

export default Privacy;