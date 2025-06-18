// Función para generar el PDF de solicitud de reserva
const PDFDocument = require('pdfkit');

const generarPDFSolicitudReserva = async (datos, res) => {
  const doc = new PDFDocument({ 
    margin: 30, 
    size: 'A4',
    bufferPages: true
  });
  
  // Headers para descarga
  res.setHeader('Content-Type', 'application/pdf');
  res.setHeader('Content-Disposition', 'attachment; filename="solicitud-reserva.pdf"');
  
  doc.pipe(res);
  
  // Colores del documento
  const colors = {
    headerBg: '#E8F4FD',
    border: '#000000',
    text: '#000000',
    headerText: '#000000'
  };
  
  // Función para dibujar rectángulos con bordes
  const drawRect = (x, y, width, height, fillColor = null, strokeColor = colors.border) => {
    if (fillColor) {
      doc.fillColor(fillColor).rect(x, y, width, height).fill();
    }
    doc.strokeColor(strokeColor).lineWidth(0.8).rect(x, y, width, height).stroke();
  };
  
  // Función para texto centrado
  const centerText = (text, x, y, width, fontSize = 10, fontType = 'Helvetica') => {
    doc.fillColor(colors.text).fontSize(fontSize).font(fontType);
    doc.text(text, x, y, { width: width, align: 'center' });
  };
  
  // Función para texto normal
  const normalText = (text, x, y, fontSize = 9, fontType = 'Helvetica') => {
    doc.fillColor(colors.text).fontSize(fontSize).font(fontType);
    doc.text(text, x, y);
  };

  // Función para cargar imagen desde URL
    const loadImageFromURL = async (url) => {
        try {
            const response = await fetch(url);
            if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
            }

            // ✅ CORREGIDO: para fetch nativo
            const arrayBuffer = await response.arrayBuffer();
            const buffer = Buffer.from(arrayBuffer);
            return buffer;

        } catch (error) {
            console.error('Error loading image:', error);
            return null;
        }
    };

  
  let yPos = 30;
  
  // ====== HEADER PRINCIPAL ======
  
  // Rectángulo principal del header
  drawRect(30, yPos, 535, 100);
  
  // Logo desde URL
  try {
  const logoBuffer = await loadImageFromURL('https://multidestinosexpress.co/wp-content/uploads/2022/06/Logo-circular-simple-negro-4.png'); 

    if (logoBuffer) {
        doc.image(logoBuffer, 50, yPos + 25, { width: 60 });
    } else {
        // Fallback si no carga
        doc.fillColor('#4A90E2').circle(80, yPos + 55, 30).fill();
        doc.fillColor(colors.text).fontSize(8).text('LOGO', 70, yPos + 50);
    }
    } catch (error) {
    console.error('Error loading logo:', error);
    // Fallback si hay error
    doc.fillColor('#4A90E2').circle(80, yPos + 55, 30).fill();
    doc.fillColor(colors.text).fontSize(8).text('LOGO', 70, yPos + 50);
    }
  
  // Información de contacto (lado derecho)
    doc.fillColor(colors.text).fontSize(9).font('Helvetica');
    const textX = 310; // Ajustado para que no se salga del margen derecho
    doc.text('PBX: (601)7621133', textX, yPos + 10);
    doc.text('CALLE 64 No. 11-37 LOC 301', textX, yPos + 22);
    doc.text('EMAIL: MULTIDESTINOS_EXPRESS@YAHOO.COM', textX, yPos + 34);
    doc.text('INFO@MULTIDESTINOSEXPRESS.CO', textX, yPos + 46);

  
  // Número de cotización (esquina superior derecha)
  // Obtener fecha actual
    const fechaActual = new Date().toLocaleDateString('es-CO', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
    });

    // Texto combinado
    const textoCotizacion = `COTIZACIÓN No. ${datos.numeroCotizacion}  |   ${fechaActual}`;

    // Ajuste de posición (más a la izquierda)
    const xLeft = 370; // 🔁 antes estaba en 450
    const ancho = 170; // puedes ajustarlo si tu texto se ve muy corto o largo

    // Dibujar rectángulo y centrar texto
    drawRect(xLeft, yPos + 65, ancho, 20);
    centerText(textoCotizacion, xLeft, yPos + 71, ancho, 8, 'Helvetica-Bold');


  
  yPos += 120;
  
  // ====== TÍTULO SOLICITUD DE RESERVA ======
  drawRect(30, yPos, 535, 25, colors.headerBg);
  centerText('SOLICITUD DE RESERVA', 30, yPos + 8, 535, 12, 'Helvetica-Bold');
  
  yPos += 35;
  
  // ====== INFORMACIÓN BÁSICA ======
  
  // Primera fila
  drawRect(30, yPos, 100, 20, colors.headerBg);
  centerText('FECHA SOLICITUD:', 30, yPos + 6, 100, 8, 'Helvetica-Bold');
  drawRect(130, yPos, 100, 20);
  centerText(datos.fechaSolicitud || '14/02/2025', 130, yPos + 6, 100, 8);
  
  drawRect(230, yPos, 80, 20, colors.headerBg);
  centerText('AGENCIA:', 230, yPos + 6, 80, 8, 'Helvetica-Bold');
  drawRect(310, yPos, 120, 20);
  centerText('MULTIDESTINOS EXPRESS', 310, yPos + 6, 120, 8);
  
  drawRect(430, yPos, 70, 20, colors.headerBg);
  centerText('TELÉFONO:', 430, yPos + 6, 70, 8, 'Helvetica-Bold');
  drawRect(500, yPos, 65, 20);
  centerText(datos.telefono || '3212533457', 500, yPos + 6, 65, 8);
  
  yPos += 20;
  
  // Segunda fila
    drawRect(30, yPos, 60, 20, colors.headerBg);
    centerText('NOCHES', 30, yPos + 6, 60, 8, 'Helvetica-Bold');
    drawRect(90, yPos, 50, 20);
    centerText(datos.noches || '3', 90, yPos + 6, 50, 8);
    
    drawRect(140, yPos, 80, 20, colors.headerBg);
    centerText('HOTEL', 140, yPos + 6, 80, 8, 'Helvetica-Bold');
    drawRect(220, yPos, 130, 20);
    centerText(datos.hotel || 'LA PLAYA', 220, yPos + 6, 130, 8);
    
    drawRect(350, yPos, 80, 20, colors.headerBg);
    centerText('CONTACTO', 350, yPos + 6, 80, 8, 'Helvetica-Bold');
    drawRect(430, yPos, 135, 20);
    centerText(datos.contacto || 'ALEJANDRA GARZON', 430, yPos + 6, 135, 8);
  
  yPos += 20;
  
  // Tercera fila
  drawRect(30, yPos, 100, 20, colors.headerBg);
  centerText('RUTA', 30, yPos + 6, 100, 8, 'Helvetica-Bold');
  drawRect(130, yPos, 200, 20);
  centerText(datos.ruta || 'BOGOTÁ - NUQUÍ - BOGOTÁ', 130, yPos + 6, 200, 8);
  
  drawRect(330, yPos, 100, 20, colors.headerBg);
  centerText('PLAN:', 330, yPos + 6, 100, 8, 'Helvetica-Bold');
  drawRect(430, yPos, 135, 20);
  centerText(datos.plan || 'AÉREO DESDE BOGOTÁ', 430, yPos + 6, 135, 8);
  
  yPos += 20;
  
  // Cuarta fila
  drawRect(30, yPos, 100, 20, colors.headerBg);
  centerText('VOUCHER HTL:', 30, yPos + 6, 100, 8, 'Helvetica-Bold');
  drawRect(130, yPos, 200, 20);
  centerText(datos.voucher || 'VOUCHER', 130, yPos + 6, 200, 8);
  
  drawRect(330, yPos, 100, 20, colors.headerBg);
  centerText('NIT', 330, yPos + 6, 100, 8, 'Helvetica-Bold');
  drawRect(430, yPos, 70, 20);
  
  drawRect(500, yPos, 65, 20, colors.headerBg);
  centerText('VENDEDOR:', 500, yPos + 6, 65, 8, 'Helvetica-Bold');
  
  yPos += 20;
  
  drawRect(130, yPos, 200, 20);
  centerText(datos.operador || 'OPERADOR:', 130, yPos + 6, 200, 8);
  
  drawRect(330, yPos, 100, 20);
  centerText(datos.acomodacion || '1*2*4', 330, yPos + 6, 100, 8);
  
  drawRect(430, yPos, 135, 20);
  centerText(datos.vendedor || 'AGB', 430, yPos + 6, 135, 8);
  
  yPos += 40;
  
  // ====== ITINERARIO DE VUELOS ======
  drawRect(30, yPos, 535, 25, colors.headerBg);
  centerText('ITINERARIO DE LOS VUELOS', 30, yPos + 8, 535, 11, 'Helvetica-Bold');
  
  yPos += 25;
  
  // Headers de vuelos
  const vuelosHeaders = [
    { text: 'AEROLÍNEA', width: 80 },
    { text: 'VUELO', width: 60 },
    { text: 'CLASE', width: 50 },
    { text: 'FECHA', width: 80 },
    { text: 'RUTA', width: 100 },
    { text: 'HR SALIDA', width: 80 },
    { text: 'HR LLEGADA', width: 85 }
  ];
  
  let xPos = 30;
  vuelosHeaders.forEach(header => {
    drawRect(xPos, yPos, header.width, 20, colors.headerBg);
    centerText(header.text, xPos, yPos + 6, header.width, 8, 'Helvetica-Bold');
    xPos += header.width;
  });
  
  yPos += 20;
  
  // Datos de vuelos
  const vuelosData = datos.vuelos || [
    { aerolinea: 'SATENA', vuelo: '8602\n8730', clase: 'M', fecha: '3-jul', ruta: 'BOG-EOH\nEOH-NQU', hrSalida: '5:45\n9:35', hrLlegada: '6:54\n10:36' },
    { aerolinea: 'SATENA', vuelo: '8731\n8605', clase: 'M', fecha: '6-jul', ruta: 'NQU-EOH\nEOH-BOG', hrSalida: '10:51\n14:03', hrLlegada: '11:48\n15:15' }
  ];
  
  vuelosData.forEach(vuelo => {
    xPos = 30;
    const rowHeight = 35;
    
    drawRect(xPos, yPos, 80, rowHeight);
    centerText(vuelo.aerolinea, xPos, yPos + 12, 80, 8);
    xPos += 80;
    
    drawRect(xPos, yPos, 60, rowHeight);
    centerText(vuelo.vuelo, xPos, yPos + 8, 60, 8);
    xPos += 60;
    
    drawRect(xPos, yPos, 50, rowHeight);
    centerText(vuelo.clase, xPos, yPos + 12, 50, 8);
    xPos += 50;
    
    drawRect(xPos, yPos, 80, rowHeight);
    centerText(vuelo.fecha, xPos, yPos + 12, 80, 8);
    xPos += 80;
    
    drawRect(xPos, yPos, 100, rowHeight);
    centerText(vuelo.ruta, xPos, yPos + 8, 100, 8);
    xPos += 100;
    
    drawRect(xPos, yPos, 80, rowHeight);
    centerText(vuelo.hrSalida, xPos, yPos + 8, 80, 8);
    xPos += 80;
    
    drawRect(xPos, yPos, 85, rowHeight);
    centerText(vuelo.hrLlegada, xPos, yPos + 8, 85, 8);
    
    yPos += rowHeight;
  });
  
  yPos += 20;
  
  // ====== OBSERVACIONES ======
  drawRect(30, yPos, 535, 20, colors.headerBg);
  normalText('OBSERVACIONES:', 35, yPos + 6, 9, 'Helvetica-Bold');
  
  yPos += 25;
  drawRect(30, yPos, 535, 25);
  normalText('Esta cotización está sujeta a cambio y disponibilidad al momento de reservar (Sin Servicio confirmados).', 35, yPos + 8, 9);
  
  yPos += 35;
  
  // ====== INCLUYE ======
  drawRect(30, yPos, 535, 20, colors.headerBg);
  normalText('INCLUYE', 35, yPos + 6, 9, 'Helvetica-Bold');
  
  yPos += 25;
  const incluye = datos.incluye || '•Tiquete aéreo Bogotá - Nuquí – Bogotá (Escala en Medellín) vía Satena •Impuestos de tiquete (Tasas, combustible, IVA y tarifa administrativa) •Recepción en el aeropuerto de Nuquí. •Traslado Nuquí – Hotel (En Playa Guachalito) - Nuquí (Traslado en lancha aprox. 40 min.) •Alojamiento de acuerdo con el número de noches elegidas. •Alimentación PAE (Desayuno, Almuerzo y Cena). Entran con almuerzo y salen con desayuno. •Excursión marítima descrita en el plan. •Caminata a la Cascada del amor, con guía. •Caminata a los baños termales, con guía. (No incluye ingreso). •Una excursión marítima de 2 hrs aprox. para avistamiento de ballenas.•Jugos naturales, aromáticas y café. •Uso del kayak según disponibilidad. •Guía en las caminatas. •Seguro hotelero e IVA. •Tarjetas de asistencia médica. •Refresco de bienvenida •Alojamiento en cabaña con baño privado, hamaca y vista al mar.';
  
  drawRect(30, yPos, 535, 100);
  doc.fontSize(8).text(incluye, 35, yPos + 5, { width: 525, align: 'justify' });
  
  yPos += 110;
  
  // ====== NO INCLUYE ======
  drawRect(30, yPos, 535, 20, colors.headerBg);
  normalText('NO INCLUYE', 35, yPos + 6, 9, 'Helvetica-Bold');
  
  yPos += 25;
  const noIncluye = datos.noIncluye || '•Impuestos de Turismo en Nuquí $30,000• Entrada a los baños termales $17,000•Tasa aeroportuaria en Nuquí• Servicio de Bar •Servicio de bar •Actividades adicionales•Gastos no especificados en el plan•Gastos por cancelación de vuelo•Ingreso al Parque Nacional Natural Utría( Cobro de acuerdo con el factor personal): A.Pasajero nacional o extranjero residente en Colombia a miembro de la CAN ( Mayor de 6 años hasta los 25 años valor $17,000. B. Adulto nacional o extranjero residente en Colombia o miembro de la CAN ( Mayor de 25 años valor $ 25,500). C. Extranjero no residente en Colombia ni miembro de la CAN valor $72,000';
  
  drawRect(30, yPos, 535, 60);
  doc.fontSize(8).text(noIncluye, 35, yPos + 5, { width: 525, align: 'justify' });
  
  yPos += 70;
  
  // ====== LIQUIDACIÓN ======
  drawRect(30, yPos, 535, 20, colors.headerBg);
  centerText('LIQUIDACIÓN', 30, yPos + 6, 535, 11, 'Helvetica-Bold');
  
  yPos += 25;
  
  // Tabla de liquidación con estructura específica
  const liquidacionData = datos.liquidacion || [
    { concepto: 'VALOR ADUL DBL', valor: '1.701.594', cant: '2', total: '3.403.188', observacion: 'BASE COMISION', comision: '3.403.188' },
    { concepto: 'TRANS. NO COMIS', valor: '250.000', cant: '2', total: '500.000', observacion: '', comision: '' },
    { concepto: 'Q', valor: '150.000', cant: '2', total: '300.000', observacion: 'COMISION', comision: '12%' },
    { concepto: 'CO', valor: '30.500', cant: '2', total: '61.000', observacion: 'VALOR COMISION', comision: '408.383' },
    { concepto: 'VS CO', valor: '-', cant: '2', total: '-', observacion: 'IVA 19% (-)', comision: '77.599' },
    { concepto: 'TA', valor: '79.600', cant: '2', total: '159.200', observacion: 'RETEFUENTE 11% (+)', comision: '44.922' },
    { concepto: 'VS TA', valor: '-', cant: '2', total: '-', observacion: 'RTEICA 0,966 % (+)', comision: '3.945' }
  ];
  
  // Headers de liquidación
  drawRect(30, yPos, 140, 20, colors.headerBg);
  drawRect(170, yPos, 80, 20, colors.headerBg);
  drawRect(250, yPos, 40, 20, colors.headerBg);
  drawRect(290, yPos, 80, 20, colors.headerBg);
  drawRect(370, yPos, 120, 20, colors.headerBg);
  drawRect(490, yPos, 75, 20, colors.headerBg);
  
  liquidacionData.forEach((item, index) => {
    yPos += 20;
    drawRect(30, yPos, 140, 20);
    drawRect(170, yPos, 80, 20);
    drawRect(250, yPos, 40, 20);
    drawRect(290, yPos, 80, 20);
    drawRect(370, yPos, 120, 20);
    drawRect(490, yPos, 75, 20);
    
    normalText(item.concepto, 35, yPos + 6, 8);
    normalText(item.valor, 175, yPos + 6, 8);
    centerText(item.cant, 250, yPos + 6, 40, 8);
    normalText(item.total, 295, yPos + 6, 8);
    normalText(item.observacion, 375, yPos + 6, 8);
    normalText(item.comision, 495, yPos + 6, 8);
  });
  
  // Total final
  yPos += 40;
  drawRect(30, yPos, 535, 25, colors.headerBg);
  normalText('VALOR ADUL DBL', 35, yPos + 8, 10, 'Helvetica-Bold');
  normalText('2.609.000', 200, yPos + 8, 10, 'Helvetica-Bold');
  normalText('5.218.000', 300, yPos + 8, 10, 'Helvetica-Bold');
  normalText('TOTAL A PAGAR', 400, yPos + 8, 10, 'Helvetica-Bold');
  normalText('4.780.892', 500, yPos + 8, 10, 'Helvetica-Bold');
  
  yPos += 35;
  
  // ====== CONDICIONES DE PAGO ======
  drawRect(30, yPos, 535, 20, colors.headerBg);
  centerText('DEPÓSITOS Y CONDICIONES DE PAGO', 30, yPos + 6, 535, 10, 'Helvetica-Bold');
  
  yPos += 25;
  const condiciones = datos.condiciones || 'PARA CONFIRMACIONES SE DEBE ENVIAR DEPOSITO DEL 50% DEL VALOR DEL PLAN Y EL SALDO 15 DIAS ANTES DE LA SALIDA, LOS SERVICIOS DEJADOS DE TOMAR NO SON REEMBOLSABLES, LA CANCELACIÓN CON 18 DIAS ANTES DEL VIAJE LA PENALIDAD SERA DEL 100% DEL VALOR DEL PLAN, LOS TIQUETES NO SON REEMBOLSABLES, NI ENDOSABLES, PENALIDAD POR CAMBIO (FECHA, NOMBRE, HORA, RUTA) $ 200.000. * TARIFAS SUJETAS A CAMBIO Y DISPONIBILIDAD SIN PREVIO AVISO*';
  
  drawRect(30, yPos, 535, 40);
  doc.fontSize(8).text(condiciones, 35, yPos + 5, { width: 525, align: 'justify' });
  
  doc.end();
};

// Función principal que exportas
module.exports = (app) => {
  // Endpoint para generar PDF
  app.post('/api/generar-pdf/:tipo', (req, res) => {
    const { tipo } = req.params;
    const datos = req.body;
    
    try {
      switch (tipo) {
        case 'solicitud-reserva':
          generarPDFSolicitudReserva(datos, res);
          break;
        case 'normal':
          generarPDFSolicitudReserva(datos, res);
          break;
        case 'otro-documento':
          generarPDFSolicitudReserva(datos, res);
          break;
        default:
          res.status(400).json({ error: 'Tipo de documento no válido' });
      }
    } catch (error) {
      console.error('Error generando PDF:', error);
      res.status(500).json({ error: 'Error interno del servidor' });
    }
  });
};