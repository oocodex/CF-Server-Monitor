export async function loadSettings(db) {
  const defaults = {
    site_title: 'Cloudflare server Monitor',
    admin_title: '探针管理后台',
    theme: 'theme1',
    custom_bg: '',
    custom_css: '',
    custom_head: '',
    custom_script: '',
    is_public: 'true',
    show_price: 'true',
    show_expire: 'true',
    show_bw: 'true',
    show_tf: 'true',
    tg_notify: 'false',
    tg_bot_token: '',
    tg_chat_id: '',
    auto_reset_traffic: 'false'
  };

  try {
    const { results } = await db.prepare('SELECT * FROM settings').all();
    if (results && results.length > 0) {
      results.forEach(r => defaults[r.key] = r.value);
    }
  } catch (e) {
    console.error('加载设置失败:', e);
  }

  return defaults;
}