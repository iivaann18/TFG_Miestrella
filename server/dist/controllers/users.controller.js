import pool from '../config/database';
// Obtener todos los usuarios (solo admin)
export const getAllUsers = async (req, res) => {
    try {
        const [users] = await pool.query(`SELECT 
        id, email, firstName, lastName, phone, gender, role, 
        permissions, createdAt, updatedAt
       FROM users
       ORDER BY createdAt DESC`);
        res.json(users);
    }
    catch (error) {
        console.error('Error getting users:', error);
        res.status(500).json({ error: 'Error al obtener usuarios' });
    }
};
// Obtener usuario por ID
export const getUserById = async (req, res) => {
    try {
        const { id } = req.params;
        const [users] = await pool.query(`SELECT 
        id, email, firstName, lastName, phone, gender, role, 
        permissions, createdAt, updatedAt
       FROM users
       WHERE id = ?`, [id]);
        if (users.length === 0) {
            return res.status(404).json({ error: 'Usuario no encontrado' });
        }
        res.json(users[0]);
    }
    catch (error) {
        console.error('Error getting user:', error);
        res.status(500).json({ error: 'Error al obtener usuario' });
    }
};
// Actualizar permisos de empleado
export const updateUserPermissions = async (req, res) => {
    try {
        const { id } = req.params;
        const { permissions } = req.body;
        // Verificar que el usuario existe y es empleado
        const [users] = await pool.query('SELECT role FROM users WHERE id = ?', [id]);
        if (users.length === 0) {
            return res.status(404).json({ error: 'Usuario no encontrado' });
        }
        if (users[0].role === 'admin') {
            return res.status(400).json({ error: 'No se pueden modificar permisos de administradores' });
        }
        // Actualizar permisos
        await pool.query('UPDATE users SET permissions = ?, updatedAt = NOW() WHERE id = ?', [JSON.stringify(permissions), id]);
        res.json({ message: 'Permisos actualizados exitosamente' });
    }
    catch (error) {
        console.error('Error updating permissions:', error);
        res.status(500).json({ error: 'Error al actualizar permisos' });
    }
};
// Activar/Desactivar usuario
export const toggleUserStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { isActive } = req.body;
        // Verificar que no sea admin
        const [users] = await pool.query('SELECT role FROM users WHERE id = ?', [id]);
        if (users.length === 0) {
            return res.status(404).json({ error: 'Usuario no encontrado' });
        }
        if (users[0].role === 'admin') {
            return res.status(400).json({ error: 'No se puede desactivar a un administrador' });
        }
        // Actualizar estado
        res.json({ message: `Usuario ${isActive ? 'activado' : 'desactivado'} exitosamente` });
    }
    catch (error) {
        console.error('Error toggling user status:', error);
        res.status(500).json({ error: 'Error al cambiar estado del usuario' });
    }
};
// Eliminar usuario
export const deleteUser = async (req, res) => {
    try {
        const { id } = req.params;
        // Verificar que el usuario existe
        const [users] = await pool.query('SELECT role FROM users WHERE id = ?', [id]);
        if (users.length === 0) {
            return res.status(404).json({ error: 'Usuario no encontrado' });
        }
        if (users[0].role === 'admin') {
            return res.status(400).json({ error: 'No se puede eliminar a un administrador' });
        }
        // Eliminar usuario
        await pool.query('DELETE FROM users WHERE id = ?', [id]);
        res.json({ message: 'Usuario eliminado exitosamente' });
    }
    catch (error) {
        console.error('Error deleting user:', error);
        res.status(500).json({ error: 'Error al eliminar usuario' });
    }
};
//# sourceMappingURL=users.controller.js.map