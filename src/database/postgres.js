import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';

// .env faylini yuklash
if (process.env.NODE_ENV === 'production') {
    dotenv.config({ path: '.env.production' });
} else {
    dotenv.config({ path: '.env.server' });
}

class PostgreSQLDatabase {
    constructor() {
        this.sequelize = null;
        this.isConnected = false;
    }

    async connect() {
        try {
            if (this.isConnected) {
                console.log('🐘 PostgreSQL allaqachon ulangan');
                return this.sequelize;
            }

            const dbUrl = process.env.POSTGRES_URL || 'postgresql://postgres:newpassword123@localhost:5432/telegram_bot_db';
            console.log('🐘 PostgreSQL ga ulanish...');
            console.log('📡 Connection URL:', dbUrl);

            this.sequelize = new Sequelize(dbUrl, {
                dialect: 'postgres',
                logging: false, // SQL querylarni chiqarmaslik uchun
                pool: {
                    max: 10,
                    min: 0,
                    acquire: 30000,
                    idle: 10000
                }
            });

            // Ulanishni tekshirish
            await this.sequelize.authenticate();
            this.isConnected = true;

            console.log('✅ PostgreSQL muvaffaqiyatli ulandi');
            return this.sequelize;

        } catch (error) {
            console.error('❌ PostgreSQL ga ulanishda xatolik:', error.message);
            console.log('📊 JSON file ishlatiladi');
            this.isConnected = false;
            return null;
        }
    }

    async disconnect() {
        if (this.sequelize) {
            await this.sequelize.close();
            this.isConnected = false;
            console.log('🐘 PostgreSQL ulanishi uzildi');
        }
    }

    getSequelize() {
        return this.sequelize;
    }
}

// Singleton pattern
const database = new PostgreSQLDatabase();

export default database;
export { PostgreSQLDatabase as PostgresDB };
