/* 江川大学 JIANGCHUAN UNIVERSITY — 公共交互层 (vanilla, no deps) */
(function () {
  "use strict";
  var $ = function (s, c) { return (c || document).querySelector(s); };
  var $$ = function (s, c) { return Array.prototype.slice.call((c || document).querySelectorAll(s)); };

  /* ---------- toast ---------- */
  function toast(msg, kind) {
    var wrap = $(".toast-wrap");
    if (!wrap) { wrap = document.createElement("div"); wrap.className = "toast-wrap"; document.body.appendChild(wrap); }
    var t = document.createElement("div");
    t.className = "toast " + (kind || "");
    t.textContent = msg;
    wrap.appendChild(t);
    setTimeout(function () { t.style.opacity = "0"; }, 2600);
    setTimeout(function () { if (t.parentNode) t.parentNode.removeChild(t); }, 3000);
  }

  /* ---------- reading progress ---------- */
  function initRP() {
    var rp = $(".reading-progress");
    if (!rp) return;
    function onScrollRP() {
      var h = document.documentElement;
      var max = h.scrollHeight - h.clientHeight;
      rp.style.width = (max > 0 ? (h.scrollTop / max) * 100 : 0) + "%";
    }
    window.addEventListener("scroll", onScrollRP, { passive: true });
    onScrollRP();
  }

  /* ---------- sticky shrink ---------- */
  function initHead() {
    var head = $(".page-head");
    if (!head) return;
    function onScrollHead() { head.classList.toggle("is-stuck", window.scrollY > 30); }
    window.addEventListener("scroll", onScrollHead, { passive: true });
    onScrollHead();
  }

  /* ---------- theme toggle ---------- */
  var THEME_KEY = "jc-theme";
  function applyTheme(v) {
    if (v === "dark") document.documentElement.setAttribute("data-theme", "dark");
    else document.documentElement.removeAttribute("data-theme");
  }
  applyTheme(localStorage.getItem(THEME_KEY));
  function initTheme() {
    $$(".js-theme-toggle").forEach(function (b) {
      if (b._bound) return; b._bound = true;
      b.addEventListener("click", function () {
        var dark = document.documentElement.getAttribute("data-theme") === "dark";
        var next = dark ? "light" : "dark";
        applyTheme(next);
        localStorage.setItem(THEME_KEY, next);
        toast(next === "dark" ? "已切换到夜间模式" : "已切换到日间模式");
      });
    });
  }

  /* ---------- language toggle ---------- */
  var LANG_KEY = "jc-lang";
  var EN_FALLBACK = "For detailed content, please refer to the Chinese version（详情请查阅中文页面）";
  function applyLang(v) {
    var lvl = parseInt(document.documentElement.getAttribute("data-page-level") || "1", 10);
    var main = document.querySelector(".page-main");
    if (v === "en" && lvl >= 4) {
      if (main && !main._zh) main._zh = main.innerHTML;
      if (main) main.innerHTML = '<div class="lang-fallback"><span class="en">English</span><p>' + EN_FALLBACK + '</p></div>';
      document.documentElement.lang = "en";
      return;
    }
    if (lvl >= 4 && main && main._zh) {
      main.innerHTML = main._zh; main._zh = null;
      document.documentElement.lang = "zh-CN";
      return;
    }
    $$("[data-en]").forEach(function (el) {
      if (!el._zh) el._zh = el.innerHTML;
      if (v === "en") {
        var html = el.getAttribute("data-en-html");
        el.innerHTML = (html !== null) ? html : el.getAttribute("data-en");
      } else {
        el.innerHTML = el._zh;
      }
    });
    document.documentElement.lang = v === "en" ? "en" : "zh-CN";
  }
  applyLang(localStorage.getItem(LANG_KEY) || "zh");
  function initLang() {
    $$(".js-lang-toggle").forEach(function (b) {
      if (b._bound) return; b._bound = true;
      b.addEventListener("click", function (e) {
        e.preventDefault();
        var cur = localStorage.getItem(LANG_KEY) || "zh";
        var next = cur === "en" ? "zh" : "en";
        localStorage.setItem(LANG_KEY, next);
        applyLang(next);
        toast(next === "en" ? "English version" : "已切换为中文");
      });
    });
  }

  /* ---------- mobile menu ---------- */
  function initMobileMenu() {
    var menuBtn = $(".js-menu-toggle");
    var mobileMenu = $(".mobile-menu");
    if (!menuBtn || !mobileMenu || menuBtn._bound) return;
    menuBtn._bound = true;
    menuBtn.addEventListener("click", function () {
      mobileMenu.classList.toggle("open");
      document.body.classList.toggle("no-scroll");
    });
    $$(".mn__caret", mobileMenu).forEach(function (c) {
      c.addEventListener("click", function () {
        var sub = c.parentNode.parentNode.querySelector(".mn__sub");
        if (sub) { sub.classList.toggle("open"); c.classList.toggle("open"); }
      });
    });
  }

  /* ---------- search panel ---------- */
  function initSearch() {
    var searchBtn = $(".js-search-toggle");
    var searchPanel = $(".search-panel");
    if (!searchBtn || !searchPanel || searchBtn._bound) return;
    searchBtn._bound = true;
    searchBtn.addEventListener("click", function (e) {
      e.preventDefault();
      searchPanel.classList.toggle("open");
      var input = searchPanel.querySelector("input");
      if (input && searchPanel.classList.contains("open")) setTimeout(function () { input.focus(); }, 50);
    });
    document.addEventListener("click", function (e) {
      if (searchPanel.classList.contains("open") && !searchPanel.contains(e.target) && !searchBtn.contains(e.target))
        searchPanel.classList.remove("open");
    });
  }

  /* ---------- gather dropdown ---------- */
  function initGather() {
    var gatherBtn = $(".js-gather-toggle");
    var gatherMenu = $(".gather-menu");
    if (!gatherBtn || !gatherMenu || gatherBtn._bound) return;
    gatherBtn._bound = true;
    gatherBtn.addEventListener("click", function (e) { e.preventDefault(); gatherMenu.classList.toggle("open"); });
    document.addEventListener("click", function (e) {
      if (!gatherMenu.contains(e.target)) gatherMenu.classList.remove("open");
    });
  }

  /* ---------- mega menu ---------- */
  function initMega() {
    $$(".mn__item.has-mega").forEach(function (item) {
      if (item._bound) return; item._bound = true;
      var link = $(".mn__link", item);
      if (link) link.addEventListener("click", function (e) {
        if (window.innerWidth > 980) {
          e.preventDefault();
          var was = item.classList.contains("open");
          $$(".mn__item.has-mega.open").forEach(function (o) { if (o !== item) o.classList.remove("open"); });
          item.classList.toggle("open", !was);
        }
      });
    });
    if (!document._megaDocBound) {
      document._megaDocBound = true;
      document.addEventListener("click", function (e) {
        if (!e.target.closest(".mn__item.has-mega")) $$(".mn__item.has-mega.open").forEach(function (o) { o.classList.remove("open"); });
      });
    }
  }

  /* ---------- hero slider ---------- */
  function initHero() {
    var root = $(".section-hero");
    if (!root || root._bound) return;
    root._bound = true;
    var slides = $$(".hero-slide", root);
    if (slides.length < 2) return;
    var DURATION = 6000, idx = 0, timer = null, prog = $(".hero-progress", root);
    var dotsWrap = $(".hero-dots", root);
    var dotEls = [];
    function paint() {
      slides.forEach(function (s, i) { s.style.opacity = i === idx ? "1" : "0"; s.style.display = i === idx ? "flex" : "none"; });
      dotEls.forEach(function (d, i) { d.classList.toggle("active", i === idx); });
      if (prog) { prog.classList.remove("run"); void prog.offsetWidth; prog.classList.add("run"); }
    }
    function go(n) { idx = (n + slides.length) % slides.length; paint(); }
    function next() { go(idx + 1); }
    function play() { clearTimeout(timer); timer = setTimeout(next, DURATION); }
    if (dotsWrap) {
      slides.forEach(function (_, i) {
        var b = document.createElement("button");
        b.setAttribute("aria-label", "第 " + (i + 1) + " 张");
        if (i === 0) b.className = "active";
        b.addEventListener("click", function () { go(i); play(); });
        dotsWrap.appendChild(b); dotEls.push(b);
      });
    }
    var prevBtn = $(".hero-arrow.prev", root), nextBtn = $(".hero-arrow.next", root);
    if (prevBtn) prevBtn.addEventListener("click", function () { go(idx - 1); play(); });
    if (nextBtn) nextBtn.addEventListener("click", function () { go(idx + 1); play(); });
    root.addEventListener("mouseenter", function () { root.classList.add("paused"); clearTimeout(timer); });
    root.addEventListener("mouseleave", function () { root.classList.remove("paused"); paint(); play(); });
    document.addEventListener("keydown", function (e) {
      if (e.key === "ArrowLeft") { go(idx - 1); play(); }
      else if (e.key === "ArrowRight") { go(idx + 1); play(); }
    });
    var sx = 0;
    root.addEventListener("touchstart", function (e) { sx = e.touches[0].clientX; }, { passive: true });
    root.addEventListener("touchend", function (e) {
      var dx = e.changedTouches[0].clientX - sx;
      if (Math.abs(dx) > 40) { dx < 0 ? go(idx + 1) : go(idx - 1); play(); }
    });
    paint(); play();
  }

  /* ---------- tabs ---------- */
  function initTabs() {
    $$(".tabs").forEach(function (tabs) {
      if (tabs._bound) return; tabs._bound = true;
      var btns = $$(".tabs__btn", tabs), panels = $$(".tabs__panel", tabs);
      btns.forEach(function (b, i) {
        b.addEventListener("click", function () {
          btns.forEach(function (x) { x.classList.remove("active"); });
          panels.forEach(function (p) { p.classList.remove("active"); });
          b.classList.add("active");
          var p = panels[i]; if (p) p.classList.add("active");
        });
      });
    });
  }

  /* ---------- accordion ---------- */
  function initAccordion() {
    $$(".accordion").forEach(function (acc) {
      if (acc._bound) return; acc._bound = true;
      $$(".accordion__head", acc).forEach(function (h) {
        h.addEventListener("click", function () {
          var item = h.parentNode;
          var body = $(".accordion__body", item);
          var open = item.classList.toggle("open");
          if (body) body.style.maxHeight = open ? body.scrollHeight + "px" : "0px";
        });
      });
    });
  }

  /* ---------- modal ---------- */
  function initModal() {
    if (document._modalBound) return;
    document._modalBound = true;
    function openModal(id, fill) {
      var m = document.getElementById(id);
      if (!m) return;
      if (fill) fill(m);
      m.classList.add("open");
      document.body.classList.add("no-scroll");
    }
    function closeModal(m) { m.classList.remove("open"); document.body.classList.remove("no-scroll"); }
    document.addEventListener("click", function (e) {
      var opener = e.target.closest("[data-modal-open]");
      if (opener) {
        e.preventDefault();
        var id = opener.getAttribute("data-modal-open");
        openModal(id, function (m) {
          var title = opener.getAttribute("data-title"), body = opener.getAttribute("data-body");
          if (title) { var h = $(".modal__head h3", m); if (h) h.textContent = title; }
          if (body) { var b = $(".modal__body", m); if (b) b.innerHTML = body; }
        });
        return;
      }
      if (e.target.closest(".modal__close") || e.target.classList.contains("modal__backdrop")) {
        var md = e.target.closest(".modal"); if (md) closeModal(md);
      }
    });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape") $$(".modal.open").forEach(closeModal);
    });
  }

  /* ---------- forms ---------- */
  function initForms() {
    $$("form[data-validate]").forEach(function (form) {
      if (form._bound) return; form._bound = true;
      form.addEventListener("submit", function (e) {
        e.preventDefault();
        var ok = true;
        $$(".field", form).forEach(function (f) {
          var input = f.querySelector("input,textarea,select");
          if (!input) return;
          var v = input.value.trim();
          var bad = false;
          if (input.hasAttribute("required") && !v) bad = true;
          if (!bad && input.type === "email" && v && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v)) bad = true;
          f.classList.toggle("has-error", bad);
          if (bad) ok = false;
        });
        if (!ok) { toast("请检查表单中标红的必填项", "err"); return; }
        var succ = $(".form-success", form);
        if (succ) succ.classList.add("show");
        form.querySelectorAll("input,textarea,select").forEach(function (i) { i.value = ""; });
        toast("提交成功，我们会尽快与您联系！", "ok");
      });
    });
  }

  /* ---------- newsletter ---------- */
  function initSubscribe() {
    $$(".subscribe").forEach(function (form) {
      if (form._bound) return; form._bound = true;
      form.addEventListener("submit", function (e) {
        e.preventDefault();
        var input = form.querySelector("input[type=email]");
        var v = input ? input.value.trim() : "";
        if (!v || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v)) {
          form.classList.add("has-error"); toast("请输入有效的邮箱地址", "err"); return;
        }
        form.classList.remove("has-error");
        toast("订阅成功，江川动态将发送至您的邮箱", "ok");
        input.value = "";
      });
    });
  }

  /* ---------- filter bar ---------- */
  function initFilter() {
    $$(".filterbar").forEach(function (bar) {
      if (bar._bound) return; bar._bound = true;
      var target = bar.getAttribute("data-target");
      var items = target ? $$(target + " [data-cat]") : [];
      $$(".filterbar__btn", bar).forEach(function (b) {
        b.addEventListener("click", function () {
          $$(".filterbar__btn", bar).forEach(function (x) { x.classList.remove("active"); });
          b.classList.add("active");
          var cat = b.getAttribute("data-cat");
          items.forEach(function (it) {
            it.classList.toggle("hidden", cat !== "all" && it.getAttribute("data-cat") !== cat);
          });
        });
      });
    });
  }

  /* ---------- count-up ---------- */
  function animateCount(el) {
    var to = parseFloat(el.getAttribute("data-to"));
    if (isNaN(to)) return;
    var suffix = el.getAttribute("data-suffix") || "";
    var prefix = el.getAttribute("data-prefix") || "";
    var dur = 1400, start = null;
    function step(ts) {
      if (!start) start = ts;
      var p = Math.min((ts - start) / dur, 1);
      var eased = 1 - Math.pow(1 - p, 3);
      var val = Math.floor(eased * to);
      el.textContent = prefix + val.toLocaleString("en-US") + suffix;
      if (p < 1) requestAnimationFrame(step);
      else el.textContent = prefix + to.toLocaleString("en-US") + suffix;
    }
    requestAnimationFrame(step);
  }
  function initCount() {
    var counters = $$(".count-up");
    if (!counters.length) return;
    if (counters[0]._bound) return;
    counters[0]._bound = true;
    if ("IntersectionObserver" in window) {
      var io = new IntersectionObserver(function (entries) {
        entries.forEach(function (en) {
          if (en.isIntersecting) { animateCount(en.target); io.unobserve(en.target); }
        });
      }, { threshold: 0.4 });
      counters.forEach(function (c) { io.observe(c); });
    } else { counters.forEach(animateCount); }
  }

  /* ---------- copy ---------- */
  function initCopy() {
    $$(".copy-btn").forEach(function (btn) {
      if (btn._bound) return; btn._bound = true;
      btn.addEventListener("click", function () {
        var txt = btn.getAttribute("data-copy") || btn.textContent;
        var done = function () {
          var old = btn.innerHTML; btn.classList.add("done");
          btn.innerHTML = "✓ 已复制"; setTimeout(function () { btn.classList.remove("done"); btn.innerHTML = old; }, 1500);
        };
        if (navigator.clipboard && navigator.clipboard.writeText) {
          navigator.clipboard.writeText(txt).then(done, done);
        } else { done(); }
        toast("已复制到剪贴板", "ok");
      });
    });
  }

  /* ---------- smooth anchor ---------- */
  function initAnchor() {
    if (document._anchorBound) return;
    document._anchorBound = true;
    $$('a[href^="#"]').forEach(function (a) {
      a.addEventListener("click", function (e) {
        var id = a.getAttribute("href");
        if (id.length > 1) {
          var t = document.getElementById(id.slice(1));
          if (t) { e.preventDefault(); t.scrollIntoView({ behavior: "smooth", block: "start" }); }
        }
      });
    });
  }

  /* ---------- back to top ---------- */
  function initTop() {
    var topBtn = $(".btn-top");
    if (!topBtn || topBtn._bound) return;
    topBtn._bound = true;
    window.addEventListener("scroll", function () { topBtn.classList.toggle("show", window.scrollY > 500); }, { passive: true });
    topBtn.addEventListener("click", function () { window.scrollTo({ top: 0, behavior: "smooth" }); });
  }

  /* ---------- year ---------- */
  function initYear() {
    var y = $(".js-year");
    if (y) y.textContent = new Date().getFullYear();
  }

  /* ---------- reveal ---------- */
  function initReveal() {
    var revealEls = $$("[data-reveal]");
    if (!revealEls.length) return;
    if (revealEls[0]._bound) return;
    revealEls[0]._bound = true;
    if ("IntersectionObserver" in window) {
      var io = new IntersectionObserver(function (entries) {
        entries.forEach(function (en) {
          if (en.isIntersecting) { en.target.classList.add("is-visible"); io.unobserve(en.target); }
        });
      }, { threshold: 0.12 });
      revealEls.forEach(function (el, i) {
        el.style.opacity = "0"; el.style.transform = "translateY(24px)";
        el.style.transition = "opacity .7s ease " + (i % 6) * 60 + "ms, transform .7s ease " + (i % 6) * 60 + "ms";
        io.observe(el);
      });
    }
  }

  /* ---------- site search ---------- */
  function initSiteSearch() {
    var box = $(".site-search");
    if (!box || box._bound) return;
    box._bound = true;
    var input = $(".site-search__input", box);
    var results = $(".search-results", box);
    var meta = $(".search-meta", box);
    var data = (window.SITE_INDEX || []);
    function q() { return (new URLSearchParams(location.search).get("q") || input.value || "").trim().toLowerCase(); }
    function render() {
      var term = q();
      if (!term) {
        results.innerHTML = data.slice(0, 8).map(function (d) {
          return '<li><a href="' + d.u + '">' + d.t + '</a><div class="ex">' + d.k + '</div></li>';
        }).join("");
        meta.textContent = "输入关键词检索全校网站栏目。" + data.length + " 个栏目可检索。";
        return;
      }
      var hits = data.filter(function (d) {
        return (d.t + " " + d.k + " " + (d.cat || "")).toLowerCase().indexOf(term) > -1;
      });
      if (!hits.length) { results.innerHTML = '<li>未找到与"' + term + '"相关的栏目。试试"学院""招生""研究""新闻"。</li>'; meta.textContent = ""; return; }
      results.innerHTML = hits.map(function (d) {
        return '<li><a href="' + d.u + '">' + d.t + '</a><div class="ex">' + d.k + '</div></li>';
      }).join("");
      meta.textContent = "找到 " + hits.length + " 个相关栏目。";
    }
    input.addEventListener("input", render);
    box.querySelector("form").addEventListener("submit", function (e) { e.preventDefault(); render(); });
    render();
  }

  /* ---------- 主初始化 ---------- */
  function initAll() {
    initRP(); initHead(); initTheme(); initLang(); initMobileMenu();
    initSearch(); initGather(); initMega(); initHero(); initTabs();
    initAccordion(); initModal(); initForms(); initSubscribe(); initFilter();
    initCount(); initCopy(); initAnchor(); initTop(); initYear();
    initReveal(); initSiteSearch();
  }

  // 暴露公共初始化函数，供页面手动调用
  window.initCommonInteractions = initAll;
  window.JCU = { toast: toast };

  /* ---------- 自动加载 header/footer（双模式：components.js 优先，fetch 后备） ---------- */
  var _inited = false;
  function doInit() {
    if (_inited) return;
    _inited = true;
    initAll();
    if (typeof window.pageInit === "function") window.pageInit();
  }

  function injectComponents() {
    var hBox = document.getElementById("header-box");
    var fBox = document.getElementById("footer-box");

    // 模式1：components.js 已预载 HTML（file:// 兼容，<script> 不受 CORS 限制）
    if (window.HEADER_HTML && hBox && !hBox.querySelector(".page-head")) {
      hBox.innerHTML = window.HEADER_HTML;
    }
    if (window.FOOTER_HTML && fBox && !fBox.querySelector(".page-foot")) {
      fBox.innerHTML = window.FOOTER_HTML;
    }

    var hReady = hBox && hBox.querySelector(".page-head");
    var fReady = fBox && fBox.querySelector(".page-foot");

    if (hReady && fReady) {
      doInit();
      return;
    }

    // 模式2：fetch 后备（http:// 环境下 components.js 缺失时使用）
    var tasks = [];
    if (hBox && !hReady) {
      tasks.push(fetch("./header.html").then(function (r) { return r.text(); }).then(function (html) {
        hBox.innerHTML = html;
      }).catch(function (e) { console.warn("header.html 加载失败:", e); }));
    }
    if (fBox && !fReady) {
      tasks.push(fetch("./footer.html").then(function (r) { return r.text(); }).then(function (html) {
        fBox.innerHTML = html;
      }).catch(function (e) { console.warn("footer.html 加载失败:", e); }));
    }
    if (tasks.length) {
      Promise.all(tasks).then(doInit);
    }
  }

  document.addEventListener("DOMContentLoaded", injectComponents);
})();
