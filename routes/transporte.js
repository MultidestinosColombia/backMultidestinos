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
    const transporteId = parseInt(req.params.id, 10); // Obtener el ID del transporte desde los parámetros de la URL
    const datosActualizacion = req.body; // Obtener los datos de actualización desde el cuerpo de la solicitud

    // Validación de datos de actualización
    if (!datosActualizacion || Object.keys(datosActualizacion).length === 0) {
        return res.status(400).json({ mensaje: "Datos de actualización no proporcionados" });
    }

    // Verificar conexión
    const conn = await connect();
    if (!conn) {
        return res.status(500).json({ mensaje: "Error de conexión a la base de datos" });
    }

    try {
        // Construir la consulta SQL dinámicamente
        const campos = Object.keys(datosActualizacion).map(campo => `${campo} = ?`).join(', ');
        const valores = [...Object.values(datosActualizacion), transporteId];

        const consultaSQL = `UPDATE transportes SET ${campos} WHERE id = ?`;
        console.log(consultaSQL, valores); // Imprime la consulta SQL para depuración

        const [result] = await conn.query(consultaSQL, valores);

        if (result.affectedRows === 0) {
            return res.status(404).json({ mensaje: `Transporte con id ${transporteId} no encontrado` });
        }

        res.status(200).json({ mensaje: "Transporte actualizado correctamente" });
    } catch (error) {
        console.error("Error al procesar la solicitud: ", error);
        res.status(500).json({
            mensaje: "Error al actualizar el transporte",
            error: error.message,
            stack: error.stack
        });
    } finally {
        if (conn) conn.end();
    }
});

// Endpoint para procesar lotes de transportes
router.post('/procesar-lote', async (req, res) => {
    const { transportes } = req.body;
    let conn = null;

    if (!transportes || !Array.isArray(transportes)) {
        return res.status(400).json({ mensaje: "Datos no válidos. Se espera un arreglo de transportes." });
    }

    try {
        conn = await connect();
        await conn.beginTransaction();

        const batchSize = 100; // Tamaño del lote
        const totalLotes = Math.ceil(transportes.length / batchSize);
        let updatedCount = 0;
        let createdCount = 0;

        for (let i = 0; i < totalLotes; i++) {
            const lote = transportes.slice(i * batchSize, (i + 1) * batchSize);
            const promises = lote.map(async (transporte) => {
                const transporteProcesado = {
                    ...transporte,
                    sencilla_ImpuestoHotel: Number(transporte.sencilla_ImpuestoHotel) || "",
                    doble_ImpuestoHotel: Number(transporte.doble_ImpuestoHotel) || "",
                    triple_ImpuestoHotel: Number(transporte.triple_ImpuestoHotel) || "",
                    cuadruple_ImpuestoHotel: Number(transporte.cuadruple_ImpuestoHotel) || "",
                    quintuple_ImpuestoHotel: Number(transporte.quintuple_ImpuestoHotel) || "",
                    sextuple_ImpuestoHotel: Number(transporte.sextuple_ImpuestoHotel) || "",
                    niño_ImpuestoHotel: Number(transporte.niño_ImpuestoHotel) || "",
                    sencilla_ImpuestoIngr: Number(transporte.sencilla_ImpuestoIngr) || "",
                    doble_ImpuestoIngr: Number(transporte.doble_ImpuestoIngr) || "",
                    triple_ImpuestoIngr: Number(transporte.triple_ImpuestoIngr) || "",
                    cuadruple_ImpuestoIngr: Number(transporte.cuadruple_ImpuestoIngr) || "",
                    quintuple_ImpuestoIngr: Number(transporte.quintuple_ImpuestoIngr) || "",
                    sextuple_ImpuestoIngr: Number(transporte.sextuple_ImpuestoIngr) || "",
                    niño_ImpuestoIngr: Number(transporte.niño_ImpuestoIngr) || "",
                    sencilla_Impoconsumo: Number(transporte.sencilla_Impoconsumo) || "",
                    doble_Impoconsumo: Number(transporte.doble_Impoconsumo) || "",
                    triple_Impoconsumo: Number(transporte.triple_Impoconsumo) || "",
                    cuadruple_Impoconsumo: Number(transporte.cuadruple_Impoconsumo) || "",
                    quintuple_Impoconsumo: Number(transporte.quintuple_Impoconsumo) || "",
                    sextuple_Impoconsumo: Number(transporte.sextuple_Impoconsumo) || "",
                    niño_Impoconsumo: Number(transporte.niño_Impoconsumo) || "",
                    combus: transporte.combus != null ? String(transporte.combus) : null,
                    tasa: transporte.tasa != null ? String(transporte.tasa) : null,
                    iva: transporte.iva != null ? String(transporte.iva) : null,
                    ta: transporte.ta != null ? String(transporte.ta) : null,
                    ivaTa: transporte.ivaTa != null ? String(transporte.ivaTa) : null,
                    otros: transporte.otros != null ? String(transporte.otros) : null,
                    total: Number(transporte.total) || "",
                    porcionTerrestreBaja: Number(transporte.porcionTerrestreBaja) || "",
                    porcionTerrestreAlta: Number(transporte.porcionTerrestreAlta) || "",
                    creadorPor: transporte.creadorPor != null ? String(transporte.creadorPor) : null,
                    fechaCreacion: transporte.fechaCreacion != null ? new Date(transporte.fechaCreacion) : null,
                };

                if (transporte.id) {
                    const [existingTransporteRows] = await conn.query('SELECT * FROM transportes WHERE id = ?', [transporte.id]);
                    const existingTransporte = existingTransporteRows[0];

                    if (existingTransporte) {
                        await conn.query('UPDATE transportes SET ? WHERE id = ?', [transporteProcesado, transporte.id]);
                        updatedCount++;
                    } else {
                        const { id, ...transporteData } = transporteProcesado;
                        await conn.query('INSERT INTO transportes SET ?', [transporteData]);
                        createdCount++;
                    }
                } else {
                    const { id, ...transporteData } = transporteProcesado;
                    await conn.query('INSERT INTO transportes SET ?', [transporteData]);
                    createdCount++;
                }
            });

            await Promise.all(promises); // Esperar a que todos los transportes del lote sean procesados
        }

        await conn.commit();

        const totalProcesados = updatedCount + createdCount;
        const porcentajeActualizacion = totalProcesados > 0 ? (updatedCount / totalProcesados) * 100 : 0;

        res.status(200).json({
            success: true,
            mensaje: `Se han procesado ${transportes.length} transportes: ${updatedCount} actualizados y ${createdCount} creados.`,
            updatedCount,
            createdCount,
            porcentajeActualizacion: porcentajeActualizacion.toFixed(2) // Redondear a dos decimales
        });

    } catch (error) {
        if (conn) {
            await conn.rollback();
        }

        console.error('Error al procesar lote de transportes:', error);

        res.status(500).json({
            success: false,
            mensaje: "Error al procesar los transportes",
            error: error.message,
            detalles: process.env.NODE_ENV === 'development' ? error.stack : undefined
        });

    } finally {
        if (conn) {
            try {
                await conn.end();
            } catch (err) {
                console.error('Error al cerrar la conexión:', err);
            }
        }
    }
});
async function obtenerTransportesPorParametros(req, res) {
    // Recibir los 5 parámetros (siempre se esperan)
    const { pertenece, destino, nombrePrograma, hotel, tipoHabitacion, noches } = req.query;

    try {
        const conn = await connect();

        // Consulta con filtro por los 5 parámetros
        const [rows] = await conn.query(
            'SELECT * FROM transportes WHERE pertenece = ? AND destino = ? AND nombrePrograma = ? AND hotel = ? AND noches = ? AND tipoHabitacion = ?',
            [pertenece, destino, nombrePrograma, hotel, noches, tipoHabitacion]
        );

        res.status(200).json(rows);

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Error interno del servidor" });
    }
}