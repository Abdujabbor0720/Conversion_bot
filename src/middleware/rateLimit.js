// Rate limiting middleware
const userRequestCounts = new Map();
const RATE_LIMIT = 5; // 5 ta request per minute
const RATE_WINDOW = 60000; // 1 minut

function rateLimitMiddleware() {
    return (ctx, next) => {
        const userId = ctx.from.id;
        const now = Date.now();
        
        if (!userRequestCounts.has(userId)) {
            userRequestCounts.set(userId, { count: 1, resetTime: now + RATE_WINDOW });
            return next();
        }
        
        const userRecord = userRequestCounts.get(userId);
        
        if (now > userRecord.resetTime) {
            // Reset counter
            userRecord.count = 1;
            userRecord.resetTime = now + RATE_WINDOW;
            return next();
        }
        
        if (userRecord.count >= RATE_LIMIT) {
            return ctx.reply('⚠️ Juda ko\'p so\'rov! 1 daqiqa kuting.');
        }
        
        userRecord.count++;
        return next();
    };
}

// Bot.js da ishlatish
bot.use(rateLimitMiddleware());
