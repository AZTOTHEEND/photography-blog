/* ===== 光影集 · LUMEN — 管理脚本（Supabase） ===== */
(function () {
  'use strict';

  /* ---------- 移动端导航 ---------- */
  var navToggle = document.getElementById('navToggle');
  var siteNav = document.getElementById('siteNav');
  if (navToggle && siteNav) {
    navToggle.addEventListener('click', function () {
      siteNav.classList.toggle('open');
      navToggle.classList.toggle('active');
    });
  }

  /* ---------- Supabase 客户端 ---------- */
  var client = null;
  if (typeof window.supabase !== 'undefined' && window.supabase && SUPABASE_URL && SUPABASE_ANON_KEY) {
    client = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
  }

  var loginCard = document.getElementById('loginCard');
  var adminPanel = document.getElementById('adminPanel');
  var loginMsg = document.getElementById('loginMsg');
  var pendingList = document.getElementById('pendingList');
  var allList = document.getElementById('allList');
  if (!client) {
    loginCard.innerHTML = '<p class="dim">尚未配置 Supabase：请先在 js/config.js 中填写 SUPABASE_URL 与 SUPABASE_ANON_KEY（见 README.md）。</p>';
    return;
  }

  function setLoginMsg(text, ok) {
    loginMsg.textContent = text;
    loginMsg.style.color = ok ? 'var(--accent)' : '#d08a8a';
  }

  function objectNameFromUrl(url) {
    var parts = (url || '').split('/');
    return parts[parts.length - 1];
  }

  function itemHtml(w) {
    var badge = w.status === 'approved'
      ? '<span class="status-badge approved">已通过</span>'
      : '<span class="status-badge pending">待审核</span>';
    var actions = '';
    if (w.status !== 'approved') {
      actions += '<button class="manage-btn approve" data-act="approve" data-id="' + w.id + '">通过</button> ';
    }
    actions += '<button class="manage-btn delete" data-act="delete" data-id="' + w.id + '" data-url="' + encodeURIComponent(w.image_url || '') + '">删除</button>';
    return (
      '<div class="manage-item">' +
      '  <img src="' + (w.image_url || '') + '" alt="' + (w.title || '') + '" loading="lazy">' +
      '  <div class="manage-item-info">' +
      '    <h4>' + (w.title || '未命名') + ' ' + badge + '</h4>' +
      '    <p>' + (w.category || '未分类') + (w.created_at ? ' · ' + w.created_at.slice(0, 10) : '') + '</p>' +
      '  </div>' +
      '  <div class="manage-item-actions">' + actions + '</div>' +
      '</div>'
    );
  }

  async function loadLists() {
    var pend = await client.from('photos').select('*').eq('status', 'pending').order('created_at', { ascending: false });
    var all = await client.from('photos').select('*').order('created_at', { ascending: false });
    pendingList.innerHTML = pend.error || !pend.data.length
      ? '<p class="dim">暂无待审核作品。</p>'
      : pend.data.map(itemHtml).join('');
    allList.innerHTML = all.error || !all.data.length
      ? '<p class="dim">暂无作品。</p>'
      : all.data.map(itemHtml).join('');
  }

  async function enterAdmin() {
    loginCard.style.display = 'none';
    adminPanel.style.display = 'block';
    await loadLists();
  }

  async function init() {
    var ses = await client.auth.getSession();
    if (ses.data && ses.data.session) {
      await enterAdmin();
    } else {
      loginCard.style.display = 'block';
    }
  }

  /* ---------- 登录 / 退出 ---------- */
  document.getElementById('loginForm').addEventListener('submit', async function (e) {
    e.preventDefault();
    var email = document.getElementById('loginEmail').value.trim();
    var password = document.getElementById('loginPassword').value;
    setLoginMsg('登录中…', true);
    var res = await client.auth.signInWithPassword({ email: email, password: password });
    if (res.error) {
      setLoginMsg('登录失败：' + (res.error.message || '账号或密码错误'), false);
      return;
    }
    await enterAdmin();
  });

  document.getElementById('logoutBtn').addEventListener('click', async function () {
    await client.auth.signOut();
    adminPanel.style.display = 'none';
    loginCard.style.display = 'block';
    setLoginMsg('已退出登录。', true);
  });

  /* ---------- 通过 / 删除 ---------- */
  document.addEventListener('click', async function (e) {
    var btn = e.target.closest('.manage-btn');
    if (!btn) return;
    var act = btn.getAttribute('data-act');
    var id = btn.getAttribute('data-id');
    var url = decodeURIComponent(btn.getAttribute('data-url') || '');
    if (act === 'approve') {
      var up = await client.from('photos').update({ status: 'approved' }).eq('id', id);
      if (up.error) { alert('操作失败：' + up.error.message); return; }
      await loadLists();
    } else if (act === 'delete') {
      if (!confirm('确定删除该作品吗？图片与记录都会移除，不可恢复。')) return;
      var objectName = objectNameFromUrl(url);
      if (objectName) {
        await client.storage.from('photos').remove([objectName]);
      }
      var del = await client.from('photos').delete().eq('id', id);
      if (del.error) { alert('删除失败：' + del.error.message); return; }
      await loadLists();
    }
  });

  init();
})();
