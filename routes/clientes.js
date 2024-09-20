const express = require("express");
const connect = require('../database');
const router = express.Router();

router.get("/", getCliente);
router.post("/", createCliente);
router.put("/:id", updateCliente);
router.delete("/:id", deleteCliente);
router.get("/buscar/:nombre", buscarClientePorNombre);


module.exports = (app) => app.use("/cliente", router);

async function getCliente(req, res) {
    const conn = await connect();
    try {
        const [rows] = await conn.query('SELECT id, nombre, ciudad, correo, direccion, contacto, telefono, nit, rnt, lmc, demas, primerDeposito, segundoDeposito, zona, asesor, tipoBase, porcentajeIva, rteFuente, rteIca FROM clientes');
        const clientes = rows.map(cliente => {
            const { id, nombre, ciudad, correo, direccion, contacto, telefono, nit, rnt, lmc, demas, primerDeposito, segundoDeposito, zona, asesor, tipoBase, porcentajeIva, rteFuente, rteIca } = cliente;
            return {
                id,
                nombre,
                ciudad,
                correo,
                direccion,
                contacto,
                telefono,
                nit,
                rnt,
                lmc,
                demas,
                primerDeposito,
                segundoDeposito,
                zona,
                asesor,
                tipoBase,
                porcentajeIva,
                rteFuente,
                rteIca
            };
        });
        res.status(200).json(clientes);
    } catch (error) {
        res.status(500).json({ error: "Error interno del servidor" });
    } finally {
        if (conn) conn.end();
    }
}
async function createCliente(req, res) {
    const { nombre, ciudad, correo, direccion, contacto, telefono, nit, rnt, lmc, demas, primerDeposito, segundoDeposito, zona, asesor, tipoBase, porcentajeIva, rteFuente, rteIca } = req.body;
    const conn = await connect();
    try {
        const [result] = await conn.query('INSERT INTO clientes (nombre, ciudad, correo, direccion, contacto, telefono, nit, rnt, lmc, demas, primerDeposito, segundoDeposito, zona, asesor, tipoBase, porcentajeIva, rteFuente, rteIca) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)', [nombre, ciudad, correo, direccion, contacto, telefono, nit, rnt, lmc, demas, primerDeposito, segundoDeposito, zona, asesor, tipoBase, porcentajeIva, rteFuente, rteIca]);
        const newCliente = { id: result.insertId, nombre, ciudad, correo, direccion, contacto, telefono, nit, rnt, lmc, demas, primerDeposito, segundoDeposito, zona, asesor, tipoBase, porcentajeIva, rteFuente, rteIca };
        res.status(201).json(newCliente);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Error al crear el cliente" });
    } finally {
        if (conn) conn.end();
    }
}
async function updateCliente(req, res) {
    const clienteId = parseInt(req.params.id, 10);
    const { nombre, ciudad, correo, direccion, contacto, telefono, nit, rnt, lmc, demas, primerDeposito, segundoDeposito, zona, asesor, tipoBase, porcentajeIva, rteFuente, rteIca } = req.body;
    const conn = await connect();
    try {
        await conn.query('UPDATE clientes SET nombre = ?, ciudad = ?, correo = ?, direccion = ?, contacto = ?, telefono = ?, nit = ?, rnt = ?, lmc = ?, demas = ?, primerDeposito = ?, segundoDeposito = ?, zona = ?, asesor = ?, tipoBase = ?, porcentajeIva = ?, rteFuente = ?, rteIca = ? WHERE id = ?', [nombre, ciudad, correo, direccion, contacto, telefono, nit, rnt, lmc, demas, primerDeposito, segundoDeposito, zona, asesor, tipoBase, porcentajeIva, rteFuente, rteIca, clienteId]);
        res.status(200).json({ id: clienteId, nombre, ciudad, correo, direccion, contacto, telefono, nit, rnt, lmc, demas, primerDeposito, segundoDeposito, zona, asesor, tipoBase, porcentajeIva, rteFuente, rteIca });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Error al actualizar el cliente" });
    } finally {
        if (conn) conn.end();
    }
}

async function deleteCliente(req, res) {
    const clienteId = parseInt(req.params.id, 10);
    const conn = await connect();
    try {
        await conn.query('DELETE FROM clientes WHERE id = ?', [clienteId]);
        res.status(200).json({ success: "Cliente eliminado correctamente" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Error al eliminar el cliente" });
    } finally {
        if (conn) conn.end();
    }
}


async function buscarClientePorNombre(req, res) {
    const nombre = req.params.nombre;
    
    // Verificar si el parámetro está presente
    if (!nombre) {
        return res.status(400).json({ error: "Se requiere el parámetro 'nombre' en la URL" });
    }

    const conn = await connect();
    try {
        const [rows] = await conn.query('SELECT id, nombre, ciudad, correo, direccion, contacto, telefono, nit, rnt, lmc, demas, primerDeposito, segundoDeposito, zona, asesor, tipoBase, porcentajeIva, rteFuente, rteIca FROM clientes WHERE nombre = ?', [nombre]);
        const clientes = rows.map(cliente => {
            const { id, nombre, ciudad, correo, direccion, contacto, telefono, nit, rnt, lmc, demas, primerDeposito, segundoDeposito, zona, asesor, tipoBase, porcentajeIva, rteFuente, rteIca } = cliente;
            return {
                id,
                nombre,
                ciudad,
                correo,
                direccion,
                contacto,
                telefono,
                nit,
                rnt,
                lmc,
                demas,
                primerDeposito,
                segundoDeposito,
                zona,
                asesor,
                tipoBase,
                porcentajeIva,
                rteFuente,
                rteIca
            };
        });
        res.status(200).json(clientes);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Error interno del servidor" });
    } finally {
        if (conn) conn.end();
    }
}









