/* Reusable HTML chronicle renderer. Pagination changes paper layout, never canon. */
(() => {
 const shell=document.querySelector('.reader-shell');if(!shell)return;
 const registry=window.AvarisChronicles,params=new URLSearchParams(location.search);
 const legend=registry.legends.find(x=>x.id===params.get('legend'))||registry.legends[0];
 const book=shell.querySelector('.chronicle-book'),stage=shell.querySelector('.book-stage'),coverStage=shell.querySelector('.cover-stage');
 const leaves=[...book.querySelectorAll('.book-leaf')],previous=shell.querySelector('.reader-prev'),next=shell.querySelector('.reader-next'),progress=shell.querySelector('.reader-progress');
 const closeButton=shell.querySelector('.reader-close');
 const expand=shell.querySelector('.reader-expand'),motion=matchMedia('(prefers-reduced-motion: reduce)');
 const t=(key,args)=>window.AvarisI18n.t(key,args),source=key=>t(key);
 let pages=[],index=0,step=1,turning=false,anchor=null,resizeTimer,openingTimer,queued=false;
 const initialPage=Math.max(0,(parseInt(params.get('page'),10)||1)-1);
 const initialAnchor=params.get('at'),initialPlate=params.get('plate');
 function heading(){const h=document.createElement('h2');h.className='chapter-heading';const n=document.createElement('span');n.className='chapter-number';n.textContent=legend.chapter;const title=document.createElement('span');title.className='chapter-title';title.textContent=t(legend.titleKey);h.append(n,title);return h;}
 function illustration(id,scale){
  const a=legend.illustrations.find(x=>x.id===id);if(!a)return document.createElement('span');
  const f=document.createElement('figure');f.className='manuscript-illustration '+scale;f.dataset.art=id;
  const img=document.createElement('img');img.src=a.src;img.alt=a.altKey?t(a.altKey):'';img.loading='eager';img.decoding='async';f.append(img);return f;
 }
 function paragraph(group,dropcap=false){
  const p=document.createElement('p');p.className='paragraph';
  if(group[0]?.beat===4)p.classList.add('seven-line');
  if(group[0]?.beat===21)p.classList.add('creed');if(group[0]?.beat===23)p.classList.add('law');
  if(group[0]?.start>0)p.classList.add('continuation');else if(dropcap)p.classList.add('dropcap');
  group.forEach((part,i)=>{if(i)p.append(document.createTextNode(' '));const span=document.createElement('span');span.dataset.sourceKey=part.key;span.dataset.start=part.start;span.dataset.end=part.end;span.textContent=source(part.key).slice(part.start,part.end);p.append(span);});return p;
 }
 function composition(page){
  const root=document.createElement('div');root.className='page-composition';
  const count=page.layout==='multi-editorial'?2:1;
  if(!['plate','panorama'].includes(page.layout))for(let i=0;i<count;i++){
   const slot=document.createElement('div');slot.className='prose-region';slot.dataset.slot=i;
   if(page.heading&&i===0)slot.append(heading());
   (page.groups?.[i]||[]).forEach((group,j)=>slot.append(paragraph(group,page.dropcap&&i===0&&j===0)));root.append(slot);
  }
  if(page.art&&page.layout!=='panorama'){
   const scale=page.layout==='opening'?'HERO_SPREAD_ART':page.layout==='closure'?'SMALL_ORNAMENT':['portrait-pair','plate'].includes(page.layout)?'LARGE_VERTICAL_ART':'LARGE_HORIZONTAL_ART';root.append(illustration(page.art,scale));
  }
  if(page.secondaryArt)root.append(illustration(page.secondaryArt,'SECONDARY_HORIZONTAL_ART'));
  return root;
 }
 function sameAnchor(part,a){return part.key===a?.key&&(a.fraction??0)>=part.start/part.length&&(a.fraction??0)<part.end/part.length;}
 function currentAnchor(){
  const page=pages[index];if(page?.plate)return{key:page.anchorKey,fraction:0,plate:page.plate};
  const part=page?.find(x=>x.key)||pages[index+1]?.find(x=>x.key);return part?{key:part.key,fraction:part.start/part.length}:null;
 }
 function groupsFor(beats){
  const groups=[];for(const beat of beats){const parts=legend.units.filter(u=>u.beat===beat).map(u=>({...u,start:0,end:source(u.key).length,length:source(u.key).length}));if(beat===4)groups.push(...parts.map(p=>[p]));else if(parts.length)groups.push(parts);}return groups;
 }
 function splitGroup(group,limit){
  let used=0;const head=[],tail=[];for(const part of group){const separator=used?1:0,len=part.end-part.start;if(used+separator+len<=limit){head.push({...part});used+=separator+len;continue;}
   const available=Math.max(0,limit-used-separator);if(available>0){head.push({...part,end:part.start+available});tail.push({...part,start:part.start+available});}else tail.push({...part});used+=separator+len;
  }return[head,tail];
 }
 function pagination(){
  const sample=leaves[0].querySelector('.leaf-body'),r=sample.getBoundingClientRect();if(r.width<20||r.height<40)return;
  const measure=document.createElement('div');measure.className='leaf-body reader-measure';Object.assign(measure.style,{width:r.width+'px',height:r.height+'px'});shell.append(measure);const result=[];
  function makePage(spec,beatId,anchorKey){const page=[];Object.assign(page,spec,{beatId,anchorKey,groups:[]});if(['plate','panorama'].includes(page.layout))page.plate=beatId+':'+(page.art||page.layout);return page;}
  function fill(page,queue){
   measure.dataset.layout=page.layout;measure.replaceChildren(composition(page));const slots=[...measure.querySelectorAll('.prose-region')];
   for(let i=0;i<slots.length;i++){
    const slot=slots[i],filled=[];page.groups[i]=filled;
    const fits=group=>{const p=paragraph(group,page.dropcap&&i===0&&filled.length===0);slot.append(p);const ok=slot.scrollHeight<=slot.clientHeight+1;if(!ok)p.remove();return ok;};
    while(queue.length){const group=queue[0];if(fits(group)){filled.push(queue.shift());continue;}
     // Keep a new paragraph whole when moving to the next curated prose slot.
     if(filled.length)break;
     const text=group.map(p=>source(p.key).slice(p.start,p.end)).join(' '),ends=[...text.matchAll(/\s+/g)].map(m=>m.index+m[0].length);ends.push(text.length);
     let low=0,high=ends.length-1,best=-1;
     while(low<=high){const mid=(low+high)>>1,[prefix]=splitGroup(group,ends[mid]);const trial=paragraph(prefix,page.dropcap&&i===0&&filled.length===0);slot.append(trial);const ok=slot.scrollHeight<=slot.clientHeight+1;trial.remove();if(ok){best=mid;low=mid+1;}else high=mid-1;}
     if(best<0)break;
     const [head,tail]=splitGroup(group,ends[best]);filled.push(head);slot.append(paragraph(head,page.dropcap&&i===0&&filled.length===1));queue.shift();if(tail.length)queue.unshift(tail);break;
    }
   }
   page.push(...page.groups.flat(2));
  }
  for(const spread of legend.spreads){
   const anchorKey=legend.units.find(u=>u.beat===spread.pages.find(p=>p.beats.length)?.beats[0])?.key;
   const specs=spread.pages.flatMap(spec=>{
    if(step===2)return[spec];
    if(spec.layout==='panorama')return[];
    if(spec.layout==='opening')return[{...spec,art:spread.cross}];
    if(spec.layout==='portrait-pair')return[{...spec,layout:'prose',art:null},{layout:'plate',beats:[],art:spec.art}];
    if(spec.layout==='multi-editorial')return[{...spec,layout:'horizontal',beats:[15],secondaryArt:null},{layout:'horizontal',beats:[16],art:spec.secondaryArt,secondaryArt:null,dropcap:false}];
    return[spec];
   });
   for(const [n,spec]of specs.entries()){
    const page=makePage(spec,spread.id,anchorKey);if(step===2&&spread.cross)page.cross=spread.cross;
    const queue=groupsFor(spec.beats);fill(page,queue);result.push(page);
    let continuations=0;
    while(queue.length){const continuation=makePage({layout:'prose',beats:[]},spread.id,anchorKey);fill(continuation,queue);if(!continuation.length)throw new Error('Reading area too short for fixed prose');result.push(continuation);if(++continuations>40)throw new Error('Unexpected chronicle overflow');}
   }
   // Each narrative spread begins on a verso; overflow never displaces the next beat.
   if(step===2&&result.length%2)result.push(makePage({layout:'prose',beats:[]},spread.id,anchorKey));
  }
  measure.remove();pages=result;
 }
 function decorate(leaf,page){
  leaf.querySelectorAll(':scope > .print-frame,:scope > .page-corner').forEach(x=>x.remove());leaf.dataset.worn='false';leaf.dataset.ending=String(page.layout==='closure');
  const frame=document.createElement('span');frame.className='print-frame';frame.setAttribute('aria-hidden','true');const corner=document.createElement('span');corner.className='page-corner';corner.setAttribute('aria-hidden','true');leaf.append(frame,corner);
 }
 function updateURL(){const url=new URL(location.href);url.searchParams.delete('entry');url.searchParams.set('legend',legend.id);url.searchParams.set('page',index+1);const a=anchor||currentAnchor();if(a)url.searchParams.set('at',a.key);if(a?.plate)url.searchParams.set('plate',a.plate);else url.searchParams.delete('plate');history.replaceState({legend:legend.id,page:index+1},'',url);}
 function render(update=true){
  index=Math.max(0,Math.min(index,pages.length-1));if(step===2)index-=index%2;
  for(let i=0;i<leaves.length;i++){
   const page=pages[index+i]||Object.assign([],{layout:'prose'}),leaf=leaves[i],body=leaf.querySelector('.leaf-body');body.dataset.layout=page.layout;body.replaceChildren(composition(page));leaf.querySelector('.leaf-folio').textContent=pages[index+i]?index+i+1:'';
   leaf.dataset.page=pages[index+i]?String(index+i+1):'';leaf.dataset.beat=page.beatId||'';leaf.dataset.frontispiece='false';leaf.classList.toggle('turnable',index+step<pages.length&&i===step-1);
   decorate(leaf,page);
  }
  book.querySelector(':scope > .cross-spread-art')?.remove();
  if(step===2&&pages[index]?.cross){const fig=illustration(pages[index].cross,'HERO_SPREAD_ART');fig.classList.add('cross-spread-art');book.append(fig);}
  previous.disabled=index===0;next.disabled=index+step>=pages.length;
  const shown=step===2&&index+1<pages.length?`${index+1}–${index+2}`:String(index+1);progress.textContent=t('chronicle.progress',{pages:shown,total:pages.length});
  const toc=shell.querySelector('.reader-contents nav');toc.replaceChildren(...registry.legends.map(item=>{const a=document.createElement('a');const url=new URL(location.href);url.search='';url.searchParams.set('legend',item.id);url.searchParams.set('page',1);a.href=url.href;a.textContent=item.chapterKey?t(item.chapterKey):item.chapter+' — '+t(item.titleKey);return a;}));
  leaves[1].querySelector('.leaf-running').textContent=t(legend.titleKey);
  document.title=t(registry.book.titleKey)+' — '+t(legend.titleKey);
  book.setAttribute('aria-label',t('chronicle.surface'));coverStage.querySelector('button').setAttribute('aria-label',t('chronicle.open'));
  shell.querySelector('.reader-contents nav').setAttribute('aria-label',t('chronicle.contents'));
  if(update&&shell.dataset.state==='reading')updateURL();
 }
 function layout(preserve=true){
  if(turning){queued=true;return;}
  const before=preserve?(anchor||currentAnchor()):null;
  step=getComputedStyle(leaves[1]).display==='none'?1:2;shell.dataset.mode=step===2?'spread':'single';pagination();
  if(before){const found=pages.findIndex(page=>before.plate?page.plate===before.plate:page.some(part=>sameAnchor(part,before)));if(found>=0)index=found;}
  else if(initialAnchor){const found=pages.findIndex(page=>initialPlate?page.plate===initialPlate:page.some(part=>part.key===initialAnchor));index=found>=0?found:initialPage;}
  else index=initialPage;
  anchor=before||(initialAnchor?{key:initialAnchor,fraction:0,plate:initialPlate}:currentAnchor());render(shell.dataset.state==='reading');
 }
 function turn(direction){
  if(turning||shell.dataset.state!=='reading'||(direction<0?previous.disabled:next.disabled))return;
  anchor=null;const destination=index+direction*step;
  shell.dispatchEvent(new CustomEvent('avaris:chronicle-turn',{bubbles:true,detail:{legend:legend.id,page:destination+1,soundPreference:readSoundPreference()}}));
  if(motion.matches){index=destination;render();return;}
  turning=true;const paper=document.createElement('div');paper.className='paper-turn '+(direction>0?'forward':'backward');paper.setAttribute('aria-hidden','true');book.append(paper);
  // Illustrations are attached to the outgoing paper plane; HTML ink stays static.
  const outgoing=leaves[direction>0?step-1:0],paperBox=outgoing.getBoundingClientRect();
  [...outgoing.querySelectorAll('.manuscript-illustration'),...book.querySelectorAll(':scope > .cross-spread-art')].forEach(fig=>{const copy=fig.cloneNode(true),r=fig.getBoundingClientRect();copy.classList.add('turn-illustration');Object.assign(copy.style,{left:(r.left-paperBox.left)+'px',top:(r.top-paperBox.top)+'px',right:'auto',width:r.width+'px',height:r.height+'px'});copy.querySelectorAll('img').forEach(img=>img.alt='');paper.append(copy);});
  setTimeout(()=>{index=destination;render();},245);
  setTimeout(()=>{paper.remove();turning=false;if(queued){queued=false;layout();}},560);
 }
 function readSoundPreference(){try{return localStorage.getItem('avaris.map.sound')==='on';}catch{return false;}}
 function open(){
  if(shell.dataset.state!=='cover')return;
  shell.dataset.state=motion.matches?'reading':'opening';stage.removeAttribute('inert');stage.setAttribute('aria-hidden','false');
  shell.dispatchEvent(new CustomEvent('avaris:chronicle-open',{bubbles:true,detail:{legend:legend.id,soundPreference:readSoundPreference()}}));
  const done=()=>{shell.dataset.state='reading';coverStage.hidden=true;coverStage.setAttribute('inert','');render();document.querySelector('#reading').focus({preventScroll:true});};
  if(motion.matches)done();else openingTimer=setTimeout(done,850);
 }
 function close(){
  if(turning||shell.dataset.state!=='reading')return;
  updateURL();const url=new URL(location.href);url.searchParams.set('entry','cover');history.replaceState(null,'',url);
  shell.dataset.state=motion.matches?'cover':'closing';stage.setAttribute('inert','');stage.setAttribute('aria-hidden','true');coverStage.hidden=false;coverStage.removeAttribute('inert');
  const done=()=>{shell.dataset.state='cover';coverStage.querySelector('button').focus({preventScroll:true});};if(motion.matches)done();else openingTimer=setTimeout(done,700);
 }
 closeButton.addEventListener('click',close);
 previous.addEventListener('click',()=>turn(-1));next.addEventListener('click',()=>turn(1));coverStage.querySelector('button').addEventListener('click',open);
 book.addEventListener('click',event=>{const leaf=event.target.closest('.book-leaf');if(!leaf||!getSelection()?.isCollapsed)return;const r=leaf.getBoundingClientRect();if(event.clientX>r.right-44&&event.clientY>r.bottom-44)turn(1);});
 document.addEventListener('keydown',event=>{
  if(event.key==='Escape'&&shell.dataset.expanded==='true'){if(document.fullscreenElement)document.exitFullscreen().catch(()=>{});else{shell.dataset.expanded='false';syncExpand();layout();}return;}
  if(event.defaultPrevented||event.altKey||event.ctrlKey||event.metaKey||shell.querySelector('.reader-contents').open||event.target.closest('input,textarea,select,[contenteditable=true]')||!getSelection()?.isCollapsed)return;
  if(event.key==='ArrowRight'||event.key==='ArrowLeft'){event.preventDefault();turn(event.key==='ArrowRight'?1:-1);}
 });
 let touchStart=null;
 book.addEventListener('touchstart',e=>{if(e.touches.length!==1||step!==1){touchStart=null;return;}const p=e.touches[0];if(p.clientX<28||p.clientX>innerWidth-28)return;touchStart={x:p.clientX,y:p.clientY};},{passive:true});
 book.addEventListener('touchend',e=>{if(!touchStart||!getSelection()?.isCollapsed){touchStart=null;return;}const p=e.changedTouches[0],dx=p.clientX-touchStart.x,dy=p.clientY-touchStart.y;touchStart=null;if(Math.abs(dx)>70&&Math.abs(dx)>Math.abs(dy)*1.5)turn(dx<0?1:-1);},{passive:true});
 book.addEventListener('touchcancel',()=>{touchStart=null;},{passive:true});
 function syncExpand(){const full=Boolean(document.fullscreenElement),expanded=shell.dataset.expanded==='true';const key=full?'chronicle.exitFullscreen':expanded?'chronicle.collapse':'chronicle.expand';expand.setAttribute('aria-label',t(key));expand.title=t(key);expand.setAttribute('aria-pressed',String(full||expanded));expand.querySelector('span').textContent=t(key);}
 expand.addEventListener('click',async()=>{
  if(document.fullscreenElement){await document.exitFullscreen().catch(()=>{});shell.dataset.expanded='false';}
  else if(shell.dataset.expanded==='true')shell.dataset.expanded='false';
  else {shell.dataset.expanded='true';if(shell.requestFullscreen)await shell.requestFullscreen().catch(()=>{});}
  syncExpand();layout();
 });
 document.addEventListener('fullscreenchange',()=>{if(!document.fullscreenElement)shell.dataset.expanded='false';syncExpand();layout();});
 document.addEventListener('avaris:languagechange',()=>{anchor=anchor||currentAnchor();layout();syncExpand();});
 const observer=new ResizeObserver(()=>{clearTimeout(resizeTimer);resizeTimer=setTimeout(()=>layout(),100);});observer.observe(stage);
 addEventListener('popstate',()=>{const p=new URLSearchParams(location.search);index=Math.max(0,(parseInt(p.get('page'),10)||1)-1);render(false);});
 addEventListener('pagehide',()=>{clearTimeout(openingTimer);clearTimeout(resizeTimer);observer.disconnect();});
 if(params.get('entry')==='cover'){
  shell.dataset.state='cover';coverStage.hidden=false;stage.setAttribute('inert','');stage.setAttribute('aria-hidden','true');
 }
 layout(false);syncExpand();
})();
