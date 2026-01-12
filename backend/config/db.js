const { Sequelize } = require('sequelize');
require('dotenv').config();

// 创建Sequelize实例，连接MySQL
const sequelize = new Sequelize(
    process.env.DB_NAME,
    process.env.DB_USER,
    process.env.DB_PASSWORD,
    {
        host: process.env.DB_HOST,
        port: process.env.DB_PORT,
        dialect: 'mysql',
        logging: false, // 关闭SQL日志（新手可开启，方便调试）
    }
);

// 测试数据库连接
const testDBConnection = async () => {
    try {
        await sequelize.authenticate();
        console.log('数据库连接成功 ✅');
    } catch (error) {
        console.error('数据库连接失败 ❌:', error);
        process.exit(1); // 连接失败则退出程序
    }
};

// 同步模型到数据库（自动创建表）
const syncModels = async () => {
    await sequelize.sync({ force: true }); // 🌟 临时改为true，重建表（会清空原有数据！）
    console.log('数据库表同步完成 ✅');
};

module.exports = { sequelize, testDBConnection, syncModels };