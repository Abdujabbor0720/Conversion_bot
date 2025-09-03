import config from '../config/config.js';

/**
 * Xush kelibsiz xabari
 */
export function getWelcomeMessage(firstName) {
    return `
🤖 *Assalomu alaykum, ${firstName}!*

📁 *Professional File Conversion Bot*ga xush kelibsiz!

Bu bot yordamida quyidagi operatsiyalarni amalga oshirishingiz mumkin:

📸 *JPG → PDF* ♻️
🖼 *PNG → PDF* ♻️  
📝 *Word → PDF* ♻️
📄 *PDF → Word* ♻️
🔗 *PDF fayllarni birlashtirish* ➕

⚡ *Ajoyib xususiyatlar:*
• Cheklovlar yo'q! Istalgancha fayl konvert qiling
• Bir vaqtda ko'p fayllar bilan ishlash
• Custom fayl nomlari
• Yuqori sifatli konversiya
• Tez va ishonchli xizmat

Quyidagi tugmalardan birini tanlang:
    `;
}

/**
 * Yordam xabari
 */
export function getHelpMessage() {
    return `
📖 *Yordam bo'limi*

🔄 *Foydalanish tartibi:*
1️⃣ Kerakli operatsiyani tanlang
2️⃣ Fayl(lar)ni yuboring
3️⃣ Fayl nomini kiriting (ixtiyoriy)
4️⃣ Konversiyani boshlang
5️⃣ Tayyor faylni yuklab oling

📊 *Qo'llab-quvvatlanadigan formatlar:*
• JPG, JPEG, PNG → PDF
• DOCX → PDF  
• PDF → TXT (text)
• Bir nechta PDF → Birlashtirilgan PDF

⚡ *Cheklovlar yo'q:*
• Maksimal fayl hajmi: ${(config.maxFileSize / 1024 / 1024).toFixed(1)}MB
• Istalgancha fayl birlashtiring
• Istalgancha rasm/hujjat konvert qiling
• Tez va sifatli natija

💡 *Maslahatlar:*
• Sifatli natija uchun yuqori sifatli fayllar yuboring
• Fayl nomlarida maxsus belgilar ishlatmang
• Internet aloqasi barqaror bo'lishi kerak

❓ Savollar uchun: [@${config.adminUsername}](https://t.me/${config.adminUsername})
    `;
}

/**
 * Telegram ID xabari
 */
export function getTelegramIdMessage(userId) {
    return `
🆔 *Sizning ma'lumotlaringiz:*

👤 *Telegram ID:* \`${userId}\`
📅 *So'rov vaqti:* ${new Date().toLocaleString('uz-UZ')}

📋 *Bu ID nimaga kerak?*
• Developer bilan aloqa
• Xatoliklarni xabar qilish
• Maxsus xususiyatlardan foydalanish

🔒 *Maxfiylik:* Bu ma'lumot xavfsiz va faqat texnik maqsadlarda ishlatiladi.
    `;
}

/**
 * Konversiya boshlanish xabarlari
 */
export const conversionMessages = {
    waitingJpg: '📸 JPG/JPEG rasmlarni yuboring. Tayyor bo\'lganda "✅ O\'tkazishni boshlash" tugmasini bosing.',
    waitingPng: '🖼 PNG rasmlarni yuboring. Tayyor bo\'lganda "✅ O\'tkazishni boshlash" tugmasini bosing.',
    waitingDocx: '📝 Word (.docx) fayllarini yuboring. Tayyor bo\'lganda "✅ O\'tkazishni boshlash" tugmasini bosing. (TEXT formatiga o\'tkaziladi)',
    waitingPdfToWord: '📄 PDF fayllarini yuboring. Tayyor bo\'lganda "✅ O\'tkazishni boshlash" tugmasini bosing.',
    waitingPdfsToMerge: '🔗 Birlashtirishni xohlagan PDF fayllaringizni ketma-ket yuboring.',

    enterFileName: 'Yangi fayl uchun nom kiriting (kengaytmasiz):\n\n💡 *Misol:* Mening_hujjatim\n📝 Agar nom bermasangiz, avtomatik nom qo\'yiladi.',

    processing: '⏳ Fayllar qayta ishlanmoqda...',
    processingMerge: '⏳ PDF fayllar birlashtirilmoqda...',

    successImage: '✅ Rasmlar muvaffaqiyatli PDF ga aylantirildi!',
    successWord: '✅ Word fayllar muvaffaqiyatli TEXT formatiga aylantirildi!',
    successPdfToWord: '✅ PDF fayllar muvaffaqiyatli text formatiga aylantirildi!',
    successMerge: '✅ PDF fayllar muvaffaqiyatli birlashtirildi!',

    cancelled: '❌ Operatsiya bekor qilindi.',

    fileReceived: (fileName, count) => `📄 Fayl qabul qilindi: *${fileName}*\n📊 Jami fayllar: ${count} ta`,

    minFilesRequired: (min) => `❌ Kamida ${min} ta fayl yuboring!`,

    invalidFormat: (expected) => `❌ Noto'g'ri fayl formati! Faqat ${expected} formatdagi fayllar qabul qilinadi.`,

    error: (message) => `❌ Xatolik yuz berdi: ${message}\n\n🔄 Iltimos, qayta urinib ko'ring yoki ${config.adminUsername} ga murojaat qiling.`
};

/**
 * Share bot xabari
 */
export function getShareBotMessage() {
    return `
🤝 *Do'stlarga ulashing!*

📁 Fayl konverter boti:
• Tez konversiya
• Ko'p formatlar
• Bepul foydalanish

👇 Tugmalardan birini tanlang:
    `;
}

/**
 * Rating xabari
 */
export function getRatingMessage() {
    return `
⭐ *Botni baholang!*

Bizning xizmatimiz sizga yoqdimi?
Quyidagi yulduzchalardan birini tanlang:

📝 Taklif va shikoyatlar: [@${config.adminUsername}](https://t.me/${config.adminUsername})
    `;
}

/**
 * Reyting qabul qilindi xabari
 */
export function getRatingThanksMessage(rating) {
    return `
✅ *Reyting qabul qilindi!*

Siz ${rating} yulduz berdingiz! ⭐

💝 Fikringiz uchun rahmat!
    `;
}

/**
 * Admin panel xabari
 */
export function getAdminPanelMessage() {
    return `
🔧 *Admin Panel*

📊 Tizim statistikasi va boshqaruv:
    `;
}

/**
 * Foydalanuvchilar statistikasi
 */
export function getUserStatsMessage(totalUsers, onlineUsers, ratingStats) {
    const currentTime = new Date().toLocaleString('uz-UZ');

    let ratingText = '';
    if (ratingStats.totalRatings > 0) {
        ratingText = `
⭐ *Bot reytingi:*
📊 O'rtacha reyting: *${ratingStats.averageRating}/5.00*
📈 Jami baholanganlar: *${ratingStats.totalRatings}*

Reyting taqsimoti:
⭐ 1 yulduz: ${ratingStats.ratingCounts[1]}
⭐⭐ 2 yulduz: ${ratingStats.ratingCounts[2]}
⭐⭐⭐ 3 yulduz: ${ratingStats.ratingCounts[3]}
⭐⭐⭐⭐ 4 yulduz: ${ratingStats.ratingCounts[4]}
⭐⭐⭐⭐⭐ 5 yulduz: ${ratingStats.ratingCounts[5]}
`;
    } else {
        ratingText = `
⭐ *Bot reytingi:*
📊 Hali reyting berilmagan
`;
    }

    return `
📊 *Foydalanuvchilar statistikasi:*

👥 Umumiy foydalanuvchilar: *${totalUsers}*
🟢 Hozir online: *${onlineUsers}*
${ratingText}
📅 Ma'lumot olish vaqti: ${currentTime}
    `;
}

/**
 * Broadcast xabari
 */
export function getBroadcastMessage() {
    return `
📢 *Umumiy xabar yuborish*

Barcha foydalanuvchilarga yubormoqchi bo'lgan xabaringizni yozing:
    `;
}

/**
 * Broadcast muvaffaqiyat xabari
 */
export function getBroadcastSuccessMessage(sentCount, failedCount) {
    return `
✅ *Umumiy xabar yuborildi!*

📤 Muvaffaqiyatli yuborildi: *${sentCount}*
❌ Yuborilmadi: *${failedCount}*
📊 Umumiy: *${sentCount + failedCount}*
    `;
}

/**
 * Majburiy kanal a'zoligi xabari
 */
export function getChannelMembershipMessage() {
    return `
🔒 *Kanalga a'zo bo'ling*

📢 ${config.requiredChannel.name}

✅ A'zo bo'lgandan keyin "Tekshirish" tugmasini bosing
    `;
}

/**
 * A'zolik muvaffaqiyatli tekshirildi xabari
 */
export function getMembershipVerifiedMessage() {
    return `
✅ *A'zolik tasdiqlandi!*

🎉 Botdan foydalanishingiz mumkin
    `;
}

/**
 * Til tanlash xabari
 */
export function getLanguageSelectionMessage() {
    return `
🌐 *Tilni tanlang / Choose language / Выберите язык*

Quyidagi tillardan birini tanlang:
Choose one of the following languages:
Выберите один из следующих языков:
    `;
}

/**
 * Til o'zgartirildi xabari
 */
export function getLanguageChangedMessage(language) {
    const messages = {
        uz: '✅ Til o\'zbekcha o\'zgartirildi!',
        ru: '✅ Язык изменен на русский!',
        en: '✅ Language changed to English!'
    };
    return messages[language] || messages.uz;
}

/**
 * 3 tilda xabarlar
 */
export const messages = {
    uz: {
        welcome: (firstName) => `
🤖 *Assalomu alaykum, ${firstName}!*

📁 *Professional File Conversion Bot*ga xush kelibsiz!

Bu bot yordamida quyidagi operatsiyalarni amalga oshirishingiz mumkin:

📸 *JPG → PDF* ♻️
🖼 *PNG → PDF* ♻️  
📝 *Word → TEXT* ♻️
📄 *PDF → Word* ♻️
🔗 *PDF fayllarni birlashtirish* ➕

⚡ *Ajoyib xususiyatlar:*
• Cheklovlar yo'q! Istalgancha fayl konvert qiling
• Bir vaqtda ko'p fayllar bilan ishlash
• Tez va ishonchli xizmat

Quyidagi tugmalardan birini tanlang:
        `,
        help: `
📖 *Yordam bo'limi*

🔄 *Foydalanish tartibi:*
1️⃣ Kerakli operatsiyani tanlang
2️⃣ Fayl(lar)ni yuboring
3️⃣ Konversiyani boshlang
4️⃣ Tayyor faylni yuklab oling

📊 *Qo'llab-quvvatlanadigan formatlar:*
• JPG, JPEG, PNG → PDF
• DOCX → TEXT  
• PDF → TXT
• Bir nechta PDF → Birlashtirilgan PDF

❓ Yordam: [@${config.adminUsername}](https://t.me/${config.adminUsername})
        `,
        selectLang: '🌐 Tilni tanlang:',
        langChanged: '✅ Til o\'zbekchaga o\'zgartirildi!',
        telegramId: (userId) => `
🆔 *Sizning ma'lumotlaringiz:*

👤 *Telegram ID:* \`${userId}\`
📅 *So'rov vaqti:* ${new Date().toLocaleString('uz-UZ')}

📋 *Bu ID nimaga kerak?*
• Developer bilan aloqa
• Xatoliklarni xabar qilish
• Maxsus xususiyatlardan foydalanish

🔒 *Maxfiylik:* Bu ma'lumot xavfsiz va faqat texnik maqsadlarda ishlatiladi.
        `,
        shareBot: `
🤝 *Botni do'stlaringizga ulashing!*

Bu bot yordamida:
• JPG/PNG → PDF konversiya
• Word → PDF o'tkazish
• PDF fayllarni birlashtirish
• Va boshqa ko'plab imkoniyatlar!

📲 *Pastdagi tugma orqali ulashing:*
        `,
        // Conversion messages
        waitingJpg: '📸 JPG/JPEG rasmlarni yuboring. Tayyor bo\'lganda "✅ O\'tkazishni boshlash" tugmasini bosing.',
        waitingPng: '🖼 PNG rasmlarni DOCUMENT sifatida yuboring (📎 tugma orqali). Tayyor bo\'lganda "✅ O\'tkazishni boshlash" tugmasini bosing.',
        waitingDocx: '📝 Word (.docx) fayllarini yuboring. Tayyor bo\'lganda "✅ O\'tkazishni boshlash" tugmasini bosing. (TEXT formatiga o\'tkaziladi)',
        waitingPdfToWord: '📄 PDF fayllarini yuboring. Tayyor bo\'lganda "✅ O\'tkazishni boshlash" tugmasini bosing.',
        waitingPdfsToMerge: '🔗 Birlashtirishni xohlagan PDF fayllaringizni ketma-ket yuboring.',
        processing: '⏳ Fayllar qayta ishlanmoqda...',
        processingMerge: '⏳ PDF fayllar birlashtirilmoqda...',
        cancelled: '❌ Operatsiya bekor qilindi.',
        cancelled: '❌ Operatsiya bekor qilindi.',
        fileReceived: (fileName, count) => `📄 Fayl qabul qilindi: *${fileName}*\n📊 Jami fayllar: ${count} ta`,
        minFilesRequired: (min) => `❌ Kamida ${min} ta fayl yuboring!`,
        invalidFormat: (expected) => `❌ Noto'g'ri fayl formati! Faqat ${expected} formatdagi fayllar qabul qilinadi.`,
        error: (message) => `❌ Xatolik yuz berdi: ${message}\n\n🔄 Iltimos, qayta urinib ko'ring yoki ${config.adminUsername} ga murojaat qiling.`,
        noFilesFound: '❌ Hech qanday fayl topilmadi. Iltimos avval fayllarni yuboring.',
        addMoreFiles: (count) => `📁 ${count} ta fayl mavjud. Yana fayl yuboring:`,
        // Converter buttons
        startConversion: '✅ O\'tkazishni boshlash',
        cancel: '❌ Bekor qilish',
        mainMenu: '🔙 Bosh menyu',
        merge: '✅ Birlashtirish',
        newConversion: '🔄 Yangi konversiya uchun quyidagi tugmalardan birini tanlang:'
    },
    ru: {
        welcome: (firstName) => `
🤖 *Привет, ${firstName}!*

📁 Добро пожаловать в *Professional File Conversion Bot*!

С помощью этого бота вы можете выполнять следующие операции:

📸 *JPG → PDF* ♻️
🖼 *PNG → PDF* ♻️  
📝 *Word → TEXT* ♻️
📄 *PDF → Word* ♻️
🔗 *Объединение PDF файлов* ➕

⚡ *Отличные возможности:*
• Без ограничений! Конвертируйте сколько угодно файлов
• Работа с множественными файлами
• Быстрый и надежный сервис

Выберите одну из кнопок ниже:
        `,
        help: `
📖 *Раздел помощи*

🔄 *Порядок использования:*
1️⃣ Выберите нужную операцию
2️⃣ Отправьте файл(ы)
3️⃣ Начните конвертацию
4️⃣ Скачайте готовый файл

📊 *Поддерживаемые форматы:*
• JPG, JPEG, PNG → PDF
• DOCX → TEXT  
• PDF → TXT
• Несколько PDF → Объединенный PDF

❓ Помощь: [@${config.adminUsername}](https://t.me/${config.adminUsername})
        `,
        selectLang: '🌐 Выберите язык:',
        langChanged: '✅ Язык изменен на русский!',
        telegramId: (userId) => `
🆔 *Ваша информация:*

👤 *Telegram ID:* \`${userId}\`
📅 *Время запроса:* ${new Date().toLocaleString('ru-RU')}

📋 *Зачем нужен этот ID?*
• Связь с разработчиком
• Сообщения об ошибках
• Использование специальных функций

🔒 *Конфиденциальность:* Эта информация безопасна и используется только в технических целях.
        `,
        shareBot: `
🤝 *Поделитесь ботом с друзьями!*

С помощью этого бота:
• Конвертация JPG/PNG → PDF
• Преобразование Word → PDF
• Объединение PDF файлов
• И множество других возможностей!

📲 *Поделитесь через кнопку ниже:*
        `,
        // Conversion messages
        waitingJpg: '📸 Отправьте JPG/JPEG изображения. Когда будете готовы, нажмите "✅ Начать конвертацию".',
        waitingPng: '🖼 Отправьте PNG изображения как ДОКУМЕНТ (через 📎 кнопку). Когда будете готовы, нажмите "✅ Начать конвертацию".',
        waitingDocx: '📝 Отправьте Word (.docx) файлы. Когда будете готовы, нажмите "✅ Начать конвертацию". (Будет конвертировано в TEXT)',
        waitingPdfToWord: '📄 Отправьте PDF файлы. Когда будете готовы, нажмите "✅ Начать конвертацию".',
        waitingPdfsToMerge: '🔗 Отправьте PDF файлы для объединения по очереди.',
        processing: '⏳ Обработка файлов...',
        processingMerge: '⏳ Объединение PDF файлов...',
        cancelled: '❌ Операция отменена.',
        fileReceived: (fileName, count) => `📄 Файл получен: *${fileName}*\n📊 Всего файлов: ${count}`,
        minFilesRequired: (min) => `❌ Отправьте минимум ${min} файла!`,
        invalidFormat: (expected) => `❌ Неверный формат файла! Принимаются только файлы формата ${expected}.`,
        error: (message) => `❌ Произошла ошибка: ${message}\n\n🔄 Попробуйте еще раз или обратитесь к ${config.adminUsername}.`,
        noFilesFound: '❌ Файлы не найдены. Пожалуйста, сначала отправьте файлы.',
        addMoreFiles: (count) => `📁 ${count} файлов доступно. Отправьте еще файлы:`,
        // Converter buttons
        startConversion: '✅ Начать конвертацию',
        cancel: '❌ Отменить',
        mainMenu: '🔙 Главное меню',
        merge: '✅ Объединить',
        newConversion: '🔄 Для новой конвертации выберите одну из кнопок ниже:'
    },
    en: {
        welcome: (firstName) => `
🤖 *Hello, ${firstName}!*

📁 Welcome to *Professional File Conversion Bot*!

With this bot you can perform the following operations:

📸 *JPG → PDF* ♻️
🖼 *PNG → PDF* ♻️  
📝 *Word → TEXT* ♻️
📄 *PDF → Word* ♻️
🔗 *Merge PDF files* ➕

⚡ *Great features:*
• No limits! Convert as many files as you want
• Multiple file processing
• Fast and reliable service

Choose one of the buttons below:
        `,
        help: `
📖 *Help Section*

🔄 *How to use:*
1️⃣ Select the required operation
2️⃣ Send file(s)
3️⃣ Start conversion
4️⃣ Download ready file

📊 *Supported formats:*
• JPG, JPEG, PNG → PDF
• DOCX → TEXT  
• PDF → TXT
• Multiple PDF → Merged PDF

❓ Support: [@${config.adminUsername}](https://t.me/${config.adminUsername})
        `,
        selectLang: '🌐 Choose language:',
        langChanged: '✅ Language changed to English!',
        telegramId: (userId) => `
🆔 *Your Information:*

👤 *Telegram ID:* \`${userId}\`
📅 *Request time:* ${new Date().toLocaleString('en-US')}

📋 *Why do you need this ID?*
• Contact with developer
• Report errors
• Use special features

🔒 *Privacy:* This information is secure and used only for technical purposes.
        `,
        shareBot: `
🤝 *Share the bot with your friends!*

With this bot:
• Convert JPG/PNG → PDF
• Convert Word → PDF
• Merge PDF files
• And many other features!

📲 *Share using the button below:*
        `,
        // Conversion messages
        waitingJpg: '📸 Send JPG/JPEG images. When ready, press "✅ Start conversion".',
        waitingPng: '🖼 Send PNG images as DOCUMENT (via 📎 button). When ready, press "✅ Start conversion".',
        waitingDocx: '📝 Send Word (.docx) files. When ready, press "✅ Start conversion". (Will be converted to TEXT)',
        waitingPdfToWord: '📄 Send PDF files. When ready, press "✅ Start conversion".',
        waitingPdfsToMerge: '🔗 Send PDF files for merging one by one.',
        processing: '⏳ Processing files...',
        processingMerge: '⏳ Merging PDF files...',
        cancelled: '❌ Operation cancelled.',
        fileReceived: (fileName, count) => `📄 File received: *${fileName}*\n📊 Total files: ${count}`,
        minFilesRequired: (min) => `❌ Send at least ${min} files!`,
        invalidFormat: (expected) => `❌ Invalid file format! Only ${expected} format files are accepted.`,
        error: (message) => `❌ Error occurred: ${message}\n\n🔄 Please try again or contact ${config.adminUsername}.`,
        noFilesFound: '❌ No files found. Please send files first.',
        addMoreFiles: (count) => `📁 ${count} files available. Send more files:`,
        // Converter buttons
        startConversion: '✅ Start conversion',
        cancel: '❌ Cancel',
        mainMenu: '🔙 Main menu',
        merge: '✅ Merge',
        newConversion: '🔄 For new conversion select one of the buttons below:'
    }
};

/**
 * Tilga qarab xabar olish
 */
export function getMessage(key, lang = 'uz', ...args) {
    const langMessages = messages[lang] || messages.uz;
    const message = langMessages[key];

    if (typeof message === 'function') {
        return message(...args);
    }
    return message || messages.uz[key] || '';
}

export default {
    getWelcomeMessage,
    getHelpMessage,
    getTelegramIdMessage,
    conversionMessages,
    getShareBotMessage,
    getRatingMessage,
    getRatingThanksMessage,
    getAdminPanelMessage,
    getUserStatsMessage,
    getBroadcastMessage,
    getBroadcastSuccessMessage,
    getChannelMembershipMessage,
    getMembershipVerifiedMessage,
    getLanguageSelectionMessage,
    getLanguageChangedMessage,
    messages,
    getMessage
};
