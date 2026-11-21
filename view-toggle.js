import {prefs} from './storage.js';
import {icon} from './dom.js';
export const loadView=()=>prefs.get('view','grid')==='list'?'list':'grid';
export const saveView=v=>prefs.set('view',v);
export const viewToggleHtml=m=>`<div class="seg" role="group" aria-label="View mode">
<button data-view="grid" class="${m==='grid'?'active':''}" aria-label="Grid view" aria-pressed="${m==='grid'}">${icon('layout-grid')}</button>
<button data-view="list" class="${m==='list'?'active':''}" aria-label="List view" aria-pressed="${m==='list'}">${icon('list')}</button></div>`;
