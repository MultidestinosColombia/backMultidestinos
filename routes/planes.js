const express = require("express");
const connect = require("../database");
const router = express.Router();

// Rutas principales
router.get("/", getPlanes);
router.get("/buscar", buscarPlanBogotaPorDestinoYNombre);
router.get("/porCiudad/:ciudad", buscarPlanesPorCiudad);
router.get("/:id", getPlanBogotaById);
router.post("/", createPlanBogota);
router.put("/:id", updatePlanBogota);
router.delete("/:id", deletePlanBogota);

// Rutas adicionales
router.put("/actualizar/:id", actualizarCamposDinamicos);
router.post("/crear", crearPlanDinamico);
router.post("/procesar-lote", procesarLotePlanes);

module.exports = (app) => app.use("/planes", router);

// Funciones

async function getPlanes(req, res) {
    const conn = await connect();
    try {
        const [rows] = await conn.query("SELECT * FROM planes");
        res.status(200).json(rows);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Error interno del servidor" });
    } finally {
        conn.end();
    }
}

async function getPlanBogotaById(req, res) {
    const planId = parseInt(req.params.id, 10);
    if (isNaN(planId)) return res.status(400).json({ error: "ID inválido" });

    const conn = await connect();
    try {
        const [rows] = await conn.query("SELECT * FROM planes WHERE id = ?", [planId]);
        if (!rows.length) return res.status(404).json({ error: "Plan no encontrado" });
        res.status(200).json(rows[0]);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Error interno del servidor" });
    } finally {
        conn.end();
    }
}

async function createPlanBogota(req, res) {
    const plan = req.body;
    const required = ["destino", "pertenece", "nombrePrograma", "hotel", "plan", "noches", "baseComisionable"];

    for (const field of required) {
        if (!plan[field]) return res.status(400).json({ error: `Falta el campo: ${field}` });
    }

    const conn = await connect();
    try {
        await conn.query(
            `INSERT INTO planes 
            (destino, pertenece, nombrePrograma, hotel, plan, noches, baseComisionable, baseTiqueta, 
             acomodacion, fechaBloqueo, vigenciaInicio, vigenciaFinal, incluye, noIncluye, notas)
             VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [
                plan.destino, plan.pertenece, plan.nombrePrograma, plan.hotel, plan.plan, plan.noches,
                plan.baseComisionable, plan.baseTiqueta, plan.acomodacion, plan.fechaBloqueo,
                plan.vigenciaInicio, plan.vigenciaFinal, plan.incluye, plan.noIncluye, plan.notas
            ]
        );
        res.status(201).json({ success: "Plan creado correctamente" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Error al crear el plan" });
    } finally {
        conn.end();
    }
}

async function updatePlanBogota(req, res) {
    const planId = parseInt(req.params.id, 10);
    if (isNaN(planId)) return res.status(400).json({ error: "ID inválido." });

    const plan = req.body;

    const conn = await connect();
    try {
        const [result] = await conn.query(
            `UPDATE planes SET destino = ?, pertenece = ?, nombrePrograma = ?, hotel = ?, plan = ?, noches = ?,
             baseComisionable = ?, baseTiqueta = ?, acomodacion = ?, fechaBloqueo = ?, vigenciaInicio = ?, 
             vigenciaFinal = ?, incluye = ?, noIncluye = ?, notas = ? WHERE id = ?`,
            [
                plan.destino, plan.pertenece, plan.nombrePrograma, plan.hotel, plan.plan, plan.noches,
                plan.baseComisionable, plan.baseTiqueta, plan.acomodacion, plan.fechaBloqueo,
                plan.vigenciaInicio, plan.vigenciaFinal, plan.incluye, plan.noIncluye, plan.notas, planId
            ]
        );
        if (result.affectedRows === 0) return res.status(404).json({ error: "Plan no encontrado" });
        res.status(200).json({ success: "Plan actualizado correctamente" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Error al actualizar el plan" });
    } finally {
        conn.end();
    }
}

async function deletePlanBogota(req, res) {
    const planId = parseInt(req.params.id, 10);
    if (isNaN(planId)) return res.status(400).json({ error: "ID inválido." });

    const conn = await connect();
    try {
        const [result] = await conn.query("DELETE FROM planes WHERE id = ?", [planId]);
        if (result.affectedRows === 0) return res.status(404).json({ error: "Plan no encontrado" });
        res.status(200).json({ success: "Plan eliminado correctamente" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Error al eliminar el plan" });
    } finally {
        conn.end();
    }
}

async function buscarPlanBogotaPorDestinoYNombre(req, res) {
    const { destino, nombrePrograma } = req.query;
    if (!destino || !nombrePrograma) {
        return res.status(400).json({ error: "Se requieren los parámetros 'destino' y 'nombrePrograma'" });
    }

    const conn = await connect();
    try {
        const [rows] = await conn.query(
            "SELECT * FROM planes WHERE destino = ? AND nombrePrograma = ?",
            [destino, nombrePrograma]
        );
        if (!rows.length) return res.status(404).json({ error: "No se encontró ningún plan" });
        res.status(200).json(rows[0]);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Error interno del servidor" });
    } finally {
        conn.end();
    }
}

async function buscarPlanesPorCiudad(req, res) {
    const ciudad = req.params.ciudad;

    const conn = await connect();
    try {
        const [rows] = await conn.query("SELECT * FROM planes WHERE pertenece = ?", [ciudad]);
        res.status(200).json(rows);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Error interno del servidor" });
    } finally {
        conn.end();
    }
}

async function actualizarCamposDinamicos(req, res) {
    const planId = parseInt(req.params.id, 10);
    const datos = req.body;

    if (isNaN(planId)) return res.status(400).json({ mensaje: "ID inválido." });
    if (!datos || Object.keys(datos).length === 0) {
        return res.status(400).json({ mensaje: "No se proporcionaron datos" });
    }

    const conn = await connect();
    try {
        const campos = Object.keys(datos).map(c => `${c} = ?`).join(", ");
        const valores = [...Object.values(datos), planId];

        const [result] = await conn.query(`UPDATE planes SET ${campos} WHERE id = ?`, valores);
        if (result.affectedRows === 0) return res.status(404).json({ mensaje: "Plan no encontrado" });

        res.status(200).json({ mensaje: "Plan actualizado correctamente" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ mensaje: "Error al actualizar el plan", error: error.message });
    } finally {
        conn.end();
    }
}

async function crearPlanDinamico(req, res) {
    const nuevoPlan = req.body;
    if (!nuevoPlan || Object.keys(nuevoPlan).length === 0) {
        return res.status(400).json({ mensaje: "No se proporcionaron datos del plan" });
    }

    const conn = await connect();
    try {
        const campos = Object.keys(nuevoPlan).join(", ");
        const marcadores = Object.keys(nuevoPlan).map(() => "?").join(", ");
        const valores = Object.values(nuevoPlan);

        const [result] = await conn.query(`INSERT INTO planes (${campos}) VALUES (${marcadores})`, valores);
        res.status(201).json({ mensaje: "Plan creado correctamente", id: result.insertId });
    } catch (error) {
        console.error(error);
        res.status(500).json({ mensaje: "Error al crear el plan", error: error.message });
    } finally {
        conn.end();
    }
}

async function procesarLotePlanes(req, res) {
    const { planes } = req.body;
    if (!planes || !Array.isArray(planes)) {
        return res.status(400).json({ mensaje: "Se esperaba un arreglo de planes" });
    }

    const conn = await connect();
    const errores = [];
    let updatedCount = 0;
    let createdCount = 0;

    try {
        await conn.query("START TRANSACTION");

        for (const [index, plan] of planes.entries()) {
            if (!plan.destino || !plan.nombrePrograma || !plan.plan) {
                errores.push({ index, mensaje: "Campos requeridos faltantes" });
                continue;
            }

            try {
                if (plan.id) {
                    const [existe] = await conn.query("SELECT id FROM planes WHERE id = ?", [plan.id]);
                    if (existe.length > 0) {
                        await conn.query("UPDATE planes SET ? WHERE id = ?", [plan, plan.id]);
                        updatedCount++;
                    } else {
                        await conn.query("INSERT INTO planes SET ?", [plan]);
                        createdCount++;
                    }
                } else {
                    await conn.query("INSERT INTO planes SET ?", [plan]);
                    createdCount++;
                }
            } catch (error) {
                errores.push({ index, mensaje: "Error al procesar este plan", error: error.message });
            }
        }

        await conn.query("COMMIT");
        res.status(200).json({
            mensaje: `${createdCount} creados, ${updatedCount} actualizados.`,
            errores
        });
    } catch (error) {
        await conn.query("ROLLBACK");
        console.error("Error grave al procesar lote:", error);
        res.status(500).json({ mensaje: "Error al procesar lote de planes", error: error.message });
    } finally {
        conn.end();
    }
}