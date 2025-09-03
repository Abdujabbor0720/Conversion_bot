import userManager from './src/utils/userManager.js';

console.log('📊 User Manager test...');

// Test user qo'shish
const testUser = await userManager.addUser(99999, {
    firstName: 'Test User',
    username: 'testuser'
});

console.log('✅ Test user qo\'shildi:', testUser);

// Users sonini olish
const count = await userManager.getUsersCount();
console.log('📈 Jami foydalanuvchilar:', count);

console.log('💾 Hozir ishlatilayotgan: JSON fallback (users.json)');
