import fs from 'fs';
import path from 'path';
import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

/**
 * Word fayllarini PDF ga aylantirish
 * @param {Array} docxPaths - Word fayl yo'llari
 * @param {string} outputPath - Chiqarish fayli yo'li
 * @param {string} customName - Maxsus nom
 */
export async function wordToPdf(docxPaths, outputPath, customName = null) {
    try {
        if (!docxPaths || docxPaths.length === 0) {
            throw new Error('Word fayllar topilmadi');
        }

        // LibreOffice orqali konversiya
        for (const docxPath of docxPaths) {
            if (!fs.existsSync(docxPath)) {
                throw new Error(`Fayl mavjud emas: ${docxPath}`);
            }

            const command = `libreoffice --headless --convert-to pdf --outdir "${path.dirname(outputPath)}" "${docxPath}"`;
            await execAsync(command);
        }

        return true;
    } catch (error) {
        console.error('Word to PDF konversiya xatoligi:', error);
        throw error;
    }
}

/**
 * PDF fayllarini Word ga aylantirish
 * @param {Array} pdfPaths - PDF fayl yo'llari
 * @param {string} outputPath - Chiqarish fayli yo'li
 */
export async function pdfToWord(pdfPaths, outputPath) {
    try {
        if (!pdfPaths || pdfPaths.length === 0) {
            throw new Error('PDF fayllar topilmadi');
        }

        // LibreOffice orqali konversiya
        for (const pdfPath of pdfPaths) {
            if (!fs.existsSync(pdfPath)) {
                throw new Error(`Fayl mavjud emas: ${pdfPath}`);
            }

            const command = `libreoffice --headless --convert-to docx --outdir "${path.dirname(outputPath)}" "${pdfPath}"`;
            await execAsync(command);
        }

        return true;
    } catch (error) {
        console.error('PDF to Word konversiya xatoligi:', error);
        throw error;
    }
}
