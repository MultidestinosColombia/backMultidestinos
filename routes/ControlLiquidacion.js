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
            
            // Auto-ajustar el ancho de las columnas según el contenido (versión mejorada)
            worksheet.columns.forEach(column => {
                let maxLength = 0;
                
                // Revisar todas las celdas en la columna, incluyendo el encabezado
                worksheet.getColumn(column.key).eachCell({ includeEmpty: false }, function(cell) {
                    // Obtener el valor de la celda como texto
                    const cellValue = cell.value !== null && cell.value !== undefined 
                        ? String(cell.value) 
                        : '';
                        
                    // Considerar el formato del texto (negrita requiere más espacio)
                    const isBold = cell.font && cell.font.bold;
                    const lengthFactor = isBold ? 1.2 : 1;
                    
                    // Calcular longitud teniendo en cuenta formato
                    const length = (cellValue.length * lengthFactor);
                    
                    // Actualizar longitud máxima si es necesario
                    if (length > maxLength) {
                        maxLength = length;
                    }
                });
                
                // Añadir espacio adicional para el formato de la columna
                maxLength += 4; // Espacio para el padding interno y bordes
                
                // Limitar el ancho máximo y mínimo (evitar columnas demasiado anchas o estrechas)
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


//--------------------------------------------------------------------------------- Formulas del Excel  -------------------------------------------------------------------------------------------------------------//
//----------------------------------------------------------------------------- Formulas del la Hoja Costos  ---------------------------------------------------------------------------------------------------//
            
            // Para la hoja "Costos"
            if (sheetName === "Costos") {
                worksheet.getColumn('Q').eachCell((cell, rowNumber) => {
                    if (rowNumber > 1) { // Saltar el encabezado
                        // Definir la fórmula
                        cell.value = { formula: `J${rowNumber}+O${rowNumber}+P${rowNumber}` };
                        
                        cell.numFmt = '0';

                    }
                });
            }

            if (sheetName === "Costos") {
                worksheet.getColumn('R').eachCell((cell, rowNumber) => {
                    if (rowNumber > 1) { // Saltar el encabezado
                        // Definir la fórmula
                        cell.value = { formula: `K${rowNumber}+O${rowNumber}+P${rowNumber}` };
                        
                        cell.numFmt = '0';

                    }
                });
            }

            if (sheetName === "Costos") {
                worksheet.getColumn('S').eachCell((cell, rowNumber) => {
                    if (rowNumber > 1) { // Saltar el encabezado
                        // Definir la fórmula
                        cell.value = { formula: `L${rowNumber}+O${rowNumber}+P${rowNumber}` };
                        
                        cell.numFmt = '0';

                    }
                });
            }

            if (sheetName === "Costos") {
                worksheet.getColumn('T').eachCell((cell, rowNumber) => {
                    if (rowNumber > 1) { // Saltar el encabezado
                        // Definir la fórmula
                        cell.value = { formula: `M${rowNumber}+O${rowNumber}+P${rowNumber}` };
                        
                        cell.numFmt = '0';

                    }
                });
            }

            if (sheetName === "Costos") {
                worksheet.getColumn('U').eachCell((cell, rowNumber) => {
                    if (rowNumber > 1) { // Saltar el encabezado
                        // Definir la fórmula
                        cell.value = { formula: `N${rowNumber}+O${rowNumber}+P${rowNumber}` };
                        
                        cell.numFmt = '0';

                    }
                });
            }

            if (sheetName === "Costos") {
                worksheet.getColumn('AG').eachCell((cell, rowNumber) => {
                    if (rowNumber > 1) { // Saltar el encabezado
                        // Definir la fórmula
                        cell.value = { formula: `AL${rowNumber}-Q${rowNumber}` };
                        
                        cell.numFmt = '0';

                    }
                });
            }

            if (sheetName === "Costos") {
                worksheet.getColumn('AH').eachCell((cell, rowNumber) => {
                    if (rowNumber > 1) { // Saltar el encabezado
                        // Definir la fórmula
                        cell.value = { formula: `AM${rowNumber}-R${rowNumber}` };
                        
                        cell.numFmt = '0';

                    }
                });
            }

            if (sheetName === "Costos") {
                worksheet.getColumn('AI').eachCell((cell, rowNumber) => {
                    if (rowNumber > 1) { // Saltar el encabezado
                        // Definir la fórmula
                        cell.value = { formula: `AN${rowNumber}-S${rowNumber}` };
                        
                        cell.numFmt = '0';

                    }
                });
            }

            if (sheetName === "Costos") {
                worksheet.getColumn('AJ').eachCell((cell, rowNumber) => {
                    if (rowNumber > 1) { // Saltar el encabezado
                        // Definir la fórmula
                        cell.value = { formula: `AO${rowNumber}-T${rowNumber}` };
                        
                        cell.numFmt = '0';

                    }
                });
            }

            if (sheetName === "Costos") {
                worksheet.getColumn('AK').eachCell((cell, rowNumber) => {
                    if (rowNumber > 1) { // Saltar el encabezado
                        // Definir la fórmula
                        cell.value = { formula: `AP${rowNumber}-U${rowNumber}` };
                        
                        cell.numFmt = '0';

                    }
                });
            }

            if (sheetName === "Costos") {
                worksheet.getColumn('AL').eachCell((cell, rowNumber) => {
                    if (rowNumber > 1) { // Saltar el encabezado
                        // Definir la fórmula
                        cell.value = { formula: `Q${rowNumber}/0.77` };
                        
                        cell.numFmt = '0';

                    }
                });
            }

            if (sheetName === "Costos") {
                worksheet.getColumn('AM').eachCell((cell, rowNumber) => {
                    if (rowNumber > 1) { // Saltar el encabezado
                        // Definir la fórmula
                        cell.value = { formula: `R${rowNumber}/0.77` };
                        
                        cell.numFmt = '0';

                    }
                });
            }

            if (sheetName === "Costos") {
                worksheet.getColumn('AN').eachCell((cell, rowNumber) => {
                    if (rowNumber > 1) { // Saltar el encabezado
                        // Definir la fórmula
                        cell.value = { formula: `S${rowNumber}/0.77` };
                        
                        cell.numFmt = '0';

                    }
                });
            }

            if (sheetName === "Costos") {
                worksheet.getColumn('AO').eachCell((cell, rowNumber) => {
                    if (rowNumber > 1) { // Saltar el encabezado
                        // Definir la fórmula
                        cell.value = { formula: `T${rowNumber}/0.77` };
                        
                        cell.numFmt = '0';

                    }
                });
            }

            if (sheetName === "Costos") {
                worksheet.getColumn('AP').eachCell((cell, rowNumber) => {
                    if (rowNumber > 1) { // Saltar el encabezado
                        // Definir la fórmula
                        cell.value = { formula: `U${rowNumber}/0.77` };
                        
                        cell.numFmt = '0';

                    }
                });
            }

            if (sheetName === "Costos") {
                worksheet.getColumn('AQ').eachCell((cell, rowNumber) => {
                    if (rowNumber > 1) { // Saltar el encabezado
                        // Definir la fórmula
                        cell.value = { formula: `AG${rowNumber}*0.19` };
                        
                        cell.numFmt = '0';

                    }
                });
            }

            if (sheetName === "Costos") {
                worksheet.getColumn('AR').eachCell((cell, rowNumber) => {
                    if (rowNumber > 1) { // Saltar el encabezado
                        // Definir la fórmula
                        cell.value = { formula: `AH${rowNumber}*0.19` };
                        
                        cell.numFmt = '0';

                    }
                });
            }

            if (sheetName === "Costos") {
                worksheet.getColumn('AS').eachCell((cell, rowNumber) => {
                    if (rowNumber > 1) { // Saltar el encabezado
                        // Definir la fórmula
                        cell.value = { formula: `AI${rowNumber}*0.19` };
                        
                        cell.numFmt = '0';

                    }
                });
            }

            if (sheetName === "Costos") {
                worksheet.getColumn('AT').eachCell((cell, rowNumber) => {
                    if (rowNumber > 1) { // Saltar el encabezado
                        // Definir la fórmula
                        cell.value = { formula: `AJ${rowNumber}*0.19` };
                        
                        cell.numFmt = '0';

                    }
                });
            }

            if (sheetName === "Costos") {
                worksheet.getColumn('AU').eachCell((cell, rowNumber) => {
                    if (rowNumber > 1) { // Saltar el encabezado
                        // Definir la fórmula
                        cell.value = { formula: `AK${rowNumber}*0.19` };
                        
                        cell.numFmt = '0';

                    }
                });
            }

            if (sheetName === "Costos") {
                worksheet.getColumn('AV').eachCell((cell, rowNumber) => {
                    if (rowNumber > 1) { // Saltar el encabezado
                        // Definir la fórmula
                        cell.value = { formula: `V${rowNumber}+W${rowNumber}+AB${rowNumber}+AL${rowNumber}+AQ${rowNumber}` };
                        
                        cell.numFmt = '0';

                    }
                });
            }

            if (sheetName === "Costos") {
                worksheet.getColumn('AW').eachCell((cell, rowNumber) => {
                    if (rowNumber > 1) { // Saltar el encabezado
                        // Definir la fórmula
                        cell.value = { formula: `V${rowNumber}+X${rowNumber}+AC${rowNumber}+AM${rowNumber}+AR${rowNumber}`};
                        
                        cell.numFmt = '0';

                    }
                });
            }

            if (sheetName === "Costos") {
                worksheet.getColumn('AX').eachCell((cell, rowNumber) => {
                    if (rowNumber > 1) { // Saltar el encabezado
                        // Definir la fórmula
                        cell.value = { formula: `V${rowNumber}+Y${rowNumber}+AD${rowNumber}+AN${rowNumber}+AS${rowNumber}`};
                        
                        cell.numFmt = '0';

                    }
                });
            }

            if (sheetName === "Costos") {
                worksheet.getColumn('AY').eachCell((cell, rowNumber) => {
                    if (rowNumber > 1) { // Saltar el encabezado
                        // Definir la fórmula
                        cell.value = { formula: `V${rowNumber}+Z${rowNumber}+AE${rowNumber}+AO${rowNumber}+AT${rowNumber}`};
                        
                        cell.numFmt = '0';

                    }
                });
            }

            if (sheetName === "Costos") {
                worksheet.getColumn('AZ').eachCell((cell, rowNumber) => {
                    if (rowNumber > 1) { // Saltar el encabezado
                        // Definir la fórmula
                        cell.value = { formula: `V${rowNumber}+AA${rowNumber}+AF${rowNumber}+AP${rowNumber}+AU${rowNumber}`};
                        
                        cell.numFmt = '0';

                    }
                });
            }



//----------------------------------------------------------------------------- Formulas del la Hoja Costos Unico  ---------------------------------------------------------------------------------------------------//

            // Para la hoja "Costos Único"
            if (sheetName === "Costos Único") {
                worksheet.getColumn('AB').eachCell((cell, rowNumber) => {
                    if (rowNumber > 1) { // Saltar el encabezado
                        // Definir la fórmula
                        cell.value = { formula: `AG${rowNumber}-L${rowNumber}`};
                        
                        cell.numFmt = '0';

                    }
                });
            }

            if (sheetName === "Costos Único") {
                worksheet.getColumn('AC').eachCell((cell, rowNumber) => {
                    if (rowNumber > 1) { // Saltar el encabezado
                        // Definir la fórmula
                        cell.value = { formula: `AH${rowNumber}-M${rowNumber}`};
                        
                        cell.numFmt = '0';

                    }
                });
            }

            if (sheetName === "Costos Único") {
                worksheet.getColumn('AD').eachCell((cell, rowNumber) => {
                    if (rowNumber > 1) { // Saltar el encabezado
                        // Definir la fórmula
                        cell.value = { formula: `AI${rowNumber}-N${rowNumber}`};
                        
                        cell.numFmt = '0';

                    }
                });
            }

            if (sheetName === "Costos Único") {
                worksheet.getColumn('AE').eachCell((cell, rowNumber) => {
                    if (rowNumber > 1) { // Saltar el encabezado
                        // Definir la fórmula
                        cell.value = { formula: `AJ${rowNumber}-O${rowNumber}`};
                        
                        cell.numFmt = '0';

                    }
                });
            }

            if (sheetName === "Costos Único") {
                worksheet.getColumn('AF').eachCell((cell, rowNumber) => {
                    if (rowNumber > 1) { // Saltar el encabezado
                        // Definir la fórmula
                        cell.value = { formula: `AK${rowNumber}-P${rowNumber}`};
                        
                        cell.numFmt = '0';

                    }
                });
            }

            if (sheetName === "Costos Único") {
                worksheet.getColumn('AG').eachCell((cell, rowNumber) => {
                    if (rowNumber > 1) { // Saltar el encabezado
                        // Definir la fórmula
                        cell.value = { formula: `L${rowNumber}/0.77`};
                        
                        cell.numFmt = '0';

                    }
                });
            }

            if (sheetName === "Costos Único") {
                worksheet.getColumn('AH').eachCell((cell, rowNumber) => {
                    if (rowNumber > 1) { // Saltar el encabezado
                        // Definir la fórmula
                        cell.value = { formula: `M${rowNumber}/0.77`};
                        
                        cell.numFmt = '0';

                    }
                });
            }

            if (sheetName === "Costos Único") {
                worksheet.getColumn('AI').eachCell((cell, rowNumber) => {
                    if (rowNumber > 1) { // Saltar el encabezado
                        // Definir la fórmula
                        cell.value = { formula: `N${rowNumber}/0.77`};
                        
                        cell.numFmt = '0';

                    }
                });
            }

            if (sheetName === "Costos Único") {
                worksheet.getColumn('AJ').eachCell((cell, rowNumber) => {
                    if (rowNumber > 1) { // Saltar el encabezado
                        // Definir la fórmula
                        cell.value = { formula: `O${rowNumber}/0.77`};
                        
                        cell.numFmt = '0';

                    }
                });
            }

            if (sheetName === "Costos Único") {
                worksheet.getColumn('AK').eachCell((cell, rowNumber) => {
                    if (rowNumber > 1) { // Saltar el encabezado
                        // Definir la fórmula
                        cell.value = { formula: `P${rowNumber}/0.77`};
                        
                        cell.numFmt = '0';

                    }
                });
            }

            if (sheetName === "Costos Único") {
                worksheet.getColumn('AL').eachCell((cell, rowNumber) => {
                    if (rowNumber > 1) { // Saltar el encabezado
                        // Definir la fórmula
                        cell.value = { formula: `AB${rowNumber}*0.19`};
                        
                        cell.numFmt = '0';

                    }
                });
            }

            if (sheetName === "Costos Único") {
                worksheet.getColumn('AM').eachCell((cell, rowNumber) => {
                    if (rowNumber > 1) { // Saltar el encabezado
                        // Definir la fórmula
                        cell.value = { formula: `AC${rowNumber}*0.19`};
                        
                        cell.numFmt = '0';

                    }
                });
            }

            if (sheetName === "Costos Único") {
                worksheet.getColumn('AN').eachCell((cell, rowNumber) => {
                    if (rowNumber > 1) { // Saltar el encabezado
                        // Definir la fórmula
                        cell.value = { formula: `AD${rowNumber}*0.19`};
                        
                        cell.numFmt = '0';

                    }
                });
            }

            if (sheetName === "Costos Único") {
                worksheet.getColumn('AO').eachCell((cell, rowNumber) => {
                    if (rowNumber > 1) { // Saltar el encabezado
                        // Definir la fórmula
                        cell.value = { formula: `AE${rowNumber}*0.19`};
                        
                        cell.numFmt = '0';

                    }
                });
            }

            if (sheetName === "Costos Único") {
                worksheet.getColumn('AP').eachCell((cell, rowNumber) => {
                    if (rowNumber > 1) { // Saltar el encabezado
                        // Definir la fórmula
                        cell.value = { formula: `AF${rowNumber}*0.19`};
                        
                        cell.numFmt = '0';

                    }
                });
            }

            if (sheetName === "Costos Único") {
                worksheet.getColumn('AR').eachCell((cell, rowNumber) => {
                    if (rowNumber > 1) { // Saltar el encabezado
                        // Definir la fórmula
                        cell.value = { formula: `Q${rowNumber}+S${rowNumber}+X${rowNumber}+AH${rowNumber}+AM${rowNumber}`};
                        
                        cell.numFmt = '0';

                    }
                });
            }

            if (sheetName === "Costos Único") {
                worksheet.getColumn('AS').eachCell((cell, rowNumber) => {
                    if (rowNumber > 1) { // Saltar el encabezado
                        // Definir la fórmula
                        cell.value = { formula: `Q${rowNumber}+T${rowNumber}+Y${rowNumber}+AI${rowNumber}+AN${rowNumber}`};
                        
                        cell.numFmt = '0';

                    }
                });
            }

            if (sheetName === "Costos Único") {
                worksheet.getColumn('AT').eachCell((cell, rowNumber) => {
                    if (rowNumber > 1) { // Saltar el encabezado
                        // Definir la fórmula
                        cell.value = { formula: `Q${rowNumber}+U${rowNumber}+Z${rowNumber}+AJ${rowNumber}+AO${rowNumber}`};
                        
                        cell.numFmt = '0';

                    }
                });
            }

            if (sheetName === "Costos Único") {
                worksheet.getColumn('AU').eachCell((cell, rowNumber) => {
                    if (rowNumber > 1) { // Saltar el encabezado
                        // Definir la fórmula
                        cell.value = { formula: `Q${rowNumber}+V${rowNumber}+AA${rowNumber}+AK${rowNumber}+AP${rowNumber}`};
                        
                        cell.numFmt = '0';

                    }
                });
            }


//----------------------------------------------------------------------------- Formulas del la Hoja Noche 1  ---------------------------------------------------------------------------------------------------//
            // Para la hoja "Noches 1"
            if (sheetName === "Noches 1") {
                worksheet.getColumn('AE').eachCell((cell, rowNumber) => {
                    if (rowNumber > 1) { // Saltar el encabezado
                        // Definir la fórmula
                        cell.value = { formula: `O${rowNumber}*0.19`};
                        
                        cell.numFmt = '0';

                    }
                });
            }

            if (sheetName === "Noches 1") {
                worksheet.getColumn('AF').eachCell((cell, rowNumber) => {
                    if (rowNumber > 1) { // Saltar el encabezado
                        // Definir la fórmula
                        cell.value = { formula: `P${rowNumber}*0.19`};
                        
                        cell.numFmt = '0';

                    }
                });
            }

            if (sheetName === "Noches 1") {
                worksheet.getColumn('AG').eachCell((cell, rowNumber) => {
                    if (rowNumber > 1) { // Saltar el encabezado
                        // Definir la fórmula
                        cell.value = { formula: `Q${rowNumber}*0.19`};
                        
                        cell.numFmt = '0';

                    }
                });
            }

            if (sheetName === "Noches 1") {
                worksheet.getColumn('AH').eachCell((cell, rowNumber) => {
                    if (rowNumber > 1) { // Saltar el encabezado
                        // Definir la fórmula
                        cell.value = { formula: `R${rowNumber}*0.19`};
                        
                        cell.numFmt = '0';

                    }
                });
            }

            if (sheetName === "Noches 1") {
                worksheet.getColumn('AI').eachCell((cell, rowNumber) => {
                    if (rowNumber > 1) { // Saltar el encabezado
                        // Definir la fórmula
                        cell.value = { formula: `S${rowNumber}*0.19`};
                        
                        cell.numFmt = '0';

                    }
                });
            }

            if (sheetName === "Noches 1") {
                worksheet.getColumn('AJ').eachCell((cell, rowNumber) => {
                    if (rowNumber > 1) { // Saltar el encabezado
                        // Definir la fórmula
                        cell.value = { formula: `T${rowNumber}+Y${rowNumber}+Z${rowNumber}+AE${rowNumber}`};
                        
                        cell.numFmt = '0';

                    }
                });
            }

            if (sheetName === "Noches 1") {
                worksheet.getColumn('AK').eachCell((cell, rowNumber) => {
                    if (rowNumber > 1) { // Saltar el encabezado
                        // Definir la fórmula
                        cell.value = { formula: `U${rowNumber}+Y${rowNumber}+AA${rowNumber}+AF${rowNumber}`};
                        
                        cell.numFmt = '0';

                    }
                });
            }

            if (sheetName === "Noches 1") {
                worksheet.getColumn('AL').eachCell((cell, rowNumber) => {
                    if (rowNumber > 1) { // Saltar el encabezado
                        // Definir la fórmula
                        cell.value = { formula: `V${rowNumber}+Y${rowNumber}+AB${rowNumber}+AG${rowNumber}`};
                        
                        cell.numFmt = '0';

                    }
                });
            }

            if (sheetName === "Noches 1") {
                worksheet.getColumn('AM').eachCell((cell, rowNumber) => {
                    if (rowNumber > 1) { // Saltar el encabezado
                        // Definir la fórmula
                        cell.value = { formula: `W${rowNumber}+Y${rowNumber}+AC${rowNumber}+AH${rowNumber}`};
                        
                        cell.numFmt = '0';

                    }
                });
            }

            if (sheetName === "Noches 1") {
                worksheet.getColumn('AN').eachCell((cell, rowNumber) => {
                    if (rowNumber > 1) { // Saltar el encabezado
                        // Definir la fórmula
                        cell.value = { formula: `X${rowNumber}+Y${rowNumber}+AD${rowNumber}+AI${rowNumber}`};
                        
                        cell.numFmt = '0';

                    }
                });
            }

//----------------------------------------------------------------------------- Formulas del la Hoja Noche 2  ---------------------------------------------------------------------------------------------------//

            // Para la hoja "Noches 2"
            if (sheetName === "Noches 2") {
                worksheet.getColumn('E').eachCell((cell, rowNumber) => {
                    if (rowNumber > 1) { // Saltar el encabezado
                        // Definir la fórmula
                        cell.value = { formula: `'Noches 1'!E${rowNumber}*2` };
                        
                        cell.numFmt = '0';

                    }
                });
            }

            if (sheetName === "Noches 2") {
                worksheet.getColumn('F').eachCell((cell, rowNumber) => {
                    if (rowNumber > 1) { // Saltar el encabezado
                        // Definir la fórmula
                        cell.value = { formula: `'Noches 1'!F${rowNumber}*2` };
                        
                        cell.numFmt = '0';

                    }
                });
            }

            if (sheetName === "Noches 2") {
                worksheet.getColumn('G').eachCell((cell, rowNumber) => {
                    if (rowNumber > 1) { // Saltar el encabezado
                        // Definir la fórmula
                        cell.value = { formula: `'Noches 1'!G${rowNumber}*2` };
                        
                        cell.numFmt = '0';

                    }
                });
            }

            if (sheetName === "Noches 2") {
                worksheet.getColumn('H').eachCell((cell, rowNumber) => {
                    if (rowNumber > 1) { // Saltar el encabezado
                        // Definir la fórmula
                        cell.value = { formula: `'Noches 1'!H${rowNumber}*2` };
                        
                        cell.numFmt = '0';

                    }
                });
            }

            if (sheetName === "Noches 2") {
                worksheet.getColumn('I').eachCell((cell, rowNumber) => {
                    if (rowNumber > 1) { // Saltar el encabezado
                        // Definir la fórmula
                        cell.value = { formula: `'Noches 1'!I${rowNumber}*2` };
                        
                        cell.numFmt = '0';

                    }
                });
            }

            if (sheetName === "Noches 2") {
                worksheet.getColumn('AE').eachCell((cell, rowNumber) => {
                    if (rowNumber > 1) { // Saltar el encabezado
                        // Definir la fórmula
                        cell.value = { formula: `O${rowNumber}*0.19`};
                        
                        cell.numFmt = '0';

                    }
                });
            }

            if (sheetName === "Noches 2") {
                worksheet.getColumn('AF').eachCell((cell, rowNumber) => {
                    if (rowNumber > 1) { // Saltar el encabezado
                        // Definir la fórmula
                        cell.value = { formula: `P${rowNumber}*0.19`};
                        
                        cell.numFmt = '0';

                    }
                });
            }

            if (sheetName === "Noches 2") {
                worksheet.getColumn('AG').eachCell((cell, rowNumber) => {
                    if (rowNumber > 1) { // Saltar el encabezado
                        // Definir la fórmula
                        cell.value = { formula: `Q${rowNumber}*0.19`};
                        
                        cell.numFmt = '0';

                    }
                });
            }

            if (sheetName === "Noches 2") {
                worksheet.getColumn('AH').eachCell((cell, rowNumber) => {
                    if (rowNumber > 1) { // Saltar el encabezado
                        // Definir la fórmula
                        cell.value = { formula: `R${rowNumber}*0.19`};
                        
                        cell.numFmt = '0';

                    }
                });
            }

            if (sheetName === "Noches 2") {
                worksheet.getColumn('AI').eachCell((cell, rowNumber) => {
                    if (rowNumber > 1) { // Saltar el encabezado
                        // Definir la fórmula
                        cell.value = { formula: `S${rowNumber}*0.19`};
                        
                        cell.numFmt = '0';

                    }
                });
            }

            if (sheetName === "Noches 2") {
                worksheet.getColumn('AJ').eachCell((cell, rowNumber) => {
                    if (rowNumber > 1) { // Saltar el encabezado
                        // Definir la fórmula
                        cell.value = { formula: `T${rowNumber}+Y${rowNumber}+Z${rowNumber}+AE${rowNumber}`};
                        
                        cell.numFmt = '0';

                    }
                });
            }

            if (sheetName === "Noches 2") {
                worksheet.getColumn('AK').eachCell((cell, rowNumber) => {
                    if (rowNumber > 1) { // Saltar el encabezado
                        // Definir la fórmula
                        cell.value = { formula: `U${rowNumber}+Y${rowNumber}+AA${rowNumber}+AF${rowNumber}`};
                        
                        cell.numFmt = '0';

                    }
                });
            }

            if (sheetName === "Noches 2") {
                worksheet.getColumn('AL').eachCell((cell, rowNumber) => {
                    if (rowNumber > 1) { // Saltar el encabezado
                        // Definir la fórmula
                        cell.value = { formula: `V${rowNumber}+Y${rowNumber}+AB${rowNumber}+AG${rowNumber}`};
                        
                        cell.numFmt = '0';

                    }
                });
            }

            if (sheetName === "Noches 2") {
                worksheet.getColumn('AM').eachCell((cell, rowNumber) => {
                    if (rowNumber > 1) { // Saltar el encabezado
                        // Definir la fórmula
                        cell.value = { formula: `W${rowNumber}+Y${rowNumber}+AC${rowNumber}+AH${rowNumber}`};
                        
                        cell.numFmt = '0';

                    }
                });
            }

            if (sheetName === "Noches 2") {
                worksheet.getColumn('AN').eachCell((cell, rowNumber) => {
                    if (rowNumber > 1) { // Saltar el encabezado
                        // Definir la fórmula
                        cell.value = { formula: `X${rowNumber}+Y${rowNumber}+AD${rowNumber}+AI${rowNumber}`};
                        
                        cell.numFmt = '0';

                    }
                });
            }

            
//----------------------------------------------------------------------------- Formulas del la Hoja Noche 3  ---------------------------------------------------------------------------------------------------//

            // Para la hoja "Noches 3"
            if (sheetName === "Noches 3") {
                worksheet.getColumn('E').eachCell((cell, rowNumber) => {
                    if (rowNumber > 1) { // Saltar el encabezado
                        // Definir la fórmula
                        cell.value = { formula: `'Noches 1'!E${rowNumber}*3` };
                        
                        cell.numFmt = '0';

                    }
                });
            }

            if (sheetName === "Noches 3") {
                worksheet.getColumn('F').eachCell((cell, rowNumber) => {
                    if (rowNumber > 1) { // Saltar el encabezado
                        // Definir la fórmula
                        cell.value = { formula: `'Noches 1'!F${rowNumber}*3` };
                        
                        cell.numFmt = '0';

                    }
                });
            }

            if (sheetName === "Noches 3") {
                worksheet.getColumn('G').eachCell((cell, rowNumber) => {
                    if (rowNumber > 1) { // Saltar el encabezado
                        // Definir la fórmula
                        cell.value = { formula: `'Noches 1'!G${rowNumber}*3` };
                        
                        cell.numFmt = '0';

                    }
                });
            }

            if (sheetName === "Noches 3") {
                worksheet.getColumn('H').eachCell((cell, rowNumber) => {
                    if (rowNumber > 1) { // Saltar el encabezado
                        // Definir la fórmula
                        cell.value = { formula: `'Noches 1'!H${rowNumber}*3` };
                        
                        cell.numFmt = '0';

                    }
                });
            }

            if (sheetName === "Noches 3") {
                worksheet.getColumn('I').eachCell((cell, rowNumber) => {
                    if (rowNumber > 1) { // Saltar el encabezado
                        // Definir la fórmula
                        cell.value = { formula: `'Noches 1'!I${rowNumber}*3` };
                        
                        cell.numFmt = '0';

                    }
                });
            }

            if (sheetName === "Noches 3") {
                worksheet.getColumn('AE').eachCell((cell, rowNumber) => {
                    if (rowNumber > 1) { // Saltar el encabezado
                        // Definir la fórmula
                        cell.value = { formula: `O${rowNumber}*0.19`};
                        
                        cell.numFmt = '0';

                    }
                });
            }

            if (sheetName === "Noches 3") {
                worksheet.getColumn('AF').eachCell((cell, rowNumber) => {
                    if (rowNumber > 1) { // Saltar el encabezado
                        // Definir la fórmula
                        cell.value = { formula: `P${rowNumber}*0.19`};
                        
                        cell.numFmt = '0';

                    }
                });
            }

            if (sheetName === "Noches 3") {
                worksheet.getColumn('AG').eachCell((cell, rowNumber) => {
                    if (rowNumber > 1) { // Saltar el encabezado
                        // Definir la fórmula
                        cell.value = { formula: `Q${rowNumber}*0.19`};
                        
                        cell.numFmt = '0';

                    }
                });
            }

            if (sheetName === "Noches 3") {
                worksheet.getColumn('AH').eachCell((cell, rowNumber) => {
                    if (rowNumber > 1) { // Saltar el encabezado
                        // Definir la fórmula
                        cell.value = { formula: `R${rowNumber}*0.19`};
                        
                        cell.numFmt = '0';

                    }
                });
            }

            if (sheetName === "Noches 3") {
                worksheet.getColumn('AI').eachCell((cell, rowNumber) => {
                    if (rowNumber > 1) { // Saltar el encabezado
                        // Definir la fórmula
                        cell.value = { formula: `S${rowNumber}*0.19`};
                        
                        cell.numFmt = '0';

                    }
                });
            }

            if (sheetName === "Noches 3") {
                worksheet.getColumn('AJ').eachCell((cell, rowNumber) => {
                    if (rowNumber > 1) { // Saltar el encabezado
                        // Definir la fórmula
                        cell.value = { formula: `T${rowNumber}+Y${rowNumber}+Z${rowNumber}+AE${rowNumber}`};
                        
                        cell.numFmt = '0';

                    }
                });
            }

            if (sheetName === "Noches 3") {
                worksheet.getColumn('AK').eachCell((cell, rowNumber) => {
                    if (rowNumber > 1) { // Saltar el encabezado
                        // Definir la fórmula
                        cell.value = { formula: `U${rowNumber}+Y${rowNumber}+AA${rowNumber}+AF${rowNumber}`};
                        
                        cell.numFmt = '0';

                    }
                });
            }

            if (sheetName === "Noches 3") {
                worksheet.getColumn('AL').eachCell((cell, rowNumber) => {
                    if (rowNumber > 1) { // Saltar el encabezado
                        // Definir la fórmula
                        cell.value = { formula: `V${rowNumber}+Y${rowNumber}+AB${rowNumber}+AG${rowNumber}`};
                        
                        cell.numFmt = '0';

                    }
                });
            }

            if (sheetName === "Noches 3") {
                worksheet.getColumn('AM').eachCell((cell, rowNumber) => {
                    if (rowNumber > 1) { // Saltar el encabezado
                        // Definir la fórmula
                        cell.value = { formula: `W${rowNumber}+Y${rowNumber}+AC${rowNumber}+AH${rowNumber}`};
                        
                        cell.numFmt = '0';

                    }
                });
            }

            if (sheetName === "Noches 3") {
                worksheet.getColumn('AN').eachCell((cell, rowNumber) => {
                    if (rowNumber > 1) { // Saltar el encabezado
                        // Definir la fórmula
                        cell.value = { formula: `X${rowNumber}+Y${rowNumber}+AD${rowNumber}+AI${rowNumber}`};
                        
                        cell.numFmt = '0';

                    }
                });
            }

//----------------------------------------------------------------------------- Formulas del la Hoja Noche 4  ---------------------------------------------------------------------------------------------------//

            // Para la hoja "Noches 4"
            if (sheetName === "Noches 4") {
                worksheet.getColumn('E').eachCell((cell, rowNumber) => {
                    if (rowNumber > 1) { // Saltar el encabezado
                        // Definir la fórmula
                        cell.value = { formula: `'Noches 1'!E${rowNumber}*4` };
                        
                        cell.numFmt = '0';

                    }
                });
            }

            if (sheetName === "Noches 4") {
                worksheet.getColumn('F').eachCell((cell, rowNumber) => {
                    if (rowNumber > 1) { // Saltar el encabezado
                        // Definir la fórmula
                        cell.value = { formula: `'Noches 1'!F${rowNumber}*4` };
                        
                        cell.numFmt = '0';

                    }
                });
            }

            if (sheetName === "Noches 4") {
                worksheet.getColumn('G').eachCell((cell, rowNumber) => {
                    if (rowNumber > 1) { // Saltar el encabezado
                        // Definir la fórmula
                        cell.value = { formula: `'Noches 1'!G${rowNumber}*4` };
                        
                        cell.numFmt = '0';

                    }
                });
            }

            if (sheetName === "Noches 4") {
                worksheet.getColumn('H').eachCell((cell, rowNumber) => {
                    if (rowNumber > 1) { // Saltar el encabezado
                        // Definir la fórmula
                        cell.value = { formula: `'Noches 1'!H${rowNumber}*4` };
                        
                        cell.numFmt = '0';

                    }
                });
            }

            if (sheetName === "Noches 4") {
                worksheet.getColumn('I').eachCell((cell, rowNumber) => {
                    if (rowNumber > 1) { // Saltar el encabezado
                        // Definir la fórmula
                        cell.value = { formula: `'Noches 1'!I${rowNumber}*4` };
                        
                        cell.numFmt = '0';

                    }
                });
            }

            if (sheetName === "Noches 4") {
                worksheet.getColumn('AE').eachCell((cell, rowNumber) => {
                    if (rowNumber > 1) { // Saltar el encabezado
                        // Definir la fórmula
                        cell.value = { formula: `O${rowNumber}*0.19`};
                        
                        cell.numFmt = '0';

                    }
                });
            }

            if (sheetName === "Noches 4") {
                worksheet.getColumn('AF').eachCell((cell, rowNumber) => {
                    if (rowNumber > 1) { // Saltar el encabezado
                        // Definir la fórmula
                        cell.value = { formula: `P${rowNumber}*0.19`};
                        
                        cell.numFmt = '0';

                    }
                });
            }

            if (sheetName === "Noches 4") {
                worksheet.getColumn('AG').eachCell((cell, rowNumber) => {
                    if (rowNumber > 1) { // Saltar el encabezado
                        // Definir la fórmula
                        cell.value = { formula: `Q${rowNumber}*0.19`};
                        
                        cell.numFmt = '0';

                    }
                });
            }

            if (sheetName === "Noches 4") {
                worksheet.getColumn('AH').eachCell((cell, rowNumber) => {
                    if (rowNumber > 1) { // Saltar el encabezado
                        // Definir la fórmula
                        cell.value = { formula: `R${rowNumber}*0.19`};
                        
                        cell.numFmt = '0';

                    }
                });
            }

            if (sheetName === "Noches 4") {
                worksheet.getColumn('AI').eachCell((cell, rowNumber) => {
                    if (rowNumber > 1) { // Saltar el encabezado
                        // Definir la fórmula
                        cell.value = { formula: `S${rowNumber}*0.19`};
                        
                        cell.numFmt = '0';

                    }
                });
            }

            if (sheetName === "Noches 4") {
                worksheet.getColumn('AJ').eachCell((cell, rowNumber) => {
                    if (rowNumber > 1) { // Saltar el encabezado
                        // Definir la fórmula
                        cell.value = { formula: `T${rowNumber}+Y${rowNumber}+Z${rowNumber}+AE${rowNumber}`};
                        
                        cell.numFmt = '0';

                    }
                });
            }

            if (sheetName === "Noches 4") {
                worksheet.getColumn('AK').eachCell((cell, rowNumber) => {
                    if (rowNumber > 1) { // Saltar el encabezado
                        // Definir la fórmula
                        cell.value = { formula: `U${rowNumber}+Y${rowNumber}+AA${rowNumber}+AF${rowNumber}`};
                        
                        cell.numFmt = '0';

                    }
                });
            }

            if (sheetName === "Noches 4") {
                worksheet.getColumn('AL').eachCell((cell, rowNumber) => {
                    if (rowNumber > 1) { // Saltar el encabezado
                        // Definir la fórmula
                        cell.value = { formula: `V${rowNumber}+Y${rowNumber}+AB${rowNumber}+AG${rowNumber}`};
                        
                        cell.numFmt = '0';

                    }
                });
            }

            if (sheetName === "Noches 4") {
                worksheet.getColumn('AM').eachCell((cell, rowNumber) => {
                    if (rowNumber > 1) { // Saltar el encabezado
                        // Definir la fórmula
                        cell.value = { formula: `W${rowNumber}+Y${rowNumber}+AC${rowNumber}+AH${rowNumber}`};
                        
                        cell.numFmt = '0';

                    }
                });
            }

            if (sheetName === "Noches 4") {
                worksheet.getColumn('AN').eachCell((cell, rowNumber) => {
                    if (rowNumber > 1) { // Saltar el encabezado
                        // Definir la fórmula
                        cell.value = { formula: `X${rowNumber}+Y${rowNumber}+AD${rowNumber}+AI${rowNumber}`};
                        
                        cell.numFmt = '0';

                    }
                });
            }

//------------------------------------------------------------------------- Formulas del la Hoja Noche Adicional  -----------------------------------------------------------------------------------------------//









            //--------------------------------------------------------------------------------- Formulas del Excel  -------------------------------------------------------------------------------------------------------------//
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
        workbook.calcProperties = {
            fullCalcOnLoad: true
        };

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

            // Obtener estructura de la tabla para verificar los tipos de columnas
            const [tableInfo] = await conn.query(`DESCRIBE ??`, [tableName]);
            console.log(`Estructura de la tabla ${tableName}:`, tableInfo);
            
            // Crear un mapa de nombres de columnas a tipos de datos
            const columnTypes = {};
            tableInfo.forEach(column => {
                columnTypes[column.Field.toLowerCase()] = {
                    type: column.Type,
                    isNumeric: column.Type.includes('int') || 
                               column.Type.includes('decimal') || 
                               column.Type.includes('float') || 
                               column.Type.includes('double'),
                    allowNull: column.Null === 'YES',
                    defaultValue: column.Default
                };
            });


        
            await conn.query(`DELETE FROM ??`, [tableName]); // 🔥 Limpiar datos anteriores antes de insertar nuevos
        
            // Obtener nombres de columnas del Excel
            const headerRow = worksheet.getRow(1);
            const excelColumns = [];
            headerRow.eachCell({ includeEmpty: false }, (cell, colNumber) => {
                if (cell.value) {
                    let columnName = typeof cell.value === 'string' ? 
                        cell.value.replace(/\s+/g, '_') : 
                        String(cell.value).replace(/\s+/g, '_');
                    excelColumns[colNumber] = columnName;
                }
            });
            
            console.log("Columnas obtenidas de Excel:", excelColumns);

            // Filtrar para obtener solo columnas existentes en la base de datos
            const validColumns = [];
            for (const excelCol of excelColumns) {
                if (!excelCol) continue;
                
                // Buscar coincidencia en la base de datos (ignorando mayúsculas/minúsculas)
                const matchingDbColumn = tableInfo.find(dbCol => 
                    dbCol.Field.toLowerCase() === excelCol.toLowerCase());
                
                if (matchingDbColumn) {
                    // Usar el nombre exacto de la columna de la BD para evitar problemas de mayúsculas
                    validColumns.push(matchingDbColumn.Field);
                }
            }
            
            console.log("Columnas válidas para inserción:", validColumns);
            
            if (validColumns.length === 0) {
                console.log(`⚠️ No se encontraron columnas válidas en la hoja ${sheetName}`);
                continue;
            }            
        
            const values = [];
        
            // Procesar cada fila de datos
                        for (let rowNumber = 2; rowNumber <= worksheet.rowCount; rowNumber++) {
                            const row = worksheet.getRow(rowNumber);
                            
                            // Verificar si la fila tiene datos
                            let hasData = false;
                            row.eachCell({ includeEmpty: false }, () => {
                                hasData = true;
                            });
                            
                            if (!hasData) continue; // Saltar filas vacías
                            
                            const rowData = [];
                            let rowIsValid = true;
                            
                            // Para cada columna válida, obtener el valor correspondiente
                            for (const dbColumn of validColumns) {
                                // Encontrar el índice de la columna en el Excel
                                const colIndex = excelColumns.findIndex(col => 
                                    col && col.toLowerCase() === dbColumn.toLowerCase());
                                
                                if (colIndex === -1) {
                                    // Si la columna no existe en Excel pero es requerida en BD
                                    const columnInfo = columnTypes[dbColumn.toLowerCase()];
                                    if (!columnInfo.allowNull && columnInfo.defaultValue === null) {
                                        console.log(`⚠️ La columna ${dbColumn} es obligatoria pero no está en Excel. Fila ${rowNumber} inválida.`);
                                        rowIsValid = false;
                                        break;
                                    }
                                    // Si permite NULL o tiene valor por defecto, usamos null
                                    rowData.push(null);
                                    continue;
                                }
                                
                                const cell = row.getCell(colIndex);
                                let value = null;
                                
                                // Extraer valor según el tipo de celda
                                if (cell && cell.value !== null && cell.value !== undefined) {
                                    if (cell.type === ExcelJS.ValueType.Formula || 
                                        cell.type === ExcelJS.ValueType.SharedFormula) {
                                        value = cell.result !== undefined ? cell.result : null;
                                    } else {
                                        value = cell.value;
                                    }
                                }
                                
                                // Convertir tipos de datos si es necesario
                                const columnInfo = columnTypes[dbColumn.toLowerCase()];
                                if (columnInfo && columnInfo.isNumeric && value !== null) {
                                    // Si el valor es un string, eliminar comas y convertir a número
                                    if (typeof value === 'string') {
                                        value = value.replace(/,/g, '');
                                        value = parseFloat(value);
                                    }

                                    // 🔹 Si la columna es ENTERA, redondear el valor
                                    if (columnInfo.type.includes('int')) {
                                        value = Math.round(value);
                                    }

                                    // Si el valor no es un número válido, establecer como 0 o null
                                    if (isNaN(value)) {
                                        value = columnInfo.allowNull ? null : 0;
                                    }
                                }

                                
                                // Verificar si la columna no permite NULL
                                if (value === null && !columnInfo.allowNull) {
                                    if (dbColumn.toLowerCase() === 'id' && tableName === 'costos') {
                                        // Para la columna ID en la tabla costos, generamos un valor secuencial
                                        // basado en el número de fila (asumiendo que es un autoincrement)
                                        value = rowNumber - 1; // Ajustar según tu lógica
                                    } else {
                                        // Para otras columnas que no pueden ser NULL, usamos un valor por defecto basado en su tipo
                                        if (columnInfo.isNumeric) value = 0;
                                        else value = '';
                                        
                                        console.log(`⚠️ Valor por defecto para columna requerida ${dbColumn}: ${value}`);
                                    }
                                }
                                
                                rowData.push(value);
                            }
                            
                            if (rowIsValid) {
                                values.push(rowData);
                            }
                        }
        
                       if (values.length > 0) {
                        // Crear consulta parametrizada
                        const placeholders = values.map(() => 
                            `(${validColumns.map(() => '?').join(', ')})`).join(', ');
                        
                        const query = `INSERT INTO ${tableName} (\`${validColumns.join('`, `')}\`) VALUES ${placeholders}`;
                        
                        // Aplanar el array de valores para la consulta parametrizada
                        const flatValues = values.flat();
                        
                        console.log(`Ejecutando consulta INSERT para ${values.length} filas...`);
                        await conn.query(query, flatValues);
                        console.log(`✅ Insertados ${values.length} registros en ${tableName}`);
                    } else {
                        console.log(`⚠️ No hay datos para insertar en ${tableName}`);
                    }
                }
                
                fs.unlinkSync(req.file.path); // 🗑️ Eliminar el archivo después de procesarlo
                res.send("Datos actualizados correctamente.");
            } catch (error) {
                console.error("Error procesando Excel:", error);
                res.status(500).send(`Error al procesar el archivo: ${error.message}`);
            } finally {
                if (conn) await conn.end();
            }
        });