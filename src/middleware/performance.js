/**
 * Performance Monitoring va Optimization
 */

class PerformanceMonitor {
    constructor() {
        this.metrics = {
            totalRequests: 0,
            successfulProcessing: 0,
            failedProcessing: 0,
            averageProcessingTime: 0,
            peakConcurrentUsers: 0,
            currentActiveUsers: new Set()
        };

        this.processingTimes = [];
        this.maxMetricsHistory = 100;
    }

    /**
     * So'rov boshlanishi
     */
    requestStart(userId, fileType) {
        this.metrics.totalRequests++;
        this.metrics.currentActiveUsers.add(userId);

        if (this.metrics.currentActiveUsers.size > this.metrics.peakConcurrentUsers) {
            this.metrics.peakConcurrentUsers = this.metrics.currentActiveUsers.size;
        }

        return {
            startTime: Date.now(),
            userId,
            fileType
        };
    }

    /**
     * So'rov tugashi (muvaffaqiyatli)
     */
    requestSuccess(requestData) {
        const processingTime = Date.now() - requestData.startTime;

        this.metrics.successfulProcessing++;
        this.metrics.currentActiveUsers.delete(requestData.userId);

        // O'rtacha vaqtni hisoblash
        this.processingTimes.push(processingTime);
        if (this.processingTimes.length > this.maxMetricsHistory) {
            this.processingTimes.shift();
        }

        this.metrics.averageProcessingTime =
            this.processingTimes.reduce((a, b) => a + b, 0) / this.processingTimes.length;

        console.log(`✅ Processing completed in ${processingTime}ms for user ${requestData.userId}`);
    }

    /**
     * So'rov tugashi (xatolik)
     */
    requestFailed(requestData, error) {
        this.metrics.failedProcessing++;
        this.metrics.currentActiveUsers.delete(requestData.userId);

        console.error(`❌ Processing failed for user ${requestData.userId}:`, error.message);
    }

    /**
     * Sistema yukini tekshirish
     */
    getSystemLoad() {
        const activeUsers = this.metrics.currentActiveUsers.size;
        const successRate = this.metrics.totalRequests > 0 ?
            (this.metrics.successfulProcessing / this.metrics.totalRequests * 100).toFixed(1) : 0;

        return {
            activeUsers,
            successRate: `${successRate}%`,
            averageTime: `${Math.round(this.metrics.averageProcessingTime / 1000)}s`,
            peakUsers: this.metrics.peakConcurrentUsers,
            totalProcessed: this.metrics.successfulProcessing + this.metrics.failedProcessing
        };
    }

    /**
     * Sistema yuki yuqori bo'lsa ogohlantirish - CHEKSIZ QILINDI
     */
    shouldThrottle() {
        // Hech qachon throttle qilmaslik - CHEKSIZ
        return false;
    }

    /**
     * So'nggi failure rate
     */
    getRecentFailureRate() {
        const recentRequests = 20; // So'nggi 20 ta so'rov
        const totalRecent = Math.min(this.metrics.totalRequests, recentRequests);

        if (totalRecent === 0) return 0;

        const recentFailures = Math.min(this.metrics.failedProcessing, recentRequests);
        return recentFailures / totalRecent;
    }

    /**
     * Admin uchun statistika
     */
    getDetailedStats() {
        return {
            ...this.metrics,
            currentActiveUsers: this.metrics.currentActiveUsers.size,
            systemLoad: this.getSystemLoad(),
            shouldThrottle: this.shouldThrottle(),
            uptime: process.uptime()
        };
    }
}

// Memory usage monitoring
export function getMemoryUsage() {
    const usage = process.memoryUsage();
    return {
        rss: `${Math.round(usage.rss / 1024 / 1024)}MB`,
        heapUsed: `${Math.round(usage.heapUsed / 1024 / 1024)}MB`,
        heapTotal: `${Math.round(usage.heapTotal / 1024 / 1024)}MB`,
        external: `${Math.round(usage.external / 1024 / 1024)}MB`
    };
}

// CPU usage monitoring
export function getCPUUsage() {
    const usage = process.cpuUsage();
    return {
        user: `${Math.round(usage.user / 1000)}ms`,
        system: `${Math.round(usage.system / 1000)}ms`
    };
}

export const performanceMonitor = new PerformanceMonitor();
export default performanceMonitor;
