function addOffer(ev, extra){
ev.preventDefault();
const fd = new FormData(ev.target);
const item = { id: uid("o"), kind: extra.kind || "surplus", title: (fd.get("title")||"").trim(), food: fd.get("food"), qty: Number(fd.get("qty")||1), city: fd.get("city"), owner: "me", urgent: fd.get("urgent") || extra.urgent || "normal", ttl: fd.get("ttl") || extra.ttl || "dnes", silent: !!fd.get("silent"), noQuestions: !!fd.get("noQuestions"), attach: !!fd.get("attach"), status: fd.get("sleeping") ? "sleeping" : "open" };
if (!item.title){ toast("Napiš, co neseš."); return; }
state.offers.unshift(item);
const hole = state.bridges.find(b => b.status!=="done" && b.parts.some(p=>!p.filled && p.role==="food" && p.food===item.food));
if (hole && item.status==="open"){
const p = hole.parts.find(x=>!x.filled && x.role==="food" && x.food===item.food);
p.filled = true; p.from = item.title; item.status = "in_bridge"; item.bridgeId = hole.id; recalc(hole);
state.notices.unshift({ id: uid("n"), unread: true, text: "Tvůj kousek se potichu přivázal k talíři." });
toast("Systém přivázal jídlo k existujícímu mostu.");
} else if (item.attach){
const open = state.bridges.find(b=>b.status!=="done" && b.type==="plate");
if (open){ open.parts.push({ id: uid("p"), role: "food", food: item.food, label: item.title, filled: true, from: "přivázáno" }); recalc(open); toast("Přivázáno k talíři."); }
} else {
state.bridges.unshift({ id: uid("b"), title: item.title, type: "plate", city: item.city, status: "open", pct: 35, invisible: !!item.silent, noQuestions: true, parts: [{ id: uid("p"), role: "food", food: item.food, label: item.title, filled: true },{ id: uid("p"), role: "route", label: "převoz", filled: false },{ id: uid("p"), role: "place", label: "Studánka", filled: false }], gap: "Jídlo je. Chybí cesta a místo.", river: [cityName(item.city)], code: "MÍSA"+Math.floor(10+Math.random()*89), story: "Nový kousek čeká na cestu a Studánku." });
toast("Most z jídla je položen.");
}
save(); ev.target.reset(); go("mosty");
}
function addNeed(ev){
ev.preventDefault();
const fd = new FormData(ev.target);
const title = (fd.get("title")||"").trim();
if (!title){ toast("Napiš potřebu bez důvodu."); return; }
const type = fd.get("type") || "basket";
const food = fd.get("food");
const silent = !!fd.get("silent");
const sleeping = !!fd.get("sleeping");
const parts = [{ id: uid("p"), role: "food", food, label: foodLabel(food), filled: false },{ id: uid("p"), role: "food", food: "chleb", label: "pečivo", filled: false },{ id: uid("p"), role: "route", label: "převoz", filled: false },{ id: uid("p"), role: "place", label: "Studánka", filled: true }];
if (type==="table"){ parts.push({ id: uid("p"), role: "food", food: "hlavni", label: "hlavní jídlo", filled: false }); parts.push({ id: uid("p"), role: "food", food: "ovoce", label: "ovoce", filled: false }); }
if (type==="child"){ parts[0].food = "dite"; parts[0].label = "dětské jídlo"; }
const b = { id: uid("b"), title, type, city: fd.get("city"), status: "open", pct: 20, invisible: silent, noQuestions: true, parts, gap: sleeping ? "Spící miska. Čeká na jídlo poblíž." : "Systém hledá kousky.", river: [cityName(fd.get("city"))], code: "TICH"+Math.floor(10+Math.random()*89), story: silent ? "Tichý talíř." : title };
if (sleeping){ state.offers.unshift({ id: uid("o"), kind: "need", title, food, qty: 1, city: fd.get("city"), owner: "me", urgent: "sleep", ttl: "spí", status: "sleeping" }); toast("Spící miska uložena."); } else toast("Potřeba je v síti.");
state.bridges.unshift(b); save(); ev.target.reset(); go("mosty");
}
function addRoute(ev){
ev.preventDefault();
const fd = new FormData(ev.target);
const title = (fd.get("title")||"").trim() || cityName(fd.get("from"))+" → "+cityName(fd.get("to"));
const rt = { id: uid("r"), title, from: fd.get("from"), to: fd.get("to"), via: fd.get("via")||"", when: fd.get("when")||"dnes", seats: Number(fd.get("seats")||1), owner: "me", status: "open" };
state.routes.unshift(rt);
const hole = state.bridges.find(b=>b.status!=="done" && b.parts.some(p=>!p.filled && p.role==="route"));
if (hole){ const p = hole.parts.find(x=>!x.filled && x.role==="route"); p.filled = true; p.from = rt.title; recalc(hole); toast("Vlaštovka usedla na most."); } else toast("Trasa je v síti.");
save(); ev.target.reset(); go("podat");
}
function composeForMe(text){
const t = (text||"").toLowerCase();
const wantChild = /dít|dítě|dets/.test(t);
const plan = [];
const take = (food) => state.offers.find(o=>o.status==="open" && o.food===food);
const h = take("hlavni"); if (h) plan.push({ role:"food", label: h.title, from: h.owner, food:"hlavni", offer:h.id }); else plan.push({ role:"food", label:"hlavní jídlo", missing:true, food:"hlavni" });
const s = take("priloha") || take("chleb"); if (s) plan.push({ role:"food", label:s.title, from:s.owner, food:s.food, offer:s.id }); else plan.push({ role:"food", label:"příloha / pečivo", missing:true, food:"chleb" });
const o = take("ovoce"); if (o) plan.push({ role:"food", label:o.title, from:o.owner, food:"ovoce", offer:o.id }); else plan.push({ role:"food", label:"ovoce", missing:true, food:"ovoce" });
if (wantChild){ const d = take("dite") || take("mleko"); if (d) plan.push({ role:"food", label:d.title, from:d.owner, food:d.food, offer:d.id }); else plan.push({ role:"food", label:"dětské jídlo", missing:true, food:"dite" }); }
const rt = state.routes.find(r=>r.status==="open"); if (rt) plan.push({ role:"route", label: rt.title, from: rt.when }); else plan.push({ role:"route", label:"převoz", missing:true });
plan.push({ role:"place", label: "Studánka Žižkov", from: "chlazená skříň" });
const filled = plan.filter(p=>!p.missing).length;
return { text, wantChild, city: "zizkov", plan, pct: Math.round(100*filled/plan.length) };
}
function acceptCompose(planObj){
const parts = planObj.plan.map(p=>({ id: uid("p"), role: p.role==="food"?"food":p.role, food: p.food||"jine", label: p.label, filled: !p.missing, from: p.from||"" }));
planObj.plan.filter(p=>p.offer).forEach(p=>{ const o = state.offers.find(x=>x.id===p.offer); if (o) o.status = "in_bridge"; });
const b = { id: uid("b"), title: planObj.wantChild ? "Stůl pro dva dospělé a dítě" : "Složený stůl", type: "table", city: planObj.city, status: "moving", pct: planObj.pct, invisible: true, noQuestions: true, parts, gap: "", river: ["Vinohrady","Žižkov"], code: "STŮL", story: "Složeno ze zdrojů v síti." };
recalc(b); state.bridges.unshift(b); save(); toast("Most je navržen a položen."); go("mosty");
}
function eveningRescue(){
state.offers.unshift({ id: uid("o"), kind: "surplus", title: "Večerní přebytky kuchyně", food: "hlavni", qty: 12, city: "vinohrady", owner: "me", urgent: "evening", ttl: "90 min", status: "open" });
state.bridges.unshift({ id: uid("b"), title: "Večerní záchrana — 12 porcí", type: "split", city: "vinohrady", status: "open", pct: 40, invisible: false, noQuestions: true, parts: [{ id: uid("p"), role:"food", food:"hlavni", label:"12 porcí", filled:true },{ id: uid("p"), role:"route", label:"vlaštovky na rozdělení", filled:false },{ id: uid("p"), role:"place", label:"Studánky ve městě", filled:false }], gap: "Jídlo je. Chybí rozdělení a místa.", river: ["Vinohrady"], code: "VEČER", story: "Restaurace uvolnila večerní přebytky." });
save(); toast("Večerní záchrana je v řece."); go("mosty");
}
function morningSurplus(){
state.offers.unshift({ id: uid("o"), kind: "surplus", title: "Balené snídaně hotelu", food: "balene", qty: 7, city: "vinohrady", owner: "me", urgent: "morning", ttl: "dopoledne", status: "open" });
save(); toast("Ranní přebytek uvolněn."); go("mosty");
}
function renderNav(){
$("nav").innerHTML = VIEWS.map(v => `<button data-view="${v.id}" onclick="go('${v.id}')">${v.label}${v.id==="ja"&&unread()?`<span class="dot">${unread()}</span>`:""}</button>`).join("");
const on = [...document.querySelectorAll(".view")].find(v=>v.classList.contains("on"));
const id = on ? on.id.replace("view-","") : "domov";
document.querySelectorAll(".nav button").forEach(b=>b.classList.toggle("active", b.dataset.view===id));
$("alias").textContent = state.me.alias;
$("avatar").textContent = state.me.alias.slice(0,1);
}
function cityOpts(sel){ return Object.entries(CITIES).map(([id,c])=>`<option value="${id}" ${id===sel?"selected":""}>${c.name}</option>`).join(""); }
function foodOpts(){ return FOOD.map(f=>`<option value="${f.id}">${f.label}</option>`).join(""); }
function renderHome(){
const live = state.bridges.filter(b=>b.status!=="done").length;
const quick = state.offers.filter(o=>o.urgent==="quick"||o.urgent==="evening").length;
$("view-domov").innerHTML = `<div class="topbar"><div><h2>Nemusíš mít všechno.</h2><p class="lede">Stačí přidat svůj kousek. Jeden dá jídlo. Druhý kus cesty. Třetí místo. Čtvrtý potřebuje pomoc. NIKO mezi nimi postaví most.</p></div><div class="actions"><button class="btn btn-ember" onclick="eveningRescue()">Večerní záchrana</button><button class="btn btn-ghost" onclick="morningSurplus()">Ranní přebytek</button></div></div><div class="grid grid-4" style="margin-bottom:18px"><button class="choice" onclick="go('mam')"><span class="emo">🍎</span><b>Mám navíc</b><span>Člověk, restaurace, obchod nebo firma nabídne jídlo.</span></button><button class="choice" onclick="go('potrebuji')"><span class="emo">🥣</span><b>Potřebuji</b><span>Anonymně jedna potravina, jídlo nebo celý nákup.</span></button><button class="choice" onclick="go('podat')"><span class="emo">🌉</span><b>Podat most</b><span>Doplň cizí talíř, košík, nebo jen půlku potřeby.</span></button><button class="choice" onclick="go('cesta')"><span class="emo">🐦</span><b>Jedu cestou</b><span>Vlaštovka. Vezmeš něco mezi body, kolem kterých stejně jedeš.</span></button></div><div class="grid grid-2"><article class="card"><div class="kicker">Co teď chybí síti</div>${state.bridges.filter(b=>b.status!=="done").slice(0,3).map(b=>`<div style="margin:10px 0 14px"><div class="gap">${b.gap}</div><div class="bar"><i style="width:${b.pct}%"></i></div><button class="btn btn-moss" onclick="showBridge('${b.id}')">${b.title} · ${b.pct} %</button></div>`).join("")}</article><div class="grid"><article class="card"><div class="kicker">Hladina jídla</div><div class="statline"><div class="stat"><b>${live}</b><span>živých mostů</span></div><div class="stat"><b>${quick}</b><span>rychlých porcí</span></div><div class="stat"><b>${state.studanky.length}</b><span>Studánek</span></div></div></article><article class="card"><div class="kicker">Slož most za mě</div><p>Napiš potřebuji večeři pro dva dospělé a dítě. Síť navrhne talíř.</p><button class="btn btn-gold" onclick="go('sloz')">Navrhnout řešení</button></article></div></div><p class="quote">Uživatel nehledá jen jídlo. Systém hledá, co chybí k dokončení pomoci.</p>`;
}
function renderMam(){
$("view-mam").innerHTML = `<div class="topbar"><div><h2>Mám navíc</h2><p class="lede">Pekárna, restaurace, hotel, firma, soused.</p></div></div><article class="card"><form class="form" id="formMam"><label>Co uvolňuješ<input name="title" placeholder="8 chlebů / svíčková 6 porcí" required></label><div class="grid" style="grid-template-columns:1fr 1fr 1fr;gap:12px"><label>Druh<select name="food">${foodOpts()}</select></label><label>Kolik<input name="qty" type="number" min="1" value="1"></label><label>Místo<select name="city">${cityOpts("vinohrady")}</select></label></div><div class="grid" style="grid-template-columns:1fr 1fr;gap:12px"><label>Tempo<select name="urgent"><option value="normal">běžné</option><option value="quick">Rychlý most · 60 min</option><option value="evening">Večerní záchrana</option><option value="morning">Ranní přebytek</option><option value="prepaid">Jídlo čeká</option><option value="plant">Zasaď most</option></select></label><label>Do kdy<input name="ttl" placeholder="60 min / dnes večer"></label></div><div class="checks"><label class="check"><input type="checkbox" name="noQuestions" checked> Bez otázek</label><label class="check"><input type="checkbox" name="silent"> Tichý talíř</label><label class="check"><input type="checkbox" name="attach"> Přivaž k talíři</label></div><button class="btn btn-gold" type="submit">Uvolnit kousek</button></form></article>`;
$("formMam").onsubmit = (e)=>addOffer(e,{kind:"surplus"});
}
