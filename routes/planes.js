const express = require("express");
const connect = require('../database');
const bcrypt = require('bcrypt');
const router = express.Router();

router.get("/", getPlanes);
router.get("/:id", getPlanBogotaById);
router.post("/", createPlanBogota);
router.put("/:id", updatePlanBogota);
router.delete("/:id", deletePlanBogota);
router.get("/buscar", buscarPlanBogotaPorDestinoYNombre);
router.get("/porCiudad/:ciudad", buscarPlanesPorCiudad);

module.exports = (app) => app.use("/planes", router);

async function getPlanes(req, res) {
    const conn = await connect();
    try {
        const [rows] = await conn.query('SELECT * FROM planes');
        res.status(200).json(rows);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Error interno del servidor" });
    } finally {
        if (conn) conn.end();
    }
}

async function getPlanBogotaById(req, res) {
    const planId = parseInt(req.params.id, 10);
    const conn = await connect();
    try {
        const [rows] = await conn.query('SELECT * FROM planes WHERE id = ?', [planId]);
        if (rows.length === 0) {
            return res.status(404).json({ error: "Plan no encontrado" });
        }
        res.status(200).json(rows[0]);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Error interno del servidor" });
    } finally {
        if (conn) conn.end();
    }
}

async function createPlanBogota(req, res) {
    const { destino, pertenece, nombrePrograma, hotel, plan, baseComisionable, baseTiqueta, acomodacion, fechaBloqueo, vigenciaInicio, vigenciaFinal, incluye, noIncluye, notas } = req.body;
    const conn = await connect();
    try {
        await conn.query('INSERT INTO planes (destino, pertenece, nombrePrograma, hotel, plan, baseComisionable, baseTiqueta, acomodacion, fechaBloqueo, vigenciaInicio, vigenciaFinal, incluye, noIncluye, notas) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)', [destino, nombrePrograma, hotel, plan, baseComisionable, baseTiqueta, acomodacion, fechaBloqueo, vigenciaInicio, vigenciaFinal, incluye, noIncluye, notas]);
        res.status(201).json({ success: "Plan creado correctamente" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Error al crear el plan" });
    } finally {
        if (conn) conn.end();
    }
}

async function updatePlanBogota(req, res) {
    const planId = parseInt(req.params.id, 10);
    const { destino,pertenece, nombrePrograma, hotel, plan, baseComisionable, baseTiqueta, acomodacion, fechaBloqueo, vigenciaInicio, vigenciaFinal, incluye, noIncluye, notas } = req.body;
    const conn = await connect();
    try {
        await conn.query('UPDATE planes SET destino = ?, pertenece =?, nombrePrograma = ?, hotel = ?, plan = ?, baseComisionable = ?, baseTiqueta = ?, acomodacion = ?, fechaBloqueo = ?, vigenciaInicio = ?, vigenciaFinal = ?, incluye = ?, noIncluye = ?, notas = ? WHERE id = ?', [destino, nombrePrograma, hotel, plan, baseComisionable, baseTiqueta, acomodacion, fechaBloqueo, vigenciaInicio, vigenciaFinal, incluye, noIncluye, notas, planId]);
        res.status(200).json({ success: "Plan actualizado correctamente" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Error al actualizar el plan" });
    } finally {
        if (conn) conn.end();
    }
}

async function deletePlanBogota(req, res) {
    const planId = parseInt(req.params.id, 10);
    const conn = await connect();
    try {
        await conn.query('DELETE FROM planes WHERE id = ?', [planId]);
        res.status(200).json({ success: "Plan eliminado correctamente" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Error al eliminar el plan" });
    } finally {
        if (conn) conn.end();
    }
}
async function buscarPlanBogotaPorDestinoYNombre(req, res) {
    // Obtiene los parámetros de la solicitud (destino y nombrePrograma)
    const { destino, nombrePrograma } = req.query;

    // Verifica si se proporcionaron los parámetros necesarios
    if (!destino || !nombrePrograma) {
        return res.status(400).json({ error: "Se requieren los parámetros 'destino' y 'nombrePrograma'" });
    }

    // Realiza la consulta a la base de datos para buscar el plan
    const conn = await connect();
    try {
        const [rows] = await conn.query('SELECT * FROM planes WHERE destino = ? AND nombrePrograma = ?', [destino, nombrePrograma]);
        
        // Verifica si se encontraron resultados
        if (rows.length === 0) {
            return res.status(404).json({ error: "No se encontró ningún plan con los parámetros proporcionados" });
        }

        // Devuelve el plan encontrado
        res.status(200).json(rows[0]);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Error interno del servidor" });
    } finally {
        if (conn) conn.end();
    }
}
async function buscarPlanesPorCiudad(req, res) {
    const ciudad = req.params.ciudad; // Obtener la ciudad de los parámetros de la URL
    const conn = await connect();
    try {
        const [rows] = await conn.query('SELECT * FROM planes WHERE pertenece = ?', [ciudad]);
        res.status(200).json(rows);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Error interno del servidor" });
    } finally {
        if (conn) conn.end();
    }
}