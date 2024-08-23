const express = require("express");
const connect = require('../database');
const router = express.Router();

router.get("/", getPasajeros);
router.post("/", createPasajero);
router.put("/:id", updatePasajero);
router.delete("/:id", deletePasajero);
router.get("/:idLiquidacion", getPasajerosPorIdLiquidacion); 

module.exports = (app) => app.use("/pasajero", router);

async function getPasajeros(req, res) {
    const conn = await connect();
    try {
        const [rows] = await conn.query('SELECT * FROM pasajero'); 
        res.status(200).json(rows);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Error interno del servidor" });
    } finally {
        if (conn) conn.end();
    }
}

async function createPasajero(req, res) {
    const conn = await connect();
    try {
        await conn.query('INSERT INTO pasajero SET ?', req.body);
        res.status(201).json({ success: "Pasajero creado correctamente" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Error al crear el pasajero" });
    } finally {
        if (conn) conn.end();
    }
}

async function updatePasajero(req, res) {
    const pasajeroId = parseInt(req.params.id, 10);
    const conn = await connect();
    try {
        await conn.query('UPDATE pasajero SET ? WHERE id = ?', [req.body, pasajeroId]);
        res.status(200).json({ success: "Pasajero actualizado correctamente" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Error al actualizar el pasajero" });
    } finally {
        if (conn) conn.end();
    }
}

async function deletePasajero(req, res) {
    const pasajeroId = parseInt(req.params.id, 10);
    const conn = await connect();
    try {
        await conn.query('DELETE FROM pasajero WHERE id = ?', [pasajeroId]);
        res.status(200).json({ success: "Pasajero eliminado correctamente" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Error al eliminar el pasajero" });
    } finally {
        if (conn) conn.end();
    }
}

async function getPasajerosPorIdLiquidacion(req, res) {
    const { idLiquidacion } = req.params;

    const conn = await connect();
    try {
        const [rows] = await conn.query('SELECT * FROM pasajero WHERE idLiquidacion = ?', [idLiquidacion]);
        res.status(200).json(rows);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Error interno del servidor" });
    } finally {
        if (conn) conn.end();
    }
}