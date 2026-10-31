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

  /* ---------- 首页画廊 ---------- */
  var gallery = document.getElementById('gallery');
  if (gallery) {
    var filterButtons = document.querySelectorAll('.filter-btn');
    var activeFilter = 'all';

    function renderGallery() {
      var html = '';
      WORKS.forEach(function (w) {
        if (activeFilter !== 'all' && w.category !== activeFilter) return;
        html +=
          '<a class="work-card" href="work.html#work-' + w.id + '">' +
          '  <figure class="work-card-figure">' +
          '    <img src="' + w.image + '" alt="' + w.title + '" loading="lazy">' +
          '  </figure>' +
          '  <div class="work-card-info">' +
          '    <h3>' + w.title + '</h3>' +
          '    <p>' + w.titleEn + ' · ' + w.category + '</p>' +
          '  </div>' +
          '</a>';
      });
      gallery.innerHTML = html || '<p class="dim">该分类下暂无作品。</p>';
    }

    filterButtons.forEach(function (btn) {
      btn.addEventListener('click', function () {
        filterButtons.forEach(function (b) { b.classList.remove('active'); });
        btn.classList.add('active');
        activeFilter = btn.getAttribute('data-filter');
        renderGallery();
      });
    });

    renderGallery();
  }

  /* ---------- 作品详情页 ---------- */
  var detail = document.getElementById('detail');
  if (detail) {
    function findWork(id) {
      for (var i = 0; i < WORKS.length; i++) {
        if (WORKS[i].id === id) return WORKS[i];
      }
      return null;
    }

    function renderDetail() {
      var raw = (location.hash || '').replace('#work-', '');
      var id = parseInt(raw, 10);
      var w = findWork(id) || WORKS[0];
      var idx = WORKS.indexOf(w);
      var prev = WORKS[(idx - 1 + WORKS.length) % WORKS.length];
      var next = WORKS[(idx + 1) % WORKS.length];

      detail.innerHTML =
        '<figure class="detail-figure">' +
        '  <img src="' + w.image + '" alt="' + w.title + '">' +
        '</figure>' +
        '<div class="detail-body">' +
        '  <div>' +
        '    <h1>' + w.title + '</h1>' +
        '    <p class="detail-en">' + w.titleEn + ' · ' + w.category + '</p>' +
        '    <p class="detail-desc">' + w.description + '</p>' +
        '    <p class="dim">拍摄日期：' + w.date + '　地点：' + w.location + '</p>' +
        '  </div>' +
        '  <table class="exif-table">' +
        '    <tr><th>相机</th><td>' + w.camera + '</td></tr>' +
        '    <tr><th>镜头</th><td>' + w.lens + '</td></tr>' +
        '    <tr><th>焦距</th><td>' + w.focal + '</td></tr>' +
        '    <tr><th>光圈</th><td>' + w.aperture + '</td></tr>' +
        '    <tr><th>快门</th><td>' + w.shutter + '</td></tr>' +
        '    <tr><th>ISO</th><td>' + w.iso + '</td></tr>' +
        '  </table>' +
        '</div>' +
        '<div class="detail-nav">' +
        '  <a href="work.html#work-' + prev.id + '">← 上一张 · ' + prev.title + '</a>' +
        '  <a class="next" href="work.html#work-' + next.id + '">下一张 · ' + next.title + ' →</a>' +
        '</div>';

      document.title = w.title + ' · 光影集 · LUMEN';
      window.scrollTo(0, 0);
    }

    window.addEventListener('hashchange', renderDetail);
    renderDetail();
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
