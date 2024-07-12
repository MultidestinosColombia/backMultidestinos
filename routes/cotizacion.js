const express = require("express");
const connect = require('../database');
const router = express.Router();

router.get("/", getCotizaciones);
router.post("/", createCotizacion);
router.post("/c", createCotizacionC);
router.put("/:id", updateCotizacion);
router.delete("/:id", deleteCotizacion);
router.get("/:idCotizacion", getCotizacionesPorIdCotizacion);
module.exports = (app) => app.use("/cotizacion", router);
async function getCotizaciones(req, res) {
    const conn = await connect();
    try {
        const [rows] = await conn.query('SELECT * FROM cotizacion');
        res.status(200).json(rows);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Error interno del servidor" });
    } finally {
        if (conn) conn.end();
    }
}
async function createCotizacionC(req, res) {
    const conn = await connect();
    try {
        await conn.beginTransaction();

        // Obtener y actualizar la secuencia para "COT-C"
        const [resultCotC] = await conn.query(
            'UPDATE secuencia_cotizacion_c SET ultimo_valor = LAST_INSERT_ID(ultimo_valor + 1)'
        );
        const nextIdCotC = resultCotC.insertId;
        const idCotizacion = `COT-C${nextIdCotC}`;

        // Agregar el idCotizacionCotC a los datos de la cotización
        req.body.idCotizacion = idCotizacion; // Nota: aquí usamos idCotizacion, no idCotizacionCotC

        // Insertar la cotización
        await conn.query('INSERT INTO cotizacion SET ?', req.body);

        // Confirmar la transacción
        await conn.commit();

        res.status(201).json({
            success: "Cotización creada correctamente",
            idCotizacion: idCotizacion 
        });
    } catch (error) {
        // Revertir la transacción en caso de error
        await conn.rollback();
        console.error(error);
        res.status(500).json({ error: "Error al crear la cotización" });
    } finally {
        if (conn) conn.end();
    }
}
async function createCotizacion(req, res) {
    const conn = await connect();
    try {
      // Iniciar una transacción
      await conn.beginTransaction();
  
      // Obtener y actualizar el último valor de la secuencia
      const [result] = await conn.query(
        'UPDATE secuencia_cotizacion SET ultimo_valor = LAST_INSERT_ID(ultimo_valor + 1)'
      );
      const nextId = result.insertId;
  
      // Construir el idCotizacion
      const idCotizacion = `COT-${nextId}`;
  
      // Agregar el idCotizacion a los datos de la cotización
      req.body.idCotizacion = idCotizacion;
  
      // Insertar la cotización
      await conn.query('INSERT INTO cotizacion SET ?', req.body);
  
      // Confirmar la transacción
      await conn.commit();
  
      res.status(201).json({
        success: "Cotización creada correctamente",
        idCotizacion: idCotizacion
      });
    } catch (error) {
      // Revertir la transacción en caso de error
      await conn.rollback();
      console.error(error);
      res.status(500).json({ error: "Error al crear la cotización" });
    } finally {
      if (conn) conn.end();
    }
  }

async function updateCotizacion(req, res) {
    const cotizacionId = parseInt(req.params.id, 10);
    const conn = await connect();
    try {
        await conn.query('UPDATE cotizacion SET ? WHERE id = ?', [req.body, cotizacionId]);
        res.status(200).json({ success: "Cotización actualizada correctamente" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Error al actualizar la cotización" });
    } finally {
        if (conn) conn.end();
    }
}

async function deleteCotizacion(req, res) {
    const cotizacionId = parseInt(req.params.id, 10);
    const conn = await connect();
    try {
        await conn.query('DELETE FROM cotizacion WHERE id = ?', [cotizacionId]);
        res.status(200).json({ success: "Cotización eliminada correctamente" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Error al eliminar la cotización" });
    } finally {
        if (conn) conn.end();
    }
}
async function getCotizacionesPorIdCotizacion(req, res) {
    const { idCotizacion } = req.params;

    const conn = await connect();
    try {
        const [rows] = await conn.query('SELECT * FROM cotizacion WHERE idCotizacion = ?', [idCotizacion]);
        res.status(200).json(rows);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Error interno del servidor" });
    } finally {
        if (conn) conn.end();
    }
}
