const express = require('express');
const routes = express.Router();

// Importamos los controladores
const cliente = require('../controlador/CrearClienteControlador');
const LoginControlador = require('../controlador/LoginControlador');

// RUTAS
// Usamos funciones de flecha (req, res) => ... para evitar errores de 'this'
routes.get('/todos', (req, res) => cliente.listar(req, res));
routes.get('/clientes', (req, res) => cliente.listarclientes(req, res));
routes.get('/:identificacion', (req, res) => cliente.buscarPorIdentificacion(req, res)
);
routes.get('/correo/:correo', (req, res) => cliente.buscarPorCorreo(req, res)
);
routes.post('/crear', (req, res) => cliente.crear(req, res));

routes.post('/login', (req, res) => LoginControlador.login(req, res));


module.exports = routes;