const express = require('express');
const routes = express.Router();

const admin = require('../controlador/CrearAdminControlador');

const LoginControlador = require('../controlador/LoginControlador');

// LISTAR ADMINS
routes.get('/todos',(req, res) => admin.listar(req, res));

// CREAR ADMIN
routes.post('/crear',(req, res) => admin.crear(req, res));

// LOGIN
routes.post('/login',(req, res) => LoginControlador.login(req, res));

// CREAR usuarios
routes.post('/crear-vendedor',(req, res) => admin.crearVendedor(req, res));
routes.post('/crear-usuario',(req, res) => admin.crear(req, res));

// CAMBIAR ROL
routes.put('/rol/:identificacion',(req, res) => admin.cambiarRol(req, res));

// LISTAR ROLES
routes.get('/usuarios/:rol', (req, res) => admin.listarPorRol(req, res));

// ELIMINAR USUARIO
routes.delete('/usuario/:identificacion', admin.eliminarUsuario);

// EDITAR USUARIO
routes.put('/usuario/:identificacion', admin.actualizarUsuario);
    
module.exports = routes;