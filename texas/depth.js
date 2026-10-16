(()=>{
const el=id=>document.getElementById(id);const esc=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const header=document.querySelector('header');function offsets(){document.documentElement.style.setProperty('--header-height',`${header.offsetHeight}px`)}offsets();window.addEventListener('resize',offsets);if(typeof ResizeObserver!=='undefined')new ResizeObserver(offsets).observe(header);
function progress(){let max=document.documentElement.scrollHeight-innerHeight;document.querySelector('.reading-progress i').style.width=`${max>0?scrollY/max*100:0}%`};window.addEventListener('scroll',progress,{passive:true});progress();
const jumpLinks=[...document.querySelectorAll('.jumpnav a')];if(typeof IntersectionObserver!=='undefined'){let io=new IntersectionObserver(entries=>entries.forEach(e=>{if(e.isIntersecting){jumpLinks.forEach(a=>a.classList.toggle('active',a.hash===`#${e.target.id}`))}}),{rootMargin:'-20% 0px -65% 0px'});jumpLinks.forEach(a=>{let t=document.querySelector(a.hash);if(t)io.observe(t)})}
if(el('topic-search')){el('topic-search').oninput=()=>{const q=el('topic-search').value.toLowerCase();let n=0;document.querySelectorAll('[data-topic]').forEach(a=>{a.hidden=!a.dataset.topic.toLowerCase().includes(q);if(!a.hidden)n++});el('topic-count').textContent=`${n} of 12 chapters match. Clear search to see all chapters.`};document.querySelectorAll('.topic-index a').forEach(a=>a.onclick=()=>{el('topic-search').value='';document.querySelectorAll('[data-topic]').forEach(x=>x.hidden=false);el('topic-count').textContent=''})}
function input(id,min,max){const e=el(id),n=Number(e.value);return e.value!==''&&Number.isFinite(n)&&n>=min&&n<=max?n:null}
if(el('reliability-result')){function calc(){const u=input('units',2,100),mw=input('unitmw',1,500),d=input('derate',0,50),p=input('rpue',1,3);if([u,mw,d,p].includes(null)||!Number.isInteger(u)){el('reliability-result').textContent='Enter valid values within the indicated ranges; units must be a whole number.';return}const out=(u-1)*mw*(1-d/100);el('reliability-result').innerHTML=`<div><strong>${out.toFixed(1)} MW</strong><span>Campus supply after one unit loss</span></div><div><strong>${(out/p).toFixed(1)} MW</strong><span>Supported IT load</span></div>`}['units','unitmw','derate','rpue'].forEach(id=>el(id).oninput=calc);calc()}
if(el('water-result')){function calc(){let mw=input('wit',1,2000),w=input('wue',0,5);if(mw===null||w===null){el('water-result').textContent='Enter IT MW from 1–2,000 and WUE from 0–5.';return}let liters=mw*1000*24*w;el('water-result').innerHTML=`<div><strong>${Math.round(liters).toLocaleString()}</strong><span>Liters / day</span></div><div><strong>${Math.round(liters/3.785411784).toLocaleString()}</strong><span>US gallons / day</span></div>`}['wit','wue'].forEach(id=>el(id).oninput=calc);calc()}
if(el('region-detail')){function show(i){const r=REGION_GUIDE[i];el('region-detail').innerHTML=`<div class="region-detail-number">0${i+1}</div><p class="eyebrow">${esc(r[1])}</p><h2>${esc(r[2])}</h2><p class="lead">${esc(r[3])}</p><div class="insight"><b>Ask this first</b><br>${esc(r[4])}</div><div class="actions"><a class="button primary" href="tracts.html${r[5]?'#'+r[5]:'#research-register'}">${r[5]?'Open the reviewed example':'Find the draft leads'} →</a><a class="button" href="deep-dive.html">Explore technical criteria →</a></div>`;document.querySelectorAll('[data-region-index]').forEach(b=>b.setAttribute('aria-pressed',String(+b.dataset.regionIndex===i)))}document.querySelectorAll('[data-region-index]').forEach(b=>b.onclick=()=>show(+b.dataset.regionIndex));show(0)}
if(el('economics')){
function sbNum(id){const x=el(id);if(!x)return null;const v=parseFloat(x.value);return (isNaN(v)||v<0)?null:v}
function sbMoney(v){return '$'+v.toFixed(1)+'M'}
function sbCalc(){
const mw=sbNum('sb-mw'),lat=sbNum('sb-lateral'),fb=sbNum('sb-fiber');
const req=mw==null?null:Math.round(mw*9);
if(el('sb-gasreq'))el('sb-gasreq').textContent=req==null?'\u2014':req;
const out={};
['a','b'].forEach(p=>{
const land=sbNum(p+'-land'),flood=sbNum(p+'-flood'),gmi=sbNum(p+'-gasmi'),gmcf=sbNum(p+'-gasmcf'),power=sbNum(p+'-power'),fmi=sbNum(p+'-fibermi'),civil=sbNum(p+'-civil');
const fdiv=el(p+'-fiberdiv'),wfirm=el(p+'-waterfirm');
if([mw,lat,fb,land,flood,gmi,gmcf,power,fmi,civil].indexOf(null)>=0||!fdiv||!wfirm){out[p]=null;return}
const gasCost=gmi*lat+0.8,fibCost=fmi*fb,total=land+gasCost+power+fibCost+civil;
out[p]={land:land,gasCost:gasCost,power:power,fibCost:fibCost,civil:civil,total:total,perMw:total/mw,hurdles:[
{ok:flood<=10,label:'Floodplain',detail:flood+'%'+(flood<=10?' \u2014 within 10% screen':' \u2014 exceeds 10% screen')},
{ok:gmcf>=req,label:'Gas deliverability',detail:gmcf+' vs '+req+' MCF/day required'+(gmcf>=req?'':' \u2014 shortfall '+(req-gmcf))},
{ok:fdiv.checked,label:'Fiber diversity',detail:fdiv.checked?'two diverse paths':'single path'},
{ok:wfirm.checked,label:'Water supply',detail:wfirm.checked?'firm supply secured':'no firm supply'}]}});
if(out.a==null||out.b==null){el('cost-insight').textContent='Enter non-negative amounts for every input.';return}
['a','b'].forEach(p=>{const r=out[p];
el(p+'-gascost').textContent=sbMoney(r.gasCost);
el(p+'-fibercost').textContent=sbMoney(r.fibCost);
el(p+'-total').textContent=sbMoney(r.total);
el(p+'-permw').textContent='$'+Math.round(r.perMw*1000)+'k';
el(p+'-hurdles').innerHTML='<h4>Engineering hurdles</h4>'+r.hurdles.map(hh=>'<div class="hurdle '+(hh.ok?'pass':'flag')+'"><span>'+(hh.ok?'\u2713':'!')+'</span><div><b>'+hh.label+'</b><br><small>'+esc(hh.detail)+'</small></div></div>').join('')});
const max=Math.max(out.a.total,out.b.total,0.1);
const segs=[['Land','#9ce9ec','land'],['Gas connection','#e6bc86','gasCost'],['Grid interconnection','#487e9b','power'],['Fiber','#7fd4a8','fibCost'],['Civil + water','#b48ce6','civil']];
el('costbars').innerHTML=['a','b'].map(p=>{const r=out[p];
return '<div class="barrow"><strong>Scenario '+p.toUpperCase()+' \u00b7 '+sbMoney(r.total)+'</strong><div class="costbar" role="img" aria-label="Scenario '+p.toUpperCase()+' enabling cost '+sbMoney(r.total)+'" style="width:'+(r.total/max*100)+'%">'+
segs.map(s=>'<span title="'+s[0]+': '+sbMoney(r[s[2]])+'" style="width:'+(r.total?r[s[2]]/r.total*100:0)+'%;background:'+s[1]+'"></span>').join('')+'</div></div>'}).join('')+
'<small>'+segs.map(s=>'<span style="color:'+s[1]+'">\u25a0</span> '+s[0]).join(' \u00b7 ')+'</small>';
const fa=out.a.hurdles.filter(hh=>!hh.ok).length,fb2=out.b.hurdles.filter(hh=>!hh.ok).length;
const win=out.a.total<=out.b.total?'A':'B',d=Math.abs(out.a.total-out.b.total).toFixed(1);
el('cost-insight').textContent='Scenario '+win+' is $'+d+'M lower on enabling cost'+
(fa===0&&fb2===0?', and both clear all four hurdles.':'. Hurdles flagged \u2014 A: '+fa+', B: '+fb2+'. A flagged hurdle needs redesign or mitigation; cost alone does not clear it.')}
document.querySelectorAll('#economics input').forEach(x=>{x.oninput=sbCalc;x.onchange=sbCalc});
sbCalc()}
if(el('lead-register')){const reviewed={T01:'calvert',T08:'jarrell',T11:'crockett',T19:'delrio'};function render(){const q=el('lead-search').value.toLowerCase();let rows=RESEARCH_LEADS.filter(t=>`${t.name} ${t.loc} ${t.question}`.toLowerCase().includes(q));el('lead-count').textContent=`${rows.length} of 21 original research leads`;el('lead-register').innerHTML=rows.length?rows.map(t=>`<details class="lead-entry"><summary><span class="eyebrow" style="margin:0">${esc(t.id)}</span><span>${esc(t.name)}</span><span class="draft">${reviewed[t.id]?'Reviewed profile available':'Draft lead · status unverified'}</span></summary><p>${esc(t.loc)} · ${t.acres.toLocaleString()} gross acres reported in the draft.</p><p><b>Draft rationale — not independently verified:</b> ${esc(t.fit)}</p><p><b>Draft concerns — recheck before relying:</b> ${esc(t.cav)}</p><p><b>Question carried forward:</b> ${esc(t.question)}</p><div class="sourcebox"><a href="${esc(t.url)}" target="_blank" rel="noopener noreferrer">Open the draft’s source link ↗</a><p>Use this lead to request current availability, parcel identity and supporting documents. The linked listing or article may have changed; this register does not verify its present claims.</p></div><div class="actions">${reviewed[t.id]?`<a class="button primary" href="#${reviewed[t.id]}" data-profile="${reviewed[t.id]}">Read the reviewed profile →</a>`:''}<a class="button" href="sources.html#roadmap">Plan the verification →</a></div></details>`).join(''):'<p>No draft leads match that search.</p>';document.querySelectorAll('[data-profile]').forEach(a=>a.onclick=()=>reveal(a.dataset.profile))};el('lead-search').oninput=render;render()}
function reveal(id){if(!el('tracts'))return;el('status').value='all';el('region').value='all';el('search').value='';el('status').dispatchEvent(new Event('change'));requestAnimationFrame(()=>el(id)?.scrollIntoView({block:'start'}))}
if(el('tracts')){function hash(){let id=location.hash.slice(1);if(['jarrell','delrio','abilene','crockett','clifton','calvert'].includes(id))reveal(id)}window.addEventListener('hashchange',hash);hash()}
})();

if(document.getElementById('stories-next')){const rail=document.querySelector('.story-rail');document.getElementById('stories-next').onclick=()=>rail.scrollBy({left:rail.clientWidth*.7,behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'auto':'smooth'});document.getElementById('stories-prev').onclick=()=>rail.scrollBy({left:-rail.clientWidth*.7,behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'auto':'smooth'});}
