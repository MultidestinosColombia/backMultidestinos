const express = require("express");
const connect = require('../database');
const router = express.Router();

router.get("/", getTransporte);
router.post("/", createTransporte);
router.put("/:id", updateTransporte);
router.delete("/:id", deleteTransporte);
router.get("/buscar", buscarTransporte);
router.get("/por-parametros", obtenerTransportesPorParametros);
module.exports = (app) => app.use("/transporte", router);

async function getTransporte(req, res) {
    const conn = await connect();
    try {
        const [rows] = await conn.query('SELECT * FROM transportes');
        const transportes = rows.map(transporte => {
            const {
                id,
                pertenece,
                destino,
                nombrePrograma,
                combus,
                tasa,
                iva,
                ta,
                ivaTa,
                sencilla_ImpuestoHotel,
                doble_ImpuestoHotel,
                triple_ImpuestoHotel,
                cuadruple_ImpuestoHotel,
                quintuple_ImpuestoHotel,
                sextuple_ImpuestoHotel,
                niño_ImpuestoHotel,
                sencilla_ImpuestoIngr,
                doble_ImpuestoIngr,
                triple_ImpuestoIngr,
                cuadruple_ImpuestoIngr,
                quintuple_ImpuestoIngr,
                sextuple_ImpuestoIngr,
                niño_ImpuestoIngr,
                sencilla_Impoconsumo,
                doble_Impoconsumo,
                triple_Impoconsumo,
                cuadruple_Impoconsumo,
                quintuple_Impoconsumo,
                sextuple_Impoconsumo,
                niño_Impoconsumo,
                otros,
                total,
                porcionTerrestreBaja,
                porcionTerrestreAlta,
                creadorPor,
                fechaCreacion
            } = transporte;
            return {
                id,
                pertenece,
                destino,
                nombrePrograma,
                combus,
                tasa,
                iva,
                ta,
                ivaTa,
                sencilla_ImpuestoHotel,
                doble_ImpuestoHotel,
                triple_ImpuestoHotel,
                cuadruple_ImpuestoHotel,
                quintuple_ImpuestoHotel,
                sextuple_ImpuestoHotel,
                niño_ImpuestoHotel,
                sencilla_ImpuestoIngr,
                doble_ImpuestoIngr,
                triple_ImpuestoIngr,
                cuadruple_ImpuestoIngr,
                quintuple_ImpuestoIngr,
                sextuple_ImpuestoIngr,
                niño_ImpuestoIngr,
                sencilla_Impoconsumo,
                doble_Impoconsumo,
                triple_Impoconsumo,
                cuadruple_Impoconsumo,
                quintuple_Impoconsumo,
                sextuple_Impoconsumo,
                niño_Impoconsumo,
                otros,
                total,
                porcionTerrestreBaja,
                porcionTerrestreAlta,
                creadorPor,
                fechaCreacion
            };
        });
        res.status(200).json(transportes);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Error interno del servidor" });
    } finally {
        if (conn) conn.end();
    }
}

async function createTransporte(req, res) {
    const {
        pertenece,
        destino,
        nombrePrograma,
        combus,
        tasa,
        iva,
        ta,
        ivaTa,
        sencilla_ImpuestoHotel,
        doble_ImpuestoHotel,
        triple_ImpuestoHotel,
        cuadruple_ImpuestoHotel,
        quintuple_ImpuestoHotel,
        sextuple_ImpuestoHotel,
        niño_ImpuestoHotel,
        sencilla_ImpuestoIngr,
        doble_ImpuestoIngr,
        triple_ImpuestoIngr,
        cuadruple_ImpuestoIngr,
        quintuple_ImpuestoIngr,
        sextuple_ImpuestoIngr,
        niño_ImpuestoIngr,
        sencilla_Impoconsumo,
        doble_Impoconsumo,
        triple_Impoconsumo,
        cuadruple_Impoconsumo,
        quintuple_Impoconsumo,
        sextuple_Impoconsumo,
        niño_Impoconsumo,
        otros,
        total,
        porcionTerrestreBaja,
        porcionTerrestreAlta,
        creadorPor,
        fechaCreacion
    } = req.body;
    const conn = await connect();
    try {
        const [result] = await conn.query('INSERT INTO transportes (pertenece, destino, nombrePrograma, combus, tasa, iva, ta, ivaTa,sencilla_ImpuestoHotel ,doble_ImpuestoHotel ,triple_ImpuestoHotel ,cuadruple_ImpuestoHotel ,quintuple_ImpuestoHotel ,sextuple_ImpuestoHotel ,niño_ImpuestoHotel ,sencilla_ImpuestoIngr,doble_ImpuestoIngr,triple_ImpuestoIngr,cuadruple_ImpuestoIngr,quintuple_ImpuestoIngr,sextuple_ImpuestoIngr,niño_ImpuestoIngr,sencilla_Impoconsumo,doble_Impoconsumo,triple_Impoconsumo,cuadruple_Impoconsumo,quintuple_Impoconsumo,sextuple_Impoconsumo,niño_Impoconsumo, otros, total, porcionTerrestreBaja, porcionTerrestreAlta, creadorPor, fechaCreacion) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)', [pertenece, destino, nombrePrograma, combus, tasa, iva, ta, ivaTa,sencilla_ImpuestoHotel, doble_ImpuestoHotel,triple_ImpuestoHotel,cuadruple_ImpuestoHotel,quintuple_ImpuestoHotel,sextuple_ImpuestoHotel,niño_ImpuestoHotel,sencilla_ImpuestoIngr,doble_ImpuestoIngr,triple_ImpuestoIngr,cuadruple_ImpuestoIngr,quintuple_ImpuestoIngr,sextuple_ImpuestoIngr,niño_ImpuestoIngr,sencilla_Impoconsumo,doble_Impoconsumo,triple_Impoconsumo,cuadruple_Impoconsumo,quintuple_Impoconsumo,sextuple_Impoconsumo, niño_Impoconsumo, otros, total, porcionTerrestreBaja, porcionTerrestreAlta, creadorPor, fechaCreacion]);
        const newTransporte = {
            id: result.insertId,
            pertenece,
            destino,
            nombrePrograma,
            combus,
            tasa,
            iva,
            ta,
            ivaTa,
            sencilla_ImpuestoHotel,
            doble_ImpuestoHotel,
            triple_ImpuestoHotel,
            cuadruple_ImpuestoHotel,
            quintuple_ImpuestoHotel,
            sextuple_ImpuestoHotel,
            niño_ImpuestoHotel,
            sencilla_ImpuestoIngr,
            doble_ImpuestoIngr,
            triple_ImpuestoIngr,
            cuadruple_ImpuestoIngr,
            quintuple_ImpuestoIngr,
            sextuple_ImpuestoIngr,
            niño_ImpuestoIngr,
            sencilla_Impoconsumo,
            doble_Impoconsumo,
            triple_Impoconsumo,
            cuadruple_Impoconsumo,
            quintuple_Impoconsumo,
            sextuple_Impoconsumo,
            niño_Impoconsumo,
            otros,
            total,
            porcionTerrestreBaja,
            porcionTerrestreAlta,
            creadorPor,
            fechaCreacion
        };
        res.status(201).json(newTransporte);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Error al crear el transporte" });
    } finally {
        if (conn) conn.end();
    }
}

async function updateTransporte(req, res) {
    const transporteId = parseInt(req.params.id, 10);
    const {
        pertenece,
        destino,
        nombrePrograma,
        combus,
        tasa,
        iva,
        ta,
        ivaTa,
        sencilla_ImpuestoHotel,
        doble_ImpuestoHotel,
        triple_ImpuestoHotel,
        cuadruple_ImpuestoHotel,
        quintuple_ImpuestoHotel,
        sextuple_ImpuestoHotel,
        niño_ImpuestoHotel,
        sencilla_ImpuestoIngr,
        doble_ImpuestoIngr,
        triple_ImpuestoIngr,
        cuadruple_ImpuestoIngr,
        quintuple_ImpuestoIngr,
        sextuple_ImpuestoIngr,
        niño_ImpuestoIngr,
        sencilla_Impoconsumo,
        doble_Impoconsumo,
        triple_Impoconsumo,
        cuadruple_Impoconsumo,
        quintuple_Impoconsumo,
        sextuple_Impoconsumo,
        niño_Impoconsumo,
        otros,
        total,
        porcionTerrestreBaja,
        porcionTerrestreAlta,
        creadorPor,
        fechaCreacion
    } = req.body;
    const conn = await connect();
    try {
        await conn.query('UPDATE transportes SET pertenece = ?, destino = ?, nombrePrograma = ?, combus = ?, tasa = ?, iva = ?, ta = ?, ivaTa = ?,sencilla_ImpuestoHotel = ?, doble_ImpuestoHotel = ?, triple_ImpuestoHotel = ?, cuadruple_ImpuestoHotel = ?, quintuple_ImpuestoHotel = ?, sextuple_ImpuestoHotel = ?, niño_ImpuestoHotel = ?,sencilla_ImpuestoIngr = ?,doble_ImpuestoIngr = ?,triple_ImpuestoIngr = ?,cuadruple_ImpuestoIngr = ?,quintuple_ImpuestoIngr = ?,sextuple_ImpuestoIngr = ?,niño_ImpuestoIngr = ?,sencilla_Impoconsumo = ?,doble_Impoconsumo = ?,triple_Impoconsumo = ?,cuadruple_Impoconsumo = ?,quintuple_Impoconsumo = ?,sextuple_Impoconsumo = ?,niño_Impoconsumo, otros = ?, total = ?, porcionTerrestreBaja = ?, porcionTerrestreAlta = ?, creadorPor = ?, fechaCreacion = ? WHERE id = ?', [pertenece, destino, nombrePrograma, combus, tasa, iva, ta, ivaTa,sencilla_ImpuestoHotel,doble_ImpuestoHotel,triple_ImpuestoHotel,cuadruple_ImpuestoHotel,quintuple_ImpuestoHotel,sextuple_ImpuestoHotel,niño_ImpuestoHotel,sencilla_ImpuestoIngr,doble_ImpuestoIngr,triple_ImpuestoIngr,cuadruple_ImpuestoIngr,quintuple_ImpuestoIngr,sextuple_ImpuestoIngr,niño_ImpuestoIngr,sencilla_Impoconsumo,doble_Impoconsumo,triple_Impoconsumo,cuadruple_Impoconsumo,quintuple_Impoconsumo,sextuple_Impoconsumo,niño_Impoconsumo, otros, total, porcionTerrestreBaja, porcionTerrestreAlta, creadorPor, fechaCreacion, transporteId]);
        res.status(200).json({
            id: transporteId,
            pertenece,
            destino,
            nombrePrograma,
            combus,
            tasa,
            iva,
            ta,
            ivaTa,
            sencilla_ImpuestoHotel,
            doble_ImpuestoHotel,
            triple_ImpuestoHotel,
            cuadruple_ImpuestoHotel,
            quintuple_ImpuestoHotel,
            sextuple_ImpuestoHotel,
            niño_ImpuestoHotel,
            sencilla_ImpuestoIngr,
            doble_ImpuestoIngr,
            triple_ImpuestoIngr,
            cuadruple_ImpuestoIngr,
            quintuple_ImpuestoIngr,
            sextuple_ImpuestoIngr,
            niño_ImpuestoIngr,
            sencilla_Impoconsumo,
            doble_Impoconsumo,
            triple_Impoconsumo,
            cuadruple_Impoconsumo,
            quintuple_Impoconsumo,
            sextuple_Impoconsumo,
            niño_Impoconsumo,
            otros,
            total,
            porcionTerrestreBaja,
            porcionTerrestreAlta,
            creadorPor,
            fechaCreacion
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Error al actualizar el transporte" });
    } finally {
        if (conn) conn.end();
    }
}

async function deleteTransporte(req, res) {
    const transporteId = parseInt(req.params.id, 10);
    const conn = await connect();
    try {
        await conn.query('DELETE FROM transportes WHERE id = ?', [transporteId]);
        res.status(200).json({ success: "Transporte eliminado correctamente" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Error al eliminar el transporte" });
    } finally {
        if (conn) conn.end();
    }
}
async function buscarTransporte(req, res) {
    const { pertenece, destino } = req.query;
    
    // Verificar si ambos parámetros están presentes
    if (!pertenece || !destino) {
        return res.status(400).json({ error: "Se requieren tanto 'pertenece' como 'destino' en la consulta" });
    }

    try {
        const conn = await connect();
        const query = 'SELECT * FROM transportes WHERE pertenece = ? AND destino = ?';
        const queryParams = [pertenece, destino];

        const [rows] = await conn.query(query, queryParams);
        const transportes = rows.map(transporte => {
            const {
                id,
                pertenece,
                destino,
                nombrePrograma,
                combus,
                tasa,
                iva,
                ta,
                ivaTa,
                sencilla_ImpuestoHotel,
                doble_ImpuestoHotel,
                triple_ImpuestoHotel,
                cuadruple_ImpuestoHotel,
                quintuple_ImpuestoHotel,
                sextuple_ImpuestoHotel,
                niño_ImpuestoHotel,
                sencilla_ImpuestoIngr,
                doble_ImpuestoIngr,
                triple_ImpuestoIngr,
                cuadruple_ImpuestoIngr,
                quintuple_ImpuestoIngr,
                sextuple_ImpuestoIngr,
                niño_ImpuestoIngr,
                sencilla_Impoconsumo,
                doble_Impoconsumo,
                triple_Impoconsumo,
                cuadruple_Impoconsumo,
                quintuple_Impoconsumo,
                sextuple_Impoconsumo,
                niño_Impoconsumo,
                otros,
                total,
                porcionTerrestreBaja,
                porcionTerrestreAlta,
                creadorPor,
                fechaCreacion
            } = transporte;
            return {
                id,
                pertenece,
                destino,
                nombrePrograma,
                combus,
                tasa,
                iva,
                ta,
                ivaTa,
                sencilla_ImpuestoHotel,
                doble_ImpuestoHotel,
                triple_ImpuestoHotel,
                cuadruple_ImpuestoHotel,
                quintuple_ImpuestoHotel,
                sextuple_ImpuestoHotel,
                niño_ImpuestoHotel,
                sencilla_ImpuestoIngr,
                doble_ImpuestoIngr,
                triple_ImpuestoIngr,
                cuadruple_ImpuestoIngr,
                quintuple_ImpuestoIngr,
                sextuple_ImpuestoIngr,
                niño_ImpuestoIngr,
                sencilla_Impoconsumo,
                doble_Impoconsumo,
                triple_Impoconsumo,
                cuadruple_Impoconsumo,
                quintuple_Impoconsumo,
                sextuple_Impoconsumo,
                niño_Impoconsumo,
                otros,
                total,
                porcionTerrestreBaja,
                porcionTerrestreAlta,
                creadorPor,
                fechaCreacion
            };
        });
        res.status(200).json(transportes);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Error interno del servidor" });
    }
}


//-------------------------------------------------------------- transportes ------------------------------------------------------------------------------------//
// Endpoint para actualizar transportes existentes
router.put('/actualizar/:id', async (req, res) => {
    const transporteId = parseInt(req.params.id, 10);
    const datosActualizacion = req.body;

    if (!datosActualizacion || Object.keys(datosActualizacion).length === 0) {
        return res.status(400).json({ mensaje: "Datos de actualización no proporcionados" });
    }

    let conn;
    try {
        conn = await connect();
        if (!conn) throw new Error("Error de conexión a la base de datos");

        // Construcción de consulta SQL dinámica
        const campos = Object.keys(datosActualizacion).map(campo => `${campo} = ?`).join(', ');
        const valores = [...Object.values(datosActualizacion), transporteId];

        const consultaSQL = `UPDATE transportes SET ${campos} WHERE id = ?`;
        const [result] = await conn.query(consultaSQL, valores);

        if (result.affectedRows === 0) {
            return res.status(404).json({ mensaje: `Transporte con id ${transporteId} no encontrado` });
        }

        res.status(200).json({ mensaje: "Transporte actualizado correctamente" });
    } catch (error) {
        console.error("Error al actualizar el transporte: ", error);
        res.status(500).json({ mensaje: "Error al actualizar el transporte", error: error.message });
    } finally {
        if (conn) await conn.end();
    }
});

// Endpoint para procesar lotes de transportes
router.post('/procesar-lote', async (req, res) => {
    const { transportes } = req.body;
    if (!transportes || !Array.isArray(transportes)) {
        return res.status(400).json({ mensaje: "Se espera un arreglo de transportes." });
    }

    let conn;
    try {
        conn = await connect();
        if (!conn) throw new Error("Error de conexión a la base de datos");

        await conn.beginTransaction();

        const batchSize = 100; // Tamaño del lote
        let updatedCount = 0, createdCount = 0;

        for (let i = 0; i < transportes.length; i += batchSize) {
            const lote = transportes.slice(i, i + batchSize);
            
            // Dividir en actualizaciones y creaciones
            const idsExistentes = lote.filter(t => t.id).map(t => t.id);
            let existentes = [];

            if (idsExistentes.length > 0) {
                const [rows] = await conn.query(`SELECT id FROM transportes WHERE id IN (?)`, [idsExistentes]);
                existentes = rows.map(row => row.id);
            }

            const actualizaciones = lote.filter(t => existentes.includes(t.id));
            const nuevasInserciones = lote.filter(t => !existentes.includes(t.id));

            // Procesar actualizaciones en lote
            if (actualizaciones.length > 0) {
                const updateQueries = actualizaciones.map(t => {
                    const id = t.id;
                    delete t.id;
                    return conn.query(`UPDATE transportes SET ? WHERE id = ?`, [t, id]);
                });
                await Promise.all(updateQueries);
                updatedCount += actualizaciones.length;
            }

            // Procesar nuevas inserciones en lote
            if (nuevasInserciones.length > 0) {
                await conn.query(`INSERT INTO transportes SET ?`, nuevasInserciones);
                createdCount += nuevasInserciones.length;
            }
        }

        await conn.commit();

        res.status(200).json({
            success: true,
            mensaje: `Se procesaron ${transportes.length} transportes: ${updatedCount} actualizados y ${createdCount} creados.`,
            updatedCount,
            createdCount,
            porcentajeActualizacion: ((updatedCount / transportes.length) * 100).toFixed(2)
        });
    } catch (error) {
        if (conn) await conn.rollback();
        console.error("Error al procesar lote de transportes:", error);

        res.status(500).json({
            success: false,
            mensaje: "Error al procesar los transportes",
            error: error.message
        });
    } finally {
        if (conn) await conn.end();
    }
});
async function obtenerTransportesPorParametros(req, res) {
    // Recibir los 5 parámetros (siempre se esperan)
    const { pertenece, destino, nombrePrograma, hotel, tipoHabitacion, noches } = req.query;

    try {
        const conn = await connect();

        // Consulta con filtro por los 5 parámetros
        const [rows] = await conn.query(
            'SELECT * FROM transportes WHERE pertenece = ? AND destino = ? AND nombrePrograma = ? AND hotel = ? AND noches = ? ',
            [pertenece, destino, nombrePrograma, hotel, noches]
        );

        res.status(200).json(rows);

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Error interno del servidor" });
    }
}