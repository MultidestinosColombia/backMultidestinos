const express = require('express');
const cors = require('cors');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const bodyParser = require('body-parser'); // Importa body-parser
const connect = require('./database.js');
require('dotenv').config();

const app = express();

// Configura body-parser para aumentar el límite de tamaño de la carga útil
app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));

app.use(cors());

// Importa las rutas
const user = require('./routes/user.js');
const cañoCristal = require('./routes/CañoCristal.js');
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

// Usa las rutas
costosHotel(app);
user(app);
planes(app);
clientes(app);
hotel(app);
cotizacion(app);
transporte(app);
habitacionCotizacion(app);
tiquete(app);
cañoCristal(app);
liquidacion(app);
pasajero(app);
impuestosLiq(app);
impuestosCot(app);
ControlLiquidacion(app);

// Ruta de inicio de sesión
app.post('/', async (req, res) => {
    try {
        const { usuario, contrasena } = req.body;
        console.log("Usuario ingresado:", usuario);
        console.log("Contraseña ingresada:", contrasena);

        const conn = await connect();
        const [rows] = await conn.query('SELECT * FROM usuarios WHERE usuario = ?', [usuario]);
        console.log("Filas obtenidas de la base de datos:", rows);

        if (rows.length > 0) {
            const user = rows[0];
            console.log("Contraseña almacenada en la base de datos:", user.contrasena);

            const match = await bcrypt.compare(contrasena, user.contrasena);
            if (match) {
                console.log("Contraseña correcta.");
                res.status(200).send('Inicio de sesión exitoso');
            } else {
                console.log("Contraseña incorrecta.");
                res.status(400).send('Contraseña incorrecta');
            }
        } else {
            console.log("Usuario no encontrado.");
            res.status(404).send('Usuario no encontrado');
        }
    } catch (error) {
        console.error("Error en el proceso de autenticación:", error);
        res.status(500).send('Error al iniciar sesión');
    }
});

// Inicia el servidor
if (process.env.NODE_ENV !== 'test') {
    const PORT = process.env.PORT || 8010;
    app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
    });
}


module.exports = app;