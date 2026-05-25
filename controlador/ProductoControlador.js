const modelo = require('../modelo/ProductoModelo');

class ProductoControlador {
    async obtenerProductos(req, res) {
        //const { t1: id } = req.params;
        try {
            const productos = await modelo.obtenerProductos();
            return res.status(200).json({
                ok: true,
                msg: 'Productos obtenidos correctamente',
                data: productos
            });
        } catch (error) {
            console.error('Error en ProductoControlador.obtenerProductos:', error);
            return res.status(500).json({
                ok: false,
                msg: 'Error interno del servidor al obtener productos'
            });
        }
    }
    async obtenerProductoPorCodigo(req, res) {
        const { codigo } = req.params;
        try {
            const producto = await modelo.obtenerProductoPorCodigo(codigo);
            if (!producto) {
                return res.status(404).json({
                    ok: false,
                    msg: 'Producto no encontrado'
                });
            }
            return res.status(200).json({
                ok: true,
                msg: 'Producto obtenido correctamente',
                data: producto
            });
        } catch (error) {
            console.error('Error en ProductoControlador.obtenerProductoPorCodigo:', error);
            return res.status(500).json({
                ok: false,
                msg: 'Error interno del servidor al obtener producto por codigo'
            });
        }
    }

    async obtenerpornombre(req, res) {
        const { nombre } = req.params;
        try {
            const productos = await modelo.obtenerpornombre(nombre);
            if (!productos) {
                return res.status(404).json({
                    ok: false,
                    msg: 'Producto no encontrado'
                });
            }
            return res.status(200).json({
                ok: true,
                msg: 'Producto obtenido correctamente',
                data: productos
            });
        } catch (error) {
            console.error('Error en ProductoControlador.obtenerpornombre:', error);
            return res.status(500).json({
                ok: false,
                msg: 'Error interno del servidor al obtener producto por nombre'
            });
        }
    }
    
    async crearProducto(req, res) {
        console.log('Datos recibidos:', req.body);
        const producto = req.body; 
        try {
            const nuevoProducto = await modelo.crearProducto(producto);
            return res.status(201).json({
                ok: true,
                msg: 'Producto creado correctamente',
                data: nuevoProducto
            });
        } catch (error) {
            console.error('Error en ProductoControlador.crearProducto:', error);
            return res.status(500).json({
                ok: false,
                msg: 'Error interno del servidor al crear producto'
            });
        }
    }
    async editarProducto(req, res) {
        const { id } = req.params;
        const producto = req.body;

        try {
            const productoEditado = await modelo.editarProducto(id, producto);

            if (!productoEditado) {
                return res.status(404).json({
                    ok: false,
                    msg: 'Producto no encontrado'
                });
            }

            return res.status(200).json({
                ok: true,
                msg: 'Producto editado correctamente',
                data: productoEditado
            });
        } catch (error) {
            console.error('Error en ProductoControlador.editarProducto:', error);
            return res.status(500).json({
                ok: false,
                msg: 'Error interno del servidor al editar producto'
            });
        }
    }

    async eliminarProducto(req, res) {
        const { id } = req.params;

        try {
            const productoEliminado = await modelo.eliminarProducto(id);

            if (!productoEliminado) {
                return res.status(404).json({
                    ok: false,
                    msg: 'Producto no encontrado'
                });
            }

            return res.status(200).json({
                ok: true,
                msg: 'Producto eliminado correctamente',
                data: productoEliminado
            });
        } catch (error) {
            console.error('Error en ProductoControlador.eliminarProducto:', error);
            return res.status(500).json({
                ok: false,
                msg: 'Error interno del servidor al eliminar producto'
            });
        }
    }

}
module.exports = new ProductoControlador();