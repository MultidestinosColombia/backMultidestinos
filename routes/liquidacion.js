const express = require("express");
const connect = require('../database');
const router = express.Router();

router.get("/", getLiquidaciones);
router.post("/", createLiquidacion);
router.put("/:id", updateLiquidacion);
router.delete("/:id", deleteLiquidacion);
router.get("/:idLiquidacion", getLiquidacionPorId); 

module.exports = (app) => app.use("/liquidacion", router);

async function getLiquidaciones(req, res) {
    const conn = await connect();
    try {
        const [rows] = await conn.query('SELECT * FROM liquidacion');
        res.status(200).json(rows);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Error interno del servidor" });
    } finally {
        if (conn) conn.end();
    }
}

async function createLiquidacion(req, res) {
    const conn = await connect();
    try {
        // Iniciar una transacción (opcional, pero recomendado para mantener la integridad de los datos)
        await conn.beginTransaction();

        // Obtener y actualizar el último valor de la secuencia (si usas una secuencia para generar IDs)
        const [result] = await conn.query(
            'UPDATE secuencia_liquidacion SET ultimo_valor = LAST_INSERT_ID(ultimo_valor + 1)'
        );
        const nextId = result.insertId;

        // Construir el idLiquidacion
        const idLiquidacion = `LIQ-${nextId}`;

        // Agregar el idLiquidacion a los datos de la liquidación
        req.body.idLiquidacion = idLiquidacion;

        // Insertar la liquidación
        await conn.query('INSERT INTO liquidacion SET ?', req.body);

        // Confirmar la transacción (si se inició una)
        await conn.commit();

        res.status(201).json({
            success: "Liquidación creada correctamente",
            idLiquidacion: idLiquidacion
        });
    } catch (error) {
        // Revertir la transacción en caso de error (si se inició una)
        await conn.rollback();
        console.error(error);
        res.status(500).json({ error: "Error al crear la liquidación" });
    } finally {
        if (conn) conn.end();
    }
}

async function updateLiquidacion(req, res) {
    const liquidacionId = parseInt(req.params.id.replace('LIQ-', ''), 10);
    const conn = await connect();
    try {
        await conn.query('UPDATE liquidacion SET ? WHERE idLiquidacion  = ?', [req.body, liquidacionId]);
        res.status(200).json({ success: "Liquidación actualizada correctamente" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Error al actualizar la liquidación" });
    } finally {
        if (conn) conn.end();
    }
}

async function deleteLiquidacion(req, res) {
    const liquidacionId = parseInt(req.params.id, 10); 
    const conn = await connect();
    try {
        await conn.query('DELETE FROM liquidacion WHERE id = ?', [liquidacionId]);
        res.status(200).json({ success: "Liquidación eliminada correctamente" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Error al eliminar la liquidación" });
    } finally {
        if (conn) conn.end();
    }
}

async function getLiquidacionPorId(req, res) {
    const { idLiquidacion } = req.params;

    const conn = await connect();
    try {
        const [rows] = await conn.query('SELECT * FROM liquidacion WHERE idLiquidacion = ?', [idLiquidacion]);
        res.status(200).json(rows);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Error interno del servidor" });
    } finally {
        if (conn) conn.end();
    }
}