const express = require("express");
const connect = require('../database');
const bcrypt = require('bcrypt');
const router = express.Router();

// Rutas
router.get("/", getUser);
router.get("/username/:usuario", getUserByUsername);
router.post("/", createUser);
router.put("/:id", updateUser);
router.delete("/:id", deleteUser);
router.get("/:id", getUserDataById);
router.get("/zona/zona", getUsersWithZona);

module.exports = (app) => app.use("/user", router);

// Obtener todos los usuarios
async function getUser(req, res) {
  const conn = await connect();
  try {
    const [rows] = await conn.query('SELECT * FROM usuarios');
    const users = rows.map(user => {
      const { id, nombreCompleto, usuario, activo, rol, zona, email, imagenPerfil } = user;
      return {
        id,
        nombreCompleto,
        usuario,
        email,
        contrasena: '********',
        activo,
        rol,
        zona,
        imagenPerfil
      };
    });
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ error: "Error interno del servidor" });
  } finally {
    if (conn) conn.end();
  }
}

// Obtener usuario por ID
async function getUserDataById(req, res) {
  const userId = parseInt(req.params.id, 10);
  const conn = await connect();
  try {
    const [rows] = await conn.query('SELECT * FROM usuarios WHERE id = ?', [userId]);
    if (rows.length === 0) {
      return res.status(404).json({});
    }
    const user = rows[0];
    const { nombreCompleto, usuario, activo, rol, zona, email, imagenPerfil } = user;
    res.json({
      id: userId,
      nombreCompleto,
      usuario,
      email,
      contrasena: '********',
      activo,
      rol,
      zona,
      imagenPerfil
    });
  } catch (error) {
    res.status(500).json({});
  } finally {
    if (conn) conn.end();
  }
}

// Obtener usuario por nombre de usuario
async function getUserByUsername(req, res) {
  const { usuario } = req.params;
  const conn = await connect();
  try {
    const [rows] = await conn.query('SELECT * FROM usuarios WHERE usuario = ?', [usuario]);
    if (rows.length === 0) {
      return res.status(404).json({ error: "Usuario no encontrado" });
    }
    const user = rows[0];
    const { id, nombreCompleto, activo, rol, zona, email, imagenPerfil } = user;
    res.status(200).json({
      id,
      nombreCompleto,
      usuario,
      email,
      contrasena: '********',
      activo,
      rol,
      zona,
      imagenPerfil
    });
  } catch (error) {
    res.status(500).json({ error: "Error interno del servidor" });
  } finally {
    if (conn) conn.end();
  }
}

// Obtener usuarios con zona asignada
async function getUsersWithZona(req, res) {
  const conn = await connect();
  try {
    const [rows] = await conn.query('SELECT * FROM usuarios WHERE zona IS NOT NULL AND zona <> ""');
    const users = rows.map(user => {
      const { id, nombreCompleto, usuario, activo, rol, zona, email, imagenPerfil } = user;
      return {
        id,
        nombreCompleto,
        usuario,
        email,
        contrasena: '********',
        activo,
        rol,
        zona,
        imagenPerfil
      };
    });
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ error: "Error interno del servidor" });
  } finally {
    if (conn) conn.end();
  }
}

// Crear usuario
async function createUser(req, res) {
  const { nombreCompleto, usuario, contrasena, activo, rol, zona, email, imagenPerfil } = req.body;
  const conn = await connect();
  try {
    const hashedPassword = await bcrypt.hash(contrasena, 10);
    const [result] = await conn.query(
      'INSERT INTO usuarios (nombreCompleto, usuario, contrasena, activo, rol, zona, email, imagenPerfil) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
      [nombreCompleto, usuario, hashedPassword, activo, rol, zona, email, imagenPerfil]
    );
    const newUser = {
      id: result.insertId,
      nombreCompleto,
      usuario,
      email,
      activo,
      rol,
      zona,
      imagenPerfil
    };
    res.status(201).json(newUser);
  } catch (error) {
    res.status(500).json({ error: "Error al crear el usuario" });
  } finally {
    if (conn) conn.end();
  }
}

// Actualizar usuario
async function updateUser(req, res) {
  const userId = parseInt(req.params.id, 10);
  const { nombreCompleto, usuario, contrasena, activo, rol, zona, email, imagenPerfil } = req.body;
  const conn = await connect();
  try {
    let query, values;
    if (contrasena && contrasena.trim() !== '') {
      const hashedPassword = await bcrypt.hash(contrasena, 10);
      query = `UPDATE usuarios SET nombreCompleto = ?, usuario = ?, contrasena = ?, activo = ?, rol = ?, zona = ?, email = ?, imagenPerfil = ? WHERE id = ?`;
      values = [nombreCompleto, usuario, hashedPassword, activo, rol, zona, email, imagenPerfil, userId];
    } else {
      query = `UPDATE usuarios SET nombreCompleto = ?, usuario = ?, activo = ?, rol = ?, zona = ?, email = ?, imagenPerfil = ? WHERE id = ?`;
      values = [nombreCompleto, usuario, activo, rol, zona, email, imagenPerfil, userId];
    }

    await conn.query(query, values);

    res.status(200).json({
      id: userId,
      nombreCompleto,
      usuario,
      email,
      contrasena: '********',
      activo,
      rol,
      zona,
      imagenPerfil
    });
  } catch (error) {
    res.status(500).json({ error: "Error al actualizar el usuario" });
  } finally {
    if (conn) conn.end();
  }
}

// Eliminar usuario
async function deleteUser(req, res) {
  const userId = parseInt(req.params.id, 10);
  const conn = await connect();
  try {
    await conn.query('DELETE FROM usuarios WHERE id = ?', [userId]);
    res.status(200).json({ success: "Usuario eliminado correctamente" });
  } catch (error) {
    res.status(500).json({ error: "Error al eliminar el usuario" });
  } finally {
    if (conn) conn.end();
  }
}