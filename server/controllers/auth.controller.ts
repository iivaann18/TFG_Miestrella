import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import pool from '../config/database';
import { ResultSetHeader, RowDataPacket } from 'mysql2';
import { sendWelcomeEmail, sendEmployeeCredentials } from '../config/email';

// Generar token JWT - CORREGIDO
const generateToken = (userId: number): string => {
  const secret = process.env.JWT_SECRET || 'secret';
  const expiresIn = process.env.JWT_EXPIRES_IN || '7d';
  
  return jwt.sign(
    { userId },
    secret,
    { expiresIn }
  );
};

// Generar contraseña aleatoria
const generateRandomPassword = (): string => {
  const length = 12;
  const charset = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*';
  let password = '';
  for (let i = 0; i < length; i++) {
    password += charset.charAt(Math.floor(Math.random() * charset.length));
  }
  return password;
};

// Registro de usuario
export const register = async (req: Request, res: Response) => {
  try {
    const { email, password, firstName, lastName, phone, gender } = req.body;

    // Validar campos requeridos
    if (!email || !password || !firstName || !lastName) {
      return res.status(400).json({ 
        error: 'Email, contraseña, nombre y apellidos son obligatorios' 
      });
    }

    // Verificar si el email ya existe
    const [existingUsers] = await pool.query<RowDataPacket[]>(
      'SELECT id FROM users WHERE email = ?',
      [email]
    );

    if (existingUsers.length > 0) {
      return res.status(400).json({ error: 'Este email ya está registrado' });
    }

    // Hashear contraseña
    const hashedPassword = await bcrypt.hash(password, 10);

    // Insertar usuario
    const [result] = await pool.query<ResultSetHeader>(
      `INSERT INTO users 
       (email, password, firstName, lastName, phone, gender, role)
       VALUES (?, ?, ?, ?, ?, ?, 'customer')`,
      [email, hashedPassword, firstName, lastName, phone || null, gender || null]
    );

    const userId = result.insertId;

    // Generar token
    const token = generateToken(userId);

    // Enviar email de bienvenida (no bloqueante)
    try {
      await sendWelcomeEmail(email, firstName);
    } catch (emailError) {
      console.error('Error sending welcome email:', emailError);
      // No fallar el registro si el email falla
    }

    res.status(201).json({
      message: 'Usuario registrado exitosamente',
      token,
      user: {
        id: userId,
        email,
        firstName,
        lastName,
        role: 'customer'
      }
    });
  } catch (error) {
    console.error('Error in register:', error);
    res.status(500).json({ error: 'Error al registrar usuario' });
  }
};

// Login de usuario
export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email y contraseña son obligatorios' });
    }

    // Buscar usuario
    const [users] = await pool.query<RowDataPacket[]>(
      'SELECT * FROM users WHERE email = ?',
      [email]
    );

    if (users.length === 0) {
      return res.status(401).json({ error: 'Credenciales incorrectas' });
    }

    const user = users[0];

    // Verificar contraseña
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res.status(401).json({ error: 'Credenciales incorrectas' });
    }

    // Generar token
    const token = generateToken(user.id);

    // Parsear permisos si existen
    let permissions = null;
    if (user.permissions) {
      try {
        permissions = typeof user.permissions === 'string' 
          ? JSON.parse(user.permissions) 
          : user.permissions;
      } catch (e) {
        console.error('Error parsing permissions:', e);
      }
    }

    res.json({
      message: 'Login exitoso',
      token,
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        phone: user.phone,
        gender: user.gender,
        role: user.role,
        permissions
      }
    });
  } catch (error) {
    console.error('Error in login:', error);
    res.status(500).json({ error: 'Error al iniciar sesión' });
  }
};

// Logout
export const logout = async (req: Request, res: Response) => {
  try {
    res.json({ message: 'Logout exitoso' });
  } catch (error) {
    console.error('Error in logout:', error);
    res.status(500).json({ error: 'Error al cerrar sesión' });
  }
};

// Obtener perfil del usuario autenticado
export const getProfile = async (req: Request, res: Response) => {
  try {
    const userId = req.userId;

    const [users] = await pool.query<RowDataPacket[]>(
      `SELECT id, email, firstName, lastName, phone, gender, role, permissions
       FROM users WHERE id = ?`,
      [userId]
    );

    if (users.length === 0) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }

    const user = users[0];

    // Parsear permisos
    let permissions = null;
    if (user.permissions) {
      try {
        permissions = typeof user.permissions === 'string' 
          ? JSON.parse(user.permissions) 
          : user.permissions;
      } catch (e) {
        console.error('Error parsing permissions:', e);
      }
    }

    res.json({
      ...user,
      permissions
    });
  } catch (error) {
    console.error('Error getting profile:', error);
    res.status(500).json({ error: 'Error al obtener perfil' });
  }
};

// Actualizar perfil
export const updateProfile = async (req: Request, res: Response) => {
  try {
    const userId = req.userId;
    const { firstName, lastName, phone, gender } = req.body;

    await pool.query(
      `UPDATE users 
       SET firstName = ?, lastName = ?, phone = ?, gender = ?, updatedAt = NOW()
       WHERE id = ?`,
      [firstName, lastName, phone || null, gender || null, userId]
    );

    res.json({ message: 'Perfil actualizado exitosamente' });
  } catch (error) {
    console.error('Error updating profile:', error);
    res.status(500).json({ error: 'Error al actualizar perfil' });
  }
};

// Cambiar contraseña
export const changePassword = async (req: Request, res: Response) => {
  try {
    const userId = req.userId;
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({ 
        error: 'Contraseña actual y nueva contraseña son obligatorias' 
      });
    }

    // Obtener contraseña actual
    const [users] = await pool.query<RowDataPacket[]>(
      'SELECT password FROM users WHERE id = ?',
      [userId]
    );

    if (users.length === 0) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }

    // Verificar contraseña actual
    const isPasswordValid = await bcrypt.compare(currentPassword, users[0].password);

    if (!isPasswordValid) {
      return res.status(401).json({ error: 'Contraseña actual incorrecta' });
    }

    // Hashear nueva contraseña
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Actualizar contraseña
    await pool.query(
      'UPDATE users SET password = ?, updatedAt = NOW() WHERE id = ?',
      [hashedPassword, userId]
    );

    res.json({ message: 'Contraseña actualizada exitosamente' });
  } catch (error) {
    console.error('Error changing password:', error);
    res.status(500).json({ error: 'Error al cambiar contraseña' });
  }
};

// Crear empleado (solo admin)
export const createEmployee = async (req: Request, res: Response) => {
  try {
    const { email, firstName, lastName, permissions } = req.body;

    if (!email || !firstName || !lastName) {
      return res.status(400).json({ 
        error: 'Email, nombre y apellidos son obligatorios' 
      });
    }

    // Verificar si el email ya existe
    const [existingUsers] = await pool.query<RowDataPacket[]>(
      'SELECT id FROM users WHERE email = ?',
      [email]
    );

    if (existingUsers.length > 0) {
      return res.status(400).json({ error: 'Este email ya está registrado' });
    }

    // Generar contraseña aleatoria
    const temporaryPassword = generateRandomPassword();
    const hashedPassword = await bcrypt.hash(temporaryPassword, 10);

    // Insertar empleado
    const [result] = await pool.query<ResultSetHeader>(
      `INSERT INTO users 
       (email, password, firstName, lastName, role, permissions)
       VALUES (?, ?, ?, ?, 'employee', ?)`,
      [email, hashedPassword, firstName, lastName, JSON.stringify(permissions || {})]
    );

    // Enviar email con credenciales
    try {
      await sendEmployeeCredentials(email, firstName, temporaryPassword);
    } catch (emailError) {
      console.error('Error sending employee credentials:', emailError);
      return res.status(500).json({ 
        error: 'Empleado creado pero hubo un error al enviar el email' 
      });
    }

    res.status(201).json({
      message: 'Empleado creado exitosamente y credenciales enviadas por email',
      userId: result.insertId
    });
  } catch (error) {
    console.error('Error creating employee:', error);
    res.status(500).json({ error: 'Error al crear empleado' });
  }
};