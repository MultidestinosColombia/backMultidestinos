
const express = require("express");
const connect = require('../database');
const bcrypt = require('bcrypt');
const router = express.Router();

// Rutas
router.get("/", getTiquetes);
router.post("/", createTiquete);
router.put("/:id", updateTiquete);
router.delete("/:id", deleteTiquete);
router.get("/buscar/:salida/:destino", getTiquetesPorSalidaDestino);
module.exports = (app) => app.use("/tiquete", router);


// Obtener todos los tiquetes
async function getTiquetes(req, res) {
    const conn = await connect();
    try {
        const [rows] = await conn.query('SELECT * FROM tiquete');
        res.status(200).json(rows);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Error interno del servidor" });
    } finally {
        if (conn) conn.end();
    }
}

// Crear un nuevo tiquete
async function createTiquete(req, res) {
    const conn = await connect();
    try {
        const { salida, pertenece, neta, tasas, iva, total } = req.body;
        const result = await conn.query('INSERT INTO tiquete (salida, pertenece, neta, tasas, iva, total) VALUES (?, ?, ?, ?, ?, ?)', [salida, pertenece, neta, tasas, iva, total]);
        res.status(201).json({ success: "Tiquete creado correctamente", id: result.insertId });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Error al crear el tiquete" });
    } finally {
        if (conn) conn.end();
    }
}

// Actualizar un tiquete existente
async function updateTiquete(req, res) {
    const tiqueteId = parseInt(req.params.id, 10);
    const conn = await connect();
    try {
        const { salida, pertenece, neta, tasas, iva, total } = req.body;
        await conn.query('UPDATE tiquete SET salida = ?, pertenece = ?, neta = ?, tasas = ?, iva = ?, total = ? WHERE id = ?', [salida, pertenece, neta, tasas, iva, total, tiqueteId]);
        res.status(200).json({ success: "Tiquete actualizado correctamente" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Error al actualizar el tiquete" });
    } finally {
        if (conn) conn.end();
    }
}

// Eliminar un tiquete
async function deleteTiquete(req, res) {
    const tiqueteId = parseInt(req.params.id, 10);
    const conn = await connect();
    try {
        await conn.query('DELETE FROM tiquete WHERE id = ?', [tiqueteId]);
        res.status(200).json({ success: "Tiquete eliminado correctamente" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Error al eliminar el tiquete" });
    } finally {
        if (conn) conn.end();
    }
}

// Obtener tiquetes por salida y destino
async function getTiquetesPorSalidaDestino(req, res) {
    const { salida, destino } = req.params;
    const conn = await connect();
    try {
        const [rows] = await conn.query('SELECT * FROM tiquete WHERE salida = ? AND pertenece = ?', [salida, destino]);
        res.status(200).json(rows);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Error interno del servidor" });
    } finally {
        if (conn) conn.end();
    }
}