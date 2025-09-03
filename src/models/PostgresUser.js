import { DataTypes } from 'sequelize';

export function createUserModel(sequelize) {
    const User = sequelize.define('User', {
        userId: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true,
            primaryKey: true
        },
        firstName: {
            type: DataTypes.STRING,
            allowNull: false
        },
        lastName: {
            type: DataTypes.STRING,
            defaultValue: ''
        },
        username: {
            type: DataTypes.STRING,
            defaultValue: ''
        },
        language: {
            type: DataTypes.STRING,
            defaultValue: 'uz'
        },
        rating: {
            type: DataTypes.INTEGER,
            defaultValue: null
        },
        channelMembership: {
            type: DataTypes.BOOLEAN,
            defaultValue: false
        },
        totalConversions: {
            type: DataTypes.INTEGER,
            defaultValue: 0
        },
        conversionsCount: {
            type: DataTypes.JSONB,
            defaultValue: {
                jpgToPdf: 0,
                pngToPdf: 0,
                wordToText: 0,
                pdfToWord: 0,
                pdfMerge: 0
            }
        },
        firstSeen: {
            type: DataTypes.DATE,
            defaultValue: DataTypes.NOW
        },
        lastSeen: {
            type: DataTypes.DATE,
            defaultValue: DataTypes.NOW
        }
    }, {
        tableName: 'users',
        timestamps: true
    });

    // Instance methods
    User.prototype.updateActivity = async function () {
        this.lastSeen = new Date();
        await this.save();
    };

    User.prototype.incrementConversion = async function (conversionType) {
        if (this.conversionsCount[conversionType] !== undefined) {
            this.conversionsCount[conversionType]++;
            this.totalConversions++;
            this.changed('conversionsCount', true); // Sequelize JSONB uchun
            await this.save();
        }
    };

    // Static methods
    User.findByUserId = async function (userId) {
        return await this.findOne({ where: { userId: userId.toString() } });
    };

    User.getOnlineCount = async function () {
        const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000);
        return await this.count({
            where: {
                lastSeen: {
                    [sequelize.Sequelize.Op.gte]: fiveMinutesAgo
                }
            }
        });
    };

    User.getRatingStats = async function () {
        const result = await this.findAll({
            attributes: [
                [sequelize.fn('AVG', sequelize.col('rating')), 'averageRating'],
                [sequelize.fn('COUNT', sequelize.col('rating')), 'totalRatings']
            ],
            where: {
                rating: {
                    [sequelize.Sequelize.Op.ne]: null
                }
            },
            raw: true
        });

        return result;
    };

    return User;
}
