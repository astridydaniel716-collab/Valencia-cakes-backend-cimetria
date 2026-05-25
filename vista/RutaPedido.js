const express = require('express');

const routes = express.Router();

const pedido = require('../controlador/PedidoControlador');

routes.post('/crear', (req, res) =>
    pedido.crearPedido(req, res)
);

module.exports = routes;