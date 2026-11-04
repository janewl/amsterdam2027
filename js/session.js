// Aktiv økt: logging av sett, notater, forslag til vekt og pausetimer.
import {EX,BANDS,openExercise} from "./exercises.js";
import {LIGHT,phaseOf,prescribe,DAYFULL,fmtDate} from "./plan.js";
import {store} from "./store.js";

const $=id=>document.getElementById(id);
let S=null;            // the active session
let meta={};           // per exercise: {note,last}
let hooks={};
let saveT=0, clockT=0, wake=null;
const noteT={};

const num=v=>{if(v==null||v==="") return null; const n=parseFloat(String(v).replace(",",".")); return isNaN(n)?null:n;};
const fk=n=>n==null?"":String(Math.round(n*100)/100).replace(".",",");
const range=r=>r[0]===r[1]?`${r[0]}`:`${r[0]}–${r[1]}`;
function unitOf(type){return type==="time"?"sek":type==="dist"?"m":"reps";}
function rxText(ex,rx){
  const t=ex.log.type, u=t==="time"?" sek":t==="dist"?" m":"";
  return `${rx.sets} × ${range(rx.reps)}${u}${rx.per?" "+rx.per:""}${rx.rir?` · RIR ${rx.rir}`:""}`;
}
function setText(ex,s){
  const t=ex.log.type;
  if(t==="time") return `${fk(s.sec)} s`;
  if(t==="dist") return `${fk(s.kg)} kg × ${fk(s.m)} m`;
  if(t==="band") return `${s.band==="Uten strikk"?"uten strikk":s.band.toLowerCase()} × ${fk(s.reps)}`;
  if(t==="reps") return `${fk(s.reps)}`;
  if(t==="bw") return s.kg?`+${fk(s.kg)} kg × ${fk(s.reps)}`:`${fk(s.reps)}`;
  return s.kg==null?`${fk(s.reps)} reps`:`${fk(s.kg)} × ${fk(s.reps)}`;
}
function lastText(id){
  const L=meta[id]&&meta[id].last; const ex=EX[id];
  if(!L||!L.sets||!L.sets.length) return "Ingen logg ennå.";
  return `Forrige gang (${fmtDate(L.date)}): `+L.sets.map(s=>setText(ex,s)).join(" · ");
}

/** Suggestion for this session, based on the last logged sets. */
export function suggest(id,last,rx,w){
  const ex=EX[id], t=ex.log.type, [lo,hi]=rx.reps;
  const hold=w===0||w>=48||LIGHT.has(w)||phaseOf(w)===4;
  const holdWhy=LIGHT.has(w)?"Lett uke":phaseOf(w)===4?"Vedlikeholdsfase":w>=48?"Nedtrapping":"Oppstartsuke";
  if(!last||!last.sets||!last.sets.length){
    if(t==="band") return {text:"Første gang: velg strikken som gir 6–10 reps med god teknikk."};
    if(t==="time") return {text:`Første gang: hold ${range(rx.reps)} sekunder med god form.`};
    if(t==="reps"||t==="bw") return {text:"Første gang: fokuser på kontrollert teknikk."};
    return {text:`Første gang: velg en vekt der du klarer ${range(rx.reps)} reps${rx.rir?` og har ${rx.rir} reps igjen`:""}.`};
  }
  const sets=last.sets;
  const val=s=>t==="time"?s.sec:t==="dist"?s.m:s.reps;
  const vals=sets.map(val).filter(v=>v!=null);
  const allTop=vals.length>=Math.min(rx.sets,(last.rx&&last.rx.sets)||rx.sets)&&vals.every(v=>v>=hi);
  const missed=vals.filter(v=>v<lo).length;
  const lastKg=Math.max(...sets.map(s=>s.kg||0));
  const band=sets[sets.length-1].band;
  if(ex.log.noProgress) return {text:"Hold samme antall og fokuser på myke, stille landinger."};
  if(t==="band"){
    const i=Math.max(0,BANDS.indexOf(band));
    if(hold) return {text:`${holdWhy}: behold strikken (${band.toLowerCase()}).`,band};
    if(allTop&&band!=="Uten strikk") return {text:`Du klarte ${hi} reps i alle sett. Bytt til ${BANDS[i+1].toLowerCase()} strikk.`,band:BANDS[i+1],up:true};
    if(allTop) return {text:"Du klarte alle reps uten strikk. Legg på 2,5 kg i et belte, eller ta flere reps.",band};
    if(missed>=2&&i>0) return {text:`Mange sett under ${lo} reps sist. Behold strikken, eller bruk ${BANDS[i-1].toLowerCase()} i de siste settene.`,band};
    return {text:`Behold strikken (${band.toLowerCase()}) og prøv å ta flere reps enn sist.`,band};
  }
  if(t==="time"){
    const best=Math.max(...vals);
    if(hold) return {text:`${holdWhy}: hold samme tid som sist.`,sec:best};
    if(allTop) return {text:`Du holdt hele tiden i alle sett. Prøv ${hi+ex.log.step} sekunder.`,sec:hi+ex.log.step,up:true};
    return {text:`Prøv å holde ${hi} sekunder i alle sett.`,sec:hi};
  }
  if(t==="reps") return {text:allTop&&!hold?"Du klarte alle reps. Ta dem saktere og mer kontrollert for å gjøre det tyngre.":"Prøv å ta alle reps med god kontroll."};
  if(t==="bw"){
    if(hold) return {text:`${holdWhy}: samme variant som sist.`,kg:lastKg||null};
    if(allTop) return {text:"Du klarte alle reps. Gjør det tyngre: føttene på en benk, eller vekt på ryggen.",kg:lastKg||null,up:true};
    return {text:"Prøv å ta flere reps enn sist.",kg:lastKg||null};
  }
  // kg, db, dist
  const unit=t==="db"||t==="dist"?" kg per hånd":" kg";
  if(hold) return {text:`${holdWhy}: behold ${fk(lastKg)}${unit}.`,kg:lastKg};
  if(allTop){
    const nk=lastKg+ex.log.step;
    const what=t==="dist"?`${hi} m`:`${hi} reps`;
    return {text:`Du klarte ${what} i alle sett. Prøv ${fk(nk)}${unit}${t==="db"?" (neste manual opp)":""}. Hvis siste sett føltes tyngre enn RIR-målet, behold vekta.`,kg:nk,up:true};
  }
  if(missed>=2&&lastKg>0){
    const nk=Math.max(0,lastKg-ex.log.step);
    return {text:`Flere sett under ${lo} reps sist. Behold ${fk(lastKg)}${unit}, eller gå ned til ${fk(nk)} hvis det fortsatt er tungt.`,kg:lastKg};
  }
  return {text:`Behold ${fk(lastKg)}${unit} og prøv å ta flere reps enn sist.`,kg:lastKg};
}

function blankSet(id,sug,last,i){
  const t=EX[id].log.type, L=last&&last.sets&&last.sets[Math.min(i,last.sets.length-1)];
  const s={done:false,reps:null};
  if(t==="kg"||t==="db"||t==="dist"||t==="bw") s.kg=sug&&sug.kg!=null?sug.kg:(L&&L.kg!=null?L.kg:null);
  if(t==="band") s.band=(sug&&sug.band)||(L&&L.band)||"Medium";
  if(t==="time") s.sec=null;
  if(t==="dist") s.m=null;
  return s;
}

// ---------- persistence ----------
function save(now){
  clearTimeout(saveT);
  const go=()=>{ if(S) store.set("sessions/"+S.id,JSON.parse(JSON.stringify(S))); };
  if(now) go(); else saveT=setTimeout(go,500);
}
export async function getActive(){
  const a=await store.get("state/active"); if(!a||!a.id) return null;
  const s=await store.get("sessions/"+a.id);
  return s&&s.status==="active"?s:null;
}
async function loadMeta(ids){
  meta={};
  await Promise.all(ids.map(async id=>{meta[id]=await store.get("exercises/"+id)||{};}));
}

// ---------- start / resume ----------
export async function startSession(sess){
  const act=await getActive();
  if(act){
    if(act.key!==sess.key) toast(`Du har en økt i gang fra ${DAYFULL[act.d].toLowerCase()} uke ${act.w}. Fullfør eller avbryt den først.`);
    return openSession(act);
  }
  await loadMeta(sess.ex);
  const items=sess.ex.map(id=>{
    const rx=prescribe(sess.w,sess.d,id), m=meta[id];
    const sug=suggest(id,m.last,rx,sess.w);
    return {ex:id,rx,sets:Array.from({length:rx.sets},(_,i)=>blankSet(id,sug,m.last,i))};
  });
  S={id:"s"+Date.now(),key:sess.key,w:sess.w,d:sess.d,title:sess.title,started:Date.now(),status:"active",items};
  save(true); store.set("state/active",{id:S.id});
  show();
}
export async function openSession(s){ S=s; await loadMeta(S.items.map(i=>i.ex)); show(); }

// ---------- rendering ----------
function show(){
  $("okt-eyebrow").textContent=`Uke ${S.w} · ${DAYFULL[S.d]}`;
  $("okt-title").textContent=S.title;
  $("okt-confirm").hidden=true;
  render();
  $("okt").hidden=false; document.body.classList.add("okt-open");
  $("okt").scrollTop=0;
  clearInterval(clockT); tickClock(); clockT=setInterval(tickClock,1000);
  keepAwake();
}
function hide(){
  $("okt").hidden=true; document.body.classList.remove("okt-open");
  clearInterval(clockT); releaseAwake();
  hooks.onClose&&hooks.onClose();
}
function tickClock(){
  if(!S) return; const m=Math.floor((Date.now()-S.started)/60000);
  $("okt-clock").textContent=m<60?`${m} min`:`${Math.floor(m/60)} t ${m%60} min`;
}
function el(tag,cls,text){const e=document.createElement(tag); if(cls) e.className=cls; if(text!=null) e.textContent=text; return e;}

function render(){
  const list=$("okt-list"); list.textContent="";
  S.items.forEach((it,ii)=>list.append(card(it,ii)));
}
function card(it,ii){
  const ex=EX[it.ex], t=ex.log.type, m=meta[it.ex]||{};
  const c=el("article","xcard"); c.dataset.i=ii;
  const head=el("div","xhead");
  const nm=el("button","xname",ex.n); nm.type="button"; nm.dataset.ex=it.ex; nm.title="Se hvordan øvelsen gjøres";
  const how=el("button","howbtn","Teknikk"); how.type="button"; how.dataset.ex=it.ex;
  head.append(nm,el("span","rx",rxText(ex,it.rx)),how);
  c.append(head);
  c.append(el("p","last",lastText(it.ex)));
  const sug=suggest(it.ex,m.last,it.rx,S.w);
  const sp=el("p","sug"+(sug.up?" up":""),sug.text); c.append(sp);

  // note
  const nl=el("label","note"); const nid=`note-${it.ex}`;
  const ns=el("span","notelbl","Notat til deg selv"); nl.htmlFor=nid;
  const ta=document.createElement("textarea"); ta.id=nid; ta.rows=1; ta.placeholder="F.eks. grep, innstilling på maskinen, hva du skal huske neste gang"; ta.value=m.note||"";
  ta.addEventListener("input",()=>{ meta[it.ex].note=ta.value; clearTimeout(noteT[it.ex]); noteT[it.ex]=setTimeout(()=>store.merge("exercises/"+it.ex,{note:ta.value}),700); });
  nl.append(ns,ta); c.append(nl);

  // sets
  const cols=t==="band"?["Strikk","Reps"]:t==="time"?["Sekunder"]:t==="dist"?["kg/hånd","Meter"]:t==="reps"?["Reps"]:t==="bw"?["Ekstra kg","Reps"]:[ex.log.kgLabel||(t==="db"?"kg/hånd":"kg"),"Reps"];
  const two=cols.length===2;
  const ch=el("div","colhead"+(two?"":" one")); ch.append(el("span","","Sett")); cols.forEach(x=>ch.append(el("span","",x))); ch.append(el("span","",""));
  const sets=el("div","sets"); sets.append(ch);
  it.sets.forEach((s,si)=>sets.append(setRow(it,ii,s,si,two)));
  c.append(sets);
  const ctl=el("div","setctl");
  const add=el("button","btn small","+ Sett"); add.type="button";
  add.addEventListener("click",()=>{ const L=it.sets[it.sets.length-1]; const n={...L,done:false}; it.sets.push(n); save(); rerenderCard(ii); });
  const rem=el("button","btn small ghost","− Sett"); rem.type="button"; rem.disabled=it.sets.length<=1;
  rem.addEventListener("click",()=>{ if(it.sets.length>1){ it.sets.pop(); save(); rerenderCard(ii);} });
  ctl.append(add,rem); c.append(ctl);
  if(it.sets.every(s=>s.done)) c.classList.add("done");
  return c;
}
function rerenderCard(ii){ const old=document.querySelector(`.xcard[data-i="${ii}"]`); if(old) old.replaceWith(card(S.items[ii],ii)); }

function input(id,val,mode,ph,on){
  const i=document.createElement("input"); i.id=id; i.inputMode=mode; i.autocomplete="off"; i.value=val==null?"":fk(val); i.placeholder=ph||"";
  i.addEventListener("input",()=>on(num(i.value))); return i;
}
function setRow(it,ii,s,si,two){
  const ex=EX[it.ex], t=ex.log.type, [lo,hi]=it.rx.reps;
  const row=el("div","setrow"+(two?"":" one")+(s.done?" is-done":""));
  row.append(el("span","setno",String(si+1)));
  const base=`s-${ii}-${si}`;
  // A value typed into one set is copied to the later, unfinished sets that are still empty or held the old value.
  const carry=(field,v,old)=>{
    for(let j=si+1;j<it.sets.length;j++){
      const o=it.sets[j]; if(o.done) continue;
      if(o[field]==null||o[field]===old){ o[field]=v; const inp=document.getElementById(`s-${ii}-${j}-${field}`); if(inp) inp.value=v==null?"":(field==="band"?v:fk(v)); }
    }
  };
  const ph=lo===hi?String(hi):`${lo}–${hi}`;
  if(t==="band"){
    const sel=document.createElement("select"); sel.id=base+"-band"; sel.setAttribute("aria-label",`Strikk sett ${si+1}`);
    BANDS.forEach(b=>{const o=document.createElement("option"); o.value=b; o.textContent=b; if(b===s.band) o.selected=true; sel.append(o);});
    sel.addEventListener("change",()=>{const old=s.band; s.band=sel.value; carry("band",s.band,old); save();});
    row.append(sel, input(base+"-reps",s.reps,"numeric",ph,v=>{s.reps=v;save();}));
  } else if(t==="time"){
    row.append(input(base+"-sec",s.sec,"numeric",ph,v=>{s.sec=v;save();}));
  } else if(t==="dist"){
    row.append(input(base+"-kg",s.kg,"decimal","kg",v=>{const o=s.kg; s.kg=v; carry("kg",v,o); save();}), input(base+"-m",s.m,"numeric",ph,v=>{s.m=v;save();}));
  } else if(t==="reps"){
    row.append(input(base+"-reps",s.reps,"numeric",ph,v=>{s.reps=v;save();}));
  } else {
    row.append(input(base+"-kg",s.kg,"decimal",t==="bw"?"0":"kg",v=>{const o=s.kg; s.kg=v; carry("kg",v,o); save();}), input(base+"-reps",s.reps,"numeric",ph,v=>{s.reps=v;save();}));
  }
  row.querySelectorAll("input,select").forEach(x=>x.setAttribute("aria-label",`${x.id.split("-").pop()} sett ${si+1}`));
  const chk=el("button","chk","✓"); chk.type="button"; chk.setAttribute("aria-pressed",s.done?"true":"false"); chk.setAttribute("aria-label",`Sett ${si+1} ferdig`);
  chk.addEventListener("click",()=>{
    s.done=!s.done;
    if(s.done){
      // Fill an empty count with the target so a quick tap still logs something sensible.
      if(t==="time"&&s.sec==null) s.sec=hi; else if(t==="dist"&&s.m==null) s.m=hi; else if(t!=="time"&&t!=="dist"&&s.reps==null) s.reps=hi;
      startTimer(ex.log.rest, ex.n);
    }
    save(); rerenderCard(ii);
  });
  row.append(chk);
  return row;
}

// ---------- finish / cancel ----------
function confirmBox(text,yes,yesLabel,noLabel){
  const b=$("okt-confirm"); b.textContent="";
  b.append(el("p","",text));
  const r=el("div","setctl");
  const y=el("button","btn primary",yesLabel); y.type="button"; y.addEventListener("click",yes);
  const n=el("button","btn ghost",noLabel); n.type="button"; n.addEventListener("click",()=>{b.hidden=true;});
  r.append(y,n); b.append(r); b.hidden=false; b.scrollIntoView({block:"nearest"}); y.focus();
}
async function finish(){
  stopTimer();
  S.status="done"; S.finished=Date.now(); save(true);
  for(const it of S.items){
    // A finished set with an empty weight inherits the weight of the set before it.
    let prevKg=null;
    it.sets.forEach(s=>{ if(s.kg==null&&prevKg!=null&&"kg" in s) s.kg=prevKg; if(s.kg!=null) prevKg=s.kg; });
    const done=it.sets.filter(s=>s.done);
    if(done.length) store.merge("exercises/"+it.ex,{last:{date:S.finished,w:S.w,session:S.id,rx:it.rx,sets:done.map(({done,...r})=>r)}});
  }
  store.set("state/active",{id:null});
  hooks.markDone&&hooks.markDone(S.key);
  S=null; hide(); toast("Økta er lagret. Bra jobba!");
}
function onFinish(){
  const open=S.items.reduce((a,it)=>a+it.sets.filter(s=>!s.done).length,0);
  if(open) confirmBox(`${open} sett er ikke krysset av. De lagres ikke. Vil du fullføre likevel?`,finish,"Fullfør økta","Fortsett økta");
  else finish();
}
function onCancel(){
  confirmBox("Vil du slette denne økta? Alt du har logget i økta forsvinner. Notatene dine blir liggende.",async()=>{
    stopTimer(); store.del("sessions/"+S.id); store.set("state/active",{id:null}); S=null; hide(); toast("Økta er slettet.");
  },"Slett økta","Fortsett økta");
}

// ---------- rest timer ----------
let tEnd=0,tInt=0,tLabel="",audio=null;
function beep(){
  try{
    audio=audio||new (window.AudioContext||window.webkitAudioContext)();
    [0,.25,.5].forEach(d=>{const o=audio.createOscillator(),g=audio.createGain(); o.frequency.value=880; o.connect(g); g.connect(audio.destination);
      g.gain.setValueAtTime(.0001,audio.currentTime+d); g.gain.exponentialRampToValueAtTime(.3,audio.currentTime+d+.02); g.gain.exponentialRampToValueAtTime(.0001,audio.currentTime+d+.18);
      o.start(audio.currentTime+d); o.stop(audio.currentTime+d+.2);});
  }catch(e){}
  try{navigator.vibrate&&navigator.vibrate([200,100,200]);}catch(e){}
}
function startTimer(sec,label){
  try{audio=audio||new (window.AudioContext||window.webkitAudioContext)(); if(audio.state==="suspended") audio.resume();}catch(e){}
  tEnd=Date.now()+sec*1000; tLabel=label;
  $("timer").hidden=false; $("timer").classList.remove("over");
  clearInterval(tInt); tInt=setInterval(tickTimer,250); tickTimer();
}
function tickTimer(){
  const left=Math.round((tEnd-Date.now())/1000);
  if(left<=0){
    clearInterval(tInt); $("timer-t").textContent="0:00"; $("timer-l").textContent="Pausen er over. Neste sett!";
    $("timer").classList.add("over"); beep(); setTimeout(()=>{ if(Date.now()>=tEnd) stopTimer(); },8000); return;
  }
  $("timer-t").textContent=`${Math.floor(left/60)}:${String(left%60).padStart(2,"0")}`;
  $("timer-l").textContent=`Pause · ${tLabel}`;
}
function stopTimer(){clearInterval(tInt); $("timer").hidden=true;}
function adjustTimer(d){ if($("timer").hidden) return; tEnd=Math.max(Date.now()+1000,tEnd+d*1000); $("timer").classList.remove("over"); clearInterval(tInt); tInt=setInterval(tickTimer,250); tickTimer(); }

// ---------- misc ----------
async function keepAwake(){
  try{ if("wakeLock" in navigator){ wake=await navigator.wakeLock.request("screen"); } }catch(e){}
}
function releaseAwake(){ try{wake&&wake.release(); wake=null;}catch(e){} }
document.addEventListener("visibilitychange",()=>{ if(document.visibilityState==="visible"&&S&&!$("okt").hidden) keepAwake(); if(document.visibilityState==="visible"&&!$("timer").hidden) tickTimer(); });

let toastT=0;
export function toast(msg){ const t=$("toast"); t.textContent=msg; t.hidden=false; clearTimeout(toastT); toastT=setTimeout(()=>{t.hidden=true;},4000); }

export function initSession(h){
  hooks=h||{};
  $("okt-finish").addEventListener("click",onFinish);
  $("okt-cancel").addEventListener("click",onCancel);
  $("okt-back").addEventListener("click",()=>{ save(true); hide(); });
  $("timer-minus").addEventListener("click",()=>adjustTimer(-15));
  $("timer-plus").addEventListener("click",()=>adjustTimer(15));
  $("timer-stop").addEventListener("click",stopTimer);
  document.addEventListener("keydown",e=>{ if(e.key==="Escape"&&!$("okt").hidden&&!document.querySelector("dialog[open]")){ save(true); hide(); } });
}
export const isOpen=()=>!$("okt").hidden;
