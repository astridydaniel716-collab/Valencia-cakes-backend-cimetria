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

}

module.exports = new PedidoControlador();