// Rate limiting middleware - CHEKSIZ QILINDI
const userRequestCounts = new Map();
const fileRequestCounts = new Map();

// CHEKSIZ - Rate limitni o'chirish
const GENERAL_RATE_LIMIT = 999999; // Cheksiz
const GENERAL_RATE_WINDOW = 60000; // 1 daqiqa

// CHEKSIZ - Fayl konversiya ham cheksiz
const FILE_RATE_LIMIT = 999999; // Cheksiz
const FILE_RATE_WINDOW = 60000; // 1 daqiqa

// Oddiy so'rovlar uchun rate limiting
function generalRateLimitMiddleware() {
    return (ctx, next) => {
        const userId = ctx.from.id;
        const now = Date.now();
        
        if (!userRequestCounts.has(userId)) {
            userRequestCounts.set(userId, { count: 1, resetTime: now + GENERAL_RATE_WINDOW });
            return next();
        }
        
        const userRecord = userRequestCounts.get(userId);
        
        if (now > userRecord.resetTime) {
            userRecord.count = 1;
            userRecord.resetTime = now + GENERAL_RATE_WINDOW;
            return next();
        }
        
        if (userRecord.count >= GENERAL_RATE_LIMIT) {
            return ctx.reply('⚠️ Juda ko\'p so\'rov! 1 daqiqa kuting.');
        }
        
        userRecord.count++;
        return next();
    };
}

// Fayl konversiya uchun rate limiting (qattiqroq)
function fileRateLimitMiddleware() {
    return (ctx, next) => {
        const userId = ctx.from.id;
        const now = Date.now();
        
        if (!fileRequestCounts.has(userId)) {
            fileRequestCounts.set(userId, { count: 1, resetTime: now + FILE_RATE_WINDOW });
            return next();
        }
        
        const fileRecord = fileRequestCounts.get(userId);
        
        if (now > fileRecord.resetTime) {
            fileRecord.count = 1;
            fileRecord.resetTime = now + FILE_RATE_WINDOW;
            return next();
        }
        
        if (fileRecord.count >= FILE_RATE_LIMIT) {
            const remainingTime = Math.ceil((fileRecord.resetTime - now) / 1000);
            return ctx.reply(`⚠️ Fayl konversiya limiti tugadi!\n\n📂 Siz 1 daqiqada ${FILE_RATE_LIMIT} ta fayldan ko'p ishlay olmaysiz.\n⏰ ${remainingTime} soniyadan so'ng qayta urinib ko'ring.`);
        }
        
        fileRecord.count++;
        return next();
    };
}
    };
}

// Bot.js da ishlatish
bot.use(rateLimitMiddleware());
