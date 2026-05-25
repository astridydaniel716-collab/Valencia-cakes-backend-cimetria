const modelo = require('../modelo/CrearVendedorModelo');
const CorreoControlador = require('./CorreoControlador');

class CrearVendedorControlador {

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
            //  Verificar si ya existe
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
                rol: 'vendedor' // 🔥 importante
            });

            // 📧 Enviar correo
            try {
                await CorreoControlador.enviarBienvenida(nombres, correo);
            } catch (correoError) {
                console.warn('Vendedor creado, pero correo no enviado:', correoError.message);
            }

            // ✅ Respuesta
            return res.status(201).json({
                ok: true,
                msg: 'Vendedor creado correctamente',
                data: {
                    identificacion: nuevoUsuario.identificacion,
                    nombres: nuevoUsuario.nombres,
                    telefono: nuevoUsuario.telefono,
                    correo: nuevoUsuario.correo,
                    rol: nuevoUsuario.rol
                }
            });

        } catch (error) {
            console.error('❌ Error en CrearVendedorControlador:', error.message);

            return res.status(500).json({
                ok: false,
                msg: 'Error interno del servidor'
            });
        }
    }

    // 🔹 LISTAR SOLO VENDEDOR
    async listar(req, res) {
        try {
            const vendedor = await modelo.listar(); // 👈 debe existir en el modelo

            return res.json({
                ok: true,
                data: vendedor
            });

        } catch (error) {
            console.error('❌ Error al listar vendedor:', error.message);

            return res.status(500).json({
                ok: false,
                msg: 'Error al obtener la lista de vendedor'
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

module.exports = new CrearVendedorControlador();