import React from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Terms: React.FC = () => {
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
            Términos y Condiciones
          </h1>
          
          <p className="text-gray-600 mb-8">
            Última actualización: {new Date().toLocaleDateString('es-ES')}
          </p>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-primary-dark mb-4">
              1. Aceptación de los Términos
            </h2>
            <p className="text-gray-700 leading-relaxed">
              Al acceder y utilizar este sitio web, usted acepta estar sujeto a estos Términos y Condiciones de uso, todas las leyes y regulaciones aplicables, y acepta que es responsable del cumplimiento de las leyes locales aplicables.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-primary-dark mb-4">
              2. Uso de la Licencia
            </h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              Se concede permiso para descargar temporalmente una copia de los materiales en el sitio web de Mi Estrella solo para visualización transitoria personal y no comercial. Esta es la concesión de una licencia, no una transferencia de título, y bajo esta licencia usted no puede:
            </p>
            <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4">
              <li>Modificar o copiar los materiales</li>
              <li>Usar los materiales para cualquier propósito comercial</li>
              <li>Intentar descompilar o realizar ingeniería inversa de cualquier software contenido en el sitio web</li>
              <li>Eliminar cualquier derecho de autor u otras notaciones de propiedad de los materiales</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-primary-dark mb-4">
              3. Productos y Precios
            </h2>
            <p className="text-gray-700 leading-relaxed">
              Todos los productos están sujetos a disponibilidad. Nos reservamos el derecho de limitar las cantidades de cualquier producto o servicio que ofrecemos. Los precios de nuestros productos están sujetos a cambios sin previo aviso. Hacemos todo lo posible para mostrar con precisión los colores y las imágenes de nuestros productos, pero no podemos garantizar que la visualización de cualquier color en su monitor sea precisa.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-primary-dark mb-4">
              4. Pedidos y Pagos
            </h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              Al realizar un pedido, usted garantiza que:
            </p>
            <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4">
              <li>Es legalmente capaz de celebrar contratos vinculantes</li>
              <li>Tiene al menos 18 años de edad</li>
              <li>La información de pago que proporciona es verdadera y precisa</li>
              <li>Tiene suficientes fondos para completar la transacción</li>
            </ul>
            <p className="text-gray-700 leading-relaxed mt-4">
              Nos reservamos el derecho de rechazar o cancelar cualquier pedido por cualquier motivo, incluyendo disponibilidad, errores en la descripción o precio del producto, o problemas identificados por nuestro departamento de crédito o fraude.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-primary-dark mb-4">
              5. Envíos
            </h2>
            <p className="text-gray-700 leading-relaxed">
              Los tiempos de entrega son estimados y no están garantizados. No nos hacemos responsables de retrasos en la entrega causados por servicios de mensajería de terceros. El riesgo de pérdida y el título de los productos comprados pasan a usted en el momento de la entrega al transportista.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-primary-dark mb-4">
              6. Devoluciones y Reembolsos
            </h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              Aceptamos devoluciones dentro de los 30 días posteriores a la recepción del pedido, siempre que:
            </p>
            <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4">
              <li>El producto esté en su estado original</li>
              <li>El producto no haya sido usado o dañado</li>
              <li>Se incluya el embalaje original</li>
              <li>Se proporcione el recibo o prueba de compra</li>
            </ul>
            <p className="text-gray-700 leading-relaxed mt-4">
              Los gastos de envío de devolución corren por cuenta del cliente, excepto en caso de productos defectuosos o errores en el pedido.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-primary-dark mb-4">
              7. Limitación de Responsabilidad
            </h2>
            <p className="text-gray-700 leading-relaxed">
              En ningún caso Mi Estrella o sus proveedores serán responsables de daños especiales, incidentales o consecuentes que resulten del uso o la imposibilidad de usar los materiales en el sitio web, incluso si Mi Estrella ha sido notificado de la posibilidad de tales daños.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-primary-dark mb-4">
              8. Modificaciones
            </h2>
            <p className="text-gray-700 leading-relaxed">
              Mi Estrella puede revisar estos términos de servicio en cualquier momento sin previo aviso. Al usar este sitio web, usted acepta estar sujeto a la versión actual de estos Términos y Condiciones de uso.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-primary-dark mb-4">
              9. Ley Aplicable
            </h2>
            <p className="text-gray-700 leading-relaxed">
              Estos términos y condiciones se rigen e interpretan de acuerdo con las leyes de España, y usted se somete irrevocablemente a la jurisdicción exclusiva de los tribunales de ese estado o ubicación.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-primary-dark mb-4">
              10. Contacto
            </h2>
            <p className="text-gray-700 leading-relaxed">
              Si tiene preguntas sobre estos Términos y Condiciones, puede contactarnos en:
            </p>
            <div className="mt-4 p-4 bg-primary-light rounded-lg">
              <p className="text-gray-700">
                <strong>Email:</strong> info@miestrella.com<br />
                <strong>Teléfono:</strong> +34 123 456 789<br />
                <strong>Dirección:</strong> Madrid, España
              </p>
            </div>
          </section>
        </motion.div>
      </div>
    </div>
  );
};

export default Terms;