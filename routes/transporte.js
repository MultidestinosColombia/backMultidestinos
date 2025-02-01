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
        otros,
        total,
        porcionTerrestreBaja,
        porcionTerrestreAlta,
        creadorPor,
        fechaCreacion
    } = req.body;
    const conn = await connect();
    try {
        const [result] = await conn.query('INSERT INTO transportes (pertenece, destino, nombrePrograma, combus, tasa, iva, ta, ivaTa, otros, total, porcionTerrestreBaja, porcionTerrestreAlta, creadorPor, fechaCreacion) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)', [pertenece, destino, nombrePrograma, combus, tasa, iva, ta, ivaTa, otros, total, porcionTerrestreBaja, porcionTerrestreAlta, creadorPor, fechaCreacion]);
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
        otros,
        total,
        porcionTerrestreBaja,
        porcionTerrestreAlta,
        creadorPor,
        fechaCreacion
    } = req.body;
    const conn = await connect();
    try {
        await conn.query('UPDATE transportes SET pertenece = ?, destino = ?, nombrePrograma = ?, combus = ?, tasa = ?, iva = ?, ta = ?, ivaTa = ?, otros = ?, total = ?, porcionTerrestreBaja = ?, porcionTerrestreAlta = ?, creadorPor = ?, fechaCreacion = ? WHERE id = ?', [pertenece, destino, nombrePrograma, combus, tasa, iva, ta, ivaTa, otros, total, porcionTerrestreBaja, porcionTerrestreAlta, creadorPor, fechaCreacion, transporteId]);
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

async function obtenerTransportesPorParametros(req, res) {
    // Recibir los 5 parámetros (siempre se esperan)
    const { pertenece, destino, nombrePrograma, hotel, tipoHabitacion } = req.query;

    try {
        const conn = await connect();

        // Consulta con filtro por los 5 parámetros
        const [rows] = await conn.query(
            'SELECT * FROM transportes WHERE pertenece = ? AND destino = ? AND nombrePrograma = ? AND hotel = ? AND tipoHabitacion = ?',
            [pertenece, destino, nombrePrograma, hotel, tipoHabitacion]
        );

        res.status(200).json(rows);

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Error interno del servidor" });
    }
}