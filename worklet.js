class InstrumentProcessor extends AudioWorkletProcessor {
    constructor() {
        super();
        this.activeSynths = [];
        this.automationData = {};
        this.playhead = 0;
        this.persistentFXStates = new Map();
        this.globalAutomationValues = {};
        this.playingNotes = {};
        this.songvolume=1
        this.bpm = 120;
        this.synthCache = new Map();
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
        } catch (err) {
        console.error("Synth compile error", err);
        }
        } else if (d.type === 'UPDATE_INSTANCE_FX') {
	this.updateInstanceFX(d.stateKey, d.fxChain, d.fxHash);
}else if (d.type === 'SONGVOL') {
	this.songvolume = d.songvolume ;
} else if (d.type === 'AUTOMATION_DATA') {
        this.automationData = d.data;
        } else if (d.type === 'PLAYHEAD') {
        this.playhead = d.step;
        } else if (d.type === 'STOP_ALL') {
        	this.synthCache.clear()
	this.activeSynths = [];
	this.automationData = {};
	this.playhead = 0;
	this.persistentFXStates.clear();
	this.globalAutomationValues = {};
	this.playingNotes = {};
	this.bpm = 120;
			if (this.orphanedTails) {
		this.orphanedTails = [];
	}
} else if (d.type === "PLAYING_NOTES") {
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
        state: sameType
        ? oldFx.state
        : { inL: 0, inR: 0, outL: 0, outR: 0, time: 0, isTailActive: false, silenceFrames: 0 }
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
        let val = pts[0].y;
        if (localStep <= pts[0].x) val = pts[0].y;
        else if (localStep >= pts[pts.length - 1].x) val = pts[pts.length - 1].y;
        else {
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
    process(inputs, outputs) {
    const outL = outputs[0][0];
    const outR = outputs[0][1];
    if (!outL) return true;
    const sr = sampleRate;
    const count = outL.length;
    const mockCtx = { sampleRate: sr };
    const stepsPerSec = (this.bpm / 60) * 4;
    outL.fill(0);
    outR.fill(0);
    for (let i = 0; i < count; i++) {
        const currentStep = this.playhead + (i / sr) * stepsPerSec;
        for (const stateKey in this.automationData) {
        if (!this.globalAutomationValues[stateKey]) {
        this.globalAutomationValues[stateKey] = {};
        }
        const params = this.automationData[stateKey];
        for (const paramName in params) {
        const newValue = this.getAutomationValue(stateKey, paramName, currentStep);
        if (newValue !== null) {
        this.globalAutomationValues[stateKey][paramName] = newValue;
        }
        }
        }
        const instanceBuckets = new Map();
        let finalL = 0;
        let finalR = 0;
        for (let j = this.activeSynths.length - 1; j >= 0; j--) {
        const v = this.activeSynths[j];
        const c = v.ctx;
        if (!instanceBuckets.has(v.stateKey)) {
        instanceBuckets.set(v.stateKey, { l: 0, r: 0 });
        }
        if (this.globalAutomationValues[v.stateKey]) {
        c.automation = { ...this.globalAutomationValues[v.stateKey] };
        }
        c.pattern = c.pattern || {};
        c.pattern.playingMidi = new Set(this.playingNotes[v.stateKey] || []);
        c.pattern.bpm = this.bpm;
        c.outL = 0; c.outR = 0;
        v.compiledSynth(c, v.proxy, mockCtx);
        const bucket = instanceBuckets.get(v.stateKey);
        bucket.l += c.outL * v.volume;
        bucket.r += c.outR * v.volume;
        c.time += 1 / sr;
        if (c.disconnect) this.activeSynths.splice(j, 1);
        }
        for (const [stateKey, bucket] of instanceBuckets) {
        let curL = bucket.l;
        let curR = bucket.r;
        const fxData = this.persistentFXStates.get(stateKey);
        if (fxData?.fxChain) {
        for (const ef of fxData.fxChain) {
        ef.state.inL = curL;
        ef.state.inR = curR;
        ef.state.automation = this.globalAutomationValues[ef.id] || {};
        ef.compiled(ef.state, ef.proxy, mockCtx);
        curL = ef.state.outL;
        curR = ef.state.outR;
        }
        }
        finalL += curL;
        finalR += curR;
        }
        for (const [stateKey, fxData] of this.persistentFXStates) {
        if (!instanceBuckets.has(stateKey)) {
        let curL = 0, curR = 0, anyTail = false;
        for (const ef of fxData.fxChain) {
        ef.state.inL = curL;
        ef.state.inR = curR;
        ef.state.automation = this.globalAutomationValues[ef.id] || {};
        ef.compiled(ef.state, ef.proxy, mockCtx);
        curL = ef.state.outL;
        curR = ef.state.outR;
        if (ef.state.isTailActive) anyTail = true;
        }
        if (anyTail) {
        finalL += curL;
        finalR += curR;
        } else {
        this.persistentFXStates.delete(stateKey);
        }
        }
        }
        if (this.orphanedTails) {
        for (let k = this.orphanedTails.length - 1; k >= 0; k--) {
        const ef = this.orphanedTails[k];
        ef.state.inL = 0;
        ef.state.inR = 0;
        ef.state.automation = this.globalAutomationValues[ef.id] || {};
        ef.compiled(ef.state, ef.proxy, mockCtx);
        finalL += ef.state.outL;
        finalR += ef.state.outR;
        if (!ef.state.isTailActive) {
        this.orphanedTails.splice(k, 1);
        }
        }
        }
        outL[i] = finalL*this.songvolume ;
        outR[i] = finalR*this.songvolume ;
    }
    return true;
}
}
registerProcessor('worklet-processor', InstrumentProcessor);