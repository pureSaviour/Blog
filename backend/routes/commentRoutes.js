const express = require('express');
const router = express.Router();
const Comment = require('../models/Comment');

// 1. 获取某篇文章的所有评论
router.get('/articles/:id/comments', async (req, res) => {
    try {
        const comments = await Comment.findAll({
            where: { articleId: req.params.id },
            order: [['createTime', 'DESC']] // 最新评论在前
        });
        res.status(200).json({ success: true, data: comments });
    } catch (error) {
        // 🌟 新增：打印具体错误，方便排查
        console.error('获取评论失败：', error);
        res.status(500).json({ success: false, message: '获取评论失败', error: error.message });
    }
});

// 2. 提交评论（用户评论）
router.post('/articles/:id/comments', async (req, res) => {
    try {
        const { username, content } = req.body;
        // 验证参数
        if (!username || !content) {
            return res.status(400).json({ success: false, message: '昵称和评论内容不能为空' });
        }
        // 创建评论
        const newComment = await Comment.create({
            articleId: req.params.id,
            username,
            content
        });
        res.status(201).json({ success: true, message: '评论提交成功', data: newComment });
    } catch (error) {
        // 🌟 新增：打印具体错误，方便排查
        console.error('提交评论失败：', error);
        res.status(500).json({ success: false, message: '提交评论失败', error: error.message });
    }
});

module.exports = router;