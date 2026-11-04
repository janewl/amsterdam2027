// Øvelsesbibliotek: figurer, teknikk, loggtype og grunnresept.
const L={torso:52,neck:17,head:9,thigh:44,shin:42,foot:14,up:30,fore:28}, G=190;
const STAND={nl:[0,0,90],fl:[0,0,90]};
const EX={
  squat:{n:"Knebøy",t:"Knebøy (eller beinpress)",sub:"Stang på øvre del av ryggen. Beinpress: samme tips for føtter og knær.",root:"nAnk",
    A:{r:[118,186],t:5,nl:[0,0,90],fl:[0,0,90],na:[-30,160],fa:[-30,160]},
    B:{r:[118,186],t:40,nl:[78,-28,90],fl:[78,-28,90],na:[10,200],fa:[10,200]},
    props:[{k:"plate",at:"sh",dx:-4,dy:-6}],focus:["nHeel","nKnee"],cap:"Oransje: hælene og knærne.",
    steps:["Stangen ligger på øvre del av ryggen, ikke på nakken. Føttene i skulderbredde, tærne litt utover.","Pust inn, stram magen og sett deg ned mellom hælene.","Gå ned til lårene er minst parallelle med gulvet, eller så dypt du klarer med nøytral rygg.","Press opp igjen og pust ut på vei opp."],
    cues:["Legg press gjennom hælene og midtfoten når du presser vekten opp.","Skyv knærne ut i samme retning som tærne.","Hold brystet oppe og blikket et par meter foran deg på gulvet.","Stram magen før hver rep, som om noen skal dytte deg i magen."],
    err:["Knærne faller innover.","Hælene løfter seg fra gulvet.","Hoftene skyter opp før skuldrene på vei opp."]},
  rdl:{n:"Rumensk markløft",t:"Rumensk markløft",sub:"Stang eller manualer. Treffer baksiden av lår og setet.",root:"nAnk",
    A:{r:[118,186],t:0,...STAND,na:[0,0],fa:[0,0]},
    B:{r:[118,186],t:65,nl:[35,-8,90],fl:[35,-8,90],na:[-15,-15],fa:[-15,-15]},
    props:[{k:"plate",at:"nHand",dx:3,dy:4}],focus:["hip"],cap:"Oransje: hoftene skyves bakover.",
    steps:["Stå med stangen i hendene, føttene i hoftebredde.","Lås knærne i en myk bøy.","Skyv hoftene bakover og la stangen gli ned langs lårene til du kjenner strekk bak på lårene, omtrent midt på leggen.","Skyv hoftene fram for å reise deg."],
    cues:["Tenk at du skal lukke en bildør med rumpa.","Hold stangen helt inntil beina hele veien.","Skuldrene ned og bak, som om du klemmer en appelsin i hver armhule.","Ryggen holder samme form hele veien, og nakken følger ryggen."],
    err:["Runder ryggen for å komme lenger ned.","Bøyer knærne for mye, så det blir en knebøy.","Stangen glir bort fra beina."]},
  bulg:{n:"Bulgarske utfall",t:"Bulgarske utfall",sub:"Bakre fot på en benk. Manualer i hendene.",root:"nAnk",
    A:{r:[150,186],t:8,nl:[8,-4,90],fl:[-22,-115,-80],na:[0,0],fa:[0,0]},
    B:{r:[150,186],t:16,nl:[72,-16,90],fl:[-2,-100,-80],na:[0,0],fa:[0,0]},
    props:[{k:"rect",x:20,y:116,w:62,h:10},{k:"rect",x:28,y:126,w:8,h:64},{k:"rect",x:66,y:126,w:8,h:64},{k:"db",at:"nHand"}],focus:["nHeel","nKnee"],cap:"Oransje: fremre hæl og kne.",
    steps:["Stå med ryggen mot en benk og legg vristen på benken bak deg.","Sett fremre fot så langt fram at du kan bøye kneet uten at hælen løfter seg.","Senk deg rett ned til bakre kne nesten treffer gulvet.","Press deg opp gjennom fremre fot."],
    cues:["Press gjennom hele fremre fot, med vekten på hælen.","Hold fremre kne i linje med andre og tredje tå.","Len overkroppen litt fram for mer sete, eller hold den rett for mer forside lår.","Bakre bein er bare støtte. Nesten all vekten skal være på fremre bein."],
    err:["Fremre kne faller innover.","Fremre hæl løfter seg.","For kort avstand til benken."]},
  hipthrust:{n:"Hip thrust",t:"Hip thrust",sub:"Øvre del av ryggen mot en benk, stang over hoftene med pute.",root:"nAnk",
    A:{r:[172,186],t:-60,nl:[130,10,90],fl:[130,10,90],na:[50,70],fa:[50,70]},
    B:{r:[172,186],t:-90,nl:[90,0,90],fl:[90,0,90],na:[80,100],fa:[80,100]},
    props:[{k:"rect",x:30,y:150,w:52,h:10},{k:"rect",x:38,y:160,w:8,h:30},{k:"rect",x:66,y:160,w:8,h:30},{k:"plate",at:"hip",dx:0,dy:-14}],focus:["hip","nHeel"],cap:"Oransje: hoftene og hælene.",
    steps:["Sitt med nedre kant av skulderbladene mot en benk og stangen over hoftene.","Sett føttene i hoftebredde, så leggene er loddrette i toppen.","Press hoftene opp til kroppen og lårene er i en rett linje.","Hold et sekund i toppen og senk kontrollert."],
    cues:["Press gjennom hælene.","Hak inn haka og se framover, ikke i taket.","Klem setet hardt i toppen.","Hold ribbeina nede. Ikke svai i korsryggen for å komme høyere."],
    err:["Svai i korsryggen i toppen.","Føttene for langt fram (kjennes bak på lårene) eller for nær (kjennes foran)."]},
  calf:{n:"Tåhev, strake knær",t:"Tåhev, strake knær",sub:"På kanten av en trapp eller et step. Ett bein når to blir lett.",root:"nToe",
    A:{r:[150,170],t:0,nl:[0,0,115],fl:[0,0,115],na:[0,0],fa:[0,0]},
    B:{r:[150,170],t:0,nl:[0,0,40],fl:[0,0,40],na:[0,0],fa:[0,0]},
    props:[{k:"rect",x:142,y:172,w:70,h:18}],focus:["nToe","nHeel"],cap:"Oransje: stortåa og hælen.",
    steps:["Stå med fotballene på kanten av en trapp eller et step. Hold deg i noe for balanse.","Senk hælene rolig under kanten på 2–3 sekunder.","Press deg helt opp på tærne og hold i ett sekund.","Gjør ett bein om gangen når to bein blir lett."],
    cues:["Press gjennom stortåa og andre tå. Ikke rull ut mot lilletåa.","Knærne strake, men ikke låst bakover.","Rolig ned, raskt opp.","Ta hele bevegelsen, helt ned og helt opp."],
    err:["Spretter i bunnen.","Tar bare halve bevegelsen."]},
  calfsit:{n:"Tåhev, sittende",t:"Tåhev, bøyde knær (sittende)",sub:"Sitt med vekt på lårene. Fotballene på en skive eller et step.",root:"nToe",
    A:{r:[150,180],t:5,nl:[90,0,105],fl:[90,0,105],na:[45,90],fa:[45,90]},
    B:{r:[150,180],t:5,nl:[90,0,45],fl:[90,0,45],na:[45,90],fa:[45,90]},
    props:[{k:"rect",x:60,y:133,w:66,h:10},{k:"rect",x:70,y:143,w:8,h:47},{k:"rect",x:108,y:143,w:8,h:47},{k:"rect",x:140,y:182,w:40,h:8},{k:"plate",at:"nKnee",dx:-6,dy:-12}],focus:["nToe","nHeel"],cap:"Oransje: stortåa og hælen.",
    steps:["Sitt med knærne i 90 grader og fotballene på en skive eller et step.","Legg vekten på lårene, rett over knærne.","Senk hælene og press deg opp på tærne."],
    cues:["Med bøyde knær trener du den dype leggmuskelen, som tar mest belastning når du løper.","Rolig tempo: 2 sekunder ned og 1 sekund pause i toppen.","Press gjennom stortåa."],
    err:["Hopper over øvelsen.","For tung vekt og kort bevegelse."]},
  cph:{n:"Copenhagen-planke",t:"Copenhagen-planke",sub:"Sideplanke med øverste fot på en benk. Lettere: kneet på benken.",root:"fElb",
    A:{r:[64,186],t:-100,nl:[100,100,10],fl:[100,0,90],na:[150,210],fa:[0,-90]},
    B:{r:[64,186],t:-96,nl:[96,96,10],fl:[96,0,90],na:[150,210],fa:[0,-90]},
    props:[{k:"rect",x:175,y:138,w:60,h:10},{k:"rect",x:185,y:148,w:8,h:42},{k:"rect",x:220,y:148,w:8,h:42}],focus:["hip","nAnk"],cap:"Oransje: hoften og foten på benken.",
    steps:["Ligg på siden med albuen rett under skulderen.","Legg innsiden av øverste fot, eller kneet, på en benk.","Løft hoftene til kroppen er i en rett linje. Det nederste beinet henger fritt.","Hold tiden og bytt side."],
    cues:["Press øverste bein ned i benken. Det er innsiden av låret som jobber.","Kroppen i en rett linje fra hode til fot. Ikke la hofta synke.","Skyv albuen ned i gulvet så skulderen ikke kryper opp mot øret.","Pust rolig gjennom hele holdet."],
    err:["Hofta synker.","Skulderen kryper opp mot øret."]},
  bench:{n:"Benkpress",t:"Benkpress eller manualpress",sub:"Med stang eller manualer. Samme teknikk.",root:"hip",
    A:{r:[128,140],t:-90,nl:[80,-10,90],fl:[80,-10,90],na:[180,180],fa:[180,180]},
    B:{r:[128,140],t:-90,nl:[80,-10,90],fl:[80,-10,90],na:[30,180],fa:[30,180]},
    props:[{k:"rect",x:40,y:146,w:100,h:10},{k:"rect",x:50,y:156,w:8,h:34},{k:"rect",x:122,y:156,w:8,h:34},{k:"plate",at:"nHand",dx:0,dy:0}],focus:["nElb","nAnk"],cap:"Oransje: albuen og føttene.",
    steps:["Ligg med øynene rett under stangen og føttene godt plantet.","Trekk skulderbladene sammen og ned.","Senk stangen kontrollert til nedre del av brystet.","Press opp og litt bakover mot skuldrene."],
    cues:["Press føttene i gulvet og hold rumpa på benken.","Albuene ca. 45 grader ut fra kroppen, ikke 90.","Håndleddene rett over albuene i bunnen.","Hold skulderbladene samlet gjennom hele settet."],
    err:["Stangen spretter på brystet.","Albuene peker rett ut til siden.","Rumpa løfter seg fra benken."]},
  pullup:{n:"Pull-ups",t:"Pull-ups med strikk eller nedtrekk",sub:"Med strikk til du klarer flere reps med egen kroppsvekt.",root:"nHand",
    A:{r:[128,8],t:-4,nl:[8,-75,10],fl:[12,-70,10],na:[180,180],fa:[180,180]},
    B:{r:[128,8],t:-8,nl:[14,-70,10],fl:[18,-65,10],na:[8,172],fa:[8,172]},
    props:[{k:"barfix",x1:70,x2:200,y:8}],focus:["nElb"],cap:"Oransje: albuen drar ned mot lomma.",
    steps:["Heng med hendene litt bredere enn skuldrene.","Trekk skuldrene ned fra ørene før du drar.","Dra deg opp til haka er over stanga.","Senk deg kontrollert helt ned."],
    cues:["Tenk at du drar albuene ned i baklomma.","Stram mage og sete så kroppen ikke svinger.","Nedtrekk: dra stanga til øvre del av brystet og len deg bare litt bakover.","Pust ut på vei opp."],
    err:["Halve repetisjoner.","Sving og rykk for å komme opp."]},
  row:{n:"Sittende roing",t:"Sittende roing med kabel",sub:"Kabel med V-håndtak, føttene mot plattformen.",root:"hip",
    A:{r:[90,166],t:12,nl:[80,60,170],fl:[80,60,170],na:[85,88],fa:[85,88]},
    B:{r:[90,166],t:0,nl:[80,60,170],fl:[80,60,170],na:[-30,75],fa:[-30,75]},
    props:[{k:"rect",x:60,y:170,w:60,h:20},{k:"rect",x:182,y:110,w:12,h:80},{k:"cable",from:[188,128],at:"nHand"}],focus:["nElb"],cap:"Oransje: albuen går rett bakover.",
    steps:["Sitt med føttene mot plattformen og en lett bøy i knærne.","Grip håndtaket med strake armer og rett rygg.","Dra håndtaket inn mot navlen.","Strekk armene kontrollert ut igjen."],
    cues:["Start med å trekke skulderbladene sammen, så albuene.","Albuene tett inntil kroppen.","Overkroppen står nesten stille. Ikke bruk ryggen til å kaste vekten.","Brystet opp mot håndtaket."],
    err:["Lener seg langt bakover.","Skuldrene trekkes opp mot ørene."]},
  ohp:{n:"Skulderpress",t:"Skulderpress med manualer",sub:"Stående eller sittende med manualer.",root:"nAnk",
    A:{r:[118,186],t:0,...STAND,na:[10,180],fa:[10,180]},
    B:{r:[118,186],t:0,...STAND,na:[178,180],fa:[178,180]},
    props:[{k:"db",at:"nHand"}],focus:["hip","nHand"],cap:"Oransje: hånden over albuen og stabile hofter.",
    steps:["Stå med føttene i hoftebredde og manualene i skulderhøyde.","Stram mage og sete.","Press manualene rett opp til armene er strake.","Senk kontrollert til skulderhøyde."],
    cues:["Hold ribbeina nede. Ikke len deg bakover.","Klem setet for å holde korsryggen stabil.","Underarmene loddrette under vekten.","Skyv hodet litt fram når armene passerer ansiktet."],
    err:["Svai i korsryggen.","Albuene peker rett ut til siden og vekten havner bak hodet."]},
  facepull:{n:"Face pulls",t:"Face pulls",sub:"Kabel i ansiktshøyde med tauhåndtak. Lett vekt.",root:"nAnk",
    A:{r:[110,186],t:-4,nl:[10,0,90],fl:[-10,0,90],na:[95,95],fa:[95,95]},
    B:{r:[110,186],t:-2,nl:[10,0,90],fl:[-10,0,90],na:[-100,170,.5],fa:[-100,170,.5]},
    props:[{k:"rect",x:214,y:20,w:12,h:170},{k:"cable",from:[214,50],at:"nHand"}],focus:["nElb"],cap:"Oransje: albuen holdes høyt.",
    steps:["Still kabelen i ansiktshøyde med tauhåndtak.","Grip tauet med tomlene mot deg og ta et skritt bakover.","Dra tauet mot ansiktet og før hendene ut på hver side av hodet.","Hold i ett sekund og slipp kontrollert."],
    cues:["Albuene høyt, i høyde med skuldrene.","Tenk at du viser fram bicepsen på slutten.","Hold nakken avslappet og skuldrene langt fra ørene.","Bruk lett vekt. Øvelsen er for holdning og skuldre."],
    err:["For tung vekt, så du lener deg bakover.","Albuene faller ned."]},
  pullapart:{n:"Band pull-aparts",t:"Band pull-aparts",sub:"Vist forfra. Treningsstrikk i strake armer.",root:"nAnk",front:true,
    A:{r:[132,186],t:0,nl:[8,4,90],fl:[-8,-4,-90],na:[-90,-90,.25,.25],fa:[90,90,.25,.25]},
    B:{r:[132,186],t:0,nl:[8,4,90],fl:[-8,-4,-90],na:[90,90],fa:[-90,-90]},
    props:[{k:"band"}],focus:["sh"],cap:"Forfra. Oransje: skuldrene holdes lave.",
    steps:["Hold strikken i strake armer foran deg i skulderhøyde.","Dra strikken fra hverandre til den treffer brystet.","Slipp kontrollert tilbake."],
    cues:["Bevegelsen kommer fra skulderbladene.","Armene nesten strake.","Skuldrene langt fra ørene. Kjenn at nakken er avslappet.","Gjør dem gjerne mellom sett eller når du har sittet lenge."],
    err:["Trekker skuldrene opp.","Svai i korsryggen."]},
  pallof:{n:"Pallof press",t:"Pallof press",sub:"Vist forfra. Kabelen drar fra siden, og du presser armene rett fram mot deg.",root:"nAnk",front:true,
    A:{r:[132,186],t:0,nl:[10,4,90],fl:[-10,-4,-90],na:[10,-150,1,.6],fa:[-10,150,1,.6]},
    B:{r:[132,186],t:0,nl:[10,4,90],fl:[-10,-4,-90],na:[20,20,.4,.4],fa:[-20,-20,.4,.4]},
    props:[{k:"rect",x:220,y:20,w:12,h:170},{k:"cable",from:[220,88],at:"nHand"}],focus:["hip","sh"],cap:"Forfra. Oransje: hofter og skuldre peker rett fram.",
    steps:["Stå sidelengs til kabelen med håndtaket i begge hender inntil brystet.","Føttene i hoftebredde og en lett bøy i knærne.","Press armene rett fram, hold i 2 sekunder og før dem tilbake.","Bytt side."],
    cues:["Ikke la kabelen vri deg. Det er hele poenget.","Stram mage og sete.","Hofter og skuldre peker rett fram hele tiden.","Pust ut når du presser fram."],
    err:["Overkroppen roterer mot kabelen.","Står for nær, så det blir for lett."]},
  deadbug:{n:"Dead bug",t:"Dead bug",sub:"På ryggen på gulvet.",root:"hip",
    A:{r:[132,182],t:-90,nl:[180,90,180],fl:[180,90,180],na:[180,180],fa:[180,180]},
    B:{r:[132,182],t:-90,nl:[180,90,180],fl:[96,96,180],na:[-96,-96],fa:[180,180]},
    props:[],focus:["hip"],cap:"Oransje: korsryggen presses mot gulvet.",
    steps:["Ligg på ryggen med armene rett opp og knær og hofter i 90 grader.","Press korsryggen lett ned i gulvet.","Strekk motsatt arm og bein sakte ut, uten at korsryggen løfter seg.","Før dem tilbake og bytt side."],
    cues:["Korsryggen holder kontakt med gulvet hele tiden.","Pust ut når du strekker ut.","Sakte er vanskeligere og bedre.","Ta en kortere bevegelse hvis ryggen løfter seg."],
    err:["Svai i korsryggen.","For raskt."]},
  deadlift:{n:"Markløft",t:"Markløft (konvensjonell eller trap bar)",sub:"Stang over midtfoten. Trap bar er skånsom for ryggen.",root:"nAnk",
    A:{r:[118,186],t:60,nl:[65,-18,90],fl:[65,-18,90],na:[0,0],fa:[0,0]},
    B:{r:[118,186],t:0,...STAND,na:[0,0],fa:[0,0]},
    props:[{k:"plate",at:"nHand",dx:0,dy:8,r:20}],focus:["nHeel","hip"],cap:"Oransje: midtfot og hofter.",
    steps:["Stå med stangen over midtfoten og føttene i hoftebredde.","Bøy deg ned og grip stangen rett utenfor beina.","Senk hoftene til leggene treffer stangen, og løft brystet.","Press gulvet bort og reis deg til du står rett."],
    cues:["Press gulvet bort med hele foten, med vekten på midtfot og hæl.","Stram armhulene, som om du klemmer appelsiner.","La stangen gli langs leggene og lårene.","Hofter og skuldre stiger i samme tempo."],
    err:["Runder ryggen.","Rykker i stangen fra gulvet.","Lener seg bakover i toppen."]},
  stepup:{n:"Step-ups",t:"Step-ups på kasse",sub:"Kasse i knehøyde eller litt lavere. Manualer i hendene.",root:"nAnk",
    A:{r:[140,156],t:20,nl:[70,-20,90],fl:[-15,-10,90],na:[0,0],fa:[0,0]},
    B:{r:[140,156],t:0,nl:[0,0,90],fl:[80,0,90],na:[0,0],fa:[0,0]},
    props:[{k:"rect",x:118,y:160,w:80,h:30},{k:"db",at:"nHand"}],focus:["nHeel"],cap:"Oransje: hælen på kassen.",
    steps:["Sett hele foten på kassen.","Press deg opp med beinet på kassen til du står rett.","Senk deg kontrollert ned med samme bein.","Gjør alle reps på ett bein, så bytt."],
    cues:["Press gjennom hælen på foten som står på kassen.","Ikke dytt fra med bakerste fot.","Hold kneet i linje med tærne.","Stå helt rett i toppen før du går ned."],
    err:["Fraspark med bakre fot.","Kneet faller innover."]},
  dbrow:{n:"Enarms manualroing",t:"Enarms manualroing",sub:"Ett kne og samme hånd på benken.",root:"hip",
    A:{r:[90,120],t:80,nl:[45,20,90],fl:[-5,-90,-90],na:[0,0],fa:[0,-20]},
    B:{r:[90,120],t:80,nl:[45,20,90],fl:[-5,-90,-90],na:[-160,0],fa:[0,-20]},
    props:[{k:"rect",x:30,y:166,w:125,h:10},{k:"rect",x:40,y:176,w:8,h:14},{k:"rect",x:138,y:176,w:8,h:14},{k:"db",at:"nHand"}],focus:["nElb"],cap:"Oransje: albuen drar mot hofta.",
    steps:["Legg ett kne og samme hånd på benken.","Hold ryggen rett og parallell med gulvet.","Dra manualen opp mot hofta.","Senk kontrollert til armen er strak."],
    cues:["Dra albuen mot hofta, ikke rett opp.","Hold skuldrene i samme høyde. Ikke vri overkroppen.","Nakken i forlengelse av ryggen.","Pust ut på vei opp."],
    err:["Rykker og vrir for å få opp vekten.","Runder ryggen."]},
  pushup:{n:"Push-ups",t:"Push-ups eller skråbenk med manualer",sub:"Skråbenk: som benkpress med benken på ca. 30 grader.",root:"nToe",
    A:{r:[40,188],t:72,nl:[-72,-72,0],fl:[-72,-72,0],na:[0,0],fa:[0,0]},
    B:{r:[40,188],t:82,nl:[-82,-82,0],fl:[-82,-82,0],na:[-80,0],fa:[-80,0]},
    props:[],focus:["hip"],cap:"Oransje: hoftene i linje med kroppen.",
    steps:["Sett hendene litt bredere enn skuldrene.","Kroppen i en rett linje fra hode til hæl.","Senk brystet til nesten gulvet.","Press opp igjen."],
    cues:["Stram sete og mage så hoftene ikke henger.","Albuene ca. 45 grader ut fra kroppen.","Skru hendene lett ned i gulvet.","Lettere: hendene på en benk."],
    err:["Hoftene henger eller stikker opp.","Halve repetisjoner."]},
  slrdl:{n:"Ettbeins markløft",t:"Ettbeins rumensk markløft",sub:"Manual i motsatt hånd av standbeinet.",root:"nAnk",
    A:{r:[110,186],t:0,nl:[0,0,90],fl:[-6,-6,90],na:[0,0],fa:[0,0]},
    B:{r:[110,186],t:78,nl:[18,-6,90],fl:[-100,-100,-10],na:[0,0],fa:[0,0]},
    props:[{k:"db",at:"nHand"}],focus:["hip"],cap:"Oransje: hofta peker ned i gulvet.",
    steps:["Stå på ett bein med en manual i motsatt hånd.","Bøy fram fra hofta mens bakre bein strekker seg bakover.","Gå ned til overkroppen er nesten vannrett, eller til du kjenner strekk bak på låret.","Reis deg ved å skyve hofta fram."],
    cues:["Hoftene peker rett ned i gulvet. Ikke åpne hofta mot taket.","Lett bøy i standkneet.","Overkroppen og bakre bein beveger seg som en vippe.","Hold deg i noe med den ledige hånda hvis balansen svikter."],
    err:["Hofta roterer opp mot taket.","Runder ryggen."]},
  sideplank:{n:"Sidebro",t:"Sidebro",sub:"På underarmen. Lettere: knærne i gulvet.",root:"nAnk",
    A:{r:[212,184],t:-80,nl:[80,80,90],fl:[80,80,90],na:[95,80],fa:[0,-90]},
    B:{r:[212,184],t:-80,nl:[80,80,90],fl:[80,80,90],na:[180,180],fa:[0,-90]},
    props:[],focus:["hip"],cap:"Oransje: hofta holdes oppe.",
    steps:["Ligg på siden med albuen rett under skulderen.","Legg føttene oppå hverandre eller etter hverandre.","Løft hoftene til kroppen er rett.","Hold tiden og bytt side."],
    cues:["Press underarmen ned i gulvet.","Skyv hoftene litt fram, ikke bakover.","Rett linje fra hode til føtter.","Pust rolig."],
    err:["Hofta synker.","Skulderen kryper opp mot øret."]},
  farmer:{n:"Farmer's walk",t:"Farmer's walk",sub:"Tunge manualer eller kettlebells, 30–40 meter.",root:"hip",
    A:{r:[120,102],t:0,nl:[20,10,90],fl:[-15,-25,90],na:[0,0],fa:[0,0]},
    B:{r:[120,102],t:0,nl:[-15,-25,90],fl:[20,10,90],na:[0,0],fa:[0,0]},
    props:[{k:"db",at:"nHand"}],focus:["sh"],cap:"Oransje: skuldrene ned og bak.",
    steps:["Løft tunge manualer eller kettlebells som i et markløft.","Gå med korte, raske steg.","Gå 30–40 meter og sett ned kontrollert."],
    cues:["Høy og rank: tenk at noen drar deg opp etter håret.","Skuldrene ned og bak.","Stramt grep og stram mage.","Pust rolig. Ikke hold pusten."],
    err:["Lener seg til siden.","Skuldrene henger fram."]},
  boxjump:{n:"Bokshopp",t:"Bokshopp",sub:"Lav kasse holder. Høyden er ikke poenget.",root:"nAnk",
    A:{r:[70,186],t:35,nl:[50,-20,90],fl:[50,-20,90],na:[-60,-50],fa:[-60,-50]},
    B:{r:[160,146],t:30,nl:[60,-20,90],fl:[60,-20,90],na:[70,80],fa:[70,80]},
    props:[{k:"rect",x:128,y:150,w:80,h:40}],focus:["nKnee"],cap:"Oransje: kneet i linje med tærne ved landing.",
    steps:["Stå en halv meter fra kassen.","Sving armene bakover og bøy i knær og hofte.","Hopp eksplosivt opp og land mykt på hele foten.","Gå ned fra kassen. Ikke hopp ned."],
    cues:["Land stille og mykt i en halv knebøy.","Knærne i linje med tærne ved landing.","Ta full hvile mellom hoppene. Kvalitet foran mengde.","Bruk armene aktivt i satsen."],
    err:["For høy kasse.","Hopper ned, som belaster akillessenen unødig."]},
  hop:{n:"Hopp på ett bein",t:"Hopp på ett bein",sub:"Små, kontrollerte hopp.",root:"nAnk",
    A:{r:[100,186],t:15,nl:[40,-20,90],fl:[60,-60,30],na:[-40,-30],fa:[-40,-30]},
    B:{r:[128,160],t:5,nl:[0,10,40],fl:[60,-60,30],na:[60,90],fa:[60,90]},
    props:[],focus:["nKnee"],cap:"Oransje: kneet over tærne.",
    steps:["Stå på ett bein.","Bøy lett i kneet og hopp opp eller framover.","Land mykt på samme bein og hold balansen i 2 sekunder.","Gjør alle hoppene, så bytt bein."],
    cues:["Land på fotballen og rull ned på hele foten.","Kneet over tærne, ikke innover.","Hold hofta i vater.","Start med små hopp."],
    err:["Kneet faller innover ved landing.","Hard og bråkete landing."]}
};

const D=Math.PI/180;
const step=(p,l,a)=>[p[0]+Math.sin(a*D)*l,p[1]+Math.cos(a*D)*l];
function fk(p,root){
  const P={hip:[0,0]};
  P.sh=[Math.sin(p.t*D)*L.torso,-Math.cos(p.t*D)*L.torso];
  P.head=[P.sh[0]+Math.sin(p.t*D)*L.neck,P.sh[1]-Math.cos(p.t*D)*L.neck];
  [["n",p.nl,p.na],["f",p.fl,p.fa]].forEach(([s,lg,ar])=>{
    P[s+"Knee"]=step(P.hip,L.thigh,lg[0]); P[s+"Ank"]=step(P[s+"Knee"],L.shin,lg[1]);
    P[s+"Toe"]=step(P[s+"Ank"],L.foot,lg[2]); P[s+"Heel"]=step(P[s+"Ank"],4,lg[2]+180);
    P[s+"Elb"]=step(P.sh,L.up*(ar[2]||1),ar[0]); P[s+"Hand"]=step(P[s+"Elb"],L.fore*(ar[3]||1),ar[1]);
  });
  const o=P[root]; const dx=p.r[0]-o[0], dy=p.r[1]-o[1];
  for(const k in P) P[k]=[P[k][0]+dx,P[k][1]+dy];
  return P;
}
const lerp=(a,b,u)=>a+(b-a)*u;
function mix(A,B,u){
  const o={r:[lerp(A.r[0],B.r[0],u),lerp(A.r[1],B.r[1],u)],t:lerp(A.t,B.t,u)};
  const nz=(a,arm)=>arm?[a[0],a[1],a[2]??1,a[3]??1]:a;
  ["nl","fl","na","fa"].forEach(k=>{const arm=k[1]==="a", a=nz(A[k],arm), b=nz(B[k],arm); o[k]=a.map((v,i)=>lerp(v,b[i],u));});
  return o;
}
const f1=n=>Math.round(n*10)/10;
const path=(pts)=>"M"+pts.map(p=>f1(p[0])+" "+f1(p[1])).join("L");
function draw(ex,pose,P){
  const out=[`<line class="gnd" x1="0" y1="${G}" x2="240" y2="${G}" stroke-width="2"/>`];
  const PA=fk(ex.A,ex.root);
  ex.props.forEach(pr=>{
    if(pr.k==="rect") out.push(`<rect class="prop" x="${pr.x}" y="${pr.y}" width="${pr.w}" height="${pr.h}" rx="2" stroke-width="1.5"/>`);
    if(pr.k==="barfix") out.push(`<line class="gnd" x1="${pr.x1}" y1="${pr.y}" x2="${pr.x2}" y2="${pr.y}" stroke-width="4" stroke-linecap="round"/>`);
  });
  const limbs=s=>[path([P.hip,P[s+"Knee"],P[s+"Ank"],P[s+"Toe"]]),path([P.sh,P[s+"Elb"],P[s+"Hand"]])];
  const seg=(d,c)=>`<path d="${d}" class="${c}" fill="none" stroke-width="7" stroke-linecap="round" stroke-linejoin="round"/>`;
  limbs("f").forEach(d=>out.push(seg(d,"lim-f")));
  out.push(seg(path([P.hip,P.sh]),"lim-n").replace('stroke-width="7"','stroke-width="9"'));
  out.push(`<circle class="hd" cx="${f1(P.head[0])}" cy="${f1(P.head[1])}" r="${L.head}"/>`);
  limbs("n").forEach(d=>out.push(seg(d,"lim-n")));
  ex.props.forEach(pr=>{
    const at=pr.at&&P[pr.at];
    if(pr.k==="plate") out.push(`<circle class="plate" cx="${f1(at[0]+(pr.dx||0))}" cy="${f1(at[1]+(pr.dy||0))}" r="${pr.r||18}" stroke-width="2"/><circle class="hd" cx="${f1(at[0]+(pr.dx||0))}" cy="${f1(at[1]+(pr.dy||0))}" r="3"/>`);
    if(pr.k==="db") out.push(`<rect class="plate" x="${f1(at[0]-9)}" y="${f1(at[1]-4)}" width="18" height="8" rx="3" stroke-width="2"/>`);
    if(pr.k==="cable") out.push(`<line class="wire" x1="${pr.from[0]}" y1="${pr.from[1]}" x2="${f1(at[0])}" y2="${f1(at[1])}" stroke-width="2"/>`);
    if(pr.k==="band") out.push(`<path class="wire" d="M${f1(P.nHand[0])} ${f1(P.nHand[1])}L${f1(P.fHand[0])} ${f1(P.fHand[1])}" stroke-width="3" fill="none"/>`);
  });
  (ex.focus||[]).forEach(k=>{const q=P[k]; if(q) out.push(`<circle class="foc" cx="${f1(q[0])}" cy="${f1(q[1])}" r="8" stroke-width="2.5"/>`);});
  return out.join("");
}
function frame(ex,u){const p=mix(ex.A,ex.B,u); return draw(ex,p,fk(p,ex.root));}


/* Logging type and base prescription per exercise.
   type: kg (stang/kabel/maskin), db (kg per hånd), bw (kroppsvekt), band (strikk), time (sek), dist (kg per hånd + meter), reps (bare reps).
   step: suggested increase. rest: pause in seconds. rx.reps: [lo, hi] (sekunder for time, meter for dist). */
const META={
  squat:{log:{type:"kg",step:2.5,rest:150},rx:{sets:4,reps:[5,6],rir:"2"}},
  rdl:{log:{type:"kg",step:2.5,rest:120},rx:{sets:3,reps:[8,8],rir:"2"}},
  bulg:{log:{type:"db",step:1,rest:90},rx:{sets:3,reps:[8,8],rir:"2",per:"per bein"}},
  hipthrust:{log:{type:"kg",step:5,rest:120},rx:{sets:3,reps:[10,10],rir:"1–2"}},
  calf:{log:{type:"db",step:2,rest:60,kgLabel:"kg ekstra"},rx:{sets:3,reps:[12,12],rir:"1"}},
  calfsit:{log:{type:"kg",step:2.5,rest:60},rx:{sets:3,reps:[15,15],rir:"1"}},
  cph:{log:{type:"time",step:5,rest:60},rx:{sets:3,reps:[20,30],rir:"",per:"per side"}},
  bench:{log:{type:"kg",step:2.5,rest:150},rx:{sets:4,reps:[6,8],rir:"2"}},
  pullup:{log:{type:"band",rest:120},rx:{sets:4,reps:[6,10],rir:"2"}},
  row:{log:{type:"kg",step:2.5,rest:90},rx:{sets:3,reps:[10,12],rir:"2"}},
  ohp:{log:{type:"db",step:1,rest:90},rx:{sets:3,reps:[8,10],rir:"2"}},
  facepull:{log:{type:"kg",step:2.5,rest:60},rx:{sets:3,reps:[15,15],rir:"1"}},
  pullapart:{log:{type:"reps",rest:45},rx:{sets:2,reps:[20,20],rir:""}},
  pallof:{log:{type:"kg",step:2.5,rest:60},rx:{sets:3,reps:[10,10],rir:"",per:"per side"}},
  deadbug:{log:{type:"reps",rest:45},rx:{sets:3,reps:[8,8],rir:"",per:"per side"}},
  deadlift:{log:{type:"kg",step:5,rest:150},rx:{sets:3,reps:[4,5],rir:"3–4"}},
  stepup:{log:{type:"db",step:1,rest:90},rx:{sets:3,reps:[8,8],rir:"3",per:"per bein"}},
  dbrow:{log:{type:"db",step:1,rest:75},rx:{sets:3,reps:[10,10],rir:"2",per:"per side"}},
  pushup:{log:{type:"bw",rest:75},rx:{sets:3,reps:[10,12],rir:"2"}},
  slrdl:{log:{type:"db",step:1,rest:75},rx:{sets:2,reps:[8,8],rir:"3",per:"per bein"}},
  sideplank:{log:{type:"time",step:5,rest:45},rx:{sets:3,reps:[30,30],rir:"",per:"per side"}},
  farmer:{log:{type:"dist",step:2,rest:90},rx:{sets:3,reps:[30,40],rir:""}},
  boxjump:{log:{type:"reps",rest:90,noProgress:true},rx:{sets:3,reps:[5,5],rir:""}},
  hop:{log:{type:"reps",rest:75,noProgress:true},rx:{sets:3,reps:[6,6],rir:"",per:"per bein"}}
};
for(const k in META) Object.assign(EX[k],META[k]);

export const BANDS=["Ekstra tykk","Tykk","Medium","Tynn","Uten strikk"];

EX.pullup.prog={title:"Fremgang med strikk",items:[
  "Velg strikken som lar deg ta 6–10 reps med full bevegelse: helt strake armer i bunnen og haka over stanga i toppen.",
  "Når du klarer 10 reps i alle sett med samme strikk, bytter du til en tynnere strikk neste økt. Det er normalt å klare færre reps de første øktene etter byttet.",
  "Er du mellom to strikker, bruk den tynne i de første settene og den tykke i de siste.",
  "På den tynneste strikken: start hvert sett med 1–3 reps uten strikk, og ta resten av settet med strikk.",
  "Avslutt økta med 2–3 negative reps: trå opp til toppen fra en kasse og senk deg sakte på 3–5 sekunder.",
  "Når du klarer 3 reps uten strikk, tar du de første settene uten strikk og de siste med strikk.",
  "Mål: 3 × 6 med egen kroppsvekt. Deretter kan du legge på vekt i et belte."
]};

export {EX};
export const exName=id=>(EX[id]&&EX[id].n)||id;

// ---------- technique dialog ----------
let dlg,svg,playBtn,phaseEl,cur=null,raf=0,t0=0,frozenU=0;
const reduce=window.matchMedia&&window.matchMedia("(prefers-reduced-motion: reduce)").matches;
let playing=!reduce;
const CYCLE=4400;
function uAt(ms){
  const x=(ms%CYCLE)/CYCLE;
  const ease=v=>v<.5?2*v*v:1-Math.pow(-2*v+2,2)/2;
  if(x<.15) return 0; if(x<.5) return ease((x-.15)/.35); if(x<.65) return 1; return 1-ease((x-.65)/.35);
}
function paint(u){svg.innerHTML=frame(cur,u); phaseEl.textContent=u<.5?"Start":"Slutt";}
function tick(ts){ if(!t0) t0=ts; frozenU=uAt(ts-t0); paint(frozenU); raf=requestAnimationFrame(tick); }
function setPlaying(on){
  playing=on; cancelAnimationFrame(raf); playBtn.textContent=on?"Pause":"Spill av";
  if(on){ t0=0; raf=requestAnimationFrame(tick); }
}
function fill(id,arr){const el=document.getElementById(id); el.textContent=""; arr.forEach(s=>{const li=document.createElement("li"); li.textContent=s; el.append(li);});}
export function openExercise(id){
  const ex=EX[id]; if(!ex) return; cur=ex;
  document.getElementById("exd-title").textContent=ex.t;
  document.getElementById("exd-sub").textContent=ex.sub;
  const cap=document.getElementById("exd-cap"); cap.innerHTML='<span class="fdot"></span>';
  cap.append(document.createTextNode(ex.cap+(playing?"":" Trykk på figuren for å bytte mellom start og slutt.")));
  fill("exd-steps",ex.steps); fill("exd-cues",ex.cues); fill("exd-err",ex.err);
  const prog=document.getElementById("exd-prog");
  if(ex.prog){ prog.hidden=false; document.getElementById("exd-prog-title").textContent=ex.prog.title; fill("exd-prog-list",ex.prog.items); } else prog.hidden=true;
  frozenU=0; paint(0);
  if(dlg.showModal){ try{dlg.showModal()}catch(e){dlg.setAttribute("open","")} } else dlg.setAttribute("open","");
  dlg.querySelector(".exd-in").scrollTop=0;
  setPlaying(playing);
}
function close(){cancelAnimationFrame(raf); if(dlg.close) dlg.close(); else dlg.removeAttribute("open");}
export function initExerciseDialog(){
  dlg=document.getElementById("exd"); svg=document.getElementById("exd-svg");
  playBtn=document.getElementById("exd-play"); phaseEl=document.getElementById("exd-phase");
  playBtn.addEventListener("click",()=>setPlaying(!playing));
  svg.addEventListener("click",()=>{ if(!playing){ frozenU=frozenU<.5?1:0; paint(frozenU);} });
  document.getElementById("exd-close").addEventListener("click",close);
  dlg.addEventListener("close",()=>cancelAnimationFrame(raf));
  dlg.addEventListener("click",e=>{ if(e.target===dlg) close(); });
  document.addEventListener("click",e=>{const b=e.target.closest("[data-ex]"); if(b){e.preventDefault(); openExercise(b.dataset.ex);}});
  const byTable={}; for(const k in EX) byTable[EX[k].t]=k;
  document.querySelectorAll("#styrke tbody tr td:first-child").forEach(td=>{
    const id=byTable[td.textContent.trim()]; if(!id) return;
    const b=document.createElement("button"); b.type="button"; b.className="exlink"; b.dataset.ex=id; b.textContent=td.textContent.trim();
    td.textContent=""; td.append(b);
  });
}
