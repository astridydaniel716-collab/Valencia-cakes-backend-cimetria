const express = require('express');
const routes = express.Router();

// Importamos los controladores
const vendedor = require('../controlador/CrearVendedorControlador');

const LoginControlador = require('../controlador/LoginControlador');

// RUTAS
// Usamos funciones de flecha (req, res) => ... para evitar errores de 'this'
routes.get('/todos', (req, res) => vendedor.listar(req, res));

routes.post('/crear', (req, res) => vendedor.crear(req, res));

routes.post('/login', (req, res) => LoginControlador.login(req, res));


module.exports = routes;