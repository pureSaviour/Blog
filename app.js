const express = require('express');
const cors = require('cors');
require('dotenv').config();
const { testDBConnection, syncModels } = require('./backend/config/db');
const articleRoutes = require('./backend/routes/articleRoutes');
// 新增：引入评论路由
const commentRoutes = require('./backend/routes/commentRoutes');

const app = express();
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

startServer();