export const nowIso=()=>new Date().toISOString();
export const formatDate=s=>{const d=new Date(s);return isNaN(d)?'—':d.toLocaleDateString(undefined,{year:'numeric',month:'short',day:'numeric'})};
