/* Replay saved solver results. No physics or new optimization runs in this UI. */
(() => {
  'use strict';
  const $ = id => document.getElementById(id);
  const play=$('search-play'),slider=$('search-step'),svg=$('search-pattern');
  let rows=[],index=0,timer=null;
  const NS='http://www.w3.org/2000/svg';
  function element(tag,attrs,text){const e=document.createElementNS(NS,tag);Object.entries(attrs||{}).forEach(([k,v])=>e.setAttribute(k,v));if(text!==undefined)e.textContent=text;return e;}
  function stop(){clearInterval(timer);timer=null;play.textContent='Play search replay';}
  function accepted(r){return r.passed_coarse===true&&r.passed_fine===true&&r.passed_recovery===true;}
  function draw(r){
    svg.replaceChildren();const s=r.spec,a=s.side_and_radius_mm,u=s.flat_shift_mm,h=s.flat_rise_mm;
    const final=r.stage==='One-piece Letter verification';
    const overlap=s.overlap_triangles||{};
    const full=Object.keys(overlap).length>0;
    const end=s.body_pieces===2?3:6;
    const pts=full?[[-a,0],[end*a,0],[end*a+u,h],[u,h]]:[[0,0],[end*a,0],[end*a+u,h],[u,h]];
    const ang=final?Math.PI/6:0;
    const rot=p=>[Math.cos(ang)*p[0]-Math.sin(ang)*p[1],Math.sin(ang)*p[0]+Math.cos(ang)*p[1]];
    const extent=pts.concat(Object.values(s.tabs||{}).flat()).map(rot);
    const min=[Math.min(...extent.map(p=>p[0])),Math.min(...extent.map(p=>p[1]))];
    const max=[Math.max(...extent.map(p=>p[0])),Math.max(...extent.map(p=>p[1]))];
    const scale=final?1.37:Math.min(646/(max[0]-min[0]),225/(max[1]-min[1]));
    const xy=p=>{const q=rot(p);return [360+(q[0]-(max[0]+min[0])/2)*scale,183-(q[1]-(max[1]+min[1])/2)*scale];};
    if(final){svg.append(element('rect',{x:360-279.4*scale/2,y:183-215.9*scale/2,width:279.4*scale,height:215.9*scale,fill:'white',stroke:'#bccbd2'}));svg.append(element('text',{x:360,y:22,'text-anchor':'middle',fill:'#506773','font-size':14},'US Letter · landscape · 30° placement'));}
    const path=(points,attrs)=>svg.append(element('polyline',{points:points.map(xy).map(p=>p.join(',')).join(' '),fill:'none',...attrs}));
    path(pts.concat([pts[0]]),{fill:'#f0f6f4',stroke:'#132d3e','stroke-width':1.8});
    if(full)path([[-a,0],[0,0],[u,h],[-a,0]],{fill:'#c9e8df',stroke:'#007769','stroke-width':1});
    for(let j=0;j<end;j++){
      path([[j*a,0],[(j+1)*a+u,h]],{stroke:'#2870b7','stroke-dasharray':'7 5','stroke-width':1.6});
      if(j>0||full)path([[j*a,0],[j*a+u,h]],{stroke:'#c83851','stroke-width':1.6});
      if(j>0 && (s.relief_cut_fraction_of_mountain||0)>0){
        const b=[j*a,0],t=[j*a+u,h],f=s.relief_cut_fraction_of_mountain,w=(s.slot_width_mm||0)/2;
        const norm=Math.hypot(u,h),c=[j*a+u/2,h/2];
        path([[b[0]+u*(1-f)/2,h*(1-f)/2],[c[0]-w*h/norm,c[1]+w*u/norm],[b[0]+u*(1+f)/2,h*(1+f)/2],[c[0]+w*h/norm,c[1]-w*u/norm],[b[0]+u*(1-f)/2,h*(1-f)/2]],{fill:'white',stroke:'#132d3e','stroke-width':1.2});
      }
    }
    Object.values(s.tabs||{}).forEach(t=>path(t.concat([t[0]]),{fill:'#c9e8df',stroke:'#132d3e','stroke-width':1.1}));
    svg.append(element('text',{x:28,y:341,fill:'#506773','font-size':14},'Red: mountain    Blue: valley    Black: boundary / cut    Green: overlap'));
    $('search-pattern-note').textContent=final?'Final body placement on US Letter; one full-facet overlap.':s.body_pieces===2?'One of two body pieces is shown. Display scale changes between candidates.':r.outline_only?'Outline and relief geometry reconstructed from recorded parameters; setup failed before tab geometry was archived.':'Recorded candidate geometry. Display scales vary; use the printable PDF for fabrication.';
  }
  function render(){
    const r=rows[index],s=r.spec;
    slider.value=String(index);$('search-counter').textContent=`Checkpoint ${index+1} / ${rows.length}`;
    $('search-stage').textContent=r.stage;
    const status=accepted(r)?'Accepted within model':r.passed_coarse?'Rejected at recovery':'Rejected at initial screen';
    $('search-verdict').textContent=status;$('search-verdict').className=accepted(r)?'pass':'fail';
    const parameters=[['Candidate ID',String(r.id).padStart(3,'0')],['λ / rim edge',`${s.lambda.toFixed(3)} / ${s.side_and_radius_mm.toFixed(0)} mm`],['Flat rise / shift',`${s.flat_rise_mm.toFixed(2)} / ${s.flat_shift_mm.toFixed(2)} mm`],['Relief / slot width',`${((s.relief_cut_fraction_of_mountain||0)*100).toFixed(1)}% / ${(s.slot_width_mm||0).toFixed(2)} mm`]];
    const dl=$('search-parameters');dl.replaceChildren();parameters.forEach(([k,v])=>{const row=document.createElement('div'),dt=document.createElement('dt'),dd=document.createElement('dd');dt.textContent=k;dd.textContent=v;row.append(dt,dd);dl.append(row);});
    $('search-reason').textContent=r.reason;
    const checks=$('search-checks');checks.replaceChildren();[['Coarse screen',r.passed_coarse],['Refined path',r.passed_fine],['Release + recovery',r.passed_recovery]].forEach(([name,ok])=>{const e=document.createElement('span');e.textContent=`${name}: ${ok===true?'pass':ok===false?'fail':'not run'}`;e.className=ok===true?'pass':ok===false?'fail':'pending';checks.append(e);});
    $('search-prev').disabled=index===0;$('search-next').disabled=index===rows.length-1;
    [...$('search-trace').children].forEach((b,i)=>{b.className=`trace-step ${accepted(rows[i])?'pass':'fail'} ${i===index?'current':''}`;b.setAttribute('aria-current',i===index?'step':'false');});
    draw(r);
  }
  fetch('assets/simulations/search-history.json').then(r=>{if(!r.ok)throw new Error('HTTP '+r.status);return r.json();}).then(data=>{
    rows=data.rows;slider.max=String(rows.length-1);slider.disabled=false;play.disabled=false;
    rows.forEach((r,i)=>{const b=document.createElement('button');b.type='button';b.textContent=String(i+1);b.title=`${r.stage}; candidate ${r.id}`;b.setAttribute('aria-label',`Checkpoint ${i+1}: ${r.stage}, candidate ${r.id}`);b.addEventListener('click',()=>{stop();index=i;render();});$('search-trace').append(b);});
    play.addEventListener('click',()=>{if(timer){stop();return;}if(index===rows.length-1)index=0;render();play.textContent='Pause replay';timer=setInterval(()=>{if(index<rows.length-1){index++;render();}else stop();},1800);});
    $('search-prev').addEventListener('click',()=>{stop();index=Math.max(0,index-1);render();});
    $('search-next').addEventListener('click',()=>{stop();index=Math.min(rows.length-1,index+1);render();});
    slider.addEventListener('input',()=>{stop();index=Number(slider.value);render();});render();
  }).catch(()=>{$('search-counter').textContent='Replay unavailable. Download the source records below.';});
  document.addEventListener('visibilitychange',()=>{if(document.hidden)stop();});
  document.querySelectorAll('#simulations video').forEach(v=>v.addEventListener('play',()=>document.querySelectorAll('#simulations video').forEach(other=>{if(other!==v)other.pause();})));
})();
