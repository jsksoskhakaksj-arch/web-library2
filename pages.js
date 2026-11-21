import {state} from './state.js';
import {esc,icon,thumb} from './dom.js';
import {renderSiteList,catColor} from './library.js';
const head=(k,t,sub='')=>`<header class="page-head"><p class="kicker-l">${k}</p><h1 class="display">${t}</h1>${sub?`<p class="count">${sub}</p>`:''}</header>`;

// Assumed collection shape: {id,name,description,websiteIds[]}. Creating collections is not built yet.
export function renderCollections(root){
  const cs=state.collections;
  root.innerHTML=head('Exhibitions','Collections',`${cs.length} collections`)+(cs.length?`<div class="panel-grid">${cs.map(c=>{
    const ws=(c.websiteIds||[]).map(id=>state.websites.find(w=>w.id===id)).filter(Boolean);
    return `<article class="panel"><div class="cover">${ws[0]?thumb(ws[0]):''}</div><h3>${esc(c.name)}</h3><p>${ws.length} websites${c.description?' — '+esc(c.description):''}</p></article>`}).join('')}</div>`
    :'<div class="empty"><p>No collections yet. Creating collections is planned for a later milestone.</p></div>');
}
export function renderCategories(root){
  root.innerHTML=head('Index','Categories',`${state.categories.length} categories`)+`<div class="cat-list">${state.categories.map(c=>{
    const n=state.websites.filter(w=>w.categoryId===c.id).length;
    return `<a class="cat-row" href="#/library" data-action="open-cat" data-cat="${esc(c.id)}" style="--accent:${catColor(c.id)}"><i class="dot"></i><h3>${esc(c.name)}</h3><span>${n} website${n===1?'':'s'}</span></a>`}).join('')}</div>`;
}
export function renderFavorites(root){
  const f=state.websites.filter(w=>w.favorite);
  root.innerHTML=head('Selected','Favorites',`${f.length} websites`)+(f.length?renderSiteList(f,state.ui.view):'<div class="empty"><p>Star a website in your library to see it here.</p></div>');
}
export function renderSettings(root){
  const t=document.documentElement.dataset.theme,v=state.ui.view;
  const b=(a,k,val,label,cur)=>`<button class="btn ${cur===val?'active':''}" data-action="${a}" data-v="${val}" aria-pressed="${cur===val}">${label}</button>`;
  root.innerHTML=head('Preferences','Settings')+`<section class="set-group"><h2>Appearance</h2><div class="opts">${b('set-theme','t','dark','Dark',t)}${b('set-theme','t','light','Light',t)}</div></section>
<section class="set-group"><h2>Library view</h2><div class="opts">${b('set-view','v','grid','Gallery',v)}${b('set-view','v','list','List',v)}</div></section>
<section class="set-group"><h2>Your data</h2><div class="opts"><button class="btn" data-action="export">${icon('download')}Export as JSON</button><p>Everything is stored in this browser only. Clearing site data removes it, so export a backup.</p></div></section>`;
}
