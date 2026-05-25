const Conexion = require('./bd/Conexion');
const bcrypt = require('bcrypt'); 

class CrearVendedorModelo {
    constructor() {
        if (CrearVendedorModelo.instance) {
            return CrearVendedorModelo.instance;
        }

        this.db = Conexion;
        CrearVendedorModelo.instance = this;
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
            rol ='vendedor'
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
            console.error('❌ Error al crear vendedor:', err.message);
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
        WHERE rol = 'vendedor'
        ORDER BY identificacion ASC;
    `;

    try {
        const result = await this.db.query(query);
        return result.rows;
    } catch (err) {
        console.error('❌ Error al listar vendedor:', err.message);
        throw err;
    }
   }
}

module.exports = new CrearVendedorModelo();