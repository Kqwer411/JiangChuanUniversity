/* 圣殿科学学会学院官网 — 交互脚本
   功能：移动端二级导航（mega menu）展开/收起、滚动渐入、折叠答疑。
   风格：仅克制的小动效，尊重「减少动态效果」系统偏好。 */
(function () {
  'use strict';
  // 标记 JS 可用，CSS 据此才启用「先隐藏再渐入」，避免无脚本时内容消失
  document.documentElement.classList.add('js');

  document.addEventListener('DOMContentLoaded', function () {

    /* ---------- 移动端 mega menu 展开/收起 ---------- */
    var toggle = document.querySelector('.subnav__toggle');
    var menu = document.querySelector('.megamenu');
    if (toggle && menu) {
      toggle.addEventListener('click', function () {
        var open = menu.classList.toggle('is-open');
        toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
      });
    }

    /* ---------- 滚动渐入（.reveal → .is-visible） ---------- */
    var reveals = document.querySelectorAll('.reveal');
    if ('IntersectionObserver' in window && reveals.length) {
      var io = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            io.unobserve(entry.target);
          }
        });
      }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
      reveals.forEach(function (el) { io.observe(el); });
    } else {
      reveals.forEach(function (el) { el.classList.add('is-visible'); });
    }

    /* ---------- 折叠答疑（accordion） ---------- */
    document.querySelectorAll('.accordion__head').forEach(function (head) {
      head.addEventListener('click', function () {
        var item = head.parentElement;
        var isOpen = item.classList.toggle('is-open');
        head.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
      });
    });

    /* ---------- 首页「我是…」身份导览标签切换 + 折叠答疑（CUHK guidance） ---------- */
    document.querySelectorAll('.guidance').forEach(function (g) {
      var tabs = g.querySelectorAll('.gtab');
      var panels = g.querySelectorAll('.guidance__panel');
      function collapseAll() {
        g.querySelectorAll('.qa__item.is-open').forEach(function (it) {
          it.classList.remove('is-open');
          var q = it.querySelector('.qa__q');
          if (q) q.setAttribute('aria-expanded', 'false');
        });
      }
      tabs.forEach(function (t) {
        t.addEventListener('click', function () {
          var id = t.getAttribute('data-g');
          tabs.forEach(function (x) { x.classList.remove('is-active'); });
          panels.forEach(function (p) { p.classList.remove('is-active'); });
          t.classList.add('is-active');
          var target = g.querySelector('.guidance__panel[data-g="' + id + '"]');
          if (target) target.classList.add('is-active');
          collapseAll(); // 切换身份时收起当前所有解答
        });
      });
      g.querySelectorAll('.qa__q').forEach(function (q) {
        q.addEventListener('click', function () {
          var item = q.parentElement;
          var isOpen = item.classList.toggle('is-open');
          q.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
        });
      });
    });

    /* ---------- 侧边索引栏高亮（全站通用规则） ----------
       仅当当前页面的文件名命中侧边菜单内某个链接（href 的文件名）时，
       才点亮对应子项（深色底 + 红色边框）；
       若当前页面不属于该侧边菜单分组（如学院简介、师资队伍等顶层直达页），
       则该组全部子项的高亮一律清空，杜绝复用其他页面遗留的选中标记。 */
    syncSidenav();
    initDynPagination();
  });

  function syncSidenav() {
    var current = (location.pathname.split('/').pop() || 'index.html')
      .split('?')[0].split('#')[0].toLowerCase();
    document.querySelectorAll('.sidenav').forEach(function (nav) {
      nav.querySelectorAll('a[href]').forEach(function (a) {
        var href = a.getAttribute('href').split('?')[0].split('#')[0];
        var file = href.split('/').pop().toLowerCase();
        a.classList.toggle('is-active', !!file && file === current);
      });
    });
  }

  /* ---------- 学院动态：分类分页（每类 5 条/页，多于 5 条才显示页码） ---------- */
  function initDynPagination() {
    var PER = 5;
    document.querySelectorAll('.dyn-category').forEach(function (cat) {
      var items = cat.querySelectorAll('.dyn-item');
      var pager = cat.querySelector('.dyn-pager');
      if (!pager || items.length <= PER) {
        if (pager && pager.parentNode) pager.parentNode.removeChild(pager);
        return;
      }
      var pages = Math.ceil(items.length / PER);
      var current = 0;
      function render() {
        items.forEach(function (it, i) {
          it.style.display = (i >= current * PER && i < (current + 1) * PER) ? '' : 'none';
        });
        pager.innerHTML = '';
        for (var p = 0; p < pages; p++) {
          (function (idx) {
            var b = document.createElement('button');
            b.type = 'button';
            b.className = 'dyn-page' + (idx === current ? ' is-active' : '');
            b.textContent = String(idx + 1);
            b.setAttribute('aria-label', '第 ' + (idx + 1) + ' 页');
            b.addEventListener('click', function () {
              current = idx;
              render();
              cat.scrollIntoView({ behavior: 'smooth', block: 'start' });
            });
            pager.appendChild(b);
          })(p);
        }
      }
      render();
    });
  }
})();
