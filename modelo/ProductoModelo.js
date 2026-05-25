const Conexion = require('./bd/Conexion');

class ProductoModelo {
    constructor() {
        if (ProductoModelo.instance) {
            return ProductoModelo.instance;
        }
        ProductoModelo.instance = this;
        this.conexion = Conexion;
    }

    async obtenerProductos() {
        try {
            const query = 'SELECT * FROM productos';
            const result = await this.conexion.query(query);
            return result.rows;
        } catch (error) {
            console.error('Error al obtener productos:', error);
            throw error;
        }
    }

    async obtenerProductoPorCodigo(codigo) {
        try {
            const query = 'SELECT * FROM productos WHERE codigo = $1';
            const result = await this.conexion.query(query, [codigo]);
            return result.rows[0];
        } catch (error) {
            console.error('Error al obtener producto por codigo:', error);
            throw error;
        }
    }

    async obtenerpornombre(nombre) {
        try {
            const query = 'SELECT * FROM productos WHERE nombre ILIKE $1';
            const result = await this.conexion.query(query, [`%${nombre}%`]);
            return result.rows;
        } catch (error) {
            console.error('Error al obtener producto por nombre:', error);
            throw error;
        }
    }

    async crearProducto(producto) {
        
        try {
            const query = 'INSERT INTO productos (codigo,nombre,descripcion,porciones,precio) VALUES ($1, $2, $3, $4, $5) RETURNING *';
            const values = [producto.codigo, producto.nombre, producto.descripcion, producto.porciones, producto.precio];
            const result = await this.conexion.query(query, values);
            return result.rows[0];
        } catch (error) {
            console.error('Error al crear producto:', error);
            throw error;
        }
    }
    
    async editarProducto(id, producto) {
        try {
            const query = 'UPDATE productos SET codigo = $1, nombre = $2, descripcion = $3, porciones = $4, precio = $5 WHERE idproducto = $6 RETURNING *';
            const values = [producto.codigo, producto.nombre, producto.descripcion, producto.porciones, producto.precio, id];
            const result = await this.conexion.query(query, values);
            return result.rows[0];
        } catch (error) {
            console.error('Error al editar producto:', error);
            throw error;
        }    

    }
    async eliminarProducto(id) {
        try {
            const query = 'DELETE FROM productos WHERE idproducto = $1 RETURNING *';
            const result = await this.conexion.query(query, [id]);
            return result.rows[0];
        } catch (error) {
            console.error('Error al eliminar producto:', error);
        }
}
}

module.exports = new ProductoModelo();
           