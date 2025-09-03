#!/bin/bash

# AlwaysData serverida ishga tushirish uchun
echo "🚀 Bot ishga tushmoqda..."

# .env faylini tekshirish
if [ ! -f ".env" ]; then
    echo "❌ .env fayli topilmadi!"
    echo "📝 .env faylini yaratish..."
    
    cat > .env << 'EOF'
BOT_TOKEN=8352171313:AAHEzY9a4If2mT69T5ks2fIC1PgpNGg8yts
ADMIN_USERNAME=AbdujabborSharobiddinov
ADMIN_ID=7108854464
MAX_FILE_SIZE=104857600
TEMP_DIR=temp
DOWNLOADS_DIR=downloads
BOT_NAME=Professional File Conversion Bot
BOT_VERSION=1.0.0
PROCESSING_TIMEOUT=300000
MAX_FILES_PER_SESSION=1000
MIN_PDF_FILES=2
# Database Configuration
DATABASE_TYPE=postgresql
POSTGRES_URL=postgresql://server001_postgres:12345678@postgresql-server001.alwaysdata.net:5432/server001_telegram_bot_db

# Performance Settings
MAX_CONCURRENT_PROCESSING=3
USER_QUEUE_LIMIT=2
ENABLE_PERFORMANCE_MONITORING=true
EOF
    
    echo "✅ .env fayli yaratildi"
fi

# Temp papkalarni yaratish
mkdir -p temp downloads

# Botni ishga tushirish
echo "🤖 Bot ishga tushirilmoqda..."
node bot.js
