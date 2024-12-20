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