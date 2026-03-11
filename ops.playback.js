function updatePlayback(deltaSec) {
	if (anabledScroll === 0) return;
	const autoMap = buildAutomationMap();
	if (autoMap.global && autoMap.global.BPM) {
	const newBpm = getAutomationValue(autoMap.global.BPM, playheadStep);
	if (newBpm) BPM = newBpm;
}
	const stepsPerSec = (BPM / 60) * 4;
	const prevStep = playheadStep;
	playheadStep += deltaSec * stepsPerSec;
	

	if (workletNode) {
		workletNode.port.postMessage({ type: "AUTOMATION_DATA", data: autoMap });
		workletNode.port.postMessage({ type: "PLAYHEAD", step: playheadStep });
		workletNode.port.postMessage({ type: "SET_BPM", bpm: BPM });
	}
	const notesPerInstance = {};
	const activeFXPerInstance = {};
	for (const track of tracks) {
		if (track.muted) continue;
		for (const [startStep, width, patId] of track.patterns) {
			const pattern = patterns[patId];
			if (!pattern || pattern.type === "mod") continue;
			const stateKey = `${pattern.instrument}_inst_${pattern.instance || 0}_pat_${patId}`;
			
			if (!notesPerInstance[stateKey]) notesPerInstance[stateKey] = new Set();
			const patternEnd = startStep + width;
			if (playheadStep >= startStep && playheadStep < patternEnd) {
				activeFXPerInstance[stateKey] = {
					fx: pattern.fx || [],
					hash: JSON.stringify(pattern.fx || [])
				};
			}
			const activeInPattern = [];
			for (const note of pattern.notes) {
				const noteStart = startStep + note.x;
				const noteEnd = noteStart + note.w;
				if (noteStart >= patternEnd) continue;
				if (playheadStep >= noteStart && playheadStep < noteEnd) {
					activeInPattern.push(note);
				}
				const shouldTrigger = (prevStep <= noteStart && playheadStep >= noteStart) ||
					(playheadStep < prevStep && noteStart === 0);
				if (shouldTrigger && !note.played) {
					const offsetSteps = Math.max(0, playheadStep - noteStart);
					const remainingLength = note.w - offsetSteps;
					if (remainingLength > 0) {
						playNote(note.y, remainingLength / 4, pattern.instrument, patId, note.v);
						note.played = true;
					}
				}
			}
			let toPlay = activeInPattern;
			const limit = pattern.chordMax;
			if (limit > 0 && activeInPattern.length > limit) {
				toPlay = [...activeInPattern].sort((a, b) => a.y - b.y).slice(0, limit);
			}
			for (const note of toPlay) notesPerInstance[stateKey].add(note.y);
		}
	}
	if (workletNode) {
		for (const stateKey in notesPerInstance) {
			workletNode.port.postMessage({
				type: "PLAYING_NOTES",
				stateKey,
				notes: Array.from(notesPerInstance[stateKey])
			});
		}
		for (const stateKey in activeFXPerInstance) {
			const fxInfo = activeFXPerInstance[stateKey];
			workletNode.port.postMessage({
				type: "UPDATE_INSTANCE_FX",
				stateKey: stateKey,
				fxHash: fxInfo.hash,
				fxChain: fxInfo.fx.map(fxKey => {
					const type = fxKey.split("_fx_")[0];
					return {
						id: fxKey,
						code: window.Effects[type]?.process ?? ``,
						proxy: getAudioSafeProxy(getCachedProxy('effect', type, parseInt(fxKey.split("_fx_")[1]), "_fx_"), true)
					};
				})
			});
		}
	}
	if (playheadStep >= TOTAL_STEPS) {
		playheadStep = 0;
		tracks.forEach(t => t.patterns.forEach(([, , id]) => {
			const p = patterns[id];
			if (p?.notes) p.notes.forEach(n => n.played = false);
		}));
	}
}
 

function updatePlayback(deltaSec) {
	if (anabledScroll === 0) return;
	
	const autoMap = buildAutomationMap();
	
	if (autoMap.global && autoMap.global.BPM) {
		const newBpm = getAutomationValue(autoMap.global.BPM, playheadStep);
		if (newBpm) {
			BPM = newBpm;
			if (workletNode) {
				workletNode.port.postMessage({ type: "SET_BPM", bpm: BPM });
			}
		}
	}

	const stepsPerSec = (BPM / 60) * 4;
	const prevStep = playheadStep;
	playheadStep += deltaSec * stepsPerSec;

	if (workletNode) {
		workletNode.port.postMessage({ type: "AUTOMATION_DATA", data: autoMap });
		workletNode.port.postMessage({ type: "PLAYHEAD", step: playheadStep });
	}

	const notesPerInstance = {};
	const activeFXPerInstance = {};

	for (const track of tracks) {
		if (track.muted) continue;
		for (const [startStep, width, patId] of track.patterns) {
			const pattern = patterns[patId];
			if (!pattern || pattern.type === "mod") continue;
			
			const instName = pattern.instrument || "chip osc";
			const stateKey = `${instName}_inst_${pattern.instance || 0}_pat_${patId}`;
			const patternEnd = startStep + width;

			if (!notesPerInstance[stateKey]) notesPerInstance[stateKey] = new Set();
			
			if (playheadStep >= startStep && playheadStep < patternEnd) {
				activeFXPerInstance[stateKey] = {
					fx: pattern.fx || [],
					hash: JSON.stringify(pattern.fx || [])
				};
			}

			for (const note of pattern.notes) {
				const noteStart = startStep + note.x;
				const noteEnd = noteStart + note.w;

				if (playheadStep >= noteStart && playheadStep < noteEnd) {
					notesPerInstance[stateKey].add(note.y);
				}

				const shouldTrigger = (prevStep <= noteStart && playheadStep >= noteStart) ||
					(playheadStep < prevStep && noteStart === 0);

				if (shouldTrigger && !note.played) {
					const offsetSteps = Math.max(0, playheadStep - noteStart);
					const remainingLength = note.w - offsetSteps;
					if (remainingLength > 0) {
						playNote(note.y, remainingLength / 4, pattern.instrument, patId, note.v);
						note.played = true;
					}
				}
			}
		}
	}

	if (workletNode) {
		for (const stateKey in notesPerInstance) {
			workletNode.port.postMessage({
				type: "PLAYING_NOTES",
				stateKey,
				notes: Array.from(notesPerInstance[stateKey])
			});
		}
		for (const stateKey in activeFXPerInstance) {
			const fxInfo = activeFXPerInstance[stateKey];
			workletNode.port.postMessage({
				type: "UPDATE_INSTANCE_FX",
				stateKey: stateKey,
				fxHash: fxInfo.hash,
				fxChain: fxInfo.fx.map(fxKey => {
					const type = fxKey.split("_fx_")[0];
					return {
						id: fxKey,
						code: window.Effects[type]?.process ?? ``,
						proxy: getAudioSafeProxy(getCachedProxy('effect', type, parseInt(fxKey.split("_fx_")[1]), "_fx_"), true)
					};
				})
			});
		}
	}

	if (playheadStep >= TOTAL_STEPS) {
		playheadStep = 0;
		tracks.forEach(t => t.patterns.forEach(([, , id]) => {
			const p = patterns[id];
			if (p?.notes) p.notes.forEach(n => n.played = false);
		}));
	}
}


