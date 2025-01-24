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
    const { destino, pertenece, nombrePrograma, hotel, plan, noches, baseComisionable, baseTiqueta, acomodacion, fechaBloqueo, vigenciaInicio, vigenciaFinal, incluye, noIncluye, notas } = req.body;
    const conn = await connect();
    try {
        await conn.query('INSERT INTO planes (destino, pertenece, nombrePrograma, hotel, plan, noches, baseComisionable, baseTiqueta, acomodacion, fechaBloqueo, vigenciaInicio, vigenciaFinal, incluye, noIncluye, notas) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)', [destino, pertenece,  nombrePrograma, hotel, plan, noches, baseComisionable, baseTiqueta, acomodacion, fechaBloqueo, vigenciaInicio, vigenciaFinal, incluye, noIncluye, notas]);
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
    const { 
        destino,
        pertenece, 
        nombrePrograma, 
        hotel, 
        plan, 
        noches, // <-- Asegúrate de incluir 'noches' en la desestructuración
        baseComisionable, 
        baseTiqueta, 
        acomodacion, 
        fechaBloqueo, 
        vigenciaInicio, 
        vigenciaFinal, 
        incluye, 
        noIncluye, 
        notas 
    } = req.body;

    const conn = await connect();
    try {
        await conn.query('UPDATE planes SET destino = ?, pertenece =?, nombrePrograma = ?, hotel = ?, plan = ?, noches = ?, baseComisionable = ?, baseTiqueta = ?, acomodacion = ?, fechaBloqueo = ?, vigenciaInicio = ?, vigenciaFinal = ?, incluye = ?, noIncluye = ?, notas = ? WHERE id = ?', [
            destino, 
            pertenece, 
            nombrePrograma, 
            hotel, 
            plan, 
            noches, // <-- Incluye 'noches' en el array de parámetros
            baseComisionable, 
            baseTiqueta, 
            acomodacion, 
            fechaBloqueo, 
            vigenciaInicio, 
            vigenciaFinal, 
            incluye, 
            noIncluye, 
            notas, 
            planId
        ]);
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



//---------------------------------------------------------------- actualizar datos ---------------------------------------------------------------------------//


// Endpoint para actualizar planes existentes
router.put('/actualizar/:id', async (req, res) => {
    const planId = parseInt(req.params.id, 10);
    const datosActualizacion = req.body;

    if (!datosActualizacion || Object.keys(datosActualizacion).length === 0) {
        return res.status(400).json({ mensaje: "Datos de actualización no proporcionados" });
    }

    // Verificar conexión
    const conn = await connect();
    if (!conn) {
        return res.status(500).json({ mensaje: "Error de conexión a la base de datos" });
    }

    // Validación de campos
    const camposValidos = ['campo1', 'campo2', 'campo3']; // Reemplaza con tus campos
    const camposInvalidos = Object.keys(datosActualizacion).filter(campo => !camposValidos.includes(campo));

    if (camposInvalidos.length > 0) {
        return res.status(400).json({ mensaje: `Campos no válidos: ${camposInvalidos.join(', ')}` });
    }

    try {
        const campos = Object.keys(datosActualizacion).map(campo => `${campo} = ?`).join(', ');
        const valores = [...Object.values(datosActualizacion), planId];

        const consultaSQL = `UPDATE planes SET ${campos} WHERE id = ?`;
        console.log(consultaSQL, valores); // Imprime la consulta SQL para depuración

        const [result] = await conn.query(consultaSQL, valores);

        if (result.affectedRows === 0) {
            return res.status(404).json({ mensaje: `Plan con id ${planId} no encontrado` });
        }

        res.status(200).json({ mensaje: "Plan actualizado correctamente" });
    } catch (error) {
        console.error("Error al procesar la solicitud: ", error); // Agrega más detalles aquí
        res.status(500).json({
            mensaje: "Error al actualizar el plan",
            error: error.message,
            stack: error.stack // Esto es útil para depuración
        });
    }
     finally {
        if (conn) conn.end();
    }
});

// Nuevo endpoint para crear planes
router.post('/crear', async (req, res) => {
    const nuevoPlan = req.body;

    if (!nuevoPlan || Object.keys(nuevoPlan).length === 0) {
        return res.status(400).json({ mensaje: "Datos del nuevo plan no proporcionados" });
    }

    const conn = await connect();
    try {
        // Obtener los campos y valores para la inserción
        const campos = Object.keys(nuevoPlan).join(', ');
        const marcadores = Object.keys(nuevoPlan).map(() => '?').join(', ');
        const valores = Object.values(nuevoPlan);

        const [result] = await conn.query(
            `INSERT INTO planes (${campos}) VALUES (${marcadores})`,
            valores
        );

        res.status(201).json({
            mensaje: "Plan creado correctamente",
            id: result.insertId
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ mensaje: "Error al crear el plan", error: error.message });
    } finally {
        if (conn) conn.end();
    }
});

    // Endpoint para procesar múltiples planes (actualización y creación)
router.post('/procesar-lote', async (req, res) => {
    const { planes } = req.body;

    if (!planes || !Array.isArray(planes)) {
        return res.status(400).json({ mensaje: "Datos no válidos" });
    }

    const conn = await connect();
    let updatedCount = 0;
    let createdCount = 0;

    try {
        // Iniciar la transacción
        await conn.query('START TRANSACTION');

        for (const plan of planes) {
            if (plan.id) {
                // Si tiene un ID, intentamos actualizar el plan
                const [existingPlan] = await conn.query('SELECT * FROM planes WHERE id = ?', [plan.id]);
                if (existingPlan.length > 0) {
                    // Si el plan existe, actualízalo
                    await conn.query('UPDATE planes SET ? WHERE id = ?', [plan, plan.id]);
                    updatedCount++;
                } else {
                    // Si no existe, crea un nuevo plan con los datos
                    await conn.query('INSERT INTO planes SET ?', [plan]);
                    createdCount++;
                }
            } else {
                // Si no tiene un ID, lo crea como nuevo
                await conn.query('INSERT INTO planes SET ?', [plan]);
                createdCount++;
            }
        }

        // Confirmar la transacción si todo es exitoso
        await conn.query('COMMIT');
        
        res.status(200).json({
            mensaje: `${updatedCount} planes actualizados y ${createdCount} planes creados.`,
        });
    } catch (error) {
        // Si ocurre algún error, revertir la transacción
        await conn.query('ROLLBACK');
        console.error(error);
        res.status(500).json({ mensaje: "Error al procesar los planes", error: error.message });
    } finally {
        if (conn) conn.end();
    }
});


