 
class InstrumentProcessor extends AudioWorkletProcessor {
	constructor() {
		super();
		this.activeSynths = [];
		this.automationData = {};
		this.playhead = 0;
		this.persistentFXStates = new Map();
		this.globalAutomationValues = {};
		this.playingNotes = {};
		this.songvolume = 1;
		this.bpm = 120;
		this.synthCache = new Map();
		this.bucketL = new Float32Array(128);
this.bucketR = new Float32Array(128);
this.bucketActive = new Uint8Array(128);
		this.port.onmessage = (e) => {
			if (e.data.type === 'SET_SHARED_DATA') {
				this.sharedData[e.data.key] = e.data.data;
			}
			const d = e.data;
			if (d.type === 'ADD_VOICE') {
				const v = d.voice;
				if (!this.persistentFXStates.has(v.stateKey)) {
					this.persistentFXStates.set(v.stateKey, { fxChain: [] });
					this.updateInstanceFX(v.stateKey, v.fxChain, v.fxHash);
				}
				try {
					let compiled = this.synthCache.get(v.synthCode);
					if (!compiled) {
						compiled = new Function("synth", "int", "audioCtx", v.synthCode);
						this.synthCache.set(v.synthCode, compiled);
					}
					v.compiledSynth = compiled;
					this.activeSynths.push(v);
				} catch (err) {}
			} else if (d.type === 'UPDATE_INSTANCE_FX') {
				this.updateInstanceFX(d.stateKey, d.fxChain, d.fxHash);
			} else if (d.type === 'SONGVOL') {
				this.songvolume = d.songvolume;
			} else if (d.type === 'AUTOMATION_DATA') {
				this.automationData = d.data;
			} else if (d.type === 'PLAYHEAD') {
				this.playhead = d.step;
			} else if (d.type === 'STOP_ALL') {
    this.activeSynths.length = 0;
    if (this.orphanedTails) {
        this.orphanedTails.length = 0;
    }

 
this.persistentFXStates.forEach((inst) => {
    inst.fxChain.forEach(fx => {
        for (let key in fx.state) {
         fx.state.fromStart = 0;
            if (fx.state[key] instanceof Float32Array || fx.state[key] instanceof Array) {
                fx.state[key].fill(0);
            } else if (typeof fx.state[key] === 'number') {
                fx.state[key] = 0;
            }
        }
        fx.state.isTailActive = false;
    });
});

    this.persistentFXStates.clear();
    this.automationData = {};
    this.globalAutomationValues = {};
    this.playingNotes = {};
    this.playhead = 0;
    this.synthCache.clear();
   }
   else if (d.type === "PLAYING_NOTES") {
				this.playingNotes[d.stateKey] = d.notes;
			} else if (d.type === "SET_BPM") {
				this.bpm = d.bpm;
			}
		};
	}

	updateInstanceFX(stateKey, newFxChain, newHash) {
		let inst = this.persistentFXStates.get(stateKey);
		if (!inst) {
			inst = { fxChain: [], fxHash: "" };
			this.persistentFXStates.set(stateKey, inst);
		}
		if (inst.fxHash !== newHash) {
			if (!this.orphanedTails) this.orphanedTails = [];
			inst.fxChain.forEach(oldEf => {
				if (oldEf.state && oldEf.state.isTailActive) {
					this.orphanedTails.push(oldEf);
				}
			});
			inst.fxChain = newFxChain.map((fxData, i) => {
				const oldFx = inst.fxChain[i];
				const sameType = oldFx && oldFx.id === fxData.id;
				return {
					id: fxData.id,
					compiled: new Function("fx", "int", "audioCtx", fxData.code),
					proxy: fxData.proxy,
					state: sameType ?
						oldFx.state :
						{ inL: 0, inR: 0, outL: 0, outR: 0, time: 0, fromStart: 0, isTailActive: false, silenceFrames: 0 }
				};
			});
			inst.fxHash = newHash;
		}
	}

	getAutomationValue(stateKey, paramName, currentStep) {
		const auto = this.automationData[stateKey]?.[paramName];
		if (!auto || !auto.points || auto.points.length === 0) return null;
		const pts = auto.points;
		const localStep = currentStep - (auto.clipStart || 0);
		const len = pts.length;
		if (localStep <= pts[0].x) return auto.min + pts[0].y * (auto.max - auto.min);
		if (localStep >= pts[len - 1].x) return auto.min + pts[len - 1].y * (auto.max - auto.min);
		let low = 0, high = len - 1;
		while (low <= high) {
			const mid = (low + high) >>> 1;
			if (pts[mid].x < localStep) low = mid + 1;
			else if (pts[mid].x > localStep) high = mid - 1;
			else { low = mid + 1; break; }
		}
		const idx = low - 1;
		const p1 = pts[idx];
		const p2 = pts[idx + 1];
		let val = p1.y;
		if (!auto.isStep && p2) {
			val += (localStep - p1.x) / (p2.x - p1.x) * (p2.y - p1.y);
		}
		return auto.min + val * (auto.max - auto.min);
	}
process(inputs, outputs) {
    const outL = outputs[0][0];
    const outR = outputs[0][1];
    if (!outL) return true;

    const count = 128;
    const sr = sampleRate;
    const invSr = 1 / sr;
    const mockCtx = { sampleRate: sr };
    const stepsPerSec = (this.bpm / 60) * 4;
    const deltaStep = stepsPerSec * invSr;
    const startStep = this.playhead;

    outL.fill(0);
    outR.fill(0);

    for (const stateKey in this.automationData) {
        const globalState = this.globalAutomationValues[stateKey] || (this.globalAutomationValues[stateKey] = {});
        const params = this.automationData[stateKey];
        for (const paramName in params) {
            const val = this.getAutomationValue(stateKey, paramName, startStep);
            if (val !== null) globalState[paramName] = val;
        }
    }

    const synths = this.activeSynths;
    const fxEntries = Array.from(this.persistentFXStates.entries());
    const globalAutoVals = this.globalAutomationValues;
    const emptyAuto = this.emptyAuto || {};
    const vol = this.songvolume;

    const blockL = new Float32Array(count);
    const blockR = new Float32Array(count);

    for (let eIdx = 0; eIdx < fxEntries.length; eIdx++) {
        const [stateKey, fxData] = fxEntries[eIdx];
        blockL.fill(0);
        blockR.fill(0);

        let hasActiveSynths = false;
        let shiftMultiplier = 1.0;
        
        if (fxData.fxChain) {
            for (let f = 0; f < fxData.fxChain.length; f++) {
                if (fxData.fxChain[f].state.shiftfreq !== undefined) {
                    shiftMultiplier *= fxData.fxChain[f].state.shiftfreq;
                }
            }
        }

        const currentMidi = this.playingNotes[stateKey] || [];

        for (let sIdx = 0; sIdx < synths.length; sIdx++) {
            const v = synths[sIdx];
            if (v.stateKey !== stateKey) continue;

            hasActiveSynths = true;
            const c = v.ctx;
            c.automation = globalAutoVals[v.instKey] || emptyAuto;
            if (!c.pattern) c.pattern = {};
            c.pattern.playingMidi = currentMidi;
            c.pattern.bpm = this.bpm;
            c.fxShiftFreq = shiftMultiplier;

let voiceTime = c.time;
let voiceStep = startStep;

for (let i = 0; i < count; i++) {
    c.time = voiceTime;
    c.step = voiceStep;

    if (c.endStep !== undefined) {
        let rem = c.endStep - voiceStep;
        c.duration = voiceTime + (Math.max(0, rem) / stepsPerSec);
    }

    c.outL = 0;
    c.outR = 0;

    try {
        v.compiledSynth(c, v.proxy, mockCtx);
    } catch (err) {
        c.disconnect = true;
    }

    blockL[i] += c.outL * v.volume;
    blockR[i] += c.outR * v.volume;

    voiceTime += invSr;
    voiceStep += deltaStep;
}

c.time = voiceTime;

}

        let anyTail = false;
        if (fxData.fxChain && fxData.fxChain.length > 0) {
            for (let f = 0; f < fxData.fxChain.length; f++) {
                const ef = fxData.fxChain[f];
                const s = ef.state;
                let globalTime = this.playhead / stepsPerSec; 
                s.automation = globalAutoVals[ef.id] || emptyAuto;

                for (let i = 0; i < count; i++) {
                    s.inL = blockL[i];
                    s.inR = blockR[i];
                    s.fromStart = globalTime;
                    s.time += invSr;
                    ef.compiled(s, ef.proxy, mockCtx);
                    blockL[i] = s.outL;
                    blockR[i] = s.outR;
                    globalTime += invSr;
                }
                if (s.isTailActive) anyTail = true;
            }
        }

        if (hasActiveSynths || anyTail) {
            for (let i = 0; i < count; i++) {
                outL[i] += blockL[i];
                outR[i] += blockR[i];
            }
        }
    }

    const orphaned = this.orphanedTails || [];
    for (let k = 0; k < orphaned.length; k++) {
        const ef = orphaned[k];
        const s = ef.state;
        if (!s.isTailActive) continue;
        s.automation = globalAutoVals[ef.id] || emptyAuto;
        for (let i = 0; i < count; i++) {
            s.inL = 0;
            s.inR = 0;
            ef.compiled(s, ef.proxy, mockCtx);
            outL[i] += s.outL;
            outR[i] += s.outR;
        }
    }

    for (let i = 0; i < count; i++) {
        let l = outL[i] * vol;
        let r = outR[i] * vol;
        if (isNaN(l) || !isFinite(l)) l = 0;
        if (isNaN(r) || !isFinite(r)) r = 0;
        outL[i] = l 
        outR[i] = r 
    }

    this.playhead += deltaStep * count;
    
    for (let i = synths.length - 1; i >= 0; i--) {
        if (synths[i].ctx.disconnect) synths.splice(i, 1);
    }
    
    for (let k = orphaned.length - 1; k >= 0; k--) {
        if (!orphaned[k].state.isTailActive) orphaned.splice(k, 1);
    }

    return true;
}

}
registerProcessor('worklet-processor', InstrumentProcessor);
