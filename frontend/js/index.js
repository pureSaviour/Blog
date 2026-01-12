// 页面加载完成后获取文章列表
document.addEventListener('DOMContentLoaded', async () => {
    // 🌟 确保变量在当前作用域内正确定义
    const articleListEl = document.getElementById('article-list');

    try {
        // 调用后端接口获取文章
        const response = await fetch('/api/articles', {
            headers: {
                'x-is-admin': localStorage.getItem('isAdmin') || 'false' // 新增
            },
            credentials: 'include'
        });
        const result = await response.json();

        if (!result.success) {
            // 确保使用当前作用域的articleListEl
            articleListEl.innerHTML = `<div class="col-span-full text-center text-red-500 py-10"><i class="fa-solid fa-exclamation-circle text-2xl mb-2"></i><p>加载失败：${result.message}</p></div>`;
            return;
        }

        const articles = result.data;

        // 无文章时显示提示
        if (articles.length === 0) {
            articleListEl.innerHTML = `<div class="col-span-full text-center text-fresh-dark py-10"><i class="fa-solid fa-file-alt text-2xl mb-2"></i><p>博主還沒有寫文章呢 ✍️</p></div>`;
            return;
        }

        // 渲染文章列表（修复点击跳转的语法）
        // 渲染文章列表
        const articleHTML = articles.map(article => `
      <div class="bg-white rounded-lg shadow-md p-6 mb-4 hover:shadow-lg transition-shadow">
        <h2 class="text-2xl font-bold mb-2 text-fresh-primary">${article.title}</h2>
        <div class="text-gray-500 text-sm mb-4">
          <span><i class="fa-solid fa-clock mr-1"></i>${new Date(article.createTime).toLocaleString()}</span>
          <span class="ml-4"><i class="fa-solid fa-heart text-red-500 mr-1"></i>${article.likeCount}</span>
          ${article.needKey ? '<span class="ml-4 text-purple-500"><i class="fa-solid fa-key mr-1"></i>需密钥访问</span>' : ''}
        </div>
        <p class="text-gray-700 mb-4">${article.content}</p>
        <a href="/detail.html?id=${article.id}" class="text-fresh-primary hover:text-fresh-primary/80 font-medium">
          ${article.needKey ? '验证密钥查看详情' : '查看详情'} <i class="fa-solid fa-arrow-right ml-1"></i>
        </a>
      </div>
    `).join('');
        articleListEl.innerHTML = articles.map(article => `
  <div class="bg-white rounded-xl shadow-sky overflow-hidden card-hover cursor-pointer" onclick="window.location.href='/detail.html?id=${article.id}'">
    ${article.cover ? `
      <img src="${article.cover}" alt="${article.title}" class="w-full h-48 object-cover">
    ` : ''}
    <div class="p-6">
      <h3 class="text-xl font-bold text-sky-dark mb-2 hover:text-sky-primary transition-colors">${article.title}</h3>
      <p class="text-gray-600 mb-4 line-clamp-3">${article.content.substring(0, 100)}${article.content.length > 100 ? '...' : ''}</p>
      <div class="flex justify-between items-center text-sm text-gray-400">
        <div>
          <i class="fa-solid fa-clock mr-1 text-sky-primary"></i>
          ${new Date(article.createTime).toLocaleString('zh-CN')}
        </div>
        <div>
          <i class="fa-solid fa-heart text-sky-primary mr-1"></i>${article.likeCount}
        </div>
      </div>
    </div>
  </div>
`).join('');

    } catch (error) {
        articleListEl.innerHTML = `<div class="col-span-full text-center text-red-500 py-10"><i class="fa-solid fa-exclamation-circle text-2xl mb-2"></i><p>网络错误，无法加载文章</p></div>`;
        console.error('加载文章失败：', error);
    }
});