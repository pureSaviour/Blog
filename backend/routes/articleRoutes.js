const express = require('express');
const router = express.Router();
const Article = require('../models/Article');
const authAdmin = require('../middleware/authAdmin');

// 1. 获取所有文章（用户访问时加载）
router.get('/articles', async (req, res) => {
    try {
        // 新增：判断是否为 admin，非 admin 不显示私有笔记
        const isAdmin = req.headers['x-is-admin'] === 'true';
        const whereCondition = isAdmin ? {} : { type: ['public', 'key'] };

        const articles = await Article.findAll({
            where: whereCondition, // 新增过滤条件
            order: [['createTime', 'DESC']]
        });
        const filteredArticles = articles.map(article => {
            const articleObj = article.toJSON(); // 转为普通对象
            // 非admin + key类型：隐藏content，标记需要密钥
            if (!isAdmin && articleObj.type === 'key') {
                return {
                    ...articleObj,
                    content: '[该笔记需要密钥访问，点击查看详情并验证密钥]', // 替换为提示语
                    needKey: true // 前端标记：需要密钥
                };
            }
            // admin/公开/私有：返回完整内容（私有仅admin能看到）
            return articleObj;
        });
        res.status(200).json({ success: true, data: filteredArticles });
    } catch (error) {
        res.status(500).json({ success: false, message: '获取文章失败', error: error.message });
    }
});

// 2. 获取单篇文章（文章详情页）
router.get('/articles/:id', async (req, res) => {
    try {
        const article = await Article.findByPk(req.params.id);
        if (!article) {
            return res.status(404).json({ success: false, message: '文章不存在' });
        }
        res.status(200).json({ success: true, data: article });
    } catch (error) {
        res.status(500).json({ success: false, message: '获取文章失败', error: error.message });
    }
});

// 3. 创建文章（博主专属）
router.post('/articles', async (req, res) => {
    try {
        const { title, content, cover } = req.body;
        if (!title || !content) {
            return res.status(400).json({ success: false, message: '标题和内容不能为空' });
        }
        const newArticle = await Article.create({ title, content, cover, likeCount: 0 });
        res.status(201).json({ success: true, message: '文章创建成功', data: newArticle });
    } catch (error) {
        res.status(500).json({ success: false, message: '创建文章失败', error: error.message });
    }
});

// 4. 新增：文章点赞（用户点击点赞时调用）
router.post('/articles/:id/like', async (req, res) => {
    try {
        const article = await Article.findByPk(req.params.id);
        if (!article) {
            return res.status(404).json({ success: false, message: '文章不存在' });
        }
        // 点赞数+1
        article.likeCount = article.likeCount + 1;
        await article.save();
        res.status(200).json({ success: true, message: '点赞成功', data: { likeCount: article.likeCount } });
    } catch (error) {
        res.status(500).json({ success: false, message: '点赞失败', error: error.message });
    }
});

// 5. 新增：修改文章（博主专属）
router.put('/articles/:id', async (req, res) => {
    try {
        const { title, content, cover } = req.body;
        const article = await Article.findByPk(req.params.id);

        if (!article) {
            return res.status(404).json({ success: false, message: '文章不存在' });
        }
        if (!title || !content) {
            return res.status(400).json({ success: false, message: '标题和内容不能为空' });
        }

        // 更新文章内容
        article.title = title;
        article.content = content;
        if (cover) article.cover = cover; // 封面可选更新
        await article.save();

        res.status(200).json({ success: true, message: '文章修改成功', data: article });
    } catch (error) {
        res.status(500).json({ success: false, message: '修改文章失败', error: error.message });
    }
});

// 6. 新增：删除文章（博主专属）
router.delete('/articles/:id', async (req, res) => {
    try {
        const article = await Article.findByPk(req.params.id);
        if (!article) {
            return res.status(404).json({ success: false, message: '文章不存在' });
        }
        // 删除文章（同时会自动删除关联的评论，若开启级联删除）
        await article.destroy();
        res.status(200).json({ success: true, message: '文章删除成功' });
    } catch (error) {
        res.status(500).json({ success: false, message: '删除文章失败', error: error.message });
    }
});

// 1. 修改文章类型（仅 admin 可调用）
router.put('/articles/:id/type', authAdmin, async (req, res) => {
    try {
        const { type, accessKey } = req.body;
        const article = await Article.findByPk(req.params.id);
        if (!article) return res.status(404).json({ success: false, message: '文章不存在' });

        // 仅当类型为 key 时，才需要 accessKey
        article.type = type;
        article.accessKey = type === 'key' ? accessKey : null;
        await article.save();

        res.status(200).json({ success: true, message: '类型修改成功', data: article });
    } catch (error) {
        res.status(500).json({ success: false, message: '类型修改失败', error: error.message });
    }
});

// 2. 验证密钥（公开接口，供前端调用）
router.post('/articles/:id/verify-key', async (req, res) => {
    try {
        const { accessKey } = req.body;
        const article = await Article.findByPk(req.params.id);

        if (!article) return res.status(404).json({ success: false, message: '文章不存在' });
        if (article.type !== 'key') return res.status(400).json({ success: false, message: '该文章无需密钥' });
        if (article.accessKey !== accessKey) return res.status(403).json({ success: false, message: '密钥错误' });

        res.status(200).json({ success: true, message: '密钥验证通过', data: article });
    } catch (error) {
        res.status(500).json({ success: false, message: '密钥验证失败', error: error.message });
    }
});

module.exports = router;