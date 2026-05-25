const Conexion = require('./bd/Conexion');
const bcrypt = require('bcrypt');

class LoginModelo {
  constructor() {
    if (LoginModelo.instance) {
      return LoginModelo.instance;
    }

    this.db = Conexion;
    LoginModelo.instance = this;
  }

  /**
   * Verifica las credenciales del usuario
   * @param {string} correo - El correo ingresado
   * @param {string} contrasenaPlana - La contraseña sin encriptar que viene del formulario
   */
  async verificarCredenciales(correo, contrasenaPlana) {
    // 1. Buscamos al usuario por correo para obtener su hash de la BD
    const query = `SELECT * FROM usuarios WHERE correo = $1;`;
    
    try {
      const result = await this.db.query(query, [correo]);
      const usuario = result.rows[0];

      // 2. Si el usuario no existe, retornamos null
      if (!usuario) {
        return { error: 'Usuario no encontrado' };
      }

      // 3. Comparar la contraseña ingresada con el hash de la BD
      // bcrypt.compare devuelve true o false
      const coincide = await bcrypt.compare(contrasenaPlana, usuario.contrasena);

      if (coincide) {
        // Si coincide, retornamos los datos del usuario (sin la contraseña)
        const { contrasena, ...datosPublicos } = usuario;
        return { success: true, usuario: datosPublicos };
      } else {
        // Si no coincide
        return { error: 'credenciales incorrectas' };
      }

    } catch (err) {
      console.error('❌ Error en el proceso de Login:', err.message);
      throw err;
    }
  }
}

module.exports = new LoginModelo();