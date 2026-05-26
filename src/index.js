import { initDatabase } from './database/schema.js';
import { checkAuth, authResponse } from './middleware/auth.js';
import { handleAdminAPI } from './handlers/admin.js';
import { handleAdminUI } from './handlers/admin-ui.js';
import { handleInstallScript } from './handlers/install.js';
import { handleUpdate } from './handlers/update.js';
import { handleDashboard, handleServerDetail, handleServerAPI } from './handlers/dashboard.js';
import { loadSettings } from './utils/settings.js';

let dbInitialized = false;

export default {
  async fetch(request, env, ctx) {
    // 数据库初始化
    if (!dbInitialized) {
      await initDatabase(env.DB);
      dbInitialized = true;
    }

    const url = new URL(request.url);
    const sys = await loadSettings(env.DB);

    // 后台管理 API
    if (request.method === 'POST' && url.pathname === '/admin/api') {
      return handleAdminAPI(request, env, sys);
    }

    // 后台管理页面
    if (request.method === 'GET' && url.pathname === '/admin') {
      return handleAdminUI(request, env, sys);
    }

    // 安装脚本
    // if (request.method === 'GET' && url.pathname === '/install.sh') {
    //   return handleInstallScript(url.origin, env.API_SECRET);
    // }

    // 数据更新接口
    if (request.method === 'POST' && url.pathname === '/update') {
      return handleUpdate(request, env, ctx);
    }

    // 服务器详情 JSON API
    if (request.method === 'GET' && url.pathname === '/api/server') {
      return handleServerAPI(request, env, sys);
    }

    // 服务器详情 API（24小时历史数据）
    if (request.method === 'GET' && url.pathname === '/api/history') {
      const id = url.searchParams.get('id');
      const metric = url.searchParams.get('metric') || 'cpu';
      const hours = parseInt(url.searchParams.get('hours') || '24');
      
      if (!id) return new Response('Missing ID', { status: 400 });
      
      const history = await env.DB.prepare(`
        SELECT timestamp, ${metric} 
        FROM metrics_history 
        WHERE server_id = ? 
        AND timestamp > datetime('now', '-' || ? || ' hours')
        ORDER BY timestamp ASC
      `).bind(id, hours).all();
      
      return new Response(JSON.stringify(history.results), {
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // 前台页面
    if (request.method === 'GET' && url.pathname === '/') {
      const viewId = url.searchParams.get('id');
      
      if (viewId) {
        return handleServerDetail(request, env, sys, viewId);
      }
      
      return handleDashboard(request, env, sys);
    }

    return new Response('Not Found', { status: 404 });
  }
};