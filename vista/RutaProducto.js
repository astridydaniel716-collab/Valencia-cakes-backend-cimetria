const express = require('express');
const routes = express.Router();

const prod = require('../controlador/ProductoControlador');

routes.get('/todos', (req, res) => prod.obtenerProductos(req, res));
routes.get('/:codigo', (req, res) => prod.obtenerProductoPorCodigo(req, res));
routes.get('/nombre/:producto', (req, res) => prod.obtenerpornombre(req, res));
routes.post('/crear', (req, res) => prod.crearProducto(req, res));
routes.put('/editar/:id', (req, res) => prod.editarProducto(req, res));
routes.delete('/eliminar/:id', (req, res) => prod.eliminarProducto(req, res));

module.exports = routes;