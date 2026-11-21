import {state} from './state.js';
import {$,esc,icon,icons,favicon,thumb} from './dom.js';
import {hostname} from './url.js';
import {filterSites} from './search.js';
import {viewToggleHtml,saveView} from './view-toggle.js';

const PALETTE=['#C8A27A','#7FA6C9','#9BBF8A','#C98A9B','#B49BD6','#D6C27F'];
export const catColor=id=>{const i=state.categories.findIndex(c=>c.id===id);return i<0?'var(--muted)':PALETTE[i%PALETTE.length]};
export const catName=id=>state.categories.find(c=>c.id===id)?.name||'Uncategorized';
const fav=w=>`<button class="icon-btn fav-btn ${w.favorite?'on':''}" data-action="fav" aria-label="${w.favorite?'Remove from favorites':'Add to favorites'}" aria-pressed="${!!w.favorite}">${icon('star')}</button>`;
const acts=w=>`<div class="acts"><a class="icon-btn" href="${esc(w.url)}" target="_blank" rel="noopener noreferrer" data-action="visit" aria-label="Open website">${icon('arrow-up-right')}</a><button class="icon-btn" data-action="edit" aria-label="Edit website">${icon('pencil')}</button><button class="icon-btn" data-action="delete" aria-label="Delete website">${icon('trash-2')}</button></div>`;
const kicker=w=>`<div class="kicker"><span class="dot"></span>${esc(catName(w.categoryId))}</div>`;

export function siteItem(w,mode){
  const st=`style="--accent:${catColor(w.categoryId)}"`;
  if(mode==='list')return `<article class="row" data-id="${esc(w.id)}" ${st}>${favicon(w)}<div class="info"><h3>${esc(w.title)}</h3><div class="url">${esc(hostname(w.url))}</div><p class="desc">${esc(w.description)}</p></div>${kicker(w)}${fav(w)}${acts(w)}</article>`;
  const tags=(w.tags||[]).slice(0,3).map(t=>'#'+esc(t)).join('  ');
  return `<article class="card" data-id="${esc(w.id)}" ${st}><a class="cover" href="${esc(w.url)}" target="_blank" rel="noopener noreferrer" data-action="visit" tabindex="-1" aria-hidden="true">${thumb(w)}</a>
<div class="kicker"><span class="dot"></span>${esc(catName(w.categoryId))}<span class="sp"></span>${fav(w)}</div><h3>${esc(w.title)}</h3>
<p class="desc">${esc(w.description)||esc(hostname(w.url))}</p>${tags?`<div class="tags">${tags}</div>`:''}${acts(w)}</article>`;
}
export const renderSiteList=(sites,mode)=>`<div class="${mode==='list'?'list':'gallery'}">${sites.map(w=>siteItem(w,mode)).join('')}</div>`;

function results(){
  const {ui}=state,r=filterSites(state.websites,ui,state.categories);
  $('#count').textContent=`${r.length} of ${state.websites.length} websites`;
  $('#results').innerHTML=r.length?renderSiteList(r,ui.view):
    `<div class="empty"><p>${state.websites.length?'No websites match your filters.':'Your library is empty.'}</p><button class="btn primary" data-action="add">${icon('plus')}Add website</button></div>`;
  icons();
}
export const refreshResults=()=>$('#results')&&results();

export function renderLibrary(root){
  const {ui}=state;
  root.innerHTML=`<header class="page-head"><p class="kicker-l">Collection</p><h1 class="display">Library</h1><p class="count" id="count"></p></header>
<div class="toolbar"><select data-filter="category" aria-label="Category"><option value="all">All categories</option>${state.categories.map(c=>`<option value="${esc(c.id)}" ${ui.category===c.id?'selected':''}>${esc(c.name)}</option>`).join('')}</select>
<select data-filter="sort" aria-label="Sort"><option value="created-desc">Newest first</option><option value="created-asc">Oldest first</option><option value="name-asc">Name A–Z</option><option value="name-desc">Name Z–A</option></select>
<button class="btn ${ui.favOnly?'active':''}" data-filter="fav" aria-pressed="${ui.favOnly}">${icon('star')}Favorites</button><span class="spacer"></span>${viewToggleHtml(ui.view)}</div><div id="results"></div>`;
  root.querySelector('[data-filter=sort]').value=ui.sort;
  results();
}
export function initLibrary(){
  $('#view').addEventListener('change',e=>{const f=e.target.dataset.filter;if(!f)return;state.ui[f==='category'?'category':'sort']=e.target.value;results()});
  $('#view').addEventListener('click',e=>{
    const fb=e.target.closest('[data-filter=fav]');
    if(fb){state.ui.favOnly=!state.ui.favOnly;fb.classList.toggle('active',state.ui.favOnly);fb.setAttribute('aria-pressed',state.ui.favOnly);results()}
    const v=e.target.closest('[data-view]');
    if(v){state.ui.view=v.dataset.view;saveView(state.ui.view);document.querySelectorAll('.toolbar [data-view]').forEach(b=>{const on=b===v;b.classList.toggle('active',on);b.setAttribute('aria-pressed',on)});results()}
  });
}
