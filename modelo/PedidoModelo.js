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

        // =========================
        // CALCULAR TOTAL
        // =========================

        const total = pedido.detalles.reduce((acc, item) => {

            return acc + Number(item.subtotal);

        }, 0);

        // =========================
        // ACTUALIZAR PEDIDO
        // =========================

        const queryPedido = `
            UPDATE pedidos
            SET
                total = $1,
                estado = $2,
                fecha_entrega = $3,
                hora_entrega = $4,
                abono = $5,
                saldo = $6,
                metodo_entrega = $7,
                direccion = $8,
                observaciones = $9
            WHERE idpedido = $10
            RETURNING *
        `;

        const valuesPedido = [

            total,

            pedido.estado,

            pedido.fecha_entrega,

            pedido.hora_entrega,

            pedido.abono,

            total - Number(pedido.abono || 0),

            pedido.metodo_entrega,

            pedido.direccion,

            pedido.observaciones,

            id

        ];

        const resultPedido =
            await Conexion.query(
                queryPedido,
                valuesPedido
            );

        // =========================
        // ELIMINAR DETALLES VIEJOS
        // =========================

        await Conexion.query(
            `
            DELETE FROM detalle_pedido
            WHERE idpedido = $1
            `,
            [id]
        );

        // =========================
        // INSERTAR NUEVOS DETALLES
        // =========================

        for (const item of pedido.detalles) {

            await Conexion.query(

                `
                INSERT INTO detalle_pedido(

                    idpedido,
                    producto,
                    precio,
                    cantidad,
                    subtotal

                )
                VALUES($1,$2,$3,$4,$5)
                `,

                [

                    id,

                    item.producto,

                    item.precio,

                    item.cantidad,

                    item.subtotal

                ]

            );

        }

        return resultPedido.rows[0];

    } catch (error) {

        console.error(
            'Error al editar pedido:',
            error
        );

        throw error;

    }

}

async crearPedidoManualBase(data) {

    const query = `
        INSERT INTO pedidos(
            total,
            idusuario,
            estado,
            fecha_entrega,
            hora_entrega,
            abono,
            saldo,
            metodo_entrega,
            direccion,
            observaciones
        )
        VALUES(
            0,
            $1,$2,$3,$4,$5,$6,$7,$8,$9
        )
        RETURNING *
    `;

    const values = [
        data.idusuario,
        data.estado || 'pendiente',
        data.fecha_entrega || null,
        data.hora_entrega || null,
        data.abono || 0,
        data.abono || 0, // 👈 saldo inicial igual a abono (temporal)
        data.metodo_entrega || null,
        data.direccion || null,
        data.observaciones || null
    ];

    const result = await Conexion.query(query, values);

    return result.rows[0];
}

async actualizarTotalPedido(idpedido, total, abono = 0) {

    const query = `
        UPDATE pedidos
        SET total = $1,
            saldo = $2
        WHERE idpedido = $3
        RETURNING *
    `;

    const saldo = total - Number(abono || 0);

    const result = await Conexion.query(query, [
        total,
        saldo,
        idpedido
    ]);

    return result.rows[0];
}
}
module.exports = new PedidoModelo();