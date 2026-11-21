export const $=(s,r=document)=>r.querySelector(s);
export const $$=(s,r=document)=>[...r.querySelectorAll(s)];
export const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
export const icons=()=>window.lucide?.createIcons();
export const icon=(n,c='')=>`<i data-lucide="${n}" class="${c}"></i>`;
const GLOBE=`<span class="fav-ph">${icon('globe')}</span>`;
const THUMB_PH=`<span class="thumb-ph">${icon('image')}</span>`;
export const favicon=w=>w.favicon?`<img class="fav" src="${esc(w.favicon)}" alt="" loading="lazy" data-fb="fav">`:GLOBE;
export const thumb=w=>w.thumbnail?`<img src="${esc(w.thumbnail)}" alt="" loading="lazy" data-fb="thumb">`:THUMB_PH;
// Broken image URLs are replaced with neutral placeholders (error events don't bubble, so use capture).
export function initImageFallbacks(){
  document.addEventListener('error',e=>{const t=e.target;if(t.tagName!=='IMG'||!t.dataset.fb)return;t.outerHTML=t.dataset.fb==='fav'?GLOBE:THUMB_PH;icons();},true);
}
