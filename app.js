// France Welcome — vanilla JS, localStorage, no backend
const $ = s => document.querySelector(s);

const TASKS = [
 {id:'passport', phase:'pre', title:'Passport valid 3 mo after return date', desc:'Copy ID + signature pages. Needed for Campus France + visa.', tag:'Visa'},
 {id:'campusfrance', phase:'pre', title:'Campus France / Études en France file + interview', desc:'Mandatory for 72 countries + programs 90d+. Fees €50–250. Get approval before consulate.', tag:'Visa'},
 {id:'acceptance', phase:'pre', title:'Acceptance letter + housing proof (first 3 months)', desc:'Lease, residence booking, hotel reservation, or host letter + host ID + lease/deed.', tag:'Visa + Housing'},
 {id:'funds', phase:'pre', title:'Prove funds: €877.50 / month since Aug 2026', desc:'€8,775 for 10 months. Bank statements / scholarship / guarantor. Decree 2026-526.', tag:'Visa'},
 {id:'visa-appt', phase:'pre', title:'Consulate appointment (TLS/VFS) — VLS-TS étudiant €99', desc:'Form + photo + passport + acceptance + housing + funds + insurance. Processing 2–8 wks.', tag:'Visa'},
 {id:'cvec', phase:'pre', title:'Pay CVEC €105 on messervices.etudiant.gouv.fr', desc:'Required before university enrollment. Keep certificate.', tag:'Study'},
 {id:'insurance-travel', phase:'pre', title:'Travel insurance covering first weeks', desc:'Until Sécu + mutuelle active. Some visas require proof.', tag:'Health'},
 {id:'visale-early', phase:'pre', title:'Create Visale guarantor file (visale.fr)', desc:'Free, 18–30, any nationality. Do BEFORE signing lease.', tag:'Housing'},
 {id:'anef', phase:'arrival', title:'Validate VLS-TS on ANEF within 3 months', desc:'administration-etrangers-en-france.interieur.gouv.fr: visa no. + arrival date + French address + pay ~€100 timbre. Download confirmation — = residence permit.', tag:'Residence'},
 {id:'bank', phase:'arrival', title:'Open bank account → get RIB', desc:'Needed for CAF, salary, housing. SEPA account OK. Bring passport + visa + housing proof + enrollment.', tag:'Money'},
 {id:'sim', phase:'arrival', title:'SIM + internet (Free, Bouygues, SFR €10–25)', desc:'Passport + RIB often required. Keep French number for ANEF/CAF/Ameli.', tag:'Daily'},
 {id:'home-ins', phase:'arrival', title:'Home insurance (multirisque habitation) €80–100/yr', desc:'Mandatory for lease. Online: LUKO, Lovys, MAIF. Get attestation.', tag:'Housing'},
 {id:'transport', phase:'arrival', title:'Transport pass + SNCF Avantage Jeune €49/yr', desc:'Paris Imagine R ~€38/mo, Lyon TCL ~€35, Toulouse ~€15. Under-26 discounts.', tag:'Daily'},
 {id:'secu', phase:'settled', title:'Register for Sécu on Ameli (étudiant étranger)', desc:'Reimburses ~70% health costs. Then take mutuelle €10–30/mo for remainder.', tag:'Health'},
 {id:'caf', phase:'settled', title:'CAF housing aid — ONLY if eligible (July 2026 rule)', desc:'Apply on caf.fr → temp ID P+8 digits → provisional Sécu number. Lease + RIB + birth certificate + visa. Rights start next month.', tag:'CAF', cafGate:true},
 {id:'enroll', phase:'settled', title:'University enrollment + student card', desc:'Gives Resto U €3.30 (€1 if scholarship), library, discounts <26y (cinema, museums, pools).', tag:'Study'},
 {id:'titre', phase:'settled', title:'Renew titre de séjour 4→2 months before expiry', desc:'Online on ANEF only. Algerians: certificat de résidence. Keep ADP/receipt while waiting.', tag:'Residence'},
 {id:'job', phase:'settled', title:'If working: contract ≤964h/yr + declare to CAF', desc:'964h/yr (~20h/wk) included with VLS-TS validated. Work also unlocks CAF for non-EU.', tag:'Work'},
 {id:'crous-life', phase:'settled', title:'Settle: CROUS housing portal, Resto U, health center', desc:'CROUS = sole contact for housing + social aid. Social workers via crous-*.fr.', tag:'Life'},
];

const GUIDES = [
 {t:'Visa VLS-TS étudiant (before leaving)', b:`<ol><li>Check <b>France-Visas wizard</b> for your country.</li><li>If 1 of 72 Études en France countries: create file, upload acceptance, pay €50–250, interview.</li><li>Book TLS/VFS: form + passport + acceptance + <b>3-month housing proof</b> + <b>€877.50/mo funds</b> + insurance. Pay €99.</li><li>Timeline for Sept start: Mar–Apr Campus France, May–Jun consulate, Jun–Aug processing.</li></ol>`},
 {t:'Validate VLS-TS on arrival (ANEF, ≤3 months)', b:`<ol><li>Go to administration-etrangers-en-france.interieur.gouv.fr</li><li>Enter visa number, validity dates, arrival date, French address, email/phone.</li><li>Pay timbre fiscal (~€100) by card or cash via electronic stamp kiosk.</li><li>Download 2 emails: login + validation confirmation. Keep with passport — this IS your residence permit for 12 months. After 3 months unvalidated you cannot re-enter without new visa.</li></ol>`},
 {t:'Titre de séjour renewal', b:`Apply <b>4 to 2 months before expiry, online only</b> on ANEF. After 1 yr VLS-TS you can get multi-year titre = remaining study years. Cost ~€150 first student titre. Algerians: email Préfecture / Démarches Numériques for certificat de résidence.`},
 {t:'CAF in English (if eligible)', b:`<ol><li>Have lease + RIB + birth certificate + validated visa/titre.</li><li>caf.fr → new request → answer “No” if no Sécu number → get <b>P+8 temp ID</b>.</li><li>Track with temp ID, then CAF assigns provisional Sécu number → use as login.</li><li>Rights start month AFTER request (request Sept 15 → rights Oct, paid early Nov). Re-apply if you move.</li></ol>Non-EU without EU passport: bring scholarship proof OR work contract, else refused since July 2026.`},
 {t:'Sécu + mutuelle + bank + insurance', b:`Sécu via Ameli (free, ~70% refund). Mutuelle €10–30/mo covers rest. Bank: passport + visa + address + enrollment → RIB (needed for CAF/salary). Home insurance mandatory €80–100/yr. Phone €10–25/mo.`},
 {t:'Study & daily life', b:`Enroll → student card → Resto U €3.30 (€1 scholarship). Transport student passes. Under-26 discounts. SNCF Avantage Jeune €49/yr. Groceries ~€170–250/mo. Cleaning/hygiene ~€100/mo.`},
];

const GLOSS = [
 ['VLS-TS','Long-stay visa = residence permit. Validate on ANEF ≤3 mo.'],
 ['ANEF / OFII','Online portal for foreigners (ANEF replaced most OFII desks).'],
 ['Titre de séjour','Residence permit card. Renew 4→2 mo before expiry on ANEF.'],
 ['Préfecture','Local state office for residence/exceptions.'],
 ['CAF / APL / ALS','Family fund / housing aid. Since July 2026 restricted (see verdict).'],
 ['Sécu / Ameli / Mutuelle','Public health insurance (~70%) / its portal / private top-up (€10–30).'],
 ['CVEC','Student campus-life fee €105/yr, before enrollment.'],
 ['CROUS','Regional student services: dorms, Resto U, scholarships, social aid.'],
 ['Visale','Free public guarantor (18–30, any nationality). visale.fr'],
 ['RIB','Bank account ID slip — required for CAF, salary, refunds.'],
 ['ADP / Récépissé','Extension proof / receipt while titre renewal pending.'],
 ['Resto U','University canteen €3.30 (€1 scholarship holders).'],
];

const RENT = {paris:{crous:400,'coloc':650,'private-res':875,studio:1100}, lyon:{crous:275,'coloc':440,'private-res':550,studio:675}, regional:{crous:225,'coloc':365,'private-res':470,studio:565}};

// Tabs
document.querySelectorAll('#tabs button').forEach(b=>b.onclick=()=>{document.querySelectorAll('#tabs button').forEach(x=>x.classList.remove('active'));b.classList.add('active');document.querySelectorAll('.tab-panel').forEach(p=>p.classList.remove('active'));$('#tab-'+b.dataset.tab).classList.add('active');});
document.querySelectorAll('[data-goto]').forEach(b=>b.onclick=()=>document.querySelector(`#tabs button[data-tab="${b.dataset.goto}"]`).click());

// Profile + CAF verdict
function profile(){return {nat:$('#profile-nat').value, sch:$('#profile-scholarship').checked, job:$('#profile-job').checked, ref:$('#profile-refugee').checked};}
function cafEligible(p){
 if(p.nat==='eu') return {ok:true, why:'EU/EEA/Swiss nationals remain eligible (lease + SEPA RIB, no family link to landlord).'};
 if(p.ref) return {ok:true, why:'Refugees / stateless remain eligible.'};
 if(p.sch||p.job) return {ok:true, why:'Non-EU eligible because: '+(p.sch?'scholarship (CROUS/Eiffel/regional/gov) ':'')+(p.sch&&p.job?'+ ':'')+(p.job?'working/alternance at request time':'')+'. Bring proof.'};
 return {ok:false, why:'Non-EU without scholarship or job: NOT eligible since July 1, 2026. Do NOT budget APL (€100–250). Focus on CROUS / colocation / job / scholarship.'};
}
function renderVerdict(){
 const p=profile(), r=cafEligible(p), el=$('#caf-verdict');
 el.className='alert '+(r.ok?'alert-ok':'alert-no');
 el.innerHTML=`<strong>CAF verdict: ${r.ok?'✅ likely eligible':'❌ likely NOT eligible'}</strong> — ${r.why}`;
}
['profile-nat','profile-scholarship','profile-job','profile-refugee'].forEach(id=>$('#'+id).onchange=()=>{renderVerdict();renderChecklist();});

// Checklist
const store = {get(){try{return JSON.parse(localStorage.getItem('fw-check')||'{}')}catch{return{}}}, set(v){localStorage.setItem('fw-check',JSON.stringify(v))}};
let done = store.get();
function renderChecklist(){
 const p=profile(), f=$('#filter-phase').value, box=$('#checklist'); box.innerHTML='';
 const list=TASKS.filter(t=>(f==='all'||t.phase===f));
 // hide CAF task if not eligible? show but flagged
 list.forEach(t=>{
  const wrap=document.createElement('div'); wrap.className='task'+(done[t.id]?' done':'');
  const cb=document.createElement('input'); cb.type='checkbox'; cb.checked=!!done[t.id];
  cb.onchange=()=>{done[t.id]=cb.checked;store.set(done);renderChecklist();};
  const div=document.createElement('div');
  let extra='';
  if(t.cafGate){const r=cafEligible(p); extra=r.ok?` <span class="pill">you: eligible</span>`:` <span class="pill">you: NOT eligible — skip/see job/scholarship</span>`;}
  div.innerHTML=`<strong>${t.title}</strong><span class="pill">${t.phase}</span><span class="pill">${t.tag}</span>${extra}<small>${t.desc}</small>`;
  if(p.nat==='algerian'&&(t.id==='titre'||t.id==='anef')) div.innerHTML+=`<small>🇩🇿 Algerian: certificat de résidence / minor-visa rules differ — check Préfecture.</small>`;
  wrap.append(cb,div); box.append(wrap);
 });
 const keys=Object.keys(done).filter(k=>done[k]); const pct=Math.round(keys.length/TASKS.length*100);
 $('#progress-bar').style.width=pct+'%'; $('#progress-label').textContent=`— ${keys.length}/${TASKS.length} (${pct}%)`;
}
$('#filter-phase').onchange=renderChecklist;
$('#btn-reset').onclick=()=>{done={};store.set(done);renderChecklist();};
$('#btn-print').onclick=()=>window.print();
$('#btn-export').onclick=()=>{
 const blob=new Blob([JSON.stringify({profile:profile(),done},null,2)],{type:'application/json'});
 const a=document.createElement('a');a.href=URL.createObjectURL(blob);a.download='france-welcome-checklist.json';a.click();
};

// Budget
function renderBudget(){
 const city=$('#b-city').value, h=$('#b-housing').value;
 const rent=RENT[city][h];
 const food=+$('#b-food').value||0, tr=+$('#b-transport').value||0, ph=+$('#b-phone').value||0, ins=+$('#b-ins').value||0, lei=+$('#b-leisure').value||0;
 const cvec=9, total=rent+food+tr+ph+ins+lei+cvec;
 $('#b-total').textContent='€'+total;
 const rows=[['Rent ('+h+')',rent],['Food',food],['Transport',tr],['Phone/net',ph],['Insurance/mutuelle',ins],['Leisure/other',lei],['CVEC prorated',cvec]];
 $('#b-breakdown').innerHTML=rows.map(([k,v])=>{const pc=Math.round(v/total*100)||0;return `<div>${k}: <strong>€${v}</strong> (${pc}%)<div class="bar"><div style="width:${pc}%"></div></div></div>`}).join('');
 const v=$('#b-verdict');
 if(total<877.5){v.className='alert alert-no';v.innerHTML=`❌ Below visa minimum <strong>€877.50/mo</strong>. Increase budget or visa refused.`;}
 else if(total<=1100){v.className='alert alert-ok';v.innerHTML=`✅ Meets visa minimum. Regional-style budget — tight in Paris, OK in ${city}.`;}
 else{v.className='alert';v.innerHTML=`✅ Meets visa minimum. Paris-range budget (€1,200–1,800 typical).`;}
}
['b-city','b-housing','b-food','b-transport','b-phone','b-ins','b-leisure'].forEach(id=>$('#'+id).oninput=renderBudget);

// Guides
$('#guides').innerHTML=GUIDES.map(g=>`<details><summary>${g.t}</summary><div>${g.b}</div></details>`).join('');

// Glossary
function renderGloss(q=''){
 $('#glossary').innerHTML=GLOSS.filter(([k,v])=>(k+v).toLowerCase().includes(q.toLowerCase())).map(([k,v])=>`<p><strong>${k}</strong> — ${v}</p>`).join('')||'<p class="muted">No match.</p>';
}
$('#gloss-search').oninput=e=>renderGloss(e.target.value);

renderVerdict();renderChecklist();renderBudget();renderGloss();
