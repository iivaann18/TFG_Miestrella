import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
dotenv.config();
// Configurar transporter de nodemailer
const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST || 'smtp.gmail.com',
    port: parseInt(process.env.EMAIL_PORT || '587'),
    secure: false, // true para puerto 465, false para otros puertos
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD,
    },
});
// Verificar la configuración
transporter.verify((error, success) => {
    if (error) {
        console.error('❌ Error en configuración de email:', error);
    }
    else {
        console.log('✅ Servidor de email listo');
    }
});
// Función para enviar emails
export const sendEmail = async (options) => {
    try {
        const mailOptions = {
            from: options.from || process.env.EMAIL_FROM || process.env.EMAIL_USER,
            to: options.to,
            subject: options.subject,
            html: options.html,
            ...(options.attachments ? { attachments: options.attachments } : {}),
        };
        const info = await transporter.sendMail(mailOptions);
        console.log('✅ Email enviado:', info.messageId);
    }
    catch (error) {
        console.error('❌ Error al enviar email:', error);
        throw error;
    }
};
// Función para enviar email de bienvenida
export const sendWelcomeEmail = async (to, name) => {
    const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(135deg, #875b3b 0%, #a88453 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
        .content { background: #f4dcd5; padding: 30px; }
        .button { display: inline-block; padding: 12px 30px; background: #875b3b; color: white; text-decoration: none; border-radius: 5px; margin-top: 20px; }
        .footer { background: #2d2638; color: white; padding: 20px; text-align: center; border-radius: 0 0 10px 10px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>¡Bienvenido a Mi Estrella!</h1>
        </div>
        <div class="content">
          <p>Hola ${name},</p>
          <p>Gracias por registrarte en Mi Estrella. Estamos emocionados de tenerte con nosotros.</p>
          <p>Descubre nuestra colección exclusiva de figuras de porcelana artesanales, cada una hecha con dedicación y amor.</p>
          <a href="${process.env.APP_URL}/store" class="button">Explorar Tienda</a>
        </div>
        <div class="footer">
          <p>© 2024 Mi Estrella. Todos los derechos reservados.</p>
        </div>
      </div>
    </body>
    </html>
  `;
    await sendEmail({
        to,
        subject: '¡Bienvenido a Mi Estrella! 🌟',
        html,
    });
};
// Función para enviar email de empleado
export const sendEmployeeCredentials = async (to, name, password) => {
    const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: #2d2638; color: white; padding: 30px; text-align: center; }
        .content { background: #f4f4f4; padding: 30px; }
        .credentials { background: white; padding: 20px; border-left: 4px solid #875b3b; margin: 20px 0; }
        .warning { background: #fff3cd; border-left: 4px solid #ffc107; padding: 15px; margin: 20px 0; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>Bienvenido al equipo de Mi Estrella</h1>
        </div>
        <div class="content">
          <p>Hola ${name},</p>
          <p>Has sido añadido como empleado en Mi Estrella. Aquí están tus credenciales de acceso:</p>
          <div class="credentials">
            <p><strong>Email:</strong> ${to}</p>
            <p><strong>Contraseña temporal:</strong> ${password}</p>
            <p><strong>URL de acceso:</strong> ${process.env.APP_URL}/login</p>
          </div>
          <div class="warning">
            <p><strong>⚠️ Importante:</strong> Por favor, cambia tu contraseña inmediatamente después de iniciar sesión por primera vez.</p>
          </div>
          <p>Si tienes alguna pregunta, no dudes en contactar con el administrador.</p>
        </div>
      </div>
    </body>
    </html>
  `;
    await sendEmail({
        to,
        subject: 'Credenciales de acceso - Mi Estrella',
        html,
    });
};
// Función para enviar confirmación de pedido
export const sendOrderConfirmation = async (to, orderNumber, total, attachments) => {
    const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: #875b3b; color: white; padding: 30px; text-align: center; }
        .content { background: #f4f4f4; padding: 30px; }
        .order-box { background: white; padding: 20px; border: 2px solid #875b3b; margin: 20px 0; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>¡Pedido Confirmado! 🎉</h1>
        </div>
        <div class="content">
          <p>Gracias por tu compra en Mi Estrella.</p>
          <div class="order-box">
            <h2>Detalles del Pedido</h2>
            <p><strong>Número de pedido:</strong> ${orderNumber}</p>
            <p><strong>Total:</strong> €${total.toFixed(2)}</p>
          </div>
          <p>Recibirás un email cuando tu pedido sea enviado.</p>
          <p>Saludos,<br>El equipo de Mi Estrella</p>
        </div>
      </div>
    </body>
    </html>
  `;
    await sendEmail({
        to,
        subject: `Confirmación de Pedido ${orderNumber}`,
        html,
        // allow optional attachments
        ...(attachments ? { attachments } : {}),
    });
};
export default transporter;
//# sourceMappingURL=email.js.map