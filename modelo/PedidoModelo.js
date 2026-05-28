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


async eliminarPedido(id) {
        try {
            const query = 'DELETE FROM pedidos WHERE idpedido = $1 RETURNING *';
            const result = await Conexion.query(query, [id]);
            return result.rows[0];
        } catch (error) {
            console.error('Error al eliminar pedido:', error);
        }
}

async editarPedido(id, pedido) {
        try {
            const query = 'UPDATE pedidos SET estado = $1, fecha_entrega = $2, hora_entrega = $3, abono = $4, metodo_entrega = $5, direccion = $6, observaciones = $7  WHERE idpedido = $8 RETURNING *';
            const values = [pedido.estado, pedido.fecha_entrega, pedido.hora_entrega, pedido.abono, pedido.metodo_entrega, pedido.direccion, pedido.observaciones, id];
            const result = await Conexion.query(query, values);
            return result.rows[0];
        } catch (error) {
            console.error('Error al editar producto:', error);
            throw error;
        }    

    }
}
module.exports = new PedidoModelo();