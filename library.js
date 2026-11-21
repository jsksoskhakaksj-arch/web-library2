import {state} from './state.js';
import {$,esc,icon,icons,favicon,thumb} from './dom.js';
import {hostname} from './url.js';
import {filterSites} from './search.js';
import {viewToggleHtml,saveView} from './view-toggle.js';

const catName=id=>state.categories.find(c=>c.id===id)?.name||'Uncategorized';
const actions=w=>`<button class="icon-btn fav-btn ${w.favorite?'on':''}" data-action="fav" aria-label="${w.favorite?'Remove from favorites':'Add to favorites'}" aria-pressed="${!!w.favorite}">${icon('star')}</button>
<div class="menu-wrap"><button class="icon-btn" data-action="menu" aria-haspopup="menu" aria-expanded="false" aria-label="More actions">${icon('ellipsis-vertical')}</button>
<div class="menu" role="menu" hidden><a href="${esc(w.url)}" target="_blank" rel="noopener noreferrer" data-action="visit">${icon('external-link')}Visit</a>
<button data-action="edit">${icon('pencil')}Edit</button><button class="danger" data-action="delete">${icon('trash-2')}Delete</button></div></div>`;
const tags=w=>(w.tags||[]).slice(0,3).map(t=>`<span class="tag">${esc(t)}</span>`).join('');

export function siteItem(w,mode){
  if(mode==='list')return `<article class="row" data-id="${esc(w.id)}">${favicon(w)}<div class="info"><div class="head"><h3>${esc(w.title)}</h3></div>
<div class="url">${esc(w.url)}</div><p class="desc">${esc(w.description)}</p></div><span class="chip">${esc(catName(w.categoryId))}</span>${actions(w)}</article>`;
  return `<article class="card" data-id="${esc(w.id)}"><a class="thumb" href="${esc(w.url)}" target="_blank" rel="noopener noreferrer" data-action="visit" tabindex="-1" aria-hidden="true">${thumb(w)}</a>
<div class="card-body"><div class="head">${favicon(w)}<h3 title="${esc(hostname(w.url))}">${esc(w.title)}</h3>${actions(w)}</div>
<p class="desc">${esc(w.description)||esc(hostname(w.url))}</p><div class="meta"><span class="chip">${esc(catName(w.categoryId))}</span>${tags(w)}</div></div></article>`;
}
export const renderSiteList=(sites,mode)=>`<div class="${mode==='list'?'list':'grid'}">${sites.map(w=>siteItem(w,mode)).join('')}</div>`;

function results(){
  const {ui}=state,r=filterSites(state.websites,ui,state.categories);
  $('#count').textContent=`${r.length} of ${state.websites.length} websites`;
  $('#results').innerHTML=r.length?renderSiteList(r,ui.view):
    `<div class="empty">${icon('library-big')}<p>${state.websites.length?'No websites match your filters.':'Your library is empty.'}</p><button class="btn primary" data-action="add">${icon('plus')}Add website</button></div>`;
  icons();
}
export const refreshResults=()=>$('#results')&&results();

export function renderLibrary(root){
  const {ui}=state;
  root.innerHTML=`<div class="page-head"><h1 class="page-title">My Library</h1><span class="count" id="count"></span></div>
<div class="toolbar"><select data-filter="category" aria-label="Category"><option value="all">All categories</option>${state.categories.map(c=>`<option value="${esc(c.id)}" ${ui.category===c.id?'selected':''}>${esc(c.name)}</option>`).join('')}</select>
<select data-filter="sort" aria-label="Sort"><option value="created-desc">Newest first</option><option value="created-asc">Oldest first</option><option value="name-asc">Name A–Z</option><option value="name-desc">Name Z–A</option></select>
<button class="btn ${ui.favOnly?'active':''}" data-filter="fav" aria-pressed="${ui.favOnly}">${icon('star')}Favorites</button><span class="spacer"></span>${viewToggleHtml(ui.view)}</div><div id="results"></div>`;
  root.querySelector('[data-filter=sort]').value=ui.sort;
  results();
}
export function initLibrary(){
  $('#view').addEventListener('change',e=>{const f=e.target.dataset.filter;if(!f)return;state.ui[f==='category'?'category':'sort']=e.target.value;results()});
  $('#view').addEventListener('click',e=>{
    const fav=e.target.closest('[data-filter=fav]');
    if(fav){state.ui.favOnly=!state.ui.favOnly;fav.classList.toggle('active',state.ui.favOnly);fav.setAttribute('aria-pressed',state.ui.favOnly);results()}
    const v=e.target.closest('[data-view]');
    if(v){state.ui.view=v.dataset.view;saveView(state.ui.view);document.querySelectorAll('[data-view]').forEach(b=>{const on=b===v;b.classList.toggle('active',on);b.setAttribute('aria-pressed',on)});results()}
  });
}
