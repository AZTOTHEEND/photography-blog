/* ===== 光影集 · LUMEN — 上传脚本（Supabase） ===== */
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

  var form = document.getElementById('uploadForm');
  if (!form) return;
  var fileInput = document.getElementById('uploadFile');
  var preview = document.getElementById('uploadPreview');
  var msg = document.getElementById('uploadMsg');

  /* 图片本地预览 */
  fileInput.addEventListener('change', function () {
    preview.innerHTML = '';
    var file = fileInput.files[0];
    if (!file) return;
    var img = document.createElement('img');
    img.src = URL.createObjectURL(file);
    img.alt = '预览';
    preview.appendChild(img);
  });

  function setMsg(text, ok) {
    msg.textContent = text;
    msg.style.color = ok ? 'var(--accent)' : '#d08a8a';
  }

  /* ---------- 提交上传 ---------- */
  form.addEventListener('submit', async function (e) {
    e.preventDefault();
    if (!client) {
      setMsg('尚未配置 Supabase：请先在 js/config.js 中填写 SUPABASE_URL 与 SUPABASE_ANON_KEY（见 README.md）。', false);
      return;
    }

    var file = fileInput.files[0];
    if (!file) {
      setMsg('请先选择一张图片。', false);
      return;
    }

    var title = document.getElementById('uploadTitle').value.trim();
    if (!title) {
      setMsg('请填写作品标题。', false);
      return;
    }

    var submitBtn = form.querySelector('button[type="submit"]');
    submitBtn.disabled = true;
    submitBtn.textContent = '上传中…';
    setMsg('正在上传，请稍候…', true);

    try {
      /* 1. 上传图片到 Storage bucket: photos */
      var ext = (file.name.split('.').pop() || 'jpg').toLowerCase().replace(/[^a-z0-9]/g, '') || 'jpg';
      var objectName = 'u_' + Date.now() + '_' + Math.random().toString(36).slice(2, 8) + '.' + ext;
      var up = await client.storage.from('photos').upload(objectName, file, { contentType: file.type });
      if (up.error) throw new Error(up.error.message || '上传图片失败');

      var imageUrl = client.storage.from('photos').getPublicUrl(objectName).data.publicUrl;

      /* 2. 写入作品记录（status 固定为 pending，由 RLS 保证） */
      var record = {
        title: title,
        category: document.getElementById('uploadCategory').value,
        description: document.getElementById('uploadDesc').value.trim(),
        date: document.getElementById('uploadDate').value,
        location: document.getElementById('uploadLocation').value.trim(),
        camera: document.getElementById('uploadCamera').value.trim(),
        lens: document.getElementById('uploadLens').value.trim(),
        focal: document.getElementById('uploadFocal').value.trim(),
        aperture: document.getElementById('uploadAperture').value.trim(),
        shutter: document.getElementById('uploadShutter').value.trim(),
        iso: document.getElementById('uploadIso').value.trim(),
        image_url: imageUrl,
        status: 'pending'
      };
      var ins = await client.from('photos').insert(record);
      if (ins.error) {
        /* 记录写入失败时回滚已上传图片 */
        await client.storage.from('photos').remove([objectName]);
        throw new Error(ins.error.message || '写入记录失败');
      }

      setMsg('上传成功！作品已进入待审核状态，站主通过后即可在画廊展示。', true);
      form.reset();
      preview.innerHTML = '';
    } catch (err) {
      setMsg('上传失败：' + err.message, false);
    } finally {
      submitBtn.disabled = false;
      submitBtn.textContent = '提交审核';
    }
  });
})();
