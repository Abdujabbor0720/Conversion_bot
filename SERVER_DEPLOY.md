# 🚀 AlwaysData Serveriga Deploy Qilish

## 1-qadam: SSH orqali ulanish
```bash
ssh server001@ssh1.alwaysdata.com
```

## 2-qadam: Loyihani yangilash
```bash
cd TGbot-main
git pull origin main
```

## 3-qadam: Botni ishga tushirish
```bash
./start-server.sh
```

Yoki:
```bash
bash start-server.sh
```

## 4-qadam: Background da ishlatish
```bash
nohup bash start-server.sh > bot.log 2>&1 &
```

## 5-qadam: Loglarni ko'rish
```bash
tail -f bot.log
```

## Botni to'xtatish
```bash
pkill -f "node bot.js"
```

---

## Muammolar va yechimlar

### Agar npm install xatolik bersa:
```bash
rm -rf node_modules
npm install --production --no-optional
```

### Agar database ulanmasa:
1. AlwaysData panelingizdan PostgreSQL yarating
2. `.env` faylidagi `POSTGRES_URL` ni to'g'rilang

### Bot loglarini ko'rish:
```bash
tail -f bot.log
```

---

## Muvaffaqiyat belgilari
✅ Bot ishga tushdi
✅ PostgreSQL ulandi  
✅ File conversion ishlayapti

🎉 **Bot tayyor va 24/7 ishlaydi!**
