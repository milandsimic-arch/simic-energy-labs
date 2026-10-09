'use strict';
// Preserve incoming links to sections now located in the detailed briefing.
const legacySections = new Set(['lab','founder','ip','model','investors','partners','talent','national','labnotes']);
function routeLegacyAnchor() { const id = location.hash.slice(1); if (legacySections.has(id)) location.replace('research.html#' + id); }
routeLegacyAnchor();
window.addEventListener('hashchange', routeLegacyAnchor);
// Navigation remains usable at every viewport, including keyboard and touch.
const menuButton = document.querySelector('.menu-toggle');
const navigation = document.querySelector('#site-nav');
function closeMenu() { navigation.classList.remove('open'); menuButton.setAttribute('aria-expanded', 'false'); }
menuButton.addEventListener('click', () => { const open = navigation.classList.toggle('open'); menuButton.setAttribute('aria-expanded', String(open)); });
navigation.querySelectorAll('a').forEach(link => link.addEventListener('click', closeMenu));
document.addEventListener('keydown', event => { if (event.key === 'Escape' && navigation.classList.contains('open')) { closeMenu(); menuButton.focus(); } });
window.addEventListener('resize', () => { if (innerWidth > 850) closeMenu(); });
const steps = [
 ['Start with the real system.', 'Define the useful output, the customer’s problem, and the physical boundaries. Account for inputs, losses, operating conditions, and the performance that actually matters.', 'A bounded question and a measurable baseline.'],
 ['Make the operating envelope visible.', 'Map temperature, pressure, chemistry, field strength, and timescale. Separate established operating conditions from modeled possibilities and unresolved regions.', 'An envelope map with assumptions and unknowns.'],
 ['Look where disciplines meet.', 'Investigate mechanisms in adjacent fields. A useful transfer must retain its causal basis under the new conditions; a shared analogy is only a starting question.', 'Candidate mechanisms and their transfer conditions.'],
 ['Identify what sets the limit.', 'Examine the role of physical laws, materials, economics, and operating practice. Challenge each assumption while retaining the constraints the evidence supports.', 'A ranked set of constraints and failure modes.'],
 ['Choose the test that changes the decision.', 'Assess published evidence and prior work. Design a bounded investigation with a fair baseline, calibrated measurements, and explicit success and stop criteria.', 'A decisive experiment or a documented stop decision.'],
 ['Build a path to useful technology.', 'Route surviving work toward appropriate IP review, confidential know-how, further validation, and commercial development. Define the next milestone before expanding the commitment.', 'A development plan with evidence, rights, and milestones.']
];
document.querySelectorAll('[data-step]').forEach(button => button.addEventListener('click', () => {
 const index = Number(button.dataset.step);
 document.querySelectorAll('[data-step]').forEach(item => { const active = item === button; item.classList.toggle('active', active); item.setAttribute('aria-pressed', String(active)); });
 document.querySelector('#step-number').textContent = `${String(index + 1).padStart(2,'0')} / 06`;
 document.querySelector('#step-title').textContent = steps[index][0];
 document.querySelector('#step-copy').textContent = steps[index][1];
 document.querySelector('#step-output').textContent = `OUTPUT / ${steps[index][2]}`;
}));
// Original procedural concept art. No remote libraries, fabricated telemetry, or physical simulation claims.
(() => {
 const canvas = document.querySelector('#core');
 const ctx = canvas.getContext('2d');
 const control = document.querySelector('#motion-toggle');
 if (!ctx) { control.hidden = true; return; }
 const reduced = matchMedia('(prefers-reduced-motion: reduce)');
 let paused = reduced.matches, visible = true, frame = 0, last = 0, phase = 0, width = 0, height = 0;
 const points = [];
 for (let strand = 0; strand < 30; strand++) {
  const ring = [];
  for (let j = 0; j <= 150; j++) {
   const u = j / 150 * Math.PI * 2, v = strand / 30 * Math.PI * 2 + u * 3;
   const r = 1 + 0.265 * Math.cos(v);
   ring.push([r * Math.cos(u), r * Math.sin(u), .265 * Math.sin(v)]);
  }
  points.push(ring);
 }
 function project(p, rotation) {
  const x = p[0] * Math.cos(rotation) - p[1] * Math.sin(rotation);
  const y = p[0] * Math.sin(rotation) + p[1] * Math.cos(rotation);
  const yy = y * .57 - p[2] * .82, z = y * .82 + p[2] * .57;
  const tilt = -.57;
  const scale = Math.min(width * .355, height * .34) * (1 + z * .08);
  return [width * .51 + (x * Math.cos(tilt) - yy * Math.sin(tilt)) * scale, height * .5 + (x * Math.sin(tilt) + yy * Math.cos(tilt)) * scale, z];
 }
 function draw() {
  ctx.clearRect(0,0,width,height);
  const glow = ctx.createRadialGradient(width*.51,height*.5,0,width*.51,height*.5,width*.52);
  glow.addColorStop(0,'rgba(75,159,180,.10)'); glow.addColorStop(.5,'rgba(45,110,142,.09)'); glow.addColorStop(1,'rgba(0,0,0,0)');
  ctx.fillStyle=glow; ctx.fillRect(0,0,width,height);
  // Instrument-like guide rings and measured-looking ticks are purely decorative.
  for(let ring=0;ring<3;ring++) {
   ctx.beginPath();
   for(let j=0;j<=180;j++) { const u=j/180*Math.PI*2; const p=project([(1.53+ring*.10)*Math.cos(u),(1.53+ring*.10)*Math.sin(u),0],0); j?ctx.lineTo(p[0],p[1]):ctx.moveTo(p[0],p[1]); }
   ctx.strokeStyle=ring===1?'rgba(112,163,183,.22)':'rgba(112,163,183,.10)'; ctx.lineWidth=.7;ctx.setLineDash(ring===1?[2,8]:[]);ctx.stroke();ctx.setLineDash([]);
  }
  points.forEach((ring,index)=>{
   ctx.beginPath();ring.forEach((point,j)=>{const p=project(point,phase);j?ctx.lineTo(p[0],p[1]):ctx.moveTo(p[0],p[1]);});
   ctx.strokeStyle=`rgba(${index%5===0?'196,241,244':'93,192,216'},${.22+(index%5)*.065})`;ctx.lineWidth=index%5===0?1.15:.65;ctx.stroke();
  });
  for(let i=0;i<14;i++){
   const t=(phase*.75+i/14)*Math.PI*2, v=i*2.3;
   const p=project([(1+.265*Math.cos(v))*Math.cos(t),(1+.265*Math.cos(v))*Math.sin(t),.265*Math.sin(v)],phase);
   ctx.beginPath();ctx.arc(p[0],p[1],i%3===0?2:1.2,0,Math.PI*2);ctx.fillStyle='#c4f8fb';ctx.shadowColor='#82e0ed';ctx.shadowBlur=10;ctx.fill();ctx.shadowBlur=0;
  }
  canvas.parentElement.classList.add('rendered');
 }
 function syncControl(){control.setAttribute('aria-pressed',String(paused));control.textContent=paused?'Play motion ▷':'Pause motion Ⅱ';}
 function animate(time){frame=0;if(paused||!visible||document.hidden)return; if(last)phase+=Math.min(time-last,60)*.00009;last=time;draw();frame=requestAnimationFrame(animate);}
 function update(){if(frame)cancelAnimationFrame(frame);frame=0;last=0;if(!paused&&visible&&!document.hidden)frame=requestAnimationFrame(animate);}
 function resize(){const box=canvas.getBoundingClientRect();width=box.width;height=box.height;const dpr=Math.min(devicePixelRatio||1,2);canvas.width=Math.round(width*dpr);canvas.height=Math.round(height*dpr);ctx.setTransform(dpr,0,0,dpr,0,0);draw();}
 control.addEventListener('click',()=>{paused=!paused;syncControl();update();});
 reduced.addEventListener('change',()=>{paused=reduced.matches;syncControl();update();draw();});
 document.addEventListener('visibilitychange',update);
 if('IntersectionObserver' in window)new IntersectionObserver(entries=>{visible=entries[0].isIntersecting;update();},{threshold:.05}).observe(canvas);
 if('ResizeObserver' in window)new ResizeObserver(resize).observe(canvas);else window.addEventListener('resize',resize);
 resize();syncControl();update();
})();
