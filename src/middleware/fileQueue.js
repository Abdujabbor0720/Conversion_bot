/**
 * Simple Queue System for File Processing
 * Ko'p foydalanuvchilar uchun navbat tizimi
 */

class ProcessingQueue {
    constructor() {
        this.queue = [];
        this.processing = new Map(); // userId -> {status, startTime}
        this.maxConcurrent = 3; // Bir vaqtda 3 ta fayl ishlov berish
        this.userLimit = 2; // Har bir user uchun maksimal 2 ta fayl navbatda
    }

    /**
     * Faylni navbatga qo'shish
     */
    addToQueue(userId, fileId, fileType, processingFunction) {
        // User uchun navbatdagi fayllar sonini tekshirish
        const userFilesInQueue = this.queue.filter(item => item.userId === userId).length;
        
        if (userFilesInQueue >= this.userLimit) {
            throw new Error(`⚠️ Siz navbatda ${this.userLimit} ta fayldan ko'p bo'la olmaysiz. Iltimos kutib turing.`);
        }

        const queueItem = {
            id: `${userId}_${fileId}_${Date.now()}`,
            userId,
            fileId,
            fileType,
            processingFunction,
            addedAt: new Date(),
            status: 'waiting'
        };

        this.queue.push(queueItem);
        this.processNext();
        
        return {
            position: this.getQueuePosition(queueItem.id),
            estimatedTime: this.getEstimatedTime()
        };
    }

    /**
     * Navbatdagi keyingi faylni ishlov berish
     */
    async processNext() {
        if (this.processing.size >= this.maxConcurrent) {
            return; // Maksimal limit to'lgan
        }

        const nextItem = this.queue.find(item => item.status === 'waiting');
        if (!nextItem) {
            return; // Navbatda fayl yo'q
        }

        nextItem.status = 'processing';
        this.processing.set(nextItem.userId, {
            status: 'processing',
            startTime: new Date(),
            fileType: nextItem.fileType
        });

        try {
            // Faylni ishlov berish
            await nextItem.processingFunction();
            
            // Muvaffaqiyatli tugatish
            this.completeProcessing(nextItem);
            
        } catch (error) {
            // Xatolik bo'lsa
            this.failProcessing(nextItem, error);
        }
    }

    /**
     * Ishlov berishni muvaffaqiyatli tugatish
     */
    completeProcessing(item) {
        this.processing.delete(item.userId);
        this.queue = this.queue.filter(queueItem => queueItem.id !== item.id);
        
        // Keyingi faylni ishlov berish
        setTimeout(() => this.processNext(), 100);
    }

    /**
     * Ishlov berishda xatolik
     */
    failProcessing(item, error) {
        this.processing.delete(item.userId);
        this.queue = this.queue.filter(queueItem => queueItem.id !== item.id);
        
        console.error(`❌ Queue processing failed for user ${item.userId}:`, error);
        
        // Keyingi faylni ishlov berish
        setTimeout(() => this.processNext(), 100);
    }

    /**
     * User uchun navbat holati
     */
    getUserStatus(userId) {
        const processing = this.processing.get(userId);
        if (processing) {
            return {
                status: 'processing',
                fileType: processing.fileType,
                startTime: processing.startTime
            };
        }

        const queueItems = this.queue.filter(item => item.userId === userId && item.status === 'waiting');
        if (queueItems.length > 0) {
            return {
                status: 'waiting',
                position: this.getQueuePosition(queueItems[0].id),
                filesInQueue: queueItems.length
            };
        }

        return null;
    }

    /**
     * Navbatdagi pozitsiyani aniqlash
     */
    getQueuePosition(itemId) {
        const waitingItems = this.queue.filter(item => item.status === 'waiting');
        return waitingItems.findIndex(item => item.id === itemId) + 1;
    }

    /**
     * Taxminiy kutish vaqti (daqiqalarda)
     */
    getEstimatedTime() {
        const waitingCount = this.queue.filter(item => item.status === 'waiting').length;
        const avgProcessingTime = 2; // 2 daqiqa (o'rtacha)
        return Math.ceil((waitingCount * avgProcessingTime) / this.maxConcurrent);
    }

    /**
     * Navbat statistikasi
     */
    getStats() {
        return {
            waiting: this.queue.filter(item => item.status === 'waiting').length,
            processing: this.processing.size,
            total: this.queue.length
        };
    }
}

// Global queue instance
export const fileProcessingQueue = new ProcessingQueue();

export default fileProcessingQueue;
