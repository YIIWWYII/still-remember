import React, { useEffect, useRef, useState } from 'react';
import { animate, stagger } from 'animejs';
import { ArrowUpRight, ArrowRight, ArrowLeft, Plus, Search, X, Bookmark, Globe2, LockKeyhole, ChevronRight, ChevronLeft, Feather, Check, Download, Trash2, Pause, Play, CalendarDays, Menu, Pencil } from 'lucide-react';
import { memories, categories, categoryOf, imageOf, formatDate, memoryDate, timeKey, chronologicalValue, matchesTime, eras } from './data';
import './styles.css';
import Support from './Support';
import { districts, districtOf, themeOf, needsSupport } from './data';

const readLocal = (key, fallback) => {
  try { return JSON.parse(localStorage.getItem(key)) ?? fallback; }
  catch { return fallback; }
};
const initialRoute = () => window.location.hash.slice(1) || '/';
const today = () => new Date().toLocaleDateString('sv-SE');
const reducedMotion = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches;

function IconButton({ label, children, className = '', ...props }) {
  return <button type="button" className={`icon-button ${className}`} aria-label={label} title={label} {...props}>{children}</button>;
}

function Modal({ title, onClose, children, className = '' }) {
  const ref = useRef(null);
  useEffect(() => {
    const dialog = ref.current;
    const previous = document.activeElement;
    dialog.showModal();
    const oldOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = oldOverflow; if (previous?.isConnected) previous.focus(); };
  }, []);
  return <dialog ref={ref} className={`modal ${className}`} onCancel={(event) => { event.preventDefault(); onClose(); }} onClick={(event) => { if (event.target === ref.current) { const box = ref.current.getBoundingClientRect(); if (event.clientX < box.left || event.clientX > box.right || event.clientY < box.top || event.clientY > box.bottom) onClose(); } }} aria-label={title}>
    <div className="modal-heading"><h2>{title}</h2><IconButton label="关闭" onClick={onClose}><X size={20} /></IconButton></div>
    {children}
  </dialog>;
}

function MemoryCard({ memory, bookmarked, onBookmark, onOpen, index }) {
  return <article className="memory-card" data-reveal>
    <div className={`memory-image-wrap ${memory.sources ? 'documentary-image' : ''}`}>
      <button className="image-link" onClick={() => onOpen(memory.id)} aria-label={`阅读：${memory.title}`}>
        <img src={imageOf(memory.image)} alt={memory.title} loading={index < 3 ? 'eager' : 'lazy'} />
        <span className="image-open"><ArrowUpRight size={21} /></span>
      </button>
      <span className="image-caption">{categoryOf(memory.category).label} · {memory.format || '一份记忆'}</span>
      <IconButton label={bookmarked ? '取消珍藏' : '珍藏这份记忆'} className={`save-button ${bookmarked ? 'is-saved' : ''}`} onClick={() => onBookmark(memory.id)}><Bookmark size={17} fill={bookmarked ? 'currentColor' : 'none'} /></IconButton>
    </div>
    <div className="memory-meta"><span>{memoryDate(memory)}</span><span>{memory.sources ? '公开资料 · 有来源' : '虚构示例'}</span></div>
    <button className="card-title" onClick={() => onOpen(memory.id)}><h3>{memory.title}</h3></button>
    <p>{memory.excerpt}</p>
  </article>;
}

function TimeRail({ parts, data, navigate, motion }) {
  const strip = useRef(null);
  const [year, month, day] = parts;
  const era = eras[year];
  let items = [];
  if (!year) {
    items = [...new Set(data.map(timeKey))].sort((a, b) => (eras[a]?.order ?? Number(a)) - (eras[b]?.order ?? Number(b))).map((value) => ({ value, label: eras[value]?.dateLabel || value, count: data.filter((item) => timeKey(item) === value).length }));
  } else if (era) {
    items = data.filter((item) => item.era === year).map((item) => ({ value: item.id, label: item.format, count: 1 }));
  } else if (!month) {
    items = Array.from({ length: 12 }, (_, i) => { const value = String(i + 1).padStart(2, '0'); return { value, label: `${i + 1}月`, count: data.filter((item) => item.date.startsWith(`${year}-${value}`)).length }; });
  } else {
    const days = new Date(Number(year), Number(month), 0).getDate();
    items = Array.from({ length: days }, (_, i) => { const value = String(i + 1).padStart(2, '0'); return { value, label: String(i + 1).padStart(2, '0'), count: data.filter((item) => item.date === `${year}-${month}-${value}`).length }; });
  }
  const path = (value) => era ? `/memory/${value}` : !year ? `/time/${value}` : !month ? `/time/${year}/${value}` : `/time/${year}/${month}/${value}`;
  useEffect(() => {
    const active = strip.current?.querySelector('[data-active="true"], .highlight') || strip.current?.querySelector('[data-populated="true"]');
    if (active && strip.current) strip.current.scrollLeft = active.offsetLeft - strip.current.offsetLeft - strip.current.clientWidth / 2 + active.clientWidth / 2;
    if (!motion || reducedMotion()) return;
    const animation = animate(strip.current, { opacity: [.3, 1], scale: [.96, 1], duration: 750, ease: 'out(3)' });
    return () => animation.revert();
  }, [year, month, day, motion]);
  return <div className="time-navigation">
    <div className="rail-heading"><span><i className="status-dot" />{era ? era.dateLabel : !year ? '时间长河' : !month ? `${year} 年 · 十二个月` : `${year} 年 ${Number(month)} 月`}</span><span className="rail-unit">{era ? '地质与宇宙年代 · 近似时间' : !year ? '年代与年份 · 按先后排列' : !month ? '以月为刻度' : '以日为刻度'}</span></div>
    <div className="rail-controls">
      <IconButton label="向更早的时间滚动" onClick={() => strip.current.scrollBy({ left: -320, behavior: reducedMotion() ? 'instant' : 'smooth' })}><ChevronLeft size={18} /></IconButton>
      <div className={`time-rail ${!year ? 'year-rail' : ''}`} ref={strip}>
        {items.map((item) => <button key={item.value} className={`time-point ${era || eras[item.value] ? 'era-point' : ''} ${item.count ? 'has-records' : ''} ${day === item.value || (!year && item.value === '2026') ? 'highlight' : ''}`} data-active={day === item.value} data-populated={item.count > 0} aria-label={era || eras[item.value] ? `${item.label}，${item.count}份档案` : `${year ? `${year}年` : ''}${month ? `${Number(month)}月` : ''}${item.label}${!year ? '年' : month ? '日' : ''}，${item.count}份记忆`} onClick={() => navigate(path(item.value))}>
          <span className="time-count">{item.count > 0 ? `${item.count} 份记忆` : ' '}</span><span className="time-tick" /><span className="time-label">{item.label}</span>
        </button>)}
      </div>
      <IconButton label="向更近的时间滚动" onClick={() => strip.current.scrollBy({ left: 320, behavior: reducedMotion() ? 'instant' : 'smooth' })}><ChevronRight size={18} /></IconButton>
    </div>
  </div>;
}

function Composer({ initial, onClose, onSave }) {
  const [writingCategory, setWritingCategory] = useState(initial?.category || 'people');
  const [visibility, setVisibility] = useState(initial?.visibility || 'private');
  const [error, setError] = useState('');
  function submit(event) {
    event.preventDefault();
    const fields = Object.fromEntries(new FormData(event.currentTarget));
    if (!fields.title.trim() || !fields.body.trim()) { setError('请写下标题和想留下的话。'); return; }
    const result = onSave({ ...initial, ...fields, title: fields.title.trim(), body: fields.body.trim(), visibility, id: initial?.id || `local-${crypto.randomUUID()}`, author: fields.author.trim() || '未署名', format: '一份记忆', image: categoryOf(fields.category).image, excerpt: fields.body.trim().slice(0, 80), local: true });
    if (!result) setError('未能保存，请下载或复制内容后重试。');
  }
  return <Modal title={initial?.id ? '继续写这份记忆' : '留下一份记忆'} onClose={onClose} className="composer-modal">
    {needsSupport(writingCategory) && <Support compact />}
    <form onSubmit={submit}>
      <div className="form-row"><label>关于什么<select name="category" value={writingCategory} onChange={(event) => setWritingCategory(event.target.value)}>{categories.slice(1).map((category) => <option key={category.id} value={category.id}>{category.label}</option>)}</select></label><label>记忆的日期<input type="date" name="date" required defaultValue={initial?.date || today()} min="0001-01-01" max="9999-12-31" /></label></div>
      <label>给这份记忆一个名字<input name="title" maxLength={60} placeholder="比如：外婆的窗边，总有阳光" required defaultValue={initial?.title || ''} /></label>
      <label>想留下的话<textarea name="body" rows={7} maxLength={12000} placeholder="从你记得的一件小事开始……" required defaultValue={initial?.body || ''} /></label>
      <div className="form-row"><label>你的署名<input name="author" maxLength={30} placeholder="可以用昵称" defaultValue={initial?.author || ''} /></label><label>写给谁<input name="recipient" maxLength={60} placeholder="世界、某个人，或未来的自己" defaultValue={initial?.recipient || ''} /></label></div>
      <fieldset className="visibility-picker"><legend>将来希望谁能看见</legend><label className={visibility === 'private' ? 'selected' : ''}><input type="radio" name="visibility" value="private" checked={visibility === 'private'} onChange={() => setVisibility('private')} /><LockKeyhole size={17} /><span>私人</span></label><label className={visibility === 'public' ? 'selected' : ''}><input type="radio" name="visibility" value="public" checked={visibility === 'public'} onChange={() => setVisibility('public')} /><Globe2 size={17} /><span>公开</span></label></fieldset>
      <p className="form-note">草稿仅保存在此浏览器，尚未上传或公开。请勿将此处作为唯一备份。</p>
      {error && <p role="alert" className="form-error">{error}</p>}
      <div className="form-actions"><button type="button" className="text-button" onClick={onClose}>取消</button><button className="primary-button" type="submit"><Check size={17} />保存草稿</button></div>
    </form>
  </Modal>;
}

function App() {
  const [route, setRoute] = useState(initialRoute);
  const [filter, setFilter] = useState('all');
  const [modal, setModal] = useState(null);
  const [query, setQuery] = useState('');
  const [bookmarks, setBookmarks] = useState(() => readLocal('remember-bookmarks', []));
  const [drafts, setDrafts] = useState(() => readLocal('remember-drafts', []));
  const [mineTab, setMineTab] = useState('drafts');
  const [sort, setSort] = useState('curated');
  const [toast, setToast] = useState('');
  const [menuOpen, setMenuOpen] = useState(false);
  const [motion, setMotion] = useState(() => !reducedMotion());
  const main = useRef(null);
  const heroImage = useRef(null);
  const savedScroll = useRef(new Map());
  const [routePath, routeQuery = ''] = route.split('?');
  const [section, ...segments] = routePath.split('/').filter(Boolean);
  const timeParts = section === 'time' ? segments.slice(0, 3) : [];
  const [year, month, day] = timeParts;
  const era = eras[year];
  const isCollection = section === 'collection';
  const isTopics = section === 'collections';
  const isMine = section === 'mine';
  const isLetters = section === 'letters';
  const currentFilter = isCollection ? segments[0] : filter;
  const category = categoryOf(currentFilter);
  const currentMemory = section === 'memory' ? [...memories, ...drafts].find((memory) => memory.id === segments[0]) : null;
  const filtered = memories.filter((memory) => (currentFilter === 'all' || memory.category === currentFilter) && matchesTime(memory, timeParts));
  const cards = [...filtered].sort(sort === 'oldest' ? (a, b) => chronologicalValue(a) - chronologicalValue(b) : sort === 'newest' ? (a, b) => chronologicalValue(b) - chronologicalValue(a) : () => 0);

  function navigate(path, restore = false) {
    savedScroll.current.set(route, window.scrollY);
    if (isCollection && path.startsWith('/time/')) setFilter(currentFilter);
    if (route === path) { if (!restore) window.scrollTo({ top: 0, behavior: 'instant' }); return; }
    window.location.hash = path;
    setMenuOpen(false);
  }
  useEffect(() => {
    const onHash = () => setRoute(initialRoute());
    window.addEventListener('hashchange', onHash);
    return () => window.removeEventListener('hashchange', onHash);
  }, []);
  useEffect(() => {
    window.scrollTo({ top: savedScroll.current.get(route) || 0, behavior: 'instant' });
    if (isTopics) {
      const district = new URLSearchParams(routeQuery).get('district');
      if (district) document.getElementById(`district-${district}`)?.scrollIntoView({ behavior: 'instant' });
    }
    document.title = `${currentMemory?.title || (isLetters ? '寄往将来' : isMine ? '我的留存' : isTopics ? '记忆专题' : era ? era.label : year ? `${year} 年的记忆` : '时间里的万物')} · 仍然记得`;
    const nodes = main.current?.querySelectorAll('[data-reveal]');
    if (!motion || !nodes?.length) return;
    const animation = animate(nodes, { opacity: [0, 1], y: [16, 0], duration: 850, delay: stagger(65, { limit: 400 }), ease: 'out(3)' });
    return () => animation.revert();
  }, [route, currentFilter, motion]);
  useEffect(() => {
    if (!heroImage.current || !motion) return;
    const animation = animate(heroImage.current, { scale: [1.025, 1.07], duration: 26000, ease: 'inOutSine', alternate: true, loop: true });
    return () => animation.revert();
  }, [route, motion]);
  useEffect(() => {
    const media = window.matchMedia('(prefers-reduced-motion: reduce)');
    const update = () => setMotion(!media.matches);
    media.addEventListener('change', update);
    return () => media.removeEventListener('change', update);
  }, []);
  useEffect(() => { if (!toast) return; const id = setTimeout(() => setToast(''), 3200); return () => clearTimeout(id); }, [toast]);

  function persist(key, value) {
    try { localStorage.setItem(key, JSON.stringify(value)); return true; }
    catch { setToast('浏览器存储不可用，请先导出内容'); return false; }
  }
  function toggleBookmark(id) {
    const next = bookmarks.includes(id) ? bookmarks.filter((item) => item !== id) : [...bookmarks, id];
    if (persist('remember-bookmarks', next)) { setBookmarks(next); setToast(next.includes(id) ? '已放入「我的珍藏」' : '已取消珍藏'); }
  }
  function saveDraft(memory) {
    const next = [...drafts.filter((item) => item.id !== memory.id), memory];
    if (!persist('remember-drafts', next)) return false;
    setDrafts(next); setModal(null); setMineTab('drafts'); navigate('/mine'); setToast('草稿已保存在此浏览器'); return true;
  }
  function exportMemory(memory) {
    const text = `${memory.title}\n${memoryDate(memory)} · ${memory.author}\n${memory.dateNote || ''}\n${memory.recipient ? `写给：${memory.recipient}\n` : ''}\n${Array.isArray(memory.body) ? memory.body.join('\n\n') : memory.body}\n\n${memory.sources ? memory.sources.map((source) => `${source.label}\n${source.url}`).join('\n\n') : ''}\n仍然记得`;
    const url = URL.createObjectURL(new Blob([text], { type: 'text/plain;charset=utf-8' }));
    const link = document.createElement('a'); link.href = url; link.download = `${memory.title.replace(/[<>:"/\\|?*]/g, '_')}.txt`; link.click(); setTimeout(() => URL.revokeObjectURL(url), 1000);
    setToast('记忆已导出');
  }
  const openMemory = (id) => navigate(`/memory/${id}`);
  const searchResults = query.trim() ? memories.filter((memory) => `${memory.title} ${memory.excerpt} ${memory.author} ${memoryDate(memory)} ${memory.date} ${categoryOf(memory.category).label}`.toLowerCase().includes(query.trim().toLowerCase())) : memories.slice(0, 3);
  const title = era ? era.label : day ? `${Number(month)} 月 ${Number(day)} 日` : month ? `${Number(month)} 月` : year || (isCollection ? category.title : '仍然记得');

  return <div className="app-shell" style={themeOf(isTopics || isMine ? null : districtOf(currentMemory?.category || currentFilter))}>
    <header className="site-header">
      <a href="#/" className="brand" aria-label="仍然记得，首页"><span className="brand-symbol" aria-hidden="true"><i /><i /><i /></span><span className="brand-name">仍然记得<small>STILL, REMEMBER</small></span></a>
      <nav className={menuOpen ? 'main-nav open' : 'main-nav'} aria-label="主导航"><a href="#/" aria-current={!isMine && !isTopics && !isCollection && !isLetters ? 'page' : undefined} onClick={() => setMenuOpen(false)}>时间档案</a><a href="#/collections" aria-current={isTopics || isCollection ? 'page' : undefined} onClick={() => setMenuOpen(false)}>记忆专题</a><a href="#/letters" aria-current={isLetters ? 'page' : undefined} onClick={() => setMenuOpen(false)}>寄往将来</a><a href="#/mine" aria-current={isMine ? 'page' : undefined} onClick={() => setMenuOpen(false)}>我的留存</a></nav>
      <div className="header-actions"><IconButton label="搜索记忆" onClick={() => { setQuery(''); setModal({ type: 'search' }); }}><Search size={19} /></IconButton><button className="write-button" aria-label="留下一份记忆" title="留下一份记忆" onClick={() => setModal({ type: 'compose' })}><Plus size={17} /><span>留下一份记忆</span></button><IconButton label={menuOpen ? '收起菜单' : '展开菜单'} className="mobile-menu" aria-expanded={menuOpen} onClick={() => setMenuOpen(!menuOpen)}>{menuOpen ? <X size={20} /> : <Menu size={20} />}</IconButton></div>
    </header>

    <main ref={main} id="main-content">
      {!isLetters && (needsSupport(currentMemory?.category) || (!currentMemory && needsSupport(currentFilter) && !isMine && !isTopics)) && <div className="content-width"><Support /></div>}
      {isLetters ? <div className="letters-main"><iframe className="letters-frame" src="/letters/letter.html?embed=1" title="寄往将来 · 仍然记得" /></div> : currentMemory ? <>
        <div className="detail-navigation content-width"><button className="text-button" onClick={() => { if (window.history.length > 1 && savedScroll.current.size) window.history.back(); else navigate('/'); }}><ArrowLeft size={16} />回到时间里</button><span>{categoryOf(currentMemory.category).label} / {currentMemory.local ? '本机草稿' : currentMemory.sources ? '公开资料档案' : '虚构示例'}</span></div>
        <article className="memory-detail">
          <header className="detail-title content-width" data-reveal><p className="eyebrow">{memoryDate(currentMemory)} · {currentMemory.format}</p><h1>{currentMemory.title}</h1><p className="detail-author">{currentMemory.sources ? `资料依据：${currentMemory.author}` : `${currentMemory.author} ${currentMemory.local ? '写下的记忆' : '留下的记忆'}`}<span>·</span>{currentMemory.recipient || currentMemory.location}</p></header>
          <figure className={`detail-photo ${currentMemory.sources ? 'documentary-photo' : ''}`} data-reveal><img src={imageOf(currentMemory.image)} alt={currentMemory.title} /><figcaption>{currentMemory.imageCredit || `配图为意境参考${!currentMemory.local ? ' · 故事为虚构示例' : ''}`}{currentMemory.imageSource && <> <a href={currentMemory.imageSource} target="_blank" rel="noreferrer">影像来源 ↗</a></>}</figcaption></figure>
          {currentMemory.sources && <aside className="record-sources"><p>{currentMemory.dateNote || '按事件发生日期归档。'}</p><h2>公开资料来源</h2>{currentMemory.sources.map((source) => <a key={source.url} href={source.url} target="_blank" rel="noreferrer">{source.label}<ArrowUpRight size={15} /></a>)}<small>依据以上公开资料整理为中文摘要，不作为人物原话。核验日期：2026.09.18</small></aside>}
          <div className="detail-text" data-reveal><div className="story-marker"><Feather size={20} /><span>{currentMemory.sources ? '档案记录' : '留在这里的话'}</span></div>{(Array.isArray(currentMemory.body) ? currentMemory.body : currentMemory.body.split('\n').filter(Boolean)).map((paragraph, index) => <p key={index}>{paragraph}</p>)}<div className="story-signature">{currentMemory.sources ? '仍然记得 · 资料整理' : currentMemory.author}<br /><small>{memoryDate(currentMemory)}</small></div><div className="detail-actions">{currentMemory.local ? <button className="text-button" onClick={() => setModal({ type: 'compose', initial: currentMemory })}><Pencil size={17} />继续编辑</button> : <button className="text-button" onClick={() => toggleBookmark(currentMemory.id)}><Bookmark size={17} fill={bookmarks.includes(currentMemory.id) ? 'currentColor' : 'none'} />{bookmarks.includes(currentMemory.id) ? '已珍藏' : '珍藏这份记忆'}</button>}<button className="text-button" onClick={() => exportMemory(currentMemory)}><Download size={17} />导出文字</button></div></div>
        </article>
      </> : isMine ? <section className="mine-page content-width">
        <div className="page-heading" data-reveal><p className="eyebrow">A PERSONAL ARCHIVE</p><h1>我的留存</h1><p>那些不想忘记的，留在这里。</p></div>
        <div className="section-toolbar"><div className="filter-tabs" role="tablist" aria-label="我的留存分类"><button role="tab" aria-selected={mineTab === 'drafts'} onClick={() => setMineTab('drafts')}>我的草稿 <small>{drafts.length}</small></button><button role="tab" aria-selected={mineTab === 'bookmarks'} onClick={() => setMineTab('bookmarks')}>我的珍藏 <small>{bookmarks.length}</small></button></div><span className="local-label"><LockKeyhole size={14} />仅此浏览器</span></div>
        {mineTab === 'drafts' ? drafts.length ? <div className="draft-list">{drafts.map((draft) => <article key={draft.id} className="draft-row"><div className="draft-date">{formatDate(draft.date)}</div><button className="draft-title" onClick={() => openMemory(draft.id)}><h2>{draft.title}</h2><p>{draft.excerpt}</p></button><span className="draft-privacy">{draft.visibility === 'public' ? <Globe2 size={15} /> : <LockKeyhole size={15} />}{draft.visibility === 'public' ? '拟公开' : '私人'} · 未发布</span><div className="draft-actions"><IconButton label={`编辑：${draft.title}`} onClick={() => setModal({ type: 'compose', initial: draft })}><Pencil size={17} /></IconButton><IconButton label={`导出：${draft.title}`} onClick={() => exportMemory(draft)}><Download size={17} /></IconButton><IconButton label={`删除：${draft.title}`} onClick={() => setModal({ type: 'delete', memory: draft })}><Trash2 size={17} /></IconButton></div></article>)}</div> : <div className="empty-state"><Feather size={30} strokeWidth={1} /><h2>第一份记忆，仍在等你落笔</h2><button className="primary-button" onClick={() => setModal({ type: 'compose' })}><Plus size={16} />写下一份记忆</button></div> : bookmarks.length ? <div className="memory-grid">{memories.filter((memory) => bookmarks.includes(memory.id)).map((memory, index) => <MemoryCard key={memory.id} memory={memory} index={index} bookmarked onBookmark={toggleBookmark} onOpen={openMemory} />)}</div> : <div className="empty-state"><Bookmark size={30} strokeWidth={1} /><h2>还没有珍藏的记忆</h2><button className="text-button" onClick={() => navigate('/')}>去时间里走走<ArrowRight size={17} /></button></div>}
      </section> : isTopics ? <section className="topics-page"><div className="page-heading content-width" data-reveal><p className="eyebrow">CHAPTERS OF EXISTENCE</p><h1>每一种存在，都值得被记得。</h1><p>关于他们，关于这里，关于世间万物。</p><nav className="district-nav" aria-label="分区导航">{districts.map((district) => <a key={district.id} href={`#/collections?district=${district.id}`} onClick={(event) => { event.preventDefault(); document.getElementById(`district-${district.id}`)?.scrollIntoView({ behavior: reducedMotion() ? 'instant' : 'smooth' }); }}><i style={{ background: district.accent }} />{district.title}</a>)}</nav></div>{districts.map((district) => <section className="district-band" id={`district-${district.id}`} key={district.id} style={themeOf(district)}><div className="content-width"><header className="district-heading"><h2>{district.title}</h2><span>{district.categories.length} 个分类</span></header><div className="district-grid">{district.categories.map((id) => { const topic = categoryOf(id); const count = memories.filter((memory) => memory.category === id).length; return <a key={id} className="district-topic" href={`#/collection/${id}`}><img src={imageOf(topic.image)} alt="" loading="lazy" /><div><span>{topic.label} · {count ? `${count} 份档案` : '待留下第一份记忆'}</span><h3>{topic.title}</h3><p>{topic.subtitle}</p></div><ArrowUpRight size={19} /></a>; })}</div></div></section>)}</section> : section === 'memory' ? <div className="empty-state"><h1>这份记忆暂时找不到了</h1><button className="text-button" onClick={() => navigate('/')}>回到时间档案<ArrowRight size={18} /></button></div> : <>
        <section className={`archive-scene ${year ? 'focused-scene' : ''} ${isCollection ? 'collection-scene' : ''}`} aria-label="时间档案">
          <div className="scene-image" aria-hidden="true"><img ref={heroImage} src={imageOf(era ? era.image : isCollection ? category.image : 'lake')} alt="" /></div>
          <div className="scene-veil" />
          <div className="scene-topline"><div className="breadcrumbs" aria-label="时间路径"><button onClick={() => { setFilter('all'); navigate('/'); }}>万物的记忆</button>{isCollection && <><ChevronRight size={13} /><span>{category.title}</span></>}{year && <><ChevronRight size={13} /><button onClick={() => navigate(`/time/${year}`)} aria-current={!month ? 'page' : undefined}>{era ? era.label : `${year} 年`}</button></>}{month && <><ChevronRight size={13} /><button onClick={() => navigate(`/time/${year}/${month}`)} aria-current={!day ? 'page' : undefined}>{Number(month)} 月</button></>}{day && <><ChevronRight size={13} /><span aria-current="page">{Number(day)} 日</span></>}</div><span className="scene-edition">THE ARCHIVE OF US & EVERYTHING</span></div>
          <div className="scene-copy" key={route} data-reveal>
            <p className="scene-overline">{era ? era.dateLabel : year ? (month ? `${year} 年${day ? ` · ${Number(month)} 月` : ''}` : '这一年，我们曾在这里') : isCollection ? category.subtitle : '让这个世界'}</p>
            <h1 className={era ? 'era-title' : year ? `time-title ${day ? 'day-title' : ''}` : ''}>{title}<span className="title-period">{!year && !isCollection ? '。' : ''}</span></h1>
            <p className="scene-description">{year ? `${filtered.length} 份档案，留在${era ? '这段漫长的时间' : day ? '这一天' : month ? '这个月' : '这一年'}。` : isCollection ? '在时间里，重新相遇。' : <>从遥远星辰，到身边万物。<br />所有曾经存在的，都有迹可循。</>}</p>
            <button className="scene-action" onClick={() => year ? document.getElementById('archive-records')?.scrollIntoView({ behavior: reducedMotion() ? 'instant' : 'smooth' }) : openMemory(memories[Math.floor(Math.random() * memories.length)].id)}>{year ? '看看这些记忆' : '偶遇一份记忆'}<span><ArrowUpRight size={19} /></span></button>
          </div>
          <div className="scene-aside"><span>曾经存在</span><span>依然回响</span><i /></div>
          <div className="scene-bottom"><TimeRail parts={timeParts} data={memories.filter((memory) => currentFilter === 'all' || memory.category === currentFilter)} navigate={navigate} motion={motion} /><div className="scene-footnote"><span>{year ? '时间的细节，在这里慢慢展开。' : '每一个刻度，都有故事停留。'}</span><button className="motion-button" onClick={() => setMotion(!motion)} title={motion ? '暂停动态效果' : '开启动效'} aria-label={motion ? '暂停动态效果' : '开启动效'}>{motion ? <Pause size={12} /> : <Play size={12} />}<span>{motion ? '片刻，慢下来' : '静静地看'}</span></button></div></div>
        </section>

        <section id="archive-records" className="archive-records content-width">
          <div className="section-title-row" data-reveal><div><p className="eyebrow">TRACES THROUGH TIME</p><h2>{era ? '留在漫长时间里的痕迹' : year ? (day ? '这一天，留下的痕迹' : month ? '这个月，留下的痕迹' : '这一年，留下的痕迹') : isCollection ? category.title : '时间留下的，远不止回忆。'}</h2></div><span className="record-count">{filtered.length} 份档案<span className="sample-label">{filtered.filter((memory) => memory.sources).length} 份公开资料</span></span></div>
          <div className="section-toolbar"><div className="filter-tabs" role="tablist" aria-label="记忆分类">{categories.map((item) => <button key={item.id} role="tab" aria-selected={currentFilter === item.id} onClick={() => { setFilter(item.id); if (isCollection) navigate(item.id === 'all' ? '/' : `/collection/${item.id}`); }}>{item.label}</button>)}</div><label className="sort-control"><span className="sr-only">排序方式</span><select value={sort} onChange={(event) => setSort(event.target.value)}><option value="curated">随时间拾起</option><option value="newest">由近及远</option><option value="oldest">由远及近</option></select></label></div>
          {cards.length ? <div className="memory-grid">{cards.map((memory, index) => <MemoryCard key={memory.id} memory={memory} index={index} bookmarked={bookmarks.includes(memory.id)} onBookmark={toggleBookmark} onOpen={openMemory} />)}</div> : <div className="empty-state"><CalendarDays size={30} strokeWidth={1} /><h3>这段时间，还没有留下记忆</h3><button className="text-button" onClick={() => setModal({ type: 'compose', initial: { date: `${year || new Date().getFullYear()}-${month || '01'}-${day || '01'}`, category: currentFilter === 'all' ? 'people' : currentFilter } })}>为这一天留下一笔<Plus size={17} /></button></div>}
        </section>
        {!year && !isCollection && <section className="chapters-section"><div className="content-width"><div className="section-title-row"><div><p className="eyebrow">DIFFERENT WAYS TO REMEMBER</p><h2>每一种存在，自有回声。</h2></div><a className="text-button" href="#/collections">所有专题<ArrowUpRight size={17} /></a></div><div className="chapter-links">{categories.slice(1).map((topic, index) => <a href={`#/collection/${topic.id}`} key={topic.id}><span className="chapter-number">0{index + 1}</span><div><h3>{topic.title}</h3><p>{topic.subtitle}</p></div><ArrowUpRight size={22} /></a>)}</div></div></section>}
      </>}
    </main>

    {!isLetters && <footer className="site-footer content-width"><div className="footer-top"><a href="#/" className="footer-brand">仍然记得<span>让这个世界仍然记得。</span></a><button className="text-button" onClick={() => setModal({ type: 'compose' })}>把你记得的，留在这里<ArrowUpRight size={18} /></button></div><div className="footer-bottom"><span>STILL, REMEMBER © 2026</span><span className="footer-note">公开资料附来源 · 虚构示例单独标注</span><button onClick={() => setModal({ type: 'about' })}>关于留存与隐私</button></div></footer>}

    {toast && <div className="toast" role="status"><Check size={16} />{toast}</div>}
    {modal?.type === 'compose' && <Composer initial={modal.initial} onClose={() => setModal(null)} onSave={saveDraft} />}
    {modal?.type === 'search' && <Modal title="在时间里寻找" onClose={() => setModal(null)} className="search-modal"><div className="search-field"><Search size={21} /><input aria-label="搜索关键词" autoFocus placeholder="一个名字、一处地方、一段时光……" value={query} onChange={(event) => setQuery(event.target.value)} /><span>{searchResults.length}</span></div><p className="eyebrow">{query.trim() ? '找到这些记忆' : '也许，你会记得'}</p><div className="search-results">{searchResults.map((memory) => <button key={memory.id} onClick={() => { setModal(null); openMemory(memory.id); }}><img src={imageOf(memory.image)} alt="" /><span><small>{memoryDate(memory)} · {categoryOf(memory.category).label}</small><strong>{memory.title}</strong></span><ArrowUpRight size={19} /></button>)}{!searchResults.length && <p className="search-empty">暂时没有找到。换一个名字或年份试试。</p>}</div></Modal>}
    {modal?.type === 'about' && <Modal title="关于留存与隐私" onClose={() => setModal(null)}><div className="about-copy"><p>这里记录宇宙、地球、物种、人物与历史，也保存身边的地方和旧物。</p><p>“公开资料”依据注明的机构资料整理，并附原始链接；近似年代、历史影像与艺术想象图均作说明。“虚构示例”是原型中的文学故事，不是史实。</p><p>你写下的草稿和珍藏只保存在当前浏览器。选择“公开”仅记录发布意愿，不会向互联网发布；目前未接入账户、云端存储或亲友授权。</p><p>清理浏览器数据会清除本机草稿。重要内容请使用“导出文字”保存副本。</p></div></Modal>}
    {modal?.type === 'delete' && <Modal title="删除这份草稿？" onClose={() => setModal(null)}><p className="delete-copy">“{modal.memory.title}”将从此浏览器移除，无法恢复。你可以先导出一份。</p><div className="form-actions"><button className="text-button" onClick={() => exportMemory(modal.memory)}><Download size={17} />导出文字</button><button className="danger-button" onClick={() => { const next = drafts.filter((draft) => draft.id !== modal.memory.id); if (persist('remember-drafts', next)) { setDrafts(next); setModal(null); setToast('草稿已删除'); } }}>删除草稿</button></div></Modal>}
  </div>;
}

export default App;