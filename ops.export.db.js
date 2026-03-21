
 const SavedLocalData = {
    set(key, value) {
        localStorage.setItem(key, JSON.stringify(value));
    },
    get(key) {
        const item = localStorage.getItem(key);
        try {
        return item ? JSON.parse(item) : null;
        } catch (e) {
        return item;
        }
    },
    remove(key) {
        localStorage.removeItem(key);
    },
    clear() {
        localStorage.clear();
    }
};
const SavedToDataBase = {
    db: null,
    async init(dbName = "DAW_DB", storeName = "Projects") {
        this.storeName = storeName;
        return new Promise((resolve, reject) => {
        const request = indexedDB.open(dbName, 1);
        request.onupgradeneeded = (e) => {
        if (!e.target.result.objectStoreNames.contains(storeName)) {
        e.target.result.createObjectStore(storeName);
        }
        };
        request.onsuccess = (e) => {
        this.db = e.target.result;
        resolve(this);
        };
        request.onerror = (e) => reject(e.target.error);
        });
    },
    async save(id, data) {
        if (!this.db) await this.init();
        return new Promise((resolve, reject) => {
        const tx = this.db.transaction(this.storeName, "readwrite");
        const store = tx.objectStore(this.storeName);
        const request = store.put(data, id);
        request.onsuccess = () => resolve(true);
        request.onerror = () => reject(request.error);
        });
    },
    async load(id) {
        if (!this.db) await this.init();
        return new Promise((resolve, reject) => {
        const tx = this.db.transaction(this.storeName, "readonly");
        const store = tx.objectStore(this.storeName);
        const request = store.get(id);
        request.onsuccess = () => resolve(request.result);
        request.onerror = () => reject(request.error);
        });
    },
    async getAll() {
        if (!this.db) await this.init();
        return new Promise((resolve) => {
        const tx = this.db.transaction(this.storeName, "readonly");
        const store = tx.objectStore(this.storeName);
        store.getAllKeys().onsuccess = (e) => resolve(e.target.result);
        });
    },
    async delete(id) {
        if (!this.db) await this.init();
        const tx = this.db.transaction(this.storeName, "readwrite");
        tx.objectStore(this.storeName).delete(id);
    }
};
async function serializeInstrumentStates(states) {
	const out = {};
	
	for (const key in states) {
		const st = states[key];
		if (!st) continue;
		
		const dontExport = st._values?.donotexport || [];
		const newState = {};
		
		for (const prop in st) {
			
			if (dontExport.includes(prop)) continue;
			
			if (prop === "_values") {
				
				const cleanValues = {};
				
				for (const vKey in st._values) {
					
					if (dontExport.includes(vKey)) continue;
					
					const val = st._values[vKey];
					
					if (typeof val !== "object" || val === null) {
						cleanValues[vKey] = val;
					}
				}
				
				newState._values = cleanValues;
				continue;
			}
			
			if (prop === "saved") {
				
				newState.saved = JSON.parse(
					JSON.stringify(st.saved || {}, (k, v) =>
						dontExport.includes(k) ? undefined : v
					)
				);
				
				continue;
			}
			if (prop === "audioBuffers") {
 newState.audioBuffers = st.audioBuffers.map(buf => {
  if (!buf) return null;
  
  return {
   left: Array.from(buf.left),
   right: Array.from(buf.right),
   length: buf.length
  };
 });
 continue;
}
if (prop === "audioBuffer") {
 if (
  st.audioBuffer &&
  typeof st.audioBuffer.getChannelData === "function"
 ) {
  newState.audioData = Array.from(st.audioBuffer.getChannelData(0));
  newState.sampleRate = st.audioBuffer.sampleRate;
 }
 continue;
}
			const val = st[prop];
			if (typeof val !== "object" || val === null) {
				newState[prop] = val;
			}
		}
		
		out[key] = newState;
	}
	
	return out;
}

async function exportProject() {
    const raw = {
        tracks: tracks.map(t => ({
        name: t.name,
        muted: t.muted,
        color: t.color,
        patterns: t.patterns,
        })),
        patterns: JSON.parse(JSON.stringify(patterns, (key, value) => {
        if (key === "playingMidi") return undefined;
        if (key === "played") return undefined;
        return value;
        })),
        instrumentStates: await serializeInstrumentStates(instrumentStates),
        effectStates: await serializeInstrumentStates(effectStates),
        songPlugins: SongPlugins, 
        bpm: BPM,
        version: VERSION
    };
    return JSON.stringify(raw);
}
async function saveProjectToFile() {
    try {
        const projectData = await exportProject();
        const blob = new Blob([projectData], { type: "application/octet-stream" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = "projekt_daw_" + Date.now() + ".ops";
        installFile(blob,a.download,JSON.stringify(projectData),true)
        a.click();
        URL.revokeObjectURL(url);
    } catch (error) {
        console.error(error);
    }
}
function encodeRaw(obj) {
    const clean = JSON.parse(JSON.stringify(obj, (key, value) => {
        if (["parent", "children", "db", "playingMidi", "domInput", "fxContexts"].includes(key)) return undefined;
        return value;
    }));
    const jsonString = JSON.stringify(clean);
    return btoa(encodeURIComponent(jsonString).replace(/%([0-9A-F]{2})/g, (match, p1) => {
        return String.fromCharCode('0x' + p1);
    }));
}
function decodeRaw(txt) {
    try {
        if (!txt) return null;
        const decoded = decodeURIComponent(Array.prototype.map.call(atob(txt.trim()), (c) => {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
        }).join(''));
        return JSON.parse(decoded);
    } catch (e) {
        console.error(e);
        return null;
    }
}
function importProject(txt) {
    try {
        if (!txt || typeof txt !== "string") return;
        const obj = JSON.parse(txt);
        if (!obj || typeof obj !== "object") return;
        tracks = obj.tracks || [];
        patterns = obj.patterns || {};
        BPM = obj.bpm || 155;
        if (typeof bpmInput !== 'undefined' && bpmInput) bpmInput.value = BPM.toString()  ;    
        if (obj.songPlugins) {
            Object.keys(SongPlugins).forEach(k => delete SongPlugins[k]);
            Object.assign(SongPlugins, obj.songPlugins);
            Object.entries(SongPlugins).forEach(([name, plugin]) => {
                if (plugin.parsed) {
                    if (plugin.parsed.meta.type === "fx") {
                        window.Effects[name] = {
                            interface: plugin.parsed.interface,
                            sharedobject: JSON.parse("["+JSON.stringify(plugin.parsed.sharedobjs)+"]"),
                            process: plugin.parsed.process,
                            version: plugin.parsed.version,
																												model: plugin.parsed.model,
                        };
                    } else if (plugin.parsed.meta.type === "instrument") {
                        window.Instruments[name] = {
                            interface: plugin.parsed.interface,
                            sharedobject: JSON.parse("["+JSON.stringify(plugin.parsed.sharedobjs)+"]"),
                            synth: plugin.parsed.process,
                            version: plugin.parsed.version,
																												model: plugin.parsed.model,
                        };
                    }
                }
            });
        }
        Object.keys(instrumentStates).forEach(k => delete instrumentStates[k]);
        const savedInst = obj.instrumentStates || {};
        Object.keys(savedInst).forEach(key => {
        const data = savedInst[key];
        const cleanValues = data._values ? JSON.parse(JSON.stringify(data._values)) : {};
        instrumentStates[key] = {
        ...cleanValues,
        _values: cleanValues,
        saved: data.saved ? JSON.parse(JSON.stringify(data.saved)) : {}
        };
        if (data.audioData) {
	const arr = new Float32Array(data.audioData);
	const buf = audioCtx.createBuffer(2, arr.length, data.sampleRate || audioCtx.sampleRate);
	buf.copyToChannel(arr, 0);
	buf.copyToChannel(arr, 0); 
	instrumentStates[key].audioBuffer = buf;
}
if (data.audioBuffers) {
 instrumentStates[key].audioBuffers = data.audioBuffers.map(b => {
  if (!b) return null;
  
  return {
   left: new Float32Array(b.left),
   right: new Float32Array(b.right),
   length: b.length
  };
 });
}
        });
        Object.keys(effectStates).forEach(k => delete effectStates[k]);
        const savedFX = obj.effectStates || {};
        Object.keys(savedFX).forEach(key => {
        const data = savedFX[key];
        let cleanValues = data._values ? JSON.parse(JSON.stringify(data._values)) : {};
        if (key.includes("eq_filter") && cleanValues.points) {
        cleanValues.points = cleanValues.points.map(p => ({
        ...p,
        freq: (p.freq === null || p.freq === undefined) ? 1000 : p.freq,
        gain: (p.gain === null || p.gain === undefined) ? 0 : p.gain,
        q: (p.q === null || p.q === undefined) ? 1.2 : p.q
        }));
        }
        effectStates[key] = {
        ...cleanValues,
        _values: cleanValues,
        saved: data.saved ? JSON.parse(JSON.stringify(data.saved)) : {}
        };
        });
        Object.keys(patterns).forEach(id => {
        const pat = patterns[id];
        pat.playingMidi = new Set();
        if (pat?.instrument && pat.instrument !== "none") {
        InstrumentManager.init(pat.instrument, id);
        }
        if (pat?.fx && Array.isArray(pat.fx)) {
        pat.fx.forEach(fxKey => {
        const parts = fxKey.split("_fx_");
        if (parts.length === 2) {
        FXManager.init(parts[0], id, null, parseInt(parts[1]), "_fx_");
        }
        });
        }
        });
        nextPatternId = (Object.keys(patterns).length > 0) ? Math.max(...Object.keys(patterns).map(Number)) + 1 : 1;
        if (typeof proxyCache !== 'undefined') proxyCache.clear();
        if (typeof warmupProxies === 'function') warmupProxies();
        if (typeof activeMenu !== 'undefined') activeMenu = null;
        if (typeof draw === 'function') draw();
        console.log("Project Loaded Successfully.");
    } catch (e) {
        console.error("Critical Import Error:", e);
    }
}
 
function parseMidiHeader(data) {
    if (data[0] !== 0x4d || data[1] !== 0x54 || data[2] !== 0x68 || data[3] !== 0x64) return null;
    return {
        format: (data[8] << 8) | data[9],
        trackCount: (data[10] << 8) | data[11],
        division: (data[12] << 8) | data[13]
    };
}
function readVarInt(data, offset) {
    let value = 0;
    let b;
    do {
        b = data[offset++];
        value = (value << 7) | (b & 0x7f);
    } while (b & 0x80);
    return { value, offset };
}
function parseMidiTrack(data, division) {
    let offset = 0;
    let currentTime = 0;
    let events = [];
    let runningStatus = null;
    while (offset < data.length) {
        const delta = readVarInt(data, offset);
        offset = delta.offset;
        currentTime += delta.value;
        let status = data[offset++];
        if (!(status & 0x80)) {
            status = runningStatus;
            offset--;
        } else {
            runningStatus = status;
        }
        const type = status & 0xf0;
        const channel = status & 0x0f;

        if (status === 0xff) {
            const metaType = data[offset++];
            const metaLen = readVarInt(data, offset);
            offset = metaLen.offset;
            if (metaType === 0x51) {
                const mpb = (data[offset] << 16) | (data[offset + 1] << 8) | data[offset + 2];
                events.push({ time: currentTime / division, type: 'tempo', value: Math.round(60000000 / mpb) });
            }
            offset += metaLen.value;
            if (metaType === 0x2f) break;
        } else if (type === 0x90 || type === 0x80) {
            const note = data[offset++];
            const velocity = data[offset++];
            const isOn = (type === 0x90 && velocity > 0);
            events.push({
                time: (currentTime / division) * 4,
                type: isOn ? 'noteOn' : 'noteOff',
                note: note,
                velocity: velocity / 127,
                channel: channel
            });
        } else if (type === 0xb0 || type === 0xe0 || type === 0xa0) {
            offset += 2;
        } else if (type === 0xc0) {
            const program = data[offset++];
            events.push({ time: (currentTime / division) * 4, type: 'programChange', value: program, channel: channel });
        } else if (type === 0xd0) {
            offset += 1;
        }
    }
    return events;
}

function applyMidiToProject(midiData) {
    const header = parseMidiHeader(midiData);
    if (!header) return;
    let offset = 14;
    const allTracksEvents = [];

    for (let i = 0; i < header.trackCount; i++) {
        while (offset < midiData.length && !(midiData[offset] === 0x4d && midiData[offset + 1] === 0x54)) {
            offset++;
        }
        if (offset >= midiData.length) break;
        const length = (midiData[offset + 4] << 24) | (midiData[offset + 5] << 16) | (midiData[offset + 6] << 8) | midiData[offset + 7];
        allTracksEvents.push(parseMidiTrack(midiData.slice(offset + 8, offset + 8 + length), header.division));
        offset += 8 + length;
    }

    tracks = [];
    Object.keys(patterns).forEach(key => delete patterns[key]);
    let pid = 0;

    allTracksEvents.forEach((evts, index) => {
        if (evts.length === 0) return;

        const tempoEvt = evts.find(e => e.type === 'tempo');
        if (tempoEvt) {
            BPM = tempoEvt.value;
            if (typeof bpmInput !== 'undefined') bpmInput.value = BPM.toString();
        }

        let activeNotes = {};
        let finishedNotes = [];
        let isDrumTrack = false;
        let trackNameFromMidi = "";

        evts.forEach(e => {
            if (e.channel === 9) isDrumTrack = true;
            if (e.type === 'noteOn') {
                if (activeNotes[e.note]) {
                    const start = activeNotes[e.note];
                    finishedNotes.push({ x: start.x, y: e.note, w: Math.max(0.1, e.time - start.x), v: start.v });
                }
                activeNotes[e.note] = { x: e.time, v: e.velocity };
            } else if (e.type === 'noteOff') {
                if (activeNotes[e.note]) {
                    const start = activeNotes[e.note];
                    finishedNotes.push({ x: start.x, y: e.note, w: Math.max(0.1, e.time - start.x), v: start.v });
                    delete activeNotes[e.note];
                }
            }
        });

        for (let noteNum in activeNotes) {
            const start = activeNotes[noteNum];
            finishedNotes.push({ x: start.x, y: parseInt(noteNum), w: 0.5, v: start.v });
        }

        if (finishedNotes.length > 0) {
            const patId = pid++;
            const pName = isDrumTrack ? "DRUMS" : `MIDI ${index}`;

            patterns[patId] = {
                color: isDrumTrack ? "#ff4444" : `hsl(${(index * 137) % 360}, 60%, 50%)`,
                name: pName,
                notes: finishedNotes,
                instrument: "chip osc",
                fx: [],
                playingMidi: new Set()
            };

            instrumentStates[patId] = {
                _values: { 
                    type: isDrumTrack ? "noise" : "square", 
                    release: isDrumTrack ? 0.1 : 0.3 
                },
                saved: {}
            };
            if (typeof InstrumentManager !== 'undefined') {
                InstrumentManager.init("chip osc", patId);
            }

            const maxLen = Math.ceil(Math.max(...finishedNotes.map(n => n.x + n.w)));
            tracks.push({
                name: pName,
                muted: false,
                color: patterns[patId].color,
                patterns: [[0, maxLen, patId]]
            });
        }
    });

    nextPatternId = pid;
    if (typeof draw === "function") draw();
}
function importMID(file) {
    const reader = new FileReader();
    reader.onload = (e) => applyMidiToProject(new Uint8Array(e.target.result));
    reader.readAsArrayBuffer(file);
}
function encodeVar(v) {
    let buf = [v & 0x7f];
    while (v >>= 7) buf.push((v & 0x7f) | 0x80);
    return buf.reverse();
}
function createTrackChunk(data) {
    const len = data.length;
    return [
        0x4d, 0x54, 0x72, 0x6b,
        (len >> 24) & 0xff,
        (len >> 16) & 0xff,
        (len >> 8) & 0xff,
        len & 0xff,
        ...data
    ];
}
function exportAsMID() {
    const ticksPerBeat = 480;
    const tracksMidi = [];
    const trackCount = tracks.length + 1;
    const header = [
        0x4d, 0x54, 0x68, 0x64,
        0x00, 0x00, 0x00, 0x06,
        0x00, 0x01,
        (trackCount >> 8) & 0xff, trackCount & 0xff,
        (ticksPerBeat >> 8) & 0xff, ticksPerBeat & 0xff
    ];
    const tempoData = [];
    const bpmValue = parseInt(BPM) || 120;
    const microsecondsPerBeat = Math.round(60000000 / bpmValue);
    tempoData.push(0x00, 0xff, 0x51, 0x03);
    tempoData.push((microsecondsPerBeat >> 16) & 0xff);
    tempoData.push((microsecondsPerBeat >> 8) & 0xff);
    tempoData.push(microsecondsPerBeat & 0xff);
    tempoData.push(0x00, 0xff, 0x2f, 0x00);
    tracksMidi.push(...createTrackChunk(tempoData));
    tracks.forEach((track, trackIdx) => {
        let events = [];
        track.patterns.forEach(([startOffset, , id]) => {
        const p = patterns[id];
        if (!p || !p.notes) return;
        p.notes.forEach(n => {
        const startTick = Math.round((startOffset + n.x) * (ticksPerBeat / 4));
        const durationTicks = Math.round(n.w * (ticksPerBeat / 4));
        const midiNote = Math.max(0, Math.min(127, n.y));
        const velocity = Math.max(0, Math.min(127, Math.floor((n.v || 0.8) * 127)));
        events.push({ time: startTick, type: 0x90, note: midiNote, vel: velocity });
        events.push({ time: startTick + durationTicks, type: 0x80, note: midiNote, vel: 0 });
        });
        });
        events.sort((a, b) => a.time - b.time);
        let trackData = [];
        let lastTick = 0;
        events.forEach(e => {
        let delta = e.time - lastTick;
        if (delta < 0) delta = 0;
        trackData.push(...encodeVar(delta));
        trackData.push(e.type, e.note, e.vel);
        lastTick = e.time;
        });
        trackData.push(0x00, 0xff, 0x2f, 0x00);
        tracksMidi.push(...createTrackChunk(trackData));
    });
    const fullMidi = new Uint8Array([...header, ...tracksMidi]);
    const blob = new Blob([fullMidi], { type: "application/octet-stream" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `MIDI${Date.now()}.mid`;
    document.body.appendChild(a);
    installFile(blob,a.download)
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
}
function resetToBlank() {
    tracks = [];
    patterns = {};
    
    Object.keys(instrumentStates).forEach(k => delete instrumentStates[k]);
    Object.keys(effectStates).forEach(k => delete effectStates[k]);
    
    Object.keys(SongPlugins).forEach(k => delete SongPlugins[k]);
    Object.keys(window.Instruments).forEach(k => {
        if (k !== "chip osc" && k !== "wave player" ) delete window.Instruments[k];
    });
    Object.keys(window.Effects).forEach(k => delete window.Effects[k]);

    BPM = 120;
    if (typeof bpmInput !== 'undefined' && bpmInput) bpmInput.value = "120";
    
    nextPatternId = 0;

    tracks.push({
        name: "CH 1",
        muted: false,
        color: "rgb(0,153,204)",
        patterns: []
    });

    if (typeof proxyCache !== 'undefined') proxyCache.clear();
    if (typeof draw === 'function') draw();
}

 