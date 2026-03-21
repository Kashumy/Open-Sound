 
const audioCtx = new(window.AudioContext || window.webkitAudioContext)();  
const analyser = audioCtx.createAnalyser();  
const analyserL = audioCtx.createAnalyser();  
const analyserR = audioCtx.createAnalyser();  
analyserL.fftSize = analyserR.fftSize = 2048;  
const splitter = audioCtx.createChannelSplitter(2);  
analyser.connect(splitter);  
splitter.connect(analyserL, 0);  
splitter.connect(analyserR, 1);  
const dataArrayL = new Uint8Array(analyserL.frequencyBinCount);  
const dataArrayR = new Uint8Array(analyserR.frequencyBinCount);  
let instrumentStates = {};  
const effectStates = {};  
let activeSynths = [];  
let activeNotes = [];  
const proxyCache = new Map();  
let playheadStep = 0;  
let currentBufferSource = false;  
let anabledScroll = 0;  
const getInstrument = (pattern) => {  
	const name = pattern?.instrument || "chip osc";  
	const inst = window.Instruments[name] || window.Instruments["chip osc"];  
	inst.name = name;  
	return inst;  
};  
const unlockAudio = async () => { if (audioCtx.state === "suspended") await audioCtx.resume();  
	initAudio() };  
let workletNode = null;  
const enableTempoScroll = (t) => { anabledScroll = t; };  
let renderAbort = false  
const getCachedProxy = (type, name, id, suffix = "_inst_", patternId = "") => {  
	const key = `${name}${suffix}${id}${patternId}`;  
	if (!proxyCache.has(key)) {  
		const manager = type === 'instrument' ? InstrumentManager : FXManager;  
		const proxy = manager.init(name, null, null, id, suffix);  
		proxyCache.set(key, proxy);  
	}  
	return proxyCache.get(key);  
};  
const BLOCKED_KEYS = new Set([
 "parent", "children", "ui", "node",
 "fileInput", "file",
 "tempBuf", "tempInstList", "tempPdta",
 "donotexport", "ds"
]);

const cleanObject = (obj) => {
 if (!obj || typeof obj !== "object") return obj;
 
 if (obj instanceof Int16Array || obj instanceof Float32Array) {
  return obj;
 }
 
 if (Array.isArray(obj)) {
  return obj.map(cleanObject);
 }
 
 const out = {};
 
 for (const key in obj) {
  if (BLOCKED_KEYS.has(key)) continue;
  
  const val = obj[key];
  if (val === undefined || typeof val === "function") continue;
  
  if (val && typeof val === "object") {
   if (val.val !== undefined || val.value !== undefined) {
    out[key] = { val: Number(val.val ?? val.value) };
   } else {
    out[key] = cleanObject(val); 
   }
  } else {
   out[key] = val;
  }
 }
 
 return out;
};

const getAudioSafeProxy = (proxy) => {
 return cleanObject(proxy);
};;  
  
const InstrumentSynthesis = (params, patternId) => {  
    const { noteNumber, noteLengthInBeats, pattern, volume = 1, endStep } = params;  
    if (!workletNode) return;  
    if (bufferLoaded) return;  
    const inst = getInstrument(pattern);  
    const instKey = `${inst.name}_inst_${pattern.instance || 0}`;  
    const stateKey = `${instKey}_pat_${patternId}`;  
    const instProxyRaw = getCachedProxy('instrument', inst.name, pattern.instance || 0, "_inst_", "");  
    let proxy = getAudioSafeProxy(instProxyRaw);  
    
    if (Array.isArray(inst.sharedobject)) {
        for (const pair of inst.sharedobject) {
            const from = pair[0], to = pair[1] || pair[0];
            if (from === "ds") continue;
            const source = instProxyRaw[from];
            if (source !== undefined) {
                if (source && typeof source === 'object' && !Array.isArray(source)) {
                    if (source.value !== undefined || source.val !== undefined) {
                        proxy[to] = { val: Number(source.value ?? source.val) };
                    } else {
                        const cleanObj = {};
                        for (const k in source) {
                            if (typeof source[k] !== 'function' && k !== 'node' && k !== 'parent' && k !== 'children') {
                                cleanObj[k] = source[k];
                            }
                        }
                        proxy[to] = cleanObj;
                    }
                } else {
                    proxy[to] = source;
                }
            }
        }
    }
     
    const voiceData = {  
        synthCode: inst.synth,  
        proxy,  
        stateKey,  
        instKey,  
        volume: volume * (window.settings?.songVolume || 1),  
        model: inst.model,  
        fxHash: JSON.stringify(pattern.fx || []),  
        fxChain: (pattern.fx || []).map(fxKey => {  
            const type = fxKey.split("_fx_")[0];  
            return {  
                id: fxKey,  
                code: window.Effects[type].process,  
                proxy: getAudioSafeProxy(getCachedProxy('effect', type, parseInt(fxKey.split("_fx_")[1]), "_fx_"), true)  
            };  
        }),  
        ctx: {  
            notefreq: 440 * 2 ** ((noteNumber - 69) / 12),  
            noteNumber,  
            time: 0,  
            step: 0,  
            duration: (noteLengthInBeats / 4) * (60 / (window.BPM || 120)),   
            endStep,  
            disconnect: false,  
            outL: 0, outR: 0,  
            automation: {},  
            pattern: { ...pattern, bpm: window.BPM || 120 }  
        }  
    };   
    workletNode.port.postMessage({ type: 'ADD_VOICE', voice: voiceData });  
};  
;  
const initAudio = async () => {  
	if (audioCtx.state === "suspended") await audioCtx.resume();  
	if (!workletNode) {  
		try {  
			await audioCtx.audioWorklet.addModule('worklet.js');  
			workletNode = new AudioWorkletNode(audioCtx, 'worklet-processor', {  
				outputChannelCount: [2]  
			});  
			workletNode.connect(analyser);  
			analyser.connect(audioCtx.destination);  
		} catch (e) {  
			console.error(e);  
		}  
	}  
	workletNode.port.onmessage = e => {  
		if (e.data.type === "DEBUG") {  
			console.log(e.data.data);  
		}  
	};  
};  
const getOptimizedTrackPatterns = (track) => {  
	if (track.patterns.length <= 1) return track.patterns;  
	const sorted = [...track.patterns].sort((a, b) => a[0] - b[0]);  
	const optimized = [];  
	let current = [...sorted[0]];  
	for (let i = 1; i < sorted.length; i++) {  
		const next = sorted[i];  
		const p1 = patterns[current[2]];  
		const p2 = patterns[next[2]];  
		const sameInst = p1.instrument === p2.instrument;  
		const sameFX = JSON.stringify(p1.fx) === JSON.stringify(p2.fx);  
		const isContinuous = current[0] + current[1] === next[0];  
		if (sameInst && sameFX && isContinuous) {  
			current[1] += next[1];  
			const offset = next[0] - current[0];  
			p2.notes.forEach(n => {  
				const exists = p1.notes.find(on => on.x === n.x + offset && on.y === n.y);  
				if (!exists) p1.notes.push({ ...n, x: n.x + offset });  
			});  
		} else {  
			optimized.push(current);  
			current = [...next];  
		}  
	}  
	optimized.push(current);  
	return optimized;  
};  
function buildAutomationMap() {  
    const autoMap = { global: {} };  
    for (const track of tracks) {  
        if (track.muted) continue;  
        for (const [startStep, width, patId] of track.patterns) {  
        const pat = patterns[patId];  
        if (!pat || pat.type !== "mod" || !pat.associated) continue;  
        const [target, param, subParam] = pat.associated;  
        if (playheadStep >= startStep && playheadStep < startStep + width) {  
        if (target === "SONG") {  
        autoMap.global[param] = {  
        points: pat.points,  
        min: pat.min || 0,  
        max: pat.max || 1,  
        clipStart: startStep,  
        isStep: pat.config?.isStep === true  
        };  
        } else {  
        let stateKey = target.includes("_inst_") ? target : target;  
        let paramName = param;  
        if (subParam) {  
        paramName = subParam;  
        stateKey = param;        }  
        if (!autoMap[stateKey]) autoMap[stateKey] = {};  
        autoMap[stateKey][paramName] = {  
        points: pat.points,  
        min: pat.min || 0,  
        max: pat.max || 1,  
        clipStart: startStep,  
        isStep: pat.config?.isStep === true  
        };  
        }  
        }  
        }  
    }  
    return autoMap;  
}    
  
  
function updateFx(pattern,patternId) {  
	if (!workletNode) return;  
	const stateKey = `${pattern.instrument}_inst_${pattern.instance || 0}_pat_${patternId}`;  
	const autoMap = {};  
	if (pattern.associated) {  
		const [instName, stKey] = pattern.associated;  
		if (buildAutomationMap()[stKey]) {  
			autoMap[stKey] = buildAutomationMap()[stKey];  
		}  
	}  
	workletNode.port.postMessage({  
		type: "UPDATE_INSTANCE_FX",  
		stateKey,  
		fxHash: JSON.stringify(pattern.fx || []),  
		fxChain: (pattern.fx || []).map(fxKey => {  
			const type = fxKey.split("_fx_")[0];  
			return {  
				id: fxKey,  
				code: window.Effects[type].process,  
				proxy: getAudioSafeProxy(  
					getCachedProxy('effect', type, parseInt(fxKey.split("_fx_")[1]), "_fx_"),  
					true  
				)  
			};  
		})  
	});  
	workletNode.port.postMessage({  
		type: "AUTOMATION_DATA",  
		data: buildAutomationMap()  
	});  
}  
const playNote = async (  
    noteNumber,  
    noteLengthInBeats = 1,  
    instName,  
    patternId,  
    volume,  
    preview = false,  
    endStep  
) => {  
    const pattern = patterns[patternId];  
    if (!pattern) return;  
    if (preview) {  
        stopAllSynths();  
        const inst = getInstrument(pattern);  
        proxyCache.delete(`${inst.name}_inst_${pattern.instance || 0}`);  
        if (pattern.fx) {  
            pattern.fx.forEach(fxKey => proxyCache.delete(fxKey));  
        }  
        updateFx(pattern, patternId);  
    }  
    InstrumentSynthesis(  
        { noteNumber, noteLengthInBeats, pattern, volume: volume ?? 1, endStep },  
        patternId  
    );  
};  
;  
const stopAllSynths = () => {  
	if (workletNode) {  
		workletNode.port.postMessage({ type: 'STOP_ALL' });  
	}  
	if (typeof tracks !== 'undefined') {  
		tracks.forEach(track => {  
			track.patterns.forEach(([, , patId]) => {  
				const pattern = patterns[patId];  
				if (pattern?.notes) {  
					pattern.notes.forEach(note => {  
						note.played = false;  
					});  
				}  
			});  
		});  
	}  
	if (currentBufferSource) {  
		try {  
			currentBufferSource.stop();  
		} catch (e) {}  
		currentBufferSource = null;  
	}  
};  
function getAutomationValue(auto, currentStep) {  
 if (!auto || !auto.points || auto.points.length === 0) return undefined;  
 const pts = auto.points;  
 const localStep = currentStep - (auto.clipStart || 0);  
 const isStep = auto.isStep === true;  
 const patternLength = auto.patternLength || 8;  
 const maxLength = auto.maxPatternLength || 8;  
 const ratio = Math.min(patternLength / maxLength, 1);  
 let val;  
 if (localStep <= pts[0].x) {  
  val = pts[0].y;  
 } else if (localStep >= pts[pts.length - 1].x) {  
  const start = pts[0].y;  
  const end = pts[pts.length - 1].y;  
  const scaledEnd = start + (end - start) * ratio;  
  val = scaledEnd;  
 } else {  
  for (let i = 0; i < pts.length - 1; i++) {  
   if (localStep >= pts[i].x && localStep <= pts[i + 1].x) {  
    if (isStep) {  
     val = pts[i].y;  
    } else {  
     const t = (localStep - pts[i].x) / (pts[i + 1].x - pts[i].x);  
     const start = pts[i].y;  
     const end = pts[i + 1].y;  
     const scaledEnd = start + (end - start) * ratio;  
     val = start + t * (scaledEnd - start);  
    }  
    break;  
   }  
  }  
 }  
 return auto.min + val * (auto.max - auto.min);  
}  
  async function renderSongBuffer(startStep = 0) {  
    const sharedData = {};  
    const sr = audioCtx.sampleRate;  
    const stepsPerBeat = 4;  
    let maxStep = startStep;  
    tracks.forEach(track => {  
        track.patterns.forEach(([s, w]) => { if (s + w > maxStep) maxStep = s + w; });  
    });  
    const allModPatterns = [];  
   for (const track of tracks) {  
        if (track.muted) continue;  
        track.patterns.forEach(([s, w, id]) => {
        const p = patterns[id];  
        if (!p) return;  
        if (p.type === "mod" && p.associated) {  
        allModPatterns.push({  
        start: s,  
        end: s + w,  
        pat: {  
        points: p.points,  
        min: p.min ?? 0,  
        max: p.max ?? 1,  
        associated: p.associated,  
        clipStart: s,  
        isStep: p.config?.isStep === true  
        }  
        });  
        }  
        });  
    }
 const getSampleForStep = (targetStep) => {
 	let step = startStep;
let sample = 0;
let currentBpm = window.BPM || 120;
while (step < targetStep) {
	let bpmVal = null;
	for (let i = 0; i < allModPatterns.length; i++) {
		const m = allModPatterns[i];
		if (step >= m.start && step < m.end && m.pat.associated[0] === "SONG" && m.pat.associated[1] === "BPM") {
			bpmVal = getAutomationValue(m.pat, step);
		}
	}
	if (bpmVal !== null) currentBpm = bpmVal;
	step += ((currentBpm / 60) * stepsPerBeat) / sr;
	sample++;
}
return sample;
 }
    const totalSamples =   getSampleForStep(maxStep);  
    const buffer = audioCtx.createBuffer(2, totalSamples, sr);  
    const outL = buffer.getChannelData(0);  
    const outR = buffer.getChannelData(1);  
    const events = [];  
    const effectCache = new Map();  
    const persistentStates = new Map();  
    const orphanedTails = [];  
   
    for (const track of tracks) {  
        if (track.muted) continue;  
        for (const [s, w, id] of track.patterns) {
       	const p = patterns[id];  
       	if (!p || !p.notes) continue;  
        const inst = getInstrument(p);  
        if (!inst._compiled) inst._compiled = new Function("synth", "int", "audioCtx", inst.synth);  
        const instProxyRaw = getCachedProxy("instrument", p.instrument, p.instance || 0);  
        const proxy = getAudioSafeProxy(instProxyRaw);  
        if (Array.isArray(inst.sharedobject)) {  
        for (const pair of inst.sharedobject) {  
        const from = pair[0];  
        const to = pair[1] || pair[0];  
        if (from === "saved") {  
        const key = `${p.instrument}_${p.instance || 0}_shared`;  
        if (!sharedData[key]) sharedData[key] = instProxyRaw.saved;  
        proxy[to] = sharedData[key];  
        } else if (instProxyRaw[from] !== undefined) {  
        proxy[to] = instProxyRaw[from];  
        }  
        }  
        }  
        const instKey = `${inst.name}_inst_${p.instance || 0}`;  
        const stateKey = `${instKey}_pat_${id}`;  
        for (const note of p.notes) {  
        const noteStartStep = s + note.x;  
        const patternEnd = s + w;  
        if (noteStartStep < startStep || noteStartStep >= patternEnd) continue; 
        const noteEndStep = Math.min(noteStartStep + note.w, patternEnd);  
        const sampleIndex =   getSampleForStep(noteStartStep);  
        const stopSample =   getSampleForStep(noteEndStep);  
        events.push({  
        sampleIndex: sampleIndex ,  
        stopSample: stopSample ,  
        note, inst, pattern: p, stateKey, instKey,  
        fxHash: JSON.stringify(p.fx || []),  
        instProxy: proxy  
        });  
        }  
        }  
           
    }  
    events.sort((a, b) => a.sampleIndex - b.sampleIndex);  
    let renderSynths = [];  
    let eventIdx = 0;  
    const mockCtx = { sampleRate: sr };  
    const invSr = 1 / sr;  
    let currentGlobalStep = startStep;  
    const globalAutoValues = {};  
    for (let j = 0; j < totalSamples; j++) {  
        if (renderAbort) return buffer;  
        const globalTime = j / sr;
       if ((j & 4095) === 0 || j === totalSamples - 1) {  
	const percent = (j / totalSamples) * 100;  
	exportProgress.style.w = Math.floor(percent) + "%";  
	await new Promise(requestAnimationFrame);   
}  
        let currentBpm = window.BPM || 120;  
        for (let i = 0; i < allModPatterns.length; i++) {  
        const m = allModPatterns[i];  
        if (currentGlobalStep >= m.start && currentGlobalStep < m.end) {  
        const target = m.pat.associated[0];  
        const param = m.pat.associated[1];  
        const subParam = m.pat.associated[2];  
        let sKey = target === "SONG" ? "global" : target;  
        let pName = param;  
        if (subParam) {  
        sKey = param;  
        pName = subParam;  
        }  
        if (!globalAutoValues[sKey]) globalAutoValues[sKey] = {};  
        const val = getAutomationValue(m.pat, currentGlobalStep);  
        if (val !== null) {  
        globalAutoValues[sKey][pName] = val;  
        if (sKey === "global" && pName === "BPM") currentBpm = val;  
        }  
        }  
        }  
        const deltaStepPerSample = ((currentBpm / 60) * stepsPerBeat) / sr;  
        while (eventIdx < events.length && events[eventIdx].sampleIndex <= j) {  
        const ev = events[eventIdx];  
        let instState = persistentStates.get(ev.stateKey);  
        if (!instState) {  
        instState = { fxChain: [], fxHash: "" };  
        persistentStates.set(ev.stateKey, instState);  
        }  
        if (instState.fxHash !== ev.fxHash) {  
        instState.fxChain = (ev.pattern.fx || []).map(fxKey => {  
        const type = fxKey.split("_fx_")[0];  
        if (!effectCache.has(type)) effectCache.set(type, new Function("fx", "int", "audioCtx", window.Effects[type].process));  
        return {  
        id: fxKey,  
        process: effectCache.get(type),  
        proxy: getAudioSafeProxy(getCachedProxy('effect', type, parseInt(fxKey.split("_fx_")[1]), "_fx_"), true),  
        state: { inL: 0, inR: 0, outL: 0, outR: 0, time: 0, fromStart: 0, automation: {}, isTailActive: false }  
        };  
        });  
        instState.fxHash = ev.fxHash;  
        }  
        renderSynths.push({  
		    	...ev,  
		     	volume: (ev.note.v || 1) * (window.settings?.songVolume || 1),  
		     	ctx: {  
		    		notefreq: 440 * Math.pow(2, (ev.note.y - 69) / 12),  
       	noteNumber: ev.note.y,  
        time: 0,  
        disconnect: false,  
        outL: 0, outR: 0,  
        automation: {},  
        pattern: { ...ev.pattern, playingMidi: new Set(), bpm: currentBpm }  
        }  
        });  
        eventIdx++;  
        }  
        const instanceShiftMultipliers = new Map();  
        const activeMidiPerInstance = {};  
        renderSynths.forEach(v => {  
        if (j >= v.sampleIndex && j <= v.stopSample) {  
        if (!activeMidiPerInstance[v.instKey]) activeMidiPerInstance[v.instKey] = new Set();  
        activeMidiPerInstance[v.instKey].add(v.note.y);  
        }  
        });  
        persistentStates.forEach((instState, sKey) => {  
        let multiplier = 1.0;  
        instState.fxChain.forEach(ef => {
       	if (ef.state.shiftfreq !== undefined)  
      		multiplier *= ef.state.shiftfreq;  
        });  
        instanceShiftMultipliers.set(sKey, multiplier);  
        });  
        const instanceBuckets = {};  
        for (let k = renderSynths.length - 1; k >= 0; k--) {  
        const v = renderSynths[k];  
        v.ctx.pattern.bpm = currentBpm;   
        const baseParams = {};  
        for (const p in v.instProxy) {  
        baseParams[p] = v.instProxy[p]?.val ?? v.instProxy[p];  
        }  
        v.ctx.duration = (v.note.w / stepsPerBeat) * (60 / currentBpm) * 2;  
        const remainingSteps = v.stopSample - j;  
        v.ctx.duration = v.ctx.time + (remainingSteps * invSr);  
  
        v.ctx.fxShiftFreq = instanceShiftMultipliers.get(v.stateKey) || 1.0;  
        const instAuto = globalAutoValues[v.instKey] || {};  
        v.ctx.automation = { ...baseParams, ...instAuto };  
        v.ctx.pattern.playingMidi = activeMidiPerInstance[v.instKey] || new Set();  
        v.ctx.outL = 0; v.ctx.outR = 0;  
        try {  
        v.inst._compiled(v.ctx, v.instProxy, mockCtx);  
        } catch (e) { v.ctx.disconnect = true; }  
        if (!instanceBuckets[v.stateKey]) instanceBuckets[v.stateKey] = { l: 0, r: 0 };  
        instanceBuckets[v.stateKey].l += v.ctx.outL * v.volume;  
        instanceBuckets[v.stateKey].r += v.ctx.outR * v.volume;  
        v.ctx.time += invSr;  
        if (v.ctx.disconnect || j > v.stopSample + (sr * 2)) renderSynths.splice(k, 1);  
        }  
        let finalL = 0, finalR = 0;  
        persistentStates.forEach((instState, sKey) => {  
        const bucket = instanceBuckets[sKey];  
        let curL = bucket?.l || 0, curR = bucket?.r || 0;  
        instState.fxChain.forEach(ef => {
 const s = ef.state;
 
 s.inL = curL;
 s.inR = curR;
 
 s.fromStart = globalTime; 
 s.time += invSr;
 
 s.automation = globalAutoValues[ef.id] || {};
 
 ef.process(s, ef.proxy, mockCtx);
 
 curL = s.outL;
 curR = s.outR;
});
        finalL += curL; finalR += curR;  
        });  
        outL[j] = finalL; outR[j] = finalR;  
        currentGlobalStep += deltaStepPerSample;  
        if ((j & 4095) === 0) {  
       	await new Promise(requestAnimationFrame);  
        }  
    }  
    return buffer;  
}  
let exportTextInterval;  
const exportTexts = [  
	"Negotiating with MP3 encoder...",  
	"Exporting MP3 Please Be Patient .",  
	"Encoding audio buffer...",  
	"Brrr Brrr rendering...",  
	"Error Unemployment ",  
	"Final boss: buffer.flush()",  
	"Optimizing... looks busy.",  
	"Rendering stereo channels...",  
	"Optimizing dynamic range...",  
	"Compressing to 320kbps MP3 !",  
	"Allocating audio frames...",  
	"Processing Brr Brr...",  
	"Finalizing export pipeline...",  
	"Flushing encoder buffer...",  
	"Preparing download...",  
	"Installing more RAM... just kidding.",  
	"Definitely working. Trust me.",  
	"NaN values in a thread are a threat",  
	"Go to the Stack overflow if you have a bug",  
	"Buffer too rough? That’s tough.",  
	"I will commit to branch and beg for no bugs"  
];  
	function setRandomExportText() {  
		const randomIndex = Math.floor(Math.random() * exportTexts.length);  
		exportLabel.value = exportTexts[randomIndex];  
	}  
async function exportAsMP3() {  
	try {  
		renderAbort = false;  
		exportBg.style.opacity = 0.7;  
	exportLabel.value = "Exporting MP3 Please Be Patient .",  
exportTextInterval = setInterval(setRandomExportText, 5000);  
		exportProgress.style.w = "0%";  
		root.update(0, 0, window.innerWidth, window.innerHeight);  
		root.draw();  
		draw();  
		const buffer = await renderSongBuffer(0);  
		if (!buffer || !buffer.length) {  
			exportBg.style.opacity = 0;  
			return;  
		}  
		const sr = buffer.sampleRate;  
		const left = buffer.getChannelData(0);  
		const right = buffer.getChannelData(1);  
		let max = 0;  
		for (let i = 0; i < left.length; i++) {  
			const a = Math.abs(left[i]);  
			const b = Math.abs(right[i]);  
			if (a > max) max = a;  
			if (b > max) max = b;  
		}  
		if (max > 0) {  
			const norm = 0.9 / max;  
			for (let i = 0; i < left.length; i++) {  
				left[i] *= norm;  
				right[i] *= norm;  
			}  
		}  
		for (let i = 0; i < left.length; i++) {  
			const lf = Math.abs(left[i]);  
			const rf = Math.abs(right[i]);  
			if (lf > 0.8) left[i] *= 0.95;  
			if (rf > 0.8) right[i] *= 0.95;  
		}  
		const mp3encoder = new lamejs.Mp3Encoder(2, sr, 320);  
		const mp3Data = [];  
		const sampleBlockSize = 1152 * 4;  
		const leftInt = new Int16Array(left.length);  
		const rightInt = new Int16Array(right.length);  
		for (let i = 0; i < left.length; i++) {  
			let l = Math.max(-1, Math.min(1, left[i])) * 0.9;  
			let r = Math.max(-1, Math.min(1, right[i])) * 0.9;  
			leftInt[i] = l < 0 ? l * 0x8000 : l * 0x7FFF;  
			rightInt[i] = r < 0 ? r * 0x8000 : r * 0x7FFF;  
		}  
		for (let i = 0; i < leftInt.length; i += sampleBlockSize) {  
			if (renderAbort) {  
				exportBg.style.opacity = 0;  
				return;  
			}  
			const blockLen = Math.min(sampleBlockSize, leftInt.length - i);  
			const leftChunk = leftInt.subarray(i, i + blockLen);  
			const rightChunk = rightInt.subarray(i, i + blockLen);  
			const mp3buf = mp3encoder.encodeBuffer(leftChunk, rightChunk);  
			if (mp3buf.length > 0) mp3Data.push(mp3buf);  
			const percent = (i / leftInt.length) * 100;  
			exportProgress.style.w = Math.floor(percent) + "%";  
			root.update(0, 0, window.innerWidth, window.innerHeight);  
			root.draw();  
			await new Promise(r => setTimeout(r, 0));  
		}  
		const last = mp3encoder.flush();  
		if (last.length > 0) mp3Data.push(last);  
		const blob = new Blob(mp3Data, { type: "audio/mp3" });  
		const url = URL.createObjectURL(blob);  
		const a = document.createElement("a");  
		a.href = url;  
		a.download = "song" + Date.now() + ".mp3";  
		installFile(blob,a.download)
		document.body.appendChild(a);  
		a.click();
		document.body.removeChild(a);  
		setTimeout(() => URL.revokeObjectURL(url), 1000);  
		exportBg.style.opacity = 0;  
		clearInterval(exportTextInterval);  
	} catch (e) {  
		console.error(e);  
		exportBg.style.opacity = 0;  
	}  
}