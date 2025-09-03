#!/bin/bash

echo "🚀 AlwaysData serveriga deploy qilish..."

# 1. .env faylini yaratish
echo "📝 .env faylini yaratish..."
cat > .env << 'EOF'
# Telegram Bot Configuration
BOT_TOKEN=8352171313:AAHEzY9a4If2mT69T5ks2fIC1PgpNGg8yts

# Admin Configuration
ADMIN_USERNAME=AbdujabborSharobiddinov
ADMIN_ID=7108854464

# File Settings
MAX_FILE_SIZE=104857600
TEMP_DIR=temp
DOWNLOADS_DIR=downloads

# Bot Settings
BOT_NAME=Professional File Conversion Bot
BOT_VERSION=1.0.0

# Processing Settings
PROCESSING_TIMEOUT=300000
MAX_FILES_PER_SESSION=1000
MIN_PDF_FILES=2

# Database Configuration
DATABASE_TYPE=postgresql
POSTGRES_URL=postgresql://postgres:12345678@postgresql-server.alwaysdata.net:5432/dbname
EOF

echo "✅ .env fayli yaratildi"

# 2. Temp papkalarni yaratish
echo "📁 Temp papkalarni yaratish..."
mkdir -p temp
mkdir -p downloads
echo "✅ Papkalar yaratildi"

# 3. Package dependencies tekshirish
echo "📦 Dependencies tekshirish..."
if [ ! -d "node_modules" ]; then
    echo "⚠️  node_modules yo'q, npm install kerak"
    npm install --production --no-optional
else
    echo "✅ node_modules mavjud"
fi

# 4. Botni ishga tushirish
echo "🤖 Botni ishga tushirish..."
npm start

echo "🎉 Deploy tugadi!"
