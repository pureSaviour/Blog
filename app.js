const express = require('express');
const cors = require('cors');
require('dotenv').config();
const { testDBConnection, syncModels } = require('./backend/config/db');
const articleRoutes = require('./backend/routes/articleRoutes');
// 新增：引入评论路由
const commentRoutes = require('./backend/routes/commentRoutes');

const app = express();
app.use((req, res, next) => {
    // 1. 允许内网穿透域名访问（替换为你的实际穿透域名，或用req.headers.origin兼容所有）
    const allowedOrigins = [
        'http://localhost:3000',
        'https://frp-end.com:10477', // 你的内网穿透域名+端口
        'frp-end.com:10477',
        req.headers.origin // 兼容动态来源（测试环境推荐）
    ];
    const origin = req.headers.origin;
    if (allowedOrigins.includes(origin) || !origin) {
        res.setHeader('Access-Control-Allow-Origin', origin || '*');
    }

    // 2. 允许所有必要的请求方法（包含PUT/DELETE，适配修改类型接口）
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');

    // 3. 允许所有必要的请求头（包含x-is-admin、Content-Type）
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, x-is-admin, Authorization');

    // 4. 允许携带凭证（如cookie/session，适配admin登录状态）
    res.setHeader('Access-Control-Allow-Credentials', 'true');

    // 5. 处理OPTIONS预检请求（立即返回，不执行后续逻辑）
    if (req.method === 'OPTIONS') {
        return res.status(204).end();
    }

    next();
});

const PORT = process.env.PORT || 3000;

// 中间件
app.use(cors());
app.use(express.json());
app.use(express.static('frontend'));

// 挂载路由
app.use('/api', articleRoutes);
app.use('/api', commentRoutes); // 新增：挂载评论路由

// 启动服务
const startServer = async () => {
    await testDBConnection();
    await syncModels();
    app.listen(PORT, () => {
        console.log(`后端服务已启动，访问地址：http://localhost:${PORT} 🚀`);
    });
};

// 关键：监听所有网卡（0.0.0.0），而非仅localhost，适配内网穿透
app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://0.0.0.0:${PORT} ✅`);
});

startServer();