const express = require("express");
const connect = require('../database');
const router = express.Router();

router.get("/", getHoteles);
router.post("/", createHotel);
router.put("/:id", updateHotel);
router.delete("/:id", deleteHotel);
router.post("/buscar", buscarHotelesPorProgramaDestinoYHotel);
router.post("/buscarT", buscarHotelesPorProgramaDestinoYHotelYhabitacion);
router.post("/buscarN", buscarHotelesPorProgramaDestinoYHotelYNoche);
router.post("/buscarH", buscarProgramasPorHotel);

router.post('/temporadas', obtenerTemporadas);

module.exports = (app) => app.use("/hoteles", router);

async function obtenerTemporadas(req, res) {
    const { fechaInicio, fechaFin } = req.body;
    const conn = await connect();
  
    try {
      const [resultados] = await conn.query(
        "SELECT DISTINCT p.nombrePrograma FROM hoteles h JOIN planes p ON h.hotel = p.hotel AND h.nombrePrograma = p.nombrePrograma WHERE (h.FechaInicio <= ?) AND (h.FechaFin >= ?)",
        [fechaFin, fechaInicio]
      );
  
      const nombresProgramasUnicos = [...new Set(resultados.map(r => r.nombrePrograma))];
  
      res.status(200).json(nombresProgramasUnicos);
    } catch (error) {
      console.error("Error al obtener temporadas:", error);
      res.status(500).json({ error: "Error interno del servidor" });
    } finally {
      if (conn) conn.end();
    }
  }
  
async function getHoteles(req, res) {
    const conn = await connect();
    try {
        const [rows] = await conn.query('SELECT * FROM hoteles');
        res.status(200).json(rows);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Error interno del servidor" });
    } finally {
        if (conn) conn.end();
    }
}



async function createHotel(req, res) {
    const { 
        pertenece, 
        destino, 
        nombrePrograma, 
        hotel, 
        plan, 
        noches, 
        tipoHabitacion, 
        sencilla, 
        doble, 
        triple, 
        cuadruple, 
        quintuple, 
        sextuple, 
        niño, 
        nocheAdicionalsencilla, 
        nocheAdicionaldoble, 
        nocheAdicionaltriple, 
        nocheAdicionalcuadruple, 
        nocheAdicionalniño, 
        incluye, 
        noIncluye, 
        FechaInicio, 
        FechaFin 
    } = req.body;

    const conn = await connect();
    try {
        await conn.query(
            'INSERT INTO hoteles (pertenece, destino, nombrePrograma, hotel, plan, noches, tipoHabitacion, sencilla, doble, triple, cuadruple, quintuple, sextuple, niño, nocheAdicionalsencilla, nocheAdicionaldoble, nocheAdicionaltriple, nocheAdicionalcuadruple, nocheAdicionalniño, incluye, noIncluye, FechaInicio, FechaFin) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
            [pertenece, destino, nombrePrograma, hotel, plan, noches, tipoHabitacion, sencilla, doble, triple, cuadruple, quintuple, sextuple, niño, nocheAdicionalsencilla, nocheAdicionaldoble, nocheAdicionaltriple, nocheAdicionalcuadruple, nocheAdicionalniño, incluye, noIncluye, FechaInicio, FechaFin]
        );
        res.status(201).json({ success: "Hotel creado correctamente" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Error al crear el hotel" });
    } finally {
        if (conn) conn.end();
    }
}

async function updateHotel(req, res) {
    const hotelId = parseInt(req.params.id, 10);
    const { 
        pertenece, 
        destino, 
        nombrePrograma, 
        hotel, 
        plan, 
        noches, 
        tipoHabitacion, 
        sencilla, 
        doble, 
        triple, 
        cuadruple, 
        quintuple, 
        sextuple, 
        niño, 
        nocheAdicionalsencilla, 
        nocheAdicionaldoble, 
        nocheAdicionaltriple, 
        nocheAdicionalcuadruple, 
        nocheAdicionalniño, 
        incluye, 
        noIncluye, 
        FechaInicio, 
        FechaFin 
    } = req.body;

    const conn = await connect();
    try {
        await conn.query(
            'UPDATE hoteles SET pertenece = ?, destino = ?, nombrePrograma = ?, hotel = ?, plan = ?, noches = ?, tipoHabitacion = ?, sencilla = ?, doble = ?, triple = ?, cuadruple = ?, quintuple = ?, sextuple = ?, niño = ?, nocheAdicionalsencilla = ?, nocheAdicionaldoble = ?, nocheAdicionaltriple = ?, nocheAdicionalcuadruple = ?, nocheAdicionalniño = ?, incluye = ?, noIncluye = ?, FechaInicio = ?, FechaFin = ? WHERE id = ?',
            [pertenece, destino, nombrePrograma, hotel, plan, noches, tipoHabitacion, sencilla, doble, triple, cuadruple, quintuple, sextuple, niño, nocheAdicionalsencilla, nocheAdicionaldoble, nocheAdicionaltriple, nocheAdicionalcuadruple, nocheAdicionalniño, incluye, noIncluye, FechaInicio, FechaFin, hotelId]
        );
        res.status(200).json({ success: "Hotel actualizado correctamente" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Error al actualizar el hotel" });
    } finally {
        if (conn) conn.end();
    }
}

async function deleteHotel(req, res) {
    const hotelId = parseInt(req.params.id, 10);
    const conn = await connect();
    try {
        await conn.query('DELETE FROM hoteles WHERE id = ?', [hotelId]);
        res.status(200).json({ success: "Hotel eliminado correctamente" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Error al eliminar el hotel" });
    } finally {
        if (conn) conn.end();
    }
}

async function buscarHotelesPorProgramaDestinoYHotel(req, res) {
    const { hotel, nombrePrograma, destino } = req.body; // Obtener los parámetros del cuerpo de la solicitud
    const conn = await connect();
    try {
        // Realizar la búsqueda en la base de datos usando los parámetros recibidos
        const [rows] = await conn.query('SELECT * FROM hoteles WHERE nombrePrograma = ? AND destino = ? AND hotel = ?', [nombrePrograma, destino, hotel]);
        // Devolver los resultados de la búsqueda como respuesta
        res.status(200).json(rows);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Error al buscar hoteles" });
    } finally {
        if (conn) conn.end();
    }
}
async function buscarHotelesPorProgramaDestinoYHotelYNoche(req, res) {
    const {  pertenece,hotel, nombrePrograma, destino, noches } = req.body; // Obtener los parámetros del cuerpo de la solicitud
    const conn = await connect();
    try {
        // Realizar la búsqueda en la base de datos usando los parámetros recibidos
        const [rows] = await conn.query('SELECT * FROM hoteles WHERE nombrePrograma = ? AND destino = ? AND hotel = ? AND noches = ? AND pertenece = ?', [nombrePrograma, destino, hotel, noches, pertenece]);
        // Devolver los resultados de la búsqueda como respuesta
        res.status(200).json(rows);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Error al buscar hoteles" });
    } finally {
        if (conn) conn.end();
    }
}
async function buscarHotelesPorProgramaDestinoYHotelYhabitacion(req, res) {
    const { pertenece, hotel, nombrePrograma, destino, tipoHabitacion,noches} = req.body; // Obtener los parámetros del cuerpo de la solicitud
    const conn = await connect();
    try {
        // Realizar la búsqueda en la base de datos usando los parámetros recibidos
        const [rows] = await conn.query('SELECT * FROM hoteles WHERE nombrePrograma = ? AND destino = ? AND hotel = ? AND tipoHabitacion = ? AND pertenece = ? AND noches = ?', [nombrePrograma, destino, hotel, tipoHabitacion,pertenece, noches]);
        // Devolver los resultados de la búsqueda como respuesta
        res.status(200).json(rows);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Error al buscar hoteles" });
    } finally {
        if (conn) conn.end();
    }
}
async function buscarProgramasPorHotel(req, res) {
    console.log("Recibida petición:", req.body); 
    const { pertenece, hotel, destino, noches } = req.body;
  
    const conn = await connect();
  
    try {
      // Imprime la consulta SQL con los valores de los parámetros
      const query = 'SELECT * FROM hoteles WHERE hotel = ? AND destino = ? AND noches = ? AND pertenece = ?';
      const values = [hotel, destino, noches, pertenece];
      console.log("Consulta SQL:", query, values); 
  
      const [rows] = await conn.query(query, values);
  
      console.log("Resultados de la consulta:", rows); // Imprime los resultados
      res.status(200).json(rows);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Error al buscar programas" });
    } finally {
      if (conn) conn.end();
    }
  }


  //---------------------------------------------------------------- actualizar datos ---------------------------------------------------------------------------//
// Endpoint para actualizar hoteles existentes
    router.put('/actualizar/:id', async (req, res) => {
        const hotelId = parseInt(req.params.id, 10);
        const datosActualizacion = req.body;

        if (!datosActualizacion || Object.keys(datosActualizacion).length === 0) {
            return res.status(400).json({ mensaje: "Datos de actualización no proporcionados" });
        }

        // Verificar conexión
        const conn = await connect();
        if (!conn) {
            return res.status(500).json({ mensaje: "Error de conexión a la base de datos" });
        }

        try {
            const campos = Object.keys(datosActualizacion).map(campo => `${campo} = ?`).join(', ');
            const valores = [...Object.values(datosActualizacion), hotelId];

            const consultaSQL = `UPDATE hoteles SET ${campos} WHERE id = ?`;
            console.log(consultaSQL, valores); // Imprime la consulta SQL para depuración

            const [result] = await conn.query(consultaSQL, valores);

            if (result.affectedRows === 0) {
                return res.status(404).json({ mensaje: `Hotel con id ${hotelId} no encontrado` });
            }

            res.status(200).json({ mensaje: "Hotel actualizado correctamente" });
        } catch (error) {
            console.error("Error al procesar la solicitud: ", error);
            res.status(500).json({
                mensaje: "Error al actualizar el hotel",
                error: error.message,
                stack: error.stack
            });
        } finally {
            if (conn) conn.end();
        }
    });


// Función para convertir fechas a formato YYYY-MM-DD
function formatDate(dateString) {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
}

// Función para convertir fechas a formato YYYY-MM-DD
function formatDate(dateString) {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
}

router.post('/procesar-lote', async (req, res) => {
    const { hoteles } = req.body;
    let conn = null;

    if (!hoteles || !Array.isArray(hoteles)) {
        return res.status(400).json({ mensaje: "Datos no válidos. Se espera un arreglo de hoteles." });
    }

    try {
        conn = await connect();
        await conn.beginTransaction();

        const batchSize = 100; // Tamaño del lote
        const totalLotes = Math.ceil(hoteles.length / batchSize);
        let updatedCount = 0;
        let createdCount = 0;

        for (let i = 0; i < totalLotes; i++) {
            const lote = hoteles.slice(i * batchSize, (i + 1) * batchSize);
            const promises = lote.map(async (hotel) => {
                const hotelProcessed = {
                    ...hotel,
                    sencilla: Number(hotel.sencilla) || "",
                    doble: Number(hotel.doble) || "",
                    triple: Number(hotel.triple) || "",
                    cuadruple: Number(hotel.cuadruple) || "",
                    quintuple: Number(hotel.quintuple) || "",
                    sextuple: Number(hotel.sextuple) || "",
                    niño: Number(hotel.niño) || "",
                    nocheAdicionalsencilla: Number(hotel.nocheAdicionalsencilla) || "",
                    nocheAdicionaldoble: Number(hotel.nocheAdicionaldoble) || "",
                    nocheAdicionaltriple: Number(hotel.nocheAdicionaltriple) || "",
                    nocheAdicionalcuadruple: Number(hotel.nocheAdicionalcuadruple) || "",
                    nocheAdicionalniño: Number(hotel.nocheAdicionalniño) || "",
                    FechaInicio: hotel.FechaInicio ? formatDate(hotel.FechaInicio) : null,
                    FechaFin: hotel.FechaFin ? formatDate(hotel.FechaFin) : null
                };

                if (hotel.id) {
                    const [existingHotelRows] = await conn.query('SELECT * FROM hoteles WHERE id = ?', [hotel.id]);
                    const existingHotel = existingHotelRows[0];

                    if (existingHotel) {
                        await conn.query('UPDATE hoteles SET ? WHERE id = ?', [hotelProcessed, hotel.id]);
                        updatedCount++;
                    } else {
                        const { id, ...hotelData } = hotelProcessed;
                        await conn.query('INSERT INTO hoteles SET ?', [hotelData]);
                        createdCount++;
                    }
                } else {
                    const { id, ...hotelData } = hotelProcessed;
                    await conn.query('INSERT INTO hoteles SET ?', [hotelData]);
                    createdCount++;
                }
            });

            await Promise.all(promises); // Esperar a que todos los hoteles del lote sean procesados
        }

        await conn.commit();

        const totalProcesados = updatedCount + createdCount;
        const porcentajeActualizacion = totalProcesados > 0 ? (updatedCount / totalProcesados) * 100 : 0;

        res.status(200).json({
            success: true,
            mensaje: `Se han procesado ${hoteles.length} hoteles: ${updatedCount} actualizados y ${createdCount} creados.`,
            updatedCount,
            createdCount,
            porcentajeActualizacion: porcentajeActualizacion.toFixed(2) // Redondear a dos decimales
        });

    } catch (error) {
        if (conn) {
            await conn.rollback();
        }

        console.error('Error al procesar lote de hoteles:', error);

        res.status(500).json({
            success: false,
            mensaje: "Error al procesar los hoteles",
            error: error.message,
            detalles: process.env.NODE_ENV === 'development' ? error.stack : undefined
        });

    } finally {
        if (conn) {
            try {
                await conn.end();
            } catch (err) {
                console.error('Error al cerrar la conexión:', err);
            }
        }
    }
});
