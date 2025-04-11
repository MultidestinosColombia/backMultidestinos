const express = require("express");
const connect = require('../database');
const router = express.Router();

router.get("/", getcostoshotel);
router.post("/", createCostoHotel);
router.put("/:id", updateCostoHotel);
router.delete("/:id", deleteCostoHotel);
router.get("/:id", getCostoHotelPorId); 
router.post("/buscar", buscarCostoHotel);

module.exports = (app) => app.use("/costoshotel", router); 

async function getcostoshotel(req, res) {
    const conn = await connect();
    try {
        const [rows] = await conn.query('SELECT * FROM costoshotel');
        res.status(200).json(rows);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Error interno del servidor" });
    } finally {
        if (conn) conn.end();
    }
}
//prueba

async function createCostoHotel(req, res) {
    const conn = await connect();
    try {
        // No necesitas generar un ID, la tabla tiene AUTO_INCREMENT
        await conn.query('INSERT INTO costoshotel SET ?', req.body);
        res.status(201).json({ success: "Costo de hotel creado correctamente" }); 
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Error al crear el costo de hotel" });
    } finally {
        if (conn) conn.end();
    }
}

async function updateCostoHotel(req, res) {
    const hotelId = parseInt(req.params.id, 10); 
    const conn = await connect();
    try {
        await conn.query('UPDATE costoshotel SET ? WHERE id = ?', [req.body, hotelId]);
        res.status(200).json({ success: "Costo de hotel actualizado correctamente" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Error al actualizar el costo de hotel" });
    } finally {
        if (conn) conn.end();
    }
}

async function deleteCostoHotel(req, res) {
    const hotelId = parseInt(req.params.id, 10);
    const conn = await connect();
    try {
        await conn.query('DELETE FROM costoshotel WHERE id = ?', [hotelId]);
        res.status(200).json({ success: "Costo de hotel eliminado correctamente" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Error al eliminar el costo de hotel" });
    } finally {
        if (conn) conn.end();
    }
}


async function buscarCostoHotel(req, res) {
    const { pertenece, destino, nombrePrograma, hotel, noches, tipoHabitacion } = req.body;
    
    console.log("🟡 Body recibido:", req.body);
  
    const conn = await connect();
    try {
      let query = 'SELECT * FROM costoshotel WHERE 1=1';
      let queryParams = [];
  
      if (pertenece) {
        query += ' AND pertenece = ?';
        queryParams.push(pertenece);
      }
      if (destino) {
        query += ' AND destino = ?';
        queryParams.push(destino);
      }
      if (nombrePrograma) {
        query += ' AND nombrePrograma = ?';
        queryParams.push(nombrePrograma);
      }
      if (hotel) {
        query += ' AND hotel = ?';
        queryParams.push(hotel);
      }
      if (noches) {
        query += ' AND noches = ?';
        queryParams.push(noches);
      }
      if (tipoHabitacion) {
        query += ' AND tipoHabitacion = ?';
        queryParams.push(tipoHabitacion);
      }
  
      console.log("🟢 Query:", query);
      console.log("🟢 Params:", queryParams);
  
      const [rows] = await conn.query(query, queryParams);
      res.status(200).json(rows);
    } catch (error) {
      console.error("❌ Error ejecutando consulta:", error); // 👈 Esto te mostrará el problema exacto
      res.status(500).json({ error: "Error interno del servidor" });
    } finally {
      if (conn) conn.end();
    }
  }
  


async function getCostoHotelPorId(req, res) {
    const hotelId = parseInt(req.params.id, 10); 

    const conn = await connect();
    try {
        const [rows] = await conn.query('SELECT * FROM costoshotel WHERE id = ?', [hotelId]);
        res.status(200).json(rows);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Error interno del servidor" });
    } finally {
        if (conn) conn.end();
    }
}
