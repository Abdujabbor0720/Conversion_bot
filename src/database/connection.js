import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

class Database {
    constructor() {
        this.connection = null;
        this.isConnected = false;
    }

    async connect() {
        try {
            if (this.isConnected) {
                console.log('📊 MongoDB allaqachon ulangan');
                return this.connection;
            }

            const mongoUri = process.env.MONGODB_URI;

            if (!mongoUri) {
                console.log('📊 MongoDB URI topilmadi, JSON file ishlatiladi');
                return null;
            }

            console.log('📊 MongoDB ga ulanish...');

            const options = {
                maxPoolSize: 10,
                serverSelectionTimeoutMS: 5000,
                socketTimeoutMS: 45000,
                bufferCommands: false,
            };

            this.connection = await mongoose.connect(mongoUri, options);
            this.isConnected = true;

            console.log('✅ MongoDB muvaffaqiyatli ulandi');

            // Connection event listeners
            mongoose.connection.on('error', (error) => {
                console.error('❌ MongoDB connection error:', error);
                this.isConnected = false;
            });

            mongoose.connection.on('disconnected', () => {
                console.log('📊 MongoDB ulanish uzildi');
                this.isConnected = false;
            });

            mongoose.connection.on('reconnected', () => {
                console.log('✅ MongoDB qayta ulandi');
                this.isConnected = true;
            });

            return this.connection;

        } catch (error) {
            console.error('❌ MongoDB ga ulanishda xatolik:', error.message);
            console.log('📊 JSON file ishlatiladi');
            this.isConnected = false;
            return null;
        }
    }

    async disconnect() {
        try {
            if (this.isConnected && this.connection) {
                await mongoose.connection.close();
                this.isConnected = false;
                console.log('📊 MongoDB ulanish yopildi');
            }
        } catch (error) {
            console.error('❌ MongoDB ulanishni yopishda xatolik:', error);
        }
    }

    getConnectionStatus() {
        return {
            isConnected: this.isConnected,
            readyState: mongoose.connection.readyState,
            host: mongoose.connection.host,
            name: mongoose.connection.name
        };
    }
}

const database = new Database();

export default database;
