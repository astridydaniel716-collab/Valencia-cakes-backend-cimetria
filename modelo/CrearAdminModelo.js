const Conexion = require('./bd/Conexion');
const bcrypt = require('bcrypt'); 

class CrearAdminModelo {
    constructor() {
        if (CrearAdminModelo.instance) {
            return CrearAdminModelo.instance;
        }

        this.db = Conexion;
        CrearAdminModelo.instance = this;
    }

    /**
     * Crea un nuevo usuario con contraseña hasheada
     */
    async crear(usuarios) {
      
        const {
            identificacion,
            nombres,
            telefono,
            correo,
            contrasena,
            rol ='admin'
        } = usuarios;

        try {
            // 2. Generar el Hash con salto de 10
            const saltRounds = 10;
            const contrasenaHasheada = await bcrypt.hash(contrasena, saltRounds);

            const query = `
        INSERT INTO usuarios (identificacion, nombres, telefono, correo, contrasena, rol)
        VALUES ($1, $2, $3, $4, $5, $6)
        RETURNING *;
      `;

            // 3. Guardamos la versión segura (hasheada)
            const values = [identificacion, nombres, telefono, correo, contrasenaHasheada, rol];

            const result = await this.db.query(query, values);
            return result.rows[0];
        } catch (err) {
            console.error('❌ Error al crear admin:', err.message);
            throw err;
        }
    }

    async buscarPorCorreo(correo) {
    const query = `SELECT * FROM usuarios WHERE correo = $1;`;

    try {
        const result = await this.db.query(query, [correo]);
        return result.rows[0] || null;
    } catch (err) {
        console.error('❌ Error al buscar por correo:', err.message);
        throw err;
    }
}

   async listar() {
    const query = `
        SELECT * FROM usuarios 
        WHERE rol = 'admin'
        ORDER BY identificacion ASC;
    `;

    try {
        const result = await this.db.query(query);
        return result.rows;
    } catch (err) {
        console.error('❌ Error al listar admin:', err.message);
        throw err;
    }
}
// =========================
    // 🔥 NUEVO: LISTAR POR ROL
    // =========================
    async listarPorRol(rol) {

        const query = `
            SELECT * 
            FROM usuarios
            WHERE rol = $1
            ORDER BY identificacion ASC;
        `;

        try {

            const result =
                await this.db.query(query, [rol]);

            return result.rows;

        } catch (err) {

            console.error('❌ Error al listar por rol:', err.message);
            throw err;

        }
    }

    async eliminarUsuario(identificacion) {

    const query = `
        DELETE FROM usuarios
        WHERE identificacion = $1
        RETURNING identificacion, nombres, rol;
    `;

    try {

        const result =
            await this.db.query(query, [identificacion]);

        return result.rows[0];

    } catch (err) {

        console.error('❌ Error al eliminar usuario:', err.message);
        throw err;

    }
}

async actualizarUsuario(identificacion, data) {

    const {
        nombres,
        telefono,
        correo,
        rol
    } = data;

    const query = `
        UPDATE usuarios
        SET nombres = $1,
            telefono = $2,
            correo = $3,
            rol = $4
        WHERE identificacion = $5
        RETURNING identificacion, nombres, telefono, correo, rol;
    `;

    try {

        const result =
            await this.db.query(query, [
                nombres,
                telefono,
                correo,
                rol,
                identificacion
            ]);

        return result.rows[0];

    } catch (err) {

        console.error('❌ Error al actualizar usuario:', err.message);
        throw err;

    }
}

// CAMBIAR ROL
async cambiarRol(identificacion, nuevoRol) {

    const query = `
        UPDATE usuarios
        SET rol = $1
        WHERE identificacion = $2
        RETURNING identificacion, nombres, telefono, correo, rol;
    `;

    try {

        const result = await this.db.query(query, [nuevoRol, identificacion]);

        return result.rows[0];

    } catch (err) {

        console.error('❌ Error al cambiar rol:', err.message);
        throw err;

    }
}
}

module.exports = new CrearAdminModelo();