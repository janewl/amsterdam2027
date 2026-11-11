import {weeks,PHASES,START,RACE,TOTAL,DAYNAME,DAYFULL,currentWeek,fmtRange,dateOf,sameDay} from "./plan.js";
import {EX,exName,initExerciseDialog} from "./exercises.js";
import {initStore,onStoreState,state,store,signIn,signOut} from "./store.js";
import {initSession,startSession,openSession,viewSession,getActive,toast} from "./session.js";

const $=id=>document.getElementById(id);
const today=new Date(); today.setHours(0,0,0,0);
const cw=currentWeek(today);
const days=Math.round((RACE-today)/86400000);
$("daysLeft").textContent=days>=0?days:"0";

// ---------- plan ----------
const TAGS={walk:["run","Aktiv hvile"],gym:["gym","Styrke"],run:["run","Løp"],q:["q","Kvalitet"],long:["long","Langtur"],race:["race","Løpsdag"]};
const els={}, weekEls={}, byKey={}, goBtns={};
let progress={};

function renderPlan(){
  const host=$("phases");
  PHASES.forEach(p=>{
    const box=document.createElement("div"); box.className="phase";
    const head=document.createElement("div"); head.className="phase-head";
    const h=document.createElement("h3"); h.textContent=`Fase ${p.n} · ${p.name}`;
    const d=document.createElement("p"); d.textContent=`Uke ${p.from}–${p.to}. ${p.desc}`;
    head.append(h,d); box.append(head);
    weeks.filter(x=>x.w>=p.from&&x.w<=p.to).forEach(x=>{
      const det=document.createElement("details"); det.className="week"+(x.w===cw?" now":"");
      if(x.w===cw) det.open=true;
      const sum=document.createElement("summary");
      sum.innerHTML=`<span class="wk">Uke ${x.w}</span><span class="dates">${fmtRange(x.mon,x.sun)}</span>`+
        (x.light?`<span class="pill light">Lett uke</span>`:"")+(x.w===cw?`<span class="pill now">${today<START?"Første uke":"Denne uka"}</span>`:"")+
        `<span class="count" data-count></span>`;
      det.append(sum);
      const ul=document.createElement("ul"); ul.className="sessions";
      x.sessions.forEach(s=>{
        byKey[s.key]=s;
        const li=document.createElement("li"); li.className="s";
        const id="cb-"+s.key;
        const cb=document.createElement("input"); cb.type="checkbox"; cb.id=id;
        const day=document.createElement("label"); day.className="day"; day.htmlFor=id; day.textContent=DAYNAME[s.d];
        const txt=document.createElement("div"); txt.className="txt";
        const t=document.createElement("label"); t.className="ttl"; t.htmlFor=id;
        const tg=document.createElement("span"); tg.className="tag "+TAGS[s.k][0]; tg.textContent=TAGS[s.k][1];
        t.append(tg,document.createTextNode(s.title));
        const info=document.createElement("span"); info.className="info"; info.textContent=s.info;
        txt.append(t,info);
        if(s.ex.length){
          const ex=document.createElement("div"); ex.className="exs";
          s.ex.forEach(eid=>{const b=document.createElement("button");b.type="button";b.className="exbtn";b.dataset.ex=eid;b.textContent=exName(eid);ex.append(b);});
          txt.append(ex);
          const go=document.createElement("button"); go.type="button"; go.className="btn primary small startbtn"; go.textContent="Start økt";
          go.addEventListener("click",()=>progress[s.key]?viewSession(s):start(s));
          txt.append(go); goBtns[s.key]=go;
        }
        const wu=document.createElement("a"); wu.className="wu"; wu.href="#"+s.wu; wu.textContent="Oppvarming";
        txt.append(wu);
        li.append(cb,day,txt); ul.append(li);
        els[s.key]={cb,li};
        cb.addEventListener("change",()=>{ if(cb.checked) progress[s.key]=true; else delete progress[s.key]; paint(); saveProgress(); });
      });
      det.append(ul);
      if(x.w===0){const n=document.createElement("p");n.className="note";n.textContent="Oppstartsuke. Det er normalt å bli støl etter den første turen. Ikke løp igjen før stølheten har gitt seg. Gåing og overkropp er fint i mellomtiden.";det.append(n);}
      if(x.light){const n=document.createElement("p");n.className="note";n.textContent="Lett uke: kroppen bygger seg opp i hvilen. Ikke legg på ekstra.";det.append(n);}
      box.append(det); weekEls[x.w]={count:sum.querySelector("[data-count]"),keys:x.sessions.map(s=>s.key)};
    });
    host.append(box);
  });
}
function paint(){
  let n=0;
  for(const k in els){const on=!!progress[k]; els[k].cb.checked=on; els[k].li.classList.toggle("is-done",on); if(on)n++;}
  for(const k in goBtns){const on=!!progress[k], b=goBtns[k]; b.textContent=on?"Se økt":"Start økt"; b.classList.toggle("primary",!on); b.classList.toggle("ghost",on);}
  for(const w in weekEls){const W=weekEls[w]; const d=W.keys.filter(k=>progress[k]).length; W.count.textContent=`${d}/${W.keys.length}`; W.count.classList.toggle("full",d===W.keys.length);}
  $("doneCount").textContent=n;
  $("doneOf").textContent=`av ${TOTAL} økter fullført`;
  $("bar").style.width=(n/TOTAL*100).toFixed(1)+"%";
  renderToday();
}
function saveProgress(){ store.set("state/progress",{done:{...progress},updated:Date.now()}); }
function markDone(key){ progress[key]=true; paint(); saveProgress(); }
function unmark(key){ delete progress[key]; paint(); saveProgress(); }

// Wait until we know whether you are signed in, so a session is never started in the browser
// while your data is in the cloud (or the other way round).
let storeReady=null;
async function start(s){
  if(!state.ready) toast("Kobler til lagringen …");
  await storeReady; startSession(s);
}

// ---------- today / resume ----------
let todayTok=0;
async function renderToday(){
  const tok=++todayTok;
  const act=state.ready?await getActive():null;
  if(tok!==todayTok) return;
  const box=$("today"); box.textContent="";
  if(act){
    const b=document.createElement("div"); b.className="banner";
    const p=document.createElement("p"); p.innerHTML=`<b>Økt i gang:</b> `; p.append(document.createTextNode(`${DAYFULL[act.d]} uke ${act.w} · ${act.title}`));
    const go=document.createElement("button"); go.type="button"; go.className="btn primary"; go.textContent="Fortsett økta";
    go.addEventListener("click",()=>openSession(act));
    b.append(p,go); box.append(b); return;
  }
  const w=weeks[cw]; if(!w) return;
  const s=w.sessions.find(x=>x.ex.length&&sameDay(dateOf(cw,x.d),today));
  if(s&&!progress[s.key]){
    const b=document.createElement("div"); b.className="banner";
    const p=document.createElement("p"); p.innerHTML=`<b>I dag:</b> `; p.append(document.createTextNode(`${s.title} · ${s.ex.length} øvelser`));
    const go=document.createElement("button"); go.type="button"; go.className="btn primary"; go.textContent="Start dagens økt";
    go.addEventListener("click",()=>start(s));
    b.append(p,go); box.append(b);
  }
}

// ---------- account ----------
let unwatch=null;
function renderAccount(st){
  const a=$("acct"); a.textContent="";
  const msg=document.createElement("span");
  if(!st.configured) msg.textContent="Lagres i denne nettleseren. Skylagring er ikke satt opp ennå.";
  else if(!st.ready) msg.textContent="Kobler til …";
  else if(st.user) msg.textContent=`Innlogget som ${st.user.email}. Lagres i skyen og virker uten nett.`;
  else msg.textContent="Ikke innlogget. Fremgangen lagres bare i denne nettleseren.";
  a.append(msg);
  if(st.configured&&st.ready){
    const b=document.createElement("button"); b.type="button"; b.className="btn small"+(st.user?" ghost":" primary");
    b.textContent=st.user?"Logg ut":"Logg inn med Google";
    b.addEventListener("click",()=>st.user?signOut():signIn());
    a.append(b);
  }
  const e=$("acct-err"); e.hidden=!st.error; e.textContent=st.error||"";
}
let lastMode=null, lastUid=null;
function onState(st){
  renderAccount(st);
  if(!st.ready) return;
  const uid=st.user&&st.user.uid;
  if(st.mode===lastMode&&uid===lastUid) return;
  lastMode=st.mode; lastUid=uid;
  if(unwatch) unwatch();
  unwatch=store.watch("state/progress",d=>{ progress={...((d&&d.done)||{})}; paint(); });
}

// ---------- boot ----------
// Avkrysninger fra forrige versjon av siden (lagret under en annen nøkkel) flyttes over.
try{
  const old=localStorage.getItem("mot-amsterdam-2027");
  if(old&&!localStorage.getItem("ma27:state/progress")) localStorage.setItem("ma27:state/progress",JSON.stringify({done:JSON.parse(old)||{},updated:Date.now()}));
  if(old) localStorage.removeItem("mot-amsterdam-2027");
}catch(e){}
renderPlan();
initExerciseDialog();
initSession({markDone,unmark,onClose:()=>renderToday(),isDone:k=>!!progress[k]});
paint();
onStoreState(onState);
storeReady=initStore();
