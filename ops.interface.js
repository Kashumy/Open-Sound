function blobToBase64(blob) {
	return new Promise((resolve, reject) => {
		const reader = new FileReader();
		reader.onload = () => {
			const base64data = reader.result.split(',')[1];
			resolve(base64data);
		};
		reader.onerror = reject;
		reader.readAsDataURL(blob);
	});
}
function installFile(blob, name, text="", jsontype=false) {
   if (location.href.startsWith("file:///")) {
   if (jsontype) {
   NativeJava.DownloadText((text), name);
   } else {
   try {
   blobToBase64(blob).then(base64data => { 
    NativeJava.DownloadFile(base64data, name);
   });
   }catch (e) { NativeJava.showToast(e) }
  }
}
}

let caretDisable=false
		let c = document.getElementById('c'),
	ctx = c.getContext('2d');
		let hI = document.getElementById('hI');
		let fP = document.getElementById('fP');
		let activeEl = null;
		let isDown = false;
		let downTime = 0;
		let downX = 0,
			downY = 0;
const getV = (v, ref, windowRef) => {
    if (typeof v === "number") return v;
    if (!v || typeof v !== "string") return 0;
    v = v.trim();
        if (v.startsWith('calc(') && v.endsWith(')')) {
        let expr = v.slice(5, -1);
        const varRegex = /window\(([^)]+)\)/g;
        expr = expr.replace(varRegex, (_, content) => {
        const parts = content.split(",");
        const path = parts[0].trim().split(".");
        const fallback = parts[1] ? parseFloat(parts[1].trim()) : 0;
        let obj = globalThis;
        for (let key of path) {
        if (obj == null) { obj = undefined; break; }
        obj = obj[key];
        }
        return obj !== undefined ? obj : fallback;
        });
        expr = expr.replace(/([0-9.]+)(px|%|vw|vh)/g, (match, num, unit) => {
        num = parseFloat(num);
        switch (unit) {
        case 'px': return num;
        case '%': return (num / 100) * ref;
        case 'vw': return (num / 100) * window.innerWidth;
        case 'vh': return (num / 100) * window.innerHeight;
        }
        return num;
        });
        if (expr.includes("auto")) {
        const autoSize = measureText ? measureText("") : 0;
        expr = expr.replace(/auto/g, autoSize);
        }
        try {
        return new Function(`return (${expr})`)();
        } catch (e) {
        console.warn('calc() error:', v, "Expr:", expr, e);
        return 0;
        }
    }
    if (v.includes('window(')) {
        const resolved = Node.prototype.resolveStyle.call({resolveStyle: Node.prototype.resolveStyle}, v);
        return parseFloat(resolved) || 0;
    }
        if (v === "auto") return measureText ? measureText("") : 0;
    if (v.endsWith('px')) return parseFloat(v);
    if (v.endsWith('%')) return (parseFloat(v) / 100) * ref;
    if (v.endsWith('vw')) return (parseFloat(v) / 100) * window.innerWidth;
    if (v.endsWith('vh')) return (parseFloat(v) / 100) * window.innerHeight;
    return parseFloat(v) || 0;
};
		const measureText = (text, font = "16px Arial") => {
			ctx.font = font;
			return ctx.measureText(text).width + 20;
		};
		let caret = 0;
function getCaretX(el) {
    const s = el.style;
    let oldfont = ctx.font
    ctx.font = `${s.size}px Arial`;
    const textBefore = el.value.slice(0, el.caret);
    return el.box.x
        + s.textleft
        - el.scroll.x
        + ctx.measureText(textBefore).width;
        ctx.font=oldfont
}
let PointedNode;
		class Node {
			constructor(p) {
				this.onInput = p.onInput || null; 
				this.type = p.type || 'div';
				this.id = p.id || '';
				this.value = p.value || '';
				this.style = {
					"pos": p.style?.pos || 'rel',
					"t": p.style?.t ?? null,
					"l": p.style?.l ?? null,
					"r": p.style?.r || null,
					"b": p.style?.b || null,
					"w": p.style?.w || '100%',
					"h": p.style?.h || 'auto',
					"bg": p.style?.bg || 'transparent',
					"highlight": p.style?.highlight || null,
					"color": p.style?.color || '#fff',
					"rad": p.style?.rad || 0,
					"pad": p.style?.pad || 0,
					"ovx": p.style?.ovx || 'vis',
					"ovy": p.style?.ovy || 'vis',
					"sc": p.style?.sc || 1,
					"ts": p.style?.ts || { x: 0, y: 0 },
					"size": p.style?.size || 14,
					"border": p.style?.border || 0,
					"borderColor": p.style?.borderColor || '#444',
					"float": p.style?.float || 'none',
					"opacity": p.style?.opacity ?? 1,
					"display": p.style?.display ?? "block",
					"textleft": p.style?.textleft ?? 10,
					"texttop": p.style?.texttop ?? 10
				};
				this.scroll = { x: 0, y: 0 };
				this.children = [];
				this.box = { x: 0, y: 0, w: 0, h: 0 };
				this.contentH = 0;
				this.contentW = 0;
				this.onClick = p.onClick || null;
				this.parent = null;
				this.propagationZ = p.propagationZ ?? 0;
				this.caret = p?.caret ?? 0
				this._blinkStart = performance.now();
			}
			handleEvent(e, mx, my) {
	return null;
}
resolveStyle(v)
{
	if (typeof v !== "string") return v
	const varRegex = /window\(([^)]+)\)/g
	return v.replace(varRegex, (_, content) =>
	{
		const parts = content.split(",")
		const path = parts[0].trim().split(".")
		const fallback = parts[1] ? parts[1].trim() : undefined
		let obj = globalThis
		for (let key of path)
		{
			if (obj == null)
			{
				obj = undefined
				break
			}
			obj = obj[key]
		}
		if (obj === undefined)
		{
			return fallback !== undefined ? fallback : ""
		}
		return obj
	})
}
			add(c) {
				c.parent = this;
				this.children.push(c);
				return this;
			}
update(px, py, pw, ph) {
    const s = this.style;
    const pad = getV(s.pad, pw);
    if (s.w === 'auto') {
        this.box.w = measureText(this.value, `${s.size}px Arial`);
    } else {
        this.box.w = getV(s.w, pw);
    }
    if (s.h !== 'auto') {
        this.box.h = getV(s.h, ph);
    }
    if (s.l !== null) this.box.x = px + getV(s.l, pw);
    else if (s.r !== null) this.box.x = px + pw - this.box.w - getV(s.r, pw);
    else this.box.x = px;
    if (s.t !== null) this.box.y = py + getV(s.t, ph);
    else if (s.b !== null) this.box.y = py + ph - this.box.h - getV(s.b, ph);
    else this.box.y = py;
    let cursorX = 0;
    let cursorY = 0;
    let currentLineHeight = 0;
    let maxContentW = 0;
    let maxContentH = 0;
    const availableW = Math.max(0, this.box.w - (pad * 2));
    const isPass = s.ovx.includes('pass');
    const layoutLimitW = isPass ? Infinity : availableW;
    this.children.forEach(c => {
        if (c.style.pos === 'abs') {
        c.update(this.box.x, this.box.y, this.box.w, this.box.h);
        maxContentW = Math.max(maxContentW, (c.box.x - this.box.x) + c.box.w);
        maxContentH = Math.max(maxContentH, (c.box.y - this.box.y) + c.box.h);
        return;
        }
        const offX = (s.ovx !== 'vis') ? -this.scroll.x : 0;
        const offY = (s.ovy !== 'vis') ? -this.scroll.y : 0;
        let childW = (c.style.w === 'auto') ? measureText(c.value, `${c.style.size}px Arial`) : getV(c.style.w, availableW);
        if (c.style.float === 'left') {
        if (cursorX + childW > layoutLimitW) { 
        if (cursorX > 0) { 
        cursorX = 0;
        cursorY += currentLineHeight + 5;
        currentLineHeight = 0;
         }
        }
        c.update(this.box.x + pad + cursorX + offX, this.box.y + pad + cursorY + offY, availableW, ph);
        cursorX += c.box.w + 5;
        currentLineHeight = Math.max(currentLineHeight, c.box.h);
        } else {
        if (cursorX > 0) {
        cursorY += currentLineHeight + 5;
        cursorX = 0;
        currentLineHeight = 0;
        }
        c.update(this.box.x + pad + offX, this.box.y + pad + cursorY + offY, availableW, ph);
        cursorY += c.box.h + 5;
        }
        maxContentW = Math.max(maxContentW, cursorX);
        maxContentH = Math.max(maxContentH, cursorY + currentLineHeight);
    });
    this.contentW = maxContentW;
    this.contentH = Math.max(maxContentH, cursorY + currentLineHeight); 
    if (s.h === 'auto') {
        this.box.h = this.contentH + (pad * 2);
    }
}
			draw() {
 const s = this.style;
 if (s.opacity <= 0) return;
 if (s.display == "none") return;
				const { x, y, w, h } = this.box;
				ctx.save();
				ctx.globalAlpha = s.opacity;
				ctx.translate(x + s.ts.x, y + s.ts.y);
				ctx.scale(s.sc, s.sc);
				ctx.translate(-x, -y);
				if (s.ovx !== 'vis' || s.ovy !== 'vis') {
					ctx.beginPath();
					if (ctx.roundRect) {
						ctx.roundRect(x, y, w, h, s.rad);
					} else {
						ctx.rect(x, y, w, h);
					}
					ctx.clip();
				}
				ctx.beginPath();
				if (ctx.roundRect) {
					ctx.roundRect(x, y, w, h, s.rad);
				} else {
					ctx.rect(x, y, w, h);
				}
				ctx.fillStyle = this.resolveStyle(s.bg)
				ctx.fill();
				if (this === PointedNode && s.highlight!==null) {
	ctx.fillStyle = this.resolveStyle(s.highlight);
	ctx.fill();
}
				if (s.border > 0) {
					ctx.strokeStyle = s.borderColor;
					ctx.lineWidth = s.border;
					ctx.stroke();
				}
				if (this.value || this.type === 'input') {
	ctx.fillStyle = this.resolveStyle(s.color);
	ctx.font = `${s.size}px Arial`;
	let text = this.value;
	const shouldTruncate = s.ovx.includes('...')
	if (shouldTruncate) {
		const maxW = this.box.w - (s.textleft * 2);
		let t = text;
		while (ctx.measureText(t).width > maxW && t.length > 0) {
			t = t.slice(0, -1);
		}
		if (t !== text) t += ".";
		text = t;
	}
	ctx.fillText(text, x + getV(s.textleft) - getV(this.scroll.x), y + getV(s.size) + getV(s.texttop) );
if (activeEl === this) {
    const blink = Math.floor((performance.now() - this._blinkStart) / 500) % 2 === 0;
    if (blink && !caretDisable) {
        const cx =  getCaretX(this);
        ctx.beginPath();
        ctx.moveTo(cx, y + getV(s.texttop) );
        ctx.lineTo(cx, y + getV(s.texttop) + getV(s.size) + 4);
        ctx.strokeStyle = this.resolveStyle(s.color);
        ctx.lineWidth = 1;
        ctx.stroke();
    }
}
				}
				this.children.forEach(c => c.draw());
				ctx.restore();
			}
			getCaretX(d) {
    const s = d.style;
    ctx.font = `${s.size}px Arial`;
    const textBefore = d.value.slice(0, d.caret);
    return d.box.x
        + s.textleft
        - d.scroll.x
        + ctx.measureText(textBefore).width;
}
			findTarget(mx, my) {
 if (this.style.opacity <= 0) return null;
 if (this.style.display == "none") return null;
				if ((this.style.ovx !== 'vis' || this.style.ovy !== 'vis') &&
					(mx < this.box.x || mx > this.box.x + this.box.w || my < this.box.y || my > this.box.y + this.box.h)) {
					return null;
				}
				for (let i = this.children.length - 1; i >= 0; i--) {
					const child = this.children[i];
					const t = child.findTarget(mx, my);
					if (t) return t;
				}
				if (this.style.bg == "transparent" && this.type !== "knob" && this.type !== "slider" ) return null;
				if (mx >= this.box.x && mx <= this.box.x + this.box.w &&
					my >= this.box.y && my <= this.box.y + this.box.h) {
					return this;
				}
				return null;
			}
		}
		class Slider extends Node {
			constructor(p) {
				super(p);
				this.type = 'slider';
				this.min = p.min ?? 0;
				this.max = p.max ?? 100;
				this.step = p.step ?? 0
				this.val = p.value ?? 50;
				this.value = '';
				this.isMoving = false;
				this.style.thumb = p.style?.thumb || { w: 20, h: 20, bg: '#0f0', rad: 10 };
				this.onInput = p.onInput || null;
			}
			updateValue(mx) {
				const s = this.style;
				const pad = getV(s.pad, this.box.w);
				const trackW = this.box.w - (pad * 2);
				const relX = Math.max(0, Math.min(trackW, mx - (this.box.x + pad)));
				let pct = relX / trackW;
				let rawVal = this.min + (this.max - this.min) * pct;
function getStepDecimals(step) {
	const s = step.toString();
	if (s.includes(".")) return s.split(".")[1].length;
	return 0;
}
if (this.step == 0) {
	this.val = rawVal;
} else {
	const decimals = getStepDecimals(this.step);
	this.val = Math.round(rawVal / this.step) * this.step;
	this.val = parseFloat(this.val.toFixed(decimals));
}
				if (this.onInput) this.onInput(this.val);
			}
			draw() {
				const s = this.style;
if (s.opacity <= 0) return;
const { x, y, w, h } = this.box;
ctx.save();
ctx.globalAlpha = s.opacity;
				ctx.translate(x + s.ts.x, y + s.ts.y);
				ctx.scale(s.sc, s.sc);
				ctx.translate(-x, -y);
				ctx.beginPath();
				if (ctx.roundRect) ctx.roundRect(x, y, w, h, s.rad);
				else ctx.rect(x, y, w, h);
				ctx.fillStyle = this.resolveStyle(s.bg)
				ctx.fill();
				if (s.border > 0) {
					ctx.strokeStyle = s.borderColor;
					ctx.lineWidth = s.border;
					ctx.stroke();
				}
				const t = s.thumb;
				const pad = getV(s.pad, w);
				const trackW = w - (pad * 2);
				const pct = (this.val - this.min) / (this.max - this.min);
				const thumbW = getV(t.w, trackW);
				const thumbH = getV(t.h, h);
				const thumbX = x + pad + (trackW * pct) - (thumbW / 2);
				const thumbY = y + (h / 2) - (thumbH / 2);
				ctx.fillStyle = t.bg;
				ctx.beginPath();
				if (ctx.roundRect) ctx.roundRect(thumbX, thumbY, thumbW, thumbH, t.rad);
				else ctx.rect(thumbX, thumbY, thumbW, thumbH);
				ctx.fill();
				if (this.isMoving) {
					ctx.globalAlpha = 0.5;
					ctx.fillStyle = this.resolveStyle(s.color) || "#fff";
					ctx.font = "10px Arial";
					ctx.textAlign = "center";
					ctx.fillText(this.val, thumbX + (thumbW / 2), thumbY + thumbH + 12);
				}
				ctx.restore();
			}
		}
class Knob extends Node {
 constructor(p) {
  super(p);
  this.type = 'knob';
  this.min = p.min ?? 0;
  this.max = p.max ?? 100;
  this.step = p.step ?? 0;
  this._rawVal = p.value ?? 50;
  this._val = this._applyStep(this._rawVal);
  this.isMoving = false;
  this.onInput = p.onInput || null;
  this.sensitivity = p?.sensitivity ?? 0.5;
  this.style.knobColor = p.style?.knobColor || '#00d1ff';
  this.style.trackColor = p.style?.trackColor || '#333';
 }
 get val() {
  return this._val;
 }
 set val(v) {
  v = Math.max(this.min, Math.min(this.max, v));
  this._rawVal = v;
  this._val = this._applyStep(v);
	if (this.onInput) this.onInput(this._val);
 }
 _applyStep(v) {
  if (this.step <= 0) return v;
  const decimals = this.getStepDecimals(this.step);
  v = Math.round(v / this.step) * this.step;
  return parseFloat(v.toFixed(decimals));
 }
 getStepDecimals(step) {
  const s = step.toString();
  if (s.includes(".")) return s.split(".")[1].length;
  return 0;
 }
 updateValue(dy) {
  const range = this.max - this.min;
  const delta = -dy * this.sensitivity * (range / 200);
  this._rawVal += delta;
  this._rawVal = Math.max(this.min, Math.min(this.max, this._rawVal));
  const stepped = this._applyStep(this._rawVal);
  if (stepped !== this._val) {
   this._val = stepped;
   if (this.onInput) this.onInput(this._val);
  }
 }
 draw() {
  const { x, y, w, h } = this.box;
  const s = this.style;
  if (s.opacity <= 0) return;
  const centerX = x + w / 2;
  const centerY = y + h / 2;
  const radius = Math.min(w, h) / 2 - 5;
  ctx.save();
  ctx.globalAlpha = s.opacity;
  ctx.beginPath();
  ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
  ctx.fillStyle = this.resolveStyle(s.trackColor)  
  ctx.fill();
  if (s.border > 0) {
   ctx.strokeStyle = this.resolveStyle(s.borderColor);
   ctx.lineWidth = s.border;
   ctx.stroke();
  }
  const startAngle = 0.75 * Math.PI;
  const endAngle = 2.25 * Math.PI;
  const currentAngle =
   startAngle +
   (endAngle - startAngle) *
   ((this._val - this.min) / (this.max - this.min));
  ctx.beginPath();
  ctx.lineCap = "round";
  ctx.lineWidth = 4;
  ctx.strokeStyle = this.resolveStyle(s.knobColor);
  ctx.moveTo(centerX, centerY);
  ctx.lineTo(
   centerX + Math.cos(currentAngle) * radius,
   centerY + Math.sin(currentAngle) * radius
  );
  ctx.stroke();
  if (this.isMoving) {
   ctx.globalAlpha = 0.5;
   ctx.fillStyle = this.resolveStyle(s.knobColor)  
   ctx.font = "10px Arial";
   ctx.textAlign = "center";
   ctx.fillText(
     this._val.toFixed(3),
    centerX,
    centerY + radius + 12
   );
   ctx.globalAlpha = 1;
  }
  ctx.restore();
 }
}
class InputFile extends Node {
    constructor(p = {}) {
        super({
        type: "inputfile",
        value: p.value || "Select file",
        diplayLoadingText: p.diplayLoadingText||"loading...",
        style: {
        w: p.style?.w || 150, h: p.style?.h || 30,
        bg: p.style?.bg || "#444", color: p.style?.color || "#fff",
        rad: p.style?.rad || 4, pad: p.style?.pad || 5, ...p.style,
        }
        });
        this.accept = p.accept || "*/*";
        this.onChange = p.onChange || null;
        this.proxy = p.proxy || null;
        if (this.proxy) {
        const storedName = this.proxy._values?.fileName || (this.proxy.saved && this.proxy.saved.fileName);
        if (storedName) {
        this.value = storedName;
        }
        }
        this.domInput = document.createElement("input");
        this.domInput.type = "file";
        this.domInput.accept = this.accept;
        this.domInput.style.display = "none";
        const createFakeFile = async (b64, name) => {
        const res = await fetch(b64);
        const blob = await res.blob();
        return {
        name: name,
        size: blob.size,
        arrayBuffer: () => blob.arrayBuffer()
        };
        };
        this.domInput.addEventListener("change", async (e) => {
				const file = e.target.files[0];
				if (!file) return;
				this.value = p.diplayLoadingText||"loading..."
				await new Promise(r => requestAnimationFrame(r));
				const reader = new FileReader();
        reader.onload = async (re) => {
        const b64 = re.target.result;
        if (this.proxy) {
        this.proxy.saved = {
        b64data: b64,
        fileName: file.name
        };
        if (this.proxy._values) {
        this.proxy._values.fileName = file.name;
        this.proxy._values.b64data = b64;
        }
        }
        if (this.onChange) {
        const fake = await createFakeFile(b64, file.name);
        this.value = file.name
        this.onChange(fake, file.name);
        }
        };
        reader.readAsDataURL(file);
        });
        this.onClick = () => this.domInput.click();
        const savedData = this.proxy?._values?.b64data || this.proxy?.saved?.b64data;
        const savedName = this.proxy?._values?.fileName || this.proxy?.saved?.fileName;
        if (savedData) {
        setTimeout(async () => {
        try {
        const fake = await createFakeFile(savedData, savedName || "Restored File");
        if (this.onChange) await this.onChange(fake, fake.name);
        } catch(e) { console.error("Restore file error:", e); }
        }, 100);
        }
    }
    destroy() {
        if (this.domInput) this.domInput.remove();
    }
}
class Textarea extends Node {
    constructor(p) {
        super(p);
        this.onInput = p.onInput || null; 
        this.type = 'textarea';
        this.value = p.value || '';
        this.wrap = p.wrap !== undefined ? p.wrap : true;
        this.maxCharacters = p.maxCharacters || Infinity;
        this.maxLines = p.maxLines || Infinity;
        if (this.style.ovy === 'vis') this.style.ovy = 'auto';
        if (this.style.ovx === 'vis') this.style.ovx = 'auto';
        this.lines = [];
        this._lineHeight = 0;
        this.onClick = p.onClick || ((el, pos) => {
        caretDisable = false;
        activeEl = el;
        activeInput = el;
        if (typeof hI !== 'undefined') {
        hI.value = el.value;
        hI.focus();
        hI.click
        const index = this.getCaretFromPoint(pos.x, pos.y);
        this.caret = index;
        hI.setSelectionRange(index, index);
        setTimeout(function() {
			     hI.focus();
        },10);
        }
        });
    }
    get value() {
        return this._value;
    }
    set value(v) {
        this._value = String(v).substring(0, this.maxCharacters);
    }

    splitLines(ctx, maxWidth) {
        let text = this.value.substring(0, this.maxCharacters);
        const paragraphs = text.split('\n');
        let allLines = [];
        let currentPos = 0;
        paragraphs.forEach((para) => {
        if (!this.wrap || maxWidth <= 0) {
        allLines.push({ text: para, start: currentPos });
        } else {
        let words = para.split(' ');
        let currentLine = "";
        let lineStart = currentPos;
        for (let i = 0; i < words.length; i++) {
        let word = words[i];
        let testLine = currentLine + (currentLine ? " " : "") + word;
        if (ctx.measureText(testLine).width > maxWidth && currentLine !== "") {
        allLines.push({ text: currentLine, start: lineStart });
        lineStart += currentLine.length + 1;
        currentLine = word;
        } else {
        currentLine = testLine;
        }
        }
        allLines.push({ text: currentLine, start: lineStart });
        }
        currentPos += para.length + 1;
        });
        return allLines.slice(0, this.maxLines);
    }
    getCaretFromPoint(mx, my) {
        const s = this.style;
        const relativeY = my - this.box.y - getV(s.texttop) + this.scroll.y;
        const lineIdx = Math.max(0, Math.floor(relativeY / this._lineHeight));
        const line = this.lines[Math.min(lineIdx, this.lines.length - 1)];
        if (!line) return this.value.length;
        const relativeX = mx - this.box.x - getV(s.textleft) + this.scroll.x;
        ctx.font = `${s.size}px Arial`;
        let bestOffset = 0;
        let minDiff = Infinity;
        for (let i = 0; i <= line.text.length; i++) {
        const w = ctx.measureText(line.text.substring(0, i)).width;
        const diff = Math.abs(w - relativeX);
        if (diff < minDiff) {
        minDiff = diff;
        bestOffset = i;
        }
        }
        return line.start + bestOffset;
    }
    update(px, py, pw, ph) {
        super.update(px, py, pw, ph);
        const s = this.style;
        ctx.font = `${s.size}px Arial`;
        this._lineHeight = s.size * 1.2;
        const availableW = this.box.w - (getV(s.textleft) * 2);
        this.lines = this.splitLines(ctx, availableW);
        this.contentH = this.lines.length * this._lineHeight + (getV(s.texttop) * 2);
        let maxW = 0;
        this.lines.forEach(l => {
        maxW = Math.max(maxW, ctx.measureText(l.text).width);
        });
        this.contentW = maxW + (getV(s.textleft) * 2);
    }
    draw() {
        const s = this.style;
        if (s.opacity <= 0) return;
        const { x, y, w, h } = this.box;
        ctx.save();
        ctx.translate(x + s.ts.x, y + s.ts.y);
        ctx.scale(s.sc, s.sc);
        ctx.translate(-x, -y);
        ctx.beginPath();
        if (ctx.roundRect) ctx.roundRect(x, y, w, h, s.rad);
        else ctx.rect(x, y, w, h);
        ctx.clip();
        ctx.fillStyle = this.resolveStyle(s.bg);
        ctx.fill();
        if (activeEl === this && s.highlight) {
        ctx.fillStyle = this.resolveStyle(s.highlight);
        ctx.fill();
        }
        ctx.font = `${s.size}px Arial`;
        const startY = y + getV(s.texttop) - this.scroll.y;
        const textStartX = x + getV(s.textleft) - this.scroll.x;
        let caretDrawn = false;
        this.lines.forEach((line, i) => {
        const lineY = startY + (i * this._lineHeight);
        const textBaseline = lineY + s.size;
        if (textBaseline > y && textBaseline < y + h + s.size) {
        ctx.fillStyle = this.resolveStyle(s.color);
        ctx.fillText(line.text, textStartX, textBaseline);
        if (activeEl === this && !caretDisable) {
        const isWithinLine = this.caret >= line.start && this.caret <= line.start + line.text.length;
        if (isWithinLine && !caretDrawn) {
        const blink = Math.floor((performance.now() - this._blinkStart) / 500) % 2 === 0;
        if (blink) {
        const offsetInLine = this.caret - line.start;
        const caretX = textStartX + ctx.measureText(line.text.substring(0, offsetInLine)).width;
        ctx.beginPath();
        ctx.moveTo(caretX, lineY + (s.size * 0.2));
        ctx.lineTo(caretX, lineY + s.size + 4);
        ctx.strokeStyle = this.resolveStyle(s.color);
        ctx.lineWidth = 1;
        ctx.stroke();
        }
        caretDrawn = true;
        }
        }
        }
        });
        if (s.border > 0) {
        ctx.strokeStyle = s.borderColor;
        ctx.lineWidth = s.border;
        ctx.stroke();
        }
        ctx.restore();
    }
}
class CanvasNode extends Node {
    constructor(p) {
        super(p);
        this.type = 'canvas';
        this.onDraw = p.onDraw || null;
        this.onPointerDown = p.onPointerDown || null;
        this.onPointerMove = p.onPointerMove || null;
        this.onPointerUp = p.onPointerUp || null;
        this.isDragging = false;
    }
    handleEvent(e, mx, my) {
        const { x, y, w, h } = this.box;
        const lx = mx - x;
        const ly = my - y;
        const type = e.type.toLowerCase();
        if (type.includes('down') || type.includes('start')) {
        this.isDragging = true;
        if (this.onPointerDown) this.onPointerDown(lx, ly, w, h);
        }
        else if (type.includes('move')) {
        if (this.isDragging && this.onPointerMove) {
        this.onPointerMove(lx, ly, w, h);
        }
        }
        else if (type.includes('up') || type.includes('end') || type.includes('cancel')) {
        if (this.isDragging && this.onPointerUp) {
        this.onPointerUp(lx, ly, w, h);
        }
        this.isDragging = false;
        }
        return super.handleEvent(e, mx, my);
    }
    update(px, py, pw, ph) {
        const s = this.style;
        this.box.w = (s.w === 'auto') ? 200 : getV(s.w, pw);
        this.box.h = (s.h === 'auto') ? 150 : getV(s.h, ph);
        this.box.x = (s.l !== null) ? px + getV(s.l, pw) : px;
        this.box.y = (s.t !== null) ? py + getV(s.t, ph) : py;
    }
    draw() {
        super.draw();
        const { x, y, w, h } = this.box;
        if (this.style.opacity <= 0) return;
        ctx.save();
        ctx.beginPath();
        if (ctx.roundRect) ctx.roundRect(x, y, w, h, this.style.rad);
        ctx.clip();
        ctx.translate(x, y);
        if (this.onDraw) this.onDraw(ctx, w, h);
        ctx.restore();
    }
}
let capturedNode = null;
function findScrollableParent(node, axis = 'y') {
	if (!node) return null;
	const style = node.style[axis === 'y' ? 'ovy' : 'ovx'];
	if (style && style.includes('scroll')) return node;
	return findScrollableParent(node.parent, axis);
}
let lastX,lastY
let draggingCanvas = null;


function setupEventListeners() {
    c.addEventListener('pointerdown', e => {
        isDown = true;
        downX = lastX = e.clientX;
        downY = lastY = e.clientY;
        const target = root.findTarget(e.clientX, e.clientY);
        if (target && (target.type === 'input' || target.type === 'textarea')) {
            caretDisable = false;
            activeEl = target;
        } else {
            caretDisable = true;
            activeEl = null;
        }
        if (target instanceof Slider) draggingSlider = target;
        else if (target instanceof Knob) draggingKnob = target;
        else if (target instanceof CanvasNode) {
            draggingCanvas = target;
            draggingCanvas.handleEvent(e, e.clientX, e.clientY);
        }
    });

    c.addEventListener('pointermove', e => {
        const dx = e.clientX - lastX;
        const dy = e.clientY - lastY;
        if (draggingKnob) {
            draggingKnob.isMoving = true;
            draggingKnob.updateValue(-dx);
        } else if (draggingSlider) {
            draggingSlider.isMoving = true;
            draggingSlider.updateValue(e.clientX);
        } else if (draggingCanvas) {
            draggingCanvas.handleEvent(e, e.clientX, e.clientY);
        } else if (isDown) {
            const target = root.findTarget(e.clientX, e.clientY);
            const scrollableY = findScrollableParent(target, 'y');
            if (scrollableY) {
                const limitY = Math.max(0, scrollableY.contentH - scrollableY.box.h + (getV(scrollableY.style.pad, scrollableY.box.w) * 2));
                if (limitY > 0) scrollableY.scroll.y = Math.max(0, Math.min(limitY, scrollableY.scroll.y - dy));
            }
            const scrollableX = findScrollableParent(target, 'x');
            if (scrollableX) {
                const limitX = Math.max(0, scrollableX.contentW - scrollableX.box.w + (getV(scrollableX.style.pad, scrollableX.box.w) * 2));
                if (limitX > 0) scrollableX.scroll.x = Math.max(0, Math.min(limitX, scrollableX.scroll.x - dx));
            }
        }
        lastX = e.clientX;
        lastY = e.clientY;
        render();
    });

    c.addEventListener('pointerup', e => {
        isDown = false;
        if (draggingKnob) draggingKnob.isMoving = false;
        if (draggingCanvas) draggingCanvas.handleEvent(e, e.clientX, e.clientY);
        draggingKnob = draggingSlider = draggingCanvas = null;
        render();
    });

    c.addEventListener('wheel', e => {
        e.preventDefault();
        const target = root.findTarget(e.clientX, e.clientY);
        if (!target) return;
        if (target instanceof Knob) {
            e.stopPropagation();
            draggingKnob = target;
            draggingKnob.isMoving = true;
            target.updateValue(e.deltaY * target.sensitivity);
            render(); 
            setTimeout(function (){ if(draggingKnob && draggingKnob!==null){draggingKnob.isMoving=false};draggingKnob=null; },200)
            return;
        }
        const scrollable = findScrollableParent(target, 'y');
        if (scrollable) {
            const limitY = Math.max(0, scrollable.contentH - scrollable.box.h + (getV(scrollable.style.pad, scrollable.box.w) * 2));
            e.stopPropagation();
            scrollable.scroll.y = Math.max(0, Math.min(limitY, scrollable.scroll.y + e.deltaY));
            render();
        }
    }, { passive: false });

    window.addEventListener('resize', () => {
        root.update(0, 0, window.innerWidth, window.innerHeight);
        const checkResets = (node) => {
            const pad = getV(node.style.pad, node.box.w);
            if (node.contentH <= node.box.h - (pad * 2)) node.scroll.y = 0;
            if (node.contentW <= node.box.w - (pad * 2)) node.scroll.x = 0;
            node.children.forEach(checkResets);
        };
        checkResets(root);
        render();
    });
}

 