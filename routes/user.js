const express = require("express");
const connect = require('../database');
const bcrypt = require('bcrypt');
const router = express.Router();

router.get("/", getUser);
router.get("/username/:usuario", getUserByUsername);
router.post("/", createUser);
router.put("/:id", updateUser);
router.delete("/:id", deleteUser);
router.get("/:id", getUserDataById);
router.get("/zona/zona", getUsersWithZona);



module.exports = (app) => app.use("/user", router);

async function getUserDataById(req, res) {
    const userId = parseInt(req.params.id, 10); // Obtener el ID de usuario de los parámetros de la solicitud
    const conn = await connect();
    try {
        const [rows] = await conn.query('SELECT * FROM usuarios WHERE id = ?', [userId]);
        if (rows.length === 0) {
            return res.status(404).json({}); // Devolver un objeto vacío si no se encuentra el usuario
        }
        const user = rows[0];
        const { nombreCompleto, usuario, activo, rol, zona } = user;
        res.json({ id: userId, nombreCompleto, usuario, contrasena: '********', activo, rol, zona });
    } catch (error) {
        console.error(error);
        res.status(500).json({}); // Devolver un objeto vacío en caso de error
    } finally {
        if (conn) conn.end();
    }
}
async function getUser(req, res) {
    const conn = await connect();
    try {
        const [rows] = await conn.query('SELECT * FROM usuarios');
        const users = rows.map(user => {
            const { id, nombreCompleto, usuario, activo, rol, zona } = user;
            return {
                id,
                nombreCompleto,
                usuario,
                contrasena: '********', // Mostrar la contraseña como asteriscos
                activo,
                rol,
                zona
            };
        });
        res.status(200).json(users);
    } catch (error) {
        res.status(500).json({ error: "Internal server error" });
    } finally {
        if (conn) conn.end();
    }
}

  async function createUser(req, res) {
    const { nombreCompleto, usuario, contrasena, activo, rol, zona } = req.body;
    const conn = await connect();
    try {
        // Generar el hash de la contraseña
        const hashedPassword = await bcrypt.hash(contrasena, 10);
        const [result] = await conn.query('INSERT INTO usuarios (nombreCompleto, usuario, contrasena, activo, rol, zona) VALUES (?, ?, ?, ?, ?, ?)', [nombreCompleto, usuario, hashedPassword, activo, rol, zona]);
        const newUser = { id: result.insertId, nombreCompleto, usuario, activo, rol };
        res.status(201).json(newUser);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Error al crear el usuario" });
    } finally {
        if (conn) conn.end();
    }
}

async function updateUser(req, res) {
    const userId = parseInt(req.params.id, 10);
    const { nombreCompleto, usuario, contrasena, activo, rol, zona } = req.body;
    const conn = await connect();
    try {
        // Si se proporciona una nueva contraseña, hashearla antes de actualizarla
        let hashedPassword = contrasena;
        if (contrasena) {
            hashedPassword = await bcrypt.hash(contrasena, 10);
        }

        await conn.query('UPDATE usuarios SET nombreCompleto = ?, usuario = ?, contrasena = ?, activo = ?, rol = ?, zona = ? WHERE id = ?', [nombreCompleto, usuario, hashedPassword, activo, rol, zona,  userId]);
        res.status(200).json({ id: userId, nombreCompleto, usuario, contrasena: hashedPassword, activo, rol, zona });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Error al actualizar el usuario" });
    } finally {
        if (conn) conn.end();
    }
}

async function deleteUser(req, res) {
    const userId = parseInt(req.params.id, 10);
    const conn = await connect();
    try {
        await conn.query('DELETE FROM usuarios WHERE id = ?', [userId]);
        res.status(200).json({ success: "Usuario eliminado correctamente" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Error al eliminar el usuario" });
    } finally {
        if (conn) conn.end();
    }
}

async function getUserByUsername(req, res) {
    const { usuario } = req.params; // Obtener el nombre de usuario de los parámetros de la solicitud
    const conn = await connect();
    try {
        const [rows] = await conn.query('SELECT * FROM usuarios WHERE usuario = ?', [usuario]);
        if (rows.length === 0) {
            return res.status(404).json({ error: "Usuario no encontrado" });
        }
        const user = rows[0];
        const { id, nombreCompleto, activo, rol, zona } = user;
        res.status(200).json({ id, nombreCompleto, usuario, contrasena: '********', activo, rol, zona });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Error interno del servidor" });
    } finally {
        if (conn) conn.end();
    }
}
async function getUsersWithZona(req, res) {
    const conn = await connect();
    try {
        const [rows] = await conn.query('SELECT * FROM usuarios WHERE zona IS NOT NULL AND zona <> ""');
        const users = rows.map(user => {
            const { id, nombreCompleto, usuario, activo, rol, zona } = user;
            return {
                id,
                nombreCompleto,
                usuario,
                contrasena: '********', // Mostrar la contraseña como asteriscos
                activo,
                rol,
                zona
            };
        });
        res.status(200).json(users);
    } catch (error) {
        res.status(500).json({ error: "Error interno del servidor" });
    } finally {
        if (conn) conn.end();
    }
}