import {state} from './state.js';
import {on,emit} from './events.js';
import {currentRoute,renderNav,navigate,ROUTES} from './router.js';
import {websiteRepo,categoryRepo,collectionRepo} from './storage.js';
import {$,$$,icon,icons,initImageFallbacks} from './dom.js';
import {nowIso} from './date.js';
import {initTheme,setTheme} from './theme.js';
import {renderCollections,renderCategories,renderFavorites,renderSettings} from './pages.js';
import {loadView,saveView} from './view-toggle.js';
import {renderDashboard} from './dashboard.js';
import {renderLibrary,initLibrary,refreshResults} from './library.js';
import {initModal,openModal} from './website-modal.js';

const PAGES={home:renderDashboard,library:renderLibrary,collections:renderCollections,categories:renderCategories,favorites:renderFavorites,settings:renderSettings};
function render(){const r=state.ui.route=currentRoute();renderNav(r);PAGES[r]($('#view'));icons()}
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
    else if(action==='open-cat'){state.ui.category=el.dataset.cat;state.ui.favOnly=false}
    else if(action==='set-theme'){setTheme(el.dataset.v);render()}
    else if(action==='set-view'){state.ui.view=el.dataset.v;saveView(el.dataset.v);render()}
    else if(action==='export'){const a=document.createElement('a');a.href=URL.createObjectURL(new Blob([JSON.stringify({websites:state.websites,categories:state.categories,collections:state.collections},null,2)],{type:'application/json'}));a.download='web-library-export.json';a.click();URL.revokeObjectURL(a.href)}
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
