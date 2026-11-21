export function filterSites(sites,ui,cats){
  const q=ui.query.trim().toLowerCase(),cn=Object.fromEntries(cats.map(c=>[c.id,c.name]));
  const r=sites.filter(w=>(ui.category==='all'||w.categoryId===ui.category)&&(!ui.favOnly||w.favorite)&&
    (!q||[w.title,w.url,w.description,(w.tags||[]).join(' '),cn[w.categoryId]||''].join(' ').toLowerCase().includes(q)));
  const [k,d]=ui.sort.split('-');
  r.sort((a,b)=>{const c=k==='name'?a.title.localeCompare(b.title):a.createdAt.localeCompare(b.createdAt);return d==='desc'?-c:c});
  return r;
}
