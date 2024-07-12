const express = require("express");
const connect = require('../database');
const router = express.Router();

router.get("/", getHabitacionesCotizacion);
router.post("/", createHabitacionCotizacion);
router.put("/:id", updateHabitacionCotizacion);
router.delete("/:id", deleteHabitacionCotizacion);
router.get("/:idCotizacion", getHabitacionesPorIdCotizacion);
module.exports = (app) => app.use("/habitacionCotizacion", router);

async function getHabitacionesCotizacion(req, res) {
    const conn = await connect();
    try {
        const [rows] = await conn.query('SELECT * FROM habitacionescotizacion');
        res.status(200).json(rows);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Error interno del servidor" });
    } finally {
        if (conn) conn.end();
    }
}

async function createHabitacionCotizacion(req, res) {
    const conn = await connect();
    try {
        const result = await conn.query('INSERT INTO habitacionescotizacion SET ?', req.body);
        res.status(201).json({ success: "Habitación de cotización creada correctamente", id: result.insertId });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Error al crear la habitación de cotización" });
    } finally {
        if (conn) conn.end();
    }
}

async function updateHabitacionCotizacion(req, res) {
    const habitacionId = parseInt(req.params.id, 10);
    const conn = await connect();
    try {
        await conn.query('UPDATE habitacionescotizacion SET ? WHERE id = ?', [req.body, habitacionId]);
        res.status(200).json({ success: "Habitación de cotización actualizada correctamente" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Error al actualizar la habitación de cotización" });
    } finally {
        if (conn) conn.end();
    }
}

async function deleteHabitacionCotizacion(req, res) {
    const habitacionId = parseInt(req.params.id, 10);
    const conn = await connect();
    try {
        await conn.query('DELETE FROM habitacionescotizacion WHERE id = ?', [habitacionId]);
        res.status(200).json({ success: "Habitación de cotización eliminada correctamente" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Error al eliminar la habitación de cotización" });
    } finally {
        if (conn) conn.end();
    }
}
async function getHabitacionesPorIdCotizacion(req, res) {
    const { idCotizacion } = req.params;

    const conn = await connect();
    try {
        const [rows] = await conn.query('SELECT * FROM habitacionescotizacion WHERE idCotizacion = ?', [idCotizacion]);
        res.status(200).json(rows);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Error interno del servidor" });
    } finally {
        if (conn) conn.end();
    }
}
