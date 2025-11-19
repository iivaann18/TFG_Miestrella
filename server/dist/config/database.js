import mysql from 'mysql2/promise';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';
// Obtener __dirname en ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
// Cargar .env desde la raíz del proyecto
dotenv.config({ path: resolve(__dirname, '../../.env') });
// Debug: Verificar que las variables se carguen
console.log('🔧 Database Config:', {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    user: process.env.DB_USER,
    database: process.env.DB_NAME,
    ssl: process.env.DB_SSL
});
const pool = mysql.createPool({
    host: process.env.DB_HOST || 'miestrella-miestrella.k.aivencloud.com',
    port: parseInt(process.env.DB_PORT || '21793'),
    user: process.env.DB_USER || 'avnadmin',
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME || 'defaultdb',
    ssl: process.env.DB_SSL === 'true' ? {
        rejectUnauthorized: false
    } : false,
    waitForConnections: true,
    connectionLimit: 10,
    maxIdle: 10,
    idleTimeout: 60000,
    queueLimit: 0,
    enableKeepAlive: true,
    keepAliveInitialDelay: 0
});
// Test connection con mejor manejo de errores
export const testConnection = async () => {
    try {
        console.log('🔄 Intentando conectar a la base de datos...');
        const connection = await pool.getConnection();
        console.log('✅ Database connected successfully to Aiven Cloud');
        // Verificar que podemos hacer queries
        const [rows] = await connection.query('SELECT 1 as test');
        console.log('✅ Query test passed:', rows);
        connection.release();
        return true;
    }
    catch (error) {
        console.error('❌ Database connection failed:', {
            message: error.message,
            code: error.code,
            errno: error.errno,
            sqlState: error.sqlState
        });
        throw error;
    }
};
export default pool;
//# sourceMappingURL=database.js.map