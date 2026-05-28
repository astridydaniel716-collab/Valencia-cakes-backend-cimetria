const express = require('express');

const routes = express.Router();

const pedido = require('../controlador/PedidoControlador');

routes.post('/crear', (req, res) => pedido.crearPedido(req, res));

routes.get('/pedidos', (req, res) => pedido.listarPedidos(req, res));

routes.get('/:id', (req, res) => pedido.detallePedido(req, res));

routes.put('/editar/:id', (req, res) => pedido.editarPedido(req, res));

routes.delete('/eliminar/:id', (req, res) => pedido.eliminarPedido(req, res));

routes.post('/manual', (req, res) => pedido.crearPedidoManual(req, res));

module.exports = routes;