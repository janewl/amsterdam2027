// Lagring: Firestore når du er logget inn med Google, ellers denne nettleseren.
// Alle stier er relative til brukeren, f.eks. "state/progress" eller "sessions/s123".
import * as CFG from "../firebase-config.js";
const {firebaseConfig, allowedEmail}=CFG;
const googleClientId=CFG.googleClientId||"";

const SDK="https://www.gstatic.com/firebasejs/10.12.2/";
const LS="ma27:";
const listeners=new Set();
export const state={configured:!!firebaseConfig, ready:false, user:null, mode:"local", error:null};
function emit(){listeners.forEach(f=>{try{f(state)}catch(e){console.error(e)}})}
export function onStoreState(f){listeners.add(f); f(state); return ()=>listeners.delete(f);}
function fail(e){
  console.error(e);
  state.error=e&&e.code==="permission-denied"
    ?`Databasen avviste ${state.user?state.user.email:"kontoen"}. Logg inn med Google-kontoen som står i sikkerhetsreglene, eller sjekk at e-postadressen i reglene er skrevet riktig.`
    :"Noe gikk galt med lagringen. Det du har logget ligger lagret på enheten og sendes når forbindelsen er tilbake.";
  emit();
}

// ---------- local ----------
const lget=p=>{try{const v=localStorage.getItem(LS+p);return v?JSON.parse(v):null}catch(e){return null}};
const lset=(p,v)=>{try{localStorage.setItem(LS+p,JSON.stringify(v))}catch(e){}};
const localWatchers={};
function lnotify(p){(localWatchers[p]||[]).forEach(cb=>cb(lget(p)));}
function deepMerge(a,b){
  const o={...(a||{})};
  for(const k in b){ const v=b[k]; o[k]=(v&&typeof v==="object"&&!Array.isArray(v)&&o[k]&&typeof o[k]==="object"&&!Array.isArray(o[k]))?deepMerge(o[k],v):v; }
  return o;
}
function localKeys(){const out=[];try{for(let i=0;i<localStorage.length;i++){const k=localStorage.key(i);if(k&&k.startsWith(LS))out.push(k.slice(LS.length));}}catch(e){}return out;}
const local={
  async get(p){return lget(p)},
  async set(p,v){lset(p,v); lnotify(p)},
  async merge(p,v){lset(p,deepMerge(lget(p),v)); lnotify(p)},
  async del(p){try{localStorage.removeItem(LS+p)}catch(e){} lnotify(p)},
  async list(c){return localKeys().filter(k=>k.startsWith(c+"/")&&!k.slice(c.length+1).includes("/")).map(k=>({id:k.slice(c.length+1),...lget(k)}))},
  watch(p,cb){(localWatchers[p]=localWatchers[p]||[]).push(cb); cb(lget(p)); return ()=>{localWatchers[p]=(localWatchers[p]||[]).filter(f=>f!==cb)}}
};

// ---------- cloud ----------
let F=null,A=null,db=null,auth=null;
const ref=p=>F.doc(db,"users",state.user.uid,...p.split("/"));
const cloud={
  async get(p){
    try{const s=await F.getDoc(ref(p)); return s.exists()?s.data():null}
    catch(e){try{const s=await F.getDocFromCache(ref(p)); return s.exists()?s.data():null}catch(e2){return null}}
  },
  // Writes land in the local cache at once and sync in the background (also offline), so we never wait on the server.
  set(p,v){F.setDoc(ref(p),v).catch(fail); return Promise.resolve()},
  merge(p,v){F.setDoc(ref(p),v,{merge:true}).catch(fail); return Promise.resolve()},
  del(p){F.deleteDoc(ref(p)).catch(fail); return Promise.resolve()},
  async list(c){
    const col=F.collection(db,"users",state.user.uid,...c.split("/"));
    try{const q=await F.getDocs(col); return q.docs.map(d=>({id:d.id,...d.data()}))}
    catch(e){try{const q=await F.getDocsFromCache(col); return q.docs.map(d=>({id:d.id,...d.data()}))}catch(e2){return []}}
  },
  watch(p,cb){return F.onSnapshot(ref(p),s=>cb(s.exists()?s.data():null),fail)}
};

const cur=()=>state.mode==="cloud"?cloud:local;
export const store={
  get:p=>cur().get(p), set:(p,v)=>cur().set(p,v), merge:(p,v)=>cur().merge(p,v),
  del:p=>cur().del(p), list:c=>cur().list(c), watch:(p,cb)=>cur().watch(p,cb)
};

// Move anything saved in this browser into the cloud the first time you sign in.
async function migrate(){
  const keys=localKeys(); if(!keys.length) return;
  for(const k of keys){
    const v=lget(k); if(v==null) continue;
    if(k==="state/progress"){
      const c=await cloud.get(k)||{};
      await cloud.set(k,{done:{...(v.done||{}),...(c.done||{})},updated:Date.now()});
    } else if(k==="state/active"){
      const c=await cloud.get(k); if(!c||!c.id) await cloud.set(k,v);
    } else {
      const c=await cloud.get(k); if(!c) await cloud.set(k,v);
    }
  }
  keys.forEach(k=>{try{localStorage.removeItem(LS+k)}catch(e){}});
}

export function initStore(){
  return new Promise(resolve=>{
    const done=()=>{if(!state.ready){state.ready=true; emit(); resolve();}};
    if(!firebaseConfig){done(); return;}
    setTimeout(done,6000);
    (async()=>{
      try{
        const [app,au,fs]=await Promise.all([import(SDK+"firebase-app.js"),import(SDK+"firebase-auth.js"),import(SDK+"firebase-firestore.js")]);
        A=au; F=fs;
        const fbApp=app.initializeApp(firebaseConfig);
        auth=A.getAuth(fbApp);
        try{ db=F.initializeFirestore(fbApp,{localCache:F.persistentLocalCache({tabManager:F.persistentMultipleTabManager()})}); }
        catch(e){ db=F.getFirestore(fbApp); }
        try{ await A.getRedirectResult(auth); }catch(e){}
        await finishGoogleRedirect();
        A.onAuthStateChanged(auth,async u=>{
          if(u&&allowedEmail&&(u.email||"").toLowerCase()!==allowedEmail.toLowerCase()){
            state.error=`Kontoen ${u.email} har ikke tilgang. Logg inn med ${allowedEmail}.`;
            await A.signOut(auth); return;
          }
          state.user=u?{uid:u.uid,email:u.email,name:u.displayName||u.email}:null;
          state.mode=u?"cloud":"local";
          if(u){ try{await migrate();}catch(e){console.error(e)} state.error=null; }
          if(state.ready) emit(); else done();
        });
      }catch(e){
        console.error(e);
        state.error="Fikk ikke kontakt med skylagringen. Fremgangen lagres i denne nettleseren inntil videre.";
        done();
      }
    })();
  });
}

/* Safari on iPhone blocks both Firebase's popup/redirect (firebaseapp.com is another site) and Google's
   button popup. So when a client ID is set, we send the whole page to Google and get an ID token back in
   the URL fragment on our own address, then exchange it for a Firebase session. No popups, no third-party cookies. */
const REDIRECT_URI=location.origin+location.pathname;
const rnd=()=>Array.from(crypto.getRandomValues(new Uint8Array(16)),b=>b.toString(16).padStart(2,"0")).join("");

function googleRedirect(){
  const st=rnd(), nonce=rnd();
  try{ sessionStorage.setItem("ma27-oauth",st); }catch(e){}
  const q=new URLSearchParams({client_id:googleClientId, redirect_uri:REDIRECT_URI, response_type:"id_token",
    scope:"openid email profile", nonce, state:st, prompt:"select_account"});
  location.assign("https://accounts.google.com/o/oauth2/v2/auth?"+q);
}

// Called once Firebase Auth is ready: picks up the token Google sent back, if any.
async function finishGoogleRedirect(){
  if(!location.hash||location.hash.indexOf("id_token=")<0&&location.hash.indexOf("error=")<0) return;
  const h=new URLSearchParams(location.hash.slice(1));
  history.replaceState(null,"",REDIRECT_URI+location.search);
  let expected=null; try{ expected=sessionStorage.getItem("ma27-oauth"); sessionStorage.removeItem("ma27-oauth"); }catch(e){}
  if(h.get("error")){ if(h.get("error")!=="access_denied"){ state.error="Google avviste innloggingen ("+h.get("error")+")."; emit(); } return; }
  if(!expected||h.get("state")!==expected){ state.error="Innloggingen ble avbrutt. Prøv igjen."; emit(); return; }
  try{ await A.signInWithCredential(auth,A.GoogleAuthProvider.credential(h.get("id_token"))); }
  catch(e){ console.error(e); state.error="Innloggingen feilet ("+(e.code||"ukjent feil")+")."; emit(); }
}

export async function signIn(){
  if(googleClientId){ googleRedirect(); return; }
  if(!auth){state.error="Skylagringen er ikke klar ennå. Prøv igjen om litt."; emit(); return;}
  const p=new A.GoogleAuthProvider(); p.setCustomParameters({prompt:"select_account"});
  try{ await A.signInWithPopup(auth,p); }
  catch(e){
    if(e.code==="auth/popup-blocked"||e.code==="auth/operation-not-supported-in-this-environment"){ await A.signInWithRedirect(auth,p); return; }
    if(e.code==="auth/popup-closed-by-user"||e.code==="auth/cancelled-popup-request") return;
    state.error=e.code==="auth/unauthorized-domain"
      ?"Domenet er ikke godkjent i Firebase. Legg til janewl.github.io under Authentication → Settings → Authorized domains."
      :"Innloggingen feilet ("+e.code+").";
    emit();
  }
}
export async function signOut(){
  if(auth) await A.signOut(auth);
}
