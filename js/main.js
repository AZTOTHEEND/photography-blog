/* ===== 光影集 · LUMEN — 交互脚本 ===== */
(function () {
  'use strict';

  /* ---------- 动效环境探测 ---------- */
  var reduceMotion = !!(window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches);
  var supportsIO = typeof window.IntersectionObserver !== 'undefined';

  /* ---------- 移动端导航（展开/收起带过渡，由 CSS 承担） ---------- */
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

  /* ---------- 导航栏滚动状态：背景加深 + 轻微收缩 ---------- */
  var siteHeader = document.querySelector('.site-header');
  if (siteHeader) {
    var headerTicking = false;
    var syncHeader = function () {
      if (window.pageYOffset > 24) {
        siteHeader.classList.add('scrolled');
      } else {
        siteHeader.classList.remove('scrolled');
      }
      headerTicking = false;
    };
    window.addEventListener('scroll', function () {
      if (!headerTicking) {
        window.requestAnimationFrame(syncHeader);
        headerTicking = true;
      }
    }, { passive: true });
    syncHeader();
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
    var cardObserver = null;

    function cardMarkup(w, index) {
      var meta = (w.titleEn || w.category) + ' · ' + w.category;
      return '<a class="work-card" href="work.html#' + w.id + '" data-index="' + index + '">' +
        '  <figure class="work-card-figure">' +
        '    <img src="' + w.image + '" alt="' + w.title + '" loading="lazy">' +
        '    <span class="work-card-overlay">' +
        '      <span class="work-card-overlay-inner">' +
        '        <span class="overlay-title">' + w.title + '</span>' +
        '        <span class="overlay-cat">' + meta + '</span>' +
        '      </span>' +
        '    </span>' +
        '  </figure>' +
        '  <div class="work-card-info">' +
        '    <h3>' + w.title + '</h3>' +
        '    <p>' + meta + '</p>' +
        '  </div>' +
        '</a>';
    }

    /* 卡片滚动进入视口逐个渐入上浮（错峰延迟） */
    function revealGalleryCards() {
      var cards = gallery.querySelectorAll('.work-card');
      if (!cards.length) return;
      if (reduceMotion || !supportsIO) {
        for (var i = 0; i < cards.length; i++) cards[i].classList.add('in-view');
        return;
      }
      if (cardObserver) cardObserver.disconnect();
      cardObserver = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (!entry.isIntersecting) return;
          var el = entry.target;
          var idx = parseInt(el.getAttribute('data-index') || '0', 10);
          var delay = (idx % 6) * 70;
          el.style.transitionDelay = delay + 'ms';
          el.classList.add('in-view');
          cardObserver.unobserve(el);
          window.setTimeout(function () { el.style.transitionDelay = '0ms'; }, delay + 700);
        });
      }, { threshold: 0.12, rootMargin: '0px 0px -30px 0px' });
      for (var j = 0; j < cards.length; j++) cardObserver.observe(cards[j]);

      /* 兜底：若观察器回调未生效，视口内的卡片仍要可见 */
      window.setTimeout(function () {
        var pending = gallery.querySelectorAll('.work-card:not(.in-view)');
        for (var k = 0; k < pending.length; k++) {
          var rect = pending[k].getBoundingClientRect();
          if (rect.top < window.innerHeight && rect.bottom > 0) {
            pending[k].classList.add('in-view');
          }
        }
      }, 1200);
    }

    function renderGallery() {
      var html = '';
      var list = remoteWorks;
      list.forEach(function (w, i) {
        if (activeFilter !== 'all' && w.category !== activeFilter) return;
        html += cardMarkup(w, i);
      });
      gallery.innerHTML = html || '<p class="dim">暂无作品。已上传并通过审核的作品会显示在这里。</p>';
      revealGalleryCards();
    }

    filterButtons.forEach(function (btn) {
      btn.addEventListener('click', function () {
        var next = btn.getAttribute('data-filter');
        if (next === activeFilter) return;
        filterButtons.forEach(function (b) { b.classList.remove('active'); });
        btn.classList.add('active');
        activeFilter = next;
        if (reduceMotion) { renderGallery(); return; }
        /* 切换时淡出 → 重排 → 新卡片重新渐入 */
        gallery.classList.add('is-filtering');
        window.setTimeout(function () {
          renderGallery();
          void gallery.offsetWidth;
          gallery.classList.remove('is-filtering');
        }, 180);
      });
    });

    loadRemoteWorks(function () { renderGallery(); });
  }

  /* ---------- 作品详情页 ---------- */
  var detail = document.getElementById('detail');
  if (detail) {
    var detailFirstRender = true;

    function allWorks() {
      return remoteWorks;
    }

    function findById(list, rawId) {
      for (var i = 0; i < list.length; i++) {
        if (String(list[i].id) === String(rawId)) return list[i];
      }
      return null;
    }

    /* 大图加载完成后渐显 */
    function revealDetailImage() {
      var img = detail.querySelector('.detail-figure img');
      if (!img) return;
      if (img.complete && img.naturalWidth > 0) {
        img.classList.add('is-loaded');
      } else {
        img.addEventListener('load', function () { img.classList.add('is-loaded'); });
        img.addEventListener('error', function () { img.classList.add('is-loaded'); });
      }
    }

    function paintDetail() {
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
      revealDetailImage();
      window.scrollTo(0, 0);
    }

    /* 上一张/下一张切换：淡出 → 换内容 → 淡入 */
    function renderDetail() {
      if (detailFirstRender || reduceMotion) {
        detailFirstRender = false;
        paintDetail();
        return;
      }
      detail.classList.add('is-switching');
      window.setTimeout(function () {
        paintDetail();
        void detail.offsetWidth;
        detail.classList.remove('is-switching');
      }, 200);
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
