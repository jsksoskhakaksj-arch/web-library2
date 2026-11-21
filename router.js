import {$} from './dom.js';
export const ROUTES=[
  {id:'home',label:'Home',icon:'house'},{id:'library',label:'My Library',icon:'library-big'},
  {id:'collections',label:'Collections',icon:'folders'},{id:'categories',label:'Categories',icon:'tags'},
  {id:'favorites',label:'Favorites',icon:'star'},{id:'settings',label:'Settings',icon:'settings'}];
export const currentRoute=()=>{const id=location.hash.replace(/^#\/?/,'')||'home';return ROUTES.some(r=>r.id===id)?id:'home'};
export const navigate=id=>{location.hash='#/'+id};
export function renderNav(active){
  const html=ROUTES.map(r=>`<a href="#/${r.id}" class="${r.id===active?'active':''}" ${r.id===active?'aria-current="page"':''}><i data-lucide="${r.icon}"></i><span>${r.label}</span></a>`).join('');
  $('#nav').innerHTML=html;$('#bottom-nav').innerHTML=html;
}
