const express = require("express");
const cors = require("cors");
const connect = require("../database"); // Tu conexión a MySQL
const multer = require("multer");
const fs = require("fs");
const path = require("path");

const router = express.Router();

// Configurar Multer para subir archivos PDF
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const dir = "uploads/";
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir);
    }
    cb(null, dir);
  },
  filename: function (req, file, cb) {
    const ext = path.extname(file.originalname);
    const uniqueName = `${Date.now()}-${Math.round(Math.random() * 1e9)}${ext}`;
    cb(null, uniqueName);
  }
});

const upload = multer({
  storage: storage,
  fileFilter: (req, file, cb) => {
    if (file.mimetype === "application/pdf") {
      cb(null, true);
    } else {
      cb(new Error("Solo se permiten archivos PDF"));
    }
  }
});

// Ruta para registrar un pago
router.post("/registrar", upload.single("archivo"), async (req, res) => {
  try {
    const { nombre, pasajeros, servicio, montoPendiente, montoPagado, estado, Area } = req.body;
    const archivo = req.file;

    if (!archivo) {
      return res.status(400).json({ error: "Archivo PDF requerido" });
    }

    const connection = await connect();
    const [result] = await connection.execute(
      `INSERT INTO liquidacion_costos (nombre, pasajeros, servicio, montoPendiente, montoPagado, estado, Area, archivo) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [nombre, pasajeros, servicio, montoPendiente, montoPagado, estado, Area, archivo.filename]
    );

    res.status(200).json({ mensaje: "Pago registrado exitosamente", id: result.insertId });
  } catch (error) {
    console.error("Error al registrar pago:", error);
    res.status(500).json({ error: "Error al registrar el pago" });
  }
});


// Ruta para listar pagos
router.get("/listar", async (req, res) => {
    try {
      const connection = await connect();
      const [rows] = await connection.execute("SELECT * FROM liquidacion_costos");
      res.status(200).json(rows);
    } catch (error) {
      console.error("Error al listar pagos:", error);
      res.status(500).json({ error: "Error al obtener los pagos" });
    }
  });


  // Ruta para modificar un pago
router.put("/modificar/:id", upload.single("archivo"), async (req, res) => {
    try {
      const { nombre, pasajeros, servicio, montoPendiente, montoPagado, estado, Area } = req.body;
      const archivo = req.file;
      const { id } = req.params;
  
      const connection = await connect();
  
      // Si hay un archivo nuevo, actualizamos también la columna
      if (archivo) {
        await connection.execute(
          `UPDATE liquidacion_costos SET nombre = ?, pasajeros = ?, servicio = ?, montoPendiente = ?, montoPagado = ?, estado = ?, Area = ?, archivo = ? WHERE id = ?`,
          [nombre, pasajeros, servicio, montoPendiente, montoPagado, estado, Area, archivo.filename, id]
        );
      } else {
        await connection.execute(
          `UPDATE liquidacion_costos SET nombre = ?, pasajeros = ?, servicio = ?, montoPendiente = ?, montoPagado = ?, estado = ?, Area = ? WHERE id = ?`,
          [nombre, pasajeros, servicio, montoPendiente, montoPagado, estado, Area, id]
        );
      }
  
      res.status(200).json({ mensaje: "Pago actualizado correctamente" });
    } catch (error) {
      console.error("Error al modificar pago:", error);
      res.status(500).json({ error: "Error al modificar el pago" });
    }
  });
  
  // Ruta para eliminar un pago
  router.delete("/eliminar/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const connection = await connect();
  
      // Opcional: Obtener archivo para eliminar físicamente si quieres
      const [rows] = await connection.execute(
        `SELECT archivo FROM liquidacion_costos WHERE id = ?`,
        [id]
      );
      if (rows.length > 0 && rows[0].archivo) {
        const filePath = path.join(__dirname, "../uploads", rows[0].archivo);
        if (fs.existsSync(filePath)) {
          fs.unlinkSync(filePath);
        }
      }
  
      await connection.execute(`DELETE FROM liquidacion_costos WHERE id = ?`, [id]);
      res.status(200).json({ mensaje: "Pago eliminado correctamente" });
    } catch (error) {
      console.error("Error al eliminar pago:", error);
      res.status(500).json({ error: "Error al eliminar el pago" });
    }
  });
  
  

module.exports = (app) => app.use("/Liquidacion_Costos", router);
