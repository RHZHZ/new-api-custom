(() => {
  'use strict'

  const iconPaths = {
    'arrow-left': '<path d="m15 18-6-6 6-6"/><path d="M21 12H9"/>',
    'arrow-right': '<path d="M5 12h14"/><path d="m13 6 6 6-6 6"/>',
    bell: '<path d="M10.3 21a1.94 1.94 0 0 0 3.4 0"/><path d="M4 17h16"/><path d="M18 8a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9"/>',
    calendar: '<path d="M8 2v4"/><path d="M16 2v4"/><rect width="18" height="18" x="3" y="4" rx="2"/><path d="M3 10h18"/>',
    'chevron-down': '<path d="m6 9 6 6 6-6"/>',
    'chevron-right': '<path d="m9 18 6-6-6-6"/>',
    'circle-dollar': '<circle cx="12" cy="12" r="10"/><path d="M16 8h-6a2 2 0 1 0 0 4h4a2 2 0 1 1 0 4H8"/><path d="M12 18V6"/>',
    close: '<path d="M18 6 6 18"/><path d="m6 6 12 12"/>',
    copy: '<rect width="14" height="14" x="8" y="8" rx="2" ry="2"/><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"/>',
    database: '<ellipse cx="12" cy="5" rx="9" ry="3"/><path d="M3 5v14c0 1.7 4 3 9 3s9-1.3 9-3V5"/><path d="M3 12c0 1.7 4 3 9 3s9-1.3 9-3"/>',
    download: '<path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><path d="m7 10 5 5 5-5"/><path d="M12 15V3"/>',
    eye: '<path d="M2.1 12a10.8 10.8 0 0 1 19.8 0 10.8 10.8 0 0 1-19.8 0"/><circle cx="12" cy="12" r="3"/>',
    github:
      '<path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.4 5.4 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4"/><path d="M9 18c-4.51 2-5-2-7-2"/>',
    message: '<path d="M7.9 20A9 9 0 1 0 4 16.1L2 22Z"/>',
    filter: '<path d="M4 5h16"/><path d="M7 12h10"/><path d="M10 19h4"/>',
    grid: '<rect width="7" height="7" x="3" y="3" rx="1"/><rect width="7" height="7" x="14" y="3" rx="1"/><rect width="7" height="7" x="14" y="14" rx="1"/><rect width="7" height="7" x="3" y="14" rx="1"/>',
    key: '<circle cx="7.5" cy="15.5" r="5.5"/><path d="m21 2-9.6 9.6"/><path d="m15.5 7.5 3 3L22 7l-3-3"/>',
    language: '<path d="m5 8 6 6"/><path d="m4 14 6-6 2-3"/><path d="M2 5h12"/><path d="M7 2h1"/><path d="m22 22-5-10-5 10"/><path d="M14 18h6"/>',
    linechart: '<path d="M3 3v18h18"/><path d="m19 9-5 5-4-4-3 3"/>',
    list: '<path d="M8 6h13"/><path d="M8 12h13"/><path d="M8 18h13"/><path d="M3 6h.01"/><path d="M3 12h.01"/><path d="M3 18h.01"/>',
    menu: '<path d="M4 6h16"/><path d="M4 12h16"/><path d="M4 18h16"/>',
    palette: '<circle cx="13.5" cy="6.5" r=".5" fill="currentColor"/><circle cx="17.5" cy="10.5" r=".5" fill="currentColor"/><circle cx="8.5" cy="7.5" r=".5" fill="currentColor"/><circle cx="6.5" cy="12.5" r=".5" fill="currentColor"/><path d="M12 2a10 10 0 0 0 0 20c1.1 0 2-.9 2-2 0-.5-.2-1-.6-1.4-.4-.4-.6-.9-.6-1.4a2 2 0 0 1 2-2h1.8A5.4 5.4 0 0 0 22 9.8C22 5.5 17.5 2 12 2Z"/>',
    panel: '<rect width="18" height="18" x="3" y="3" rx="2"/><path d="M9 3v18"/>',
    receipt: '<path d="M4 2v20l2-2 2 2 2-2 2 2 2-2 2 2 2-2 2 2V2l-2 2-2-2-2 2-2-2-2 2-2-2-2 2Z"/><path d="M16 8h-6"/><path d="M16 12h-6"/><path d="M13 16h-3"/>',
    refresh: '<path d="M20 11a8.1 8.1 0 0 0-15.5-2M4 4v5h5"/><path d="M4 13a8.1 8.1 0 0 0 15.5 2M20 20v-5h-5"/>',
    save: '<path d="M15.2 3H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V8.8Z"/><path d="M17 21v-8H7v8"/><path d="M7 3v5h8"/>',
    search: '<circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/>',
    settings: '<path d="M12.2 2h-.4a2 2 0 0 0-2 2v.2a2 2 0 0 1-1 1.7l-.4.2a2 2 0 0 1-2 0l-.2-.1a2 2 0 0 0-2.7.7l-.2.4a2 2 0 0 0 .7 2.7l.2.1a2 2 0 0 1 1 1.7v.5a2 2 0 0 1-1 1.7l-.2.1a2 2 0 0 0-.7 2.7l.2.4a2 2 0 0 0 2.7.7l.2-.1a2 2 0 0 1 2 0l.4.2a2 2 0 0 1 1 1.7v.2a2 2 0 0 0 2 2h.4a2 2 0 0 0 2-2v-.2a2 2 0 0 1 1-1.7l.4-.2a2 2 0 0 1 2 0l.2.1a2 2 0 0 0 2.7-.7l.2-.4a2 2 0 0 0-.7-2.7l-.2-.1a2 2 0 0 1-1-1.7v-.5a2 2 0 0 1 1-1.7l.2-.1a2 2 0 0 0 .7-2.7l-.2-.4a2 2 0 0 0-2.7-.7l-.2.1a2 2 0 0 1-2 0l-.4-.2a2 2 0 0 1-1-1.7V4a2 2 0 0 0-2-2Z"/><circle cx="12" cy="12" r="3"/>',
    shield: '<path d="M20 13c0 5-3.5 7.5-8 9-4.5-1.5-8-4-8-9V5l8-3 8 3Z"/><path d="m9 12 2 2 4-4"/>',
    sliders: '<path d="M4 21v-7"/><path d="M4 10V3"/><path d="M12 21v-9"/><path d="M12 8V3"/><path d="M20 21v-5"/><path d="M20 12V3"/><path d="M1 14h6"/><path d="M9 8h6"/><path d="M17 16h6"/>',
    table: '<path d="M12 3v18"/><path d="M3 9h18"/><path d="M3 15h18"/><rect width="18" height="18" x="3" y="3" rx="2"/>',
    users: '<path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.9"/><path d="M16 3.1a4 4 0 0 1 0 7.8"/>',
    wallet: '<path d="M19 7V4a1 1 0 0 0-1-1H5a3 3 0 0 0 0 6h15a1 1 0 0 1 1 1v9a2 2 0 0 1-2 2H5a3 3 0 0 1-3-3V6"/><path d="M16 14h2"/>'
  }

  function icon(name, extraClass = '') {
    return `<svg class="icon ${extraClass}" aria-hidden="true" focusable="false" viewBox="0 0 24 24">${iconPaths[name] || ''}</svg>`
  }

  function iconButton(name, label, extraClass = '', attributes = '') {
    return `<button class="icon-btn ${extraClass}" type="button" aria-label="${label}" title="${label}" ${attributes}>${icon(name)}</button>`
  }

  function publicBrand(descriptor = true) {
    return `
      <div class="public-brand" aria-label="RAPI">
        <span class="public-wordmark">RAPI</span>
        ${descriptor ? '<span class="brand-descriptor">统一接口<br />稳定接入</span>' : ''}
      </div>`
  }

  function publicHeader(active = 'pricing') {
    const navItems = [
      ['home', '首页', '#'],
      ['console', '控制台', '?screen=overview-desktop'],
      ['pricing', '模型与价格', '?screen=pricing-desktop'],
      ['rankings', '使用趋势', '#'],
      ['docs', '文档', '#'],
      ['about', '关于', '#']
    ]
    const nav = navItems
      .map(([id, label, href]) => `<a class="${active === id ? 'active' : ''}" href="${href}" ${active === id ? 'aria-current="page"' : ''}>${label}</a>`)
      .join('')

    return `
      <header class="public-header">
        ${publicBrand()}
        <nav class="public-nav" aria-label="公共导航">${nav}</nav>
        <div class="public-actions">
          ${iconButton('language', '切换语言')}
          ${iconButton('palette', '切换外观')}
          <a class="btn" href="?screen=auth-desktop" style="text-decoration:none">登录</a>
        </div>
      </header>`
  }

  function mobilePublicHeader() {
    return `
      <header class="mobile-public-header">
        <span class="mobile-wordmark" aria-label="RAPI">RAPI</span>
        <div class="mobile-header-actions">
          ${iconButton('language', '切换语言')}
          ${iconButton('menu', '打开导航菜单')}
        </div>
      </header>`
  }

  function searchControl(id, placeholder, className = 'search-box') {
    return `
      <form class="${className}" role="search" data-static-form>
        ${icon('search', 'icon-sm')}
        <input
          id="${id}"
          type="search"
          aria-label="${placeholder}"
          placeholder="${placeholder}"
          autocomplete="off"
          style="width:100%;min-width:0;border:0;outline:0;background:transparent;color:inherit;font:inherit"
        />
      </form>`
  }

  function filterChip(label, active = false) {
    return `<button class="filter-chip ${active ? 'active' : ''}" type="button" aria-pressed="${active}">${label}</button>`
  }

  function status(label, variant = '') {
    return `<span class="status ${variant ? `status-${variant}` : ''}">${label}</span>`
  }

  function modelRows() {
    const rows = [
      ['O', 'gpt-4.1', 'OpenAI', '按 Token', '文本生成'],
      ['A', 'claude-sonnet-4', 'Anthropic', '按 Token', '文本生成'],
      ['G', 'gemini-2.5-pro', 'Google', '按 Token', '多模态'],
      ['D', 'deepseek-v3', 'DeepSeek', '按 Token', '文本生成'],
      ['O', 'text-embedding-3-large', 'OpenAI', '按 Token', '向量嵌入'],
      ['G', 'gemini-2.5-flash', 'Google', '按 Token', '多模态'],
      ['A', 'claude-haiku-3.5', 'Anthropic', '按 Token', '文本生成']
    ]

    return rows
      .map(
        ([mark, name, provider, billing, endpoint]) => `
          <tr>
            <td>
              <div class="model-name">
                <span class="model-mark">${mark}</span>
                <span><strong>${name}</strong><small>${provider}</small></span>
              </div>
            </td>
            <td class="muted">${provider}</td>
            <td>${billing}</td>
            <td><div class="endpoint-list"><span class="endpoint-tag">${endpoint}</span></div></td>
            <td class="number placeholder-value">--</td>
            <td class="number placeholder-value">--</td>
            <td>${status('状态 --')}</td>
            <td>${iconButton('chevron-right', `查看${name}详情`, 'icon-sm')}</td>
          </tr>`
      )
      .join('')
  }

  function pricingDesktop() {
    return `
      <section class="concept public-page" aria-label="模型与价格桌面概念">
        ${publicHeader('pricing')}
        <section class="pricing-main" aria-labelledby="pricing-title">
          <div class="pricing-task-head">
            <div class="pricing-title-block">
              <h1 id="pricing-title">模型与价格</h1>
              <p>查看可用模型、计费方式与接口支持，按你的使用场景快速筛选。</p>
            </div>
            ${searchControl('pricing-search', '搜索模型、服务商或接口类型')}
          </div>

          <div class="pricing-workspace">
            <aside class="filter-rail" aria-label="模型筛选">
              <div class="filter-heading">
                <h2>筛选条件</h2>
                <button type="button">重置</button>
              </div>
              <section class="filter-section" aria-labelledby="filter-provider">
                <div class="filter-section-title" id="filter-provider">提供方 ${icon('chevron-down', 'icon-sm')}</div>
                <div class="filter-options">
                  ${filterChip('全部', true)}
                  ${filterChip('提供方 A')}
                  ${filterChip('提供方 B')}
                  ${filterChip('其他')}
                </div>
              </section>
              <section class="filter-section" aria-labelledby="filter-capability">
                <div class="filter-section-title" id="filter-capability">接口能力 ${icon('chevron-down', 'icon-sm')}</div>
                <div class="filter-options">
                  ${filterChip('文本生成')}
                  ${filterChip('图文理解')}
                  ${filterChip('图像生成')}
                  ${filterChip('语音处理')}
                  ${filterChip('向量嵌入')}
                </div>
              </section>
              <section class="filter-section" aria-labelledby="filter-billing">
                <div class="filter-section-title" id="filter-billing">计费方式 ${icon('chevron-down', 'icon-sm')}</div>
                <div class="filter-options">
                  ${filterChip('按输入计费')}
                  ${filterChip('按输出计费')}
                  ${filterChip('按次计费')}
                </div>
              </section>
              <section class="filter-section" aria-labelledby="filter-context">
                <div class="filter-section-title" id="filter-context">上下文范围 ${icon('chevron-down', 'icon-sm')}</div>
                <div class="filter-options">${filterChip('全部', true)} ${filterChip('短文本')} ${filterChip('长文本')}</div>
              </section>
            </aside>

            <section class="results-area" aria-labelledby="pricing-results">
              <div class="results-toolbar">
                <div class="results-count" id="pricing-results"><strong>--</strong> 个可用模型</div>
                <div class="toolbar-controls">
                  <div class="segmented" role="group" aria-label="计价单位">
                    <button class="active" type="button" aria-pressed="true">标准价格</button>
                    <button type="button" aria-pressed="false">倍率</button>
                  </div>
                  <button class="btn" type="button">默认排序 ${icon('chevron-down', 'icon-sm')}</button>
                  <div class="segmented" role="group" aria-label="结果视图">
                    <button class="active" type="button" aria-label="表格视图" aria-pressed="true">${icon('table', 'icon-sm')}</button>
                    <button type="button" aria-label="列表视图" aria-pressed="false">${icon('list', 'icon-sm')}</button>
                  </div>
                </div>
              </div>

              <div class="table-shell">
                <table class="data-table" aria-label="模型与价格比较">
                  <colgroup>
                    <col style="width:21%" /><col style="width:13%" /><col style="width:13%" /><col style="width:13%" />
                    <col style="width:12%" /><col style="width:12%" /><col style="width:10%" /><col style="width:6%" />
                  </colgroup>
                  <thead>
                    <tr>
                      <th scope="col">模型</th><th scope="col">服务商</th><th scope="col">计费方式</th><th scope="col">接口</th>
                      <th scope="col">输入价格</th><th scope="col">输出价格</th><th scope="col">状态</th><th scope="col"><span aria-hidden="true">详情</span></th>
                    </tr>
                  </thead>
                  <tbody>${modelRows()}</tbody>
                </table>
                <footer class="table-footer">
                  <span>价格以当前页面实时信息为准</span>
                  <span class="number">第 -- / -- 页</span>
                </footer>
              </div>
            </section>
          </div>
        </section>
      </section>`
  }

  function formInput({ id, label, type = 'text', placeholder, autocomplete, action, error }) {
    return `
      <div class="form-field">
        <div class="form-label-row">
          <label class="form-label" for="${id}">${label}</label>
          ${action || ''}
        </div>
        <div class="form-input ${error ? 'has-error' : ''}">
          <input
            id="${id}"
            type="${type}"
            placeholder="${placeholder}"
            autocomplete="${autocomplete}"
            ${error ? `aria-invalid="true" aria-describedby="${id}-error"` : ''}
            style="width:100%;min-width:0;border:0;outline:0;background:transparent;color:inherit;font:inherit"
          />
          ${type === 'password' ? iconButton('eye', '显示密码', 'btn-subtle', 'aria-pressed="false"') : ''}
        </div>
        ${error ? `<p class="field-error" id="${id}-error" role="alert">${error}</p>` : ''}
      </div>`
  }

  function authForm(prefix, { fieldError = '', captcha = false } = {}) {
    return `
      <form class="auth-form" aria-labelledby="${prefix}-auth-title" data-static-form>
        <h2 id="${prefix}-auth-title">登录</h2>
        <p class="signup-line">还没有账户？ <a href="#">注册</a></p>
        ${formInput({ id: `${prefix}-account`, label: '用户名或邮箱', placeholder: '请输入用户名或邮箱', autocomplete: 'username' })}
        ${formInput({ id: `${prefix}-password`, label: '密码', type: 'password', placeholder: '请输入密码', autocomplete: 'current-password', action: '<a class="form-link" href="#">忘记密码</a>', error: fieldError })}
        <label class="legal-row" for="${prefix}-legal">
          <input class="checkbox" id="${prefix}-legal" type="checkbox" />
          <span>我已阅读并同意 <a href="#">用户协议</a> 和 <a href="#">隐私政策</a></span>
        </label>
        ${captcha ? '<div class="captcha-box"><span>人机验证<small>提交前完成一次快速验证。</small></span><span class="status">等待验证</span></div>' : ''}
        <button class="btn btn-primary auth-submit" type="submit">登录</button>
        <div class="auth-divider"><span>其他登录方式</span></div>
        <div class="provider-list" aria-label="其他登录方式">
          <button class="provider-button" type="button">${icon('key', 'icon-sm')} Passkey</button>
          <button class="provider-button" type="button">${icon('github', 'icon-sm')} GitHub</button>
          <button class="provider-button" type="button">${icon('message', 'icon-sm')} 微信</button>
        </div>
      </form>`
  }

  function authDesktop() {
    return `
      <section class="concept auth-screen" aria-label="登录桌面概念">
        <aside class="auth-brand-plane" aria-label="RAPI 品牌信息">
          <div class="auth-brand-wordmark">RAPI</div>
          <div class="auth-brand-copy">
            <h1>企业级统一<br />服务中转站</h1>
            <p>稳定接入，清晰使用。</p>
          </div>
          <div class="auth-domain">cccc.asia</div>
        </aside>
        <section class="auth-work-surface" aria-label="登录表单区域">
          <div class="auth-utilities">
            ${iconButton('arrow-left', '返回首页')}
            ${iconButton('language', '切换语言')}
            ${iconButton('palette', '切换外观')}
          </div>
          ${authForm('desktop', { fieldError: '用户名或密码不正确，请检查后重试。', captcha: true })}
        </section>
      </section>`
  }

  const userNavigation = [
    ['tools', 'Playground', 'sliders', 'playground', '#'],
    ['tools', 'Chat', 'panel', 'chat', '#'],
    ['main', '概览', 'grid', 'overview', '?screen=overview-desktop'],
    ['analysis', '用量分析', 'linechart', 'analytics', '#'],
    ['account', 'API 密钥', 'key', 'keys', '#'],
    ['account', '请求记录', 'receipt', 'logs', '?screen=logs-desktop'],
    ['account', '任务记录', 'list', 'tasks', '#'],
    ['account', '余额与充值', 'wallet', 'wallet', '#'],
    ['account', '账户与安全', 'shield', 'profile', '#']
  ]

  const adminNavigation = [
    ['settings', '站点与品牌', 'palette', 'settings', '?screen=settings-desktop'],
    ['settings', '身份认证', 'shield', 'authentication', '#'],
    ['settings', '计费与支付', 'circle-dollar', 'billing', '#'],
    ['settings', '模型与路由', 'database', 'routing', '#'],
    ['settings', '安全与限制', 'sliders', 'security', '#'],
    ['settings', '控制台内容', 'panel', 'content', '#'],
    ['settings', '运维', 'settings', 'operations', '#']
  ]

  function sidebarLink(label, iconName, id, href, active, extraClass = '') {
    return `
      <a
        class="sidebar-item ${extraClass} ${active === id ? 'active' : ''}"
        href="${href}"
        style="text-decoration:none"
        ${active === id ? 'aria-current="page"' : ''}
      >${icon(iconName)}<span>${label}</span></a>`
  }

  function appSidebar(active, mode = 'user') {
    const items = mode === 'admin' ? adminNavigation : userNavigation
    const groups = []
    for (const item of items) {
      const [group] = item
      if (!groups.includes(group)) groups.push(group)
    }
    const groupLabels = {
      tools: '工具',
      main: '工作区',
      analysis: '用量',
      account: '账户',
      settings: '系统设置'
    }

    return `
      <aside class="app-sidebar" aria-label="${mode === 'admin' ? '管理导航' : '用户导航'}">
        ${mode === 'admin' ? `<a class="settings-back" href="?screen=overview-desktop" style="text-decoration:none">${icon('arrow-left', 'icon-sm')} 返回控制台</a>` : ''}
        <nav>
          ${groups
            .map(
              (group) => `
                <section class="sidebar-section" aria-labelledby="sidebar-${group}">
                  <h2 class="sidebar-label" id="sidebar-${group}">${groupLabels[group]}</h2>
                  ${items
                    .filter(([itemGroup]) => itemGroup === group)
                    .map(([, label, iconName, id, href]) => sidebarLink(label, iconName, id, href, active, mode === 'admin' ? 'settings-sidebar-item' : ''))
                    .join('')}
                </section>`
            )
            .join('')}
        </nav>
      </aside>`
  }

  function appTopbar() {
    return `
      <header class="app-topbar">
        <div class="app-topbar-left">
          ${iconButton('menu', '收起侧栏')}
          <div class="app-brand" aria-label="RAPI 用户控制台">
            <span class="app-brand-mark">R</span><span class="app-brand-name">RAPI</span>
          </div>
        </div>
        <div class="app-topbar-right">
          ${searchControl('app-search', '搜索功能或页面', 'app-search')}
          ${iconButton('bell', '查看通知')}
          ${iconButton('language', '切换语言')}
          ${iconButton('palette', '切换外观')}
          <button class="avatar" type="button" aria-label="打开账户菜单" title="打开账户菜单">RA</button>
        </div>
      </header>`
  }

  function appShell({ active, title, actions = '', content, contentClass = 'page-content', mode = 'user', titleExtra = '' }) {
    return `
      <section class="concept app-shell" aria-label="${title}桌面概念">
        ${appTopbar()}
        <div class="app-layout">
          ${appSidebar(active, mode)}
          <section class="app-main" aria-labelledby="page-title">
            <header class="page-titlebar">
              <div style="display:flex;align-items:center"><h1 id="page-title">${title}</h1>${titleExtra}</div>
              <div class="page-titlebar-actions">${actions}</div>
            </header>
            <section class="${contentClass}">${content}</section>
          </section>
        </div>
      </section>`
  }

  function summaryRail(items) {
    return `
      <section class="summary-rail" aria-label="账户摘要">
        ${items
          .map(
            ([label, iconName]) => `
              <div class="summary-cell">
                <div class="summary-cell-label">${icon(iconName, 'icon-sm')} ${label}</div>
                <div class="summary-cell-value number placeholder-value">--</div>
              </div>`
          )
          .join('')}
      </section>`
  }

  const onboardingSteps = [
    ['01', '创建 API 密钥', '生成用于调用接口的个人凭据'],
    ['02', '充值余额', '为账户补充可用调用额度'],
    ['03', '发送请求', '选择模型并验证调用结果']
  ]

  function desktopOnboarding() {
    return `
      <ol class="step-list">
        ${onboardingSteps
          .map(
            ([index, title, detail]) => `
              <li class="step-row">
                <span class="step-index">${index}</span>
                <span class="step-copy"><strong>${title}</strong><small>${detail}</small></span>
                ${iconButton('arrow-right', `前往${title}`, 'icon-sm')}
              </li>`
          )
          .join('')}
      </ol>`
  }

  function apiAccessRows(mobile = false) {
    const rows = [
      ['API 地址', 'https://cccc.asia/v1'],
      ['API 密钥', 'sk-••••••••••••'],
      ['默认模型', '--']
    ]

    return rows
      .map(
        ([label, value]) => `
          <div class="${mobile ? 'mobile-api-row' : 'api-row'}">
            <span class="${mobile ? 'muted' : 'api-row-label'}">${label}</span>
            <span class="${mobile ? 'mono' : 'api-row-value mono'}">${value}</span>
            <button class="${mobile ? 'mobile-copy-btn' : 'copy-mini'}" type="button" aria-label="复制${label}">${mobile ? '复制' : `${icon('copy', 'icon-sm')} 复制`}</button>
          </div>`
      )
      .join('')
  }

  const quickActions = [
    ['API 密钥', 'key', '#'],
    ['请求记录', 'receipt', '?screen=logs-desktop'],
    ['模型与价格', 'database', '?screen=pricing-desktop'],
    ['账户与安全', 'shield', '#']
  ]

  function overviewDesktop() {
    const content = `
      ${summaryRail([
        ['可用余额', 'wallet'],
        ['已用额度', 'linechart'],
        ['请求次数', 'receipt']
      ])}
      <section class="overview-grid" aria-label="接入信息">
        <section class="overview-section" aria-labelledby="onboarding-title">
          <header class="panel-heading">
            <div><h2 id="onboarding-title">开始接入</h2><p>按顺序完成以下步骤，即可发起接口请求。</p></div>
          </header>
          ${desktopOnboarding()}
        </section>
        <section class="overview-section" aria-labelledby="access-title">
          <header class="panel-heading">
            <div><h2 id="access-title">接入信息</h2><p>密钥默认遮罩显示，完整内容仅在安全操作后查看。</p></div>
          </header>
          <div class="api-access-grid">${apiAccessRows()}</div>
        </section>
      </section>
      <div class="overview-lower">
        <section class="open-panel" aria-labelledby="quick-title">
          <h2 id="quick-title">快捷操作</h2>
          <p>直接进入常用任务。</p>
          <nav class="quick-grid" aria-label="快捷操作">
            ${quickActions.map(([label, iconName, href]) => `<a class="quick-item" href="${href}" style="text-decoration:none"><span class="quick-icon">${icon(iconName, 'icon-sm')}</span>${label}</a>`).join('')}
          </nav>
        </section>
        <section class="open-panel" aria-labelledby="announcement-title">
          <h2 id="announcement-title">公告与服务信息</h2>
          <p>重要通知将在此处展示。</p>
          <div class="announcement-row"><span>暂无公告</span><span class="muted number">--</span></div>
          <div class="announcement-row"><span>服务状态</span>${status('以实时状态为准', 'info')}</div>
        </section>
      </div>`

    return appShell({
      active: 'overview',
      title: '概览',
      actions: '<a class="btn" href="?screen=pricing-desktop" style="text-decoration:none">模型与价格</a><button class="btn btn-primary" type="button">创建 API 密钥</button>',
      content
    })
  }

  function logRows() {
    const rows = [
      ['--', 'gpt-4.1', 'sk-••••2A', '是', '--', '--', '--', true],
      ['--', 'claude-sonnet-4', 'sk-••••7F', '否', '--', '--', '--', false],
      ['--', 'gemini-2.5-pro', 'sk-••••31', '是', '--', '--', '--', false],
      ['--', 'deepseek-v3', 'sk-••••B8', '是', '--', '--', '--', false],
      ['--', 'gpt-4.1', 'sk-••••4D', '否', '--', '--', '--', false],
      ['--', 'gemini-2.5-flash', 'sk-••••9C', '是', '--', '--', '--', false],
      ['--', 'claude-sonnet-4', 'sk-••••11', '否', '--', '--', '--', false],
      ['--', 'text-embedding-3-large', 'sk-••••66', '否', '--', '--', '--', false],
      ['--', 'claude-haiku-3.5', 'sk-••••D3', '是', '--', '--', '--', false],
      ['--', 'gemini-2.5-pro', 'sk-••••0E', '是', '--', '--', '--', false],
      ['--', 'deepseek-v3', 'sk-••••55', '否', '--', '--', '--', false],
      ['--', 'gpt-4.1', 'sk-••••A7', '是', '--', '--', '--', false],
      ['--', 'claude-sonnet-4', 'sk-••••F2', '是', '--', '--', '--', false],
      ['--', 'gemini-2.5-flash', 'sk-••••18', '是', '--', '--', '--', false],
      ['--', 'deepseek-v3', 'sk-••••C4', '否', '--', '--', '--', false]
    ]

    return rows
      .map(
        ([time, model, token, stream, tokens, cost, duration, error]) => `
          <tr class="${error ? 'log-error-row' : ''}" ${error ? 'aria-selected="true"' : ''}>
            <td class="number">${time}</td><td>${model}${error ? ' <span class="status status-error">错误</span>' : ''}</td><td class="mono">${token}</td>
            <td>${stream}</td><td class="number">${tokens}</td><td class="number">${cost}</td><td class="number">${duration}</td>
            <td>${iconButton('chevron-right', `查看 ${model} 请求详情`, 'icon-sm')}</td>
          </tr>`
      )
      .join('')
  }

  function logsDesktop() {
    const content = `
      <section class="logs-stats" aria-label="请求摘要">
        <div class="logs-stat"><span>请求数</span><strong class="number placeholder-value">--</strong></div>
        <div class="logs-stat"><span>计费用量</span><strong class="number placeholder-value">--</strong></div>
        <div class="logs-stat"><span>Tokens</span><strong class="number placeholder-value">--</strong></div>
      </section>
      <form class="filter-toolbar" aria-label="筛选请求记录" data-static-form>
        <div class="filter-toolbar-fields">
          <button class="filter-control date" type="button">${icon('calendar', 'icon-sm')} 选择日期范围 ${icon('chevron-down', 'icon-sm')}</button>
          <button class="filter-control" type="button">全部模型 ${icon('chevron-down', 'icon-sm')}</button>
          <button class="filter-control" type="button">全部分组 ${icon('chevron-down', 'icon-sm')}</button>
          <button class="filter-control" type="button">全部类型 ${icon('chevron-down', 'icon-sm')}</button>
          <label class="filter-control">${icon('search', 'icon-sm')}<input aria-label="搜索请求记录" placeholder="搜索" style="width:82px;border:0;outline:0;background:transparent;color:inherit;font:inherit" /></label>
        </div>
        <div class="filter-toolbar-actions"><button class="btn" type="reset">重置</button><button class="btn" type="button">更多筛选</button></div>
      </form>
      <div class="logs-table-shell">
        <table class="data-table" aria-label="请求记录">
          <colgroup><col style="width:13%" /><col style="width:20%" /><col style="width:16%" /><col style="width:9%" /><col style="width:12%" /><col style="width:11%" /><col style="width:12%" /><col style="width:7%" /></colgroup>
          <thead><tr><th scope="col">时间</th><th scope="col">模型</th><th scope="col">Token</th><th scope="col">流式</th><th scope="col">Tokens</th><th scope="col">费用</th><th scope="col">耗时</th><th scope="col"><span aria-hidden="true">详情</span></th></tr></thead>
          <tbody>${logRows()}</tbody>
        </table>
        <footer class="table-footer">
          <span>共 <span class="number">--</span> 条记录</span>
          <span class="number">第 -- / -- 页</span>
        </footer>
      </div>
      <aside class="detail-drawer" aria-labelledby="drawer-title">
        <header class="drawer-header"><h2 id="drawer-title">请求详情</h2>${iconButton('close', '关闭请求详情', '', 'data-dismiss="drawer"')}</header>
        <div class="drawer-body">
          <section class="drawer-section" aria-labelledby="detail-basic"><h3 id="detail-basic">基本信息</h3><dl class="detail-list"><dt>请求 ID</dt><dd class="mono">req_••••2A</dd><dt>请求时间</dt><dd>--</dd><dt>模型</dt><dd>gpt-4.1</dd><dt>接口</dt><dd class="mono">/v1/chat/completions</dd><dt>状态</dt><dd>${status('失败', 'error')}</dd></dl></section>
          <section class="drawer-section" aria-labelledby="detail-usage"><h3 id="detail-usage">Token 用量</h3><dl class="detail-list"><dt>输入 Tokens</dt><dd class="number">--</dd><dt>输出 Tokens</dt><dd class="number">--</dd><dt>缓存 Tokens</dt><dd class="number">--</dd></dl></section>
          <section class="drawer-section" aria-labelledby="detail-billing"><h3 id="detail-billing">计费</h3><dl class="detail-list"><dt>计费方式</dt><dd>按 Token</dd><dt>请求费用</dt><dd class="number">--</dd></dl></section>
          <section class="drawer-section" aria-labelledby="detail-performance"><h3 id="detail-performance">性能</h3><dl class="detail-list"><dt>首字耗时</dt><dd class="number">--</dd><dt>总耗时</dt><dd class="number">--</dd><dt>流式响应</dt><dd>是</dd></dl></section>
          <section class="drawer-section" aria-labelledby="detail-error"><h3 id="detail-error">错误信息</h3><div class="error-box"><strong>请求未完成</strong><br />具体错误信息将在此处展示，请根据返回内容检查请求后重试。</div></section>
        </div>
      </aside>`

    return appShell({
      active: 'logs',
      title: '请求记录',
      actions: '<button class="btn" type="button">' + icon('download', 'icon-sm') + ' 导出记录</button>',
      content,
      contentClass: 'logs-content'
    })
  }

  function settingsField(id, label, value = '', placeholder = '--', full = false) {
    return `
      <div class="settings-field ${full ? 'full' : ''}">
        <label for="${id}">${label}</label>
        <input class="settings-input" id="${id}" value="${value}" placeholder="${placeholder}" />
      </div>`
  }

  function switchRow(id, title, detail, checked = false) {
    return `
      <div class="switch-row">
        <label for="${id}"><strong>${title}</strong><small>${detail}</small></label>
        <button class="switch ${checked ? 'on' : ''}" id="${id}" type="button" role="switch" aria-checked="${checked}" aria-label="${title}" style="border:0;padding:0" data-toggle="switch"></button>
      </div>`
  }

  function settingsDesktop() {
    const content = `
      <form aria-label="系统设置表单" data-static-form>
        <section class="settings-section" aria-labelledby="setting-basic">
          <div class="settings-section-heading"><h2 id="setting-basic">基本信息</h2><p>设置用户可见的站点名称、地址与主标识。</p></div>
          <div class="form-grid">${settingsField('site-name', '站点名称', 'RAPI')}${settingsField('site-url', '站点地址', 'https://cccc.asia')}${settingsField('site-logo', 'Logo 地址', '', '输入图片地址', true)}</div>
        </section>
        <section class="settings-section" aria-labelledby="setting-navigation">
          <div class="settings-section-heading"><h2 id="setting-navigation">首页与导航</h2><p>决定公共页头向用户展示的主要入口。</p></div>
          <div class="switch-list">${switchRow('nav-home', '首页', '展示公开首页入口。', true)}${switchRow('nav-console', '控制台', '展示用户工作区入口。', true)}${switchRow('nav-pricing', '模型与价格', '展示模型与价格入口。', true)}${switchRow('nav-rankings', '使用趋势', '展示公开趋势入口。', true)}${switchRow('nav-docs', '文档', '展示接口文档入口。', true)}${switchRow('nav-about', '关于', '展示站点介绍入口。', true)}</div>
        </section>
        <section class="settings-section" aria-labelledby="setting-assets">
          <div class="settings-section-heading"><h2 id="setting-assets">品牌资源</h2><p>分别提供桌面字标和移动端图标资源。</p></div>
          <div class="form-grid">${settingsField('desktop-logo', '桌面 Logo 地址', '', '上传或输入图片地址')}${settingsField('mobile-logo', '移动图标地址', '', '上传或输入图片地址')}</div>
        </section>
        <section class="settings-section" aria-labelledby="setting-footer">
          <div class="settings-section-heading"><h2 id="setting-footer">页脚说明</h2><p>展示在公共页面底部的自定义说明文字。</p></div>
          <div>
            <div class="form-grid">${settingsField('footer-text', '页脚内容', '', '输入展示在页脚的说明文字', true)}</div>
            <p class="settings-note">New API 与 QuantumNous 的项目归属信息始终保留展示，不受此设置影响。</p>
          </div>
        </section>
      </form>
      <footer class="save-rail"><span>当前页面有未保存的更改</span><div class="page-titlebar-actions"><button class="btn" type="button">放弃更改</button><button class="btn btn-primary" type="button">${icon('save', 'icon-sm')} 保存设置</button></div></footer>`

    return appShell({
      active: 'settings',
      title: '站点与品牌',
      titleExtra: '<span class="unsaved">已修改</span>',
      actions: '',
      content,
      contentClass: 'settings-content',
      mode: 'admin'
    })
  }

  function mobileModelRows() {
    const rows = [
      ['O', 'gpt-4.1', 'OpenAI', '文本生成'],
      ['A', 'claude-sonnet-4', 'Anthropic', '文本生成'],
      ['G', 'gemini-2.5-pro', 'Google', '多模态'],
      ['D', 'deepseek-v3', 'DeepSeek', '文本生成'],
      ['G', 'gemini-2.5-flash', 'Google', '多模态'],
      ['A', 'claude-haiku-3.5', 'Anthropic', '文本生成']
    ]

    return rows
      .map(
        ([mark, name, provider, capability]) => `
          <a class="mobile-model-row" href="#" style="color:inherit;text-decoration:none" aria-label="查看${name}详情">
            <div>
              <div class="mobile-model-top"><span class="model-name"><span class="model-mark">${mark}</span><strong>${name}</strong></span>${status('状态 --')}</div>
              <div class="mobile-model-meta"><span>${provider}</span><span>按 Token</span><span>${capability}</span></div>
              <div class="mobile-model-price"><span>输入 <strong class="number">--</strong></span><span>输出 <strong class="number">--</strong></span></div>
            </div>
            ${icon('chevron-right', 'icon-sm')}
          </a>`
      )
      .join('')
  }

  function pricingMobile() {
    return `
      <section class="concept mobile-concept public-page" aria-label="模型与价格移动概念">
        ${mobilePublicHeader()}
        <section class="mobile-pricing-main" aria-labelledby="mobile-pricing-title">
          <header class="mobile-pricing-title"><h1 id="mobile-pricing-title">模型与价格</h1><p>查看可用模型、计费方式与接口支持，按你的使用场景快速筛选。</p></header>
          ${searchControl('mobile-pricing-search', '搜索模型、服务商或接口类型')}
          <div class="mobile-results-toolbar">
            <div class="mobile-results-left"><button class="btn touch-btn" type="button" aria-label="打开筛选">${icon('filter')} 筛选</button><span class="results-count"><strong>--</strong> 个结果</span></div>
            <div class="mobile-results-right"><button class="btn touch-btn" type="button">排序 ${icon('chevron-down', 'icon-sm')}</button>${iconButton('table', '切换结果视图', 'touch-btn')}</div>
          </div>
          <section class="mobile-model-list" aria-label="模型列表">${mobileModelRows()}</section>
        </section>
      </section>`
  }

  function authMobile() {
    return `
      <section class="concept mobile-concept mobile-auth-screen" aria-label="登录移动概念">
        <header class="mobile-auth-header">
          <span class="mobile-wordmark" aria-label="RAPI">RAPI</span>
          <div class="mobile-header-actions">${iconButton('arrow-left', '返回首页')}${iconButton('language', '切换语言')}</div>
        </header>
        <section class="mobile-auth-body" aria-label="登录表单区域">${authForm('mobile')}</section>
      </section>`
  }

  function mobileAppHeader() {
    return `
      <header class="mobile-app-header">
        ${iconButton('menu', '打开导航菜单')}
        <div class="app-brand" aria-label="RAPI 用户控制台"><span class="app-brand-mark">R</span><span class="app-brand-name">RAPI</span></div>
        ${iconButton('bell', '查看通知')}
        <button class="avatar" type="button" aria-label="打开账户菜单" title="打开账户菜单">RA</button>
      </header>`
  }

  function mobileOverviewSteps() {
    return onboardingSteps
      .map(
        ([index, title, detail]) => `
          <div class="mobile-step-row">
            <span class="mobile-step-index">${index}</span>
            <span class="mobile-step-copy"><strong>${title}</strong><small>${detail}</small></span>
            ${icon('chevron-right', 'icon-sm')}
          </div>`
      )
      .join('')
  }

  function overviewMobile() {
    return `
      <section class="concept mobile-concept mobile-overview-screen" aria-label="用户概览移动概念">
        ${mobileAppHeader()}
        <section class="mobile-overview-body" aria-labelledby="mobile-overview-title">
          <h1 class="mobile-page-title" id="mobile-overview-title">概览</h1>
          <section class="mobile-summary" aria-label="账户摘要">
            <div class="mobile-summary-cell"><span>可用余额</span><strong class="number placeholder-value">--</strong></div>
            <div class="mobile-summary-cell"><span>已用额度</span><strong class="number placeholder-value">--</strong></div>
            <div class="mobile-summary-cell"><span>请求次数</span><strong class="number placeholder-value">--</strong></div>
          </section>
          <section class="mobile-overview-panel" aria-labelledby="mobile-start-title"><h2 id="mobile-start-title">开始接入</h2>${mobileOverviewSteps()}</section>
          <section class="mobile-overview-panel" aria-labelledby="mobile-access-title"><h2 id="mobile-access-title">接入信息</h2>${apiAccessRows(true)}</section>
          <section class="mobile-overview-panel" aria-labelledby="mobile-quick-title"><h2 id="mobile-quick-title">快捷操作</h2><nav class="mobile-quick-grid" aria-label="快捷操作">${quickActions.slice(0, 4).map(([label, iconName, href]) => `<a class="mobile-quick-item" href="${href}" style="text-decoration:none"><span class="quick-icon">${icon(iconName, 'icon-sm')}</span>${label}</a>`).join('')}</nav></section>
        </section>
      </section>`
  }

  const screens = {
    'pricing-desktop': ['模型与价格 · 桌面', pricingDesktop],
    'auth-desktop': ['登录 · 桌面', authDesktop],
    'overview-desktop': ['概览 · 桌面', overviewDesktop],
    'logs-desktop': ['请求记录 · 桌面', logsDesktop],
    'settings-desktop': ['系统设置 · 桌面', settingsDesktop],
    'pricing-mobile': ['模型与价格 · 移动', pricingMobile],
    'auth-mobile': ['登录 · 移动', authMobile],
    'overview-mobile': ['概览 · 移动', overviewMobile]
  }

  const requestedScreen = new URLSearchParams(window.location.search).get('screen')
  const activeScreen = Object.prototype.hasOwnProperty.call(screens, requestedScreen) ? requestedScreen : 'overview-desktop'
  const [screenTitle, renderScreen] = screens[activeScreen]
  const app = document.getElementById('app')

  document.title = `${screenTitle} | RAPI 全站界面概念`
  document.body.dataset.screen = activeScreen
  app.innerHTML = renderScreen()

  document.querySelectorAll('[data-static-form]').forEach((form) => {
    form.addEventListener('submit', (event) => event.preventDefault())
  })

  document.querySelectorAll('[data-dismiss="drawer"]').forEach((button) => {
    button.addEventListener('click', () => {
      const drawer = button.closest('.detail-drawer')
      if (drawer) drawer.hidden = true
    })
  })

  document.querySelectorAll('[data-toggle="switch"]').forEach((button) => {
    button.addEventListener('click', () => {
      const checked = button.getAttribute('aria-checked') === 'true'
      button.setAttribute('aria-checked', String(!checked))
      button.classList.toggle('on', !checked)
    })
  })
})()
