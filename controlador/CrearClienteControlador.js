const modelo = require('../modelo/CrearClienteModelo');
const CorreoControlador = require('./CorreoControlador');

class CrearClienteControlador {

    // 🔹 CREAR USUARIO
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

            // 💾 Crear usuario
            const nuevoUsuario = await modelo.crear({
                identificacion,
                nombres,
                telefono,
                correo,
                contrasena
            });

            // 📧 Enviar correo (no bloquea si falla)
            try {
                await CorreoControlador.enviarBienvenida(nombres, correo);
            } catch (correoError) {
                console.warn('⚠️ Usuario creado, pero correo no enviado:', correoError.message);
            }

            // ✅ Respuesta final
            return res.status(201).json({
                ok: true,
                msg: 'Usuario creado correctamente',
                data: {
                    identificacion: nuevoUsuario.identificacion,
                    nombres: nuevoUsuario.nombres,
                    telefono: nuevoUsuario.telefono,
                    correo: nuevoUsuario.correo
                }
            });

        } catch (error) {
            console.error('❌ Error en CrearClienteControlador:', error.message);

            return res.status(500).json({
                ok: false,
                msg: 'Error interno del servidor'
            });
        }
    }

    // 🔹 LISTAR TODOS
    async listar(req, res) {
        try {
            const usuarios = await modelo.listar();

            res.status(200).json({
                ok: true,
                data: usuarios
            });

        } catch (error) {
            res.status(500).json({
                ok: false,
                msg: 'Error al obtener usuarios'
            });
        }
    }

    //LISTAR SOLO CLIENTES
     async listarclientes(req, res) {
            try {
                const clientes = await modelo.listarclientes(); // 👈 debe existir en el modelo
    
                return res.json({
                    ok: true,
                    data: clientes
                });
    
            } catch (error) {
                console.error('❌ Error al listar clientes:', error.message);
    
                return res.status(500).json({
                    ok: false,
                    msg: 'Error al obtener la lista de clientes'
                });
            }
        }

    // 🔹 BUSCAR POR ID
    async buscarPorIdentificacion(req, res) {
        try {
            const { identificacion } = req.params;
            const usuario = await modelo.buscarPorId(identificacion);

            if (!usuario) {
                return res.status(404).json({
                    ok: false,
                    msg: 'Usuario no encontrado'
                });
            }

            res.json({
                ok: true,
                data: usuario
            });

        } catch (error) {
            res.status(500).json({
                ok: false,
                msg: 'Error al buscar usuario'
            });
        }
    }

    // 🔹 BUSCAR POR CORREO
    async buscarPorCorreo(req, res) {
        try {
            const { correo } = req.params;

            const usuario = await modelo.buscarPorCorreo(correo);

            if (!usuario) {
                return res.status(404).json({
                    ok: false,
                    msg: 'Usuario no encontrado'
                });
            }

            res.json({
                ok: true,
                data: usuario
            });

        } catch (error) {
            res.status(500).json({
                ok: false,
                msg: 'Error al buscar por correo'
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

module.exports = new CrearClienteControlador();