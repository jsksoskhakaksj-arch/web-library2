const bus=new EventTarget();
export const on=(n,fn)=>bus.addEventListener(n,fn);
export const emit=(n,detail)=>bus.dispatchEvent(new CustomEvent(n,{detail}));
