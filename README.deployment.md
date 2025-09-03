# 🤖 Telegram File Conversion Bot - AlwaysData Deployment

Professional Telegram bot for file conversion with PostgreSQL database.

## 🚀 Deployment Instructions

### 1. AlwaysData Setup

1. **Create AlwaysData Account**: Sign up at [alwaysdata.com](https://alwaysdata.com)
2. **Create PostgreSQL Database**:
   - Go to Databases → PostgreSQL
   - Create new database
   - Note: hostname, username, password, database name

### 2. Upload Files

Upload all project files to your AlwaysData directory:
```
/home/[username]/[domain]/
├── bot.js
├── package.json
├── .env.production
├── deploy.sh
├── src/
├── temp/
└── downloads/
```

### 3. Configure Environment

Edit `.env.production` with your settings:

```env
BOT_TOKEN=your_telegram_bot_token
ADMIN_ID=your_telegram_user_id
POSTGRES_URL=postgresql://user:pass@postgresql-server.alwaysdata.net:5432/dbname
CHANNEL_ID=@your_channel
```

### 4. Deploy

Run the deployment script:
```bash
chmod +x deploy.sh
./deploy.sh
```

### 5. Start Bot

```bash
npm start
```

## 🔧 Environment Variables

| Variable | Description | Example |
|----------|-------------|---------|
| `BOT_TOKEN` | Telegram Bot Token | `1234567890:ABC...` |
| `ADMIN_ID` | Admin Telegram ID | `123456789` |
| `POSTGRES_URL` | PostgreSQL Connection | `postgresql://...` |
| `CHANNEL_ID` | Channel ID/Username | `@mychannel` |
| `NODE_ENV` | Environment | `production` |

## 📊 Features

- ✅ File to PDF conversion
- ✅ PDF merging  
- ✅ Word to text extraction
- ✅ Image processing
- ✅ PostgreSQL database
- ✅ User management
- ✅ Multi-language support
- ✅ Channel membership verification

## 🛠 Tech Stack

- **Runtime**: Node.js 18+
- **Database**: PostgreSQL
- **ORM**: Sequelize
- **Bot Framework**: Telegraf
- **File Processing**: Sharp, PDF-lib, Mammoth

## 📞 Support

For issues and support, contact the developer.
