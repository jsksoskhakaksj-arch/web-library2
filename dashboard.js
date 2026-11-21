import {state} from './state.js';
import {icon,esc} from './dom.js';
import {renderSiteList} from './library.js';
const sec=(t,body,link='library')=>`<section class="section"><div class="sec-head"><h2>${t}</h2><a href="#/${link}">View all</a></div>${body}</section>`;
export function renderDashboard(root){
  const s=state.websites,recent=[...s].sort((a,b)=>b.createdAt.localeCompare(a.createdAt)).slice(0,4),favs=s.filter(w=>w.favorite).slice(0,4);
  const cols=state.collections.slice(0,3).map(c=>`<span class="chip">${esc(c.name)}</span>`).join(' ');
  root.innerHTML=`<header class="hero"><p class="kicker-l">Your personal exhibition</p><h1 class="display">A curated collection of digital discoveries.</h1>
<div class="stats-inline"><span><b>${s.length}</b>websites</span><span><b>${state.categories.length}</b>categories</span><span><b>${favs.length?s.filter(w=>w.favorite).length:0}</b>favorites</span><span><b>${state.collections.length}</b>collections</span></div>
<button class="btn primary" data-action="add">${icon('plus')}Add website</button></header>
${sec('Recently added',recent.length?renderSiteList(recent,'grid'):'<p class="note">Nothing saved yet. Add your first website.</p>')}
${sec('Favorites',favs.length?renderSiteList(favs,'grid'):'<p class="note">Star a website to feature it here.</p>','favorites')}
${sec('Collections',state.collections.length?`<p class="note">${cols}</p>`:'<p class="note">No collections yet.</p>','collections')}`;
}
