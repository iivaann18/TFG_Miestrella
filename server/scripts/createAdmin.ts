import bcrypt from 'bcryptjs';
import pool from '../config/database';
import dotenv from 'dotenv';

dotenv.config();

async function createAdmin() {
  try {
    const adminEmail = process.env.ADMIN_EMAIL || 'admin@miestrella.com';
    const adminPassword = process.env.ADMIN_PASSWORD || 'Admin123!MiEstrella';
    
    console.log('🔄 Creando usuario administrador...');
    
    // Hashear contraseña
    const hashedPassword = await bcrypt.hash(adminPassword, 10);
    
    // Insertar o actualizar admin
    await pool.query(
      `INSERT INTO users (email, password, firstName, lastName, role) 
       VALUES (?, ?, ?, ?, 'admin')
       ON DUPLICATE KEY UPDATE password = VALUES(password)`,
      [adminEmail, hashedPassword, 'Admin', 'Mi Estrella']
    );
    
    console.log('✅ Usuario administrador creado exitosamente');
    console.log('📧 Email:', adminEmail);
    console.log('🔑 Contraseña:', adminPassword);
    console.log('');
    console.log('⚠️  Por favor, cambia la contraseña después del primer inicio de sesión');
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error creating admin:', error);
    process.exit(1);
  }
}

createAdmin();