const modelo = require('../modelo/PedidoModelo');

class PedidoControlador {

    async crearPedido(req, res) {

        try {
            console.log("BODY RECIBIDO:", req.body);
            const { carrito, total, idusuario } = req.body;

            if (!carrito || !total || !idusuario) {
            return res.status(400).json({
                ok: false,
                msg: "Datos incompletos",
                recibido: req.body
            });
        }

            // CREAR PEDIDO
            const pedido = await modelo.crearPedido(total, idusuario);

            // CREAR DETALLES
            for(const item of carrito){

              await modelo.crearDetallePedido({
                idpedido: pedido.idpedido,
                producto: item.nombre,
                precio: item.precio,
                cantidad: item.cantidad,
                subtotal: item.precio * item.cantidad
            });

            }

            return res.status(201).json({
                ok: true,
                msg: 'Pedido guardado correctamente',
                pedido
            });

        } catch (error) {
        console.error("ERROR BACKEND:", error);

        return res.status(500).json({
            ok: false,
            msg: "Error al guardar pedido"
        });
    }

    }


async listarPedidos(req, res) {

    try {

        const pedidos = await modelo.listarPedidos();

        return res.json(pedidos);

    } catch (error) {

        console.error(error);

        return res.status(500).json({
            ok: false,
            msg: "Error al listar pedidos"
        });
    }
}

async detallePedido(req, res) {

    try {

        const { id } = req.params;

        const data = await modelo.detallePedido(id);

        return res.json(data);

    } catch (error) {

        console.error(error);

        return res.status(500).json({
            ok: false,
            msg: "Error al obtener detalle"
        });
    }
}

async editarPedido(req, res) {
        const { id } = req.params;
        const pedido = req.body;

        try {
            const pedidoEditado = await modelo.editarPedido(id, pedido);

            if (!pedidoEditado) {
                return res.status(404).json({
                    ok: false,
                    msg: 'Pedido no encontrado'
                });
            }

            return res.status(200).json({
                ok: true,
                msg: 'Pedido editado correctamente',
                data: pedidoEditado
            });
        } catch (error) {
            console.error('Error en PedidoControlador.editarPedido:', error);
            return res.status(500).json({
                ok: false,
                msg: 'Error interno del servidor al editar pedido'
            });
        }
    }

async eliminarPedido(req, res) {
        const { id } = req.params;

        try {
            const pedidoEliminado = await modelo.eliminarPedido(id);

            if (!pedidoEliminado) {
                return res.status(404).json({
                    ok: false,
                    msg: 'Pedido no encontrado'
                });
            }

            return res.status(200).json({
                ok: true,
                msg: 'Pedido eliminado correctamente',
                data: pedidoEliminado
            });
        } catch (error) {
            console.error('Error en PedidoControlador.eliminarPedido:', error);
            return res.status(500).json({
                ok: false,
                msg: 'Error interno del servidor al eliminar pedido'
            });
        }
    }
}
module.exports = new PedidoControlador();