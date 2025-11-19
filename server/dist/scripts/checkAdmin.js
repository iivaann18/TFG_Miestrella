import bcrypt from 'bcryptjs';
import pool from '../config/database';
import dotenv from 'dotenv';
dotenv.config();
async function checkAdmin() {
    try {
        const adminEmail = process.env.ADMIN_EMAIL || 'admin@miestrella.com';
        const adminPassword = process.env.ADMIN_PASSWORD || 'Admin123!MiEstrella';
        console.log('🔍 Buscando usuario admin...');
        console.log('📧 Email esperado:', adminEmail);
        console.log('🔑 Contraseña esperada:', adminPassword);
        console.log('');
        // Buscar el usuario
        const [users] = await pool.query('SELECT id, email, password FROM users WHERE email = ?', [adminEmail]);
        if (users.length === 0) {
            console.log('❌ Usuario admin NO encontrado en la base de datos');
            process.exit(1);
        }
        const user = users[0];
        console.log('✅ Usuario encontrado:');
        console.log('   ID:', user.id);
        console.log('   Email:', user.email);
        console.log('   Password hash:', user.password);
        console.log('');
        // Verificar contraseña
        const isValid = await bcrypt.compare(adminPassword, user.password);
        console.log('🔐 Verificación de contraseña:', isValid ? '✅ VÁLIDA' : '❌ INVÁLIDA');
        console.log('');
        if (!isValid) {
            console.log('⚠️  La contraseña no coincide. Recreando admin...');
            const hashedPassword = await bcrypt.hash(adminPassword, 10);
            await pool.query('UPDATE users SET password = ? WHERE email = ?', [hashedPassword, adminEmail]);
            console.log('✅ Admin actualizado. Intenta de nuevo.');
        }
        process.exit(0);
    }
    catch (error) {
        console.error('❌ Error:', error);
        process.exit(1);
    }
}
checkAdmin();
//# sourceMappingURL=checkAdmin.js.map