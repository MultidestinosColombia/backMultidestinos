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
        tabla = 'cotizacion_personalizadas';
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
  const { destino, hotel, cliente, asesor, start, end } = req.body;

  try {
    const connection = await connect();

    // 0. llamado de usuarios con el rol Asesor
    if (asesor === true) {
      const [asesores] = await connection.query(`
        SELECT DISTINCT nombreCompleto
        FROM usuarios
        WHERE rol = 'Asesor' AND nombreCompleto IS NOT NULL AND nombreCompleto != ''
        ORDER BY nombreCompleto
      `);

      const nombresAsesores = asesores.map(u => u.nombreCompleto);
      return res.json({ asesores: nombresAsesores });
    }



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
    
    // 0.3.  devolver cantidad de noches desde columna
    if (req.body.soloNoches === true && hotel) {
      const [resultado] = await connection.query(`
        SELECT DISTINCT noches
        FROM hoteles
        WHERE hotel = ?
        ORDER BY noches
      `, [hotel]);

      if (resultado.length > 0) {
        const nochesDisponibles = resultado.map(row => row.noches);
        return res.json({ noches: nochesDisponibles });
      } else {
        return res.json({ noches: [] });
      }
    }



    // 0.2. Si vienen fechas y destino → devolver programas desde `hoteles`
    if (start && end && destino) {
      const [programas] = await connection.query(`
        SELECT nombrePrograma, COUNT(*) AS total
        FROM hoteles
        WHERE destino = ?
          AND FechaInicio <= ?
          AND FechaFin >= ?
        GROUP BY nombrePrograma
        ORDER BY total DESC
      `, [destino, end, start]);

      return res.json({ programas });
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


router.post('/Guardar_Cotizacion', async (req, res) => {
  let conn;
  try {
    conn = await connect();
    const body = req.body;
    
    // Función auxiliar para formatear fechas
    const formatDate = (dateString) => {
      if (!dateString) return null;
      const date = new Date(dateString);
      return date.toISOString().slice(0, 19).replace('T', ' ');
    };

    // Función auxiliar para formatear horas
    const formatTime = (timeString) => {
      if (!timeString) return null;
      // Si ya está en formato HH:MM:SS, devolverlo tal como está
      if (timeString.includes(':') && timeString.length >= 5) {
        return timeString.length === 5 ? `${timeString}:00` : timeString;
      }
      return null;
    };

    // Calcular totales de pasajeros
    const totalAdultos = body.habitaciones?.reduce((total, h) => total + (parseInt(h.adultos) || 0), 0) || 0;
    const totalNinos = body.habitaciones?.reduce((total, h) => total + (parseInt(h.ninos) || 0), 0) || 0;
    const totalPasajeros = totalAdultos + totalNinos;

    // Procesar escalas para el campo extra2 (escalas complejas)
    const escalasCompletas = {
      ida: body.escalas?.ida || null,
      regreso: body.escalas?.regreso || null,
      idaYRegreso: body.escalas?.idaYRegreso || null
    };

    // Procesar opciones adicionales
    const opcionesAdicionales = {
      asesorExterno: body.opciones?.asesorExterno || { activo: false, asesor: null },
      nocheAdicional: body.opciones?.nocheAdicional || { activo: false, motivo: null },
      suplemento: body.opciones?.suplemento || { activo: false, tipo: null }
    };

    const cotizacion = {
      // Información básica del viaje
      salida: body.ciudadSalida || '',
      destino: body.destino || '',
      nombrePrograma: body.programa || '',
      hotel: body.hotel || '',
      noches: parseInt(body.duracionNoches) || 0,
      
      // Información de pasajeros
      totalAdultos: totalAdultos,
      totalNinos: totalNinos,
      totalPasajeros: totalPasajeros,
      
      // Información del cliente
      correoCliente: body.correoCliente || '',
      cliente: body.cliente || '',
      correo: body.correoCliente || '', // Campo duplicado para compatibilidad
      telefono: body.telefono || '',
      
      // Fechas
      fechaCreacion: formatDate(body.fechaCreacion) || formatDate(new Date().toISOString()),
      fechaInicio: formatDate(body.fechaInicio),
      fechaFin: formatDate(body.fechaFin),
      
      // Vuelo de ida
      aerolineaIda: body.vueloIda?.aerolinea || '',
      vueloIda: body.vueloIda?.numeroVuelo || '',
      horaSalidaIda: formatTime(body.vueloIda?.horaSalida),
      horaLlegadaIda: formatTime(body.vueloIda?.horaLlegada),
      claseIda: body.vueloIda?.clase || '',
      
      // Vuelo de vuelta
      aerolineaVuelta: body.vueloVuelta?.aerolinea || '',
      vueloVuelta: body.vueloVuelta?.numeroVuelo || '',
      horaSalidaVuelta: formatTime(body.vueloVuelta?.horaSalida),
      horaLlegadaVuelta: formatTime(body.vueloVuelta?.horaLlegada),
      claseVuelta: body.vueloVuelta?.clase || '',
      
      // Escalas de ida
      aerolineaEscalaIda: body.escalas?.ida?.aerolinea || '',
      vueloEscalaIda: body.escalas?.ida?.numeroVuelo || '',
      horaSalidaEscalaIda: formatTime(body.escalas?.ida?.horaSalida),
      horaLlegadaEscalaIda: formatTime(body.escalas?.ida?.horaLlegada),
      claseEscalaIda: body.escalas?.ida?.clase || '',
      
      // Escalas de vuelta
      aerolineaEscalaVuelta: body.escalas?.regreso?.aerolinea || '',
      vueloEscalaVuelta: body.escalas?.regreso?.numeroVuelo || '',
      horaSalidaEscalaVuelta: formatTime(body.escalas?.regreso?.horaSalida),
      horaLlegadaEscalaVuelta: formatTime(body.escalas?.regreso?.horaLlegada),
      claseEscalaVuelta: body.escalas?.regreso?.clase || '',
      
      // Información adicional
      suplemento: body.opciones?.suplemento?.tipo || '',
      transfer: body.transferencia || '',
      transferencia: body.transferencia || '', // Campo duplicado para compatibilidad
      asesorExterno: body.opciones?.asesorExterno?.asesor || '',
      nochesAdicionales: body.opciones?.nocheAdicional?.motivo || '',
      
      // Precios y valores
      valoresExtra: parseInt(body.valoresExtra) || 0,
      precioTrans: body.precioTransferencia || '',
      
      // Incluye y no incluye
      incluye: body.incluye || '',
      noIncluye: body.noIncluye || '',
      
      // Estado y metadatos
      status: body.estado || 'pendiente',
      tipo: body.tipo || 'normales',
      creadorCotizacion: body.creadorCotizacion || '',
      
      // Campos adicionales en JSON
      extra1: JSON.stringify(body.habitaciones || []), // Información de habitaciones
      extra2: JSON.stringify(escalasCompletas), // Información completa de escalas
      otros: JSON.stringify(opcionesAdicionales), // Opciones adicionales completas
      
      // Campos adicionales que podrían existir en la tabla
      numeroHabitaciones: parseInt(body.numeroHabitaciones) || body.habitaciones?.length || 1,
      observaciones: body.observaciones || '',
      descuentos: body.descuentos || '',
      impuestos: body.impuestos || '',
      total: body.total || 0,
      moneda: body.moneda || 'COP'
    };

    // Ejecutar la inserción
    const [result] = await conn.query("INSERT INTO cotizacion SET ?", [cotizacion]);
    
    console.log('Cotización guardada exitosamente:', {
      id: result.insertId,
      totalCampos: Object.keys(cotizacion).length,
      cliente: cotizacion.cliente,
      destino: cotizacion.destino
    });

    res.status(201).json({ 
      success: true, 
      message: 'Cotización guardada correctamente', 
      id: result.insertId,
      totalCampos: Object.keys(cotizacion).length
    });
    
  } catch (error) {
    console.error('Error al guardar cotización:', error);
    
    // Log detallado del error para debugging
    console.error('Datos recibidos:', JSON.stringify(req.body, null, 2));
    
    res.status(500).json({ 
      success: false, 
      message: 'Error al guardar cotización', 
      error: error.message,
      details: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  } finally {
    if (conn) await conn.end();
  }
});


