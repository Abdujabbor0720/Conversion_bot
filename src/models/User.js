import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
    userId: {
        type: String,
        required: true,
        unique: true,
        index: true
    },
    firstName: {
        type: String,
        required: true
    },
    lastName: {
        type: String,
        default: ''
    },
    username: {
        type: String,
        default: ''
    },
    language: {
        type: String,
        enum: ['uz', 'ru', 'en'],
        default: null
    },
    channelMembership: {
        type: Boolean,
        default: false
    },
    isActive: {
        type: Boolean,
        default: true
    },
    rating: {
        type: Number,
        min: 1,
        max: 5,
        default: null
    },
    firstSeen: {
        type: Date,
        default: Date.now
    },
    lastSeen: {
        type: Date,
        default: Date.now
    },
    totalConversions: {
        type: Number,
        default: 0
    },
    // Konversiya statistikasi
    conversionsCount: {
        jpgToPdf: { type: Number, default: 0 },
        pngToPdf: { type: Number, default: 0 },
        wordToText: { type: Number, default: 0 },
        pdfToWord: { type: Number, default: 0 },
        pdfMerge: { type: Number, default: 0 }
    }
}, {
    timestamps: true, // createdAt va updatedAt avtomatik qo'shiladi
    collection: 'users'
});

// Index lar - tezroq qidiruv uchun
userSchema.index({ userId: 1 });
userSchema.index({ lastSeen: -1 });
userSchema.index({ language: 1 });
userSchema.index({ channelMembership: 1 });

// Virtual field - online bo'lish uchun
userSchema.virtual('isOnline').get(function () {
    const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000);
    return this.lastSeen > fiveMinutesAgo;
});

// Metodlar
userSchema.methods.updateActivity = function () {
    this.lastSeen = new Date();
    return this.save();
};

userSchema.methods.incrementConversion = function (type) {
    if (this.conversionsCount[type] !== undefined) {
        this.conversionsCount[type]++;
        this.totalConversions++;
    }
    return this.save();
};

// Static metodlar
userSchema.statics.findByUserId = function (userId) {
    return this.findOne({ userId: userId.toString() });
};

userSchema.statics.getOnlineCount = function () {
    const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000);
    return this.countDocuments({ lastSeen: { $gte: fiveMinutesAgo } });
};

userSchema.statics.getRatingStats = function () {
    return this.aggregate([
        { $match: { rating: { $ne: null } } },
        {
            $group: {
                _id: null,
                averageRating: { $avg: '$rating' },
                totalRatings: { $sum: 1 },
                ratingDistribution: {
                    $push: '$rating'
                }
            }
        }
    ]);
};

const User = mongoose.model('User', userSchema);

export default User;
