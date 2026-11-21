import {state} from './state.js';
import {icon} from './dom.js';
import {renderSiteList} from './library.js';
export function renderDashboard(root){
  const s=state.websites,recent=[...s].sort((a,b)=>b.createdAt.localeCompare(a.createdAt)).slice(0,5),favs=s.filter(w=>w.favorite).slice(0,5);
  const sec=(t,l,empty)=>`<section class="section"><h2>${t}</h2>${l.length?renderSiteList(l,'list'):`<p class="count">${empty}</p>`}</section>`;
  root.innerHTML=`<div class="page-head"><h1 class="page-title">Home</h1><button class="btn primary" data-action="add">${icon('plus')}Add website</button></div>
<div class="stats"><div class="stat"><b>${s.length}</b><span>Saved websites</span></div><div class="stat"><b>${state.categories.length}</b><span>Categories</span></div><div class="stat"><b>${s.filter(w=>w.favorite).length}</b><span>Favorites</span></div></div>
${sec('Recently added',recent,'Nothing saved yet. Add your first website.')}${sec('Favorites',favs,'Star a website to see it here.')}`;
}
