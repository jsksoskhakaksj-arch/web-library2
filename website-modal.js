import {state} from './state.js';
import {emit} from './events.js';
import {websiteRepo} from './storage.js';
import {$,$$,esc} from './dom.js';
import {normalizeUrl} from './url.js';
const dlg=$('#modal'),form=$('#site-form');let editing=null;
const setErrors=e=>$$('[data-err]',form).forEach(n=>n.textContent=e[n.dataset.err]||'');
const parseTags=s=>[...new Map(s.split(',').map(t=>t.trim()).filter(Boolean).map(t=>[t.toLowerCase(),t])).values()];
export function initModal(){
  dlg.addEventListener('click',e=>{if(e.target===dlg||e.target.closest('[data-close]'))dlg.close()});
  form.addEventListener('submit',onSubmit);
}
export function openModal(site=null){
  editing=site;form.reset();setErrors({});
  $('#modal-title').textContent=site?'Edit website':'Add website';
  const f=form.elements;
  f.categoryId.innerHTML='<option value="">Uncategorized</option>'+state.categories.map(c=>`<option value="${esc(c.id)}">${esc(c.name)}</option>`).join('');
  if(site){for(const k of ['url','title','description','notes','thumbnail','favicon'])f[k].value=site[k]||'';f.categoryId.value=site.categoryId||'';f.tags.value=(site.tags||[]).join(', ')}
  dlg.showModal();f.url.focus();
}
async function onSubmit(e){
  e.preventDefault();const f=form.elements,errs={};
  const url=normalizeUrl(f.url.value),title=f.title.value.trim();
  if(!f.url.value.trim())errs.url='Enter the website URL.';else if(!url)errs.url='Enter a valid web address, for example https://example.com.';
  if(!title)errs.title='Enter a title.';
  const opt=k=>{const v=f[k].value.trim();if(!v)return'';const n=normalizeUrl(v);if(!n)errs[k]='Enter a valid URL or leave this empty.';return n||''};
  const thumbnail=opt('thumbnail'),favicon=opt('favicon');
  try{
    if(url&&await websiteRepo.findByUrl(url,editing?.id))errs.url='This URL is already in your library.';
    if(Object.keys(errs).length)return setErrors(errs);
    const data={url,title,description:f.description.value.trim(),categoryId:f.categoryId.value||null,tags:parseTags(f.tags.value),notes:f.notes.value.trim(),thumbnail,favicon};
    editing?await websiteRepo.update(editing.id,data):await websiteRepo.create(data);
    dlg.close();emit('websites:changed');
  }catch(err){setErrors({form:err.message})}
}
