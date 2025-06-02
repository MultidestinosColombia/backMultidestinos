const express = require('express');
const cors = require('cors');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const bodyParser = require('body-parser');
const connect = require('./database.js');
require('dotenv').config();

const app = express();

// Middlewares
app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));
app.use("/uploads", express.static("uploads"));
app.use(cors());

// Rutas
const user = require('./routes/user.js');
const canoCristal = require('./routes/CanoCristal.js');
const habitacionCotizacion = require('./routes/habitacionCotizacion.js');
const planes = require('./routes/planes.js');
const tiquete = require('./routes/tiquete.js');
const clientes = require('./routes/clientes.js');
const hotel = require('./routes/hotel.js');
const cotizacion = require('./routes/cotizacion.js');
const transporte = require('./routes/transporte.js');
const liquidacion = require('./routes/liquidacion.js');
const pasajero = require('./routes/pasajero.js');
const impuestosLiq = require('./routes/impuestosLiq.js');
const impuestosCot = require('./routes/impuestos_cot.js');
const costosHotel = require('./routes/costosHotel.js');
const ControlLiquidacion = require('./routes/ControlLiquidacion.js');
const Liquidacion_Costos = require('./routes/Liquidacion_Costos.js'); // Renombrado
const Home = require('./routes/Home.js');

// Usar rutas
costosHotel(app);
Home(app);
user(app);
planes(app);
clientes(app);
hotel(app);
cotizacion(app);
transporte(app);
habitacionCotizacion(app);
tiquete(app);
canoCristal(app);
liquidacion(app);
pasajero(app);
impuestosLiq(app);
impuestosCot(app);
ControlLiquidacion(app);
Liquidacion_Costos(app); // Agregado correctamente

// Login
app.post('/', async (req, res) => {
    try {
        const { usuario, contrasena } = req.body;
        const conn = await connect();
        const [rows] = await conn.query('SELECT * FROM usuarios WHERE usuario = ?', [usuario]);

        if (rows.length > 0) {
            const user = rows[0];
            const match = await bcrypt.compare(contrasena, user.contrasena);
            if (match) {
                res.status(200).send('Inicio de sesión exitoso');
            } else {
                res.status(400).send('Contraseña incorrecta');
            }
        } else {
            res.status(404).send('Usuario no encontrado');
        }
    } catch (error) {
        console.error("Error en el proceso de autenticación:", error);
        res.status(500).send('Error al iniciar sesión');
    }
});

// Iniciar servidor
if (process.env.NODE_ENV !== 'test') {
    const PORT = process.env.PORT || 8010;
    app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
    });
}

module.exports = app;
