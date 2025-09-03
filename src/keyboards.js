import { Markup } from 'telegraf';

/**
 * Asosiy menyuni yaratish (admin uchun qo'shimcha tugma)
 */
export function getMainKeyboard(isAdmin = false, userLang = 'uz') {
    const buttonTexts = {
        uz: {
            jpgToPdf: '📸 JPG → PDF',
            pngToPdf: '🖼 PNG → PDF',
            wordToText: '📝 Word → TEXT',
            pdfToWord: '📄 PDF → Word',
            mergePdf: '🔗 PDF Birlashtirish',
            help: 'ℹ️ Yordam',
            telegramId: '🆔 Telegram ID',
            shareBot: '🤝 Botni do\'stlarga ulashish',
            language: '🌐 Til / Language',
            adminPanel: '🔧 Admin Panel'
        },
        ru: {
            jpgToPdf: '📸 JPG → PDF',
            pngToPdf: '🖼 PNG → PDF',
            wordToText: '📝 Word → TEXT',
            pdfToWord: '📄 PDF → Word',
            mergePdf: '🔗 Объединить PDF',
            help: 'ℹ️ Помощь',
            telegramId: '🆔 Telegram ID',
            shareBot: '🤝 Поделиться ботом',
            language: '🌐 Язык / Language',
            adminPanel: '🔧 Админ панель'
        },
        en: {
            jpgToPdf: '📸 JPG → PDF',
            pngToPdf: '🖼 PNG → PDF',
            wordToText: '📝 Word → TEXT',
            pdfToWord: '📄 PDF → Word',
            mergePdf: '🔗 Merge PDF',
            help: 'ℹ️ Help',
            telegramId: '🆔 Telegram ID',
            shareBot: '🤝 Share Bot',
            language: '🌐 Language',
            adminPanel: '🔧 Admin Panel'
        }
    };

    const texts = buttonTexts[userLang] || buttonTexts.uz;

    const buttons = [
        [texts.jpgToPdf, texts.pngToPdf],
        [texts.wordToText, texts.pdfToWord],
        [texts.mergePdf],
        [texts.help, texts.telegramId],
        [texts.shareBot, texts.language]
    ];

    if (isAdmin) {
        buttons.push([texts.adminPanel]);
    }

    return Markup.keyboard(buttons).resize();
}

/**
 * Bekor qilish keyboardi - 3 tilda
 */
export function getCancelKeyboard(userLang = 'uz') {
    const buttonTexts = {
        uz: {
            cancel: '❌ Bekor qilish',
            mainMenu: '🔙 Bosh menyu'
        },
        ru: {
            cancel: '❌ Отменить',
            mainMenu: '🔙 Главное меню'
        },
        en: {
            cancel: '❌ Cancel',
            mainMenu: '🔙 Main menu'
        }
    };

    const texts = buttonTexts[userLang] || buttonTexts.uz;

    return Markup.keyboard([
        [texts.cancel],
        [texts.mainMenu]
    ]).resize();
}

/**
 * PDF birlashtirish keyboardi - 3 tilda
 */
export function getMergeKeyboard(userLang = 'uz') {
    const buttonTexts = {
        uz: {
            merge: '✅ Birlashtirish',
            cancel: '❌ Bekor qilish',
            mainMenu: '🔙 Bosh menyu'
        },
        ru: {
            merge: '✅ Объединить',
            cancel: '❌ Отменить',
            mainMenu: '🔙 Главное меню'
        },
        en: {
            merge: '✅ Merge',
            cancel: '❌ Cancel',
            mainMenu: '🔙 Main menu'
        }
    };

    const texts = buttonTexts[userLang] || buttonTexts.uz;

    return Markup.keyboard([
        [texts.merge],
        [texts.cancel, texts.mainMenu]
    ]).resize();
}

/**
 * Conversion tugmalarini yaratish - 3 tilda
 */
export function getConversionKeyboard(fileCount, userLang = 'uz') {
    const buttonTexts = {
        uz: {
            start: `✅ O'tkazishni boshlash (${fileCount} ta fayl)`,
            addMore: '➕ Yana fayl qo\'shish',
            cancel: '❌ Bekor qilish',
            mainMenu: '🔙 Bosh menyu'
        },
        ru: {
            start: `✅ Начать конвертацию (${fileCount} файлов)`,
            addMore: '➕ Добавить ещё файл',
            cancel: '❌ Отменить',
            mainMenu: '🔙 Главное меню'
        },
        en: {
            start: `✅ Start conversion (${fileCount} files)`,
            addMore: '➕ Add more files',
            cancel: '❌ Cancel',
            mainMenu: '🔙 Main menu'
        }
    };

    const texts = buttonTexts[userLang] || buttonTexts.uz;

    return Markup.keyboard([
        [texts.start],
        [texts.addMore],
        [texts.cancel, texts.mainMenu]
    ]).resize();
}

/**
 * Inline keyboard - Bot ulashish
 */
export function getShareInlineKeyboard() {
    return Markup.inlineKeyboard([
        [Markup.button.switchToChat('👥 Guruhga ulashish', '@BestConversionbot 📁 Har qanday faylni kerakli formatga o\'tkazing!\n\n• PDF, Word, JPG, PNG formatlariga o\'tkazish\n• Cheksiz rasmlarni PDF ga birlashtirish\n⚡️ Tezkor, oson va bepul!')],
        [Markup.button.switchToChat('👤 Do\'stga yuborish', '@BestConversionbot 📁 Har qanday faylni kerakli formatga o\'tkazing!\n\n• PDF, Word, JPG, PNG formatlariga o\'tkazish\n• Cheksiz rasmlarni PDF ga birlashtirish\n⚡️ Tezkor, oson va bepul!')],
        [Markup.button.url('📢 Kanalga qo\'shish', 'https://t.me/share/url?url=https://t.me/BestConversionbot')]
    ]);
}

/**
 * Inline keyboard - Conversion yakunlangandan keyin
 */
/**
 * Post conversion inline keyboard - 3 tilda
 */
export function getPostConversionInlineKeyboard(userLang = 'uz') {
    const buttonTexts = {
        uz: {
            newConversion: '🔄 Yana konversiya',
            shareBot: '👥 Botni do\'stlarga ulashish',
            rateBot: '⭐ Botni baholash'
        },
        ru: {
            newConversion: '🔄 Новая конвертация',
            shareBot: '👥 Поделиться ботом',
            rateBot: '⭐ Оценить бота'
        },
        en: {
            newConversion: '🔄 New conversion',
            shareBot: '👥 Share bot',
            rateBot: '⭐ Rate bot'
        }
    };

    const texts = buttonTexts[userLang] || buttonTexts.uz;

    return Markup.inlineKeyboard([
        [Markup.button.callback(texts.newConversion, 'new_conversion')],
        [Markup.button.callback(texts.shareBot, 'share_bot')],
        [Markup.button.callback(texts.rateBot, 'rate_bot')]
    ]);
}

/**
 * Inline keyboard - Yordam
 */
export function getHelpInlineKeyboard() {
    return Markup.inlineKeyboard([
        [Markup.button.callback('📸 Rasm → PDF', 'help_image')],
        [Markup.button.callback('📝 Word → PDF', 'help_word')],
        [Markup.button.callback('📄 PDF → Word', 'help_pdf')],
        [Markup.button.callback('🔗 PDF Birlashtirish', 'help_merge')],
        [Markup.button.callback('🔙 Orqaga', 'help_back')]
    ]);
}

/**
 * Admin panel keyboardi
 */
export function getAdminKeyboard() {
    return Markup.keyboard([
        ['📊 Foydalanuvchilar statistikasi'],
        ['📢 Umumiy xabar yuborish'],
        ['🔙 Bosh menyu']
    ]).resize();
}

/**
 * Broadcast keyboardi
 */
export function getBroadcastKeyboard() {
    return Markup.keyboard([
        ['❌ Bekor qilish'],
        ['🔙 Admin Panel']
    ]).resize();
}

/**
 * Kanal a'zoligi keyboardi
 */
export function getChannelMembershipKeyboard() {
    return Markup.inlineKeyboard([
        [Markup.button.url('📢 Kanalga kirish', 'https://t.me/development39')],
        [Markup.button.callback('✅ Tekshirish', 'check_membership')]
    ]);
}

/**
 * Til tanlash keyboardi
 */
export function getLanguageKeyboard() {
    return Markup.inlineKeyboard([
        [Markup.button.callback('🇺🇿 O\'zbek', 'lang_uz')],
        [Markup.button.callback('🇷🇺 Русский', 'lang_ru')],
        [Markup.button.callback('🇺🇸 English', 'lang_en')]
    ]);
}

/**
 * Reyting keyboardi - har bir tugma alohida qatorda
 */
export function getRatingKeyboard() {
    return Markup.inlineKeyboard([
        [Markup.button.callback('⭐⭐⭐⭐⭐ (5)', 'rate_5')],
        [Markup.button.callback('⭐⭐⭐⭐ (4)', 'rate_4')],
        [Markup.button.callback('⭐⭐⭐ (3)', 'rate_3')],
        [Markup.button.callback('⭐⭐ (2)', 'rate_2')],
        [Markup.button.callback('⭐ (1)', 'rate_1')]
    ]);
}

export default {
    getMainKeyboard,
    getCancelKeyboard,
    getMergeKeyboard,
    getConversionKeyboard,
    getShareInlineKeyboard,
    getPostConversionInlineKeyboard,
    getHelpInlineKeyboard,
    getAdminKeyboard,
    getBroadcastKeyboard,
    getChannelMembershipKeyboard,
    getRatingKeyboard,
    getLanguageKeyboard
};
