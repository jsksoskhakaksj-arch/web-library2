import {prefs} from './storage.js';
import {$,icon,icons} from './dom.js';
export function setTheme(t){document.documentElement.dataset.theme=t;prefs.set('theme',t);
  $('#theme-btn').innerHTML=icon(t==='dark'?'sun':'moon');icons()}
export function initTheme(){
  setTheme(prefs.get('theme','dark'));
  $('#theme-btn').addEventListener('click',()=>setTheme(document.documentElement.dataset.theme==='dark'?'light':'dark'));
}
