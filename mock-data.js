const fav=d=>`https://www.google.com/s2/favicons?domain=${d}&sz=64`;
export const SAMPLE_CATEGORIES=[{id:'cat-dev',name:'Development'},{id:'cat-design',name:'Design'},{id:'cat-read',name:'Reading'},{id:'cat-tools',name:'Tools'}];
const mk=(i,url,title,description,categoryId,tags,favorite)=>({id:'sample-'+i,url,title,description,thumbnail:'',favicon:fav(new URL(url).hostname),categoryId,tags,notes:'',favorite,createdAt:`2026-11-0${i}T09:00:00.000Z`,updatedAt:`2026-11-0${i}T09:00:00.000Z`,lastVisitedAt:null});
export const SAMPLE_WEBSITES=[
  mk(1,'https://developer.mozilla.org/','MDN Web Docs','Reference documentation for HTML, CSS and JavaScript.','cat-dev',['reference','web'],true),
  mk(2,'https://lucide.dev/','Lucide','Open-source icon library with consistent, clean icons.','cat-design',['icons'],false),
  mk(3,'https://css-tricks.com/','CSS-Tricks','Articles and guides about modern CSS and front-end work.','cat-read',['css','articles'],true),
  mk(4,'https://github.com/','GitHub','Host and review code, and publish sites with GitHub Pages.','cat-dev',['git','hosting'],false),
  mk(5,'https://www.figma.com/','Figma','Collaborative interface design tool that runs in the browser.','cat-tools',['design','ui'],false)];
