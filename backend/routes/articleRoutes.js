const express = require('express');
const router = express.Router();
const Article = require('../models/Article');

// 1. 获取所有文章（用户访问时加载）
router.get('/articles', async (req, res) => {
    try {
        const articles = await Article.findAll({
            order: [['createTime', 'DESC']]
        });
        res.status(200).json({ success: true, data: articles });
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

module.exports = router;