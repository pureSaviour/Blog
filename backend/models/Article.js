const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

// 定义文章模型（对应数据库的articles表）
const Article = sequelize.define('Article', {
    title: {
        type: DataTypes.STRING(100),
        allowNull: false, // 标题不能为空
        comment: '文章标题'
    },
    content: {
        type: DataTypes.TEXT,
        allowNull: false, // 内容不能为空
        comment: '文章内容'
    },
    cover: {
        type: DataTypes.STRING(255),
        allowNull: true,
        comment: '文章封面图URL（可选）'
    },
    createTime: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
        comment: '创建时间'
    }
}, {
    tableName: 'articles', // 数据库表名
    timestamps: false // 关闭Sequelize自动添加的createdAt/updatedAt
});

module.exports = Article;