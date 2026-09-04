function renderNeed(){
$("view-potrebuji").innerHTML = `<div class="topbar"><div><h2>Potřebuji</h2><p class="lede">Jedna potravina, talíř, košík, stůl pro rodinu nebo svačina dítěte. Bez důkazu nouze.</p></div></div><article class="card"><form class="form" id="formNeed"><label>Co chybí<input name="title" placeholder="večeře pro dva dospělé a dítě / jen mléko" required></label><div class="grid" style="grid-template-columns:1fr 1fr 1fr;gap:12px"><label>Tvar<select name="type"><option value="plate">Talíř</option><option value="basket">Košík / nákup</option><option value="table">Postav stůl</option><option value="child">Malý stůl</option><option value="neighbor">Sousedský talíř</option></select></label><label>Hlavní díra<select name="food">${foodOpts()}</select></label><label>Oblast<select name="city">${cityOpts("zizkov")}</select></label></div><div class="checks"><label class="check"><input type="checkbox" name="silent" checked> Tichý talíř</label><label class="check"><input type="checkbox" name="noQuestions" checked> Bez otázek</label><label class="check"><input type="checkbox" name="sleeping"> Spící miska</label></div><button class="btn btn-gold" type="submit">Zadat potřebu</button></form></article>`;
$("formNeed").onsubmit = addNeed;
}
function renderPodat(){
const holes = state.bridges.filter(b=>b.status!=="done" && b.parts.some(p=>!p.filled));
$("view-podat").innerHTML = `<div class="topbar"><div><h2>Podat most</h2><p class="lede">Nemusíš splnit celou potřebu. Stačí půlka, příloha, 1,4 km, nebo místo ve Studánce.</p></div></div><div class="grid grid-cards">${holes.map(b=>`<article class="card"><div class="kicker">${b.pct} % · ${b.type}</div><h3>${b.title}</h3><p class="gap">${b.gap}</p><div class="bar"><i style="width:${b.pct}%"></i></div><div class="meta">${b.parts.filter(p=>!p.filled).map(p=>`<span class="pill ember">${p.label}</span>`).join("")}</div><button class="btn btn-moss" onclick="showBridge('${b.id}')">Podat kousek</button></article>`).join("")}</div>`;
}
function renderCesta(){
$("view-cesta").innerHTML = `<div class="topbar"><div><h2>Vlaštovka</h2><p class="lede">Označ trasu, kterou stejně jedeš.</p></div></div><div class="grid grid-2"><article class="card"><form class="form" id="formRoute"><label>Jak to pojmenuješ<input name="title" placeholder="Vinohrady → Žižkov dnes 17:40"></label><div class="grid" style="grid-template-columns:1fr 1fr 1fr;gap:12px"><label>Od<select name="from">${cityOpts("vinohrady")}</select></label><label>Přes<select name="via"><option value="">—</option>${cityOpts("zizkov")}</select></label><label>Kam<select name="to">${cityOpts("karlin")}</select></label></div><div class="grid" style="grid-template-columns:1fr 1fr;gap:12px"><label>Kdy<input name="when" placeholder="dnes 17:40"></label><label>Unesu porcí<input name="seats" type="number" min="1" value="3"></label></div><button class="btn btn-gold" type="submit">Otevřít křídla</button></form></article><article class="card"><div class="kicker">Nabídnutý náklad</div>${state.bridges.filter(b=>b.status!=="done" && b.parts.some(p=>!p.filled && p.role==="route")).map(b=>`<p class="gap">${b.gap}</p><p>${b.title}</p><button class="btn btn-moss" onclick="showBridge('${b.id}')">Vést tento úsek</button>`).join("") || "<p>Teď žádný most nečeká na cestu.</p>"}<div class="kicker">Živé vlaštovky</div>${state.routes.map(r=>`<p>${r.title} · ${r.when} · ${r.seats} míst</p>`).join("")}</article></div>`;
$("formRoute").onsubmit = addRoute;
}
function renderMosty(){
const layers = [["all","Vše"],["open","Otevřené"],["moving","V pohybu"],["ready","K vyzvednutí"],["done","Dokončené"]];
const list = state.bridges.filter(b=>filter==="all"||b.status===filter);
$("view-mosty").innerHTML = `<div class="topbar"><div><h2>Mosty jídla</h2><p class="lede">Jednotka není porce. Jednotka je chybějící kousek.</p></div></div><div class="filters">${layers.map(([id,l])=>`<button class="${filter===id?"on":""}" onclick="filter='${id}';render()">${l}</button>`).join("")}</div><div class="grid grid-cards">${list.map(b=>`<article class="card"><div class="kicker">${b.status} · ${b.pct} %</div><h3>${b.title}</h3><p>${b.gap}</p><div class="bar"><i style="width:${b.pct}%"></i></div><button class="btn btn-moss" onclick="showBridge('${b.id}')">Otevřít</button></article>`).join("")}</div>`;
}
function renderMap(){
const nodes = Object.entries(CITIES).map(([id,c])=>{const st = state.studanky.some(s=>s.city===id);return `<circle cx="${c.x}" cy="${c.y}" r="${st?2.3:1.3}" fill="${st?"#c9a15a":"#8b8376"}"/><text x="${c.x}" y="${c.y+4}" fill="#f6efe3" font-size="3" text-anchor="middle" font-family="Outfit,sans-serif">${c.name}</text>`;}).join("");
const labels = state.bridges.filter(b=>b.status!=="done").map((b,i)=>{const loc = CITIES[b.city] || CITIES.praha;const y = loc.y - 7 - (i%3)*4;return `<rect x="${loc.x-12}" y="${y-3}" width="24" height="5.4" rx="1.4" fill="#f6efe3"/><text x="${loc.x}" y="${y+0.7}" font-size="2.1" text-anchor="middle" fill="#1a1712" font-family="Outfit,sans-serif">${b.pct}% ${b.gap.slice(0,28)}</text>`;}).join("");
$("view-mapa").innerHTML = `<div class="topbar"><div><h2>Mapa děr</h2><p class="lede">Nevidíš lidi. Vidíš díry v mostech.</p></div></div><div class="map-wrap"><svg viewBox="0 0 100 100"><path d="M12,38 C18,18 38,14 52,16 C68,18 86,24 90,38 C94,52 86,62 80,70 C70,86 52,90 36,84 C22,78 10,64 12,38 Z" fill="#2a1c14" stroke="#c9a15a" stroke-opacity=".25"/>${nodes}${labels}</svg><div class="map-legend">zlatá tečka = Studánka</div></div>`;
}
function renderReka(){
$("view-reka").innerHTML = `<div class="topbar"><div><h2>Řeka</h2><p class="lede">Tok zachráněného jídla městem.</p></div></div><div class="grid grid-cards">${state.rivers.map(r=>`<article class="card"><div class="kicker">${r.status}</div><h3>${r.title}</h3><div class="river">${r.path.map(p=>`<span>${p}</span>`).join("<i>→</i>")}</div><p>${r.kg} kg · ${r.plates} talířů</p></article>`).join("")}${state.bridges.filter(b=>b.river&&b.river.length).map(b=>`<article class="card"><div class="kicker">${b.status}</div><h3>${b.title}</h3><div class="river">${b.river.map(p=>`<span>${p}</span>`).join("<i>→</i>")}</div></article>`).join("")}</div>`;
}
function renderStudanky(){
$("view-studanky").innerHTML = `<div class="topbar"><div><h2>Studánky</h2><p class="lede">Neutrální výdej. Dárce a příjemce se nepotkají.</p></div></div><div class="grid grid-cards">${state.studanky.map(s=>`<article class="card"><div class="kicker">${cityName(s.city)}</div><h3>${s.name}</h3><p>${s.place}</p><div class="meta"><span class="pill">${s.window}</span><span class="pill ${s.cold?"water":"quiet"}">${s.cold?"chlazeno":"suché"}</span></div></article>`).join("")}</div>`;
}
function renderSloz(){
$("view-sloz").innerHTML = `<div class="topbar"><div><h2>Slož most za mě</h2><p class="lede">Napiš potřebu lidskou větou.</p></div></div><article class="card"><form class="form" id="formSloz"><label>Věta<textarea name="text">potřebuji večeři pro dva dospělé a dítě</textarea></label><button class="btn btn-gold" type="submit">Navrhnout most</button></form><div id="slozOut"></div></article>`;
$("formSloz").onsubmit = (e)=>{e.preventDefault();const plan = composeForMe(new FormData(e.target).get("text"));window._plan = plan;$("slozOut").innerHTML = `<div class="kicker" style="margin-top:16px">Návrh · ${plan.pct} %</div><div class="bar"><i style="width:${plan.pct}%"></i></div>${plan.plan.map(p=>`<p>${p.missing?"Chybí":"Máme"} — ${p.label}${p.from?" · "+p.from:""}</p>`).join("")}<button class="btn btn-ember" onclick="acceptCompose(window._plan)">Položit tento most</button>`;};
}
function renderJa(){
$("view-ja").innerHTML = `<div class="topbar"><div><h2>Moje tůň</h2><p class="lede">Alias, tiché vzkazy, žádný důkaz nouze.</p></div><button class="btn btn-ghost" onclick="if(confirm('Vrátit ukázku?')){state=seed();save();render();toast('Zpět u peci.');}">Reset ukázky</button></div><div class="grid grid-2"><article class="card"><div class="kicker">Alias</div><h3>${state.me.alias}</h3><div class="statline"><div class="stat"><b>${state.me.kindness}</b><span>kousků</span></div><div class="stat"><b>${state.me.plates}</b><span>talířů</span></div><div class="stat"><b>${state.me.rescuedKg}</b><span>kg hladiny</span></div></div></article><article class="card"><div class="kicker">Tichá voda</div>${state.notices.map(n=>`<div class="notice">${n.text}</div>`).join("")}<button class="btn btn-moss" onclick="state.notices.forEach(n=>n.unread=false);save();render();">Označit čtené</button></article></div>`;
}
function render(){
renderNav();
const on = [...document.querySelectorAll(".view")].find(v=>v.classList.contains("on"));
const id = on ? on.id.replace("view-","") : "domov";
({domov: renderHome, mam: renderMam, potrebuji: renderNeed, podat: renderPodat, cesta: renderCesta, mosty: renderMosty, mapa: renderMap, reka: renderReka, studanky: renderStudanky, sloz: renderSloz, ja: renderJa}[id] || renderHome)();
}
window.go = go;
window.showBridge = showBridge;
window.fillPart = fillPart;
window.finish = finish;
window.closeModal = closeModal;
window.eveningRescue = eveningRescue;
window.morningSurplus = morningSurplus;
window.acceptCompose = acceptCompose;
render();
