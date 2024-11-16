const express = require("express");
const connect = require('../database');
const router = express.Router();

router.get("/", getImpuestoCot);
router.post("/", createImpuestoCot);
router.put("/:id", updateImpuestoCot);
router.delete("/:id", deleteImpuestoCot);
router.get("/:idCotizacion", getImpuestoCotporId);
module.exports = (app) => app.use("/ImpuestoCot", router);

async function getImpuestoCot(req, res) {
    const conn = await connect();
    try {
        const [rows] = await conn.query('SELECT * FROM impuestos_cotizacion');
        res.status(200).json(rows);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Error interno del servidor" });
    } finally {
        if (conn) conn.end();
    }
}

async function createImpuestoCot(req, res) {
    const conn = await connect();
    try {
        const result = await conn.query('INSERT INTO impuestos_cotizacion SET ?', req.body);
        res.status(201).json({ success: "impuesto de cotización creado correctamente", id: result.insertId });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Error al crear la habitación de cotización" });
    } finally {
        if (conn) conn.end();
    }
}

async function updateImpuestoCot(req, res) {
    const habitacionId = parseInt(req.params.id, 10);
    const conn = await connect();
    try {
        await conn.query('UPDATE impuestos_cotizacion SET ? WHERE id = ?', [req.body, habitacionId]);
        res.status(200).json({ success: "impuesto de cotización actualizada correctamente" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Error al actualizar el impuesto de cotización" });
    } finally {
        if (conn) conn.end();
    }
}

async function deleteImpuestoCot(req, res) {
    const habitacionId = parseInt(req.params.id, 10);
    const conn = await connect();
    try {
        await conn.query('DELETE FROM impuestos_cotizacion WHERE id = ?', [habitacionId]);
        res.status(200).json({ success: "impuesto de cotización eliminada correctamente" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Error al eliminar el impuesto de cotización" });
    } finally {
        if (conn) conn.end();
    }
}
async function getImpuestoCotporId(req, res) {
    const { idCotizacion } = req.params;

    const conn = await connect();
    try {
        const [rows] = await conn.query('SELECT * FROM impuestos_cotizacion WHERE idCotizacion = ?', [idCotizacion]);
        res.status(200).json(rows);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Error interno del servidor" });
    } finally {
        if (conn) conn.end();
    }
}
