const express = require("express");
const connect = require('../database'); // lo mantenemos tal cual
const cors = require("cors");
const router = express.Router();

module.exports = (app) => app.use("/cotizacion", router);

router.post('/cotizaciones', async (req, res) => {
  try {
    const { tipo } = req.body; // "normales", "cristal", "personalizadas"
    let tabla = '';

    switch(tipo) {
      case 'normales':
        tabla = 'cotizacion';
        break;
      case 'cristal':
        tabla = 'cotizacion_caño_cristal';
        break;
      case 'personalizadas':
        tabla = 'habitacionescotizacion';
        break;
      default:
        return res.status(400).json({ error: 'Tipo de cotización inválido' });
    }

    const connection = await connect();
    const [cotizaciones] = await connection.query(
      `SELECT * FROM ${tabla}`
    );

    res.json(cotizaciones);
  } catch (error) {
    console.error('Error al obtener cotizaciones:', error);
    res.status(500).json({ error: 'Error al obtener cotizaciones' });
  }
});


router.post('/lista', async (req, res) => {
  const { destino, hotel, cliente } = req.body;

  try {
    const connection = await connect();

    // 0. Si se pide lista de clientes
    if (cliente === true) {
      const [clientes] = await connection.query(`
        SELECT DISTINCT nombre
        FROM clientes
        WHERE nombre IS NOT NULL AND nombre != ''
        ORDER BY nombre
      `);

      const nombresClientes = clientes.map(c => c.nombre);
      return res.json({ clientes: nombresClientes });
    }

    // 0.1. Si se pide el correo de un cliente específico
      if (typeof cliente === 'string' && cliente.trim() !== '') {
        const [resultado] = await connection.query(`
          SELECT correo
          FROM clientes
          WHERE nombre = ?
          LIMIT 1
        `, [cliente]);

        if (resultado.length > 0) {
          return res.json({ correo: resultado[0].correo });
        } else {
          return res.json({ correo: null });
        }
      }

    // 1. Si no hay destino ni hotel → devolver destinos únicos
    if (!destino && !hotel) {
      const [destinos] = await connection.query(`
        SELECT DISTINCT destino AS nombre
        FROM hoteles
        WHERE destino IS NOT NULL AND destino != ''
        ORDER BY destino
      `);

      return res.json({ destinos });
    }

    // 2. Si viene un destino válido pero no un hotel → devolver hoteles del destino
    if (destino && !hotel) {
      const [hoteles] = await connection.query(`
        SELECT DISTINCT hotel
        FROM hoteles
        WHERE destino = ?
        ORDER BY hotel
      `, [destino]);

      return res.json({ hoteles });
    }

    // 3. Si viene el nombre de un hotel → devolver tipos de habitación
    if (hotel) {
      const [habitaciones] = await connection.query(`
        SELECT DISTINCT tipoHabitacion
        FROM hoteles  
        WHERE hotel = ?
        ORDER BY tipoHabitacion
      `, [hotel]);

      const tiposHabitacion = habitaciones.map(h => h.tipoHabitacion);
      return res.json({ tiposHabitacion });
    }

  } catch (error) {
    console.error('Error al obtener datos:', error);
    res.status(500).json({ error: 'Error al obtener datos' });
  }
});



