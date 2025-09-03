# 🚀 AlwaysData Deployment Guide

## Tayyorlik

✅ **Loyiha tayyor**: `TGbot-alwaysdata.zip`  
✅ **PostgreSQL ulangan**: Local test muvaffaqiyatli  
✅ **Dependencies**: Barcha kerakli paketlar mavjud  

## 📋 Deployment Bosqichlari:

### 1️⃣ AlwaysData Account
- [alwaysdata.com](https://alwaysdata.com) da account yarating
- SSH access va PostgreSQL xizmatini yoqing

### 2️⃣ PostgreSQL Database
```sql
-- AlwaysData da database yaratish
CREATE DATABASE telegram_bot;
CREATE USER bot_user WITH PASSWORD 'strong_password';
GRANT ALL PRIVILEGES ON DATABASE telegram_bot TO bot_user;
```

### 3️⃣ File Upload
- `TGbot-alwaysdata.zip` ni AlwaysData serverga upload qiling
- Extract qiling: `unzip TGbot-alwaysdata.zip`

### 4️⃣ Environment Setup
`.env.production` faylini tahrirlang:
```env
BOT_TOKEN=your_real_bot_token
ADMIN_ID=your_telegram_id  
POSTGRES_URL=postgresql://bot_user:strong_password@postgresql-server.alwaysdata.net:5432/telegram_bot
CHANNEL_ID=@your_channel
```

### 5️⃣ Deployment
```bash
cd TGbot-main
chmod +x deploy.sh
./deploy.sh
```

### 6️⃣ Start Bot
```bash
npm start
```

## 🔧 AlwaysData Specific

### Process Management
AlwaysData da daemon process yaratish:
1. **Processes** → **New Process**
2. **Command**: `node bot.js`
3. **Working Directory**: `/home/username/TGbot-main`
4. **Environment**: Production

### Database Connection
```javascript
// AlwaysData PostgreSQL connection string format:
postgresql://username:password@postgresql-[server].alwaysdata.net:5432/database_name
```

### File Permissions
```bash
chmod +x bot.js deploy.sh
chmod -R 755 temp/ downloads/
```

## 📊 Monitoring

Bot ishlayotganini tekshirish:
```bash
# Process status
ps aux | grep node

# Logs ko'rish  
tail -f /home/username/logs/bot.log

# PostgreSQL connection
psql -h postgresql-server.alwaysdata.net -U bot_user -d telegram_bot
```

## 🔗 Test

Bot ishga tushganidan keyin:
1. Telegram da botingizga `/start` yuboring
2. File conversion test qiling
3. Database da user ma'lumotlari paydo bo'lishini tekshiring

## 📞 Support

Muammolar bo'lsa:
- AlwaysData documentation ko'ring
- Bot logs ni tekshiring 
- PostgreSQL connection string ni tasdiqlang
