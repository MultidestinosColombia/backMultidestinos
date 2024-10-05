const express = require("express");
const connect = require('../database');
const router = express.Router();

router.get("/", getImpuestosLiq);
router.post("/", createImpuestosLiq);
router.put("/:id", updateImpuestosLiq);
router.delete("/:id", deleteImpuestosLiq);

module.exports = (app) => app.use("/impuestosliq", router);

async function getImpuestosLiq(req, res) {
    const conn = await connect();
    try {
        const [rows] = await conn.query('SELECT * FROM impuestosLiq');
        res.status(200).json(rows);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Error interno del servidor" });
    } finally {
        if (conn) conn.end();
    }
}

async function createImpuestosLiq(req, res) {
    const conn = await connect();
    try {
        await conn.query('INSERT INTO impuestosLiq SET ?', req.body);
        res.status(201).json({ success: "ImpuestosLiq creado correctamente" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Error al crear ImpuestosLiq" });
    } finally {
        if (conn) conn.end();
    }
}

async function updateImpuestosLiq(req, res) {
    const impuestosLiqId = parseInt(req.params.id, 10);
    const conn = await connect();
    try {
        await conn.query('UPDATE impuestosLiq SET ? WHERE id = ?', [req.body, impuestosLiqId]);
        res.status(200).json({ success: "ImpuestosLiq actualizado correctamente" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Error al actualizar ImpuestosLiq" });
    } finally {
        if (conn) conn.end();
    }
}

async function deleteImpuestosLiq(req, res) {
    const impuestosLiqId = parseInt(req.params.id, 10);
    const conn = await connect();
    try {
        await conn.query('DELETE FROM impuestosLiq WHERE id = ?', [impuestosLiqId]);
        res.status(200).json({ success: "ImpuestosLiq eliminado correctamente" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Error al eliminar ImpuestosLiq" });
    } finally {
        if (conn) conn.end();
    }
}