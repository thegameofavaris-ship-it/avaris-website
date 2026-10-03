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
 const initialAnchor=params.get('at');
 function heading(){const h=document.createElement('h2');h.className='chapter-heading';const n=document.createElement('span');n.className='chapter-number';n.textContent=legend.chapter;const title=document.createElement('span');title.className='chapter-title';title.textContent=t(legend.titleKey);h.append(n,title);return h;}
 function element(part){
  if(part.kind==='heading')return heading();
  if(part.kind==='illustration'){
   const a=part.asset,f=document.createElement('figure');f.className='manuscript-illustration';f.dataset.art=a.id;f.dataset.placement=a.placement==='outer-margin'&&step===1?'mobile-vignette':a.placement;f.style.setProperty('--art-height',a.height+'px');if(['settlement','seven-paths','inheritance','history-memory','converging-roads'].includes(a.id))f.dataset.composition='wrap';
   const img=document.createElement('img');img.src=a.src;img.alt=a.altKey?t(a.altKey):'';img.loading='lazy';img.decoding='async';img.width=a.crop?1600:1200;img.height=a.crop?640:(a.id==='settlement'?800:600);
   if(a.crop){const [x,y,w,h]=a.crop;f.dataset.cropped='true';const window=document.createElement('span');window.className='art-window';f.style.setProperty('--art-ratio',String(w/h*a.sourceAspect));img.style.width=(100/w)+'%';img.style.left=(-x/w*100)+'%';img.style.top=(-y/h*100)+'%';window.append(img);f.append(window);}else f.append(img);return f;
  }
  const p=document.createElement('p');p.className=[part.kind,part.emphasis||'',part.beatStart?'beat-start':'',part.sequenceStart?'sequence-start':''].filter(Boolean).join(' ');
  p.dataset.sourceKey=part.key;p.dataset.start=part.start;p.dataset.end=part.end;
  if(legend.treatments?.[part.key]){p.classList.add('manuscript-treatment');p.dataset.treatment=legend.treatments[part.key].slot;}
  // Exact substring, including punctuation and whitespace. No rewriting on page breaks.
  p.textContent=source(part.key).slice(part.start,part.end);return p;
 }
 function units(){
  const all=[{kind:'heading'}];let prior=null;
  for(const u of legend.units){
   for(const asset of legend.illustrations||[]){if(asset.anchor===u.key&&(['half-page','full-page'].includes(asset.placement)||(asset.placement==='outer-margin'&&step===1))&&asset.src)all.push({kind:'illustration',asset});}
   all.push({...u,start:0,end:source(u.key).length,length:source(u.key).length,beatStart:prior!==null&&prior!==u.beat&&[7,12,16,20].includes(u.beat),sequenceStart:u.kind==='sequence'&&prior!==u.beat});prior=u.beat;
  }return all;
 }
 function sameAnchor(part,a){return part.key===a?.key&&(a.fraction??0)>=part.start/part.length&&(a.fraction??0)<(part.end/part.length);}
 function currentAnchor(){const part=pages[index]?.find(x=>x.key)||pages[index+1]?.find(x=>x.key);return part?{key:part.key,fraction:part.start/part.length}:null;}
 function fit(measure,part){const node=element(part);measure.append(node);const fits=measure.scrollHeight<=measure.clientHeight+1;if(!fits)node.remove();return fits;}
 function pagination(){
  const sample=leaves[0].querySelector('.leaf-body'),rect=sample.getBoundingClientRect();if(rect.width<20||rect.height<40)return;
  const measure=document.createElement('div');measure.className='leaf-body reader-measure';measure.style.width=rect.width+'px';measure.style.height=rect.height+'px';measure.style.fontSize=getComputedStyle(sample).fontSize;measure.style.lineHeight=getComputedStyle(sample).lineHeight;shell.append(measure);
  const queue=units(),result=[];let page=[];
  const finish=()=>{if(page.length)result.push(page);page=[];measure.replaceChildren();};
  const defer=part=>{const last=page.at(-1),art=last?.kind==='illustration'&&last.asset.anchor===part.key?page.pop():null;finish();if(art)queue.unshift(art,part);else queue.unshift(part);};
  while(queue.length){const part=queue.shift();
   // Keep an illustration with the beginning of its passage whenever both fit.
   if(part.kind==='illustration'&&page.length&&queue[0]?.key){const trial=measure.cloneNode(false);shell.append(trial);trial.replaceChildren(element(part),element(queue[0]));const fitsEmpty=trial.scrollHeight<=trial.clientHeight+1;trial.replaceChildren(...page.map(element),element(part),element(queue[0]));const fitsHere=trial.scrollHeight<=trial.clientHeight+1;trial.remove();if(fitsEmpty&&!fitsHere){defer(part);continue;}}
   // Keep rhythmic sequences and the closing creed together when a page can hold them.
   if(page.length&&part.key&&part.start===0&&([8,13,16,19].includes(part.beat)&&part.key.endsWith('.00')||part.beat===20)) {
    const bundle=[part,...queue.filter((x,i)=>{const unit=x.key?x:legend.units.find(u=>u.key===x.asset?.anchor);if(!unit)return false;return part.beat===20?unit.beat>=20:unit.beat===part.beat;})];
    const trial=measure.cloneNode(false);trial.style.width=rect.width+'px';trial.style.height=rect.height+'px';shell.append(trial);trial.replaceChildren(...bundle.map(element));const fitsEmpty=trial.scrollHeight<=trial.clientHeight+1;trial.replaceChildren(...page.map(element),...bundle.map(element));const fitsHere=trial.scrollHeight<=trial.clientHeight+1;trial.remove();
    if(fitsEmpty&&!fitsHere&&page.some(x=>x.key)){defer(part);continue;}
   }
   if(fit(measure,part)){page.push(part);if(part.emphasis==='opening')finish();continue;}
   if(page.length&&part.kind!=='paragraph'){defer(part);continue;}
   if(!part.key){page.push(part);finish();continue;}
   // Fill remaining paper with prose at existing whitespace. Type size is immutable.
   const text=source(part.key),slice=text.slice(part.start,part.end),ends=[...slice.matchAll(/\s+/g)].map(m=>part.start+m.index+m[0].length);ends.push(part.end);
   let low=0,high=ends.length-1,best=-1;
   while(low<=high){const mid=(low+high)>>1,candidate={...part,end:ends[mid]};measure.replaceChildren(...page.map(element));if(fit(measure,candidate)){best=mid;low=mid+1;}else high=mid-1;}
   if(best<0){if(page.length){defer(part);}else{page.push(part);finish();}continue;}
   let end=ends[best];
   // Avoid a one-line orphan or a very short tail on the next page.
   const leading=parseFloat(getComputedStyle(measure).lineHeight);
   measure.replaceChildren(...page.map(element));const fragment={...part,end};const ink=element(fragment);measure.append(ink);
   if(page.length&&(ink.getBoundingClientRect().height<leading*1.8||text.slice(end,part.end).trim().split(/\s+/).length<6)){defer(part);continue;}
   page.push(fragment);finish();
   if(end<part.end)queue.unshift({...part,start:end,beatStart:false,sequenceStart:false});
  }
  finish();measure.remove();
  // Keep a tiny final paragraph with another complete unit whenever it fits.
  if(result.length>1){const last=result.at(-1),prior=result.at(-2);if(last.length===1&&prior.length>1){
   const candidate=prior.at(-1);const test=sample.cloneNode(false);test.classList.add('reader-measure');test.style.width=rect.width+'px';test.style.height=rect.height+'px';shell.append(test);test.append(element(candidate),element(last[0]));if(test.scrollHeight<=test.clientHeight+1){prior.pop();last.unshift(candidate);}test.remove();
  }}
  pages=result;
 }
 function decorate(leaf,page){
  leaf.querySelectorAll(':scope > .manuscript-illustration,:scope > .page-corner').forEach(x=>x.remove());
  leaf.dataset.worn=String(page.some(p=>p.beat===16));leaf.dataset.ending=String(page.some(p=>p.emphasis==='law'));
  for(const asset of legend.illustrations||[]){if(!asset.src||['half-page','full-page'].includes(asset.placement)||step===1||!page.some(p=>p.key===asset.anchor&&p.start===0))continue;const fig=element({kind:'illustration',asset});const paragraph=[...leaf.querySelectorAll('[data-source-key]')].find(p=>p.dataset.sourceKey===asset.anchor);if(paragraph){const r=paragraph.getBoundingClientRect();const variation=[0,3,-1,2,0,2,-1][Number(asset.anchor.split('.').at(-1))]||0;fig.style.setProperty('--art-top',Math.max(65,r.top-leaf.getBoundingClientRect().top+variation)+'px');fig.style.setProperty('--art-inset',(8+[1,-1,2,0,-2,1,0][Number(asset.anchor.split('.').at(-1))])+'px');fig.style.setProperty('--art-available',Math.max(26,r.height-2)+'px');}leaf.append(fig);}
  // Slot positions are independent of canon. No unapproved images are displayed.
  leaf.dataset.illustrationSlots='top-corner bottom-corner outer-margin vignette half-page full-page edge';
  const corner=document.createElement('span');corner.className='page-corner';corner.setAttribute('aria-hidden','true');leaf.append(corner);
 }
 function updateURL(){const url=new URL(location.href);url.searchParams.delete('entry');url.searchParams.set('legend',legend.id);url.searchParams.set('page',index+1);const a=anchor||currentAnchor();if(a)url.searchParams.set('at',a.key);history.replaceState({legend:legend.id,page:index+1},'',url);}
 function render(update=true){
  index=Math.max(0,Math.min(index,pages.length-1));if(step===2)index-=index%2;
  for(let i=0;i<leaves.length;i++){
   const page=pages[index+i]||[],leaf=leaves[i],body=leaf.querySelector('.leaf-body');body.replaceChildren(...page.map(element));leaf.querySelector('.leaf-folio').textContent=page.length?index+i+1:'';
   leaf.dataset.page=page.length?String(index+i+1):'';leaf.dataset.frontispiece=String(page.length===1&&page[0].kind==='heading');leaf.classList.toggle('turnable',index+step<pages.length&&i===step-1);
   decorate(leaf,page);
  }
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
  if(before){const found=pages.findIndex(page=>page.some(part=>sameAnchor(part,before)));if(found>=0)index=found;}
  else if(initialAnchor){const found=pages.findIndex(page=>page.some(part=>part.key===initialAnchor));index=found>=0?found:initialPage;}
  else index=initialPage;
  anchor=before||(initialAnchor?{key:initialAnchor,fraction:0}:currentAnchor());render(shell.dataset.state==='reading');
 }
 function turn(direction){
  if(turning||shell.dataset.state!=='reading'||(direction<0?previous.disabled:next.disabled))return;
  anchor=null;const destination=index+direction*step;
  shell.dispatchEvent(new CustomEvent('avaris:chronicle-turn',{bubbles:true,detail:{legend:legend.id,page:destination+1,soundPreference:readSoundPreference()}}));
  if(motion.matches){index=destination;render();return;}
  turning=true;const paper=document.createElement('div');paper.className='paper-turn '+(direction>0?'forward':'backward');paper.setAttribute('aria-hidden','true');book.append(paper);
  // Illustrations are attached to the outgoing paper plane; HTML ink stays static.
  const outgoing=leaves[direction>0?step-1:0],paperBox=outgoing.getBoundingClientRect();
  outgoing.querySelectorAll('.manuscript-illustration').forEach(fig=>{const copy=fig.cloneNode(true),r=fig.getBoundingClientRect();copy.classList.add('turn-illustration');Object.assign(copy.style,{left:(r.left-paperBox.left)+'px',top:(r.top-paperBox.top)+'px',right:'auto',width:r.width+'px',height:r.height+'px'});copy.querySelectorAll('img').forEach(img=>img.alt='');paper.append(copy);});
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
