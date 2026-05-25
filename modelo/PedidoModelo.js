const Conexion = require('./bd/Conexion');

class PedidoModelo {

    async crearPedido(total, idusuario) {

        const query = `
            INSERT INTO pedidos(total, idusuario)
            VALUES($1, $2)
            RETURNING *
        `;

        const result = await Conexion.query(query, [total, idusuario]);

        return result.rows[0];
    }

    async crearDetallePedido(detalle) {

    const query = `
        INSERT INTO detalle_pedido
        (
            idpedido,
            producto,
            precio,
            cantidad,
            subtotal
        )
        VALUES($1, $2, $3, $4, $5)
    `;

    const values = [
        detalle.idpedido,
        detalle.producto,
        detalle.precio,
        detalle.cantidad,
        detalle.subtotal
    ];

    await Conexion.query(query, values);
}

}

module.exports = new PedidoModelo();