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
const getAudioSafeProxy = (proxy, isfx) => {
	if (!proxy) return {};
	const safeData = {};
	const source = isfx ? proxy : proxy;
	for (const key in source) {
		if (["parent", "children", "ui", "node", "fileInput"].includes(key)) continue;
		const val = source[key];
		if (key === "saved") continue;
		if (val instanceof Float32Array) continue;
		if (key === "audioBuffer" && val && val.getChannelData) {
			safeData[key] = {
				left: val.getChannelData(0),
				right: val.numberOfChannels > 1 ? val.getChannelData(1) : val.getChannelData(0),
				sampleRate: val.sampleRate
			};
			continue;
		}
		if (val && typeof val === 'object' && (val.val !== undefined || val.value !== undefined)) {
			safeData[key] = { val: Number(val.val !== undefined ? val.val : val.value) };
		}
		else if (val && typeof val === 'object' && !Array.isArray(val)) {
			try {
				safeData[key] = JSON.parse(JSON.stringify(val));
			} catch (e) { continue; }
		}
		else if (typeof val !== 'function' && val !== undefined) {
			safeData[key] = val;
		}
	}
	return safeData;
};
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
	const autoMap = {};
	for (const track of tracks) {
		if (track.muted) continue;
		for (const [startStep, width, patId] of track.patterns) {
			const pat = patterns[patId];
			if (!pat) continue;
			if (pat.type === "mod" && pat.associated) {
				const [instName, stateKey, paramName] = pat.associated;
				if (playheadStep >= startStep && playheadStep < startStep + width) {
					if (!autoMap[stateKey]) autoMap[stateKey] = {};
					autoMap[stateKey][paramName] = {
						points: pat.points,
						min: pat.min,
						max: pat.max,
						clipStart: startStep
					};
				}
			}
			if (pat.category === "fx" && pat.associated) {
				const [stateKey, paramName] = pat.associated;
				if (playheadStep >= startStep && playheadStep < startStep + width) {
					if (!autoMap[stateKey]) autoMap[stateKey] = {};
					autoMap[stateKey][paramName] = {
						type: "fx",
						points: pat.points,
						min: pat.min,
						max: pat.max,
						clipStart: startStep
					};
				}
			}
		}
	}
	return autoMap;
}
const InstrumentSynthesis = (params, patternId) => {
	const { noteNumber, noteLengthInBeats, pattern, volume = 1 } = params;
	if (!workletNode) return;
	if(bufferLoaded)return;
	workletNode.port.postMessage({
	type: "SONGVOL",
	songvolume: settings.songVolume
});

	const inst = getInstrument(pattern);
	const stateKey = `${inst.name}_inst_${pattern.instance || 0}_pat_${patternId}`;
	const instProxy = getCachedProxy('instrument', inst.name, pattern.instance || 0, "_inst_", "");
let proxyBase = getAudioSafeProxy(instProxy);
let proxy = { ...proxyBase };
if (Array.isArray(inst.sharedobject)) {
	for (const pair of inst.sharedobject) {
		const from = pair[0];
		const to = pair[1] || pair[0];
		if (instProxy[from] !== undefined) {
			proxy[to] = instProxy[from];
		}
	}
}
	const bpm = window.BPM || 120;
	const voiceData = {
		synthCode: inst.synth,
		proxy: proxy,
		stateKey: stateKey,
		volume: volume  ,
		songvolume: settings.songVolume,
		instanceId: stateKey,
		fxChain: (pattern.fx || []).map(fxKey => {
			const [type, idx] = fxKey.split("_fx_");
			return {
				id: fxKey,
				fxStateKey: fxKey,
				code: window.Effects[type].process,
				proxy: getAudioSafeProxy(
					getCachedProxy('effect', type, parseInt(idx), "_fx_"),
					true
				),
				state: { inL: 0, inR: 0, outL: 0, outR: 0, time: 0 }
			};
		}),
		ctx: {
			notefreq: 440 * 2 ** ((noteNumber - 69) / 12),
			noteNumber: noteNumber,
			time: 0,
			duration: (noteLengthInBeats * (60 / bpm) * 2),
			disconnect: false,
			pattern: { ...pattern, bpm: bpm }
		}
	};
	workletNode.port.postMessage({ type: 'ADD_VOICE', voice: voiceData });
};;
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
    preview = false
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
        { noteNumber, noteLengthInBeats, pattern, volume: volume ?? 1 },
        patternId
    );
};
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
	if (!auto || !auto.points || auto.points.length === 0) return null;
	const pts = auto.points;
	const localStep = currentStep - (auto.clipStart || 0);
	let val;
	if (localStep <= pts[0].x) {
		val = pts[0].y;
	} else if (localStep >= pts[pts.length - 1].x) {
		val = pts[pts.length - 1].y;
	} else {
		for (let i = 0; i < pts.length - 1; i++) {
			if (localStep >= pts[i].x && localStep <= pts[i + 1].x) {
				const t = (localStep - pts[i].x) / (pts[i + 1].x - pts[i].x);
				val = pts[i].y + t * (pts[i + 1].y - pts[i].y);
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
    const bpm = window.BPM || 120;
    const stepsPerSec = (bpm / 60) * stepsPerBeat;
    const invSr = 1 / sr;
    const deltaStepPerSample = stepsPerSec / sr;
    let maxStep = startStep;
    tracks.forEach(track => {
        track.patterns.forEach(([s, w]) => { if (s + w > maxStep) maxStep = s + w; });
    });
        const tailMarginSamples = 0;
    const totalSamples = Math.ceil(((maxStep - startStep) / stepsPerSec) * sr) + tailMarginSamples;
    const buffer = audioCtx.createBuffer(2, totalSamples, sr);
    const outL = buffer.getChannelData(0);
    const outR = buffer.getChannelData(1);
    const events = [];
    const effectCache = new Map();
    const persistentStates = new Map();
    const orphanedTails = [];     const allModPatterns = [];
    tracks.forEach(track => {
        if (track.muted) return;
        track.patterns.forEach(([s, w, id]) => {
        const p = patterns[id];
        if (!p) return;
        if ((p.type === "mod" || p.category === "inst" || p.category === "fx") && p.associated) {
        allModPatterns.push({
        start: s,
        end: s + w,
        pat: {
        points: p.points,
        min: p.min ?? 0,
        max: p.max ?? 1,
        associated: p.associated,
        clipStart: s
        }
        });
        }
        if (p.notes && p.notes.length > 0) {
        const inst = getInstrument(p);
        if (!inst._compiled) inst._compiled = new Function("synth", "int", "audioCtx", inst.synth);
        const instProxyRaw = getCachedProxy("instrument", p.instrument, p.instance || 0);
const proxy = getAudioSafeProxy(instProxyRaw);

if (Array.isArray(getInstrument(p).sharedobject)) {
	for (const pair of getInstrument(p).sharedobject) {
		const from = pair[0];
		const to = pair[1] || pair[0];
		
		if (from === "saved") {
			const key = `${p.instrument}_${p.instance || 0}_shared`;
			if (!sharedData[key]) sharedData[key] = instProxyRaw.saved;
			proxy[to] = sharedData[key];
			continue;
		}
		
		if (instProxyRaw[from] !== undefined) {
			proxy[to] = instProxyRaw[from];
		}
	}
}
        const stateKey = `${p.instrument}_inst_${p.instance || 0}`;
        p.notes.forEach(note => {
        	const noteStartStep = s + note.x;
const noteStartSample = Math.floor(((noteStartStep - startStep) / stepsPerSec) * sr);

events.push({
sampleIndex: Math.max(0, noteStartSample),
prewarm: noteStartSample < 0 ? -noteStartSample : 0,
stopSample: Math.floor(((s + note.x + note.w - startStep) / stepsPerSec) * sr),
note, inst, pattern: p, stateKey,
fxHash: JSON.stringify(p.fx || []),
instProxy: proxy
});
        });
        }
        });
    });
    events.sort((a, b) => a.sampleIndex - b.sampleIndex);
    let renderSynths = [];
    let eventIdx = 0;
    const mockCtx = { sampleRate: sr };
    for (let j = 0; j < totalSamples; j++) {
    	if (renderAbort) return buffer;
        const currentGlobalStep = startStep + (j * deltaStepPerSample);
        const globalAutoValues = {};
        for (let i = 0; i < allModPatterns.length; i++) {
        const m = allModPatterns[i];
        if (currentGlobalStep >= m.start && currentGlobalStep < m.end) {
        const isInst = m.pat.associated.length === 3;
        const sKey = isInst ? m.pat.associated[1] : m.pat.associated[0];
        const paramName = isInst ? m.pat.associated[2] : m.pat.associated[1];
        if (!globalAutoValues[sKey]) globalAutoValues[sKey] = {};
        const val = getAutomationValue(m.pat, currentGlobalStep);
        if (val !== null) globalAutoValues[sKey][paramName] = val;
        }
        }
        while (eventIdx < events.length && events[eventIdx].sampleIndex <= j) {
        const ev = events[eventIdx];
        let instState = persistentStates.get(ev.stateKey);
        if (!instState) {
        instState = { fxChain: [], fxHash: "" };
        persistentStates.set(ev.stateKey, instState);
        }
        if (instState.fxHash !== ev.fxHash) {
        instState.fxChain.forEach(ef => {
        if (ef.state.isTailActive) orphanedTails.push(ef);
        });
        instState.fxChain = (ev.pattern.fx || []).map(fxKey => {
        const type = fxKey.split("_fx_")[0];
        if (!effectCache.has(type)) effectCache.set(type, new Function("fx", "int", "audioCtx", window.Effects[type].process));
        return {
        id: fxKey,
        process: effectCache.get(type),
        proxy: getAudioSafeProxy(getCachedProxy('effect', type, parseInt(fxKey.split("_fx_")[1]), "_fx_"), true),
        state: { inL: 0, inR: 0, outL: 0, outR: 0, time: 0, automation: {}, isTailActive: false, silenceFrames: 0 }
        };
        });
        instState.fxHash = ev.fxHash;
        }
        const synthObj = {
...ev,
volume: (ev.note.v || 1) * (window.settings?.songVolume || 1),
ctx: {
notefreq: 440 * Math.pow(2, (ev.note.y - 69) / 12),
noteNumber: ev.note.y,
time: 0,
duration: (ev.note.w / stepsPerBeat) * (60 / bpm) * 2,
disconnect: false,
outL: 0, outR: 0,
automation: {},
pattern: { ...ev.pattern, playingMidi: new Set(), bpm: bpm }
}
};
if(ev.prewarm>0){
for(let w=0; w<ev.prewarm; w++){
synthObj.inst._compiled(synthObj.ctx, ev.instProxy, mockCtx);
synthObj.ctx.time += invSr;
if(synthObj.ctx.disconnect) break;
}
}
renderSynths.push(synthObj);
        eventIdx++;
        }
        const instanceBuckets = {};
        const activeMidiPerInstance = {};
        for (let k = renderSynths.length - 1; k >= 0; k--) {
        const v = renderSynths[k];
        if (j >= v.sampleIndex && j <= v.stopSample) {
        if (!activeMidiPerInstance[v.stateKey]) activeMidiPerInstance[v.stateKey] = new Set();
        activeMidiPerInstance[v.stateKey].add(v.note.y);
        }
        const baseParams = {};
        if (v.instProxy) {
        for (const prop in v.instProxy) {
        if (typeof v.instProxy[prop] === 'number') baseParams[prop] = v.instProxy[prop];
        else if (v.instProxy[prop]?.val !== undefined) baseParams[prop] = v.instProxy[prop].val;
        }
        }
        v.ctx.automation = { ...baseParams, ...(globalAutoValues[v.stateKey] || {}) };
        v.ctx.pattern.playingMidi = activeMidiPerInstance[v.stateKey] || new Set();
        v.ctx.outL = 0; v.ctx.outR = 0;
try {
	v.inst._compiled(v.ctx, v.instProxy, mockCtx);
} catch (e) {
	v.ctx.disconnect = true;
}
        if (!instanceBuckets[v.stateKey]) instanceBuckets[v.stateKey] = { l: 0, r: 0 };
        instanceBuckets[v.stateKey].l += v.ctx.outL * v.volume;
        instanceBuckets[v.stateKey].r += v.ctx.outR * v.volume;
        v.ctx.time += invSr;
        if (v.ctx.disconnect) renderSynths.splice(k, 1);
        }
        let finalL = 0;
        let finalR = 0;
        persistentStates.forEach((instState, sKey) => {
        const bucket = instanceBuckets[sKey];
        let curL = bucket ? bucket.l : 0;
        let curR = bucket ? bucket.r : 0;
        let anyTail = false;
        instState.fxChain.forEach(ef => {
        ef.state.inL = curL;
        ef.state.inR = curR;
        ef.state.automation = globalAutoValues[ef.id] || {};
        ef.process(ef.state, ef.proxy, mockCtx);
        curL = ef.state.outL;
        curR = ef.state.outR;
        ef.state.time += invSr;
        if (ef.state.isTailActive) anyTail = true;
        });
        if (bucket || anyTail) {
        finalL += curL;
        finalR += curR;
        } else {
        persistentStates.delete(sKey);
        }
        });
        for (let k = orphanedTails.length - 1; k >= 0; k--) {
        const ef = orphanedTails[k];
        ef.state.inL = 0;
        ef.state.inR = 0;
        ef.state.automation = globalAutoValues[ef.id] || {};
        ef.process(ef.state, ef.proxy, mockCtx);
        finalL += ef.state.outL;
        finalR += ef.state.outR;
        ef.state.time += invSr;
        if (!ef.state.isTailActive) orphanedTails.splice(k, 1);
        }
        outL[j] = finalL;
        outR[j] = finalR;
        if (j % 50000 === 0) await new Promise(r => setTimeout(r, 0));
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
