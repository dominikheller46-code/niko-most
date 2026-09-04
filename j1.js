const KEY = "niko-most-jidlo-v1";
const CITIES = {
praha: { name: "Praha", x: 38, y: 42 },
zizkov: { name: "Žižkov", x: 41, y: 40 },
vinohrady: { name: "Vinohrady", x: 40, y: 44 },
karlin: { name: "Karlín", x: 42, y: 39 },
kolin: { name: "Kolín", x: 49, y: 43 },
pardubice: { name: "Pardubice", x: 57, y: 41 },
brno: { name: "Brno", x: 62, y: 68 },
plzen: { name: "Plzeň", x: 22, y: 52 }
};
const FOOD = [
{ id: "chleb", label: "pečivo" },
{ id: "mleko", label: "mléko" },
{ id: "ovoce", label: "ovoce" },
{ id: "zelenina", label: "zelenina" },
{ id: "hlavni", label: "hlavní jídlo" },
{ id: "priloha", label: "příloha" },
{ id: "dite", label: "dětské jídlo" },
{ id: "balene", label: "balené" },
{ id: "jine", label: "jiné" }
];
function uid(p){ return p + "-" + Math.random().toString(36).slice(2,8); }
function cityName(id){ return (CITIES[id]&&CITIES[id].name) || id || "—"; }
function foodLabel(id){ const f = FOOD.find(x=>x.id===id); return f?f.label:id; }
function seed(){
return {
me: { alias: "Kapka 8", kindness: 2, plates: 1, km: 4, rescuedKg: 6 },
notices: [
{ id: "n1", unread: true, text: "Spící miska: poblíž Žižkova se objevilo mléko. Tichý talíř se může doplnit." }
],
studanky: [
{ id: "s-zizkov", name: "Studánka Žižkov", city: "zizkov", place: "chlazená skříň u fary", window: "7–21", cold: true },
{ id: "s-karlin", name: "Studánka Karlín", city: "karlin", place: "box u komunitní kuchyně", window: "8–20", cold: true },
{ id: "s-vinohrady", name: "Studánka Vinohrady", city: "vinohrady", place: "výdejní okno hotelu", window: "6–11 / 20–22", cold: true },
{ id: "s-brno", name: "Studánka Brno Cejl", city: "brno", place: "zelená skříň", window: "9–18", cold: false }
],
offers: [
{ id: "o1", kind: "surplus", title: "8 chlebů z peci", food: "chleb", qty: 8, city: "vinohrady", owner: "Pekárna Růže", urgent: "evening", ttl: "120 min", status: "open" },
{ id: "o2", kind: "surplus", title: "Mléko 1 l", food: "mleko", qty: 1, city: "karlin", owner: "me", urgent: "normal", ttl: "dnes", status: "open" },
{ id: "o3", kind: "surplus", title: "Jablka 1 kg", food: "ovoce", qty: 1, city: "zizkov", owner: "Jasan 2", urgent: "normal", ttl: "zítra", status: "open" },
{ id: "o4", kind: "surplus", title: "Svíčková 6 porcí", food: "hlavni", qty: 6, city: "vinohrady", owner: "Restaurace Most", urgent: "quick", ttl: "60 min", status: "open" },
{ id: "o5", kind: "surplus", title: "Rýže příloha", food: "priloha", qty: 4, city: "karlin", owner: "Hotel Jitro", urgent: "morning", ttl: "dopoledne", status: "open" },
{ id: "o6", kind: "wait", title: "Předplacená porce polévky", food: "hlavni", qty: 1, city: "zizkov", owner: "anonym", urgent: "prepaid", ttl: "týden", status: "waiting" },
{ id: "o7", kind: "pledge", title: "Každé úterý 10 porcí", food: "hlavni", qty: 10, city: "praha", owner: "Firma Semínko", urgent: "plant", ttl: "úterý", status: "pledge" }
],
routes: [
{ id: "r1", title: "Vinohrady → Žižkov → Karlín", from: "vinohrady", to: "karlin", via: "zizkov", when: "dnes 17:40", seats: 3, owner: "Petr", status: "open" },
{ id: "r2", title: "Praha centrum → Kolín", from: "praha", to: "kolin", via: "", when: "zítra ráno", seats: 1, owner: "Vítr 3", status: "open" }
],
bridges: [
{ id: "b1", title: "Košík pro anonymní rodinu", type: "basket", city: "zizkov", status: "moving", pct: 65, invisible: true, noQuestions: true, parts: [
{ id: "p1", role: "food", food: "chleb", label: "3 chleby z pekárny", filled: true },
{ id: "p2", role: "food", food: "mleko", label: "mléko", filled: false },
{ id: "p3", role: "food", food: "ovoce", label: "ovoce", filled: false },
{ id: "p4", role: "route", label: "převoz 1,4 km", filled: true },
{ id: "p5", role: "place", label: "Studánka Žižkov", filled: true }
], gap: "Máme chleba. Chybí mléko a ovoce.", river: ["Vinohrady", "Žižkov"], code: "CHLÉB", story: "Pekárna dala 8 chlebů. Petr veze 3. Studánka drží. Košík čeká na zbytek nákupu." },
{ id: "b2", title: "Dostav talíř — svíčková", type: "plate", city: "vinohrady", status: "open", pct: 50, invisible: false, noQuestions: true, parts: [
{ id: "p1", role: "food", food: "hlavni", label: "hlavní jídlo", filled: true },
{ id: "p2", role: "food", food: "priloha", label: "příloha", filled: false },
{ id: "p3", role: "food", food: "ovoce", label: "ovoce", filled: false },
{ id: "p4", role: "route", label: "rychlý převoz do 60 min", filled: false },
{ id: "p5", role: "place", label: "Studánka nebo výdej", filled: true }
], gap: "Máme hlavní jídlo. Chybí příloha, ovoce a 1,4 km cesty.", river: ["Vinohrady"], code: "TÁC", story: "Rychlý most. Porce musí odejít do hodiny." },
{ id: "b3", title: "Sousedský talíř paní z Karlína", type: "neighbor", city: "karlin", status: "open", pct: 80, invisible: true, noQuestions: true, parts: [
{ id: "p1", role: "food", food: "hlavni", label: "večeře", filled: true },
{ id: "p2", role: "food", food: "chleb", label: "pečivo", filled: true },
{ id: "p3", role: "route", label: "1,4 km cesty ke dveřím", filled: false },
{ id: "p4", role: "place", label: "předání u dveří / Studánka", filled: true }
], gap: "Tomuto mostu nechybí jídlo. Chybí mu 1,4 km cesty.", river: ["Karlín"], code: "PRÁH", story: "Bezpečná lokální pomoc člověku, který má problém dojít nakoupit." },
{ id: "b4", title: "Malý stůl — svačina dítěte", type: "child", city: "zizkov", status: "open", pct: 40, invisible: true, noQuestions: true, parts: [
{ id: "p1", role: "food", food: "dite", label: "přesnídávka / mléko", filled: false },
{ id: "p2", role: "food", food: "ovoce", label: "ovoce", filled: false },
{ id: "p3", role: "place", label: "Studánka Žižkov", filled: true },
{ id: "p4", role: "route", label: "krátký donos", filled: false }
], gap: "Chybí dětské jídlo a ovoce.", river: ["Žižkov"], code: "JABLKO", story: "Tichý talíř. Bez vysvětlování důvodu." },
{ id: "b5", title: "40 porcí z úterního slibu", type: "split", city: "praha", status: "open", pct: 30, invisible: false, noQuestions: true, parts: [
{ id: "p1", role: "food", food: "hlavni", label: "porce jídla", filled: true },
{ id: "p2", role: "place", label: "vhodná Studánka", filled: false },
{ id: "p3", role: "route", label: "rozdělení mezi více míst", filled: false }
], gap: "Jídlo existuje, převoz částečně. Chybí Studánka.", river: ["Praha"], code: "SÍŤ", story: "Rozděl most. 40 porcí nemusí dostat jedno místo." },
{ id: "b6", title: "Hotový stůl — polévka z daru", type: "done", city: "zizkov", status: "done", pct: 100, invisible: true, noQuestions: true, parts: [
{ id: "p1", role: "food", food: "hlavni", label: "polévka", filled: true },
{ id: "p2", role: "route", label: "vlaštovka", filled: true },
{ id: "p3", role: "place", label: "Studánka Žižkov", filled: true }
], gap: "Most byl dokončen.", river: ["Vinohrady", "Žižkov", "Karlín"], code: "MÍSA", story: "Předplacená porce našla tichý talíř. Nikdo se nepotkal." }
],
rivers: [
{ title: "Chléb z peci", path: ["Vinohrady", "Žižkov", "Karlín"], kg: 4.2, plates: 11, status: "teče" },
{ title: "Večerní záchrana restaurace", path: ["Vinohrady", "Žižkov"], kg: 9.0, plates: 6, status: "teče" },
{ title: "Polévka z daru", path: ["Vinohrady", "Žižkov", "Karlín"], kg: 1.1, plates: 1, status: "dokončeno" }
]
};
}
function load(){
try {
const raw = localStorage.getItem(KEY);
if (!raw) return seed();
const s = JSON.parse(raw);
if (!s || !s.bridges || !s.me) return seed();
return s;
} catch { return seed(); }
}
function save(){ localStorage.setItem(KEY, JSON.stringify(state)); }
let state = load();
let filter = "all";
const VIEWS = [
{ id: "domov", label: "Domov" },
{ id: "mam", label: "Mám navíc" },
{ id: "potrebuji", label: "Potřebuji" },
{ id: "podat", label: "Podat most" },
{ id: "cesta", label: "Jedu cestou" },
{ id: "mosty", label: "Mosty" },
{ id: "mapa", label: "Mapa děr" },
{ id: "reka", label: "Řeka" },
{ id: "studanky", label: "Studánky" },
{ id: "sloz", label: "Slož most za mě" },
{ id: "ja", label: "Moje tůň" }
];
function $(id){ return document.getElementById(id); }
function toast(msg){
const el = $("toast"); el.textContent = msg; el.classList.add("show");
setTimeout(()=>el.classList.remove("show"), 3400);
}
function openModal(html){ $("modal").innerHTML = html; $("modalBg").classList.add("open"); }
function closeModal(){ $("modalBg").classList.remove("open"); }
function go(view){
document.querySelectorAll(".view").forEach(v=>v.classList.remove("on"));
const el = $("view-"+view); if (el) el.classList.add("on");
render(); window.scrollTo(0,0);
}
function unread(){ return state.notices.filter(n=>n.unread).length; }
function recalc(b){
const n = b.parts.length || 1;
const f = b.parts.filter(p=>p.filled).length;
b.pct = Math.round(100*f/n);
const miss = b.parts.filter(p=>!p.filled);
if (!miss.length) { b.gap = "Most je složen. Čeká na vyzvednutí."; if (b.status!=="done") b.status = "ready"; return; }
const foods = miss.filter(p=>p.role==="food").map(p=>p.label);
const route = miss.some(p=>p.role==="route");
const place = miss.some(p=>p.role==="place");
if (!foods.length && route) b.gap = "Tomuto mostu nechybí jídlo. Chybí mu kus cesty.";
else if (!foods.length && place) b.gap = "Jídlo i převoz jsou. Chybí Studánka.";
else if (foods.length && !route && !place) b.gap = "Chybí " + foods.join(" a ") + ".";
else b.gap = "Most je dokončen z " + b.pct + " %. Chybí " + miss.map(p=>p.label).join(", ") + ".";
}
function fillPart(bid, pid){
const b = state.bridges.find(x=>x.id===bid); if(!b) return;
const p = b.parts.find(x=>x.id===pid); if(!p || p.filled) return;
if (p.role==="food"){
const off = state.offers.find(o=>o.status==="open" && o.food===p.food);
if (off){ off.status = "in_bridge"; off.bridgeId = b.id; p.from = off.title; }
}
if (p.role==="route"){
const rt = state.routes.find(r=>r.status==="open");
if (rt){ p.from = rt.title; rt.seats = Math.max(0, (rt.seats||1)-1); }
}
if (p.role==="place"){
const st = state.studanky[0];
p.from = st.name; p.filledLabel = st.name;
}
p.filled = true;
recalc(b);
state.me.kindness += 1;
save();
toast("Přidal jsi kousek. Účastníci zůstávají skrytí.");
closeModal();
render();
}
function finish(bid){
const b = state.bridges.find(x=>x.id===bid); if(!b) return;
b.status = "done"; b.pct = 100; b.parts.forEach(p=>p.filled=true);
b.gap = "Most byl dokončen.";
state.me.plates += 1;
save();
if (b.invisible){
openModal(`<div class="kicker">Tichý talíř</div><h3>Most byl dokončen.</h3><p>Příjemce ani dárce se nemusí znát. Stačily kousky.</p><button class="btn btn-gold" onclick="closeModal();go('reka')">Řeka</button>`);
} else toast("Stůl je postaven.");
render();
}
function showBridge(id){
const b = state.bridges.find(x=>x.id===id); if(!b) return;
recalc(b);
const parts = b.parts.map(p=>`
<div class="step ${p.filled?"done":"ready"}">
<div class="bullet">${p.filled?"✓":""}</div>
<div>
<div><b>${p.filled?"Je tu":"Chybí"}</b> — ${p.label}${p.from? " · "+p.from:""}</div>
${p.filled?"":`<button class="btn btn-gold" style="margin-top:6px" onclick="fillPart('${b.id}','${p.id}')">Podat půl mostu</button>`}
</div>
</div>`).join("");
openModal(`
<div class="kicker">${b.type} · ${b.pct} %</div>
<h3>${b.title}</h3>
<p class="gap">${b.gap}</p>
<div class="bar"><i style="width:${b.pct}%"></i></div>
<div class="meta">
${b.invisible?'<span class="pill gold">Tichý talíř</span>':''}
${b.noQuestions?'<span class="pill">Bez otázek</span>':''}
<span class="pill water">kód ${b.code}</span>
</div>
<p>${b.story}</p>
<div class="steps">${parts}</div>
<div class="river">${(b.river||[]).map(x=>`<span>${x}</span>`).join("<i>→</i>")}</div>
<div class="actions">
${b.pct===100 && b.status!=="done" ? `<button class="btn btn-ember" onclick="finish('${b.id}')">Vyzvednout / dokončit</button>`:""}
<button class="btn btn-ghost" style="color:var(--ink);border-color:var(--line)" onclick="closeModal()">Zavřít</button>
</div>
`);
}
