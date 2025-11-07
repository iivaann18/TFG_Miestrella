import { Request, Response } from 'express';
import pool from '../config/database';
import { ResultSetHeader, RowDataPacket } from 'mysql2';
import { sendEmail } from '../config/email';

// Suscribirse al newsletter
export const subscribe = async (req: Request, res: Response) => {
  try {
    const { email, name } = req.body;

    // Verificar si ya está suscrito
    const [existing] = await pool.query<RowDataPacket[]>(
      'SELECT * FROM newsletter_subscribers WHERE email = ?',
      [email]
    );

    if (existing.length > 0) {
      if (existing[0].isActive) {
        return res.status(400).json({ error: 'Este email ya está suscrito' });
      } else {
        // Reactivar suscripción
        await pool.query(
          'UPDATE newsletter_subscribers SET isActive = true, unsubscribedAt = NULL WHERE email = ?',
          [email]
        );
        return res.json({ message: 'Suscripción reactivada exitosamente' });
      }
    }

    // Nueva suscripción
    await pool.query(
      'INSERT INTO newsletter_subscribers (email, name) VALUES (?, ?)',
      [email, name || null]
    );

    // Enviar email de bienvenida
    try {
      await sendEmail({
        to: email,
        subject: '¡Bienvenido a Mi Estrella!',
        html: `
          <h1>¡Gracias por suscribirte!</h1>
          <p>Hola${name ? ` ${name}` : ''},</p>
          <p>Estás suscrito a nuestro newsletter. Recibirás ofertas exclusivas y novedades sobre nuestras figuras de porcelana.</p>
          <p>Saludos,<br>El equipo de Mi Estrella</p>
        `
      });
    } catch (emailError) {
      console.error('Error sending welcome email:', emailError);
      // No fallar la suscripción si el email falla
    }

    res.json({ message: 'Suscripción exitosa' });
  } catch (error) {
    console.error('Error subscribing:', error);
    res.status(500).json({ error: 'Error al suscribirse' });
  }
};

// Cancelar suscripción
export const unsubscribe = async (req: Request, res: Response) => {
  try {
    const { email } = req.body;

    await pool.query(
      'UPDATE newsletter_subscribers SET isActive = false, unsubscribedAt = NOW() WHERE email = ?',
      [email]
    );

    res.json({ message: 'Suscripción cancelada exitosamente' });
  } catch (error) {
    console.error('Error unsubscribing:', error);
    res.status(500).json({ error: 'Error al cancelar suscripción' });
  }
};

// Obtener todos los suscriptores (admin)
export const getAllSubscribers = async (req: Request, res: Response) => {
  try {
    const [subscribers] = await pool.query<RowDataPacket[]>(
      'SELECT * FROM newsletter_subscribers ORDER BY subscribedAt DESC'
    );

    res.json(subscribers);
  } catch (error) {
    console.error('Error getting subscribers:', error);
    res.status(500).json({ error: 'Error al obtener suscriptores' });
  }
};