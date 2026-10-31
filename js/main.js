/* ===== 光影集 · LUMEN — 交互脚本 ===== */
(function () {
  'use strict';

  /* ---------- 移动端导航 ---------- */
  var navToggle = document.getElementById('navToggle');
  var siteNav = document.getElementById('siteNav');
  if (navToggle && siteNav) {
    navToggle.addEventListener('click', function () {
      siteNav.classList.toggle('open');
      navToggle.classList.toggle('active');
      var expanded = navToggle.getAttribute('aria-expanded') === 'true';
      navToggle.setAttribute('aria-expanded', String(!expanded));
    });
    siteNav.addEventListener('click', function (e) {
      if (e.target.tagName === 'A') {
        siteNav.classList.remove('open');
        navToggle.classList.remove('active');
        navToggle.setAttribute('aria-expanded', 'false');
      }
    });
  }

  /* ---------- Supabase 工具 ---------- */
  var remoteWorks = [];

  function supabaseReady() {
    return typeof window.supabase !== 'undefined' && window.supabase &&
      typeof SUPABASE_URL !== 'undefined' && typeof SUPABASE_ANON_KEY !== 'undefined' &&
      SUPABASE_URL && SUPABASE_ANON_KEY;
  }

  function makeClient() {
    if (!supabaseReady()) return null;
    return window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
  }

  function normalizeRemote(w) {
    return {
      id: 'remote-' + w.id,
      title: w.title || '未命名作品',
      titleEn: w.category || '',
      category: w.category || '未分类',
      date: w.date || (w.created_at ? w.created_at.slice(0, 10) : ''),
      location: w.location || '',
      camera: w.camera || '',
      lens: w.lens || '',
      focal: w.focal || '',
      aperture: w.aperture || '',
      shutter: w.shutter || '',
      iso: w.iso || '',
      description: w.description || '',
      image: w.image_url || ''
    };
  }

  function loadRemoteWorks(cb) {
    var client = makeClient();
    if (!client) { if (cb) cb([]); return; }
    client.from('photos').select('*').eq('status', 'approved').order('created_at', { ascending: false }).limit(300)
      .then(function (res) {
        remoteWorks = (res.data || []).map(normalizeRemote);
        if (cb) cb(remoteWorks);
      })
      .catch(function () {
        remoteWorks = [];
        if (cb) cb(remoteWorks);
      });
  }

  /* ---------- 首页画廊 ---------- */
  var gallery = document.getElementById('gallery');
  if (gallery) {
    var filterButtons = document.querySelectorAll('.filter-btn');
    var activeFilter = 'all';

    function renderGallery() {
      var html = '';
      var list = remoteWorks;
      list.forEach(function (w) {
        if (activeFilter !== 'all' && w.category !== activeFilter) return;
        html +=
          '<a class="work-card" href="work.html#' + w.id + '">' +
          '  <figure class="work-card-figure">' +
          '    <img src="' + w.image + '" alt="' + w.title + '" loading="lazy">' +
          '  </figure>' +
          '  <div class="work-card-info">' +
          '    <h3>' + w.title + '</h3>' +
          '    <p>' + (w.titleEn || w.category) + ' · ' + w.category + '</p>' +
          '  </div>' +
          '</a>';
      });
      gallery.innerHTML = html || '<p class="dim">暂无作品。已上传并通过审核的作品会显示在这里。</p>';
    }

    filterButtons.forEach(function (btn) {
      btn.addEventListener('click', function () {
        filterButtons.forEach(function (b) { b.classList.remove('active'); });
        btn.classList.add('active');
        activeFilter = btn.getAttribute('data-filter');
        renderGallery();
      });
    });

    loadRemoteWorks(function () { renderGallery(); });
  }

  /* ---------- 作品详情页 ---------- */
  var detail = document.getElementById('detail');
  if (detail) {
    function allWorks() {
      return remoteWorks;
    }

    function findById(list, rawId) {
      for (var i = 0; i < list.length; i++) {
        if (String(list[i].id) === String(rawId)) return list[i];
      }
      return null;
    }

    function renderDetail() {
      var list = allWorks();
      if (!list.length) {
        detail.innerHTML = '<p class="dim">暂无作品。</p>';
        return;
      }
      var rawId = (location.hash || '').replace('#', '') || list[0].id;
      if (rawId.indexOf('work-') === 0) rawId = rawId.slice(5);
      var w = findById(list, rawId) || list[0];
      var idx = list.indexOf(w);
      var prev = list[(idx - 1 + list.length) % list.length];
      var next = list[(idx + 1) % list.length];

      var dimLine = [];
      if (w.date) dimLine.push('拍摄日期：' + w.date);
      if (w.location) dimLine.push('地点：' + w.location);
      dimLine = dimLine.join('　');

      detail.innerHTML =
        '<figure class="detail-figure">' +
        '  <img src="' + w.image + '" alt="' + w.title + '">' +
        '</figure>' +
        '<div class="detail-body">' +
        '  <div>' +
        '    <h1>' + w.title + '</h1>' +
        '    <p class="detail-en">' + (w.titleEn || w.category) + ' · ' + w.category + '</p>' +
        '    <p class="detail-desc">' + (w.description || '') + '</p>' +
        (dimLine ? '    <p class="dim">' + dimLine + '</p>' : '') +
        '  </div>' +
        '  <table class="exif-table">' +
        '    <tr><th>相机</th><td>' + (w.camera || '—') + '</td></tr>' +
        '    <tr><th>镜头</th><td>' + (w.lens || '—') + '</td></tr>' +
        '    <tr><th>焦距</th><td>' + (w.focal || '—') + '</td></tr>' +
        '    <tr><th>光圈</th><td>' + (w.aperture || '—') + '</td></tr>' +
        '    <tr><th>快门</th><td>' + (w.shutter || '—') + '</td></tr>' +
        '    <tr><th>ISO</th><td>' + (w.iso || '—') + '</td></tr>' +
        '  </table>' +
        '</div>' +
        '<div class="detail-nav">' +
        '  <a href="work.html#' + prev.id + '">← 上一张 · ' + prev.title + '</a>' +
        '  <a class="next" href="work.html#' + next.id + '">下一张 · ' + next.title + ' →</a>' +
        '</div>';

      document.title = w.title + ' · 光影集 · LUMEN';
      window.scrollTo(0, 0);
    }

    window.addEventListener('hashchange', renderDetail);
    loadRemoteWorks(function () { renderDetail(); });
  }

  /* ---------- 联系表单（静态演示） ---------- */
  var contactForm = document.getElementById('contactForm');
  if (contactForm) {
    var formMsg = document.getElementById('formMsg');
    contactForm.addEventListener('submit', function (e) {
      e.preventDefault();
      formMsg.textContent = '感谢留言！当前为静态演示站点，表单不会真正发送。请阅读 README.md，将表单接入 Formspree 等表单服务后即可正常接收消息。';
    });
  }
})();
