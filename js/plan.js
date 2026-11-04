// Ukeplan: faser, løpeøkter, styrkeøkter og resept (sett, reps, RIR) per øvelse.
import {EX} from "./exercises.js";

export const START=new Date(2026,10,2); // mandag 2. nov 2026 (uke 0)
export const RACE=new Date(2027,9,17);
export const LIGHT=new Set([4,8,12,16,20,24,28,32,36,40,44]);
export const PHASES=[
  {n:1,name:"Gjenoppstart",from:0,to:8,desc:"Alt rolig, målt i minutter. Mål: 40–60 min sammenhengende uten å bli støl dagen etter."},
  {n:2,name:"Grunnlag",from:9,to:24,desc:"Tre turer i uka. Langturen øker fra 8 til 14 km. Stigningsløp fra februar, fartlek fra mars."},
  {n:3,name:"Bygging",from:25,to:40,desc:"Én kvalitetsøkt i uka. Langtur opp mot 18 km. Styrke ned til to økter."},
  {n:4,name:"Spesifikk forberedelse",from:41,to:47,desc:"Bli komfortabel i 5:40-tempo. Lengste tur 20 km og generalprøve."},
  {n:5,name:"Nedtrapping",from:48,to:49,desc:"Mindre volum, litt fart. Ingen tunge løft."}
];
// [tirsdag, torsdag (løp), fredag, lørdag]. "K|" = kvalitetsøkt.
const RUN={
  0:["30 min rolig","","","20–25 min rolig hvis stølheten er borte. Ellers 30–45 min gåtur."],
  1:["25 min rolig. Gå-pauser er greit.","","","30 min rolig"],
  2:["30 min rolig","","","35 min rolig"],
  3:["30 min rolig","","","40 min rolig"],
  4:["25 min rolig","","","30 min rolig"],
  5:["30 min rolig","","25 min rolig","45 min rolig"],
  6:["35 min rolig","","25 min rolig","50 min rolig"],
  7:["35 min rolig","","30 min rolig","55–60 min rolig"],
  8:["30 min rolig","","25 min rolig","40 min rolig"],
  9:["5 km rolig","","4 km rolig","8 km rolig"],
  10:["5 km rolig","","4 km rolig","9 km rolig"],
  11:["6 km rolig","","4 km rolig","10 km rolig"],
  12:["5 km rolig","","3 km rolig","7 km rolig"],
  13:["6 km rolig + 4 stigningsløp à 15–20 sek","","5 km rolig","10 km rolig"],
  14:["6 km rolig + 5 stigningsløp","","5 km rolig","11 km rolig"],
  15:["6 km rolig + 6 stigningsløp","","5 km rolig","12 km rolig"],
  16:["5 km rolig + 4 stigningsløp","","4 km rolig","8 km rolig"],
  17:["K|Fartlek: 6 × 2 min litt raskt, 2 min rolig mellom (ca. 7 km)","","5 km rolig","12 km rolig"],
  18:["K|Fartlek: 7 × 2 min litt raskt, 2 min rolig mellom","","6 km rolig","13 km rolig"],
  19:["K|Fartlek: 8 × 2 min litt raskt, 2 min rolig mellom","","6 km rolig","13 km rolig"],
  20:["6 km rolig + 4 stigningsløp","","4 km rolig","10 km rolig"],
  21:["K|Fartlek: 5 × 3 min litt raskt, 2 min rolig mellom","","6 km rolig","14 km rolig"],
  22:["K|Fartlek: 6 × 3 min litt raskt, 2 min rolig mellom","","6 km rolig","14 km rolig"],
  23:["K|Fartlek: 4 × 4 min litt raskt, 2 min rolig mellom","","6 km rolig","14 km rolig"],
  24:["6 km rolig + 4 stigningsløp","","4 km rolig","10 km lett. Milepæl: 10 km i komfortabelt tempo."],
  25:["K|Terskel: 2 × 10 min komfortabelt hardt, 2 min pause","","6 km rolig","14 km rolig"],
  26:["K|Intervaller: 4 × 1 km i 5:20–5:30, 2 min pause","","6 km rolig","15 km rolig"],
  27:["K|Terskel: 3 × 8 min, 2 min pause","","7 km rolig","15 km rolig"],
  28:["7 km rolig + 4 stigningsløp","","5 km rolig","11 km rolig"],
  29:["K|Intervaller: 5 × 1 km i 5:20–5:30, 2 min pause","5 km rolig","6 km rolig","16 km rolig"],
  30:["K|Terskel: 3 × 10 min, 2 min pause","5 km rolig","6 km rolig","16 km rolig"],
  31:["K|Intervaller: 6 × 1 km i 5:20–5:30, 2 min pause","5 km rolig","7 km rolig","16 km rolig"],
  32:["7 km rolig + 4 stigningsløp","","5 km rolig","12 km rolig"],
  33:["K|Terskel: 2 × 15 min, 3 min pause","6 km rolig","7 km rolig","16 km rolig"],
  34:["K|Intervaller: 6 × 1 km i 5:20–5:30, 2 min pause","6 km rolig","7 km rolig","17 km rolig"],
  35:["K|Terskel: 3 × 10 min, 2 min pause","6 km rolig","7 km rolig","17 km rolig"],
  36:["8 km rolig + 4 stigningsløp","","5 km rolig","12 km rolig"],
  37:["K|Intervaller: 4 × 1,5 km i 5:25–5:30, 2 min pause","6 km rolig","7 km rolig","17 km rolig"],
  38:["K|Terskel: 3 × 12 min, 2 min pause","6 km rolig","7 km rolig","18 km rolig"],
  39:["K|Intervaller: 6 × 1 km i 5:20–5:30, 2 min pause","6 km rolig","7 km rolig","18 km rolig"],
  40:["8 km rolig + 4 stigningsløp","","5 km rolig","13 km rolig"],
  41:["K|Løpstempo: 2 × 3 km i 5:35–5:40, 3 min rolig jogg mellom","6 km rolig","7 km rolig","18 km, de siste 4 km i løpstempo"],
  42:["K|Løpstempo: 3 × 3 km i 5:35–5:40, 3 min rolig jogg mellom","6 km rolig","7 km rolig","19 km rolig"],
  43:["K|Terskel: 3 × 10 min, 2 min pause","6 km rolig","7 km rolig","20 km rolig. Lengste tur før løpet."],
  44:["8 km rolig + 4 stigningsløp","","5 km rolig","14 km rolig"],
  45:["K|Løpstempo: 3 × 3 km i 5:35–5:40","6 km rolig","6 km rolig","Generalprøve: 16 km, de siste 8 km i løpstempo"],
  46:["K|Løpstempo: 2 × 3 km i 5:35–5:40","6 km rolig","7 km rolig","19 km, de siste 5 km i løpstempo"],
  47:["K|Løpstempo: 3 × 2 km i 5:35–5:40","6 km rolig","7 km rolig","16 km rolig"],
  48:["K|Løpstempo: 2 × 2 km, ellers rolig (ca. 7 km)","5 km rolig","5 km rolig","12 km rolig"],
  49:["K|6 km med 3 × 1 km i løpstempo","4 km rolig + 3 stigningsløp","","Shakeout: 3 km veldig rolig + 3 stigningsløp"]
};

export function phaseOf(w){return PHASES.find(p=>w>=p.from&&w<=p.to).n}

function gym(w){
  const p=phaseOf(w), light=LIGHT.has(w), out=[];
  const lt=light?" Lett uke: ett sett mindre per øvelse.":"";
  if(w===0){
    out.push({d:"ons",k:"gym",title:"Overkropp og kjerne",info:"Beina er støle, så ta overkroppen i dag. 3 sett per øvelse, RIR 3.",wu:"wu-over"});
    out.push({d:"tor",k:"walk",title:"Gåtur",info:"30 min rask gange. Hjelper mot stølheten.",wu:"wu-rolig"});
    out.push({d:"fre",k:"gym",title:"Bein, lett",info:"Bare hvis stølheten er nesten borte: 2 sett knebøy, bulgarske utfall og tåhev, RIR 3–4. Ellers mobilitet og kjerne.",wu:"wu-bein"});
  } else if(p===1){
    out.push({d:"man",k:"gym",title:"Bein (redusert)",info:"3 sett knebøy, ett sett mindre på de andre beinøvelsene, RIR 3."+lt,wu:"wu-bein"});
    out.push({d:"ons",k:"gym",title:"Overkropp og kjerne",info:"Fullt program."+lt,wu:"wu-over"});
    out.push({d:"tor",k:"gym",title:"Helkropp lett",info:"2 sett per øvelse."+lt,wu:"wu-bein"});
  } else if(p===2){
    out.push({d:"man",k:"gym",title:"Bein",info:(w>=17?"Start med hopp, deretter fullt program.":"Fullt program.")+lt,wu:"wu-bein"});
    out.push({d:"ons",k:"gym",title:"Overkropp og kjerne",info:"Fullt program."+lt,wu:"wu-over"});
    out.push({d:"tor",k:"gym",title:"Helkropp lett",info:"Fullt program, moderat vekt."+lt,wu:"wu-bein"});
  } else if(p===3){
    out.push({d:"man",k:"gym",title:"Bein",info:"3 sett på alle øvelser. Behold hopp."+lt,wu:"wu-bein"});
    out.push({d:"ons",k:"gym",title:"Overkropp + lette bein",info:"Overkropp som vanlig, pluss step-ups, tåhev og Copenhagen-planke."+lt,wu:"wu-over"});
  } else if(p===4){
    out.push({d:"man",k:"gym",title:"Bein, vedlikehold",info:"Samme vekter, færre sett, RIR 3."+lt,wu:"wu-bein"});
    out.push({d:"ons",k:"gym",title:"Overkropp + lette bein",info:"Færre sett, RIR 3."+lt,wu:"wu-over"});
  } else if(w===48){
    out.push({d:"man",k:"gym",title:"Bein, lett",info:"2 sett per øvelse, RIR 3–4. Siste beinøkt med vekt.",wu:"wu-bein"});
    out.push({d:"ons",k:"gym",title:"Mobilitet og kjerne",info:"Lett kjerne, band pull-aparts og noen sett tåhev med kroppsvekt.",wu:"wu-over"});
  } else {
    out.push({d:"man",k:"gym",title:"Mobilitet og kjerne",info:"Lette sett tåhev og utfall med kroppsvekt. Ingen tunge løft.",wu:"wu-bein"});
  }
  return out;
}

export const MON=["squat","rdl","bulg","hipthrust","calf","calfsit","cph"];
export const WED=["bench","pullup","row","ohp","facepull","pullapart","pallof","deadbug"];
export const THU=["deadlift","stepup","dbrow","pushup","slrdl","sideplank","farmer"];
function exFor(w,s){
  if(s.k!=="gym") return [];
  const p=phaseOf(w);
  if(w===0) return s.d==="ons"?WED:s.d==="fre"?["squat","bulg","calf"]:[];
  if(w===48) return s.d==="man"?MON:["deadbug","pullapart","calf"];
  if(w===49) return ["calf","bulg","deadbug"];
  if(s.d==="man") return ((p===2&&w>=17)||p===3?["boxjump","hop"]:[]).concat(MON);
  if(s.d==="ons") return p>=3?WED.concat(["stepup","calf","cph"]):WED;
  if(s.d==="tor") return THU;
  return [];
}

/** Sets, reps and RIR for one exercise on one day. */
export function prescribe(w,day,id){
  const b=EX[id].rx, p=phaseOf(w);
  let sets=b.sets, rir=b.rir;
  if(w===0){ if(day==="ons"){sets=3; if(rir) rir="3";} else {sets=2; if(rir) rir="3–4";} }
  else if(w===48){ sets=2; if(rir) rir="3–4"; }
  else if(w===49){ sets=2; if(rir) rir="4"; }
  else if(p===1){
    if(day==="man"){ sets=id==="squat"?3:Math.max(2,sets-1); if(rir) rir="3"; }
    if(day==="tor") sets=2;
  }
  else if(p===3){
    if(day==="man") sets=Math.min(sets,3);
    if(day==="ons"&&["stepup","calf","cph"].includes(id)) sets=2;
  }
  else if(p===4){ sets=["squat","bench","pullup","row"].includes(id)?3:2; if(rir) rir="3"; }
  if(LIGHT.has(w)) sets=Math.max(2,sets-1);
  return {sets,reps:b.reps,rir,per:b.per||""};
}

function runSession(d,txt,isLong){
  if(!txt) return null;
  const q=txt.startsWith("K|"); const t=q?txt.slice(2):txt;
  return {d,k:isLong?"long":(q?"q":"run"),title:isLong?"Langtur":(q?"Kvalitetsøkt":"Rolig tur"),info:t,wu:q?"wu-kval":"wu-rolig"};
}

export const ORDER={man:0,tir:1,ons:2,tor:3,fre:4,"lør":5,"søn":6};
export const DAYNAME={man:"Man",tir:"Tir",ons:"Ons",tor:"Tor",fre:"Fre","lør":"Lør","søn":"Søn"};
export const DAYFULL={man:"Mandag",tir:"Tirsdag",ons:"Onsdag",tor:"Torsdag",fre:"Fredag","lør":"Lørdag","søn":"Søndag"};
export const MONTHS=["jan","feb","mar","apr","mai","jun","jul","aug","sep","okt","nov","des"];

export const weeks=[];
for(let w=0;w<=49;w++){
  const r=RUN[w]; const s=[...gym(w)];
  [runSession("tir",r[0]),runSession("tor",r[1]),runSession("fre",r[2]),runSession("lør",r[3],w!==49&&w!==0)].forEach(x=>x&&s.push(x));
  if(w===49){
    const sat=s.find(x=>x.d==="lør"); if(sat){sat.k="run";sat.title="Rolig tur";}
    s.push({d:"søn",k:"race",title:"Amsterdam halvmaraton",info:"Start rolig: første 5 km i ca. 5:45, deretter 5:40. Øk bare hvis du føler deg sterk etter 15 km.",wu:"wu-kval"});
  }
  s.sort((a,b)=>ORDER[a.d]-ORDER[b.d]);
  s.forEach(x=>{x.key="w"+w+"-"+x.d+"-"+x.k; x.ex=exFor(w,x); x.w=w;});
  const mon=new Date(START); mon.setDate(START.getDate()+w*7);
  const sun=new Date(mon); sun.setDate(mon.getDate()+6);
  weeks.push({w,sessions:s,mon,sun,light:LIGHT.has(w)});
}
export const TOTAL=weeks.reduce((a,x)=>a+x.sessions.length,0);

export function dateOf(w,d){const x=new Date(weeks[w].mon); x.setDate(x.getDate()+ORDER[d]); return x;}
export function sameDay(a,b){return a.getFullYear()===b.getFullYear()&&a.getMonth()===b.getMonth()&&a.getDate()===b.getDate();}
export function fmtRange(a,b){
  return a.getMonth()===b.getMonth()?`${a.getDate()}.–${b.getDate()}. ${MONTHS[b.getMonth()]}`:`${a.getDate()}. ${MONTHS[a.getMonth()]} – ${b.getDate()}. ${MONTHS[b.getMonth()]}`;
}
export function fmtDate(d){d=new Date(d); return `${d.getDate()}. ${MONTHS[d.getMonth()]}`;}
export function currentWeek(today){
  let cw=0;
  weeks.forEach(x=>{const end=new Date(x.sun); end.setHours(23,59,59,999); if(today>=x.mon&&today<=end) cw=x.w;});
  if(today>weeks[weeks.length-1].sun) cw=49;
  return cw;
}
