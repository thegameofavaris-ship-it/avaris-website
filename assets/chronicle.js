/* Reusable HTML chronicle renderer. Pagination changes paper layout, never canon. */
(() => {
 const shell=document.querySelector('.reader-shell');if(!shell)return;
 const registry=window.AvarisChronicles,params=new URLSearchParams(location.search);
 const legend=registry.legends.find(x=>x.id===params.get('legend'))||registry.legends[0];
 const book=shell.querySelector('.chronicle-book'),stage=shell.querySelector('.book-stage'),coverStage=shell.querySelector('.cover-stage');
 const leaves=[...book.querySelectorAll('.book-leaf')],previous=shell.querySelector('.reader-prev'),next=shell.querySelector('.reader-next'),progress=shell.querySelector('.reader-progress');
 const expand=shell.querySelector('.reader-expand'),motion=matchMedia('(prefers-reduced-motion: reduce)');
 const t=(key,args)=>window.AvarisI18n.t(key,args),source=key=>t(key);
 let pages=[],index=0,step=1,turning=false,anchor=null,resizeTimer,openingTimer,queued=false;
 const initialPage=Math.max(0,(parseInt(params.get('page'),10)||1)-1);
 const initialAnchor=params.get('at');
 function heading(){const h=document.createElement('h2');h.className='chapter-heading';const n=document.createElement('span');n.className='chapter-number';n.textContent=legend.chapter;const title=document.createElement('span');title.className='chapter-title';title.textContent=t(legend.titleKey);h.append(n,title);return h;}
 function element(part){
  if(part.kind==='heading')return heading();
  if(part.kind==='illustration'){
   const f=document.createElement('figure');f.className='manuscript-illustration';f.dataset.placement=part.asset.placement;const img=document.createElement('img');img.src=part.asset.src;img.alt=part.asset.altKey?t(part.asset.altKey):'';f.append(img);return f;
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
   for(const asset of legend.illustrations||[]){if(asset.anchor===u.key&&['half-page','full-page'].includes(asset.placement)&&asset.src)all.push({kind:'illustration',asset});}
   all.push({...u,start:0,end:source(u.key).length,length:source(u.key).length,beatStart:prior!==null&&prior!==u.beat,sequenceStart:u.kind==='sequence'&&prior!==u.beat});prior=u.beat;
  }return all;
 }
 function sameAnchor(part,a){return part.key===a?.key&&(a.fraction??0)>=part.start/part.length&&(a.fraction??0)<=(part.end/part.length);}
 function currentAnchor(){const part=pages[index]?.find(x=>x.key)||pages[index+1]?.find(x=>x.key);return part?{key:part.key,fraction:part.start/part.length}:null;}
 function fit(measure,part){const node=element(part);measure.append(node);const fits=measure.scrollHeight<=measure.clientHeight+1;if(!fits)node.remove();return fits;}
 function pagination(){
  const sample=leaves[0].querySelector('.leaf-body'),rect=sample.getBoundingClientRect();if(rect.width<20||rect.height<40)return;
  const measure=document.createElement('div');measure.className='leaf-body reader-measure';measure.style.width=rect.width+'px';measure.style.height=rect.height+'px';measure.style.fontSize=getComputedStyle(sample).fontSize;measure.style.lineHeight=getComputedStyle(sample).lineHeight;shell.append(measure);
  const queue=units(),result=[];let page=[];
  const finish=()=>{if(page.length)result.push(page);page=[];measure.replaceChildren();};
  while(queue.length){const part=queue.shift();
   // Keep rhythmic sequences and the closing creed together when a page can hold them.
   if(page.length&&part.key&&part.start===0&&([4,8,13,16,19].includes(part.beat)&&part.key.endsWith('.00')||part.beat===20)) {
    const bundle=[part,...queue.filter((x,i)=>{if(!x.key)return false;return part.beat===20?x.beat>=20:x.beat===part.beat;})];
    const trial=measure.cloneNode(false);trial.style.width=rect.width+'px';trial.style.height=rect.height+'px';shell.append(trial);trial.replaceChildren(...bundle.map(element));const fitsEmpty=trial.scrollHeight<=trial.clientHeight+1;trial.replaceChildren(...page.map(element),...bundle.map(element));const fitsHere=trial.scrollHeight<=trial.clientHeight+1;trial.remove();
    if(fitsEmpty&&!fitsHere&&page.some(x=>x.key)){finish();queue.unshift(part);continue;}
   }
   if(fit(measure,part)){page.push(part);continue;}
   if(page.length){finish();queue.unshift(part);continue;}
   if(!part.key){page.push(part);finish();continue;}
   // A long paragraph on a short page may divide only at existing whitespace.
   const text=source(part.key),slice=text.slice(part.start,part.end),ends=[...slice.matchAll(/\s+/g)].map(m=>part.start+m.index+m[0].length);ends.push(part.end);
   let low=0,high=ends.length-1,best=-1;
   while(low<=high){const mid=(low+high)>>1;const candidate={...part,end:ends[mid]};measure.replaceChildren();if(fit(measure,candidate)){best=mid;low=mid+1;}else high=mid-1;}
   if(best<0){page.push(part);finish();continue;}
   const end=ends[best];const fragment={...part,end};measure.replaceChildren(element(fragment));page.push(fragment);finish();
   if(end<part.end)queue.unshift({...part,start:end,beatStart:false,sequenceStart:false});
  }
  finish();measure.remove();
  // Keep a tiny final paragraph with another complete unit whenever it fits.
  if(result.length>1){const last=result.at(-1),prior=result.at(-2);if(last.length===1&&prior.length>1){
   const candidate=prior.at(-1);const test=sample.cloneNode(false);test.classList.add('reader-measure');test.style.width=rect.width+'px';test.style.height=rect.height+'px';shell.append(test);test.append(element(candidate),element(last[0]));if(test.scrollHeight<=test.clientHeight+1){prior.pop();last.unshift(candidate);}test.remove();
  }}
  // An odd final spread receives an intentional title frontispiece rather than an empty facing leaf.
  if(step===2&&result.length%2===1&&result[0]?.[0]?.kind==='heading'&&result[0].length>1){const title=result[0].shift();result.unshift([title]);}
  pages=result;
 }
 function decorate(leaf,page){
  leaf.querySelectorAll('.manuscript-illustration,.page-corner').forEach(x=>x.remove());
  for(const asset of legend.illustrations||[]){if(!asset.src||['half-page','full-page'].includes(asset.placement)||!page.some(p=>p.key===asset.anchor))continue;const fig=element({kind:'illustration',asset});leaf.append(fig);}
  // Slot positions are independent of canon. No unapproved images are displayed.
  leaf.dataset.illustrationSlots='top-corner bottom-corner outer-margin vignette half-page full-page edge';
  const corner=document.createElement('span');corner.className='page-corner';corner.setAttribute('aria-hidden','true');leaf.append(corner);
 }
 function updateURL(){const url=new URL(location.href);url.searchParams.delete('entry');url.searchParams.set('legend',legend.id);url.searchParams.set('page',index+1);const a=currentAnchor();if(a)url.searchParams.set('at',a.key);history.replaceState({legend:legend.id,page:index+1},'',url);}
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
  anchor=null;render(shell.dataset.state==='reading');
 }
 function turn(direction){
  if(turning||shell.dataset.state!=='reading'||(direction<0?previous.disabled:next.disabled))return;
  const destination=index+direction*step;
  shell.dispatchEvent(new CustomEvent('avaris:chronicle-turn',{bubbles:true,detail:{legend:legend.id,page:destination+1,soundPreference:readSoundPreference()}}));
  if(motion.matches){index=destination;render();return;}
  turning=true;const paper=document.createElement('div');paper.className='paper-turn '+(direction>0?'forward':'backward');paper.setAttribute('aria-hidden','true');book.append(paper);
  // The ink is static; only the separate blank paper/shadow plane moves.
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
 document.addEventListener('avaris:languagechange',()=>{anchor=currentAnchor();layout();syncExpand();});
 const observer=new ResizeObserver(()=>{clearTimeout(resizeTimer);resizeTimer=setTimeout(()=>layout(),100);});observer.observe(stage);
 addEventListener('popstate',()=>{const p=new URLSearchParams(location.search);index=Math.max(0,(parseInt(p.get('page'),10)||1)-1);render(false);});
 addEventListener('pagehide',()=>{clearTimeout(openingTimer);clearTimeout(resizeTimer);observer.disconnect();});
 if(params.get('entry')==='cover'){
  shell.dataset.state='cover';coverStage.hidden=false;stage.setAttribute('inert','');stage.setAttribute('aria-hidden','true');
 }
 layout(false);syncExpand();
})();
