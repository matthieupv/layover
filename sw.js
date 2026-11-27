/* Layover — service worker : affiche les notifications envoyées par le serveur */
self.addEventListener('install',()=>self.skipWaiting());
self.addEventListener('activate',e=>e.waitUntil(self.clients.claim()));
const EN={voice:'🎤 Voice message',wave:'{n} said hi',acc:'{n} waved back 👋 You can now chat.',freq:'{n} would like to stay friends',fracc:"{n} accepted: you're staying in touch ⭐",
  arr:'✈ {n} just arrived at {h}',ev:'🎉 {n} proposes an event: {e}',rem:'“{e}” starts in 15 min',kitTme:"You're leaving soon",kitDme:'Suggest to {n} that you stay friends.',kitTo:'{n} is leaving soon',kitDo:'Suggest staying friends.',goT:"It's time!",goB:'“{e}”: meet at the meeting point now.'};
async function tx(){try{const c=await caches.open('lv-tx');const r=await c.match(new URL('./lv-tx.json',self.registration.scope).href);if(r)return Object.assign({},EN,await r.json())}catch(e){}return EN}
const f=(s,p)=>String(s||'').replace(/\{(\w)\}/g,(m,k)=>({n:p.n,e:p.e,h:p.h}[k]??''));
self.addEventListener('push',e=>{let p={};try{p=e.data?e.data.json():{}}catch(_){p={b:e.data&&e.data.text()}}
  e.waitUntil(tx().then(T=>{let title='Layover',body='';
    if(p.k==='msg'){title=p.n||title;body=p.b||''}
    else if(p.k==='voice'){title=p.n||title;body=T.voice}
    else if(p.k==='kitme'){title=T.kitTme;body=f(T.kitDme,p)}
    else if(p.k==='kito'){title=f(T.kitTo,p);body=T.kitDo}
    else if(p.k==='start'){title=T.goT;body=f(T.goB,p)}
    else body=f(T[p.k]||p.b||'',p);
    return self.registration.showNotification(title,{body,tag:p.u||undefined,renotify:true,icon:'icon-192.png',badge:'icon-192.png',data:{u:p.u||''}})}))});
self.addEventListener('notificationclick',e=>{e.notification.close();const u=(e.notification.data||{}).u||'';
  const url=new URL('./?go='+encodeURIComponent(u),self.registration.scope).href;
  e.waitUntil(self.clients.matchAll({type:'window',includeUncontrolled:true}).then(cs=>{for(const c of cs){if('focus' in c){c.postMessage({go:u});return c.focus()}}return self.clients.openWindow(url)}))});
