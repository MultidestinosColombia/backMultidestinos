const express = require("express");
const cors = require("cors");
const connect = require("../database"); 
const multer = require("multer");
const fs = require("fs");
const PDFDocument = require('pdfkit'); // npm install pdfkit
const { ChartJSNodeCanvas } = require('chartjs-node-canvas');


const router = express.Router();
const app = express();


app.use(cors());


module.exports = (app) => app.use("/Home", router);


// Configuración para generar gráficas
const chartJSNodeCanvas = new ChartJSNodeCanvas({ 
  width: 800, 
  height: 400,
  backgroundColour: 'white'
});

// ======================================================== Tarjetas ============================================================= //

router.post('/data', async (req, res) => {
  const { start, end, userId, rol } = req.body;

  try {
    const db = await connect();

    const [clientesRows] = await db.query("SELECT COUNT(*) AS totalClientes FROM clientes");
    const [cotizacionesRows] = await db.query("SELECT COUNT(*) AS totalCotizaciones FROM cotizacion");
    const [liquidacionesRows] = await db.query("SELECT COUNT(*) AS total_liquidaciones FROM liquidacion");

    const kpiData = {
      totalUsuarios: clientesRows[0].totalClientes || 0,
      Cotizaciones: cotizacionesRows[0].totalCotizaciones || 0,
      liquidaciones: liquidacionesRows[0].total_liquidaciones || 0,
      clientesChange: 5,
      cotizacionesChange: 10,
      ingresosChange: 8,
      reservas: 12,
      ticketsChange: 3
    };

    res.json({ kpiData });

  } catch (error) {
    console.error("Error en /data:", error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

// ======================================================== Graficas ============================================================= //

router.post('/export', async (req, res) => {
  try {
    const db = await connect();
    const { start, end } = req.body;

    const [ventas] = await db.query(`
      SELECT MONTH(fechaInicio) AS mes, area, SUM(totalPasajeros) AS total
      FROM liquidacion
      WHERE fechaInicio BETWEEN ? AND ?
      GROUP BY mes, area
      ORDER BY mes ASC
    `, [start, end]);

    const [Cotizacion] = await db.query(`
      SELECT MONTH(fechaInicio) AS mes, area, SUM(totalPrecioCliente) AS total
      FROM cotizacion
      WHERE fechaInicio BETWEEN ? AND ?
      GROUP BY mes, area
      ORDER BY mes ASC
    `, [start, end]);

    const [usuarios] = await db.query(`
      SELECT rol, COUNT(*) as total
      FROM usuarios
      GROUP BY rol
    `);

    const [clientes] = await db.query(`
      SELECT zona, COUNT(*) AS total
      FROM clientes
      GROUP BY zona
    `);

    const [tendencias] = await db.query(`
      SELECT nombrePrograma, COUNT(*) AS total
      FROM liquidacion
      GROUP BY nombrePrograma
      ORDER BY total DESC
      LIMIT 5
    `);

    const chartData = { ventas, usuarios, clientes, tendencias, Cotizacion };
    res.json({ chartData }); // Solo gráficos
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error en /export' });
  }
});

// ======================================================== PDF Export ============================================================= //

router.post('/export-pdf', async (req, res) => {
  try {
    const db = await connect();
    const { start, end, userId, rol } = req.body;

    // Obtener datos
    const [clientesRows] = await db.query("SELECT COUNT(*) AS totalClientes FROM clientes");
    const [cotizacionesRows] = await db.query("SELECT COUNT(*) AS totalCotizaciones FROM cotizacion");
    const [liquidacionesRows] = await db.query("SELECT COUNT(*) AS total_liquidaciones FROM liquidacion");

    const [ventas] = await db.query(`
      SELECT MONTH(fechaInicio) AS mes, area, SUM(totalPasajeros) AS total
      FROM liquidacion
      WHERE fechaInicio BETWEEN ? AND ?
      GROUP BY mes, area
      ORDER BY mes ASC
    `, [start, end]);

    const [cotizaciones] = await db.query(`
      SELECT MONTH(fechaInicio) AS mes, area, SUM(totalPrecioCliente) AS total
      FROM cotizacion
      WHERE fechaInicio BETWEEN ? AND ?
      GROUP BY mes, area
      ORDER BY mes ASC
    `, [start, end]);

    const [usuarios] = await db.query(`
      SELECT rol, COUNT(*) as total
      FROM usuarios
      GROUP BY rol
    `);

    const [clientes] = await db.query(`
      SELECT zona, COUNT(*) AS total
      FROM clientes
      GROUP BY zona
    `);

    const [tendencias] = await db.query(`
      SELECT nombrePrograma, COUNT(*) AS total
      FROM liquidacion
      GROUP BY nombrePrograma
      ORDER BY total DESC
      LIMIT 5
    `);

    // Generar gráficas como imágenes
    const ventasChart = await generateVentasChart(ventas);
    const cotizacionesChart = await generateCotizacionesChart(cotizaciones);
    const usuariosChart = await generateUsuariosChart(usuarios);
    const clientesChart = await generateClientesChart(clientes);
    const tendenciasChart = await generateTendenciasChart(tendencias);

    // Crear PDF
    const doc = new PDFDocument({ 
      margin: 0,
      size: 'A4',
      info: {
        Title: `Reporte Dashboard ${start} - ${end}`,
        Author: 'Multidestinos Express',
        Subject: 'Reporte Ejecutivo de Dashboard'
      }
    });
    
    // Headers para descarga
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename=reporte_dashboard_${start}_${end}.pdf`);
    
    doc.pipe(res);

    // ====== CONFIGURACIÓN DE DISEÑO ======
    const colors = {
      primary: '#1a365d',      // Azul marino profesional
      secondary: '#2d3748',    // Gris oscuro
      accent: '#3182ce',       // Azul claro
      success: '#38a169',      // Verde
      warning: '#ed8936',      // Naranja
      danger: '#e53e3e',       // Rojo
      light: '#f7fafc',        // Gris muy claro
      lighter: '#edf2f7',      // Gris claro
      white: '#ffffff',
      border: '#cbd5e0',       // Gris medio
      text: '#2d3748',         // Texto principal
      textLight: '#4a5568'     // Texto secundario
    };

    const layout = {
      pageWidth: doc.page.width,
      pageHeight: doc.page.height,
      margin: 30,
      headerHeight: 80,
      footerHeight: 30,
      contentWidth: doc.page.width - 60,
      contentHeight: doc.page.height - 140
    };

    // ====== FUNCIONES AUXILIARES ======
    
    // Función para crear gradiente
    function createGradient(doc, x, y, width, height, color1, color2, direction = 'vertical') {
      const gradient = doc.linearGradient(x, y, 
        direction === 'vertical' ? x : x + width, 
        direction === 'vertical' ? y + height : y);
      gradient.stop(0, color1).stop(1, color2);
      return gradient;
    }

    // Función para agregar sombra suave
    function addShadow(doc, x, y, width, height, blur = 3) {
      for (let i = blur; i > 0; i--) {
        const opacity = 0.1 * (blur - i + 1) / blur;
        doc.rect(x + i, y + i, width, height)
           .fillOpacity(opacity)
           .fill('#000000')
           .fillOpacity(1);
      }
    }

    // Encabezado profesional
    function addHeader(doc, pageNumber, totalPages, title = '') {
      // Fondo del encabezado con gradiente
      const gradient = createGradient(doc, 0, 0, layout.pageWidth, layout.headerHeight, 
                                    colors.primary, colors.accent);
      doc.rect(0, 0, layout.pageWidth, layout.headerHeight).fill(gradient);
      
      // Logo/Título principal
      doc.fill(colors.white)
         .fontSize(24)
         .font('Helvetica-Bold')
         .text('MULTIDESTINOS EXPRESS', layout.margin, 20);
      
      // Línea decorativa
      doc.rect(layout.margin, 50, 200, 2).fill(colors.warning);
      
      // Título de página
      if (title) {
        doc.fontSize(14)
           .font('Helvetica')
           .text(title, layout.margin, 55);
      }
      
      // Información de página (lado derecho)
      const rightX = layout.pageWidth - 150;
      doc.fontSize(10)
         .text(`Página ${pageNumber} de ${totalPages}`, rightX, 25);
      
      doc.fontSize(9)
         .text(new Date().toLocaleDateString('es-MX', {
           year: 'numeric',
           month: 'long',
           day: 'numeric'
         }), rightX, 40);
      
      return layout.headerHeight + 15;
    }

    // Pie de página profesional
    function addFooter(doc) {
      const footerY = layout.pageHeight - layout.footerHeight;
      
      // Línea superior
      doc.moveTo(layout.margin, footerY - 10)
         .lineTo(layout.pageWidth - layout.margin, footerY - 10)
         .stroke(colors.border);
      
      // Texto del pie
      doc.fontSize(8)
         .fill(colors.textLight)
         .text('© 2024 Multidestinos Express - Confidencial', layout.margin, footerY);
      
      doc.text(`Generado: ${new Date().toLocaleString('es-MX')}`, 
               layout.pageWidth - 200, footerY, { width: 170, align: 'right' });
    }

    // Tarjeta KPI mejorada
    function createEnhancedKPI(doc, x, y, width, height, data) {
      const { title, value, subtitle, icon, color, trend } = data;
      
      // Sombra
      addShadow(doc, x, y, width, height);
      
      // Fondo principal
      doc.rect(x, y, width, height)
         .fill(colors.white)
         .stroke(colors.border)
         .lineWidth(1);
      
      // Barra superior colorida
      doc.rect(x, y, width, 4).fill(color);
      
      // Icono/indicador (lado izquierdo)
      doc.circle(x + 20, y + 25, 12).fill(color + '20');
      doc.fill(color)
         .fontSize(14)
         .text(icon || '●', x + 15, y + 20);
      
      // Título
      doc.fill(colors.textLight)
         .fontSize(10)
         .font('Helvetica')
         .text(title, x + 40, y + 15, { width: width - 50 });
      
      // Valor principal
      doc.fill(colors.text)
         .fontSize(22)
         .font('Helvetica-Bold')
         .text(typeof value === 'number' ? value.toLocaleString('es-MX') : value, 
               x + 40, y + 30, { width: width - 50 });
      
      // Subtítulo con tendencia
      if (subtitle) {
        doc.fill(colors.textLight)
           .fontSize(9)
           .font('Helvetica')
           .text(subtitle, x + 40, y + height - 25);
      }
      
      // Indicador de tendencia
      if (trend) {
        const trendColor = trend > 0 ? colors.success : trend < 0 ? colors.danger : colors.textLight;
        const trendIcon = trend > 0 ? '↗' : trend < 0 ? '↘' : '→';
        doc.fill(trendColor)
           .fontSize(12)
           .text(`${trendIcon} ${Math.abs(trend)}%`, x + width - 50, y + 15, { width: 40, align: 'right' });
      }
    }

    // Sección con título
    function addSection(doc, title, y) {
      doc.fontSize(18)
         .font('Helvetica-Bold')
         .fill(colors.primary)
         .text(title, layout.margin, y);
      
      // Línea decorativa
      doc.rect(layout.margin, y + 25, 100, 2).fill(colors.accent);
      
      return y + 40;
    }

    // Gráfico con marco profesional
    function addChartWithFrame(doc, chart, x, y, width, height, title) {
      // Sombra del marco
      addShadow(doc, x, y - 30, width, height + 40);
      
      // Marco del gráfico
      doc.rect(x, y - 30, width, height + 40)
         .fill(colors.white)
         .stroke(colors.border);
      
      // Título del gráfico
      doc.fontSize(12)
         .font('Helvetica-Bold')
         .fill(colors.text)
         .text(title, x + 15, y - 20);
      
      // Gráfico
      doc.image(chart, x + 10, y, { width: width - 20, height: height - 20 });
      
      return y + height + 20;
    }

    // ====== GENERACIÓN DEL PDF ======
    
    const totalPages = 4; // Optimizado a 4 páginas
    let currentPage = 1;

    // ===== PÁGINA 1: DASHBOARD EJECUTIVO =====
    let currentY = addHeader(doc, currentPage++, totalPages, 'Reporte Ejecutivo');
    
    // Período de análisis (destacado)
    const periodBox = {
      x: layout.margin,
      y: currentY,
      width: layout.contentWidth,
      height: 50
    };
    
    const periodGradient = createGradient(doc, periodBox.x, periodBox.y, 
                                        periodBox.width, periodBox.height, 
                                        colors.lighter, colors.light);
    doc.rect(periodBox.x, periodBox.y, periodBox.width, periodBox.height)
       .fill(periodGradient)
       .stroke(colors.border);
    
    doc.fontSize(14)
       .font('Helvetica-Bold')
       .fill(colors.primary)
       .text('PERÍODO DE ANÁLISIS', periodBox.x + 20, periodBox.y + 15, { align: 'left' });
    
    doc.fontSize(16)
       .fill(colors.text)
       .text(`${start} → ${end}`, periodBox.x + 250, periodBox.y + 15);
    
    currentY += 70;

    // KPIs principales (2x2 grid optimizado)
    const kpiWidth = (layout.contentWidth - 30) / 2;
    const kpiHeight = 85;
    const kpiSpacing = 15;
    
    // Calcular conversión y eficiencia
    const totalCotizaciones = cotizacionesRows[0].totalCotizaciones || 1;
    const totalLiquidaciones = liquidacionesRows[0].total_liquidaciones || 0;
    const conversionRate = Math.round((totalLiquidaciones / totalCotizaciones) * 100);
    
    // Fila superior de KPIs
    createEnhancedKPI(doc, layout.margin, currentY, kpiWidth, kpiHeight, {
      title: 'CLIENTES ACTIVOS',
      value: clientesRows[0].totalClientes || 0,
      subtitle: 'Base de clientes registrada',
      color: colors.success,
    });
    
    createEnhancedKPI(doc, layout.margin + kpiWidth + kpiSpacing, currentY, kpiWidth, kpiHeight, {
      title: 'COTIZACIONES GENERADAS',
      value: totalCotizaciones,
      subtitle: 'Pipeline de ventas activo',
      color: colors.accent,
    });
    
    currentY += kpiHeight + kpiSpacing;
    
    // Fila inferior de KPIs
    createEnhancedKPI(doc, layout.margin, currentY, kpiWidth, kpiHeight, {
      title: 'LIQUIDACIONES PROCESADAS',
      value: totalLiquidaciones,
      subtitle: 'Transacciones completadas',
      color: colors.warning,
    });
    
    createEnhancedKPI(doc, layout.margin + kpiWidth + kpiSpacing, currentY, kpiWidth, kpiHeight, {
      title: 'TASA DE CONVERSIÓN',
      value: `${conversionRate}%`,
      subtitle: 'Eficiencia de ventas',
      color: conversionRate > 60 ? colors.success : colors.danger,
    });
    
    currentY += kpiHeight + 30;

    // Resumen ejecutivo compacto
    currentY = addSection(doc, 'Resumen Ejecutivo', currentY);
    
    const summaryBox = {
      x: layout.margin,
      y: currentY,
      width: layout.contentWidth,
      height: 80
    };
    
    doc.rect(summaryBox.x, summaryBox.y, summaryBox.width, summaryBox.height)
       .fill(colors.light)
       .stroke(colors.border);
    
    const summaryText = `Durante el período ${start} - ${end}, la organización mantiene ${clientesRows[0].totalClientes || 0} clientes activos, generando ${totalCotizaciones} cotizaciones y procesando ${totalLiquidaciones} liquidaciones. La tasa de conversión del ${conversionRate}% ${conversionRate > 60 ? 'supera' : 'requiere atención para alcanzar'} los estándares óptimos de la industria.`;
    
    doc.fontSize(11)
       .font('Helvetica')
       .fill(colors.text)
       .text(summaryText, summaryBox.x + 15, summaryBox.y + 15, {
         width: summaryBox.width - 30,
         align: 'justify',
         lineGap: 4
       });
    
    // Gráficos lado a lado
    currentY = summaryBox.y + summaryBox.height + 30;
    const chartWidth = (layout.contentWidth - 20) / 2;
    const chartHeight = 200;
    
    addChartWithFrame(doc, ventasChart, layout.margin, currentY, chartWidth, chartHeight, 
                     'Liquidaciones por Mes y Área');
    
    addChartWithFrame(doc, cotizacionesChart, layout.margin + chartWidth + 20, currentY, 
                     chartWidth, chartHeight, 'Cotizaciones por Mes y Área');
    
    addFooter(doc);

    // ===== PÁGINA 2: ANÁLISIS ORGANIZACIONAL =====
    doc.addPage();
    currentY = addHeader(doc, currentPage++, totalPages, 'Análisis Organizacional');
    
    // Distribución de usuarios y clientes
    currentY = addSection(doc, 'Estructura del Equipo y Cobertura', currentY);
    
    currentY += 25;
    
    const orgChartHeight = 250;
    addChartWithFrame(doc, usuariosChart, layout.margin, currentY, chartWidth, orgChartHeight, 
                     'Distribución de Usuarios por Rol');
    
    addChartWithFrame(doc, clientesChart, layout.margin + chartWidth + 20, currentY, 
                     chartWidth, orgChartHeight, 'Clientes por Zona Geográfica');
    
    currentY += orgChartHeight + 40;
    
    // Insights organizacionales
    currentY = addSection(doc, 'Insights Organizacionales', currentY);
    
    const insights = [
      { icon: '🎯', title: 'Estructura de Roles', text: 'Balance óptimo entre roles administrativos y operativos' },
      { icon: '🌍', title: 'Cobertura Geográfica', text: 'Distribución estratégica de clientes por zonas' },
      { icon: '📊', title: 'Eficiencia Operativa', text: 'Indicadores positivos en métricas clave de desempeño' }
    ];
    
    const insightHeight = 60;
    insights.forEach((insight, index) => {
      const insightY = currentY + (index * (insightHeight + 10));
      
      doc.rect(layout.margin, insightY, layout.contentWidth, insightHeight)
         .fill(colors.white)
         .stroke(colors.border);
      
      doc.fontSize(16)
         .text(insight.icon, layout.margin + 15, insightY + 15);
      
      doc.fontSize(12)
         .font('Helvetica-Bold')
         .fill(colors.primary)
         .text(insight.title, layout.margin + 50, insightY + 15);
      
      doc.fontSize(10)
         .font('Helvetica')
         .fill(colors.textLight)
         .text(insight.text, layout.margin + 50, insightY + 35, {
           width: layout.contentWidth - 80
         });
    });
    
    addFooter(doc);

    // ===== PÁGINA 3: PROGRAMAS DESTACADOS =====
    doc.addPage();
    currentY = addHeader(doc, currentPage++, totalPages, 'Programas y Tendencias');
    
    currentY = addSection(doc, 'Top 5 Programas de Mayor Impacto', currentY);

    currentY += 25;
    
    // Gráfico de tendencias (más grande)
    const trendChartHeight = 300;
    addChartWithFrame(doc, tendenciasChart, layout.margin, currentY, layout.contentWidth, 
                     trendChartHeight, 'Programas con Mejor Desempeño');
    
    currentY += trendChartHeight + 30;
    
    // Tabla de datos de programas
    if (tendencias && tendencias.length > 0) {
      currentY = addSection(doc, 'Detalle de Programas', currentY);
      
      // Cabecera de tabla
      const tableY = currentY;
      const colWidth = layout.contentWidth / 3;
      
      doc.rect(layout.margin, tableY, layout.contentWidth, 25)
         .fill(colors.primary);
      
      doc.fill(colors.white)
         .fontSize(10)
         .font('Helvetica-Bold')
         .text('PROGRAMA', layout.margin + 10, tableY + 8)
         .text('LIQUIDACIONES', layout.margin + colWidth + 10, tableY + 8)
         .text('% DEL TOTAL', layout.margin + 2*colWidth + 10, tableY + 8);
      
      // Filas de datos
      const totalProgramas = tendencias.reduce((sum, item) => sum + item.total, 0);
      tendencias.forEach((programa, index) => {
        const rowY = tableY + 25 + (index * 20);
        const percentage = ((programa.total / totalProgramas) * 100).toFixed(1);
        
        doc.rect(layout.margin, rowY, layout.contentWidth, 20)
           .fill(index % 2 === 0 ? colors.light : colors.white)
           .stroke(colors.border);
        
        doc.fill(colors.text)
           .fontSize(9)
           .font('Helvetica')
           .text(programa.nombrePrograma || 'N/A', layout.margin + 10, rowY + 6, {
             width: colWidth - 20
           })
           .text(programa.total.toLocaleString(), layout.margin + colWidth + 10, rowY + 6)
           .text(`${percentage}%`, layout.margin + 2*colWidth + 10, rowY + 6);
      });
    }
    
    addFooter(doc);

    // ===== PÁGINA 4: CONCLUSIONES Y RECOMENDACIONES =====
    doc.addPage();
    currentY = addHeader(doc, currentPage++, totalPages, 'Conclusiones y Estrategias');
    
    currentY = addSection(doc, 'Conclusiones Ejecutivas', currentY);
    
    // Conclusiones con indicadores visuales
    const conclusions = [
      {
        type: 'success',
        title: 'Fortalezas Identificadas',
        points: [
          `Base sólida de ${clientesRows[0].totalClientes || 0} clientes activos`,
          `Tasa de conversión del ${conversionRate}% dentro de parámetros aceptables`,
          'Distribución equilibrada en la estructura organizacional'
        ]
      },
      {
        type: 'warning',
        title: 'Áreas de Oportunidad',
        points: [
          'Optimización del proceso de conversión de cotizaciones',
          'Expansión estratégica en zonas de menor penetración',
          'Desarrollo de programas de mayor impacto'
        ]
      },
      {
        type: 'info',
        title: 'Recomendaciones Estratégicas',
        points: [
          'Implementar seguimiento automatizado de cotizaciones',
          'Desarrollar planes de expansión geográfica específicos',
          'Fortalecer los programas de mayor rendimiento identificados'
        ]
      }
    ];
    
    conclusions.forEach((section, sectionIndex) => {
      const sectionColor = section.type === 'success' ? colors.success : 
                          section.type === 'warning' ? colors.warning : colors.accent;
      
      // Título de sección
      doc.fontSize(14)
         .font('Helvetica-Bold')
         .fill(sectionColor)
         .text(section.title, layout.margin, currentY);
      
      currentY += 25;
      
      // Puntos
      section.points.forEach((point, pointIndex) => {
        doc.circle(layout.margin + 10, currentY + 6, 3).fill(sectionColor);
        
        doc.fontSize(10)
           .font('Helvetica')
           .fill(colors.text)
           .text(point, layout.margin + 25, currentY, {
             width: layout.contentWidth - 40,
             lineGap: 2
           });
        
        currentY += 20;
      });
      
      currentY += 15;
    });
    
    // Firma y fecha
    currentY += 20;
    doc.rect(layout.margin, currentY, layout.contentWidth, 60)
       .fill(colors.lighter)
       .stroke(colors.border);
    
    doc.fontSize(12)
       .font('Helvetica-Bold')
       .fill(colors.primary)
       .text('Reporte Generado por Sistema Multidestinos Express', layout.margin + 20, currentY + 15);
    
    doc.fontSize(10)
       .font('Helvetica')
       .fill(colors.textLight)
       .text(`Fecha de generación: ${new Date().toLocaleDateString('es-MX', {
         weekday: 'long',
         year: 'numeric',
         month: 'long',
         day: 'numeric',
         hour: '2-digit',
         minute: '2-digit'
       })}`, layout.margin + 20, currentY + 35);
    
    addFooter(doc);
    
    doc.end();

  } catch (error) {
    console.error('Error generando PDF:', error);
    res.status(500).json({ error: 'Error generando el reporte PDF' });
  }
});

// Funciones para generar gráficas
async function generateVentasChart(ventas) {
  const meses = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
                 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];
  
  const dataSur = Array(12).fill(0);
  const dataNorte = Array(12).fill(0);

  ventas.forEach(v => {
    const mesIndex = Number(v.mes) - 1;
    const area = (v.area || '').toLowerCase();
    if (area === 'sur') {
      dataSur[mesIndex] = v.total;
    } else if (area === 'norte') {
      dataNorte[mesIndex] = v.total;
    }
  });

  const configuration = {
    type: 'bar',
    data: {
      labels: meses,
      datasets: [
        {
          label: 'Sur',
          data: dataSur,
          backgroundColor: 'rgba(54, 162, 235, 0.6)'
        },
        {
          label: 'Norte',
          data: dataNorte,
          backgroundColor: 'rgba(255, 99, 132, 0.6)'
        }
      ]
    },
    options: {
      responsive: true,
      plugins: {
        legend: { display: true },
        title: { display: true, text: 'Ventas por Mes y Área' }
      }
    }
  };

  return await chartJSNodeCanvas.renderToBuffer(configuration);
}

async function generateCotizacionesChart(cotizaciones) {
  const meses = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
                 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];
  
  const dataSur = Array(12).fill(0);
  const dataNorte = Array(12).fill(0);

  cotizaciones.forEach(v => {
    const mesIndex = Number(v.mes) - 1;
    const area = (v.area || '').toLowerCase();
    if (area === 'sur') {
      dataSur[mesIndex] = v.total;
    } else if (area === 'norte') {
      dataNorte[mesIndex] = v.total;
    }
  });

  const configuration = {
    type: 'bar',
    data: {
      labels: meses,
      datasets: [
        {
          label: 'Sur',
          data: dataSur,
          backgroundColor: 'rgba(54, 162, 235, 0.6)'
        },
        {
          label: 'Norte',
          data: dataNorte,
          backgroundColor: 'rgba(255, 99, 132, 0.6)'
        }
      ]
    },
    options: {
      responsive: true,
      plugins: {
        legend: { display: true },
        title: { display: true, text: 'Cotizaciones por Mes y Área' }
      }
    }
  };

  return await chartJSNodeCanvas.renderToBuffer(configuration);
}

async function generateUsuariosChart(usuarios) {
  const labels = usuarios.map(u => u.rol);
  const data = usuarios.map(u => u.total);
  const colors = ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF'];

  const configuration = {
    type: 'pie',
    data: {
      labels,
      datasets: [{
        data,
        backgroundColor: colors
      }]
    },
    options: {
      responsive: true,
      plugins: {
        legend: { position: 'right' },
        title: { display: true, text: 'Distribución de Usuarios por Rol' }
      }
    }
  };

  return await chartJSNodeCanvas.renderToBuffer(configuration);
}

async function generateClientesChart(clientes) {
  const labels = clientes.map(c => c.zona);
  const data = clientes.map(c => c.total);
  const colors = ['#FF9F40', '#FF6384', '#36A2EB', '#FFCE56'];

  const configuration = {
    type: 'doughnut',
    data: {
      labels,
      datasets: [{
        data,
        backgroundColor: colors
      }]
    },
    options: {
      responsive: true,
      plugins: {
        legend: { position: 'bottom' },
        title: { display: true, text: 'Clientes por Zona' }
      }
    }
  };

  return await chartJSNodeCanvas.renderToBuffer(configuration);
}

async function generateTendenciasChart(tendencias) {
  const labels = tendencias.map(t => t.nombrePrograma);
  const data = tendencias.map(t => t.total);
  const colors = ['#4BC0C0', '#9966FF', '#FF6384', '#36A2EB', '#FFCE56'];

  const configuration = {
    type: 'bar',
    data: {
      labels,
      datasets: [{
        label: 'Cantidad',
        data,
        backgroundColor: colors
      }]
    },
    options: {
      responsive: true,
      plugins: {
        legend: { display: false },
        title: { display: true, text: 'Top 5 Programas' }
      }
    }
  };

  return await chartJSNodeCanvas.renderToBuffer(configuration);
}