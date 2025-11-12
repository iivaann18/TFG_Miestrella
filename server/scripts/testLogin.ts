import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config();

async function testLogin() {
  try {
    console.log('🔄 Intentando login en http://localhost:3001/api/auth/login...');
    const response = await axios.post('http://localhost:3001/api/auth/login', {
      email: 'admin@miestrella.com',
      password: 'Admin123!MiEstrella'
    });
    
    console.log('✅ Login exitoso:');
    console.log(JSON.stringify(response.data, null, 2));
  } catch (error: any) {
    console.error('❌ Error de conexión o respuesta:');
    if (error.code) {
      console.error('Código:', error.code);
    }
    if (error.message) {
      console.error('Mensaje:', error.message);
    }
    if (error.response) {
      console.error('Status:', error.response.status);
      console.error('Data:', error.response.data);
    } else {
      console.error('No hay respuesta del servidor:', error);
    }
  }
  process.exit(0);
}

testLogin();
