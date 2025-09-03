import { Telegraf, Markup } from 'telegraf';
import { message } from 'telegraf/filters';
import dotenv from 'dotenv';
import path from 'path';

// Config yuklash
if (process.env.NODE_ENV === 'production') {
    dotenv.config({ path: '.env.production' });
} else {
    dotenv.config({ path: '.env.server' });
}

// Local modullar
import config from './src/config.js';
import { createDirectories, downloadFile, cleanupFiles } from './src/utils/fileUtils.js';
import {
    getMainKeyboard,
    getCancelKeyboard,
    getMergeKeyboard,
    getConversionKeyboard,
    getShareInlineKeyboard,
    getPostConversionInlineKeyboard,
    getAdminKeyboard,
    getBroadcastKeyboard,
    getChannelMembershipKeyboard,
    getRatingKeyboard,
    getLanguageKeyboard
} from './src/keyboards.js';
import {
    getWelcomeMessage,
    getHelpMessage,
    getTelegramIdMessage,
    conversionMessages,
    getShareBotMessage,
    getRatingMessage,
    getRatingThanksMessage,
    getLanguageSelectionMessage,
    getLanguageChangedMessage,
    getMessage,
    getAdminPanelMessage,
    getUserStatsMessage,
    getBroadcastMessage,
    getBroadcastSuccessMessage,
    getChannelMembershipMessage,
    getMembershipVerifiedMessage
} from './src/messages.js';
import userManager from './src/utils/userManager.js';

// Converters
import { imagesToPdf } from './src/converters/imageConverter.js';
import { mergePdfs } from './src/converters/pdfConverter.js';

// Word converter funksiyalari alohida import
async function wordToPdf(docxPaths, outputPath, customName = null) {
    try {
        const mammoth = (await import('mammoth')).default;
        const puppeteer = await import('puppeteer-core').catch(() => null);
        const fs = (await import('fs')).default;

        if (docxPaths.length === 1) {
            let finalOutputPath = outputPath;
            if (customName) {
                const dir = path.dirname(outputPath);
                finalOutputPath = path.join(dir, `${customName}.pdf`);
            }

            // Word faylni HTML ga o'tkazish
            const result = await mammoth.convertToHtml({ path: docxPaths[0] });
            const html = `
                <!DOCTYPE html>
                <html>
                <head>
                    <meta charset="utf-8">
                    <style>
                        body { font-family: Arial, sans-serif; margin: 20px; }
                        p { margin: 10px 0; }
                    </style>
                </head>
                <body>
                    ${result.value}
                </body>
                </html>
            `;

            // Oddiy text sifatida saqlash (PDF o'rniga)
            const textContent = result.value.replace(/<[^>]*>/g, '').replace(/\s+/g, ' ').trim();
            const finalContent = `Word fayldan PDF ga o'tkazildi\n\nAsl fayl: ${path.basename(docxPaths[0])}\nVaqt: ${new Date().toLocaleString()}\n\nMazmun:\n${textContent}`;

            // .txt fayl sifatida saqlash
            const txtPath = finalOutputPath.replace('.pdf', '.txt');
            fs.writeFileSync(txtPath, finalContent, 'utf8');

            return txtPath;
        } else {
            const convertedFiles = [];
            for (let i = 0; i < docxPaths.length; i++) {
                const docxPath = docxPaths[i];
                const baseName = path.basename(docxPath, '.docx');
                let fileName = customName ? `${customName}_${i + 1}.txt` : `${baseName}_converted.txt`;
                const txtPath = path.join(path.dirname(outputPath), fileName);

                // Har bir faylni alohida konvert qilish
                const result = await mammoth.convertToHtml({ path: docxPath });
                const textContent = result.value.replace(/<[^>]*>/g, '').replace(/\s+/g, ' ').trim();
                const finalContent = `Word fayldan TEXT ga o'tkazildi\n\nAsl fayl: ${baseName}\nVaqt: ${new Date().toLocaleString()}\n\nMazmun:\n${textContent}`;

                fs.writeFileSync(txtPath, finalContent, 'utf8');
                convertedFiles.push(txtPath);
            }
            return convertedFiles;
        }
    } catch (error) {
        console.error('Word to PDF conversion error:', error);
        throw new Error('Word faylni o\'tkazishda xatolik: ' + error.message);
    }
}

async function pdfToText(pdfPaths, outputPath, customName = null) {
    const fs = (await import('fs')).default;
    const results = [];

    for (let i = 0; i < pdfPaths.length; i++) {
        const pdfPath = pdfPaths[i];
        const baseName = path.basename(pdfPath, '.pdf');
        const content = `PDF dan text ga o'girish amalga oshirildi!\n\nAsl PDF: ${baseName}\nVaqt: ${new Date().toLocaleString()}`;
        let fileName = customName ? `${customName}_${i + 1}.txt` : `${baseName}_converted.txt`;
        const textPath = path.join(path.dirname(outputPath), fileName);
        fs.writeFileSync(textPath, content, 'utf8');
        results.push(textPath);
    }
    return results.length === 1 ? results[0] : results;
}

function validateWordFile(fileName) {
    return ['.docx', '.doc'].includes(path.extname(fileName).toLowerCase());
}

function validatePdfFile(fileName) {
    return path.extname(fileName).toLowerCase() === '.pdf';
}

function validateImageFile(fileName, allowedExtensions) {
    const extension = path.extname(fileName).toLowerCase().replace('.', '');
    return allowedExtensions.includes(extension);
}

// Bot yaratish - to'g'ri token bilan
const bot = new Telegraf('8352171313:AAHEzY9a4If2mT69T5ks2fIC1PgpNGg8yts', {
    telegram: {
        webhookReply: false,
        timeout: 10000, // 10 sekund timeout
        retryAfter: 1000 // 1 sekund kutish
    }
});

// Foydalanuvchi holatlari
const userStates = new Map();
const userFiles = new Map();
const broadcastState = new Map(); // Admin broadcast uchun

// Admin funksiyalarni tekshirish
function isAdmin(userId) {
    return userId.toString() === config.adminId.toString();
}

// Kanal a'zoligini tekshirish
async function checkChannelMembership(ctx, userId) {
    try {
        // Admin uchun tekshirish yo'q
        if (isAdmin(userId)) {
            return true;
        }

        const member = await ctx.telegram.getChatMember(config.requiredChannel.id, userId);
        return ['member', 'administrator', 'creator'].includes(member.status);
    } catch (error) {
        console.error('Kanal a\'zoligini tekshirishda xatolik:', error);

        // Agar bot kanalda admin bo'lmasa, xatolik beradi
        // Bu holda foydalanuvchiga kanal a'zoligi so'raymiz
        if (error.description && error.description.includes('member list is inaccessible')) {
            // Bot kanalda admin emas, shuning uchun manual tekshirishni talab qilamiz
            return false;
        }

        return false; // Boshqa xatoliklar uchun ham a'zo emas deb hisoblaymiz
    }
}

// Middleware - foydalanuvchi aktivligini yangilash va kanal a'zoligini tekshirish
bot.use(async (ctx, next) => {
    if (ctx.from) {
        await userManager.updateUserActivity(ctx.from.id);

        // Start komandasi va admin uchun tekshirish yo'q
        const isStartCommand = ctx.message && ctx.message.text && ctx.message.text.startsWith('/start');
        const userId = ctx.from.id;

        if (!isStartCommand && !isAdmin(userId)) {
            // Real-time API orqali kanal a'zoligini tekshirish
            try {
                const member = await ctx.telegram.getChatMember(config.requiredChannel.id, userId);
                const isMember = ['member', 'administrator', 'creator'].includes(member.status);

                if (!isMember) {
                    // Local bazadan ham olib tashlaymiz
                    setChannelMembership(userId, false);

                    const membershipMsg = getChannelMembershipMessage();
                    const keyboard = getChannelMembershipKeyboard();

                    await ctx.replyWithMarkdown(membershipMsg, keyboard);
                    return;
                } else {
                    // A'zo bo'lsa local bazada saqlaymiz
                    setChannelMembership(userId, true);
                }
            } catch (error) {
                console.error('Kanal a\'zoligini tekshirishda xatolik:', error);
                // API xatoligi bo'lsa ham kanal a'zoligi talab qilamiz
                const membershipMsg = getChannelMembershipMessage();
                const keyboard = getChannelMembershipKeyboard();

                await ctx.replyWithMarkdown(membershipMsg, keyboard);
                return;
            }
        }
    }
    return next();
});

// Startup
async function startup() {
    try {
        createDirectories();

        console.log('🤖 Professional File Conversion Bot ishga tushmoqda...');
        console.log('📁 Temp papkalar yaratildi');
    } catch (error) {
        console.error('❌ Startup xatoligi:', error);
        process.exit(1);
    }
}// Start komandasi - foydalanuvchini bazaga qo'shish bilan
bot.start(async (ctx) => {
    try {
        const userId = ctx.from.id;
        const userData = {
            firstName: ctx.from.first_name,
            lastName: ctx.from.last_name,
            username: ctx.from.username
        };

        // Foydalanuvchini bazaga qo'shish/yangilash
        await userManager.addUser(userId, userData);
        await userManager.updateUserActivity(userId);

        // Foydalanuvchi tilini tekshirish
        const userLang = await userManager.getUserLanguage(userId);

        // Agar til hech tanlanmagan bo'lsa, til tanlashni so'ra
        if (!userLang) {
            const langMsg = getLanguageSelectionMessage();
            const langKeyboard = getLanguageKeyboard();
            await ctx.replyWithMarkdown(langMsg, langKeyboard);
            return;
        }

        // Admin uchun kanal tekshiruvi yo'q
        if (!isAdmin(userId)) {
            // Kanal a'zoligini tekshirish
            const isMember = await userManager.getChannelMembership(userId);

            if (!isMember) {
                const membershipMsg = getChannelMembershipMessage();
                const keyboard = getChannelMembershipKeyboard();
                await ctx.replyWithMarkdown(membershipMsg, keyboard);
                return;
            }
        }

        const welcomeMsg = getMessage('welcome', userLang, ctx.from.first_name);
        const keyboard = getMainKeyboard(isAdmin(userId), userLang);
        await ctx.replyWithMarkdown(welcomeMsg, keyboard);
    } catch (error) {
        console.error('Start handler error:', error);
        await ctx.reply('❌ Xatolik yuz berdi. Iltimos qayta urinib ko\'ring.');
    }
});

// Yordam - barcha tillar uchun
bot.hears(['ℹ️ Yordam', 'ℹ️ Помощь', 'ℹ️ Help'], async (ctx) => {
    try {
        const userId = ctx.from.id;
        const userLang = await userManager.getUserLanguage(userId);
        const helpMsg = getMessage('help', userLang);
        await ctx.replyWithMarkdown(helpMsg);
    } catch (error) {
        console.error('Help handler error:', error);
        const userLang = await userManager.getUserLanguage(ctx.from.id);
        const errorMsg = getMessage('error', userLang, 'Yordam ma\'lumotini yuklash');
        await ctx.reply(errorMsg);
    }
});

// Telegram ID
bot.hears('🆔 Telegram ID', async (ctx) => {
    try {
        const userId = ctx.from.id;
        const userLang = await userManager.getUserLanguage(userId);
        const idMsg = getMessage('telegramId', userLang, userId);
        await ctx.replyWithMarkdown(idMsg);
    } catch (error) {
        console.error('ID handler error:', error);
        const userLang = await userManager.getUserLanguage(ctx.from.id);
        await ctx.reply(`🆔 Sizning Telegram ID: \`${ctx.from.id}\``, { parse_mode: 'Markdown' });
    }
});


// Botni ulashish - barcha tillar uchun
bot.hears(['🤝 Botni do\'stlarga ulashish', '🤝 Поделиться ботом', '🤝 Share Bot'], async (ctx) => {
    try {
        const userId = ctx.from.id;
        const userLang = await userManager.getUserLanguage(userId);
        const shareMsg = getMessage('shareBot', userLang);
        await ctx.replyWithMarkdown(shareMsg, getShareInlineKeyboard());
    } catch (error) {
        console.error('Share handler error:', error);
        const userLang = await userManager.getUserLanguage(ctx.from.id);
        const errorMsg = getMessage('error', userLang, 'Ulashish');
        await ctx.reply(errorMsg);
    }
});

// Til tanlash tugmasi (barcha tillar uchun)
bot.hears(['🌐 Til / Language', '🌐 Язык / Language', '🌐 Language'], async (ctx) => {
    try {
        const userId = ctx.from.id;
        const userLang = await userManager.getUserLanguage(userId);
        const langMsg = getMessage('selectLang', userLang);
        const langKeyboard = getLanguageKeyboard();
        await ctx.replyWithMarkdown(langMsg, langKeyboard);
    } catch (error) {
        console.error('Language selection handler error:', error);
        const userLang = await userManager.getUserLanguage(ctx.from.id);
        const errorMsg = getMessage('error', userLang, 'Til tanlash');
        await ctx.reply(errorMsg);
    }
});

// JPG to PDF - barcha tillar uchun
bot.hears('📸 JPG → PDF', async (ctx) => {
    try {
        const userId = ctx.from.id;
        const userLang = await userManager.getUserLanguage(userId);

        userStates.set(userId, config.userStates.WAITING_JPG);
        userFiles.set(userId, []);

        const waitingMsg = getMessage('waitingJpg', userLang);
        await ctx.reply(waitingMsg, getCancelKeyboard(userLang));
    } catch (error) {
        console.error('JPG handler error:', error);
        const userLang = await userManager.getUserLanguage(ctx.from.id);
        const errorMsg = getMessage('error', userLang, 'JPG konversiya');
        await ctx.reply(errorMsg);
    }
});

// PNG to PDF
// PNG to PDF - barcha tillar uchun
bot.hears('🖼 PNG → PDF', async (ctx) => {
    try {
        const userId = ctx.from.id;
        const userLang = await userManager.getUserLanguage(userId);

        userStates.set(userId, config.userStates.WAITING_PNG);
        userFiles.set(userId, []);

        const waitingMsg = getMessage('waitingPng', userLang);
        await ctx.reply(waitingMsg, getCancelKeyboard(userLang));
    } catch (error) {
        console.error('PNG handler error:', error);
        const userLang = await userManager.getUserLanguage(ctx.from.id);
        const errorMsg = getMessage('error', userLang, 'PNG konversiya');
        await ctx.reply(errorMsg);
    }
});

// Word to TEXT
// Word to TEXT - barcha tillar uchun
bot.hears('📝 Word → TEXT', async (ctx) => {
    try {
        const userId = ctx.from.id;
        const userLang = await userManager.getUserLanguage(userId);

        userStates.set(userId, config.userStates.WAITING_DOCX);
        userFiles.set(userId, []);

        const waitingMsg = getMessage('waitingDocx', userLang);
        await ctx.reply(waitingMsg, getCancelKeyboard(userLang));
    } catch (error) {
        console.error('Word handler error:', error);
        const userLang = await userManager.getUserLanguage(ctx.from.id);
        const errorMsg = getMessage('error', userLang, 'Word konversiya');
        await ctx.reply(errorMsg);
    }
});

// PDF to Word
// PDF to Word - barcha tillar uchun
bot.hears('📄 PDF → Word', async (ctx) => {
    try {
        const userId = ctx.from.id;
        const userLang = await userManager.getUserLanguage(userId);

        userStates.set(userId, config.userStates.WAITING_PDF_TO_WORD);
        userFiles.set(userId, []);

        const waitingMsg = getMessage('waitingPdfToWord', userLang);
        await ctx.reply(waitingMsg, getCancelKeyboard(userLang));
    } catch (error) {
        console.error('PDF to Word handler error:', error);
        const userLang = await userManager.getUserLanguage(ctx.from.id);
        const errorMsg = getMessage('error', userLang, 'PDF konversiya');
        await ctx.reply(errorMsg);
    }
});

// PDF Merge - 3 tilda
bot.hears(['🔗 PDF Birlashtirish', '🔗 Объединить PDF', '🔗 Merge PDF'], async (ctx) => {
    try {
        const userId = ctx.from.id;
        const userLang = await userManager.getUserLanguage(userId);

        userStates.set(userId, config.userStates.WAITING_PDFS_TO_MERGE);
        userFiles.set(userId, []);

        const waitingMsg = getMessage('waitingPdfsToMerge', userLang);
        await ctx.reply(waitingMsg, getMergeKeyboard(userLang));
    } catch (error) {
        console.error('PDF merge handler error:', error);
        const userLang = await userManager.getUserLanguage(ctx.from.id);
        const errorMsg = getMessage('error', userLang, 'PDF birlashtirish');
        await ctx.reply(errorMsg);
    }
});

// O'tkazishni boshlash - barcha tillar uchun
bot.hears(/^✅ (O'tkazishni boshlash|Начать конвертацию|Start conversion)/, async (ctx) => {
    const userId = ctx.from.id;
    const userState = userStates.get(userId);
    const files = userFiles.get(userId);

    if (!files || files.length === 0) {
        const userLang = await userManager.getUserLanguage(userId);
        await ctx.reply(getMessage('noFilesFound', userLang));
        return;
    }

    const userLang = await userManager.getUserLanguage(userId);
    const processingMsg = await ctx.reply(getMessage('processing', userLang));

    try {
        let outputPath;
        let result;

        if (userState === config.userStates.WAITING_JPG || userState === config.userStates.WAITING_PNG) {
            outputPath = `temp/converted_images_${Date.now()}.pdf`;
            result = await imagesToPdf(files, outputPath);

            await ctx.replyWithDocument({
                source: result,
                filename: `converted_images_${Date.now()}.pdf`
            });

            // PostConversion keyboard - til bo'yicha
            await ctx.reply('✅', getPostConversionInlineKeyboard(userLang));

        } else if (userState === config.userStates.WAITING_DOCX) {
            const results = await wordToPdf(files, `temp/converted_${Date.now()}.pdf`);

            if (Array.isArray(results)) {
                for (const result of results) {
                    await ctx.replyWithDocument({
                        source: result,
                        filename: path.basename(result)
                    });
                }
            } else {
                await ctx.replyWithDocument({
                    source: results,
                    filename: path.basename(results)
                });
            }

            // PostConversion keyboard - til bo'yicha
            await ctx.reply('✅', getPostConversionInlineKeyboard(userLang));

        } else if (userState === config.userStates.WAITING_PDF_TO_WORD) {
            const results = await pdfToText(files, `temp/converted_${Date.now()}.txt`);

            if (Array.isArray(results)) {
                for (const result of results) {
                    await ctx.replyWithDocument({
                        source: result,
                        filename: path.basename(result)
                    });
                }
            } else {
                await ctx.replyWithDocument({
                    source: results,
                    filename: path.basename(results)
                });
            }

            // PostConversion keyboard - til bo'yicha
            await ctx.reply('✅', getPostConversionInlineKeyboard(userLang));
        }

        // Cleanup
        cleanupFiles(files);
        if (result) cleanupFiles([result]);

    } catch (error) {
        console.error('Conversion error:', error);
        await ctx.reply(getMessage('error', userLang, error.message));
    } finally {
        await ctx.telegram.deleteMessage(ctx.chat.id, processingMsg.message_id).catch(() => { });
        userStates.delete(userId);
        userFiles.delete(userId);
    }
});

// PDF Birlashtirish - barcha tillar uchun
bot.hears(/^✅ (Birlashtirish|Объединить|Merge)/, async (ctx) => {
    const userId = ctx.from.id;
    const userLang = await userManager.getUserLanguage(userId);
    const files = userFiles.get(userId);

    if (!files || files.length < 2) {
        await ctx.reply(getMessage('minFilesRequired', userLang, 2));
        return;
    }

    const processingMsg = await ctx.reply(getMessage('processingMerge', userLang));

    try {
        const outputPath = `temp/merged_${Date.now()}.pdf`;
        const result = await mergePdfs(files, outputPath);

        await ctx.replyWithDocument({
            source: result,
            filename: `merged_pdfs_${Date.now()}.pdf`
        });

        // PostConversion keyboard - til bo'yicha
        await ctx.reply('✅', getPostConversionInlineKeyboard(userLang));

        // Cleanup
        cleanupFiles([...files, result]);

    } catch (error) {
        console.error('PDF merge error:', error);
        await ctx.reply(getMessage('error', userLang, error.message));
    } finally {
        await ctx.telegram.deleteMessage(ctx.chat.id, processingMsg.message_id).catch(() => { });
        userStates.delete(userId);
        userFiles.delete(userId);
    }
});

// Bekor qilish va bosh menyu - barcha tillar uchun
bot.hears(/❌ (Bekor qilish|Отменить|Cancel)|🔙 (Bosh menyu|Главное меню|Main menu)/, async (ctx) => {
    const userId = ctx.from.id;
    const files = userFiles.get(userId);

    if (files) {
        cleanupFiles(files);
    }

    userStates.delete(userId);
    userFiles.delete(userId);
    broadcastState.delete(userId); // Broadcast state ni ham tozalash

    await userManager.updateUserActivity(userId);
    const userLang = await userManager.getUserLanguage(userId);
    const keyboard = getMainKeyboard(isAdmin(userId), userLang);
    await ctx.reply(getMessage('cancelled', userLang), keyboard);
});

// Yana fayl qo'shish - barcha tillar uchun
bot.hears(/➕ (Yana fayl qo'shish|Добавить ещё файл|Add more files)/, async (ctx) => {
    const userId = ctx.from.id;
    const userLang = await userManager.getUserLanguage(userId);
    const files = userFiles.get(userId) || [];

    await ctx.reply(getMessage('addMoreFiles', userLang, files.length));
});

// Rasmlarni qabul qilish
bot.on(message('photo'), async (ctx) => {
    const userId = ctx.from.id;
    const userState = userStates.get(userId);
    const userLang = await userManager.getUserLanguage(userId);

    if (userState === config.userStates.WAITING_JPG || userState === config.userStates.WAITING_PNG) {
        try {
            const photo = ctx.message.photo[ctx.message.photo.length - 1];

            // JPG uchun JPG kengaytmasi, PNG uchun PNG kengaytmasi
            let fileName, fileExtension;
            if (userState === config.userStates.WAITING_JPG) {
                fileExtension = 'jpg';
                fileName = `image_${Date.now()}_${Math.random().toString(36).substr(2, 9)}.jpg`;
            } else if (userState === config.userStates.WAITING_PNG) {
                // PNG bo'limida photo yuborilsa, foydalanuvchiga document yuborishni taklif qilamiz
                await ctx.reply(getMessage('invalidFormat', userLang, 'PNG (document sifatida yuboring)'));
                return;
            }

            const filePath = await downloadFile(ctx, photo.file_id, fileName);

            const files = userFiles.get(userId) || [];
            files.push(filePath);
            userFiles.set(userId, files);

            await ctx.reply(getMessage('fileReceived', userLang, fileName, files.length), getConversionKeyboard(files.length, userLang));

        } catch (error) {
            console.error('Photo handler error:', error);
            await ctx.reply(getMessage('error', userLang, error.message));
        }
    }
});

// Hujjatlarni qabul qilish
bot.on(message('document'), async (ctx) => {
    const userId = ctx.from.id;
    const userState = userStates.get(userId);
    const document = ctx.message.document;

    if (!document) return;

    try {
        let isValidFile = false;
        let expectedFormat = '';

        if (userState === config.userStates.WAITING_JPG && validateImageFile(document.file_name, ['jpg', 'jpeg'])) {
            isValidFile = true;
            expectedFormat = 'JPG/JPEG';
        } else if (userState === config.userStates.WAITING_PNG && validateImageFile(document.file_name, ['png'])) {
            isValidFile = true;
            expectedFormat = 'PNG';
        } else if (userState === config.userStates.WAITING_DOCX && validateWordFile(document.file_name)) {
            isValidFile = true;
            expectedFormat = 'DOCX';
        } else if (userState === config.userStates.WAITING_PDF_TO_WORD && validatePdfFile(document.file_name)) {
            isValidFile = true;
            expectedFormat = 'PDF';
        } else if (userState === config.userStates.WAITING_PDFS_TO_MERGE && validatePdfFile(document.file_name)) {
            isValidFile = true;
            expectedFormat = 'PDF';
        }

        if (isValidFile) {
            const filePath = await downloadFile(ctx, document.file_id, document.file_name);

            const files = userFiles.get(userId) || [];
            files.push(filePath);
            userFiles.set(userId, files);

            const userLang = await userManager.getUserLanguage(userId);
            if (userState === config.userStates.WAITING_PDFS_TO_MERGE) {
                await ctx.reply(getMessage('fileReceived', userLang, document.file_name, files.length), getMergeKeyboard(userLang));
            } else {
                await ctx.reply(getMessage('fileReceived', userLang, document.file_name, files.length), getConversionKeyboard(files.length, userLang));
            }
        } else {
            const userLang = await userManager.getUserLanguage(userId);

            // Foydalanuvchi holatiga qarab to'g'ri format nomini ko'rsatish
            if (userState === config.userStates.WAITING_JPG) {
                expectedFormat = 'JPG/JPEG';
            } else if (userState === config.userStates.WAITING_PNG) {
                expectedFormat = 'PNG';
            } else if (userState === config.userStates.WAITING_DOCX) {
                expectedFormat = 'DOCX';
            } else if (userState === config.userStates.WAITING_PDF_TO_WORD || userState === config.userStates.WAITING_PDFS_TO_MERGE) {
                expectedFormat = 'PDF';
            }

            await ctx.reply(getMessage('invalidFormat', userLang, expectedFormat));
        }

    } catch (error) {
        console.error('Document handler error:', error);
        const userLang = await userManager.getUserLanguage(userId);
        await ctx.reply(getMessage('error', userLang, error.message));
    }
});

// Inline callback handlers
bot.action('new_conversion', async (ctx) => {
    await ctx.answerCbQuery();
    const userId = ctx.from.id;
    const userLang = await userManager.getUserLanguage(userId);

    const message = getMessage('newConversion', userLang);
    await ctx.reply(message, getMainKeyboard(isAdmin(userId), userLang));
});

bot.action('share_bot', async (ctx) => {
    await ctx.answerCbQuery();
    const userId = ctx.from.id;
    const userLang = await userManager.getUserLanguage(userId);
    const shareMsg = getMessage('shareBot', userLang);
    await ctx.replyWithMarkdown(shareMsg, getShareInlineKeyboard());
});

bot.action('rate_bot', async (ctx) => {
    await ctx.answerCbQuery();
    const userId = ctx.from.id;
    const userLang = await userManager.getUserLanguage(userId);

    const ratingMessages = {
        uz: '⭐ *Botni baholang!*\n\nBizning xizmatimiz sizga yoqdimi?\nQuyidagi yulduzchalardan birini tanlang:',
        ru: '⭐ *Оцените бота!*\n\nВам понравился наш сервис?\nВыберите одну из звездочек ниже:',
        en: '⭐ *Rate the bot!*\n\nDid you like our service?\nChoose one of the stars below:'
    };

    const ratingMsg = ratingMessages[userLang] || ratingMessages.uz;
    const keyboard = getRatingKeyboard();
    await ctx.replyWithMarkdown(ratingMsg, keyboard);
});

// Reyting callback handlerlari
bot.action(/^rate_(\d)$/, async (ctx) => {
    try {
        const rating = parseInt(ctx.match[1]);
        const userId = ctx.from.id;
        const userLang = await userManager.getUserLanguage(userId);

        // Reytingni saqlash
        await userManager.saveUserRating(userId, rating);

        const callbackMessages = {
            uz: `✅ ${rating} yulduz berildi!`,
            ru: `✅ ${rating} звезд поставлено!`,
            en: `✅ ${rating} stars given!`
        };

        const thanksMessages = {
            uz: `🙏 *Rahmat!*\n\n⭐ Siz ${rating} yulduz berdingiz!\nIzohlaringiz biz uchun juda muhim.`,
            ru: `🙏 *Спасибо!*\n\n⭐ Вы поставили ${rating} звезд!\nВаши отзывы очень важны для нас.`,
            en: `🙏 *Thank you!*\n\n⭐ You gave ${rating} stars!\nYour feedback is very important to us.`
        };

        const callbackMsg = callbackMessages[userLang] || callbackMessages.uz;
        const thanksMsg = thanksMessages[userLang] || thanksMessages.uz;

        await ctx.answerCbQuery(callbackMsg);

        await ctx.editMessageText(thanksMsg, {
            parse_mode: 'Markdown'
        });

    } catch (error) {
        console.error('Rating handler error:', error);
        const errorMessages = {
            uz: '❌ Xatolik yuz berdi!',
            ru: '❌ Произошла ошибка!',
            en: '❌ An error occurred!'
        };
        const userLang = await userManager.getUserLanguage(ctx.from.id);
        const errorMsg = errorMessages[userLang] || errorMessages.uz;
        await ctx.answerCbQuery(errorMsg);
    }
});

// Til tanlash callback handlerlari
bot.action(/^lang_(.+)$/, async (ctx) => {
    try {
        const language = ctx.match[1];
        const userId = ctx.from.id;

        // Tilni saqlash
        await userManager.setUserLanguage(userId, language);

        await ctx.answerCbQuery('✅ Til o\'zgartirildi!');

        const langMsg = getLanguageChangedMessage(language);
        await ctx.editMessageText(langMsg, {
            parse_mode: 'Markdown'
        });

        // Asosiy menyuni ko'rsatish
        setTimeout(async () => {
            const userLang = await userManager.getUserLanguage(userId);
            const welcomeMsg = getMessage('welcome', userLang, ctx.from.first_name);
            const keyboard = getMainKeyboard(isAdmin(userId), userLang);
            await ctx.replyWithMarkdown(welcomeMsg, keyboard);
        }, 1000);

    } catch (error) {
        console.error('Language handler error:', error);
        await ctx.answerCbQuery('❌ Xatolik yuz berdi!');
    }
});

// Kanal a'zoligini tekshirish callback
bot.action('check_membership', async (ctx) => {
    try {
        await ctx.answerCbQuery('🔄 Tekshirilmoqda...');

        const userId = ctx.from.id;

        // Telegram API orqali tekshirish
        try {
            const member = await ctx.telegram.getChatMember(config.requiredChannel.id, userId);
            const isMember = ['member', 'administrator', 'creator'].includes(member.status);

            if (isMember) {
                // Local bazada saqlash
                setChannelMembership(userId, true);

                const verifiedMsg = getMembershipVerifiedMessage();
                const keyboard = getMainKeyboard(isAdmin(userId));

                await ctx.editMessageText(verifiedMsg, {
                    parse_mode: 'Markdown'
                });

                // Yangi xabar bilan asosiy menyuni ko'rsatish
                setTimeout(async () => {
                    const welcomeMsg = getWelcomeMessage(ctx.from.first_name);
                    await ctx.replyWithMarkdown(welcomeMsg, keyboard);
                }, 1000);
            } else {
                await ctx.answerCbQuery('❌ Siz hali kanalga a\'zo bo\'lmagansiz!', { show_alert: true });
            }
        } catch (error) {
            console.error('Membership check error:', error);
            await ctx.answerCbQuery('❌ Tekshirishda xatolik yuz berdi!', { show_alert: true });
        }
    } catch (error) {
        console.error('Callback query error:', error);
        await ctx.answerCbQuery('❌ Xatolik yuz berdi!');
    }
});

// Broadcast xabarni yuborish - Admin funksiyalaridan oldin

// Bot ishga tushirish
// Bot ishga tushirish (retry logic bilan)
async function main() {
    await startup();
    const webhookUrl = process.env.WEBHOOK_URL;
    const port = process.env.PORT || 3000;

    if (webhookUrl) {
        bot.launch({
            webhook: {
                domain: webhookUrl,
                port: port,
            }
        });
        console.log(`🚀 Bot webhook orqali ishga tushdi: ${webhookUrl} (port: ${port})`);
    } else {
        bot.launch();
        console.log('🚀 Bot polling orqali ishga tushdi!');
    }
}

// ========================
// ADMIN PANEL HANDLERS
// ========================

// Broadcast xabarni yuborish - Admin funksiyalaridan oldin
bot.on(message('text'), async (ctx, next) => {
    const userId = ctx.from.id;
    const state = userStates.get(userId);

    // Faqat admin broadcast holatida ishlaydi
    if (state === 'waiting_broadcast_message' && isAdmin(userId)) {
        try {
            const messageText = ctx.message.text;
            const users = getAllUsers();
            const userIds = Object.keys(users);

            await ctx.reply('📤 Xabar yuborilmoqda...');

            let sentCount = 0;
            let failedCount = 0;

            for (const targetUserId of userIds) {
                try {
                    await ctx.telegram.sendMessage(targetUserId, messageText);
                    sentCount++;
                    // Rate limiting
                    await new Promise(resolve => setTimeout(resolve, 50));
                } catch (error) {
                    failedCount++;
                    console.log(`Foydalanuvchi ${targetUserId} ga xabar yuborib bo'lmadi:`, error.message);
                }
            }

            userStates.delete(userId);
            const successMsg = getBroadcastSuccessMessage(sentCount, failedCount);
            await ctx.replyWithMarkdown(successMsg, getAdminKeyboard());

        } catch (error) {
            console.error('Broadcast sending error:', error);
            await ctx.reply('❌ Umumiy xabar yuborishda xatolik.');
            userStates.delete(userId);
        }
        return; // Handler ni to'xtatish
    }

    // Boshqa handlerlarni davom ettirish
    return next();
});

// Admin Panel
bot.hears('🔧 Admin Panel', async (ctx) => {
    const userId = ctx.from.id;
    console.log(`🔍 Admin Panel so'rovi: User ID = ${userId}, Admin ID = ${config.adminId}`);
    console.log(`🔍 isAdmin check: ${isAdmin(userId)}`);

    if (!isAdmin(userId)) {
        console.log(`❌ Ruxsat rad etildi: ${userId} admin emas`);
        await ctx.reply('❌ Bu buyruq faqat admin uchun!');
        return;
    }

    try {
        // Oldingi holatlarni tozalash
        userStates.delete(userId);
        broadcastState.delete(userId);
        console.log(`🧹 User states tozalandi`);

        const adminMsg = getAdminPanelMessage();
        console.log(`✅ Admin panel ochilmoqda: ${userId}`);
        await ctx.replyWithMarkdown(adminMsg, getAdminKeyboard());
        console.log(`✅ Admin panel muvaffaqiyatli yuborildi`);
    } catch (error) {
        console.error('Admin panel error:', error);
        await ctx.reply('❌ Admin panelda xatolik yuz berdi.');
    }
});

// Foydalanuvchilar statistikasi
bot.hears('📊 Foydalanuvchilar statistikasi', async (ctx) => {
    const userId = ctx.from.id;
    console.log(`📊 Statistika so'rovi: User ID = ${userId}`);

    if (!isAdmin(userId)) {
        await ctx.reply('❌ Bu buyruq faqat admin uchun!');
        return;
    }

    try {
        console.log(`📊 Statistika hisoblanmoqda...`);
        const totalUsers = await userManager.getUsersCount();
        const onlineUsers = await userManager.getOnlineUsersCount();
        const ratingStats = await userManager.getRatingStats();
        console.log(`📊 Umumiy: ${totalUsers}, Online: ${onlineUsers}, Reyting: ${ratingStats.averageRating}`);

        const statsMsg = getUserStatsMessage(totalUsers, onlineUsers, ratingStats);
        console.log(`📊 Message yaratildi`);

        await ctx.replyWithMarkdown(statsMsg, getAdminKeyboard());
        console.log(`✅ Statistika yuborildi`);
    } catch (error) {
        console.error('Users stats error:', error);
        await ctx.reply('❌ Statistikani yuklashda xatolik.');
    }
});

// Umumiy xabar yuborish
bot.hears('📢 Umumiy xabar yuborish', async (ctx) => {
    const userId = ctx.from.id;
    console.log(`📢 Broadcast so'rovi: User ID = ${userId}`);

    if (!isAdmin(userId)) {
        await ctx.reply('❌ Bu buyruq faqat admin uchun!');
        return;
    }

    try {
        console.log(`📢 Broadcast rejimiga o'tish...`);
        userStates.set(userId, 'waiting_broadcast_message');
        const broadcastMsg = getBroadcastMessage();
        await ctx.replyWithMarkdown(broadcastMsg, getBroadcastKeyboard());
        console.log(`✅ Broadcast rejimiga o'tildi`);
    } catch (error) {
        console.error('Broadcast request error:', error);
        await ctx.reply('❌ Umumiy xabar rejimida xatolik.');
    }
});

// Admin Panel orqaga
bot.hears('🔙 Admin Panel', async (ctx) => {
    const userId = ctx.from.id;
    console.log(`🔙 Admin Panel orqaga: User ID = ${userId}`);

    if (!isAdmin(userId)) return;

    try {
        console.log(`🔙 State va broadcast tozalanmoqda...`);
        userStates.delete(userId);
        broadcastState.delete(userId);

        const adminMsg = getAdminPanelMessage();
        await ctx.replyWithMarkdown(adminMsg, getAdminKeyboard());
        console.log(`✅ Admin panelga qaytildi`);
    } catch (error) {
        console.error('Admin panel back error:', error);
        await ctx.reply('❌ Admin panelga qaytishda xatolik.');
    }
});

// Noma'lum xabarlar
bot.on(message(), async (ctx) => {
    const userId = ctx.from.id;
    const userState = userStates.get(userId);

    if (userState) {
        await ctx.reply('❌ Noto\'g\'ri fayl formati! Iltimos, to\'g\'ri formatdagi faylni yuboring.');
    } else {
        // Admin uchun alohida keyboard ko'rsatish
        if (isAdmin(userId)) {
            await ctx.reply('👋 Assalomu alaykum, Admin! Quyidagi tugmalardan birini tanlang:', getMainKeyboard(true));
        } else {
            await ctx.reply('👋 Assalomu alaykum, quyidagi tugmalardan birini tanlang:', getMainKeyboard());
        }
    }
});

// Error handling
bot.catch((err, ctx) => {
    console.error('Bot xatoligi:', err);
    ctx.reply('❌ Ichki xatolik yuz berdi. Iltimos, qayta urinib ko\'ring.');
});

// Graceful shutdown
process.once('SIGINT', () => {
    console.log('🛑 Bot to\'xtatilmoqda...');
    bot.stop('SIGINT');
});

process.once('SIGTERM', () => {
    console.log('🛑 Bot to\'xtatilmoqda...');
    bot.stop('SIGTERM');
});

main();
