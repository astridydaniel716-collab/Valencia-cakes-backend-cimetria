const LoginModelo = require('../modelo/LoginModelo');

class LoginControlador {

  async login(req, res) {

    const { correo, contrasena } = req.body;

    if (!correo || !contrasena) {
      return res.status(400).json({
        ok: false,
        msg: 'Por favor, ingrese correo y contraseña'
      });
    }

    try {

      const resultado =
        await LoginModelo.verificarCredenciales(
          correo,
          contrasena
        );

      if (resultado.error) {
        return res.status(401).json({
          ok: false,
          msg: resultado.error
        });
      }

      const u = resultado.usuario;

      // 🔥 IMPORTANTE: INCLUIR ID REAL DE BD
      return res.status(200).json({
        ok: true,
        msg: 'Inicio de sesión exitoso',
        usuario: {
          idusuario: u.idusuario,   // 👈 ESTE ES EL FIX CLAVE
          identificacion: u.identificacion,
          nombres: u.nombres,
          correo: u.correo,
          telefono: u.telefono,
          rol: u.rol
        }
      });

    } catch (error) {

      console.error('Error en LoginControlador:', error);

      return res.status(500).json({
        ok: false,
        msg: 'Error interno del servidor durante el login'
      });

    }

  }

}

module.exports = new LoginControlador();