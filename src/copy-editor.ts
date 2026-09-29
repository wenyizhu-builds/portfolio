import { nodes, site, ui } from './content';
import './copy-editor.css';
import { registerCopyField } from './copy-binding';
type Edit = { text: string; ranges: [number, number][]; blueRanges?: [number, number][]; boldRanges?: [number, number][] };
type Lists = Record<string, string[]>;
type Archive = { lists?: Lists; revision: number; originals: Record<string, string>; edits: Record<string, Edit>; history: { lists?: Lists; at: string; edits: Record<string, Edit> }[] };
type Field = { key: string; original: string; object: Record<string, unknown>; prop: string };

export async function initCopyEditor() {
  const fields: Field[] = [];
  const excluded = new Set(['id', 'parent', 'type', 'org', 'related', 'status', 'src', 'linkedin', 'resumePdf', 'email', 'highlight', 'introHighlight']);
  function walk(object: any, path: string) {
    for (const [prop, value] of Object.entries(object)) {
      if (excluded.has(prop)) continue;
      const key = `${path}.${prop}`;
      if (typeof value === 'string') {
        fields.push({ key, original: value, object, prop });
        registerCopyField(object, prop, key);
      }
      else if (value && typeof value === 'object') walk(value, key);
    }
  }
  walk(site, 'site'); walk(ui, 'ui'); nodes.forEach(n => walk(n, `nodes.${n.id}`));
  let archive: Archive;
  try { const r = await fetch('/__copy_archive'); if (!r.ok) throw Error(); archive = await r.json(); }
  catch { alert('本地文案存档无法读取。请重启预览服务后再编辑。'); return; }
  fields.forEach(f => { if (archive.edits[f.key]) f.object[f.prop] = archive.edits[f.key].text; });
  // Stable item IDs keep edits attached to their original bullet after deletion/insertion.
  const lists = new Map<string, { items: any[]; original: string[]; objects: Map<string, any> }>();
  function registerList(key: string, items: any[]) {
    if (key.endsWith('.results')) items.forEach((item, i) => {
      if (item.metric === undefined) {
        item.metric = '';
        const fieldKey = `${key}.${i}.metric`;
        fields.push({ key: fieldKey, original: '', object: item, prop: 'metric' });
        registerCopyField(item, 'metric', fieldKey);
      }
    });
    const original = items.map((_, i) => String(i));
    lists.set(key, { items, original, objects: new Map(items.map((item, i) => [String(i), item])) });
  }
  nodes.forEach(n => {
    n.sections?.forEach((section, i) => registerList(`nodes.${n.id}.sections.${i}.items`, section.items));
    if (n.results) registerList(`nodes.${n.id}.results`, n.results);
  });
  archive.lists ??= {};
  function applyList(key: string) {
    const list = lists.get(key); if (!list) return;
    const ids = archive.lists![key] ?? list.original;
    const items = ids.map(id => {
      if (!list.objects.has(id)) {
        const item = { en: '', zh: '', ...(key.endsWith('.results') ? { metric: '' } : {}) };
        list.objects.set(id, item); walk(item, `${key}.${id}`);
      }
      const item = list.objects.get(id);
      for (const f of fields.filter(f => f.object === item)) {
        f.object[f.prop] = archive.edits[f.key]?.text ?? f.original;
      }
      return item;
    });
    list.items.splice(0, list.items.length, ...items);
  }
  // Include previously deleted additions so list history can preview and restore them after reload.
  lists.forEach((list, key) => {
    const ids = new Set([...(archive.lists![key] ?? []), ...archive.history.flatMap(h => h.lists?.[key] ?? [])]);
    ids.forEach(id => {
      if (!list.objects.has(id)) { const item = { en: '', zh: '', ...(key.endsWith('.results') ? { metric: '' } : {}) }; list.objects.set(id, item); walk(item, `${key}.${id}`); }
    });
  });
  lists.forEach((_, key) => applyList(key));
  let enabled = false, active: HTMLElement | null = null, field: Field | undefined;
  let timer = 0, pending = false, failed = false;
  let queue = Promise.resolve();
  const toolbar = document.createElement('div'); toolbar.id = 'copy-tools';
  toolbar.innerHTML = `<button data-action="toggle">✎ 编辑模式</button><span class="copy-controls" hidden><button data-action="highlight">荧光高亮</button><button data-action="blue">变蓝</button><button data-action="bold">加粗</button><button data-action="clear">清除强调</button><button data-action="original">恢复原文</button><button data-action="history">历史版本</button><button data-action="export">导出全部存档</button><span id="copy-count">点选页面文字直接编辑</span></span><span id="copy-status">仅本地</span>`;
  document.body.append(toolbar);
  const status = toolbar.querySelector<HTMLElement>('#copy-status')!;
  function count() {
    const text = active?.innerText || '';
    toolbar.querySelector('#copy-count')!.textContent = `${Array.from(text).length} 字符 · ${text.trim().split(/\s+/).filter(Boolean).length} 词`;
  }
  function save() {
    clearTimeout(timer);
    const edits = structuredClone(archive.edits);
    const savedLists = structuredClone(archive.lists);
    pending = true; status.textContent = '正在保存…';
    queue = queue.then(async () => {
      if (failed) return;
      try {
        const response = await fetch('/__copy_archive', { method: 'POST', headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ revision: archive.revision, originals: Object.fromEntries(fields.map(f => [f.key, f.original])), edits, lists: savedLists }) });
        if (!response.ok) throw Error(response.status === 409 ? '另一个窗口已修改，请先导出备份，再刷新' : '保存失败，请导出备份');
        const result = await response.json(); archive.revision = result.revision;
        archive.history.push({ at: new Date().toISOString(), edits, lists: savedLists }); pending = false;
        status.textContent = '已保存到本地';
      } catch (error) { failed = true; status.textContent = String(error); }
    });
  }
  function readEdit(el: HTMLElement): Edit {
    // Normalize browser-created div/br paragraphs to explicit newlines first.
    const text = el.innerText.replace(/\r/g, '');
    const ranges: [number, number][] = [];
    const blueRanges: [number, number][] = [];
    const boldRanges: [number, number][] = [];
    for (const mark of el.querySelectorAll('mark.copy-highlight, .copy-blue, .copy-bold')) {
      const range = document.createRange(); range.selectNodeContents(el); range.setEndBefore(mark);
      const start = range.toString().length;
      const end = start + (mark.textContent || '').length;
      if (end > start && end <= text.length) {
        if (mark.classList.contains('copy-highlight')) ranges.push([start, end]);
        if (mark.classList.contains('copy-blue')) blueRanges.push([start, end]);
        if (mark.classList.contains('copy-bold')) boldRanges.push([start, end]);
      }
    }
    return { text, ranges, blueRanges, boldRanges };
  }
  function changed() {
    if (!active || !field) return;
    archive.edits[field.key] = readEdit(active); field.object[field.prop] = archive.edits[field.key].text;
    count(); pending = true; status.textContent = '未保存…'; clearTimeout(timer); timer = window.setTimeout(save, 600);
  }
  function paint(el: Element, edit: Edit) {
    el.replaceChildren();
    const blue = edit.blueRanges ?? [];
    const bold = edit.boldRanges ?? [];
    const boundaries = [...new Set([0, edit.text.length, ...edit.ranges.flat(), ...blue.flat(), ...bold.flat()])].sort((a,b) => a-b);
    for (let i = 0; i < boundaries.length - 1; i++) {
      const start = boundaries[i], end = boundaries[i + 1];
      const highlighted = edit.ranges.some(([a,b]) => a <= start && b >= end);
      const emphasized = blue.some(([a,b]) => a <= start && b >= end);
      const strong = bold.some(([a,b]) => a <= start && b >= end);
      const text = edit.text.slice(start, end);
      if (!highlighted && !emphasized && !strong) { el.append(document.createTextNode(text)); continue; }
      const span = document.createElement(highlighted ? 'mark' : 'span');
      if (highlighted) span.classList.add('copy-highlight');
      if (emphasized) span.classList.add('copy-blue');
      if (strong) span.classList.add('copy-bold');
      span.textContent = text; el.append(span);
    }
  }

  const normalize = (s: string) => s.replace(/\s+/g, ' ').trim();
  function matching(el: Element) {
    const known = (el as HTMLElement).dataset?.copyField;
    if (known) return fields.find(f => f.key === known);
    const text = normalize(el.textContent || '').replace(/^•\s*/, '');
    return fields.find(f => text && normalize(String(f.object[f.prop])) === text);
  }
  function finish() {
    if (!active) return;
    active.contentEditable = 'false'; active.removeAttribute('data-copy-active');
    active = null; field = undefined;
    if (pending) save();
    document.querySelectorAll('foreignObject:has(.copy-map-text)').forEach(el => el.remove());
    document.querySelectorAll<SVGElement>('text.lbl, text.lbl-halo').forEach(el => el.style.visibility = '');
    window.dispatchEvent(new Event('copy-preview'));
  }
  function activate(el: HTMLElement, f: Field) {
    if (active === el) return;
    if (active) { active.contentEditable = 'false'; active.removeAttribute('data-copy-active'); if (pending) save(); }
    active = el; field = f; el.contentEditable = 'true'; el.dataset.copyActive = 'true'; el.spellcheck = true;
    el.oninput = changed;
    el.onkeydown = e => {
      e.stopPropagation();
      if (e.key === 'Enter') { e.preventDefault(); document.execCommand('insertText', false, '\n'); }
      if (e.key === 'Escape') { e.preventDefault(); finish(); }
    };
    el.onpaste = e => { e.preventDefault(); document.execCommand('insertText', false, e.clipboardData?.getData('text/plain') || ''); };
    el.focus(); count();
  }
  for (const type of ['pointerdown', 'pointerup']) document.addEventListener(type, e => {
    if (enabled && (e.target as Element).closest('svg text, .copy-map-text')) e.stopPropagation();
  }, true);
  // A small toolbar; text is edited in its existing page position, not in a form.
  document.addEventListener('click', e => {
    if (!enabled || (e.target as Element).closest('.copy-list-controls, .copy-bullet-delete') || toolbar.contains(e.target as Node) || (e.target as Element).closest('.copy-history')) return;
    let el = e.target as Element;
    if (active?.contains(el)) { e.stopPropagation(); return; }
    while (el && el.id !== 'app' && el !== document.body) {
      if (el.closest('svg')) {
        const label = el.closest('g')?.querySelector('text.lbl') || (el.tagName === 'text' ? el : null);
        if (label) {
          const id = label.closest<SVGElement>('[data-id]')?.dataset.id;
          const language = document.documentElement.lang === 'zh-CN' ? 'zh' : 'en';
          const f = fields.find(f => f.key === `nodes.${id}.label.${language}`) || fields.find(f => f.key === `nodes.${id}.label.en`);
          if (f) {
            e.preventDefault(); e.stopPropagation();
            const box = (label as SVGGraphicsElement).getBBox();
            const foreign = document.createElementNS('http://www.w3.org/2000/svg', 'foreignObject');
            const width = Math.max(box.width + 24, 160);
            foreign.setAttribute('x', String(box.x + box.width / 2 - width / 2)); foreign.setAttribute('y', String(box.y - 3));
            foreign.setAttribute('width', String(width)); foreign.setAttribute('height', '160');
            const input = document.createElement('div'); input.className = 'copy-map-text'; input.textContent = String(f.object[f.prop]);
            foreign.append(input); label.parentElement!.append(foreign);
            (label as SVGElement).style.visibility = 'hidden';
            label.parentElement!.querySelectorAll('.lbl-halo').forEach(x => (x as SVGElement).style.visibility = 'hidden');
            activate(input, f); return;
          }
        }
      }
      if (el instanceof HTMLElement && !el.querySelector('button, a, input, details, svg')) {
        const f = matching(el);
        if (f) { e.preventDefault(); e.stopPropagation(); activate(el, f); return; }
      }
      el = el.parentElement!;
    }
    finish();
  }, true);
  toolbar.addEventListener('mousedown', e => { if (['highlight', 'blue', 'bold', 'clear'].includes((e.target as HTMLElement).dataset.action || '')) e.preventDefault(); });
  toolbar.addEventListener('click', async e => {
    const action = (e.target as HTMLElement).closest<HTMLElement>('[data-action]')?.dataset.action;
    if (action === 'toggle') {
      if (enabled) {
        if (active && field) changed();
        save(); await queue; if (failed) return;
      }
      finish(); enabled = !enabled; document.body.classList.toggle('copy-editing', enabled);
      toolbar.querySelector<HTMLElement>('.copy-controls')!.hidden = !enabled;
      toolbar.querySelector('[data-action="toggle"]')!.textContent = enabled ? '✓ 保存并预览' : '✎ 编辑模式';
      status.textContent = enabled ? '编辑模式 · 点选原文' : '已保存 · 预览模式';
      decorate();
    }
    if ((action === 'highlight' || action === 'blue' || action === 'bold') && active) {
      const selection = getSelection();
      if (!selection?.rangeCount || selection.isCollapsed) { status.textContent = '先选中需要设置样式的文字'; return; }
      const range = selection.getRangeAt(0);
      if (!active.contains(range.commonAncestorContainer)) return;
      const mark = document.createElement(action === 'highlight' ? 'mark' : 'span'); mark.className = action === 'bold' ? 'copy-bold' : action === 'blue' ? 'copy-blue' : 'copy-highlight'; mark.append(range.extractContents()); range.insertNode(mark); selection.removeAllRanges(); changed();
    }
    if (action === 'clear' && active) { active.querySelectorAll('mark.copy-highlight, .copy-blue, .copy-bold').forEach(m => m.replaceWith(...m.childNodes)); changed(); }
    if (action === 'original' && active && field) { paint(active, { text: archive.originals[field.key] ?? field.original, ranges: [] }); changed(); }
    if (action === 'export') {
      const blob = new Blob([JSON.stringify({ ...archive, originals: { ...Object.fromEntries(fields.map(f => [f.key, f.original])), ...archive.originals } }, null, 2)], { type: 'application/json' });
      const link = document.createElement('a'); link.href = URL.createObjectURL(blob); link.download = `portfolio-copy-${new Date().toISOString().slice(0,10)}.json`; link.click(); setTimeout(() => URL.revokeObjectURL(link.href), 1000);
    }
    if (action === 'history') {
      if (!field || !active) { status.textContent = '先点选一段文字，再查看它的历史'; return; }
      const selectedField = field, selectedElement = active;
      const dialog = document.createElement('dialog'); dialog.className = 'copy-history';
      const heading = document.createElement('h3'); heading.textContent = '这段文字的原文与保存版本'; dialog.append(heading);
      const versions = [{ at: '原文', edit: { text: archive.originals[field.key] ?? field.original, ranges: [] } as Edit },
        ...archive.history.filter(h => h.edits[selectedField.key]).map(h => ({ at: h.at, edit: h.edits[selectedField.key] }))];
      const seen = new Set<string>();
      for (const v of versions.reverse()) {
        const signature = JSON.stringify(v.edit); if (seen.has(signature)) continue; seen.add(signature);
        const card = document.createElement('section'); const p = document.createElement('p'); paint(p, v.edit);
        const restore = document.createElement('button'); restore.textContent = `${v.at} · 恢复此版本`;
        restore.onclick = () => { active = selectedElement; field = selectedField; paint(active, v.edit); changed(); dialog.close(); dialog.remove(); active.focus(); };
        card.append(restore, p); dialog.append(card);
      }
      const close = document.createElement('button'); close.textContent = '关闭'; close.onclick = () => { dialog.close(); dialog.remove(); }; dialog.append(close); document.body.append(dialog); dialog.showModal();
    }
  });
  function refreshList(key: string) {
    if (active && field) changed();
    finish(); applyList(key); save();
    window.dispatchEvent(new Event('copy-preview'));
  }
  function listHistory(key: string) {
    const list = lists.get(key)!;
    if (active && field) changed();
    finish();
    const dialog = document.createElement('dialog'); dialog.className = 'copy-history';
    const heading = document.createElement('h3'); heading.textContent = '列表历史（条数、文字和强调样式）'; dialog.append(heading);
    const versions = [{ at: '原始列表', edits: {} as Record<string, Edit>, lists: { [key]: list.original } }, ...archive.history];
    const seen = new Set<string>();
    for (const version of versions.reverse()) {
      const ids = version.lists?.[key] ?? list.original;
      const entries = ids.map(id => ({ id, fields: fields.filter(f => f.key.startsWith(`${key}.${id}.`)) }));
      const snapshot = entries.map(entry => entry.fields.map(f => version.edits[f.key] ?? { text: f.original, ranges: [] }));
      const signature = JSON.stringify([ids, snapshot]); if (seen.has(signature)) continue; seen.add(signature);
      const card = document.createElement('section');
      const restore = document.createElement('button'); restore.textContent = `${version.at} · 恢复 ${ids.length} 条`;
      restore.onclick = () => {
        for (const f of fields.filter(f => f.key.startsWith(key + '.'))) {
          if (version.edits[f.key]) archive.edits[f.key] = structuredClone(version.edits[f.key]);
          else delete archive.edits[f.key];
        }
        archive.lists![key] = [...ids]; dialog.close(); dialog.remove(); refreshList(key);
      };
      card.append(restore);
      snapshot.forEach(parts => { const p = document.createElement('p'); p.textContent = parts.map(e => e.text).filter(Boolean).join(' · '); card.append(p); });
      dialog.append(card);
    }
    const close = document.createElement('button'); close.textContent = '关闭'; close.onclick = () => { dialog.close(); dialog.remove(); }; dialog.append(close);
    document.body.append(dialog); dialog.showModal();
  }
  function decorateLists() {
    document.querySelectorAll<HTMLElement>('[data-copy-list]').forEach(ul => {
      const key = ul.dataset.copyList!, list = lists.get(key); if (!list) return;
      ul.querySelectorAll('.copy-bullet-delete').forEach(el => el.remove());
      ul.nextElementSibling?.matches('.copy-list-controls') && ul.nextElementSibling.remove();
      if (!enabled) return;
      const ids = archive.lists![key] ?? list.original;
      Array.from(ul.children).forEach((li, index) => {
        const button = document.createElement('button'); button.className = 'copy-bullet-delete'; button.textContent = '− 删除';
        button.setAttribute('aria-label', `删除第 ${index + 1} 条`);
        button.onclick = e => { e.preventDefault(); e.stopPropagation(); archive.lists![key] = ids.filter(id => id !== ids[index]); refreshList(key); };
        for (const [offset, label] of [[-1, '↑ 上移'], [1, '↓ 下移']] as const) {
          const move = document.createElement('button'); move.className = 'copy-bullet-delete'; move.textContent = label;
          move.disabled = index + offset < 0 || index + offset >= ids.length;
          move.onclick = e => {
            e.preventDefault(); e.stopPropagation();
            const order = [...ids]; [order[index], order[index + offset]] = [order[index + offset], order[index]];
            archive.lists![key] = order; refreshList(key);
          };
          li.append(move);
        }
        li.append(button);
      });
      const controls = document.createElement('div'); controls.className = 'copy-list-controls';
      const add = document.createElement('button'); add.textContent = '+ 新增一条';
      add.onclick = () => {
        const id = `added-${crypto.randomUUID()}`;
        archive.lists![key] = [...ids, id]; refreshList(key);
        requestAnimationFrame(() => {
          const el = document.querySelector<HTMLElement>(`[data-copy-field="${key}.${id}.en"]`);
          const f = fields.find(f => f.key === `${key}.${id}.en`);
          if (el && f) activate(el, f);
        });
      };
      const history = document.createElement('button'); history.textContent = '列表历史 / 恢复'; history.onclick = () => listHistory(key);
      controls.append(add, history); ul.after(controls);
    });
  }
  // Reapply saved highlights after route/language changes; never disturb the caret.
  let decorating = false;
  function decorate() {
    if (decorating) return;
    decorating = true; observer.disconnect();
    document.querySelectorAll<HTMLElement>('#app p, #app li, #app h1, #app h2, #app h3, #app span, #app a, #app b, #app strong, #app small, #app div, #app summary').forEach(el => {
      if (el.querySelector('[data-copy-field]') || el.parentElement?.closest('[data-copy-field]')) return;
      if (el.closest('.copy-list-controls, .copy-bullet-delete')) return;
      if (el.closest('.sr-only') || el === active || el.contains(active) || active?.contains(el) || el.querySelector('a, button, svg, li, p')) return;
      const f = matching(el); const edit = f && archive.edits[f.key];
      if (f && !el.querySelector('[data-copy-field]')) {
        el.dataset.copyField = f.key;
        el.contentEditable = String(enabled);
        if (enabled) { el.setAttribute('role', 'textbox'); el.setAttribute('aria-label', f.key); }
        else { el.removeAttribute('role'); el.removeAttribute('aria-label'); }
        el.onfocus = () => { if (enabled) activate(el, f); };
      }
      if (edit && el.dataset.copyPaint !== JSON.stringify(edit)) { paint(el, edit); el.style.whiteSpace = 'pre-wrap'; el.dataset.copyPaint = JSON.stringify(edit); }
    });
    decorateLists();
    observer.observe(document.getElementById('app')!, { childList: true, subtree: true }); decorating = false;
  }
  const observer = new MutationObserver(decorate);
  observer.observe(document.getElementById('app')!, { childList: true, subtree: true });
  status.textContent = '仅本地 · 就绪';
  window.addEventListener('beforeunload', e => { if (pending || failed) { e.preventDefault(); e.returnValue = ''; } });
}
