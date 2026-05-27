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

async listarPedidos() {

    const query = `
        SELECT 
            p.idpedido,
            p.total,
            p.fecha,
            p.idusuario,
            u.nombres AS cliente_nombre
        FROM pedidos p
        LEFT JOIN usuarios u ON p.idusuario = u.idusuario
        ORDER BY p.idpedido DESC
    `;

    const result = await Conexion.query(query);

    return result.rows;
}

async detallePedido(idpedido) {

    const pedidoQuery = `
        SELECT 
            p.idpedido,
            p.total,
            p.fecha,
            u.nombres AS cliente_nombre
        FROM pedidos p
        JOIN usuarios u ON p.idusuario = u.idusuario
        WHERE p.idpedido = $1
    `;

    const detalleQuery = `
        SELECT 
            producto,
            precio,
            cantidad,
            subtotal
        FROM detalle_pedido
        WHERE idpedido = $1
    `;

    const pedido = await Conexion.query(pedidoQuery, [idpedido]);
    const detalles = await Conexion.query(detalleQuery, [idpedido]);

    return {
        pedido: pedido.rows[0],
        detalles: detalles.rows
    };
}
}

module.exports = new PedidoModelo();