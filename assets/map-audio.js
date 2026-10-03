/* Quiet procedural environmental sound. No autoplay and no external audio downloads. */
(() => {
 const profiles={
  armonia:[[1800,.032,'lowpass'],[4200,.015,'highpass'],[420,.012,'bandpass']],
  nymora:[[650,.045,'lowpass'],[1900,.019,'bandpass'],[140,.015,'lowpass']],
  veritasa:[[1250,.028,'lowpass'],[500,.021,'bandpass']],
  drakvar:[[360,.032,'lowpass'],[1300,.013,'bandpass']],
  ignivar:[[90,.032,'lowpass'],[3200,.018,'bandpass'],[540,.015,'lowpass']],
  serapha:[[1600,.045,'lowpass'],[420,.012,'bandpass']],
  equira:[[1150,.028,'lowpass'],[350,.012,'bandpass']]
 };
 class MapAudio {
  constructor(map){
   this.map=map;this.button=map.querySelector('.map-sound');this.layers=new Map();this.active=null;this.visible=false;
   try{this.enabled=localStorage.getItem('avaris.map.sound')==='on';}catch{this.enabled=false;}
   this.button.addEventListener('click',async()=>{this.enabled=!this.enabled;try{localStorage.setItem('avaris.map.sound',this.enabled?'on':'off');}catch{}this.sync();if(this.enabled)this.unlock().catch(()=>{this.map.dataset.audioState='unavailable';});this.select(this.active);});
   // A remembered preference is armed, never an autoplay bypass.
   document.addEventListener('pointerdown',()=>{if(this.enabled)this.unlock().catch(()=>{this.map.dataset.audioState="unavailable";});},{passive:true});
   document.addEventListener('keydown',()=>{if(this.enabled)this.unlock().catch(()=>{this.map.dataset.audioState="unavailable";});});
   map.addEventListener('avaris:kingdom-activate',e=>this.select(e.detail.kingdom.toLowerCase()));
   map.addEventListener('avaris:kingdom-deactivate',()=>this.select(null));
   map.addEventListener('avaris:map-flight',e=>this.event(e.detail.kind));
   document.addEventListener('avaris:languagechange',()=>this.sync());
   addEventListener('pagehide',()=>{clearInterval(this.timer);this.ctx?.close();});this.sync();
  }
  sync(){const key=this.enabled?'map.sound.off':'map.sound.on';const text=window.AvarisI18n.t(key);this.button.querySelector('span').textContent=text;this.button.setAttribute('aria-label',text);this.button.setAttribute('aria-pressed',String(this.enabled));this.map.dataset.sound=this.enabled?'on':'off';}
  async unlock(){
   if(!this.enabled)return;
   if(!this.ctx){
    const Audio=window.AudioContext||window.webkitAudioContext;if(!Audio)return;
    this.ctx=new Audio();this.master=this.ctx.createGain();this.master.gain.value=.65;
    const compressor=this.ctx.createDynamicsCompressor();compressor.threshold.value=-24;compressor.ratio.value=4;this.master.connect(compressor);compressor.connect(this.ctx.destination);
    this.noise=this.ctx.createBuffer(1,this.ctx.sampleRate*6,this.ctx.sampleRate);const a=this.noise.getChannelData(0);let brown=0;
    for(let i=0;i<a.length;i++){brown=(brown+Math.random()*.04-.02)/1.02;a[i]=brown*3+Math.random()*.12-.06;}
    this.timer=setInterval(()=>this.rare(),1000);
   }
   if(this.ctx.state==='suspended')await this.ctx.resume();this.map.dataset.audioState=this.ctx.state;this.select(this.active);
  }
  layer(name){
   if(this.layers.has(name))return this.layers.get(name);
   const c=this.ctx,g=c.createGain();g.gain.value=0;g.connect(this.master);const nodes=[];
   for(const [frequency,volume,type]of profiles[name]){
    const n=c.createBufferSource();n.buffer=this.noise;n.loop=true;const f=c.createBiquadFilter();f.type=type;f.frequency.value=frequency;f.Q.value=.6;
    const v=c.createGain();v.gain.value=volume;n.connect(f);f.connect(v);v.connect(g);n.start(0,Math.random()*5);nodes.push(n);
    const l=c.createOscillator(),lg=c.createGain();l.frequency.value=name==='nymora'?.18:.08+Math.random()*.07;lg.gain.value=volume*.25;l.connect(lg);lg.connect(v.gain);l.start();nodes.push(l);
   }
   const layer={g,nodes};this.layers.set(name,layer);return layer;
  }
  select(name){
   const changed=this.active!==name;this.active=name;if(changed)this.since=Date.now();
   if(!this.ctx)return;const target=this.enabled&&this.visible?name:null,t=this.ctx.currentTime;
   if(target)this.layer(target);
   this.map.dataset.audioKingdom=target||'';
   for(const [key,l]of this.layers){const p=l.g.gain;if(p.cancelAndHoldAtTime)p.cancelAndHoldAtTime(t);else{p.cancelScheduledValues(t);p.setValueAtTime(p.value,t);}p.linearRampToValueAtTime(key===target?1:0,t+1.6);}
  }
  setVisible(visible){this.visible=visible;this.select(this.active);}
  tone(hz,duration,volume,delay=0){const c=this.ctx,t=c.currentTime+delay,o=c.createOscillator(),g=c.createGain();o.type='sine';o.frequency.setValueAtTime(hz,t);o.frequency.exponentialRampToValueAtTime(hz*.85,t+duration);g.gain.setValueAtTime(0,t);g.gain.linearRampToValueAtTime(volume,t+.04);g.gain.exponentialRampToValueAtTime(.00001,t+duration);o.connect(g);g.connect(this.master);o.start(t);o.stop(t+duration+.1);}
  event(kind){
   if(!this.enabled||!this.visible||this.ctx?.state!=='running')return;
   this.map.dataset.audioEvent=kind;setTimeout(()=>delete this.map.dataset.audioEvent,1500);
   const c=this.ctx,t=c.currentTime,n=c.createBufferSource(),f=c.createBiquadFilter(),g=c.createGain();n.buffer=this.noise;f.type='bandpass';f.frequency.value=kind==='dragon'?220:1700;g.gain.setValueAtTime(0,t);g.gain.linearRampToValueAtTime(kind==='dragon'?.11:.045,t+.35);g.gain.linearRampToValueAtTime(0,t+1.5);n.connect(f);f.connect(g);g.connect(this.master);n.start();n.stop(t+1.6);
   if(kind==='birds')for(let i=0;i<3;i++)this.tone(2100+i*240,.19,.009,i*.28);
  }
  rare(){
   if(!this.enabled||!this.visible||this.ctx?.state!=='running'||!this.active)return;
   const now=Date.now();if(now-this.since<8000||now-(this.lastRare||0)<55000)return;
   if(this.active==='veritasa'){this.lastRare=now;[440,1179,1813].forEach((f,i)=>this.tone(f,5-i,.005/(i+1)));}
   else if(['drakvar','ignivar','equira'].includes(this.active)){this.lastRare=now;this.tone(this.active==='equira'?180:310,1.8,.003);}
  }
 }
 window.AvarisMapAudio=MapAudio;
})();
