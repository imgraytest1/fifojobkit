// FIFO Job Kit offline cache: shows the last saved kit when there is no signal.
var C='fifokit-v50';
var CORE=['/','/index.html','/manifest.webmanifest','/icons/icon-192.png','/icons/icon-512.png','/icons/icon-180.png'];
self.addEventListener('install',function(e){e.waitUntil(caches.open(C).then(function(c){return c.addAll(CORE)}).then(function(){return self.skipWaiting()}))});
self.addEventListener('activate',function(e){e.waitUntil(caches.keys().then(function(k){return Promise.all(k.filter(function(n){return n!==C}).map(function(n){return caches.delete(n)}))}).then(function(){return self.clients.claim()}))});
self.addEventListener('fetch',function(e){
  var r=e.request; if(r.method!=='GET') return;
  var u=new URL(r.url);
  if(u.origin===location.origin){
    // Network first for pages so updates show; fall back to cache offline.
    e.respondWith(fetch(r).then(function(res){ if(res.ok){var cp=res.clone(); caches.open(C).then(function(c){c.put(r,cp)});} return res; })
      .catch(function(){ return caches.match(r).then(function(m){ return m||(r.mode==='navigate'?caches.match('/'):undefined); }); }));
  } else if(/fonts\.(googleapis|gstatic)\.com$/.test(u.hostname)){
    e.respondWith(caches.match(r).then(function(m){ return m||fetch(r).then(function(res){var cp=res.clone(); caches.open(C).then(function(c){c.put(r,cp)}); return res;}); }));
  }
});
