#!/bin/bash

# AlwaysData Deployment Script for Telegram Bot

echo "🚀 Starting deployment to AlwaysData..."

# 1. Create necessary directories
echo "📁 Creating directories..."
mkdir -p temp/images temp/pdfs temp/docs downloads

# 2. Install dependencies
echo "📦 Installing dependencies..."
npm ci --production

# 3. Set permissions
echo "🔧 Setting permissions..."
chmod +x bot.js
chmod -R 755 temp/
chmod -R 755 downloads/

# 4. Copy production environment
echo "⚙️ Setting up environment..."
if [ -f .env.production ]; then
    cp .env.production .env
    echo "✅ Production environment configured"
else
    echo "⚠️ Warning: .env.production not found"
fi

# 5. Start the bot
echo "🤖 Starting bot..."
npm run prod

echo "✅ Deployment completed!"
