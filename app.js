import {state} from './state.js';
import {on,emit} from './events.js';
import {currentRoute,renderNav,navigate,ROUTES} from './router.js';
import {websiteRepo,categoryRepo,collectionRepo} from './storage.js';
import {$,$$,icon,icons,initImageFallbacks} from './dom.js';
import {nowIso} from './date.js';
import {initTheme} from './theme.js';
import {loadView} from './view-toggle.js';
import {renderDashboard} from './dashboard.js';
import {renderLibrary,initLibrary,refreshResults} from './library.js';
import {initModal,openModal} from './website-modal.js';

const PLACEHOLDER_TEXT={collections:'Group related websites into collections.',categories:'Create and manage your own categories.',favorites:'A dedicated favorites page.',settings:'Preferences and account options.'};
function render(){
  const r=state.ui.route=currentRoute(),v=$('#view');renderNav(r);
  if(r==='home')renderDashboard(v);else if(r==='library')renderLibrary(v);
  else{const R=ROUTES.find(x=>x.id===r);
    v.innerHTML=`<div class="placeholder"><div class="big">${icon(R.icon)}</div><h1 class="page-title" style="margin:0">${R.label}</h1><p>${PLACEHOLDER_TEXT[r]} This section is planned for a future milestone.</p>
${r==='favorites'?`<button class="btn primary" data-action="show-favs">${icon('star')}View favorites in My Library</button>`:''}</div>`}
  icons();
}
async function load(){
  [state.websites,state.categories,state.collections]=await Promise.all([websiteRepo.list(),categoryRepo.list(),collectionRepo.list()]);
}
const closeMenus=()=>$$('.menu:not([hidden])').forEach(m=>{m.hidden=true;m.previousElementSibling?.setAttribute('aria-expanded','false')});

document.addEventListener('click',async e=>{
  const el=e.target.closest('[data-action]');
  if(!el)return closeMenus();
  const {action}=el.dataset,id=el.closest('[data-id]')?.dataset.id,site=state.websites.find(w=>w.id===id);
  if(action==='menu'){const m=el.nextElementSibling,open=m.hidden;closeMenus();m.hidden=!open;el.setAttribute('aria-expanded',open);return}
  closeMenus();
  try{
    if(action==='add')openModal();
    else if(action==='edit'&&site)openModal(site);
    else if(action==='fav'&&site){await websiteRepo.update(id,{favorite:!site.favorite},false);emit('websites:changed')}
    else if(action==='delete'&&site&&confirm(`Delete "${site.title}"? This cannot be undone.`)){await websiteRepo.remove(id);emit('websites:changed')}
    else if(action==='visit'&&site){site.lastVisitedAt=nowIso();websiteRepo.update(id,{lastVisitedAt:site.lastVisitedAt},false).catch(()=>{})}
    else if(action==='show-favs'){state.ui.favOnly=true;navigate('library')}
  }catch(err){alert(err.message)}
});
document.addEventListener('keydown',e=>{if(e.key==='Escape')closeMenus()});
on('websites:changed',async()=>{await load();render()});
window.addEventListener('hashchange',render);

let timer;
$('#search').addEventListener('input',e=>{
  clearTimeout(timer);timer=setTimeout(()=>{state.ui.query=e.target.value;currentRoute()==='library'?refreshResults():navigate('library')},150);
});
(async function init(){
  initImageFallbacks();initTheme();initModal();initLibrary();state.ui.view=loadView();
  await load();render();
})();
