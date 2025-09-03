import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// .env faylini to'g'ri yo'ldan yuklash
dotenv.config({ path: path.join(__dirname, '../../.env') });

export const config = {
    botToken: process.env.BOT_TOKEN,
    maxFileSize: parseInt(process.env.MAX_FILE_SIZE) || 104857600, // 100MB (oshirildi)
    tempDir: process.env.TEMP_DIR || 'temp',
    downloadsDir: process.env.DOWNLOADS_DIR || 'downloads',
    adminUsername: process.env.ADMIN_USERNAME || 'AbdujabborSharobiddinov',
    adminId: process.env.ADMIN_ID || '7108854464', // Admin Telegram ID

    // Majburiy kanal
    requiredChannel: {
        username: 'development39',
        id: '-1002328866502',
        name: 'Sharobiddinov',
        link: 'https://t.me/development39'
    },

    // Conversion types
    conversionTypes: {
        JPG_TO_PDF: 'jpg_to_pdf',
        PNG_TO_PDF: 'png_to_pdf',
        WORD_TO_PDF: 'word_to_pdf',
        PDF_TO_WORD: 'pdf_to_word',
        MERGE_PDF: 'merge_pdf'
    },

    // User states
    userStates: {
        WAITING_JPG: 'waiting_jpg',
        WAITING_PNG: 'waiting_png',
        WAITING_DOCX: 'waiting_docx',
        WAITING_PDF_TO_WORD: 'waiting_pdf_to_word',
        WAITING_PDFS_TO_MERGE: 'waiting_pdfs_to_merge',
        WAITING_OUTPUT_NAME: 'waiting_output_name',
        SELECTING_LANGUAGE: 'selecting_language'
    },

    // Tillar
    languages: {
        UZ: 'uz',
        RU: 'ru',
        EN: 'en'
    },

    // Cheklovlar (minimal)
    limits: {
        maxFilesPerSession: 1000, // Juda ko'p (amalda cheklovsiz)
        minPdfFiles: 2, // PDF birlashtirish uchun minimal
        maxImageSize: 50 * 1024 * 1024, // 50MB per image (cheklov yo'q deyarli)
        processingTimeout: 300000 // 5 minut timeout
    }
};

export default config;
