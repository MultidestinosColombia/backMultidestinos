const express = require("express");
const connect = require("../database");
const ExcelJS = require('exceljs');
const multer = require('multer');
const router = express.Router();

module.exports = (app) => app.use("/planes", router);

// ====================================== llama los datos de las tablas ================== //

router.get('/Lista', async (req, res) => {
  try {
    const connection = await connect()

    const [hoteles] = await connection.query('SELECT * FROM hoteles')
    const [transportes] = await connection.query('SELECT * FROM transportes')
    const [tiquetes] = await connection.query('SELECT * FROM tiquete')

    res.json({
      hoteles,
      transportes,
      tiquetes
    })
  } catch (error) {
    console.error('Error al obtener listas:', error)
    res.status(500).json({ error: 'Error al obtener las listas' })
  }
})

// ====================================== Elimina un dato en especifico dependiendo la tabla ================== //

router.delete('/eliminar/:tipo/:id', async (req, res) => {
  const { tipo, id } = req.params

  // Mostrar qué se recibe
  console.log('🔁 Solicitud DELETE recibida')
  console.log('📦 Parámetros recibidos:', { tipo, id })

  const tablasValidas = {
    hotel: 'hoteles',
    transporte: 'transportes',
    tiquete: 'tiquete'
  }

  // Validar tipo
  if (!tablasValidas[tipo]) {
    console.warn('⚠️ Tipo inválido:', tipo)
    return res.status(400).json({ error: 'Tipo inválido' })
  }

  try {
    const connection = await connect()
    const tabla = tablasValidas[tipo]

    console.log(`📋 Ejecutando DELETE en la tabla: ${tabla}, con ID: ${id}`)

    const [result] = await connection.query(`DELETE FROM \`${tabla}\` WHERE id = ?`, [id])

    console.log('📊 Resultado de la eliminación:', result)

    if (result.affectedRows === 0) {
      console.warn('❌ No se encontró el registro con ese ID')
      return res.status(404).json({ error: `${tipo} no encontrado` })
    }

    console.log('✅ Eliminación exitosa')
    res.json({ message: `${tipo} eliminado correctamente` })
  } catch (error) {
    console.error(`💥 Error al eliminar ${tipo}:`, error)
    res.status(500).json({ error: `Error al eliminar ${tipo}` })
  }
})


// ================================================================================ Obtener y actualizar por ID ==================================================//

const tablasValidas = {
  hotel: 'hoteles',
  transporte: 'transportes',
  tiquete: 'tiquete'
};

router.route('/:tipo/:id')

  // Obtener por ID (GET)
  .get(async (req, res) => {
    const { tipo, id } = req.params;

    if (!tablasValidas[tipo]) {
      return res.status(400).json({ success: false, error: 'Tipo inválido' });
    }

    try {
      const connection = await connect();
      const tabla = tablasValidas[tipo];
      const [result] = await connection.query(`SELECT * FROM \`${tabla}\` WHERE id = ?`, [id]);

      if (result.length === 0) {
        return res.status(404).json({ success: false, error: `${tipo} no encontrado` });
      }

      // Formatear las fechas para que el frontend las reciba en 'YYYY-MM-DD'
      const data = result[0];

      // Validar y convertir FechaInicio y FechaFin si existen
      if (data.FechaInicio) {
        data.FechaInicio = new Date(data.FechaInicio).toISOString().split('T')[0];
      } else {
        data.FechaInicio = ''; // para que el input date quede vacío
      }

      if (data.FechaFin) {
        data.FechaFin = new Date(data.FechaFin).toISOString().split('T')[0];
      } else {
        data.FechaFin = '';
      }

      res.json({ success: true, data });
    } catch (error) {
      console.error(`Error al obtener ${tipo} por ID:`, error);
      res.status(500).json({ success: false, error: `Error al obtener ${tipo}` });
    }
  })


  // Actualizar por ID (PUT)
  .put(async (req, res) => {
    const { tipo, id } = req.params;
    const data = req.body;

    if (!tablasValidas[tipo]) {
      return res.status(400).json({ success: false, error: 'Tipo inválido' });
    }

    try {
      const connection = await connect();
      const tabla = tablasValidas[tipo];

      const campos = Object.keys(data).map(campo => `\`${campo}\` = ?`).join(', ');
      const valores = Object.values(data);

      const [result] = await connection.query(
        `UPDATE \`${tabla}\` SET ${campos} WHERE id = ?`,
        [...valores, id]
      );

      if (result.affectedRows === 0) {
        return res.status(404).json({ success: false, error: `${tipo} no encontrado` });
      }

      res.json({ success: true, message: `${tipo} actualizado correctamente` });
    } catch (error) {
      console.error(`Error al actualizar ${tipo}:`, error);
      res.status(500).json({ success: false, error: `Error al actualizar ${tipo}` });
    }
  });

  // ================================================================== Guardar Hoteles uno por uno ============================================================= //

  router.post('/Guardar_Hoteles', async (req, res) => {
  // Función para formatear fecha a 'YYYY-MM-DD'
  const formatDate = date => {
    if (!date) return null;
    const d = new Date(date);
    return d.toISOString().split('T')[0];
  };

  // Función para convertir a número o 0 si no es válido
  const toNumber = val => Number(val) || 0;

  let conn;
  try {
    conn = await connect();
    const body = req.body;

    const nuevoHotel = {
      pertenece: body.pertenece,
      destino: body.destino,
      nombrePrograma: body.nombrePrograma,
      hotel: body.hotel,
      plan: body.plan,
      noches: body.noches,
      tipoHabitacion: body.tipoHabitacion,
      FechaInicio: formatDate(body.FechaInicio),
      FechaFin: formatDate(body.FechaFin),
      sencilla: toNumber(body.sencilla),
      doble: toNumber(body.doble),
      triple: toNumber(body.triple),
      cuadruple: toNumber(body.cuadruple),
      niño: toNumber(body.niño),
      nocheAdicionalsencilla: toNumber(body.nocheAdicionalsencilla),
      nocheAdicionaldoble: toNumber(body.nocheAdicionaldoble),
      nocheAdicionaltriple: toNumber(body.nocheAdicionaltriple),
      nocheAdicionalcuadruple: toNumber(body.nocheAdicionalcuadruple),
      nocheAdicionalniño: toNumber(body.nocheAdicionalniño),
      incluye: body.incluye || '',
      noIncluye: body.noIncluye || ''
    };

    const [result] = await conn.query("INSERT INTO hoteles SET ?", [nuevoHotel]);

    res.status(201).json({ success: true, message: 'Hotel guardado exitosamente', insertId: result.insertId });
  } catch (error) {
    console.error('Error al guardar hotel:', error);
    res.status(500).json({ success: false, message: 'Error al guardar el hotel' });
  } finally {
    if (conn) await conn.end();
  }
});

// ================================================================== Guardar Transportes uno por uno ============================================================= //

router.post('/Guardar_Transporte', async (req, res) => {
  // Función para convertir a número o 0 si no es válido
  const toNumber = val => {
    const num = Number(val);
    return isNaN(num) ? 0 : num;
  };

  // Lista de posibles campos con su tipo
  const camposNumericos = [
    'combus', 'tasa', 'iva', 'ta', 'ivaTa',
    'sencilla_ImpuestoHotel', 'doble_ImpuestoHotel', 'triple_ImpuestoHotel',
    'cuadruple_ImpuestoHotel', 'quintuple_ImpuestoHotel', 'sextuple_ImpuestoHotel','niño_ImpuestoHotel',
    'sencilla_ImpuestoIngr','doble_ImpuestoIngr','triple_ImpuestoIngr','cuadruple_ImpuestoIngr','quintuple_ImpuestoIngr','sextuple_ImpuestoIngr','niño_ImpuestoIngr', 'sencilla_Impoconsumo', 'doble_Impoconsumo',
    'triple_Impoconsumo', 'cuadruple_Impoconsumo', 'quintuple_Impoconsumo',
    'sextuple_Impoconsumo', 'niño_Impoconsumo', 'otros', 'total'
  ];

  const camposTexto = ['pertenece', 'destino'];

  let conn;
  try {
    conn = await connect();
    const body = req.body;

    // Construir solo los campos válidos
    const nuevoTransporte = {};

    camposTexto.forEach(campo => {
      if (body[campo] != null && body[campo] !== '') {
        nuevoTransporte[campo] = body[campo];
      }
    });

    camposNumericos.forEach(campo => {
      if (body[campo] != null && body[campo] !== '') {
        nuevoTransporte[campo] = toNumber(body[campo]);
      }
    });

    const [result] = await conn.query("INSERT INTO transportes SET ?", [nuevoTransporte]);

    res.status(201).json({
      success: true,
      message: 'Transporte guardado exitosamente',
      insertId: result.insertId
    });
  } catch (error) {
    console.error('Error al guardar hotel:', error);
    res.status(500).json({
      success: false,
      message: 'Error al guardar el transporte'
    });
  } finally {
    if (conn) await conn.end();
  }
});


// ================================================================== Guardar Tiquete uno por uno ============================================================= //

router.post('/Guardar_Tiquete', async (req, res) => {
  // Función para convertir a número o 0 si no es válido
  const toNumber = val => {
    const num = Number(val);
    return isNaN(num) ? 0 : num;
  };

  // Lista de posibles campos con su tipo
  const camposNumericos = [
    'neta', 'tasas', 'iva', 'total'
  ];

  const camposTexto = ['salida', 'pertenece'];

  let conn;
  try {
    conn = await connect();
    const body = req.body;

    // Construir solo los campos válidos
    const nuevoTiquete = {};

    camposTexto.forEach(campo => {
      if (body[campo] != null && body[campo] !== '') {
        nuevoTiquete[campo] = body[campo];
      }
    });

    camposNumericos.forEach(campo => {
      if (body[campo] != null && body[campo] !== '') {
        nuevoTiquete[campo] = toNumber(body[campo]);
      }
    });

    const [result] = await conn.query("INSERT INTO tiquete SET ?", [nuevoTiquete]);

    res.status(201).json({
      success: true,
      message: 'Tiquete guardado exitosamente',
      insertId: result.insertId
    });
  } catch (error) {
    console.error('Error al guardar hotel:', error);
    res.status(500).json({
      success: false,
      message: 'Error al guardar el transporte'
    });
  } finally {
    if (conn) await conn.end();
  }
});



// ================================================================== Descargas de los Exceles  ============================================================= //


router.get('/exportarDatos', async (req, res) => {
  const { tipo } = req.query;
  let query = '';
  let columnas = [];
  let nombreHoja = '';

  switch (tipo) {
    case 'tiquete':
      query = `SELECT id, salida, pertenece, neta, tasas, iva, total FROM tiquete ORDER BY id`;
      columnas = [
        { key: 'id', header: 'ID', width: 10 },
        { key: 'salida', header: 'Salida', width: 15 },
        { key: 'pertenece', header: 'Pertenece', width: 20 },
        { key: 'neta', header: 'Neta', width: 12 },
        { key: 'tasas', header: 'Tasas', width: 12 },
        { key: 'iva', header: 'IVA', width: 12 },
        { key: 'total', header: 'Total', width: 15 }
      ];
      nombreHoja = 'Tiquetes';
      break;

    case 'tiquete':
      query = `SELECT id, pertenece, destino, combus, tasa, iva, ta, ivaTa,
                      sencilla_ImpuestoHotel, doble_ImpuestoHotel, triple_ImpuestoHotel,
                      cuadruple_ImpuestoHotel, quintuple_ImpuestoHotel, sextuple_ImpuestoHotel,
                      niño_ImpuestoIngr, sencilla_Impoconsumo, doble_Impoconsumo,
                      triple_Impoconsumo, cuadruple_Impoconsumo, quintuple_Impoconsumo,
                      sextuple_Impoconsumo, niño_Impoconsumo, otros, total
               FROM transportes ORDER BY id`;
      columnas = [
        { key: 'id', header: 'ID', width: 8 },
        { key: 'pertenece', header: 'Pertenece', width: 15 },
        { key: 'destino', header: 'Destino', width: 20 },
        { key: 'combus', header: 'Combustible', width: 12 },
        { key: 'tasa', header: 'Tasa', width: 10 },
        { key: 'iva', header: 'IVA', width: 10 },
        { key: 'ta', header: 'TA', width: 10 },
        { key: 'ivaTa', header: 'IVA TA', width: 10 },
        { key: 'sencilla_ImpuestoHotel', header: 'Sencilla Imp. Hotel', width: 18 },
        { key: 'doble_ImpuestoHotel', header: 'Doble Imp. Hotel', width: 16 },
        { key: 'triple_ImpuestoHotel', header: 'Triple Imp. Hotel', width: 16 },
        { key: 'cuadruple_ImpuestoHotel', header: 'Cuádruple Imp. Hotel', width: 18 },
        { key: 'quintuple_ImpuestoHotel', header: 'Quíntuple Imp. Hotel', width: 18 },
        { key: 'sextuple_ImpuestoHotel', header: 'Séxtuple Imp. Hotel', width: 18 },
        { key: 'niño_ImpuestoIngr', header: 'Niño Imp. Ingreso', width: 16 },
        { key: 'sencilla_Impoconsumo', header: 'Sencilla Imp. Consumo', width: 20 },
        { key: 'doble_Impoconsumo', header: 'Doble Imp. Consumo', width: 18 },
        { key: 'triple_Impoconsumo', header: 'Triple Imp. Consumo', width: 18 },
        { key: 'cuadruple_Impoconsumo', header: 'Cuádruple Imp. Consumo', width: 20 },
        { key: 'quintuple_Impoconsumo', header: 'Quíntuple Imp. Consumo', width: 20 },
        { key: 'sextuple_Impoconsumo', header: 'Séxtuple Imp. Consumo', width: 20 },
        { key: 'niño_Impoconsumo', header: 'Niño Imp. Consumo', width: 16 },
        { key: 'otros', header: 'Otros', width: 12 },
        { key: 'total', header: 'Total', width: 15 }
      ];
      nombreHoja = 'Transportes';
      break;

    case 'hoteles':
      query = `SELECT id, pertenece, destino, nombrePrograma, hotel, plan, noches, tipoHabitacion,
                      sencilla, doble, triple, cuadruple, quintuple, sextuple, niño,
                      nocheAdicionalsencilla, nocheAdicionaldoble, nocheAdicionaltriple,
                      nocheAdicionalcuadruple, nocheAdicionalniño, incluye, noIncluye,
                      FechaInicio, FechaFin
               FROM hoteles ORDER BY id`;
      columnas = [
        { key: 'id', header: 'ID', width: 8 },
        { key: 'pertenece', header: 'Pertenece', width: 15 },
        { key: 'destino', header: 'Destino', width: 20 },
        { key: 'nombrePrograma', header: 'Programa', width: 25 },
        { key: 'hotel', header: 'Hotel', width: 25 },
        { key: 'plan', header: 'Plan', width: 15 },
        { key: 'noches', header: 'Noches', width: 10 },
        { key: 'tipoHabitacion', header: 'Tipo Habitación', width: 15 },
        { key: 'sencilla', header: 'Sencilla', width: 12 },
        { key: 'doble', header: 'Doble', width: 12 },
        { key: 'triple', header: 'Triple', width: 12 },
        { key: 'cuadruple', header: 'Cuádruple', width: 12 },
        { key: 'quintuple', header: 'Quíntuple', width: 12 },
        { key: 'sextuple', header: 'Séxtuple', width: 12 },
        { key: 'niño', header: 'Niño', width: 10 },
        { key: 'nocheAdicionalsencilla', header: 'Noche Adic. Sencilla', width: 18 },
        { key: 'nocheAdicionaldoble', header: 'Noche Adic. Doble', width: 16 },
        { key: 'nocheAdicionaltriple', header: 'Noche Adic. Triple', width: 16 },
        { key: 'nocheAdicionalcuadruple', header: 'Noche Adic. Cuádruple', width: 18 },
        { key: 'nocheAdicionalniño', header: 'Noche Adic. Niño', width: 14 },
        { key: 'incluye', header: 'Incluye', width: 30 },
        { key: 'noIncluye', header: 'No Incluye', width: 30 },
        { key: 'FechaInicio', header: 'Fecha Inicio', width: 12 },
        { key: 'FechaFin', header: 'Fecha Fin', width: 12 }
      ];
      nombreHoja = 'Hoteles';
      break;

    default:
      return res.status(400).json({ 
        success: false, 
        message: 'Tipo de datos inválido para exportar. Tipos válidos: tiquete, transportes, hoteles' 
      });
  }

  try {
    const conn = await connect();
    const [rows] = await conn.query(query);

    if (rows.length === 0) {
      return res.status(200).json({ 
        success: false, 
        message: `No se encontraron datos para exportar en la tabla ${tipo}` 
      });
    }

    const workbook = new ExcelJS.Workbook();
    
    // Metadatos del archivo
    workbook.creator = 'Sistema de Gestión';
    workbook.lastModifiedBy = 'Sistema de Gestión';
    workbook.created = new Date();
    workbook.modified = new Date();

    const worksheet = workbook.addWorksheet(nombreHoja);

    // Configurar columnas
    worksheet.columns = columnas;

    // Estilo para el encabezado
    const headerRow = worksheet.getRow(1);
    headerRow.height = 25;
    
    columnas.forEach((col, index) => {
      const cell = headerRow.getCell(index + 1);
      cell.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: '366092' }
      };
      cell.font = {
        color: { argb: 'FFFFFF' },
        bold: true,
        size: 11
      };
      cell.alignment = {
        vertical: 'middle',
        horizontal: 'center'
      };
      cell.border = {
        top: { style: 'thin' },
        left: { style: 'thin' },
        bottom: { style: 'thin' },
        right: { style: 'thin' }
      };
    });

    // Agregar datos con formato
    rows.forEach((row, rowIndex) => {
      const excelRow = worksheet.addRow(row);
      excelRow.height = 20;
      
      columnas.forEach((col, colIndex) => {
        const cell = excelRow.getCell(colIndex + 1);
        
        // Formatear fechas
        if ((col.key === 'FechaInicio' || col.key === 'FechaFin') && row[col.key]) {
          const fecha = new Date(row[col.key]);
          if (!isNaN(fecha.getTime())) {
            cell.value = fecha;
            cell.numFmt = 'dd/mm/yyyy';
          } else {
            cell.value = '';
          }
        }
        // Formatear números monetarios
        else if (['neta', 'tasas', 'iva', 'total', 'combus', 'tasa', 'ta', 'ivaTa', 
                  'sencilla', 'doble', 'triple', 'cuadruple', 'quintuple', 'sextuple', 'niño',
                  'nocheAdicionalsencilla', 'nocheAdicionaldoble', 'nocheAdicionaltriple',
                  'nocheAdicionalcuadruple', 'nocheAdicionalniño', 'otros'].includes(col.key)) {
          if (row[col.key] !== null && row[col.key] !== undefined && row[col.key] !== '') {
            const valor = parseFloat(row[col.key]) || 0;
            cell.value = valor;
            // Si es un número entero, usar formato sin decimales
            if (valor % 1 === 0) {
              cell.numFmt = '#,##0';
            } else {
              cell.numFmt = '#,##0.00';
            }
          } else {
            cell.value = 0;
            cell.numFmt = '#,##0';
          }
        }
        // Formatear números enteros
        else if (['noches'].includes(col.key)) {
          cell.value = parseInt(row[col.key]) || 0;
          cell.numFmt = '0';
        }
        // Texto normal
        else {
          cell.value = row[col.key] || '';
        }

        // Estilo de celda
        cell.alignment = {
          vertical: 'middle',
          horizontal: col.key === 'id' || ['neta', 'tasas', 'iva', 'total', 'combus', 'tasa', 'ta', 'ivaTa', 
                                          'sencilla', 'doble', 'triple', 'cuadruple', 'quintuple', 'sextuple', 
                                          'niño', 'otros', 'noches'].includes(col.key) ? 'right' : 'left',
          wrapText: ['incluye', 'noIncluye'].includes(col.key)
        };

        // Color alternado para filas
        if (rowIndex % 2 === 0) {
          cell.fill = {
            type: 'pattern',
            pattern: 'solid',
            fgColor: { argb: 'F8F9FA' }
          };
        }

        // Bordes
        cell.border = {
          top: { style: 'thin', color: { argb: 'E0E0E0' } },
          left: { style: 'thin', color: { argb: 'E0E0E0' } },
          bottom: { style: 'thin', color: { argb: 'E0E0E0' } },
          right: { style: 'thin', color: { argb: 'E0E0E0' } }
        };
      });
    });

    // Congelar primera fila
    worksheet.views = [
      { state: 'frozen', ySplit: 1 }
    ];

    // Auto filtro
    worksheet.autoFilter = {
      from: 'A1',
      to: `${String.fromCharCode(65 + columnas.length - 1)}1`
    };

    // Agregar hoja de información
    const infoSheet = workbook.addWorksheet('Información');
    infoSheet.addRow(['INFORMACIÓN DEL ARCHIVO']);
    infoSheet.addRow(['Tipo de datos:', tipo]);
    infoSheet.addRow(['Fecha de exportación:', new Date().toLocaleString('es-CO')]);
    infoSheet.addRow(['Total de registros:', rows.length]);
    infoSheet.addRow(['']);
    infoSheet.addRow(['INSTRUCCIONES:']);
    infoSheet.addRow(['• No modifique la columna ID - es necesaria para identificar registros']);
    infoSheet.addRow(['• Para agregar registros, deje el ID vacío']);
    infoSheet.addRow(['• Para editar registros, mantenga el ID original']);
    infoSheet.addRow(['• Para eliminar registros, elimine toda la fila']);
    infoSheet.addRow(['• Respete los formatos de fecha (DD/MM/AAAA)']);
    infoSheet.addRow(['• Los campos numéricos deben contener solo números']);

    // Estilo para la hoja de información
    infoSheet.getColumn('A').width = 25;
    infoSheet.getColumn('B').width = 30;
    infoSheet.getRow(1).font = { bold: true, size: 14 };
    infoSheet.getRow(6).font = { bold: true, size: 12 };

    // Configurar encabezados para descarga
    const timestamp = new Date().toISOString().slice(0, 19).replace(/:/g, '-');
    const filename = `${tipo}_export_${timestamp}.xlsx`;
    
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
    res.setHeader('Cache-Control', 'no-cache');

    await workbook.xlsx.write(res);
    console.log(`Excel exportado exitosamente: ${filename} - ${rows.length} registros`);
    
  } catch (error) {
    console.error('Error al exportar datos:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Error interno del servidor al exportar datos',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// ================================================================== Importar los Datos del Exceles  ============================================================= //
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB
  fileFilter: (req, file, cb) => {
    const tiposValidos = [
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'application/vnd.ms-excel'
    ];
    
    if (tiposValidos.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Solo se permiten archivos Excel (.xlsx, .xls)'), false);
    }
  }
});

// MAPEO DE COLUMNAS EXCEL -> BASE DE DATOS (sin cambios)
function obtenerMapeoColumnas(tipo) {
  const mapeos = {
    hoteles: {
      'id': 'id',
      'pertenece': 'pertenece',
      'destino': 'destino',
      'programa': 'nombrePrograma',
      'hotel': 'hotel',
      'plan': 'plan',
      'noches': 'noches',
      'tipo habitación': 'tipoHabitacion',
      'sencilla': 'sencilla',
      'doble': 'doble',
      'triple': 'triple',
      'cuádruple': 'cuadruple',
      'quíntuple': 'quintuple',
      'séxtuple': 'sextuple',
      'niño': 'niño',
      'noche adic. sencilla': 'nocheAdicionalsencilla',
      'noche adic. doble': 'nocheAdicionaldoble',
      'noche adic. triple': 'nocheAdicionaltriple',
      'noche adic. cuádruple': 'nocheAdicionalcuadruple',
      'noche adic. niño': 'nocheAdicionalniño',
      'incluye': 'incluye',
      'no incluye': 'noIncluye',
      'fecha inicio': 'FechaInicio',
      'fecha fin': 'FechaFin'
    },
    
    transportes: {
      'id': 'id',
      'pertenece': 'pertenece',
      'destino': 'destino',
      'combustible': 'combus',
      'tasa': 'tasa',
      'iva': 'iva',
      'ta': 'ta',
      'iva ta': 'ivaTa',
      'sencilla imp. hotel': 'sencilla_ImpuestoHotel',
      'doble imp. hotel': 'doble_ImpuestoHotel',
      'triple imp. hotel': 'triple_ImpuestoHotel',
      'cuádruple imp. hotel': 'cuadruple_ImpuestoHotel',
      'quíntuple imp. hotel': 'quintuple_ImpuestoHotel',
      'séxtuple imp. hotel': 'sextuple_ImpuestoHotel',
      'niño imp. ingreso': 'niño_ImpuestoIngr',
      'sencilla imp. consumo': 'sencilla_Impoconsumo',
      'doble imp. consumo': 'doble_Impoconsumo',
      'triple imp. consumo': 'triple_Impoconsumo',
      'cuádruple imp. consumo': 'cuadruple_Impoconsumo',
      'quíntuple imp. consumo': 'quintuple_Impoconsumo',
      'séxtuple imp. consumo': 'sextuple_Impoconsumo',
      'niño imp. consumo': 'niño_Impoconsumo',
      'otros': 'otros',
      'total': 'total'
    },
    
    tiquete: {
      'id': 'id',
      'salida': 'salida',
      'pertenece': 'pertenece',
      'neta': 'neta',
      'tasas': 'tasas',
      'iva': 'iva',
      'total': 'total'
    }
  };
  
  return mapeos[tipo] || {};
}

// FUNCIÓN OPTIMIZADA PARA MAPEAR DATOS
function mapearDatos(tipo, datosExcel, mapeo) {
  const datosMapeados = {};
  
  // Usar el mapeo pre-cargado para evitar recalcularlo
  for (const [campoExcel, campoBD] of Object.entries(mapeo)) {
    if (datosExcel.hasOwnProperty(campoExcel)) {
      datosMapeados[campoBD] = datosExcel[campoExcel];
    }
  }
  
  return datosMapeados;
}

// FUNCIÓN OPTIMIZADA PARA VALIDACIÓN RÁPIDA
function validarDatos(tipo, datos) {
  const errores = [];
  
  // Usar switch optimizado sin console.log en producción
  switch (tipo) {
    case 'tiquete':
      if (!datos.salida) errores.push('Campo "salida" requerido');
      if (datos.neta && datos.neta !== '' && isNaN(parseFloat(datos.neta))) errores.push('Campo "neta" debe ser número');
      if (datos.tasas && datos.tasas !== '' && isNaN(parseFloat(datos.tasas))) errores.push('Campo "tasas" debe ser número');
      if (datos.iva && datos.iva !== '' && isNaN(parseFloat(datos.iva))) errores.push('Campo "iva" debe ser número');
      if (datos.total && datos.total !== '' && isNaN(parseFloat(datos.total))) errores.push('Campo "total" debe ser número');
      break;
      
    case 'hoteles':
      if (!datos.hotel) errores.push('Campo "hotel" requerido');
      if (datos.sencilla && datos.sencilla !== '' && isNaN(parseFloat(datos.sencilla))) errores.push('Campo "sencilla" debe ser número');
      if (datos.doble && datos.doble !== '' && isNaN(parseFloat(datos.doble))) errores.push('Campo "doble" debe ser número');
      if (datos.noches && datos.noches !== '' && isNaN(parseInt(datos.noches))) errores.push('Campo "noches" debe ser entero');
      break;
      
    case 'transportes':
      if (datos.combus && datos.combus !== '' && isNaN(parseFloat(datos.combus))) errores.push('Campo "combustible" debe ser número');
      if (datos.tasa && datos.tasa !== '' && isNaN(parseFloat(datos.tasa))) errores.push('Campo "tasa" debe ser número');
      if (datos.iva && datos.iva !== '' && isNaN(parseFloat(datos.iva))) errores.push('Campo "iva" debe ser número');
      if (datos.total && datos.total !== '' && isNaN(parseFloat(datos.total))) errores.push('Campo "total" debe ser número');
      break;
  }
  
  return errores;
}

// FUNCIÓN OPTIMIZADA PARA FORMATEO DE FECHAS
function formatearFecha(fecha) {
  if (!fecha) return null;
  
  try {
    let fechaObj;
    
    if (fecha instanceof Date) {
      fechaObj = fecha;
    } else {
      const fechaStr = fecha.toString().trim();
      const formatoDDMMYYYY = /^(\d{1,2})\/(\d{1,2})\/(\d{2,4})$/;
      const match = fechaStr.match(formatoDDMMYYYY);
      
      if (match) {
        const dia = parseInt(match[1]);
        const mes = parseInt(match[2]) - 1;
        let año = parseInt(match[3]);
        
        if (año < 100) año += 2000;
        fechaObj = new Date(año, mes, dia);
      } else {
        fechaObj = new Date(fecha);
      }
    }
    
    if (isNaN(fechaObj.getTime())) return null;
    
    const year = fechaObj.getFullYear();
    const month = String(fechaObj.getMonth() + 1).padStart(2, '0');
    const day = String(fechaObj.getDate()).padStart(2, '0');
    
    return `${year}-${month}-${day}`;
    
  } catch (error) {
    return null;
  }
}

router.post('/importarDatos', upload.single('archivo'), async (req, res) => {
  const tipo = req.body.tipo;
  
  // Validaciones iniciales
  if (!req.file) {
    return res.status(400).json({ 
      success: false, 
      message: 'No se ha subido ningún archivo' 
    });
  }
  
  if (!['hoteles', 'transportes', 'tiquete'].includes(tipo)) {
    return res.status(400).json({ 
      success: false, 
      message: 'Tipo de importación inválido. Debe ser: hoteles, transportes o tiquete' 
    });
  }

  let conn;
  try {
    console.time('Total Import Time'); // Para medir el tiempo total
    
    // Cargar archivo Excel
    console.time('Excel Load');
    const workbook = new ExcelJS.Workbook();
    await workbook.xlsx.load(req.file.buffer);
    
    const sheet = workbook.worksheets[0];
    if (!sheet || sheet.rowCount <= 1) {
      return res.status(400).json({ 
        success: false, 
        message: 'El archivo Excel está vacío o no tiene datos válidos' 
      });
    }
    console.timeEnd('Excel Load');

    // Conectar a la base de datos
    console.time('DB Connection');
    conn = await connect();
    
    // OPTIMIZACIÓN: Usar transacción para mejor rendimiento
    await conn.beginTransaction();
    console.timeEnd('DB Connection');
    
    const resultados = { 
      insertados: 0, 
      actualizados: 0, 
      eliminados: 0, 
      errores: [] 
    };

    // Obtener registros existentes una sola vez
    console.time('Fetch Existing');
    const [existing] = await conn.query(`SELECT id FROM ${tipo}`);
    const existingIds = new Set(existing.map(r => r.id));
    console.timeEnd('Fetch Existing');

    // Procesar headers una sola vez
    console.time('Process Headers');
    const headerRow = sheet.getRow(1);
    const headers = [];
    headerRow.eachCell({ includeEmpty: false }, (cell, colNumber) => {
      headers[colNumber] = cell.value?.toString().trim().toLowerCase();
    });
    
    // Pre-cargar mapeo para evitar recalcularlo
    const mapeo = obtenerMapeoColumnas(tipo);
    console.timeEnd('Process Headers');

    // OPTIMIZACIÓN: Procesar todas las filas primero, luego hacer operaciones batch
    console.time('Process Rows');
    const datosParaInsertar = [];
    const datosParaActualizar = [];
    const idsEnExcel = new Set();
    
    // Procesar filas en memoria primero
    for (let i = 2; i <= sheet.rowCount; i++) {
      const row = sheet.getRow(i);
      
      // Verificar si la fila está vacía más eficientemente
      let isEmpty = true;
      let cellCount = 0;
      row.eachCell({ includeEmpty: false }, () => {
        isEmpty = false;
        cellCount++;
      });
      
      if (isEmpty || cellCount === 0) continue;

      try {
        // Construir objeto con los datos del Excel
        const datosExcel = {};
        row.eachCell({ includeEmpty: true }, (cell, colNumber) => {
          const header = headers[colNumber];
          if (header) {
            let valor = cell.value;
            
            if (cell.type === ExcelJS.ValueType.Date) {
              valor = formatearFecha(cell.value);
            } else if (valor !== null && valor !== undefined) {
              valor = valor.toString().trim();
            }
            
            datosExcel[header] = valor;
          }
        });

        // Mapear datos usando mapeo pre-cargado
        const datos = mapearDatos(tipo, datosExcel, mapeo);
        
        // Validar datos
        const erroresValidacion = validarDatos(tipo, datos);
        if (erroresValidacion.length > 0) {
          resultados.errores.push({ fila: i, errores: erroresValidacion });
          continue;
        }

        // Procesar ID
        let id = null;
        if (datos.id !== null && datos.id !== undefined && datos.id !== '') {
          const idParsed = parseInt(datos.id);
          if (!isNaN(idParsed) && idParsed > 0) {
            id = idParsed;
            idsEnExcel.add(id);
          } else {
            resultados.errores.push({ 
              fila: i, 
              errores: [`El ID "${datos.id}" no es un número válido`] 
            });
            continue;
          }
        } else {
          resultados.errores.push({ 
            fila: i, 
            errores: ['El campo ID es requerido'] 
          });
          continue;
        }
        
        // Separar para inserción o actualización
        if (existingIds.has(id)) {
          datosParaActualizar.push({ id, datos });
        } else {
          datosParaInsertar.push({ id, datos });
        }

      } catch (error) {
        resultados.errores.push({ 
          fila: i, 
          errores: [`Error procesando fila: ${error.message}`] 
        });
      }
    }
    console.timeEnd('Process Rows');

    // OPTIMIZACIÓN: Operaciones batch para inserción
    console.time('Batch Insert');
    if (datosParaInsertar.length > 0) {
      await procesarInsercionesBatch(conn, tipo, datosParaInsertar);
      resultados.insertados = datosParaInsertar.length;
    }
    console.timeEnd('Batch Insert');

    // OPTIMIZACIÓN: Operaciones batch para actualización
    console.time('Batch Update');
    if (datosParaActualizar.length > 0) {
      await procesarActualizacionesBatch(conn, tipo, datosParaActualizar);
      resultados.actualizados = datosParaActualizar.length;
    }
    console.timeEnd('Batch Update');

    // OPTIMIZACIÓN: Eliminación batch
    console.time('Batch Delete');
    const idsAEliminar = [...existingIds].filter(id => !idsEnExcel.has(id));
    
    if (idsAEliminar.length > 0) {
      const placeholders = idsAEliminar.map(() => '?').join(',');
      await conn.query(`DELETE FROM ${tipo} WHERE id IN (${placeholders})`, idsAEliminar);
      resultados.eliminados = idsAEliminar.length;
    }
    console.timeEnd('Batch Delete');

    // Confirmar transacción
    await conn.commit();
    console.timeEnd('Total Import Time');

    let mensaje = `Importación completada: ${resultados.insertados} insertados, ${resultados.actualizados} actualizados, ${resultados.eliminados} eliminados`;
    if (resultados.errores.length > 0) {
      mensaje += `. ${resultados.errores.length} errores encontrados`;
    }

    res.json({ 
      success: true, 
      message: mensaje,
      resultados 
    });

  } catch (error) {
    console.error('Error en importación:', error);
    
    // Rollback en caso de error
    if (conn) {
      try {
        await conn.rollback();
      } catch (rollbackError) {
        console.error('Error en rollback:', rollbackError);
      }
    }
    
    if (error.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({
        success: false,
        message: 'El archivo es demasiado grande (máximo 10MB)'
      });
    }
    
    res.status(500).json({ 
      success: false, 
      message: 'Error interno del servidor', 
      error: error.message 
    });
  } finally {
    if (conn) {
      await conn.end();
    }
  }
});

// FUNCIÓN OPTIMIZADA PARA INSERCIÓN BATCH
async function procesarInsercionesBatch(conn, tipo, datosArray) {
  if (datosArray.length === 0) return;
  
  // Agrupar por estructura de campos para optimizar queries
  const gruposPorCampos = {};
  
  for (const item of datosArray) {
    const datosCompletos = { ...item.datos, id: item.id };
    
    // Filtrar campos válidos
    const campos = Object.keys(datosCompletos).filter(k => {
      const valor = datosCompletos[k];
      return valor !== null && valor !== undefined && valor !== '' && valor !== 'undefined';
    });
    
    const claveCampos = campos.sort().join(',');
    
    if (!gruposPorCampos[claveCampos]) {
      gruposPorCampos[claveCampos] = {
        campos: campos,
        registros: []
      };
    }
    
    gruposPorCampos[claveCampos].registros.push(datosCompletos);
  }
  
  // Ejecutar inserción batch por grupo
  for (const grupo of Object.values(gruposPorCampos)) {
    if (grupo.registros.length === 0) continue;
    
    const camposEscapados = grupo.campos.map(campo => `\`${campo}\``).join(',');
    const placeholders = grupo.campos.map(() => '?').join(',');
    
    // Crear query para inserción múltiple
    const valoresQuery = grupo.registros.map(() => `(${placeholders})`).join(',');
    const query = `INSERT INTO ${tipo} (${camposEscapados}) VALUES ${valoresQuery}`;
    
    // Preparar valores para la query
    const valores = [];
    for (const registro of grupo.registros) {
      for (const campo of grupo.campos) {
        valores.push(registro[campo]);
      }
    }
    
    await conn.query(query, valores);
  }
}

// FUNCIÓN OPTIMIZADA PARA ACTUALIZACIÓN BATCH
async function procesarActualizacionesBatch(conn, tipo, datosArray) {
  // Para actualizaciones, es más eficiente hacerlas individualmente
  // pero podemos optimizar preparando las queries
  const queries = [];
  const valores = [];
  
  for (const item of datosArray) {
    const campos = Object.keys(item.datos).filter(k => {
      const valor = item.datos[k];
      return k !== 'id' && valor !== null && valor !== undefined && valor !== '' && valor !== 'undefined';
    });
    
    if (campos.length === 0) continue;
    
    const actualizaciones = campos.map(k => `\`${k}\` = ?`).join(',');
    const query = `UPDATE ${tipo} SET ${actualizaciones} WHERE id = ?`;
    
    queries.push(query);
    valores.push([...campos.map(k => item.datos[k]), item.id]);
  }
  
  // Ejecutar todas las actualizaciones
  for (let i = 0; i < queries.length; i++) {
    await conn.query(queries[i], valores[i]);
  }
}