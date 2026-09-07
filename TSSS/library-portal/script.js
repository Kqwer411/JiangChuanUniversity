/* =========================================================
   江川大学图书馆 · 川流藏书馆  交互脚本
   纯前端，无外部依赖。全部数据硬编码于此。
   ========================================================= */
(function () {
  'use strict';

  /* ===================== 数据 ===================== */

  // 预设账号：学生 / 教职工 / 管理员
  var ACCOUNTS = {
    '17958330': { id: '17958330', name: '陈奇', role: 'staff', pwd: '77399396' },
    's9479697': { id: 's9479697', name: '林幽幻', role: 'student', pwd: '24979594' },
    'admin':    { id: 'admin',    name: '系统管理员', role: 'admin', pwd: '' }
  };
  // 管理员动态密钥（硬编码验证值，每30秒刷新显示）
  var ADMIN_KEY = '774921';

  // 陈奇 · 借阅历史（12条）
  var BORROW_CHEN = [
    { title:'灵界通道构造论', author:'佚名', borrow:'2022-03-15', back:'2022-04-20', method:'线上预约', status:'已归还' },
    { title:'阵法基座与能量节点', author:'周叙', borrow:'2022-03-20', back:'2022-05-10', method:'线下借阅', status:'已归还' },
    { title:'古代献祭仪式考', author:'佚名', borrow:'2022-03-25', back:'2022-04-22', method:'线上预约', status:'已归还' },
    { title:'献祭仪式参数修正草案', author:'（内部资料）', borrow:'2022-04-01', back:'—', method:'线上预约', status:'遗失' },
    { title:'通灵与意识操控边界研究', author:'苏清晏', borrow:'2022-04-10', back:'2022-05-15', method:'线下借阅', status:'已归还' },
    { title:'能量回路与节点共振', author:'季时纾', borrow:'2022-05-05', back:'2022-06-20', method:'线上预约', status:'已归还' },
    { title:'伪神崇拜与灵能污染', author:'陈奇（自藏）', borrow:'2022-06-12', back:'2022-07-18', method:'线下借阅', status:'已归还' },
    { title:'秘境空间稳定性评估', author:'谢聿之', borrow:'2022-08-20', back:'2022-09-25', method:'线上预约', status:'已归还' },
    { title:'古籍修复与保护技术', author:'图书馆编', borrow:'2023-01-10', back:'2023-02-14', method:'线下借阅', status:'已归还' },
    { title:'高阶阵法理论', author:'孟昭珩', borrow:'2023-06-15', back:'2023-08-01', method:'线上预约', status:'已归还' },
    { title:'跨界灵能研究综述', author:'沈知可', borrow:'2024-09-01', back:'2025-03-01（预计）', method:'线上预约', status:'已借出' },
    { title:'量子与灵能的并行性', author:'双修中心', borrow:'2025-01-15', back:'2025-02-20', method:'自助借还', status:'已归还' }
  ];

  // 林幽幻 · 借阅历史（8条）
  var BORROW_LIN = [
    { title:'占卜与通灵基础', author:'苏清晏', borrow:'2022-02-10', back:'2022-03-01', method:'线下借阅', status:'已归还' },
    { title:'星象与命运推演', author:'苏清晏', borrow:'2022-03-01', back:'2022-03-28', method:'线上预约', status:'已归还' },
    { title:'古灵界通道石刻抄本', author:'佚名', borrow:'2022-04-05', back:'2022-05-15', method:'线上预约', status:'已归还' },
    { title:'灵界铭文考', author:'孟昭珩', borrow:'2022-04-12', back:'—', method:'线上预约', status:'破损' },
    { title:'神谕与占卜交叉研究', author:'季时纾', borrow:'2022-05-20', back:'2022-06-25', method:'线下借阅', status:'已归还' },
    { title:'秘境原生元素观测', author:'谢聿之', borrow:'2022-07-08', back:'2022-08-12', method:'线上预约', status:'已归还' },
    { title:'古代魔法文明断代史', author:'陈奇', borrow:'2023-02-14', back:'2023-03-20', method:'线下借阅', status:'已归还' },
    { title:'灵能场域与个人精神力', author:'苏清晏', borrow:'2023-09-01', back:'2024-03-01（预计）', method:'线上预约', status:'已借出' }
  ];

  // 研讨室预约历史
  var BOOKING_CHEN = [
    { date:'2022-03-18', room:'#8', time:'14:00-21:00', purpose:'阵法课题小组研讨', note:'' },
    { date:'2022-04-03', room:'#8', time:'09:00-22:00', purpose:'阵法课题小组研讨', note:'「仪式参数校验……预留后手」（半行被删除的文字碎片）' },
    { date:'2022-04-10', room:'#8', time:'13:00-20:00', purpose:'阵法课题小组研讨', note:'' }
  ];
  var BOOKING_LIN = [
    { date:'2022-04-02', room:'#7', time:'14:00-18:00', purpose:'占卜文献研读', note:'' },
    { date:'2022-04-09', room:'#8', time:'10:00-17:00', purpose:'查阅古灵界通道石刻抄本', note:'' }
  ];

  // 荐购历史
  var RECOMMEND_LIN = [
    { name:'灵界铭文考', type:'图书', date:'2022-03-25', status:'已采购' }
  ];

  var BORROW_HISTORY = { '17958330': BORROW_CHEN, 's9479697': BORROW_LIN };
  var BOOKING_HISTORY = { '17958330': BOOKING_CHEN, 's9479697': BOOKING_LIN };
  var RECOMMEND_HISTORY = { 's9479697': RECOMMEND_LIN };

  // 书目目录（普通检索可见，hidden 仅高级检索精确匹配可见）
  var BOOKS = [
    { id:'b01', title:'灵界通道构造论', author:'佚名', category:'古籍', publisher:'圣殿手稿社', year:1988, location:'资料档案室', status:'ok', borrower:'陈奇（17958330）·2022-03-15' },
    { id:'b02', title:'星象与命运推演', author:'苏清晏', category:'图书', publisher:'江川大学出版社', year:2019, location:'川流藏书馆', status:'out', returnDate:'2026-09-10', borrower:'林幽幻（s9479697）·2022-03-01' },
    { id:'b03', title:'高阶阵法理论', author:'孟昭珩', category:'图书', publisher:'灵能出版社', year:2021, location:'川流藏书馆', status:'ok', borrower:'陈奇（17958330）·2023-06-15' },
    { id:'b04', title:'古灵界通道石刻抄本', author:'佚名', category:'古籍', publisher:'圣殿手稿社', year:1955, location:'资料档案室', status:'broken', borrower:'林幽幻（s9479697）·2022-04-05' },
    { id:'b05', title:'量子与灵能的并行性', author:'双修中心', category:'图书', publisher:'江川大学出版社', year:2024, location:'川流藏书馆', status:'ok', borrower:'陈奇（17958330）·2025-01-15' },
    { id:'b06', title:'灵能场域与个人精神力', author:'苏清晏', category:'期刊', publisher:'灵学研究社', year:2023, location:'川流藏书馆', status:'out', returnDate:'2026-08-30', borrower:'林幽幻（s9479697）·2023-09-01' },
    { id:'b07', title:'阵法基座与能量节点', author:'周叙', category:'图书', publisher:'灵能出版社', year:2017, location:'川流藏书馆', status:'ok', borrower:'陈奇（17958330）·2022-03-20' },
    { id:'b08', title:'古代献祭仪式考', author:'佚名', category:'图书', publisher:'圣殿手稿社', year:1990, location:'资料档案室', status:'ok', borrower:'陈奇（17958330）·2022-03-25' },
    { id:'b09', title:'献祭仪式参数修正草案', author:'（内部资料）', category:'图书', publisher:'圣殿科学学会', year:2018, location:'资料档案室', status:'lost', borrower:'陈奇（17958330）·2022-04-01' },
    { id:'b10', title:'通灵与意识操控边界研究', author:'苏清晏', category:'图书', publisher:'灵学研究社', year:2020, location:'川流藏书馆', status:'ok', borrower:'陈奇（17958330）·2022-04-10' },
    { id:'b11', title:'能量回路与节点共振', author:'季时纾', category:'图书', publisher:'灵能出版社', year:2019, location:'川流藏书馆', status:'ok', borrower:'陈奇（17958330）·2022-05-05' },
    { id:'b12', title:'伪神崇拜与灵能污染', author:'陈奇（自藏）', category:'图书', publisher:'自印本', year:2016, location:'川流藏书馆', status:'ok', borrower:'陈奇（17958330）·2022-06-12' },
    { id:'b13', title:'秘境空间稳定性评估', author:'谢聿之', category:'图书', publisher:'江川大学出版社', year:2021, location:'川流藏书馆', status:'ok', borrower:'陈奇（17958330）·2022-08-20' },
    { id:'b14', title:'古籍修复与保护技术', author:'图书馆编', category:'图书', publisher:'江川大学出版社', year:2022, location:'川流藏书馆', status:'ok', borrower:'陈奇（17958330）·2023-01-10' },
    { id:'b15', title:'跨界灵能研究综述', author:'沈知可', category:'期刊', publisher:'灵学研究社', year:2023, location:'川流藏书馆', status:'out', returnDate:'2026-09-20', borrower:'陈奇（17958330）·2024-09-01' },
    { id:'b16', title:'占卜与通灵基础', author:'苏清晏', category:'图书', publisher:'灵学研究社', year:2018, location:'川流藏书馆', status:'ok', borrower:'林幽幻（s9479697）·2022-02-10' },
    { id:'b17', title:'灵界铭文考', author:'孟昭珩', category:'图书', publisher:'圣殿手稿社', year:1992, location:'资料档案室', status:'broken', borrower:'林幽幻（s9479697）·2022-04-12' },
    { id:'b18', title:'神谕与占卜交叉研究', author:'季时纾', category:'图书', publisher:'灵能出版社', year:2020, location:'川流藏书馆', status:'ok', borrower:'林幽幻（s9479697）·2022-05-20' },
    { id:'b19', title:'秘境原生元素观测', author:'谢聿之', category:'图书', publisher:'江川大学出版社', year:2021, location:'川流藏书馆', status:'ok', borrower:'林幽幻（s9479697）·2022-07-08' },
    { id:'b20', title:'古代魔法文明断代史', author:'陈奇', category:'图书', publisher:'自印本', year:2015, location:'川流藏书馆', status:'ok', borrower:'林幽幻（s9479697）·2023-02-14' },
    { id:'b21', title:'江川大学学位论文数据库', author:'图书馆编', category:'电子资源', publisher:'江川大学出版社', year:2025, location:'川流藏书馆', status:'ok' },
    { id:'b22', title:'灵学研究全文数据库', author:'灵学研究社', category:'电子资源', publisher:'灵学研究社', year:2024, location:'川流藏书馆', status:'ok' },
    { id:'b23', title:'寂古秘录·残章', author:'佚名', category:'古籍特藏', publisher:'圣殿手稿社', year:1897, location:'资料档案室', status:'internal', hidden:true }
  ];

  // 特藏资源目录
  var SPECIAL = [
    { code:'TSS-ARCH-001', title:'圣殿科学学会创院档案（1953-1965）', status:'公开' },
    { code:'TSS-ARCH-002', title:'第八号研讨室地基结构勘察报告（2001）', status:'内部' },
    { code:'TSS-ARCH-003', title:'献祭仪式参数修正草案（2022）', status:'受限' },
    { code:'TSS-ARCH-004', title:'古灵界通道观测记录（1978-1995）', status:'内部' },
    { code:'TSS-ARCH-005', title:'阵法基座能量节点分布图', status:'受限' }
  ];

  // 新闻公告
  var NEWS = [
    { date:'2026-06-20', title:'2026年暑假期间图书馆开放时间调整', summary:'暑假期间川流藏书馆开放时间调整为 08:30-18:00，资料档案室另行安排，请留意馆内通知。' },
    { date:'2026-07-01', title:'资料档案室新到馆藏目录已上线', summary:'圣殿科学学会学院资料档案室新增文献目录现已开放检索，欢迎师生查阅。' },
    { date:'2022-04-15', title:'关于8号研讨室地面维护修缮的通知', summary:'8号研讨室因地面维护，暂停对外开放，恢复时间另行通知。' }
  ];

  // 馆员名册
  var STAFF = [
    { name:'陆明远', title:'馆长', email:'lmy@jcu.edu.cn', subject:'全面管理' },
    { name:'沈知可', title:'副馆长 / 学科馆员', email:'szk@jcu.edu.cn', subject:'灵能学、跨界研究' },
    { name:'苏清晏', title:'参考咨询馆员', email:'sqy@jcu.edu.cn', subject:'占卜与通灵、星象学' },
    { name:'季时纾', title:'采编馆员', email:'jss@jcu.edu.cn', subject:'阵法理论、神谕研究' },
    { name:'谢聿之', title:'特藏与古籍馆员', email:'xsz@jcu.edu.cn', subject:'古籍修复、秘境文献' },
    { name:'孟昭珩', title:'信息素养培训馆员', email:'mzh@jcu.edu.cn', subject:'铭文学、信息检索' },
    { name:'周叙', title:'系统与技术支持', email:'zx@jcu.edu.cn', subject:'图书馆系统、数据库' },
    { name:'陈澜', title:'流通服务馆员', email:'cl@jcu.edu.cn', subject:'借阅服务、空间管理' }
  ];

  // 新书通报
  var NEW_BOOKS = [
    { title:'量子与灵能的并行性', author:'双修中心', publisher:'江川大学出版社', year:2024, note:'探讨现代量子理论与古典灵能框架的交叉。' },
    { title:'跨界灵能研究综述', author:'沈知可', publisher:'灵学研究社', year:2023, note:'系统梳理近十年跨界灵能研究进展。' },
    { title:'灵学研究全文数据库', author:'灵学研究社', publisher:'灵学研究社', year:2024, note:'收录灵学领域核心期刊与学位论文。' },
    { title:'江川大学学位论文数据库', author:'图书馆编', publisher:'江川大学出版社', year:2025, note:'本校历年学位论文数字化典藏。' },
    { title:'古籍修复与保护技术', author:'图书馆编', publisher:'江川大学出版社', year:2022, note:'古籍修复流程与实操指南。' },
    { title:'秘境空间稳定性评估', author:'谢聿之', publisher:'江川大学出版社', year:2021, note:'秘境空间测绘与稳定性评估方法。' }
  ];

  // 电子资源（数据库 A-Z，纯文本）
  var ERESOURCES = [
    { name:'CNKI 中国知网学术总库', cat:'综合', desc:'中文学术期刊、博硕论文、会议论文全文。' },
    { name:'EBSCO 学术数据库', cat:'综合', desc:'外文学术期刊、商业、教育类文献。' },
    { name:'JCR 期刊引证报告', cat:'评价', desc:'期刊影响因子与分区查询。' },
    { name:'江川大学学位论文数据库', cat:'本校', desc:'本校历年学位论文数字化典藏。' },
    { name:'灵学研究全文数据库', cat:'专题', desc:'灵学领域核心期刊与学位论文。' },
    { name:'Web of Science 核心合集', cat:'综合', desc:'国际权威引文索引数据库。' },
    { name:'万方数据知识服务平台', cat:'综合', desc:'中文期刊、学位、会议、标准文献。' },
    { name:'超星电子书', cat:'图书', desc:'海量中文电子图书在线阅读。' }
  ];

  // 设施
  var FACILITIES = [
    { name:'自助借还机', desc:'位于川流藏书馆一层大厅，支持自助借书、还书、续借，全天候可用。' },
    { name:'复印打印', desc:'馆内设有文印区，支持校园卡自助复印、打印与扫描。' },
    { name:'Wi-Fi', desc:'全馆覆盖校园无线网，凭统一身份认证账号登录使用。' },
    { name:'充电桩', desc:'研讨区与自习区配备手机与笔记本充电桩，免费使用。' }
  ];

  // 研讨室
  var STUDY_ROOMS = [
    { no:'#1', cap:'4 人', fac:'白板、显示屏、Wi-Fi' },
    { no:'#2', cap:'4 人', fac:'白板、显示屏、Wi-Fi' },
    { no:'#3', cap:'6 人', fac:'白板、投影、Wi-Fi' },
    { no:'#4', cap:'6 人', fac:'白板、投影、Wi-Fi' },
    { no:'#5', cap:'8 人', fac:'显示屏、会议桌、Wi-Fi' },
    { no:'#6', cap:'8 人', fac:'显示屏、会议桌、Wi-Fi' },
    { no:'#7', cap:'10 人', fac:'投影、白板、研讨桌、Wi-Fi', special:true },
    { no:'#8', cap:'12 人', fac:'投影、白板、设备接口、Wi-Fi', special:true }
  ];

  // FAQ
  var FAQ = [
    { q:'如何办理借书证？', a:'本校师生凭校园一卡通（统一身份认证账号）即可直接借阅，无需单独办理借书证。校外读者请至咨询台办理临时阅览证。' },
    { q:'逾期归还如何罚款？', a:'川流藏书馆逾期费为 0.20 元/册/天，资料档案室为 0.50 元/册/天，上限 20 元/册。遗失或严重破损按原书价 3 倍赔偿。' },
    { q:'如何续借图书？', a:'登录【我的图书馆】后，在借阅记录中点击续借；每册可续借 1 次，续期 30 天。到期前 3 天起可申请，逾期图书不可续借。' },
    { q:'研讨室如何预约？', a:'目前研讨室预约系统正在升级维护，新预约暂不支持提交，历史预约记录可在登录后【我的图书馆—预约历史】中查阅。' }
  ];

  var FEEDBACK_TYPES = ['意见改进', '建议', '遇到问题', '其他'];

  /* ===================== 工具 ===================== */
  function $(s, r) { return (r || document).querySelector(s); }
  function $all(s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); }
  function esc(s) {
    return String(s == null ? '' : s).replace(/[&<>"]/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c];
    });
  }
  function getState() {
    try { var raw = sessionStorage.getItem('library_user'); return raw ? JSON.parse(raw) : null; }
    catch (e) { return null; }
  }
  function isAdmin() { var u = getState(); return !!(u && u.role === 'admin'); }

  function statusTag(st) {
    switch (st) {
      case 'ok': return '<span class="tag tag-ok">可借</span>';
      case 'out': return '<span class="tag tag-out">已借出</span>';
      case 'lost': return '<span class="tag tag-lost">遗失</span>';
      case 'broken': return '<span class="tag tag-broken">破损</span>';
      case 'internal': return '<span class="tag tag-internal">内部阅览</span>';
      default: return '<span class="tag">' + esc(st) + '</span>';
    }
  }

  function bookCardHTML(b, showBorrower) {
    var extra = '';
    if (b.status === 'out' && b.returnDate) extra += '<div class="book-card__meta">预计归还：' + esc(b.returnDate) + '</div>';
    if (b.status === 'broken') extra += '<a class="book-card__meta" href="damaged-guide.html" style="color:var(--st-broken);font-weight:600">联系馆员 →</a>';
    var borrower = '';
    if (showBorrower && b.borrower) borrower = '<div class="book-card__borrower">曾借阅者：' + esc(b.borrower) + '</div>';
    return '<div class="book-card">' +
      '<div class="book-card__cover">【封面】</div>' +
      '<div class="book-card__body">' +
        '<div class="book-card__title">' + esc(b.title) + '</div>' +
        '<div class="book-card__author">' + esc(b.author) + '</div>' +
        '<div class="book-card__meta">' + esc(b.category) + ' · ' + esc(b.publisher) + ' · ' + esc(b.year) + ' · ' + esc(b.location) + '</div>' +
        statusTag(b.status) + extra + borrower +
      '</div></div>';
  }

  /* ===================== Toast / Modal ===================== */
  var toastTimer = null;
  function toast(msg, type) {
    var t = $('#toast');
    if (!t) { t = document.createElement('div'); t.id = 'toast'; t.className = 'toast'; document.body.appendChild(t); }
    t.className = 'toast' + (type ? ' toast--' + type : '');
    t.textContent = msg;
    t.classList.add('show');
    if (toastTimer) clearTimeout(toastTimer);
    toastTimer = setTimeout(function () { t.classList.remove('show'); }, 2600);
  }
  function showModal(title, bodyHtml) {
    var mask = $('#modal-mask');
    if (!mask) {
      mask = document.createElement('div'); mask.id = 'modal-mask'; mask.className = 'modal-mask';
      mask.innerHTML = '<div class="modal"><h3 id="modal-title"></h3><p id="modal-body"></p><button class="btn btn-primary" onclick="L.closeModal()">我知道了</button></div>';
      document.body.appendChild(mask);
      mask.addEventListener('click', function (e) { if (e.target === mask) closeModal(); });
    }
    $('#modal-title').textContent = title;
    $('#modal-body').innerHTML = bodyHtml || '';
    mask.classList.add('show');
  }
  function closeModal() { var m = $('#modal-mask'); if (m) m.classList.remove('show'); }
  window.L = { closeModal: closeModal, toast: toast };

  /* ===================== 导航高亮 ===================== */
  function initNav() {
    var body = document.body;
    var key = body.getAttribute('data-nav');
    var sub = body.getAttribute('data-sub');
    $all('.nav-link').forEach(function (a) {
      if (a.getAttribute('data-nav') === key) a.classList.add('active');
    });
    $all('.subnav__link').forEach(function (a) {
      var sk = a.getAttribute('data-sub');
      if (sk && sk === sub) a.classList.add('active');
    });
    var toggle = $('#nav-toggle');
    var nav = $('#mainnav');
    if (toggle && nav) {
      toggle.addEventListener('click', function () { nav.classList.toggle('open'); });
    }
  }

  /* ===================== 登录态 ===================== */
  function applyAuth() {
    var u = getState();
    var role = u ? u.role : null;
    $all('[data-auth]').forEach(function (el) {
      var need = el.getAttribute('data-auth');
      var show = false;
      if (need === 'guest') show = !u;
      else if (need === 'user') show = !!u;
      else if (need === 'admin') show = role === 'admin';
      else if (need === 'staff') show = role === 'staff';
      else if (need === 'student') show = role === 'student';
      el.classList.toggle('auth-hidden', !show);
    });
    renderHeaderAccount(u);
  }
  function roleLabel(r) { return r === 'admin' ? '管理员' : r === 'staff' ? '教职工' : r === 'student' ? '学生' : ''; }
  function renderHeaderAccount(u) {
    var box = $('#account-area');
    if (!box) return;
    if (u) {
      box.innerHTML = '<span>您好，' + esc(u.name) + '（' + roleLabel(u.role) + '）</span>' +
        '<a class="btn btn-ghost" id="btn-logout" style="border-color:rgba(255,255,255,.4);color:#fff">退出</a>';
      var lo = $('#btn-logout');
      if (lo) lo.addEventListener('click', doLogout);
    } else {
      box.innerHTML = '<a class="btn btn-ghost" href="login.html" style="border-color:rgba(255,255,255,.4);color:#fff">登录 / 我的图书馆</a>';
    }
  }
  function doLogin(user) {
    try { sessionStorage.setItem('library_user', JSON.stringify(user)); } catch (e) {}
    var back = sessionStorage.getItem('lib_return') || 'my-library.html';
    sessionStorage.removeItem('lib_return');
    window.location.href = back;
  }
  function doLogout() {
    try { sessionStorage.removeItem('library_user'); } catch (e) {}
    window.location.href = 'index.html';
  }
  window.doLogout = doLogout;

  /* ===================== 动态密钥 ===================== */
  function startDynamicKey() {
    var keyEl = $('#admin-key');
    var cdEl = $('#key-countdown');
    if (!keyEl) return;
    function pad(n) { return n < 10 ? '0' + n : '' + n; }
    function tick() {
      // ARG 硬编码动态密钥：验证值恒为 774921（每30秒刷新显示）
      keyEl.textContent = ADMIN_KEY;
      var now = new Date();
      var sec = now.getSeconds();
      var remain = 30 - (sec % 30);
      if (cdEl) cdEl.textContent = '（' + remain + ' 秒后刷新）';
    }
    tick();
    setInterval(tick, 1000);
  }

  /* ===================== 检索 ===================== */
  function normalSearch(q) {
    q = (q || '').trim().toLowerCase();
    if (!q) return BOOKS.filter(function (b) { return !b.hidden; });
    return BOOKS.filter(function (b) {
      if (b.hidden) return false;
      return (b.title + b.author + b.category).toLowerCase().indexOf(q) >= 0;
    });
  }
  function advancedSearch(f) {
    var allFilled = f.title && f.author && f.category && f.publisher && f.year && f.location;
    if (allFilled) {
      // 全部字段精确匹配（含隐藏书籍）
      return BOOKS.filter(function (b) {
        return String(b.title) === f.title &&
               String(b.author) === f.author &&
               String(b.category) === f.category &&
               String(b.publisher) === f.publisher &&
               String(b.year) === f.year &&
               String(b.location) === f.location;
      });
    }
    // 部分字段：模糊匹配已填项
    return BOOKS.filter(function (b) {
      if (b.hidden) return false;
      if (f.title && b.title.toLowerCase().indexOf(f.title.toLowerCase()) < 0) return false;
      if (f.author && b.author.toLowerCase().indexOf(f.author.toLowerCase()) < 0) return false;
      if (f.category && b.category.toLowerCase().indexOf(f.category.toLowerCase()) < 0) return false;
      if (f.publisher && b.publisher.toLowerCase().indexOf(f.publisher.toLowerCase()) < 0) return false;
      if (f.year && String(b.year).indexOf(f.year) < 0) return false;
      if (f.location && b.location.toLowerCase().indexOf(f.location.toLowerCase()) < 0) return false;
      var any = f.title || f.author || f.category || f.publisher || f.year || f.location;
      return !!any;
    });
  }
  function renderResults(container, list, showBorrower) {
    if (!container) return;
    if (!list.length) {
      container.innerHTML = '<div class="empty-state">未找到匹配结果。请调整关键词或检索条件。</div>';
      var rc = $('#result-count'); if (rc) rc.textContent = '';
      return;
    }
    container.innerHTML = list.map(function (b) { return bookCardHTML(b, showBorrower); }).join('');
    var rc = $('#result-count'); if (rc) rc.textContent = '共找到 ' + list.length + ' 条结果';
  }

  /* ===================== 页面初始化 ===================== */
  function initCollection() {
    var results = $('#results');
    if (!results) return;
    var qInput = $('#coll-search');
    var chips = $all('.filter-chips .chip');
    var curCat = '全部';
    function render() {
      var q = qInput ? qInput.value : '';
      var list = normalSearch(q).filter(function (b) {
        if (curCat === '全部') return true;
        return b.category === curCat;
      });
      renderResults(results, list, isAdmin());
    }
    if (chips.length) {
      chips.forEach(function (c) {
        c.addEventListener('click', function () {
          chips.forEach(function (x) { x.classList.remove('active'); });
          c.classList.add('active');
          curCat = c.getAttribute('data-cat');
          render();
        });
      });
    }
    if (qInput) qInput.addEventListener('input', render);
    render();
  }

  function initCollectionSearch() {
    var results = $('#results');
    if (!results) return;
    var input = $('#search-input');
    var params = new URLSearchParams(window.location.search);
    var q = params.get('q') || '';
    if (input) input.value = q;
    renderResults(results, normalSearch(q), isAdmin());
    if (input) {
      input.addEventListener('keydown', function (e) {
        if (e.key === 'Enter') window.location.href = 'collection-search.html?q=' + encodeURIComponent(input.value);
      });
    }
    var btn = $('#search-go');
    if (btn) btn.addEventListener('click', function () {
      window.location.href = 'collection-search.html?q=' + encodeURIComponent(input ? input.value : '');
    });
  }

  function initAdvanced() {
    var form = $('#adv-form');
    if (!form) return;
    var results = $('#results');
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      function val(n) { var el = form.querySelector('[name="' + n + '"]'); return el ? el.value.trim() : ''; }
      var f = {
        title: val('booktitle'),
        author: val('author'),
        category: val('category'),
        publisher: val('publisher'),
        year: val('year'),
        location: val('location')
      };
      var any = f.title || f.author || f.category || f.publisher || f.year || f.location;
      if (!any) { toast('请至少填写一项检索条件', 'warn'); return; }
      var list = advancedSearch(f);
      renderResults(results, list, isAdmin());
    });
  }

  function initSpecial() {
    var wrap = $('#special-list');
    if (!wrap) return;
    wrap.innerHTML = SPECIAL.map(function (s) {
      var locked = s.status === '受限';
      var cls = 'tag-public';
      if (s.status === '内部') cls = 'tag-internal';
      if (s.status === '受限') cls = 'tag-restricted';
      var right = '<span class="tag ' + cls + '">' + esc(s.status) + '</span>';
      if (locked) {
        return '<div class="special-item locked" data-locked="1"><span class="code">' + esc(s.code) + '</span>' +
          '<span class="ttl">' + esc(s.title) + '</span>' + right + '</div>';
      }
      return '<div class="special-item"><span class="code">' + esc(s.code) + '</span>' +
        '<span class="ttl">' + esc(s.title) + '</span>' + right + '</div>';
    }).join('');
    $all('#special-list .special-item.locked').forEach(function (el) {
      el.addEventListener('click', function () { toast('该卷宗需申请调阅', 'warn'); });
    });
  }

  function initBooking() {
    var form = $('#booking-form');
    if (!form) return;
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      showModal('预约系统升级维护中', '预约系统正在升级维护，暂不支持新提交预约。<br>历史预约记录请登录【我的图书馆】查阅。');
    });
    // 登录后显示预约历史
    var u = getState();
    var hist = u ? BOOKING_HISTORY[u.id] : null;
    var box = $('#booking-history');
    var list = $('#booking-history-list') || box;
    if (box && hist && hist.length) {
      list.innerHTML = hist.map(function (r) {
        var frag = r.note ? '<div class="record__frag">' + esc(r.note) + '</div>' : '';
        return '<div class="record"><div class="record__title">研讨室 ' + esc(r.room) + ' · ' + esc(r.date) + '</div>' +
          '<div class="record__meta"><span>时间段：' + esc(r.time) + '</span><span>用途：' + esc(r.purpose) + '</span></div>' + frag + '</div>';
      }).join('');
    } else if (box) {
      box.parentNode && box.parentNode.removeChild(box);
    }
  }

  function initRenewal() {
    var btn = $('#reserve-search');
    var input = $('#reserve-title');
    var out = $('#reserve-result');
    if (btn && input && out) {
      btn.addEventListener('click', function () {
        var t = input.value.trim();
        if (!t) { out.textContent = '请输入书名。'; out.style.color = 'var(--st-lost)'; return; }
        var found = BOOKS.filter(function (b) { return !b.hidden && b.title.toLowerCase().indexOf(t.toLowerCase()) >= 0; });
        if (found.length && found[0].status === 'ok') {
          out.innerHTML = '该书可预约。<button class="btn btn-primary btn-sm" id="do-reserve">预约此书</button>';
          out.style.color = 'var(--st-ok)';
          var dr = $('#do-reserve');
          if (dr) dr.addEventListener('click', function () { toast('预约成功'); });
        } else if (found.length) {
          out.textContent = '该书已被预约 / 暂不可预约。'; out.style.color = 'var(--st-out)';
        } else {
          out.textContent = '未找到该书。'; out.style.color = 'var(--st-lost)';
        }
      });
    }
  }

  function initRecommend() {
    var form = $('#recommend-form');
    if (!form) return;
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var ok = true;
      $all('.field', form).forEach(function (f) {
        var inp = f.querySelector('input,textarea');
        if (!inp) return;
        if (!inp.value.trim()) { f.classList.add('invalid'); ok = false; }
        else f.classList.remove('invalid');
      });
      if (!ok) return;
      toast('推荐已提交');
      form.reset();
    });
    // 登录后显示荐购历史
    var u = getState();
    var hist = u ? RECOMMEND_HISTORY[u.id] : null;
    var box = $('#recommend-history');
    var list = $('#recommend-history-list') || box;
    if (box && hist && hist.length) {
      list.innerHTML = hist.map(function (r) {
        return '<div class="record"><div class="record__title">' + esc(r.name) + '（' + esc(r.type) + '）</div>' +
          '<div class="record__meta"><span>推荐日期：' + esc(r.date) + '</span><span>处理状态：' + esc(r.status) + '</span></div></div>';
      }).join('');
    } else if (box) {
      box.parentNode && box.parentNode.removeChild(box);
    }
  }

  function initFeedback() {
    var form = $('#feedback-form');
    if (!form) return;
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var ok = true;
      $all('.field', form).forEach(function (f) {
        var inp = f.querySelector('input,textarea,select');
        if (!inp) return;
        var v = inp.value.trim();
        var bad = !v;
        if (inp.type === 'email' && v && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v)) bad = true;
        if (bad) { f.classList.add('invalid'); ok = false; } else f.classList.remove('invalid');
      });
      if (!ok) return;
      showModal('提交成功', '感谢您的反馈！');
      form.reset();
    });
  }

  function initLogin() {
    startDynamicKey();
    var form = $('#login-form');
    if (!form) return;
    var roleTabs = $all('.role-tab');
    var keyField = $('#key-field');
    var pwdField = $('#pwd-field');
    var curRole = 'student';
    function syncRole(r) {
      curRole = r;
      roleTabs.forEach(function (t) { t.classList.toggle('active', t.getAttribute('data-role') === r); });
      if (keyField) keyField.style.display = (r === 'admin') ? '' : 'none';
      if (pwdField) pwdField.style.display = (r === 'admin') ? 'none' : '';
    }
    roleTabs.forEach(function (t) {
      t.addEventListener('click', function () { syncRole(t.getAttribute('data-role')); });
    });
    syncRole('student');
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var id = form.querySelector('[name="uid"]').value.trim();
      var pwd = form.querySelector('[name="pwd"]').value;
      var keyEl = form.querySelector('[name="key"]');
      var key = keyEl ? keyEl.value.trim() : '';
      if (curRole === 'admin') {
        if (id !== 'admin') { toast('管理员账号为 admin', 'error'); return; }
        if (key !== ADMIN_KEY) { toast('动态密钥不正确', 'error'); return; }
        doLogin({ id: 'admin', name: '系统管理员', role: 'admin' });
        return;
      }
      var acc = ACCOUNTS[id];
      if (!acc || acc.role !== curRole) { toast('账号或角色不正确', 'error'); return; }
      if (acc.pwd !== pwd) { toast('密码不正确', 'error'); return; }
      doLogin({ id: acc.id, name: acc.name, role: acc.role });
    });
  }

  function initMyLibrary() {
    var required = $('#login-required');
    var content = $('#lib-content');
    var u = getState();
    if (!u) {
      if (required) required.classList.remove('auth-hidden');
      if (content) content.classList.add('auth-hidden');
      return;
    }
    if (required) required.classList.add('auth-hidden');
    if (content) content.classList.remove('auth-hidden');

    var who = $('#lib-who');
    if (who) who.innerHTML = '您好，' + esc(u.name) + ' <small>' + roleLabel(u.role) + ' · 账号 ' + esc(u.id) + '</small>';

    var borrow = BORROW_HISTORY[u.id] || [];
    var booking = BOOKING_HISTORY[u.id] || [];
    var recommend = RECOMMEND_HISTORY[u.id] || [];

    var bt = $('#tab-borrow'), bp = $('#panel-borrow');
    var kt = $('#tab-booking'), kp = $('#panel-booking');
    var rt = $('#tab-recommend'), rp = $('#panel-recommend');

    if (bp) bp.innerHTML = borrow.length ? borrow.map(borrowRecHTML).join('') : '<div class="empty-state">暂无借阅记录。</div>';
    if (kp) kp.innerHTML = booking.length ? booking.map(bookingRecHTML).join('') : '<div class="empty-state">暂无预约记录。</div>';
    if (rp) rp.innerHTML = recommend.length ? recommend.map(recommendRecHTML).join('') : '<div class="empty-state">暂无荐购记录。</div>';

    // tab 显隐
    if (kt) kt.classList.toggle('auth-hidden', booking.length === 0);
    if (rt) rt.classList.toggle('auth-hidden', recommend.length === 0);

    $all('.tabs .tab').forEach(function (tab) {
      tab.addEventListener('click', function () {
        $all('.tabs .tab').forEach(function (t) { t.classList.remove('active'); });
        $all('.tab-panel').forEach(function (p) { p.classList.remove('active'); });
        tab.classList.add('active');
        var pid = tab.getAttribute('data-panel');
        var p = pid ? document.getElementById(pid) : null;
        if (p) p.classList.add('active');
      });
    });
    // 默认激活第一个可见 tab
    var first = $('.tabs .tab:not(.auth-hidden)');
    if (first) first.click();
  }
  function borrowRecHTML(r) {
    var cls = r.status === '遗失' ? 'tag-lost' : r.status === '破损' ? 'tag-broken' : r.status === '已借出' ? 'tag-out' : 'tag-ok';
    return '<div class="record"><div class="record__title">' + esc(r.title) + '</div>' +
      '<div class="record__meta"><span>作者：' + esc(r.author) + '</span><span>借阅：' + esc(r.borrow) + '</span>' +
      '<span>归还：' + esc(r.back) + '</span><span>方式：' + esc(r.method) + '</span>' +
      '<span class="tag ' + cls + '">' + esc(r.status) + '</span></div></div>';
  }
  function bookingRecHTML(r) {
    var frag = r.note ? '<div class="record__frag">' + esc(r.note) + '</div>' : '';
    return '<div class="record"><div class="record__title">研讨室 ' + esc(r.room) + ' · ' + esc(r.date) + '</div>' +
      '<div class="record__meta"><span>时间段：' + esc(r.time) + '</span><span>用途：' + esc(r.purpose) + '</span></div>' + frag + '</div>';
  }
  function recommendRecHTML(r) {
    return '<div class="record"><div class="record__title">' + esc(r.name) + '（' + esc(r.type) + '）</div>' +
      '<div class="record__meta"><span>推荐日期：' + esc(r.date) + '</span><span>处理状态：' + esc(r.status) + '</span></div></div>';
  }

  function initAccordion() {
    $all('.acc-item').forEach(function (item) {
      var head = item.querySelector('.acc-head');
      if (!head) return;
      var body = item.querySelector('.acc-body');
      head.addEventListener('click', function () {
        var open = item.classList.toggle('open');
        body.style.maxHeight = open ? body.scrollHeight + 'px' : '0px';
      });
    });
  }

  function initToTop() {
    var btn = $('#to-top');
    if (!btn) return;
    window.addEventListener('scroll', function () {
      btn.classList.toggle('show', window.scrollY > 400);
    });
    btn.addEventListener('click', function () { window.scrollTo({ top: 0, behavior: 'smooth' }); });
  }

  /* ===================== 入口 ===================== */
  function init() {
    initNav();
    applyAuth();
    initCollection();
    initCollectionSearch();
    initAdvanced();
    initSpecial();
    initBooking();
    initRenewal();
    initRecommend();
    initFeedback();
    initLogin();
    initMyLibrary();
    initAccordion();
    initToTop();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
