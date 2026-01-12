// 验证是否为 admin 的中间件（前端需在请求头携带 admin 标记）
module.exports = (req, res, next) => {
    // 前端请求时，在 headers 中携带 isAdmin: 'true'
    const isAdmin = req.headers['x-is-admin'] === 'true';
    if (!isAdmin) {
        return res.status(403).json({
            success: false,
            message: '仅管理员可操作私有/密钥笔记'
        });
    }
    next();
};