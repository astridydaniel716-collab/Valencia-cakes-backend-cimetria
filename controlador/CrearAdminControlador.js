const modelo = require('../modelo/CrearAdminModelo');
const CorreoControlador = require('./CorreoControlador');

class CrearAdminControlador {

    // 🔹 CREAR ADMIN
    async crear(req, res) {
        const { t1: identificacion, t2: nombres, t3: telefono, t4: correo, t5: contrasena } = req.body;

        // ✅ VALIDACIONES
        const errorCampos = this.verCampos(identificacion, nombres, telefono, correo, contrasena);
        if (errorCampos) return res.status(400).json({ error: errorCampos });

        const erorIde = this.verIde(identificacion);
        if (erorIde) return res.status(400).json({ error: erorIde });

        const errornom = this.vernom(nombres);
        if (errornom) return res.status(400).json({ error: errornom });

        const errortel = this.verTel(telefono);
        if (errortel) return res.status(400).json({ error: errortel });

        const errorem = this.veremail(correo);
        if (errorem) return res.status(400).json({ error: errorem });

        const errorkey = this.verkey(contrasena);
        if (errorkey) return res.status(400).json({ error: errorkey });

        try {
            // 🔎 Verificar si ya existe
            const usuarioExistente = await modelo.buscarPorCorreo(correo);
            if (usuarioExistente) {
                return res.status(400).json({
                    ok: false,
                    msg: 'El correo ya está registrado'
                });
            }

            // Crear ADMIN (rol fijo)
            const nuevoUsuario = await modelo.crear({
                identificacion,
                nombres,
                telefono,
                correo,
                contrasena,
                rol: 'admin' 
            });

            // Enviar correo
            try {
                await CorreoControlador.enviarBienvenida(nombres, correo);
            } catch (correoError) {
                console.warn('⚠️ Admin creado, pero correo no enviado:', correoError.message);
            }

            return res.status(201).json({
                ok: true,
                msg: 'Admin creado correctamente',
                data: {
                    identificacion: nuevoUsuario.identificacion,
                    nombres: nuevoUsuario.nombres,
                    telefono: nuevoUsuario.telefono,
                    correo: nuevoUsuario.correo,
                    rol: nuevoUsuario.rol
                }
            });

        } catch (error) {
            console.error('❌ Error en CrearAdminControlador:', error.message);

            return res.status(500).json({
                ok: false,
                msg: 'Error interno del servidor'
            });
        }
    }

    // 🔹 LISTAR SOLO ADMIN
    async listar(req, res) {
        try {
            const admin = await modelo.listar(); // 👈 debe existir en el modelo

            return res.json({
                ok: true,
                data: admin
            });

        } catch (error) {
            console.error('❌ Error al listar admin:', error.message);

            return res.status(500).json({
                ok: false,
                msg: 'Error al obtener la lista de admin'
            });
        }
    }

    // =========================
    // LISTAR POR ROL
    // =========================
    async listarPorRol(req, res) {

        const { rol } = req.params;

        try {

            const usuarios =
                await modelo.listarPorRol(rol);

            return res.json({
                ok: true,
                data: usuarios
            });

        } catch (error) {

            console.error(error);

            return res.status(500).json({
                ok: false,
                msg: 'Error al listar usuarios por rol'
            });

        }
    }

    async eliminarUsuario(req, res) {

    const { identificacion } = req.params;

    try {

        const eliminado =
            await modelo.eliminarUsuario(identificacion);

        if (!eliminado) {

            return res.status(404).json({
                ok: false,
                msg: 'Usuario no encontrado'
            });

        }

        return res.json({
            ok: true,
            msg: 'Usuario eliminado correctamente',
            data: eliminado
        });

    } catch (error) {

        console.error(error);

        return res.status(500).json({
            ok: false,
            msg: 'Error al eliminar usuario'
        });

    }
}

async actualizarUsuario(req, res) {

    const { identificacion } = req.params;
    const data = req.body;

    try {

        const actualizado =
            await modelo.actualizarUsuario(identificacion, data);

        if (!actualizado) {

            return res.status(404).json({
                ok: false,
                msg: 'Usuario no encontrado'
            });

        }

        return res.json({
            ok: true,
            msg: 'Usuario actualizado correctamente',
            data: actualizado
        });

    } catch (error) {

        console.error(error);

        return res.status(500).json({
            ok: false,
            msg: 'Error al actualizar usuario'
        });

    }
}

   // 🔹 CREAR USUARIO
async crear(req, res) {

    const {
        t1: identificacion,
        t2: nombres,
        t3: telefono,
        t4: correo,
        t5: contrasena,
        rol
    } = req.body;

    // ✅ VALIDACIONES
    const errorCampos = this.verCampos(
        identificacion,
        nombres,
        telefono,
        correo,
        contrasena
    );

    if (errorCampos) {
        return res.status(400).json({ error: errorCampos });
    }

    const erorIde = this.verIde(identificacion);
    if (erorIde) {
        return res.status(400).json({ error: erorIde });
    }

    const errornom = this.vernom(nombres);
    if (errornom) {
        return res.status(400).json({ error: errornom });
    }

    const errortel = this.verTel(telefono);
    if (errortel) {
        return res.status(400).json({ error: errortel });
    }

    const errorem = this.veremail(correo);
    if (errorem) {
        return res.status(400).json({ error: errorem });
    }

    const errorkey = this.verkey(contrasena);
    if (errorkey) {
        return res.status(400).json({ error: errorkey });
    }

    // ✅ VALIDAR ROLES
    const rolesPermitidos = ['admin', 'vendedor', 'cliente'];

    const rolFinal =
        rolesPermitidos.includes(rol)
            ? rol
            : 'cliente';

    try {

        // 🔎 Verificar si ya existe
        const usuarioExistente =
            await modelo.buscarPorCorreo(correo);

        if (usuarioExistente) {

            return res.status(400).json({
                ok: false,
                msg: 'El correo ya está registrado'
            });

        }

        // ✅ CREAR USUARIO CON ROL DINÁMICO
        const nuevoUsuario = await modelo.crear({
            identificacion,
            nombres,
            telefono,
            correo,
            contrasena,
            rol: rolFinal
        });

        // 📧 Enviar correo
        try {

            await CorreoControlador.enviarBienvenida(
                nombres,
                correo
            );

        } catch (correoError) {

            console.warn(
                '⚠️ Usuario creado, pero correo no enviado:',
                correoError.message
            );

        }

        return res.status(201).json({
            ok: true,
            msg: 'Usuario creado correctamente',
            data: {
                identificacion: nuevoUsuario.identificacion,
                nombres: nuevoUsuario.nombres,
                telefono: nuevoUsuario.telefono,
                correo: nuevoUsuario.correo,
                rol: nuevoUsuario.rol
            }
        });

    } catch (error) {

        console.error(
            '❌ Error en CrearAdminControlador:',
            error.message
        );

        return res.status(500).json({
            ok: false,
            msg: 'Error interno del servidor'
        });

    }
}

// CAMBIAR ROL
async cambiarRol(req, res) {

    const { identificacion } = req.params;

    const { rol } = req.body;

    // VALIDAR ROLES
    const rolesPermitidos = ['admin', 'vendedor', 'cliente'];

    if (!rolesPermitidos.includes(rol)) {

        return res.status(400).json({
            ok: false,
            msg: 'Rol inválido'
        });

    }

    try {

        const usuarioActualizado =
            await modelo.cambiarRol(identificacion, rol);

        if (!usuarioActualizado) {

            return res.status(404).json({
                ok: false,
                msg: 'Usuario no encontrado'
            });

        }

        return res.json({
            ok: true,
            msg: 'Rol actualizado correctamente',
            data: usuarioActualizado
        });

    } catch (error) {

        console.error(error);

        return res.status(500).json({
            ok: false,
            msg: 'Error al cambiar rol'
        });

    }
}

    // 🔹 VALIDACIONES

    verCampos(identificacion, nombres, telefono, correo, contrasena) {
        if (!identificacion || !nombres || !telefono || !correo || !contrasena) {
            return 'Todos los campos son obligatorios';
        }
        return null;
    }

    verIde(identificacion) {
        if (!/^\d{8,10}$/.test(identificacion)) {
            return 'La identificación debe tener entre 8 y 10 dígitos';
        }
        return null;
    }

    vernom(nombres) {
        const regex = /^[A-Za-zÁÉÍÓÚáéíóúÑñ\s]{3,100}$/;
        if (!regex.test(nombres)) {
            return 'Nombre inválido';
        }
        return null;
    }

    verTel(telefono) {
        if (!/^\d{10}$/.test(telefono)) {
            return 'Teléfono inválido';
        }
        return null;
    }

    veremail(correo) {
        const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!regex.test(correo)) {
            return 'Correo inválido';
        }
        return null;
    }

    verkey(contrasena) {
        const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/;
        if (!regex.test(contrasena)) {
            return 'Contraseña insegura';
        }
        return null;
    }
    
}

module.exports = new CrearAdminControlador();