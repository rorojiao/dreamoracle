/* DreamOracle shared client code (no build step). */

const DO = (() => {
  const LS_LANG = 'dreamoracle_lang';
  const LS_JOURNAL = 'dreamoracle_journal_v1';

  const i18n = {
    en: {
      nav_home: 'Home',
      nav_search: 'Search',
      nav_journal: 'Journal',
      nav_random: 'Daily Dream',
      nav_lang: '中文',

      brand_tag: 'Dream meaning & interpretation',
      home_title: 'DreamOracle',
      home_sub: 'Search dream symbols, log your dreams, and explore gentle interpretations rooted in psychology and culture.',
      home_placeholder: 'Try: flying, falling, water, snake, teeth…',
      home_go: 'Interpret',
      home_hint: 'Tip: Press',
      home_hint2: 'to search quickly.',

      search_title: 'Dream Meaning Search',
      search_sub: 'Type a symbol or theme. We match common dream symbols and provide a psychological reading plus a cultural angle.',
      search_placeholder: 'Enter a keyword (e.g., flying)',
      search_examples: 'Popular:',
      search_empty: 'No matches. Try a broader keyword, or a synonym.',
      search_count: 'Results',

      label_psych: 'Psychology',
      label_culture: 'Culture',
      label_keywords: 'Keywords',

      journal_title: 'Dream Journal',
      journal_sub: 'Write down your dreams while they are fresh. Stored only on this device (localStorage).',
      journal_date: 'Date',
      journal_title2: 'Title (optional)',
      journal_text: 'Dream description',
      journal_save: 'Save Entry',
      journal_saved: 'Saved.',
      journal_list: 'Entries',
      journal_stats: 'Common elements',
      journal_none: 'No entries yet. Add your first dream.',
      journal_delete: 'Delete',

      random_title: 'Daily Dream',
      random_sub: 'A gentle prompt for reflection. The symbol is randomly selected but consistent for today.',
      random_refresh: 'New random',
      donate_title: 'Support',
      donate_text: 'If DreamOracle helped you, you can tip via',
      donate_copy: 'Copy',
      donate_copied: 'Copied',
      disclaimer: 'Note: Interpretations are reflective prompts, not medical advice.'
    },
    zh: {
      nav_home: '首页',
      nav_search: '搜索解读',
      nav_journal: '梦境日记',
      nav_random: '每日一梦',
      nav_lang: 'EN',

      brand_tag: '解梦含义与象征工具',
      home_title: 'DreamOracle',
      home_sub: '搜索梦境符号、记录梦境、用心理学与文化视角获得温柔的自我理解。',
      home_placeholder: '试试：飞行、坠落、水、蛇、牙齿…',
      home_go: '开始解读',
      home_hint: '小技巧：按',
      home_hint2: '可快速搜索。',

      search_title: '梦境搜索解读',
      search_sub: '输入象征或主题，匹配常见梦境符号，并给出心理学解读与文化含义。',
      search_placeholder: '输入关键词（例如：snake / 蛇）',
      search_examples: '热门：',
      search_empty: '没有匹配结果。试试更宽泛的词，或换个同义词。',
      search_count: '结果',

      label_psych: '心理学解读',
      label_culture: '文化含义',
      label_keywords: '关键词',

      journal_title: '梦境日记',
      journal_sub: '趁记忆新鲜记录下来。数据仅保存在本设备（localStorage）。',
      journal_date: '日期',
      journal_title2: '标题（可选）',
      journal_text: '梦境内容',
      journal_save: '保存记录',
      journal_saved: '已保存。',
      journal_list: '记录列表',
      journal_stats: '常见元素统计',
      journal_none: '还没有记录，先写下第一个梦吧。',
      journal_delete: '删除',

      random_title: '每日一梦',
      random_sub: '给自己一个温柔的反思提示。符号随机，但在今天保持一致。',
      random_refresh: '换一个',
      donate_title: '打赏支持',
      donate_text: '如果 DreamOracle 对你有帮助，可以通过以下地址打赏：',
      donate_copy: '复制',
      donate_copied: '已复制',
      disclaimer: '提示：解读用于自我反思，不替代医疗或专业诊断。'
    }
  };

  function getLang() {
    const v = (localStorage.getItem(LS_LANG) || '').toLowerCase();
    if (v === 'zh' || v === 'en') return v;
    const nav = (navigator.language || 'en').toLowerCase();
    return nav.startsWith('zh') ? 'zh' : 'en';
  }

  function setLang(lang) {
    localStorage.setItem(LS_LANG, lang);
    applyI18n(lang);
  }

  function t(key) {
    const lang = getLang();
    return (i18n[lang] && i18n[lang][key]) || (i18n.en[key] || key);
  }

  function applyI18n(lang) {
    document.documentElement.setAttribute('lang', lang);
    const nodes = document.querySelectorAll('[data-i18n]');
    for (const el of nodes) {
      const k = el.getAttribute('data-i18n');
      const v = (i18n[lang] && i18n[lang][k]) || (i18n.en[k] || '');
      if (!v) continue;
      if (el.hasAttribute('data-i18n-placeholder')) {
        el.setAttribute('placeholder', v);
      } else {
        el.textContent = v;
      }
    }

    const titleNodes = document.querySelectorAll('[data-i18n-title]');
    for (const el of titleNodes) {
      const k = el.getAttribute('data-i18n-title');
      const v = (i18n[lang] && i18n[lang][k]) || (i18n.en[k] || '');
      if (!v) continue;
      el.setAttribute('title', v);
    }

    const langBtn = document.querySelector('[data-lang-toggle]');
    if (langBtn) langBtn.textContent = t('nav_lang');
  }

  function initLangToggle() {
    const btn = document.querySelector('[data-lang-toggle]');
    if (!btn) return;
    btn.addEventListener('click', () => {
      const next = getLang() === 'en' ? 'zh' : 'en';
      setLang(next);
      // rerender any page-specific components if they expose hooks
      window.dispatchEvent(new CustomEvent('dreamoracle:lang'));
    });
  }

  function setActiveNav() {
    const path = (location.pathname.split('/').pop() || 'index.html').toLowerCase();
    const map = {
      'index.html': 'home',
      'search.html': 'search',
      'journal.html': 'journal',
      'random.html': 'random'
    };
    const key = map[path] || 'home';
    const el = document.querySelector(`[data-nav="${key}"]`);
    if (el) el.setAttribute('aria-current', 'page');
  }

  function qs(name) {
    const u = new URL(location.href);
    return u.searchParams.get(name) || '';
  }

  function setQs(name, value) {
    const u = new URL(location.href);
    if (!value) u.searchParams.delete(name);
    else u.searchParams.set(name, value);
    history.replaceState({}, '', u.toString());
  }

  function escapeHtml(s) {
    return String(s)
      .replaceAll('&', '&amp;')
      .replaceAll('<', '&lt;')
      .replaceAll('>', '&gt;')
      .replaceAll('"', '&quot;')
      .replaceAll("'", '&#39;');
  }

  async function loadSymbols() {
    const res = await fetch('./data/symbols.json', { cache: 'no-store' });
    if (!res.ok) throw new Error('Failed to load symbols');
    return await res.json();
  }

  function normalize(s) {
    return String(s || '').trim().toLowerCase();
  }

  function copyText(text) {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      return navigator.clipboard.writeText(text);
    }
    const ta = document.createElement('textarea');
    ta.value = text;
    ta.setAttribute('readonly', '');
    ta.style.position = 'fixed';
    ta.style.left = '-9999px';
    document.body.appendChild(ta);
    ta.select();
    document.execCommand('copy');
    document.body.removeChild(ta);
    return Promise.resolve();
  }

  function renderDonate() {
    const addr = '0xEeD903787Cb86bcCc17777E5C7d10A4c2De43823';
    const elAddr = document.querySelector('[data-donate-addr]');
    if (elAddr) elAddr.textContent = addr;
    const btn = document.querySelector('[data-donate-copy]');
    if (btn) {
      btn.addEventListener('click', async () => {
        try {
          await copyText(addr);
          const prev = btn.textContent;
          btn.textContent = t('donate_copied');
          setTimeout(() => (btn.textContent = prev), 900);
        } catch (_) {
          // ignore
        }
      });
    }
  }

  /* Journal */
  function readJournal() {
    try {
      const raw = localStorage.getItem(LS_JOURNAL);
      if (!raw) return [];
      const arr = JSON.parse(raw);
      if (!Array.isArray(arr)) return [];
      return arr;
    } catch (_) {
      return [];
    }
  }

  function writeJournal(entries) {
    localStorage.setItem(LS_JOURNAL, JSON.stringify(entries));
  }

  function id() {
    return 'd_' + Math.random().toString(16).slice(2) + '_' + Date.now().toString(16);
  }

  function todayISO() {
    const d = new Date();
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${y}-${m}-${day}`;
  }

  return {
    i18n,
    t,
    getLang,
    setLang,
    applyI18n,
    initLangToggle,
    setActiveNav,
    qs,
    setQs,
    escapeHtml,
    loadSymbols,
    normalize,
    renderDonate,
    readJournal,
    writeJournal,
    id,
    todayISO
  };
})();

window.addEventListener('DOMContentLoaded', () => {
  DO.applyI18n(DO.getLang());
  DO.initLangToggle();
  DO.setActiveNav();
  DO.renderDonate();
});
