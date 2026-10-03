/* Paint-preserving 2.5D animation: only existing masked pixels move.
   One canvas, one frame loop, cached small patches. No procedural rings or river lines. */
(() => {
  class AvarisEnvironment {
    constructor(map) {
      this.map = map;
      this.canvas = map.querySelector('.map-environment');
      this.ctx = this.canvas.getContext('2d');
      this.active = null;
      this.visible = false;
      this.elapsed = 0;
      this.generation = 0;
      this.cache = new Map();
      this.flights = {armonia: -Infinity, drakvar: -Infinity};
      this.motion = matchMedia('(prefers-reduced-motion: reduce)');
      this.actor = null;
      this.motion.addEventListener('change', () => {
        if (this.motion.matches) { this.actor=null;delete this.map.dataset.birds;delete this.map.dataset.dragon;this.stop(true); }
        else if (this.active) this.activate(this.active, true);
      });
      this.resize = new ResizeObserver(() => this.size());
      this.resize.observe(map);
      this.size();
      addEventListener('pagehide', () => this.stop());
    }
    size() {
      const width = Math.min(1536, Math.max(320, Math.round(this.map.clientWidth * Math.min(devicePixelRatio || 1, 1.5))));
      const height = Math.round(width * 1024 / 1536);
      if (this.canvas.width !== width || this.canvas.height !== height) {
        this.canvas.width = width; this.canvas.height = height;
        if (this.active && this.patches) this.paint();
      }
    }
    image(src) {
      return new Promise((resolve,reject) => {
        const image = new Image();
        image.onload = () => resolve(image);
        image.onerror = () => reject(new Error('Map animation asset unavailable: '+src));
        image.src = new URL(src,document.baseURI).href;
      });
    }
    async prepare(kingdom) {
      if (!this.ready) this.ready = Promise.all([
        fetch(new URL('assets/maps/environment/manifest.json?v=map-living-v2',document.baseURI)).then(r => {if(!r.ok)throw new Error('Map masks unavailable');return r.json();}),
        this.image(this.map.querySelector('img').currentSrc || this.map.querySelector('img').src)
      ]).then(([manifest,master]) => {this.manifest=manifest;this.master=master;});
      await this.ready;
      if (!this.cache.has(kingdom)) this.cache.set(kingdom,Promise.all(this.manifest.patches.filter(p => p.kingdom===kingdom).map(async data => {
        const mask=await this.image(data.mask);
        const source=document.createElement('canvas');source.width=data.width;source.height=data.height;
        source.getContext('2d').drawImage(this.master,data.x,data.y,data.width,data.height,0,0,data.width,data.height);
        const buffer=document.createElement('canvas');buffer.width=data.width;buffer.height=data.height;
        return {...data,mask,source,buffer,ctx:buffer.getContext('2d')};
      })));
      return this.cache.get(kingdom);
    }
    async activate(name, force=false) {
      const kingdom=name?.toLowerCase() || null;
      if (kingdom===this.active && !force) return;
      const token=++this.generation;
      this.stop(true);this.active=kingdom;this.patches=null;this.actor=null;this.elapsed=0;
      delete this.map.dataset.birds;delete this.map.dataset.dragon;
      if (!kingdom || this.motion.matches || !this.ctx) return;
      try {
        const patches=await this.prepare(kingdom);
        if(token!==this.generation) return;
        this.patches=patches;
        // Creature assets are loaded only when their kingdom is requested.
        // Mobile retains four birds and the dragon; water/heat use fewer strips.
        if ((kingdom==='armonia'||kingdom==='drakvar') ) {
          const src=kingdom==='drakvar'?'dragon':'birds';
          const sprite=await this.image('assets/maps/environment/'+src+'-flight-'+(src==='birds'?'v2':'v1')+'.webp');
          if(token!==this.generation) return;
          if(Date.now()-this.flights[kingdom]>30000) {
            const variants=src==='birds'?['#cf7b45','#d1b768','#728962','#7c9ba9'].map(color=>{const sheet=document.createElement('canvas');sheet.width=sprite.width;sheet.height=sprite.height;const c=sheet.getContext('2d');c.drawImage(sprite,0,0);c.globalCompositeOperation='source-atop';c.globalAlpha=.2;c.fillStyle=color;c.fillRect(0,0,sheet.width,sheet.height);return sheet;}):null;
            this.actor={kind:src,sprite,variants,started:false};
          }
        }
        this.start();
      } catch(error) {
        // Lighting and navigation remain available if an optional raster asset cannot load.
        console.warn(error.message);this.start();
      }
    }
    setVisible(visible) {
      this.visible=visible;
      if (visible) this.start(); else this.stop();
    }
    start() {
      if(this.frame || !this.visible || !this.active || !this.patches || this.motion.matches) return;
      this.lastTime=performance.now();this.lastPaint=0;
      this.map.dataset.environmentRunning='true';
      const tick=now => {
        if(this.motion.matches||!this.visible||!this.active){this.stop(this.motion.matches);return;}
        this.frame=requestAnimationFrame(tick);
        const interval=innerWidth<=600?1000/18:1000/24;
        if(now-this.lastPaint<interval) return;
        this.elapsed+=Math.min((now-this.lastTime)/1000,.15);
        this.lastTime=now;this.lastPaint=now;this.paint();
      };
      this.frame=requestAnimationFrame(tick);
    }
    stop(clear=false) {
      if(this.frame)cancelAnimationFrame(this.frame);
      this.frame=null;this.map.dataset.environmentRunning='false';
      if(clear){delete this.map.dataset.birds;delete this.map.dataset.dragon;}
      if(clear && this.ctx) {this.ctx.setTransform(1,0,0,1,0,0);this.ctx.clearRect(0,0,this.canvas.width,this.canvas.height);}
    }
    patch(p,t) {
      const c=p.ctx,w=p.width,h=p.height;
      c.setTransform(1,0,0,1,0,0);c.globalAlpha=1;c.globalCompositeOperation='source-over';c.filter='none';c.clearRect(0,0,w,h);
      let opacity=.65;
      if(p.kind==='river'||p.kind==='ocean') {
        const step=innerWidth<=600?8:5;
        const amplitude=p.kind==='ocean'?5.8:4.4;
        for(let y=0;y<h;y+=step) {
          const offset=Math.sin(y*.065+t*1.85+p.x*.03)*amplitude;
          const sy=Math.min(h-step,Math.max(0,y+Math.cos(y*.08+t*1.1)*2.4));
          c.drawImage(p.source,0,sy,w,Math.min(step,h-y),offset,y,w,Math.min(step,h-y)+.25);
        }
        opacity=.96;
      } else if(p.kind==='fall') {
        // Two downward-moving copies crossfade. The waterfall mask itself stays fixed.
        for(let phase=0;phase<2;phase++) {
          const flow=(t*.85+phase*.5)%1;
          c.globalAlpha=Math.sin(flow*Math.PI)*.75;
          c.drawImage(p.source,0,flow*24-7);
        }
        opacity=.98;
      } else if(p.kind==='mist'||p.kind==='smoke') {
        c.drawImage(p.source,Math.sin(t*.3+p.x)*10,-4-Math.sin(t*.23)*5);
        opacity=p.kind==='mist'?.7:.88;
      } else if(p.kind==='lava'||p.kind==='heat') {
        const lava=p.kind==='lava',step=innerWidth<=600?8:4;
        for(let y=0;y<h;y+=step){const shift=Math.sin(y*.12-t*(lava?1.7:2.3))* (lava?4.5:1.8);const sy=Math.max(0,Math.min(h-step,y-(lava?(t*8)%14:0)));c.drawImage(p.source,0,sy,w,Math.min(step,h-y),shift,y,w,Math.min(step,h-y)+.3);}
        if(lava){c.globalCompositeOperation='screen';c.globalAlpha=.13+.08*Math.sin(t*2.7);c.fillStyle='#f57b30';c.fillRect(0,0,w,h);c.globalCompositeOperation='source-over';}opacity=lava?.98:.28;
      } else if(p.kind==='foliage') {
        c.drawImage(p.source,Math.sin(t*.8)*.7,Math.cos(t*.6)*.35);opacity=.32;
      } else {
        const cycle=(t-p.phase*3+12)%12;
        const sequential=cycle<3?Math.pow(Math.sin(cycle/3*Math.PI),4):0;
        const light=p.kind==='temple'?sequential*.1:p.kind==='bridge'?.055+Math.sin(t*.6)*.04:.09+Math.sin(t*2.5+p.x)*.035+Math.sin(t*6.4)*.015;
        c.drawImage(p.source,0,0);
        // Native compositing also works in Safari; no per-frame Canvas filter is needed.
        c.globalCompositeOperation='screen';c.globalAlpha=Math.max(0,light);
        c.fillStyle=p.kind==='fire'||p.kind==='settlement'?'#efb77c':'#fff1d9';c.fillRect(0,0,w,h);
        c.globalCompositeOperation='source-over';
        opacity=p.kind==='temple'?.85:.7;
      }
      c.filter='none';c.globalAlpha=1;c.globalCompositeOperation='destination-in';c.drawImage(p.mask,0,0);
      c.globalCompositeOperation='source-over';
      this.ctx.globalAlpha=opacity*Math.min(1,t/ .7);this.ctx.drawImage(p.buffer,p.x,p.y);
    }
    creature(t) {
            if(!this.actor)return;
      const dragon=this.actor.kind==='dragon';const delay=dragon?1:1.3;const duration=dragon?7.5:5.8;
      const time=t-delay;
      if(time<0)return;
      if(time>duration) {delete this.map.dataset.birds;delete this.map.dataset.dragon;this.actor=null;return;}
      if(!this.actor.started) {
        this.actor.started=true;this.flights[this.active]=Date.now();
        this.map.dataset[dragon?'dragon':'birds']=dragon?'Drakvar':'Armonia';
        this.map.dispatchEvent(new CustomEvent('avaris:map-flight',{detail:{kind:dragon?'dragon':'birds'}}));
      }
      const count=dragon?1:(innerWidth<=600?4:6);
      for(let i=0;i<count;i++) {
        const u=Math.max(0,Math.min(1,(time-i*.14)/duration));
        const fade=Math.min(1,u/.14,(1-u)/.19);
        const width=dragon?148:46-i*2;
        const height=width*(dragon?224/192:128/128);
        const x=dragon?115+u*205:525+u*180-i*13;
        const y=dragon?-20+u*8-Math.sin(u*Math.PI)*8:190-u*29+i*8+Math.sin(u*4+i)*1.2;
        const sequence=dragon?[0,1,2,3,4,5,6,7,7,7]:[0,1,2,3,4,5,6,7];
        const progress=(time/(dragon?1.8:.78)+i*.27)*sequence.length;
        const index=Math.floor(progress)%sequence.length;const mix=progress%1;
        const fw=dragon?192:128,fh=dragon?224:128;
        for(const [frame,alpha] of [[sequence[index],1-mix],[sequence[(index+1)%sequence.length],mix]]) {
          this.ctx.globalAlpha=Math.max(0,fade)*alpha;
          this.ctx.filter='none';
          this.ctx.drawImage(dragon?this.actor.sprite:this.actor.variants[i%4],frame*fw,0,fw,fh,x,y,width,height);
        }
      }
    }
    paint() {
      if(!this.ctx || !this.patches || this.motion.matches)return;
      const c=this.ctx;c.setTransform(1,0,0,1,0,0);c.clearRect(0,0,this.canvas.width,this.canvas.height);
      c.setTransform(this.canvas.width/1536,0,0,this.canvas.height/1024,0,0);c.save();
      const path=this.map.querySelector('[data-kingdom="'+this.active[0].toUpperCase()+this.active.slice(1)+'"] path');
      if(path)c.clip(new Path2D(path.getAttribute('d')));
      for(const p of this.patches)this.patch(p,this.elapsed);
      if(this.active==='ignivar' ) {
        // Four tiny ash flecks drift with the existing plume, never orbit or emit light.
        for(let i=0;i<4;i++) {const u=(this.elapsed/11+i*.23)%1;c.globalAlpha=Math.sin(u*Math.PI)*.2;c.fillStyle='#b3a89c';c.fillRect(659+i*17+u*8,641-i*5-u*13,1,1.2);}
      }
      if(this.active==='equira') {
        // Five short-lived reflections at painted central waterways, never an orbit.
        const points=[[731,522],[824,507],[890,535],[989,475],[703,550]];
        for(let i=0;i<points.length;i++){const u=(this.elapsed/7+i*.19)%1;const a=Math.pow(Math.sin(u*Math.PI),8)*.55;c.globalAlpha=a;c.fillStyle=i%2?'#b9a17a':'#f2e9d4';const [x,y]=points[i];c.beginPath();c.ellipse(x+Math.sin(u*3)*2,y-u*6,1.3,.7,0,0,Math.PI*2);c.fill();}
      }
      this.creature(this.elapsed);c.filter='none';c.restore();c.globalAlpha=1;
    }
  }
  window.AvarisEnvironment=AvarisEnvironment;
})();
