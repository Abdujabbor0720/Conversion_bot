// PostgreSQL va JSON bilan ishlash
import fs from 'fs';
import path from 'path';
import { PostgresDB } from '../database/postgres.js';
import { createUserModel } from '../models/PostgresUser.js';

const usersFile = path.join(process.cwd(), 'users.json');

// PostgreSQL bog'lanish
let User = null;
let sequelize = null;

async function initPostgreSQL() {
    try {
        const postgresDB = new PostgresDB();
        sequelize = await postgresDB.connect();
        User = createUserModel(sequelize);
        await sequelize.sync();
        console.log('✅ PostgreSQL bog\'landi va User model yaratildi');
    } catch (error) {
        console.log('⚠️ PostgreSQL not available, using JSON fallback:', error.message);
    }
}

initPostgreSQL().catch(console.error);

const isPostgreSQLAvailable = () => sequelize && User;

function loadUsers() {
    try {
        if (fs.existsSync(usersFile)) {
            return JSON.parse(fs.readFileSync(usersFile, 'utf8'));
        }
        return {};
    } catch {
        return {};
    }
}

function saveUsers(users) {
    try {
        fs.writeFileSync(usersFile, JSON.stringify(users, null, 2));
        return true;
    } catch {
        return false;
    }
}

const userManager = {
    async addUser(userId, userData) {
        try {
            if (isPostgreSQLAvailable() && User) {
                console.log('🐘 PostgreSQL ga user qo\'shyapman:', userId);
                const existingUser = await User.findByUserId(userId);
                if (existingUser) {
                    existingUser.firstName = userData.firstName || existingUser.firstName;
                    existingUser.lastName = userData.lastName || existingUser.lastName;
                    existingUser.username = userData.username || existingUser.username;
                    existingUser.lastSeen = new Date();
                    await existingUser.save();
                    console.log('✅ PostgreSQL da user yangilandi');
                    return existingUser;
                } else {
                    const newUser = await User.create({
                        userId: userId.toString(),
                        firstName: userData.firstName || '',
                        lastName: userData.lastName || '',
                        username: userData.username || '',
                        firstSeen: new Date(),
                        lastSeen: new Date()
                    });
                    console.log('✅ PostgreSQL ga yangi user qo\'shildi');
                    return newUser;
                }
            } else {
                console.log('📁 JSON fallback ishlatyapman:', userId);
                const users = loadUsers();
                users[userId] = {
                    id: userId,
                    firstName: userData.firstName || '',
                    lastName: userData.lastName || '',
                    username: userData.username || '',
                    firstSeen: new Date().toISOString(),
                    lastSeen: new Date().toISOString(),
                    ...userData
                };
                saveUsers(users);
                return users[userId];
            }
        } catch (error) {
            console.error('Foydalanuvchini qo\'shishda xatolik:', error);
            const users = loadUsers();
            users[userId] = {
                id: userId,
                firstName: userData.firstName || '',
                lastName: userData.lastName || '',
                username: userData.username || '',
                firstSeen: new Date().toISOString(),
                lastSeen: new Date().toISOString(),
                ...userData
            };
            saveUsers(users);
            return users[userId];
        }
    },

    async getUser(userId) {
        try {
            if (isPostgreSQLAvailable() && User) {
                console.log('🐘 PostgreSQL dan user qidiryapman:', userId);
                const user = await User.findByUserId(userId);
                const result = user ? user.dataValues : null;
                console.log('🔍 PostgreSQL natija:', result ? 'TOPILDI' : 'TOPILMADI');
                return result;
            } else {
                console.log('📁 JSON dan user qidiryapman:', userId);
                const users = loadUsers();
                const result = users[userId] || null;
                console.log('🔍 JSON natija:', result ? 'TOPILDI' : 'TOPILMADI');
                return result;
            }
        } catch (error) {
            console.error('Foydalanuvchini olishda xatolik:', error);
            const users = loadUsers();
            return users[userId] || null;
        }
    },

    async getUsersCount() {
        try {
            if (isPostgreSQLAvailable() && User) {
                return await User.count();
            } else {
                const users = loadUsers();
                return Object.keys(users).length;
            }
        } catch (error) {
            console.error('Foydalanuvchilar sonini olishda xatolik:', error);
            const users = loadUsers();
            return Object.keys(users).length;
        }
    },

    async updateUserActivity(userId) {
        try {
            if (isPostgreSQLAvailable() && User) {
                const user = await User.findByUserId(userId);
                if (user) {
                    await user.updateActivity();
                    return true;
                }
                return false;
            } else {
                const users = loadUsers();
                if (users[userId]) {
                    users[userId].lastSeen = new Date().toISOString();
                    saveUsers(users);
                    return true;
                }
                return false;
            }
        } catch (error) {
            console.error('Foydalanuvchi faolligini yangilashda xatolik:', error);
            return false;
        }
    },

    async getUserLanguage(userId) {
        try {
            if (isPostgreSQLAvailable() && User) {
                const user = await User.findByUserId(userId);
                return user ? user.language : 'uz';
            } else {
                const users = loadUsers();
                return users[userId]?.language || 'uz';
            }
        } catch (error) {
            console.error('Tilni olishda xatolik:', error);
            return 'uz';
        }
    }
};

export default userManager;
