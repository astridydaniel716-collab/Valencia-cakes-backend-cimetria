const Conexion = require('./bd/Conexion');
const bcrypt = require('bcrypt'); 

class CrearClienteModelo {
    constructor() {
        if (CrearClienteModelo.instance) {
            return CrearClienteModelo.instance;
        }

        this.db = Conexion;
        CrearClienteModelo.instance = this;
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
            contrasena
        } = usuarios;

        try {
            // 2. Generar el Hash con salto de 10
            const saltRounds = 10;
            const contrasenaHasheada = await bcrypt.hash(contrasena, saltRounds);

            const query = `
        INSERT INTO usuarios (identificacion, nombres, telefono, correo, contrasena)
        VALUES ($1, $2, $3, $4, $5)
        RETURNING *;
      `;

            // 3. Guardamos la versión segura (hasheada)
            const values = [identificacion, nombres, telefono, correo, contrasenaHasheada];

            const result = await this.db.query(query, values);
            return result.rows[0];
        } catch (err) {
            console.error('❌ Error al crear usuario:', err.message);
            throw err;
        }
    }

    /**

* Busca un usuario por su ID

*/

    async buscarPorId(identificacion) {

        const query = `SELECT * FROM usuarios WHERE identificacion = $1;`;



        try {

            const result = await this.db.query(query, [identificacion]);

            return result.rows[0] || null;

        } catch (err) {

            console.error('❌ Error al buscar usuario por ID:', err.message);

            throw err;

        }

    }

    /**
    
    * Busca un usuario por su correo
    
    */

    async buscarPorCorreo(correo) {

        const query = `SELECT * FROM usuarios WHERE correo = $1;`;



        try {

            const result = await this.db.query(query, [correo]);

            return result.rows[0] || null;

        } catch (err) {

            console.error('❌ Error al buscar usuario por correo:', err.message);

            throw err;

        }

    }

    /**
    
    * Lista todos los usuarios
    
    */

    async listar() {

        const query = `SELECT * FROM usuarios ORDER BY identificacion ASC;`;



        try {

            const result = await this.db.query(query);

            return result.rows;

        } catch (err) {

            console.error('❌ Error al listar usuarios:', err.message);

            throw err;

        }
       } 
    async listarclientes() {
    const query = `
        SELECT * FROM usuarios 
        WHERE rol = 'cliente'
        ORDER BY identificacion ASC;
    `;

    try {
        const result = await this.db.query(query);
        return result.rows;
    } catch (err) {
        console.error('❌ Error al listar clientes:', err.message);
        throw err;
    }
   
   } 
}

module.exports = new CrearClienteModelo();