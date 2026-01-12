const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

// 评论模型（关联文章ID）
const Comment = sequelize.define('Comment', {
    articleId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        comment: '关联的文章ID'
    },
    username: {
        type: DataTypes.STRING(50),
        allowNull: false,
        comment: '评论者昵称'
    },
    content: {
        type: DataTypes.TEXT,
        allowNull: false,
        comment: '评论内容'
    },
    createTime: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
        comment: '评论时间'
    }
}, {
    tableName: 'comments',
    timestamps: false
});

// 🌟 注释掉关联代码（新手阶段先简化，避免关联导致的同步错误）
// const Article = require('./Article');
// Article.hasMany(Comment, { foreignKey: 'articleId' });
// Comment.belongsTo(Article, { foreignKey: 'articleId' });

module.exports = Comment;