/* 校园内网 · 前端框架逻辑（纯静态，无后端）
 * 职责：登录态/身份判别（学生/教职工）、时间戳、操作日志埋点。
 * 说明：演示环境无真实鉴权，账号仅用于区分视图；所有操作留痕于本地便于线索预埋。
 */
(function () {
  "use strict";
  var INTRA = {
    KEY: "intra_session",
    LOG: "intra_ops",

    /* 登录：账号 + 密码（无注册）。学生账号以 S 开头，其余视为教职工。 */
    login: function (account, pwd) {
      account = (account || "").trim();
      if (!account) { alert("请输入账号"); return false; }
      var role = /^s/i.test(account) ? "student" : "faculty";
      var s = { account: account, role: role, t: new Date().toISOString() };
      sessionStorage.setItem(INTRA.KEY, JSON.stringify(s));
      location.href = "dashboard.html";
      return true;
    },

    logout: function () {
      sessionStorage.removeItem(INTRA.KEY);
      location.href = "index.html";
    },

    /* 页面守卫：未登录跳登录页；role 限制（all/student/faculty）不符亦跳回。 */
    guard: function (role) {
      var s = JSON.parse(sessionStorage.getItem(INTRA.KEY) || "null");
      if (!s) { location.href = "index.html"; return null; }
      if (role && role !== "all" && s.role !== role) {
        location.href = "login.html"; return null;
      }
      // 填充用户条
      var label = s.account + "（" + (s.role === "student" ? "学生" : "教职工") + "）";
      document.querySelectorAll("[data-user]").forEach(function (e) { e.textContent = label; });
      // 按身份显隐侧栏模块
      document.querySelectorAll(".in-nav a[data-role]").forEach(function (a) {
        var r = a.getAttribute("data-role");
        if (r === "all" || r === s.role) a.parentNode.style.display = "";
        else a.parentNode.style.display = "none";
      });
      // 日程双身份切换
      document.querySelectorAll("[data-role-sec]").forEach(function (sec) {
        sec.style.display = (sec.getAttribute("data-role-sec") === s.role) ? "" : "none";
      });
      // 仪表盘等处的身份感知卡片（data-show）
      document.querySelectorAll("[data-show]").forEach(function (el) {
        var r = el.getAttribute("data-show");
        el.style.display = (r === "all" || r === s.role) ? "" : "none";
      });
      // 同步时间戳
      document.querySelectorAll("[data-stamp]").forEach(function (e) {
        e.textContent = new Date().toLocaleString("zh-CN");
      });
      INTRA.log("访问页面：" + (document.title || location.pathname));
      return s;
    },

    /* 操作日志埋点：所有表单/按钮调用，便于后续线索植入。 */
    log: function (op) {
      try {
        var arr = JSON.parse(localStorage.getItem(INTRA.LOG) || "[]");
        arr.push({ t: new Date().toISOString(), op: op });
        localStorage.setItem(INTRA.LOG, JSON.stringify(arr));
      } catch (e) {}
    },

    /* 表单提交占位：仅记录日志，不真正发送（演示框架）。 */
    submit: function (op) {
      INTRA.log(op);
      alert("已提交（演示环境，仅留痕，不实际发送）。");
      return false;
    }
  };

  /* 侧栏折叠：切换 .is-collapsed 并持久化，跨页面保持。 */
  INTRA.toggleNav = function () {
    var shell = document.querySelector(".in-shell");
    if (!shell) return;
    var collapsed = shell.classList.toggle("is-collapsed");
    try { localStorage.setItem("intra_nav_collapsed", collapsed ? "1" : "0"); } catch (e) {}
    INTRA._navGlyph(shell);
  };

  INTRA._navGlyph = function (shell) {
    var t = shell.querySelector(".in-nav__toggle-ico");
    if (t) t.textContent = shell.classList.contains("is-collapsed") ? "»" : "«";
  };

  window.INTRA = INTRA;

  document.addEventListener("DOMContentLoaded", function () {
    var form = document.getElementById("login-form");
    if (form) {
      // 已登录则直接进入
      if (sessionStorage.getItem(INTRA.KEY)) { location.href = "dashboard.html"; return; }
      form.addEventListener("submit", function (e) {
        e.preventDefault();
        INTRA.login(form.account.value, form.pwd.value);
      });
    }
    var role = document.body.getAttribute("data-role");
    if (role) INTRA.guard(role);
    // 恢复侧栏折叠状态
    var shell = document.querySelector(".in-shell");
    if (shell) {
      var c = "";
      try { c = localStorage.getItem("intra_nav_collapsed"); } catch (e) {}
      if (c === "1") shell.classList.add("is-collapsed");
      INTRA._navGlyph(shell);
    }
  });
})();
