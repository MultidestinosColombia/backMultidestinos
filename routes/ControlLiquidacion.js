const express = require("express");
const cors = require("cors");
const connect = require("../database"); // Importar correctamente la conexión
const ExcelJS = require("exceljs");
const multer = require("multer");
const fs = require("fs");

const router = express.Router();
const app = express();
const upload = multer({ dest: "uploads/" });

// Habilitar CORS para todas las solicitudes
app.use(cors());

// Ruta principal
module.exports = (app) => app.use("/ControlLiquidacion", router);

// Función genérica para obtener datos de una tabla
async function fetchTableData(req, res, tableName) {
    let conn;
    try {
        conn = await connect(); // Conectar a la BD
        const [rows] = await conn.query(`SELECT * FROM ${tableName}`);
        res.status(200).json(rows); // Enviar los datos
    } catch (error) {
        console.error(`Error en fetchTableData (${tableName}):`, error);
        res.status(500).json({ error: "Error interno del servidor" });
    } finally {
        if (conn) await conn.end();
    }
}

// Rutas específicas para cada tabla
router.get("/costos", (req, res) => fetchTableData(req, res, "costos"));
router.get("/Costos_unico", (req, res) => fetchTableData(req, res, "Costos_unico"));
router.get("/noches_uno", (req, res) => fetchTableData(req, res, "noches_uno"));
router.get("/noches_dos", (req, res) => fetchTableData(req, res, "noches_dos"));
router.get("/noches_tres", (req, res) => fetchTableData(req, res, "noches_tres"));
router.get("/noches_cuatro", (req, res) => fetchTableData(req, res, "noches_cuatro"));
router.get("/noche_adicionales", (req, res) => fetchTableData(req, res, "noche_adicionales"));
router.get("/receptivo", (req, res) => fetchTableData(req, res, "receptivo"));
router.get("/proveedores", (req, res) => fetchTableData(req, res, "proveedores"));

//------------------------------------------------------------------------ Backend del Excel --------------------------------------------------------------------------------//

// 🔹 1️⃣ Descargar Excel con formato mejorado
router.get("/descargar-excel", async (req, res) => {
    let conn;
    try {
        conn = await connect();
        const queries = {
            "Costos": "SELECT * FROM costos",
            "Costos Único": "SELECT * FROM Costos_unico",
            "Noches 1": "SELECT * FROM noches_uno",
            "Noches 2": "SELECT * FROM noches_dos",
            "Noches 3": "SELECT * FROM noches_tres",
            "Noches 4": "SELECT * FROM noches_cuatro",
            "Noches Adicionales": "SELECT * FROM noche_adicionales",
            "Receptivos": "SELECT * FROM receptivo",
            "Proveedores": "SELECT * FROM proveedores"
        };

        const workbook = new ExcelJS.Workbook();
        
        // Añadir propiedades al documento para hacerlo más profesional
        workbook.creator = 'Sistema de Control de Liquidación';
        workbook.lastModifiedBy = 'Sistema Automático';
        workbook.created = new Date();
        workbook.modified = new Date();
        
        // Colores corporativos para usar en todo el documento
        const COLORES = {
            ENCABEZADO: 'FF1F497D', // Azul oscuro corporativo
            ENCABEZADO_TEXTO: 'FFFFFFFF', // Texto blanco
            FILA_PAR: 'FFF2F2F2', // Gris muy claro para filas pares
            BORDE: 'FFD0D7E5', // Color sutil para los bordes
            TOTALES: 'FFE6EDF5', // Color para filas de totales
        };

        // Primero crear la hoja de resumen
        const resumenSheet = workbook.addWorksheet('Resumen', {
            properties: { tabColor: { argb: 'FF00B050' } } // Color verde para resumen
        });
        
        // Configurar encabezados del resumen
        resumenSheet.columns = [
            { header: 'Hoja', key: 'sheet', width: 25 },
            { header: 'Registros', key: 'records', width: 15 },
            { header: 'Última actualización', key: 'updated', width: 20 }
        ];
        
        // Dar formato a la fila de encabezado del resumen
        const resumenHeader = resumenSheet.getRow(1);
        resumenHeader.height = 25;
        resumenHeader.font = { bold: true, color: { argb: COLORES.ENCABEZADO_TEXTO }, size: 12 };
        resumenHeader.fill = {
            type: 'pattern',
            pattern: 'solid',
            fgColor: { argb: COLORES.ENCABEZADO }
        };
        
        // Añadir título al resumen (antes de añadir datos)
        resumenSheet.insertRow(1, []);
        resumenSheet.insertRow(1, ['RESUMEN DE DATOS - CONTROL DE LIQUIDACIÓN']);
        resumenSheet.getRow(1).height = 30;
        resumenSheet.getRow(1).font = { bold: true, size: 16 };
        resumenSheet.getRow(1).alignment = { horizontal: 'center', vertical: 'middle' };
        resumenSheet.mergeCells('A1:C1');
        
        // Crear el resto de hojas y recopilar datos para el resumen
        const resumenData = [];
        
        for (const sheetName in queries) {
            const worksheet = workbook.addWorksheet(sheetName, {
                properties: {
                    tabColor: { argb: COLORES.ENCABEZADO } // Color de la pestaña
                }
            });
            
            // Obtenemos la estructura de la tabla
            const tableName = queries[sheetName].split("FROM")[1].trim();
            const [columnsInfo] = await conn.query(`SHOW COLUMNS FROM ${tableName}`);
            const columns = columnsInfo.map(col => col.Field);
            
            // Mejora: Detectar tipos de columnas para formateo específico
            const columnTypes = {};
            columnsInfo.forEach(col => {
                columnTypes[col.Field] = col.Type;
            });
            
            // Configuramos las columnas con formato mejorado (sin formato decimal)
            worksheet.columns = columns.map((columnName) => {
                const colType = columnTypes[columnName] || '';
                let format = {};
                
                // Solo aplicar formato especial a fechas
                if (colType.includes('date')) {
                    format = { numFmt: 'dd/mm/yyyy' }; // Formato para fechas
                } else if (colType.includes('int') || colType.includes('decimal') || colType.includes('float')) {
                    format = { numFmt: '0' }; // Formato entero para números
                }
                
                return {
                    header: formatColumnHeader(columnName),
                    key: columnName,
                    width: 0, // Se ajustará automáticamente después
                    style: format
                };
            });
            
            // Obtenemos los datos
            const [rows] = await conn.query(queries[sheetName]);
            
            // Preparar los datos para convertir decimales a enteros cuando sea apropiado
            const processedRows = rows.map(row => {
                const newRow = { ...row };
                
                // Para cada columna, verificar si necesitamos formatear
                for (const columnName in newRow) {
                    const value = newRow[columnName];
                    const colType = columnTypes[columnName] || '';
                    
                    // Si es un número y tiene decimales, lo convertimos a entero si todos los decimales son cero
                    if (
                        (colType.includes('int') || colType.includes('decimal') || colType.includes('float')) &&
                        typeof value === 'number' && 
                        !Number.isInteger(value) && 
                        value % 1 === 0
                    ) {
                        newRow[columnName] = Math.round(value);
                    }
                }
                
                return newRow;
            });
            
            // Agregar los datos con formato mejorado
            if (processedRows.length > 0) {
                processedRows.forEach((row, index) => {
                    const dataRow = worksheet.addRow(row);
                    
                    // Aplicar colores alternados para mejor legibilidad
                    if (index % 2 === 1) {
                        dataRow.eachCell({ includeEmpty: true }, (cell) => {
                            cell.fill = {
                                type: 'pattern',
                                pattern: 'solid',
                                fgColor: { argb: COLORES.FILA_PAR }
                            };
                        });
                    }
                });
            }
            
            // Aplicar filtros
            worksheet.autoFilter = {
                from: { row: 1, column: 1 },
                to: { row: 1, column: columns.length }
            };
            
            // Mejorar la apariencia del encabezado
            const headerRow = worksheet.getRow(1);
            headerRow.height = 25; // Altura del encabezado
            
            headerRow.eachCell((cell) => {
                cell.font = { 
                    bold: true, 
                    color: { argb: COLORES.ENCABEZADO_TEXTO },
                    size: 12 // Tamaño de letra para encabezados
                };
                cell.fill = {
                    type: 'pattern',
                    pattern: 'solid',
                    fgColor: { argb: COLORES.ENCABEZADO },
                };
                cell.alignment = { 
                    horizontal: 'center', 
                    vertical: 'middle' 
                };
                cell.border = {
                    top: { style: 'thin', color: { argb: COLORES.BORDE } },
                    left: { style: 'thin', color: { argb: COLORES.BORDE } },
                    bottom: { style: 'medium', color: { argb: COLORES.BORDE } }, // Borde inferior más grueso
                    right: { style: 'thin', color: { argb: COLORES.BORDE } }
                };
            });
            
            // Aplicar bordes y ajustes a todas las celdas con datos
            const lastRow = Math.max(2, worksheet.rowCount);
            
            // Aplicar bordes a todas las celdas
            for (let row = 2; row <= lastRow; row++) {
                worksheet.getRow(row).eachCell({ includeEmpty: true }, (cell) => {
                    cell.border = {
                        top: { style: 'thin', color: { argb: COLORES.BORDE } },
                        left: { style: 'thin', color: { argb: COLORES.BORDE } },
                        bottom: { style: 'thin', color: { argb: COLORES.BORDE } },
                        right: { style: 'thin', color: { argb: COLORES.BORDE } }
                    };
                    
                    // Alineación según tipo de dato
                    const colName = columns[cell.col - 1];
                    const colType = columnTypes[colName] || '';
                    
                    if (colType.includes('int') || colType.includes('decimal') || colType.includes('float')) {
                        cell.alignment = { horizontal: 'right' }; // Números a la derecha
                    } else if (colType.includes('date')) {
                        cell.alignment = { horizontal: 'center' }; // Fechas centradas
                    }
                    
                    // Forzar formato de número entero para IDs y valores numéricos
                    if (
                        colType.includes('int') || 
                        colType.includes('decimal') || 
                        colType.includes('float') ||
                        colName.toLowerCase().includes('id')
                    ) {
                        cell.numFmt = '0';
                    }
                });
            }
            
            // Auto-ajustar el ancho de las columnas según el contenido
            worksheet.columns.forEach(column => {
                const lengths = worksheet.getColumn(column.key).values
                    .filter(Boolean)
                    .map(v => v.toString().length);
                
                // Añadir la longitud del encabezado
                if (column.header) {
                    lengths.push(column.header.length + 2); // +2 para espacio extra
                }
                
                // Encontrar la longitud máxima
                const maxLength = Math.max(...lengths.filter(l => typeof l === 'number' && !isNaN(l)) || [10]);
                
                // Limitar el ancho máximo de columna (evitar columnas demasiado anchas)
                const clampedWidth = Math.min(Math.max(maxLength, 10), 50);
                column.width = clampedWidth;
            });
            
            // Congelar paneles para facilitar la navegación
            worksheet.views = [
                { state: 'frozen', xSplit: 0, ySplit: 1, activeCell: 'A2' }
            ];
            
            // Recopilar datos para la hoja de resumen
            const [lastUpdated] = await conn.query(`SELECT NOW() as fecha`);
            resumenData.push({
                sheet: sheetName,
                records: worksheet.rowCount - 1, // Restar fila de encabezado
                updated: lastUpdated[0].fecha
            });
        }
        
        // Añadir los datos a la hoja de resumen
        resumenData.forEach(data => {
            resumenSheet.addRow(data);
        });
        
        // Formatear tabla de resumen (después de añadir los datos)
        for (let i = 3; i <= resumenSheet.rowCount; i++) { // Empezar desde la fila 3 porque tenemos el título y la cabecera
            resumenSheet.getRow(i).eachCell((cell) => {
                cell.border = {
                    top: { style: 'thin', color: { argb: COLORES.BORDE } },
                    left: { style: 'thin', color: { argb: COLORES.BORDE } },
                    bottom: { style: 'thin', color: { argb: COLORES.BORDE } },
                    right: { style: 'thin', color: { argb: COLORES.BORDE } }
                };
                
                // Colorear filas alternas
                if (i % 2 === 0) {
                    cell.fill = {
                        type: 'pattern',
                        pattern: 'solid',
                        fgColor: { argb: COLORES.FILA_PAR }
                    };
                }
                
                // Asegurar que los números de registros también sean enteros
                if (cell.col === 2) { // Columna de registros
                    cell.numFmt = '0';
                }
            });
        }
        
        // Activar la hoja de resumen como la primera que se muestra
        workbook.views = [
            {
                firstSheet: 0,
                activeTab: 0,
                visibility: 'visible'
            }
        ];

        // Configurar el nombre y tipo del archivo para descarga
        const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
        const fileName = `ControlLiquidacion_${timestamp}.xlsx`;
        
        res.setHeader("Content-Disposition", `attachment; filename=${fileName}`);
        res.setHeader("Content-Type", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
        
        // Generar y enviar el archivo
        await workbook.xlsx.write(res);
        res.end();
        
    } catch (error) {
        console.error("Error generando Excel:", error);
        res.status(500).send({
            error: "Error generando el archivo Excel",
            message: error.message,
            stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
        });
    } finally {
        if (conn) await conn.end();
    }
});

// Función auxiliar para formatear nombres de columnas
function formatColumnHeader(columnName) {
    // Reemplaza guiones bajos con espacios
    let formatted = columnName.replace(/_/g, ' ');
    
    // Convierte a formato título (primera letra mayúscula de cada palabra)
    formatted = formatted.split(' ')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
        .join(' ');
        
    return formatted;
}

// 🔹 2️⃣ Subir y procesar el archivo Excel
router.post("/subir-excel", upload.single("file"), async (req, res) => {
    let conn;
    try {
        if (!req.file) {
            return res.status(400).send("No se envió ningún archivo.");
        }

        conn = await connect(); // Obtener conexión a la BD
        const workbook = new ExcelJS.Workbook();
        await workbook.xlsx.readFile(req.file.path);

        const queries = {
            "Costos": "costos",
            "Costos Único": "Costos_unico",
            "Noches 1": "noches_uno",
            "Noches 2": "noches_dos",
            "Noches 3": "noches_tres",
            "Noches 4": "noches_cuatro",
            "Noches Adicionales": "noche_adicionales",
            "Receptivos": "receptivo",
            "Proveedores": "proveedores"
        };
        

        for (const sheetName in queries) {
            const worksheet = workbook.getWorksheet(sheetName);
            if (!worksheet) {
                console.log(`❌ No se encontró la hoja: ${sheetName}`);
                continue;
            } else {
                console.log(`✅ Procesando hoja: ${sheetName}`);
            }
            ;
            if (!worksheet) continue;

            
            
        
            const tableName = queries[sheetName];
        
            await conn.query(`DELETE FROM ??`, [tableName]); // 🔥 Limpiar datos anteriores antes de insertar nuevos
            
        
            const columns = worksheet.getRow(1).values.slice(1).map(col => col.replace(/\s+/g, '_'));
            console.log("Columnas obtenidas después del reemplazo:", columns); // Verifica los nombres en consola

        
            const values = [];
        
            worksheet.eachRow((row, rowNumber) => {
                if (rowNumber === 1) return; // Saltar los encabezados
                const rowData = row.values.slice(1).map(cell => {
                    if (cell && typeof cell === "object" && cell.formula) {
                        return cell.result !== undefined ? cell.result : null; // Obtiene el resultado de la fórmula
                    }
                    return cell;
                });
                values.push(rowData);
            });
        
            if (values.length > 0) {
                const placeholders = values.map(() => `(${columns.map(() => "?").join(", ")})`).join(", ");
                const query = `INSERT INTO ${tableName} (\`${columns.join("`, `")}\`) VALUES ${placeholders}`;
                await conn.query(query, values.flat());
            }
        }
        

        fs.unlinkSync(req.file.path); // 🗑️ Eliminar el archivo después de procesarlo
        res.send("Datos actualizados correctamente.");
    } catch (error) {
        console.error("Error procesando Excel:", error);
        res.status(500).send("Error al procesar el archivo.");
    } finally {
        if (conn) await conn.end();
    }
});
