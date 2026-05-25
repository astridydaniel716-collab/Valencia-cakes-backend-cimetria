require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();

const crearcliente = require('./vista/RutaCrearCliente'); 
const crearadmin = require('./vista/RutaAdmin');
const crearvendedor = require('./vista/RutaVendedor');
const crearproducto = require('./vista/RutaProducto'); 
const crearPedido = require('./vista/RutaPedido');

// Middlewares
app.use(cors({
    origin: '*', // Cambiar ['http://tu.com', 'http://yo.com'],
    methods: ['GET', 'POST', 'PUT', 'DELETE'], // Métodos permitidos
    allowedHeaders: ['Content-Type', 'Authorization'], // Encabezados permitidos
    credentials: true // Habilita el envío de credenciales si es necesario
  }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Rutas
app.use('/app/usuarios', crearcliente);//localhost:3330/app/
app.use('/app/productos/', crearproducto); //localhost:3330/app/productos/
app.use('/app/pedidos/', crearPedido); //localhost:3330/app/pedidos/

app.use('/modulo/admin', crearadmin);

app.use('/modulo/vendedor', crearvendedor);

// Ruta base o principal
app.get('/', (req, res) => {
    res.send('API de Valencia Cakes funcionando');
});


// Iniciar el servidor
const PORT = process.env.PORT;
app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});