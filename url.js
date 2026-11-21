// Returns a normalized http(s) URL string, or null if invalid.
export function normalizeUrl(input){
  const t=(input||'').trim();if(!t)return null;
  try{const u=new URL(/^[a-z][a-z0-9+.-]*:\/\//i.test(t)?t:'https://'+t);
    return ['http:','https:'].includes(u.protocol)&&u.hostname.includes('.')?u.href:null}catch{return null}
}
// Key used for duplicate detection (ignores www, trailing slash, hash, case).
export const urlKey=u=>{try{const x=new URL(u);return(x.hostname.replace(/^www\./,'')+x.pathname.replace(/\/+$/,'')+x.search).toLowerCase()}catch{return String(u).toLowerCase()}};
export const hostname=u=>{try{return new URL(u).hostname.replace(/^www\./,'')}catch{return u}};
