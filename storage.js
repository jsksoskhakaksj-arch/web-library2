// Repository layer: the UI only talks to these async methods, so LocalStorage can be swapped for Supabase later.
import {SAMPLE_CATEGORIES,SAMPLE_WEBSITES} from './mock-data.js';
import {nowIso} from './date.js';
import {urlKey} from './url.js';
const KEYS={websites:'wl:websites',categories:'wl:categories',collections:'wl:collections',prefs:'wl:prefs'};
const read=(k,fb)=>{try{const v=JSON.parse(localStorage.getItem(k));return v??fb}catch{return fb}};
const write=(k,v)=>{try{localStorage.setItem(k,JSON.stringify(v));return true}catch{return false}};
const list=(key,seed,valid)=>{const v=read(key,null);if(!Array.isArray(v)){write(key,seed);return structuredClone(seed)}return v.filter(valid)};
const allSites=()=>list(KEYS.websites,SAMPLE_WEBSITES,w=>w&&w.id&&w.url&&w.title);
const saveSites=a=>{if(!write(KEYS.websites,a))throw new Error('Could not save to browser storage (storage may be full or blocked).')};
export const websiteRepo={
  async list(){return allSites()},
  async findByUrl(url,exceptId){return allSites().find(w=>w.id!==exceptId&&urlKey(w.url)===urlKey(url))||null},
  async create(data){const ts=nowIso(),site={id:crypto.randomUUID(),favorite:false,lastVisitedAt:null,...data,createdAt:ts,updatedAt:ts};saveSites([...allSites(),site]);return site},
  async update(id,patch,touch=true){const a=allSites().map(w=>w.id===id?{...w,...patch,...(touch?{updatedAt:nowIso()}:{})}:w);saveSites(a);return a.find(w=>w.id===id)},
  async remove(id){saveSites(allSites().filter(w=>w.id!==id))}};
export const categoryRepo={async list(){return list(KEYS.categories,SAMPLE_CATEGORIES,c=>c&&c.id&&c.name)}};
export const collectionRepo={async list(){return list(KEYS.collections,[],c=>c&&c.id)}};
export const prefs={get:(k,fb)=>read(KEYS.prefs,{})[k]??fb,set:(k,v)=>write(KEYS.prefs,{...read(KEYS.prefs,{}),[k]:v})};
