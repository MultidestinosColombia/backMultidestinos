const express = require("express");
const connect = require('../database'); // Asumiendo que tienes una función connect para establecer la conexión a la base de datos
const router = express.Router();

// Rutas
router.get("/", getImpuestos);
router.post("/", createImpuesto);
router.put("/:id", updateImpuesto);
router.delete("/:id", deleteImpuesto);

module.exports = (app) => app.use("/canoCristal", router);

// Funciones de manejo de rutas

async function getImpuestos(req, res) {
  const conn = await connect();
  try {
    const [rows] = await conn.query('SELECT * FROM ImpuesCañoCristal');
    res.status(200).json(rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error interno del servidor" });
  } finally {
    if (conn) conn.end();
  }
}

async function createImpuesto(req, res) {
  const conn = await connect();
  try {
    const result = await conn.query('INSERT INTO ImpuesCañoCristal SET ?', req.body);
    res.status(201).json({ success: "Impuesto creado correctamente", id: result.insertId });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al crear el impuesto" });
  } finally {
    if (conn) conn.end();
  }
}

async function updateImpuesto(req, res) {
  const impuestoId = req.params.id; 
  const conn = await connect();
  try {
    await conn.query('UPDATE ImpuesCañoCristal SET ? WHERE id = ?', [req.body, impuestoId]);
    res.status(200).json({ success: "Impuesto actualizado correctamente" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al actualizar el impuesto" });
  } finally {
    if (conn) conn.end();
  }
}

async function deleteImpuesto(req, res) {
  const impuestoId = req.params.id; 
  const conn = await connect();
  try {
    await conn.query('DELETE FROM ImpuesCañoCristal WHERE id = ?', [impuestoId]);
    res.status(200).json({ success: "Impuesto eliminado correctamente" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al eliminar el impuesto" });
  } finally {
    if (conn) conn.end();
  }
}
