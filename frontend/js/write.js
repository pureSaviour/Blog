document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('article-form');
    const toast = document.getElementById('toast');

    // 显示提示弹窗
    const showToast = (message, isSuccess = true) => {
        toast.textContent = message;
        toast.className = `fixed bottom-6 right-6 px-6 py-3 rounded-lg shadow-lg text-white opacity-100 transition-opacity duration-300 z-50 ${isSuccess ? 'bg-green-500' : 'bg-red-500'}`;

        setTimeout(() => {
            toast.classList.remove('opacity-100');
            toast.classList.add('opacity-0');
        }, 3000);
    };

    // 表单提交
    form.addEventListener('submit', async (e) => {
        e.preventDefault(); // 阻止默认提交

        // 获取表单数据
        const title = document.getElementById('title').value.trim();
        const content = document.getElementById('content').value.trim();
        const cover = document.getElementById('cover').value.trim();

        // 简单验证
        if (!title || !content) {
            showToast('标题和内容不能为空 ❌', false);
            return;
        }

        try {
            // 提交到后端接口
            const response = await fetch('/api/articles', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ title, content, cover }),
            });

            const result = await response.json();

            if (result.success) {
                showToast('文章发布成功 ✅');
                // 清空表单
                form.reset();
                // 3秒后跳回首页
                setTimeout(() => {
                    window.location.href = '/';
                }, 1500);
            } else {
                showToast(`发布失败：${result.message} ❌`, false);
            }
        } catch (error) {
            showToast('网络错误，发布失败 ❌', false);
            console.error('提交文章失败：', error);
        }
    });
});