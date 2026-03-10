 

window.Effects = {
"fdn_reverb": {
	interface: `
int.automations = {
 "wet": { min: 0, max: 1, step: 0.01, defpoint: 0.4 },
 "feedback": { min: 0, max: 0.99, step: 0.01, defpoint: 0.6 },
 "damp": { min: 0, max: 1, step: 0.01, defpoint: 0.3 }
};

const modal = new Node({
 style:{ pos:'abs', t:0, l:0, w:'100vw', h:'100vh', bg:'#05060a' }
});

const knobWidth = 90;
const spacing = 140;
const totalWidth = spacing * 2; 
centerX = (window.innerWidth * 0.25
) - (totalWidth * 0.25);
const centerY = 0;

const createKnob = (label, prop, min, max, val, offsetX) => {
 const wrap = new Node({
  style:{
   pos:'abs',
   l: centerX + offsetX,
   t: centerY,
   w: knobWidth,
   h: 130
  }
 });
 const knob = new Knob({
  min, max, value:val, sensitivity:0.15,
  style:{
   w:knobWidth,
   h:knobWidth,
   knobColor:'#00ffaa',
   trackColor:'#1a2030'
  }
 });
 int[prop] = knob;
 const labelNode = new Node({
  value:label,
  style:{
   t:0,
   w:'100%',
   size:13,
   color:'#00ffaa',
  }
 });
 wrap.add(knob);
 wrap.add(labelNode);
 modal.add(wrap);
 return knob;
};
 
int.wetKnob  = createKnob("WET","wet",0,1,0.4,0);
int.fbKnob   = createKnob("FEEDBACK","feedback",0,0.99,0.4,spacing);
int.dampKnob = createKnob("DAMP","damp",0,1,0.3,spacing*2);

globalRoot.add(modal);
const updateFeedbackColor = ()=>{
 const v = int.feedback?.val ?? 0;

 if(v > 0.49){
  int.fbKnob.style.knobColor = '#ff3333';
  int.fbKnob.style.trackColor = '#401010';
 }else{
  int.fbKnob.style.knobColor = '#00ffaa';
  int.fbKnob.style.trackColor = '#1a2030';
 }
}
const prevOnInput = int.fbKnob.onInput;

int.fbKnob.onInput = (v) => {
	if (prevOnInput) prevOnInput(v);
	updateFeedbackColor();
};
updateFeedbackColor();
`,
	process: `
const sr = audioCtx.sampleRate;

if (!fx.reverbDelayLine) {
 fx.reverbMask = 32767;
 fx.reverbDelayLine = new Float32Array(fx.reverbMask + 1);
 fx.reverbDelayPos = 0;
 fx.reverbShelfSample0 = 0;
 fx.reverbShelfSample1 = 0;
 fx.reverbShelfSample2 = 0;
 fx.reverbShelfSample3 = 0;
 fx.reverbShelfPrevInput0 = 0;
 fx.reverbShelfPrevInput1 = 0;
 fx.reverbShelfPrevInput2 = 0;
 fx.reverbShelfPrevInput3 = 0;
 fx.silenceFrames = 0;
}

const wet = fx.automation?.wet ?? int.wet?.val ?? 0.4;
const feedback = Math.min(0.99, fx.automation?.feedback ?? int.feedback?.val ?? 0.6);
const damp = fx.automation?.damp ?? int.damp?.val ?? 0.3;

const reverbShelfB0 = 1.0 - damp;
const reverbShelfA1 = -damp;

const reverbDelayPos1 = (fx.reverbDelayPos + 3041) & fx.reverbMask;
const reverbDelayPos2 = (fx.reverbDelayPos + 6426) & fx.reverbMask;
const reverbDelayPos3 = (fx.reverbDelayPos + 10907) & fx.reverbMask;

const s0 = fx.reverbDelayLine[fx.reverbDelayPos];
const s1 = fx.reverbDelayLine[reverbDelayPos1];
const s2 = fx.reverbDelayLine[reverbDelayPos2];
const s3 = fx.reverbDelayLine[reverbDelayPos3];

const t0 = -(s0 + fx.inL) + s1;
const t1 = -(s0 + fx.inR) - s1;
const t2 = -s2 + s3;
const t3 = -s2 - s3;

const i0 = (t0 + t2);
const i1 = (t1 + t3);
const i2 = (t0 - t2);
const i3 = (t1 - t3);

fx.reverbShelfSample0 = reverbShelfB0 * i0 - reverbShelfA1 * fx.reverbShelfSample0;
fx.reverbShelfSample1 = reverbShelfB0 * i1 - reverbShelfA1 * fx.reverbShelfSample1;
fx.reverbShelfSample2 = reverbShelfB0 * i2 - reverbShelfA1 * fx.reverbShelfSample2;
fx.reverbShelfSample3 = reverbShelfB0 * i3 - reverbShelfA1 * fx.reverbShelfSample3;

fx.reverbDelayLine[reverbDelayPos1] = fx.reverbShelfSample0 * feedback;
fx.reverbDelayLine[reverbDelayPos2] = fx.reverbShelfSample1 * feedback;
fx.reverbDelayLine[reverbDelayPos3] = fx.reverbShelfSample2 * feedback;
fx.reverbDelayLine[fx.reverbDelayPos] = fx.reverbShelfSample3 * feedback;

fx.reverbDelayPos = (fx.reverbDelayPos + 1) & fx.reverbMask;

const outL = s1 + s2 + s3;
const outR = s0 + s2 - s3;

fx.outL = fx.inL * (1 - wet) + outL * wet;
fx.outR = fx.inR * (1 - wet) + outR * wet;

if (Math.abs(fx.inL) < 0.00005 && Math.abs(outL) < 0.00005)
 fx.silenceFrames++;
else
 fx.silenceFrames = 0;

fx.isTailActive = (fx.silenceFrames < sr * 2.5);
`
}
,
"eq_filter":{
	interface: `
const rebuildAutomations = () => {
 int.automations = {};
 int.points.forEach(p => {
  if (p.id === undefined) p.id = findFreeIndex();
  let typeName;
  if (p.type === "hi") typeName = "HiPass";
  else if (p.type === "lo") typeName = "LoPass";
  else typeName = "Peak";
  const base = typeName + ' Index "' + p.id + '" ';
  int.automations[base + "HZ"] = {
   min: 20,
   max: 20000,
   step: 1,
   defpoint: p.freq || 1000
  };
  if (p.type === "pk") {
   int.automations[base + "VOL"] = {
    min: -30,
    max: 30,
    step: 0.1,
    defpoint: p.gain || 0
   };
  } else {
   int.automations[base + "VOL"] = {
    min: 0.3,
    max: 4,
    step: 0.01,
    defpoint: p.q || 1.2
   };
  }
 });
};
const bgRoot = new Node({style:{pos:'abs',t:'0%',l:'0%',w:'100%',h:'100%',bg:'window(theme.editorBg)'}});
const panel = new Node({style:{pos:'abs',t:'20%',l:'10%',w:'80%',h:'160px',bg:'window(theme.boxcolor)',rad:10,pad:10,border:'1px solid #333'}});
bgRoot.add(panel);

if (!int.points) int.points = [];

let activePointIndex = -1;
let isDragging = false;

const freqFromX = (lx,w)=>Math.pow(10,1.3+(Math.max(0,Math.min(1,lx/w)))*(Math.log10(20000)-1.3));
const xFromFreq = (f,w)=>(Math.log10(f)-1.3)/(Math.log10(20000)-1.3)*w;
const typeFromX = (lx,w)=> lx<w*0.12?"hi":lx>w*0.88?"lo":"pk";

const findFreeIndex = () => {
 let i = 0;
 const used = new Set(int.points.map(p => p.id));
 while (used.has(i)) i++;
 return i;
};

const eqCanvas = new CanvasNode({
 style:{w:"100%",h:100,bg:"window(theme.buttons)",rad:8,border:"1px solid #00ffcc44"},
 onPointerDown:(lx,ly,w,h)=>{
  activePointIndex = int.points.findIndex(p=>{
   const px=xFromFreq(p.freq,w);
   const py=p.type==="pk"?h/2-(p.gain||0):h-((p.q||1)*20);
   return Math.hypot(lx-px,ly-py)<10;
  });
  if (activePointIndex !== -1){ isDragging=true; return; }

  const type = typeFromX(lx,w);
  const freq = freqFromX(lx,w);
  const id = findFreeIndex();

  int.points.push({id,freq,q:1.2,gain:0,type});
  activePointIndex = int.points.length - 1;
  isDragging = true;
 },
 onPointerMove:(lx,ly,w,h)=>{
  if(!isDragging||activePointIndex===-1) return;
  if(ly<-40){
   int.points.splice(activePointIndex,1);
   rebuildAutomations();
   activePointIndex=-1;
   isDragging=false;
   return;
  }
  const p=int.points[activePointIndex];
  p.freq=freqFromX(lx,w);
  if(p.type==="pk"){
   const y=Math.max(0,Math.min(1.25,ly/h));
   p.gain=(0.5-y)*60;
   p.q=1.5;
  } else {
   p.q=Math.max(0.3,(h-Math.max(0,Math.min(h,ly)))/30);
  }
 },
 onPointerUp:()=>{
  activePointIndex=-1;
  isDragging=false;
  rebuildAutomations();
 },
 onDraw:(c,w,h)=>{
  if(!c) return;
  c.clearRect(0,0,w,h);
  c.strokeStyle="#1a1a25";
  for(let f=100;f<20000;f*=2){
   const x=(Math.log10(f)-1.3)/(Math.log10(20000)-1.3)*w;
   c.beginPath(); c.moveTo(x,0); c.lineTo(x,h); c.stroke();
  }
  c.beginPath(); c.moveTo(0,h/2); c.lineTo(w,h/2); c.stroke();

  const response=[];
  for(let x=0;x<=w;x+=4){
   let f=Math.pow(10,1.3+(x/w)*(Math.log10(20000)-1.3));
   let y=h/2;
   int.points.forEach(p=>{
    if(!p||typeof p.freq!=="number"||isNaN(p.freq)) return;
    const logDist=Math.log10(f/p.freq);
    if(isNaN(logDist)) return;
    if(p.type==="lo"&&f>p.freq){
     const slope=Math.pow(Math.abs(logDist)*8,1.6);
     y+=slope*35*p.q;
    } else if(p.type==="hi"&&f<p.freq){
     const slope=Math.pow(Math.abs(logDist)*8,1.6);
     y+=slope*35*p.q;
    } else if(p.type==="pk"){
     const dist=Math.abs(Math.log10(f)-Math.log10(p.freq));
     y-=p.gain*Math.exp(-dist*(8/p.q));
    }
   });
   y=Math.max(0,Math.min(h,y));
   response.push({x,y});
  }

  if(response.length>1){
   c.beginPath();
   c.moveTo(response[0].x,response[0].y);
   for(let i=1;i<response.length-1;i++){
    const curr=response[i];
    const next=response[i+1];
    const midX=(curr.x+next.x)/2;
    const midY=(curr.y+next.y)/2;
    c.quadraticCurveTo(curr.x,curr.y,midX,midY);
   }
   const last=response[response.length-1];
   c.lineTo(last.x,last.y);
   c.strokeStyle=theme.done;
   c.lineWidth=2;
   c.stroke();
   c.lineTo(last.x,h);
   c.lineTo(response[0].x,h);
   c.globalAlpha=0.5;
   c.closePath();
   c.fillStyle=theme.done;
   c.fill();
   c.globalAlpha=1;
  }

  int.points.forEach(p=>{
   if(!p||typeof p.freq!=="number"||isNaN(p.freq)) return;
   const px=(Math.log10(p.freq)-1.3)/(Math.log10(20000)-1.3)*w;
   const py=p.type==="pk"?h/2-(p.gain||0):h-((p.q||1)*20);
   c.fillStyle=theme.done;
   c.beginPath(); c.arc(px,py,5,0,Math.PI*2); c.fill();
   c.fillStyle="#ffffff";
   c.font="bold 10px Arial";
   c.textAlign="center";
   const label=p.type==="pk"?"PK":p.type==="hi"?"HI":"LO";
   c.fillText(label,px,py-14);
   c.font="9px Arial";
   c.fillText(Math.round(p.freq)+"HZ("+p.id+")",px,py-4);
  });
 }
});

panel.add(eqCanvas);
globalRoot.add(bgRoot);
`,
	process: `
if(!int.points||int.points.length===0){
 fx.outL=fx.inL;
 fx.outR=fx.inR;
 fx.isTailActive=false;
}

if(!fx.nodes) fx.nodes={};
let currL=fx.inL;
let currR=fx.inR;
const sr=audioCtx.sampleRate;

int.points.forEach(p=>{
 if(!p||typeof p.freq!=="number"||isNaN(p.freq)) return;
 const node=fx.nodes[p.id]||(fx.nodes[p.id]={L:{x1:0,x2:0,y1:0,y2:0},R:{x1:0,x2:0,y1:0,y2:0}});
 let typeName;

if (p.type === "hi") typeName = "HiPass";
else if (p.type === "lo") typeName = "LoPass";
else typeName = "Peak";

const base = typeName + ' Index "' + p.id + '" ';

const autoFreq = fx.automation?.[base + "HZ"];
const autoGain = fx.automation?.[base + "VOL"];

 const freqVal=autoFreq??p.freq;
 const gainVal=autoGain??p.gain;
 const f0=Math.max(20,Math.min(freqVal,sr/2.1));
 const omega=2*Math.PI*f0/sr;
 const sn=Math.sin(omega);
 const cs=Math.cos(omega);
 const alpha=sn/(2*(p.q||1));
 let b0,b1,b2,a0,a1,a2;
 if(p.type==="lo"){
  b1=1-cs; b0=b2=b1/2; a0=1+alpha; a1=-2*cs; a2=1-alpha;
 } else if(p.type==="hi"){
  b1=-(1+cs); b0=b2=-b1/2; a0=1+alpha; a1=-2*cs; a2=1-alpha;
 } else {
  const A=Math.pow(10,(gainVal||0)/40);
  b0=1+alpha*A; b1=-2*cs; b2=1-alpha*A; a0=1+alpha/A; a1=-2*cs; a2=1-alpha/A;
 }
 const run=(v,st)=>{
  let y=(b0/a0)*v+(b1/a0)*st.x1+(b2/a0)*st.x2-(a1/a0)*st.y1-(a2/a0)*st.y2;
  st.x2=st.x1; st.x1=v; st.y2=st.y1; st.y1=y;
  return y;
 };
 currL=run(currL,node.L);
 currR=run(currR,node.R);
});

fx.outL=currL;
fx.outR=currR;
fx.time+=1/sr;
fx.silenceFrames=(Math.abs(fx.outL)+Math.abs(fx.outR)<0.00001)?(fx.silenceFrames||0)+1:0;
fx.isTailActive=fx.silenceFrames<512;
if(fx.time>fx.duration){
 fx.disconnect=true;
 fx.nodes=null;
 fx.time=0;
 fx.silenceFrames=0;
}
`
}
,
"bitcrusher":{
	interface: `
	int.automations = {
	"bitcrusher": { min: 0, max: 16, step: 1, defpoint: 1 },
	"downsample": { min: 0, max: 40, step: 0.1, defpoint: 1 },
	"wet": { min: 0, max: 1, step: 0.1, defpoint: 1 }
}
        const modal = new Node({
            style: { pos: 'abs', t: '0', l: '0', w: '100vw', h: '100vh', bg: '#0a0505', rad: 0, ov: 'hid' }
        });
        const panel = new Node({
            style: { pos: 'abs', t: '5%', l: '5%', w: '90%', h: '90%', bg: '#1a0f0f', rad: 10, pad: 20, border: "1px solid #ff4444" }
        });
        
        const createKnob = (label, prop, min, max, val, lPos, unit = "") => {
            const container = new Node({ style: { pos: 'abs', l: lPos, t: 10, w: 80, h: 120 } });
            
            const valLabel = new Node({ 
                value: val + unit, 
                style: { t: "10px", w: '100%', textAlign: 'center', size: 11, color: '#fff', family: 'monospace' } 
            });

            int[prop] = new Knob({
                min: min, max: max, value: val, sensitivity: 0.1,
                style: { w: 60, h: 60, knobColor: '#ff4444', trackColor: '#331111' },
                onInput: (v) => {
                    valLabel.value = (prop === "bits" ? Math.round(v) : v.toFixed(1)) + unit;
                }
            });
            container.add(int[prop]);
            container.add(valLabel);
            container.add(new Node({ 
                value: label, 
                style: { t: 75, w: '100%', textAlign: 'center', size: 10, color: '#ff4444', weight: 'bold' } 
            }));
            return container;
        };

        panel.add(createKnob("BITS", "bits", 1, 16, 8, "20px", " bit"));
        panel.add(createKnob("DOWNSAMP", "downsample", 1, 40, 1, "120px", "x"));
        panel.add(createKnob("MIX", "wet", 0, 1, 1, "220px", " %"));

        const visualizer = new CanvasNode({
            style: { w: "100%", h: 150, bg: "#000", rad: 5, t: 130, border: "1px solid #ff444433" },
            onDraw: (c, w, h) => {
	const bits = Math.round(int.bits?.val ?? 8);
	const ds = Math.max(1, int.downsample?.val ?? 1);
	const wet = int.wet?.val ?? 1;
	
	c.clearRect(0, 0, w, h);
	c.strokeStyle = "#ff4444";
	c.lineWidth = 2;
	c.beginPath();
	
	for (let x = 0; x < w; x++) {
		let p = (x / w) * Math.PI * 4;
		let drySig = Math.sin(p);
		
		let stepX = Math.floor(x / ds) * ds;
		let pStep = (stepX / w) * Math.PI * 4;
		let wetSig = Math.sin(pStep);
		
		let levels = Math.pow(2, bits);
		wetSig = Math.round(wetSig * levels) / levels;
		
		let mixedSig = drySig * (1 - wet) + wetSig * wet;
		let y = h / 2 + mixedSig * (h / 3);
		
		if (x === 0) c.moveTo(x, y);
		else c.lineTo(x, y);
	}
	c.stroke();
	c.fillStyle = "#ff4444";
	c.font = "12px monospace";
	c.textAlign = "left";
	
	c.fillText("BITS: " + bits, 10, 15);
	c.fillText("LEVELS: " + Math.pow(2, bits), 10, 30);
}
        });

        const updateLoop = () => {
            if (modal.parent) {
                visualizer.draw();
                requestAnimationFrame(updateLoop);
            }
        };
        updateLoop();

        panel.add(visualizer);
        modal.add(panel);
        globalRoot.add(modal);
    `,
	process: `
        if (fx.phaser === undefined) fx.phaser = 0;
        if (fx.lastL === undefined) fx.lastL = 0;
        if (fx.lastR === undefined) fx.lastR = 0;
        const getParam = (name, def) => {
       	const base = int[name]?.val ?? def;
       	const auto = fx.automation?.[name];
       	let v = (auto !== undefined ? base * auto : base);
       	if (v <= 0) v = 0.01;
       	return v;
        };
        const bits = getParam("bits",0)   
        const downsample = getParam("downsample",1)   
        const wet = getParam("wet",1) 
        fx.phaser++;
        if (fx.phaser >= downsample) {
            fx.phaser = 0;
            const levels = Math.pow(2, bits);
            fx.lastL = Math.round(fx.inL * levels) / levels;
            fx.lastR = Math.round(fx.inR * levels) / levels;
        }

        fx.outL = fx.inL * (1 - wet) + fx.lastL * wet;
        fx.outR = fx.inR * (1 - wet) + fx.lastR * wet;
        fx.isTailActive = false; 
 
    `
},
"delay":{
	interface: `
	int.automations = {
	"wet": { min: 0, max: 2, step: 0.1, defpoint: 1 },
	"feedback": { min: 0, max: 1, step: 0.1, defpoint: 1 },
	"damp": { min: 0, max: 2, step: 0.1, defpoint: 1 },
	"pre": { min: 0, max: 2, step: 0.1, defpoint: 1 },
}
        const modal = new Node({
            style: { pos: 'abs', t: '0', l: '0', w: '100vw', h: '100vh', bg: '#08080c', rad: 0, ov: 'hid' }
        });
        const panel = new Node({
            style: { pos: 'abs', t: '5%', l: '5%', w: '90%', h: '90%', bg: '#14141d', rad: 10, pad: 20, border: "1px solid #333" }
        });
        
        const createKnob = (label, prop, min, max, val, lPos) => {
            const container = new Node({ style: { pos: 'abs', l: lPos, t: 10, w: 80, h: 120 } });
            int[prop] = new Knob({
                min: min, max: max, value: val, sensitivity: 0.1,
                style: { w: 60, h: 60, knobColor: '#ffcc00', trackColor: '#222' }
            });
            container.add(int[prop]);
            container.add(new Node({ 
                value: label, 
                style: { t: 75, w: '100%', textAlign: 'center', size: 10, color: '#ffcc00', weight: 'bold' } 
            }));
            return container;
        };

        panel.add(createKnob("ECHO VOL", "echoVol", 0, 1, 0.5, "20px"));
        panel.add(createKnob("DELAY", "echoDelay", 0.01, 1, 0.3, "120px"));
        panel.add(createKnob("FEEDBACK", "echoFb", 0, 0.9, 0.4, "220px"));

        const visualizer = new CanvasNode({
            style: { w: "100%", h: 150, bg: "#000", rad: 5, t: 130 },
            onDraw: (c, w, h) => {
                const vol = int.echoVol?.val ?? 0;
                const fb = int.echoFb?.val ?? 0;
                const delay = int.echoDelay?.val ?? 0;
                
                c.strokeStyle = "#ffcc00";
                c.lineWidth = 2;
                let x = 20;
                let amp = h * 0.8 * vol;
                
                for(let i=0; i<50; i++) {
                    c.beginPath();
                    c.moveTo(x, h/2 - amp/2);
                    c.lineTo(x, h/2 + amp/2);
                    c.stroke();
                    x += delay * 100;
                    amp *= fb;
                    if(amp < 2) break;
                }
            }
        });
        panel.add(visualizer);
        modal.add(panel);
        globalRoot.add(modal);
    `,
	process: `
        const sr = audioCtx.sampleRate;
        if (!fx.echoBufferL) {
            fx.echoBufferL = new Float32Array(sr * 2);
            fx.echoBufferR = new Float32Array(sr * 2);
            fx.echoPos = 0;
            fx.silenceFrames = 0; 
        }
        const vol = int.echoVol?.val * (fx.automation?.power ?? 1) ?? 0.5;
        const delayTime = int.echoDelay?.val ?? 0.3;
        const fb = int.echoFb?.val ?? 0.4;
        if (!fx.echoBufferL || fx.echoBufferL.length === 0) return;
        const delaySamples = Math.floor(delayTime * sr);
        const readPos = (fx.echoPos - delaySamples + fx.echoBufferL.length) % fx.echoBufferL.length;

        const echoL = fx.echoBufferL[readPos];
        const echoR = fx.echoBufferR[readPos];

        fx.echoBufferL[fx.echoPos] = fx.inL + echoL * fb;
        fx.echoBufferR[fx.echoPos] = fx.inR + echoR * fb;
        fx.echoPos = (fx.echoPos + 1) % fx.echoBufferL.length;

        fx.outL = fx.inL + echoL * vol;
        fx.outR = fx.inR + echoR * vol;
        const threshold = 0.0001;
        if (Math.abs(fx.inL) < threshold && Math.abs(echoL) < threshold) {
            fx.silenceFrames++;
        } else {
            fx.silenceFrames = 0;
        }
        fx.isTailActive = (fx.silenceFrames < sr * 0.5);
    `
}
}
 
window.Effects["gain_and_limiter"] = {
	interface: `
int.automations = {
 "gain": { min: 0, max: 2, step: 0.01, defpoint: 1 },
 "boost": { min: 1, max: 4, step: 0.01, defpoint: 1 },
 "limit": { min: 0, max: 1, step: 0.01, defpoint: 0.9 }
};
const modal = new Node({ style:{ pos:'abs', t:0, l:0, w:'100vw', h:'100vh', bg:'#120000' }});
const panel = new Node({ style:{ pos:'abs', t:'10%', l:'10%', w:'80%', h:'200px', bg:'#220000', pad:20, rad:10 }});

const addKnob = (label, prop, min, max, val, x) => {
 const c = new Node({ style:{ pos:'abs', l:x, t:10, w:80, h:120 }});
 int[prop] = new Knob({
  min, max, value:val, sensitivity:0.2,
  style:{ w:60, h:60, knobColor:'#ff3333', trackColor:'#330000' }
 });
 c.add(int[prop]);
 c.add(new Node({ value:label, style:{ t:0, w:'100%', textAlign:'center', size:10, color:'#ff6666' }}));
 panel.add(c);
};

addKnob("GAIN","gain",0,2,1,"20px");
addKnob("BOOST","boost",1,4,1,"120px");
addKnob("LIMIT","limit",0,1,0.9,"220px");

globalRoot.add(modal);
modal.add(panel);
`,
	process: `
const g = fx.automation?.gain ?? int.gain?.val ?? 1;
const boost = fx.automation?.boost ?? int.boost?.val ?? 1;
const limit = fx.automation?.limit ?? int.limit?.val ?? 0.9;
let l = fx.inL * g * boost;
let r = fx.inR * g * boost;
// soft clip
l = Math.tanh(l);
r = Math.tanh(r);
// hard limit
if (l > limit) l = limit;
if (l < -limit) l = -limit;
if (r > limit) r = limit;
if (r < -limit) r = limit;
fx.outL = l;
fx.outR = r;
fx.isTailActive = false;
`
};
window.Instruments = {
	"none": {
		synth: () => 0
	},
	"chip osc": {
	interface: `
	int.automations={
		"volume": { min: 0, max: 1, step: 0.1,defpoint:1 },
			"mod": { min: 0, max: 1, step: 0.025,defpoint:1},
	}
        const modal = new Node({
            style: { pos: 'abs', t: '0', l: '0', w: '100vw', h: '100vh', bg: '#0b0b11', rad: 0, ov: 'hid' }
        });
        const panel = new Node({style:{pos:'abs',t:'5%',l:'5%',w:'90%',h:'calc(90% - 70px)',bg:'#161625',pad:20,rad:10,border:'1px solid #333'}});
         
        const waves = ["PWM SQUARE", "TRAPEZOID", "PWM TRIANGLE", "PWM LOGSAW", "SIN LOG MIX"];
        if (int.waveIdx === undefined) int.waveIdx = 0;
        if (int.offset === undefined) int.offset = 0;
        const title = new Node({ value: "OSCILLATOR TYPE: " + waves[int.waveIdx], style: { size: 14, color: '#aaaaff', weight: 'bold', mb: 10 } });
        panel.add(title);
        const waveCanvas = new CanvasNode({
            style: { w: "100%", h: 120, bg: "#000", rad: 5, border: "2px solid #aaaaff33", cursor: "pointer", mt: 10 },
            onDraw: (c, w, h) => {
                c.strokeStyle = "#aaaaff";
                c.lineWidth = 3;
                c.beginPath();
                const centerY = h / 2;
                const amp = h * 0.3;
                const type = int.waveIdx;
                const mod = int.modKnob?.val ?? 0.5;
                const rise = (int.riseKnob?.val ?? 0.1) * 0.5;
                int.offset = (int.offset + 0.001) % 1.0;
                for (let x = 0; x < w; x++) {
                    let p = (x / w*3 + int.offset) % 1.0;
                    let sig = 0;
                    
                    if (type === 0) sig = p < mod ? 1 : -1;
                    else if (type === 1) {
                        if (p < rise) sig = -1 + (p / rise) * 2;
                        else if (p < rise + mod * 0.5) sig = 1;
                        else if (p < rise * 2 + mod * 0.5) sig = 1 - ((p - (rise + mod * 0.5)) / rise) * 2;
                        else sig = -1;
                    }
                    else if (type === 2) sig = ((p < mod) ? (p / mod) : (1 - (p - mod) / (1 - mod))) * 2 - 1;
                    else if (type === 3) {
                        let log = (Math.log(1 + p * 9) / Math.log(10));
                        sig = (p < mod) ? log : -log;
                    }
                    else if (type === 4) {
                        let logSaw = (Math.log(1 + p * 9) / Math.log(10)) * 2 - 1;
                        let sinPart = Math.sin(p * Math.PI * 2);
                        sig = logSaw * (1 - mod) + sinPart * mod;
                    }

                    let y = centerY - sig * amp;
                    if (x === 0) c.moveTo(x, y); else c.lineTo(x, y);
                }
                c.stroke();
                
                if (int.riseContainer) {
                    int.riseContainer.style.opacity = (type === 1) ? 1 : 0;
                }
            }
        });
        waveCanvas.onClick = () => {
            int.waveIdx = (int.waveIdx + 1) % waves.length;
            title.value = "OSCILLATOR TYPE: " + waves[int.waveIdx];
        };
        panel.add(waveCanvas);
        const controls = new Node({ style: { w: '100%', h: 100, mt: 20 } });
        const addKnob = (label, prop, min, max, val, l) => {
            const container = new Node({ style: { float: 'left', w: 70, h: 100, l: l } });
            int[prop] = new Knob({
                min: min, max: max, value: val, sensitivity: 0.25,
                style: { w: 60, h: 60, knobColor: '#aaaaff', trackColor: '#222233' }
            });
            container.add(int[prop]);
            container.add(new Node({ value: label, style: { t: 5, w: 60, textAlign: 'center', size: 9, color: '#aaa' } }));
            controls.add(container);
            return container; 
        };
        addKnob("MOD", "modKnob", 0.0, 1.0, 0.5, 0);
        int.riseContainer = addKnob("RISE", "riseKnob", 0.01, 0.5, 0.1, 10);
        addKnob("ATTACK", "attackKnob", 0.0, 1.0, 0.01, 10);
        addKnob("DECAY", "decayKnob", 0.0, 1.0, 0.2, 10);
        addKnob("ARP", "arpSpeed", 0, 12, 0, 10);
        addKnob("GAIN", "gainKnob", 0.0, 3.0, 3, 10);
        panel.add(controls);
        modal.add(panel);
        globalRoot.add(modal);
    `,
	synth: `
        const sr = audioCtx.sampleRate;
        if (synth.phase === undefined) synth.phase = 0;
        if (synth.time === undefined) synth.time = 0;
        if (synth.arpStep === undefined) synth.arpStep = 0;
        const speedBeats = int?.arpSpeed?.val ?? 0;
        const waveType = int?.waveIdx ?? 0;
        const mod1 = int?.modKnob?.val ?? 0.5;
        const mod2 = synth.automation?.mod ;
        const mod = (mod2 !== undefined ? mod2 : mod1);
        const rise = (int?.riseKnob?.val ?? 0.1) * 0.5; 
        const attackVal = int?.attackKnob?.val ?? 0.01;
        const decayVal = int?.decayKnob?.val ?? 0.2;
        const gain = int?.gainKnob?.val ?? 3;
        const midiSet = synth.pattern?.playingMidi || new Set();
        const notes = Array.from(midiSet).sort((a, b) => a - b);
        let freq = synth.notefreq;
        synth.noChordProgression=false;
        if (speedBeats > 0) {
        synth.noChordProgression=true;
            const bpm = synth.pattern?.bpm || 120;
            synth.arpStep += (1 / sr) * ((bpm / 60) * speedBeats);
            if (notes.length > 0) {
                const idx = Math.floor(synth.arpStep) % notes.length;
                freq = 440 * Math.pow(2, (notes[idx] - 69) / 12);
            }
        }
        synth.phase += freq / sr;
        if (synth.phase >= 1.0) synth.phase -= 1.0;
        const p = synth.phase;
        let sig = 0;
        if (waveType === 0) sig = p < mod ? 1 : -1;
        else if (waveType === 1) {
            if (p < rise) sig = -1 + (p / rise) * 2;
            else if (p < rise + mod * 0.5) sig = 1;
            else if (p < rise * 2 + mod * 0.5) sig = 1 - ((p - (rise + mod * 0.5)) / rise) * 2;
            else sig = -1;
        }
        else if (waveType === 2) sig = ((p < mod) ? (p / mod) : (1 - (p - mod) / (1 - mod))) * 2 - 1;
        else if (waveType === 3) {
            let log = (Math.log(1 + p * 9) / Math.log(10));
            sig = (p < mod) ? log : -log;
        }
        else if (waveType === 4) {
            let logSaw = (Math.log(1 + p * 9) / Math.log(10)) * 2 - 1;
            let sinPart = Math.sin(p * Math.PI * 2);
            sig = logSaw * (1 - mod) + sinPart * mod;
        }
        let env = 0;
        const aTime = attackVal * 2.0;
        if (synth.time < aTime) {
            env = synth.time / aTime;
        } else {
            const dTime = synth.time - aTime;
            const speed = Math.pow(decayVal, 2) * 50;
            env = Math.exp(-dTime * speed);
        }
        const remaining = synth.duration - synth.time;
        if (remaining < 0.001) {
         env *= Math.max(0, remaining / 0.001);
        }
        if (synth.time > synth.duration) synth.disconnect = true;
        synth.time += 1 / sr;
        const vol = synth.automation?.volume ?? 1;
        const defVol = 1;
        const finalVol = (vol !== undefined ? vol : defVol);
        const final = (sig * env * gain * 0.15) * finalVol;
        synth.outL = final;
        synth.outR = final;
    `
} ,
"wave player": {
    interface: `
    int.saved = int.saved || {};
    const modal = new Node({
        style:{ pos:'abs', t:'0', l:'0', w:'100vw', h:'100vh', bg:'#111' }
    });
    const panel = new Node({
        style:{ pos:'abs', t:'5%', l:'5%', w:'90%', h:'calc(90% - 70px)', bg:'#222', pad:20, rad:10, border:'1px solid #444' }
    });
    
    const label = new Node({ value:"LOAD AUDIO FILE (MP3/WAV)", style:{ size:12, color:'#66aaff', mb:10, weight:'bold' }});
    panel.add(label);

    int.fileInput = new InputFile({
        accept: "audio/*",
        proxy: int,
        style:{ w:250, h:35, bg:'#333', color:'#fff', rad:5 }
    });
    
    int.fileInput.onChange = async (file) => {
        try {
            const arr = await file.arrayBuffer();
            const decoded = await audioCtx.decodeAudioData(arr);
            int.audioBuffer = decoded;  
            label.value = "LOADED: " + file.name;
        } catch (e) {
            console.error("Load Error:", e);
            label.value = "ERROR LOADING FILE";
        }
    };
    panel.add(int.fileInput);
    
    const controls = new Node({ style: { w:'100%', h:150, mt:20 } });
    
    const addKnob = (name, prop, min, max, val, l) => {
        const c = new Node({ style: { float:'left', w:80, h:120, ml:l } });
        int[prop] = new Knob({
            min: min, max: max, value: val,
            style: { w:60, h:60, knobColor:'#66aaff', trackColor:'#111' }
        });
        c.add(int[prop]);
        c.add(new Node({ value: name, style: { t:5, w:60, textAlign:'center', size:10, color:'#888' } }));
        controls.add(c);
    };

    addKnob("ROOT", "rootKnob", 12, 108, 60, 0);
    addKnob("VOL", "volKnob", 0, 2, 1, 10);
    addKnob("PAN", "panSlider", -1, 1, 0, 10);
    addKnob("EASE OUT", "easeOut", 0, 2.0, 0, 10); 

    if (int.saved.loop === undefined) int.saved.loop = false;
    const loopBtn = new Node({
        value: int.saved.loop ? "MODE: LOOP" : "MODE: ONCE",
        style: { float:'left', w:120, h:40, bg:'#333', color:'#fff', rad:5, ml:20, mt:10, textAlign:'center', lineHeight:'40px', cursor:'pointer' }
    });
    loopBtn.onClick = () => {
        int.saved.loop = !int.saved.loop;
        loopBtn.value = int.saved.loop ? "MODE: LOOP" : "MODE: ONCE";
    };
    controls.add(loopBtn);

    panel.add(controls);
    modal.add(panel);
    globalRoot.add(modal);
    `,
    synth: `
    if (!int.audioBuffer || !int.audioBuffer.left) return;

    if (synth.playhead === undefined) synth.playhead = 0;
    if (synth.time === undefined) synth.time = 0;

    const dataL = int.audioBuffer.left;
    const dataR = int.audioBuffer.right;
    const len = dataL.length;
    const sr = audioCtx.sampleRate;
    
    const root = int.rootKnob?.val ?? 60;
    const vol = int.volKnob?.val ?? 1.0;
    const easeOut = int.easeOut ? int.easeOut.val : 0;
    
    const ratio = Math.pow(2, (synth.noteNumber - root) / 12);
    if (synth.playhead >= len - 1) {
        if (int.saved?.loop) {
            synth.playhead = 0;
        } else {
            synth.disconnect = true;
            return;
        }
    }

    let i0 = Math.floor(synth.playhead);
    let i1 = i0 + 1 >= len ? i0 : i0 + 1;
    let fract = synth.playhead - i0;
    let sL = dataL[i0] + (dataL[i1] - dataL[i0]) * fract;
    let sR = dataR[i0] + (dataR[i1] - dataR[i0]) * fract;

    let env = 1;
    if (synth.time > synth.duration) {
        if (easeOut > 0) {
            const releaseTime = synth.time - synth.duration;
            env = Math.exp(-releaseTime * (1 / easeOut) * 5);
        } else {
            env = 0;
        }
    } else if (synth.time > synth.duration - 0.02) {
        if (easeOut <= 0) {
            env = Math.max(0, (synth.duration - synth.time) / 0.02);
        }
    }

    const pan = int.panSlider?.val ?? 0;
    const final = env * vol * 0.7;
    synth.outL = sL * final * Math.min(1, 1 - pan);
    synth.outR = sR * final * Math.min(1, 1 + pan);

    synth.playhead += ratio;
    synth.time += 1 / sr;
    const isFinished = (easeOut > 0) ? (env < 0.001) : (synth.time >= synth.duration);
    if (isFinished && !int.saved?.loop) {
        synth.disconnect = true;
    }
    `
},
"wave player": {
	interface: `
    int.saved = int.saved || {};
    const modal = new Node({
        style:{ pos:'abs', t:'0', l:'0', w:'100vw', h:'100vh', bg:'#111' }
    });
    const panel = new Node({
        style:{ pos:'abs', t:'5%', l:'5%', w:'90%', h:'calc(90% - 70px)', bg:'#222', pad:20, rad:10, border:'1px solid #444' }
    });
    
    const label = new Node({ value:"LOAD AUDIO FILE (MP3/WAV)", style:{ size:12, color:'#66aaff', mb:10, weight:'bold' }});
    panel.add(label);

    int.fileInput = new InputFile({
        accept: "audio/*",
        proxy: int,
        style:{ w:250, h:35, bg:'#333', color:'#fff', rad:5 }
    });
    
    int.fileInput.onChange = async (file) => {
        try {
            const arr = await file.arrayBuffer();
            const decoded = await audioCtx.decodeAudioData(arr);
            int.audioBuffer = decoded;  
            label.value = "LOADED: " + file.name;
        } catch (e) {
            console.error("Load Error:", e);
            label.value = "ERROR LOADING FILE";
        }
    };
    panel.add(int.fileInput);
    
    const controls = new Node({ style: { w:'100%', h:150, mt:20 } });
    
    const addKnob = (name, prop, min, max, val, l) => {
        const c = new Node({ style: { float:'left', w:80, h:120, ml:l } });
        int[prop] = new Knob({
            min: min, max: max, value: val,
            style: { w:60, h:60, knobColor:'#66aaff', trackColor:'#111' }
        });
        c.add(int[prop]);
        c.add(new Node({ value: name, style: { t:5, w:60, textAlign:'center', size:10, color:'#888' } }));
        controls.add(c);
    };

    addKnob("ROOT", "rootKnob", 12, 108, 60, 0);
    addKnob("VOL", "volKnob", 0, 2, 1, 10);
    addKnob("PAN", "panSlider", -1, 1, 0, 10);
    addKnob("EASE OUT", "easeOut", 0, 2.0, 0, 10); 

    if (int.saved.loop === undefined) int.saved.loop = false;
    const loopBtn = new Node({
        value: int.saved.loop ? "MODE: LOOP" : "MODE: ONCE",
        style: { float:'left', w:120, h:40, bg:'#333', color:'#fff', rad:5, ml:20, mt:10, textAlign:'center', lineHeight:'40px', cursor:'pointer' }
    });
    loopBtn.onClick = () => {
        int.saved.loop = !int.saved.loop;
        loopBtn.value = int.saved.loop ? "MODE: LOOP" : "MODE: ONCE";
    };
    controls.add(loopBtn);

    panel.add(controls);
    modal.add(panel);
    globalRoot.add(modal);
    `,
	synth: `
    if (!int.audioBuffer || !int.audioBuffer.left) return;

    if (synth.playhead === undefined) synth.playhead = 0;
    if (synth.time === undefined) synth.time = 0;

    const dataL = int.audioBuffer.left;
    const dataR = int.audioBuffer.right;
    const len = dataL.length;
    const sr = audioCtx.sampleRate;
    
    const root = int.rootKnob?.val ?? 60;
    const vol = int.volKnob?.val ?? 1.0;
    const easeOut = int.easeOut ? int.easeOut.val : 0;
    
    const ratio = Math.pow(2, (synth.noteNumber - root) / 12);
    if (synth.playhead >= len - 1) {
        if (int.saved?.loop) {
            synth.playhead = 0;
        } else {
            synth.disconnect = true;
            return;
        }
    }

    let i0 = Math.floor(synth.playhead);
    let i1 = i0 + 1 >= len ? i0 : i0 + 1;
    let fract = synth.playhead - i0;
    let sL = dataL[i0] + (dataL[i1] - dataL[i0]) * fract;
    let sR = dataR[i0] + (dataR[i1] - dataR[i0]) * fract;

    let env = 1;
    if (synth.time > synth.duration) {
        if (easeOut > 0) {
            const releaseTime = synth.time - synth.duration;
            env = Math.exp(-releaseTime * (1 / easeOut) * 5);
        } else {
            env = 0;
        }
    } else if (synth.time > synth.duration - 0.02) {
        if (easeOut <= 0) {
            env = Math.max(0, (synth.duration - synth.time) / 0.02);
        }
    }

    const pan = int.panSlider?.val ?? 0;
    const final = env * vol * 0.7;
    synth.outL = sL * final * Math.min(1, 1 - pan);
    synth.outR = sR * final * Math.min(1, 1 + pan);

    synth.playhead += ratio;
    synth.time += 1 / sr;
    const isFinished = (easeOut > 0) ? (env < 0.001) : (synth.time >= synth.duration);
    if (isFinished && !int.saved?.loop) {
        synth.disconnect = true;
    }
    `
},
};

 