const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

const Article = sequelize.define('Article', {
    // ========== 原有字段（完全保留，一行不改） ==========
    title: { type: DataTypes.STRING(100), allowNull: false, comment: '标题' },
    content: { type: DataTypes.TEXT, allowNull: false, comment: '内容' },
    cover: { type: DataTypes.STRING(255), allowNull: true, comment: '封面' },
    createTime: { type: DataTypes.DATE, defaultValue: DataTypes.NOW, comment: '创建时间' },
    likeCount: { type: DataTypes.INTEGER, defaultValue: 0, comment: '点赞数' },

    // ========== 新增字段（核心扩展） ==========
    type: {
        type: DataTypes.ENUM('public', 'private', 'key'), // 三种类型
        defaultValue: 'public', // 默认公开
        comment: '文章类型：public-公开 private-私有 key-密钥可见'
    },
    accessKey: {
        type: DataTypes.STRING(50),
        allowNull: true,
        comment: '访问密钥（仅type=key时生效）'
    }
}, {
    tableName: 'articles',
    timestamps: false
});

module.exports = Article;