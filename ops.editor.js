/*▄▖▄▖▄▖  ▄▖▄▖▄▖▖ ▖  ▄▖  ▖▖▖ ▖▄ 
  ▌▌▙▌▚   ▌▌▙▌▙▖▛▖▌  ▚ ▛▌▌▌▛▖▌▌▌
  ▙▌▌ ▄▌  ▙▌▌ ▙▖▌▝▌  ▄▌▙▌▙▌▌▝▌▙▘
  EDITOR                            */
/* ************* */
VERSION = 1.55
/* ************* */
let fileInput = document.getElementById('fileInput');
let activeInput = null; let UpPoint=0
let settings = {
	buildMusicBeforePlay:false,
	songVolume:1,
	interfaceScale:1,
	dpi:1,
	cleanPatterns:false,
}
const buildInThemes = {
"Dark": {
		boxcolor: "#333",
		buttons: "#1d1d1d",
		textcolor: "#fff",
		channelTextColor:"#fff",
		pianoRollAndInputsBg: "#111",
		tracksTextAndPianoWhite: "#ddd",
		blackPianoAndTrackbg: "#111",
		tracksBg: "#222",
		inputAndDoneRename: "#111111",
		channelsColor: "#444",
		editorBg: "#000",
		patternBg: "#3A3A3A",
		highlight: "rgba(0.9,0.9,0.9,0.05)",
	done: "#080",
	playbtnColor:"#FFFFFF",
	chanL:"#FFDB36",
	chanR:"#36F7FF",
	hueRotate: "0deg",
	saturation: "1.0",
	contrast: "1.0"
	},
"Light": {
		boxcolor: "#ccc",
		buttons: "#ddd",
		textcolor: "#000",
		channelTextColor:"#ddd",
		pianoRollAndInputsBg: "#fff",
		tracksTextAndPianoWhite: "#333",
		blackPianoAndTrackbg: "#eee",
		tracksBg: "#aaa",
		inputAndDoneRename: "#fff",
		channelsColor: "#bbb",
		editorBg: "#eee",
		patternBg: "#999",
		highlight: "rgba(0.9,0.9,0.9,0.05)",
	done: "#080",
	playbtnColor:"#fff",
	chanL:"#000",
chanR:"#222",
hueRotate: "0deg",
	saturation: "1.0",
	contrast: "1.0",
	patternStroke: "#888",
	patternStroke2: "#aaa",
	},
"Green": {
		boxcolor: "#454",
		buttons: "#232",
		textcolor: "#0f0",
		channelTextColor:"#0f0",
		pianoRollAndInputsBg: "#010",
		tracksTextAndPianoWhite: "#ddd",
		blackPianoAndTrackbg: "#010",
		tracksBg: "#010",
		inputAndDoneRename: "#000",
		channelsColor: "#030",
		editorBg: "#000",
		patternBg: "#0a0",
		highlight: "rgba(0.9,0.9,0.9,0.05)",
	done: "#080",
	playbtnColor:"#fff",
	chanL:"#3AFF36",
chanR:"#36FFD2",
hueRotate: "0deg",
	saturation: "1.0",
	contrast: "1.0"
	},
"Mythiccave": {
		boxcolor: "#1E1E2E",
		buttons: "#2A2A3C",
		textcolor: "#E6E6FA",
		channelTextColor:"#E6E6FA",
		pianoRollAndInputsBg: "#141420",
		tracksTextAndPianoWhite: "#F5F5F5",
		blackPianoAndTrackbg: "#0F0F18",
		tracksBg: "#181825",
		inputAndDoneRename: "#0B0B12",
		channelsColor: "#1f1f3f",
		editorBg: "#0A0A10",
		patternBg: "#8338EC",
		highlight: "rgba(0.9,0.9,0.9,0.05)",
	done: "#080",
	playbtnColor:"#fff",
	chanL:"#FF36C2",
chanR:"#9F36FF",
hueRotate: "0deg",
	saturation: "1.0",
	contrast: "1.0"
	},
"Lemon": {
	boxcolor: "#2a1f00",
	buttons: "#3a2a00",
	textcolor: "#fff6b0",
	channelTextColor:"#fff6b0",
	pianoRollAndInputsBg: "#1a1300",
	tracksTextAndPianoWhite: "#ffe066",
	blackPianoAndTrackbg: "#140f00",
	tracksBg: "#2d2100",
	inputAndDoneRename: "#120d00",
	channelsColor: "#4a3400",
	editorBg: "#0f0b00",
	patternBg: "#ffb300",
	highlight: "rgba(0.9,0.9,0.9,0.05)",
	done:"#080",
	playbtnColor:"#fff",
	chanL:"#E5FF36",
chanR:"#FFA936",
hueRotate: "0deg",
	saturation: "1.0",
	contrast: "1.0"
},
"Xeur-morph": {
		boxcolor: "#1a1f2b",
		buttons: "#222838",
		textcolor: "#7df9ff",
		channelTextColor:"#7df9ff",
		pianoRollAndInputsBg: "#111522",
		tracksTextAndPianoWhite: "#cfd8ff",
		blackPianoAndTrackbg: "#0b0f1a",
		tracksBg: "#151a26",
		inputAndDoneRename: "#0a0d16",
		channelsColor: "#1e2a44",
		editorBg: "#070a12",
		patternBg: "#00bcd4",
		highlight: "rgba(0.9,0.9,0.9,0.05)",
	done: "#080",
	playbtnColor:"#fff",
	chanL:"#3653FF",
chanR:"#36FFDE",
hueRotate: "0deg",
	saturation: "1.0",
	contrast: "1.0"
	},
"MonoKai": {
		boxcolor: "#272822",
		buttons: "#2d2e27",
		textcolor: "#f8f8f2",
		channelTextColor:"#f8f8f2",
		pianoRollAndInputsBg: "#1e1f1c",
		tracksTextAndPianoWhite: "#a6e22e",
		blackPianoAndTrackbg: "#141510",
		tracksBg: "#20211c",
		inputAndDoneRename: "#11120f",
		channelsColor: "#383a33",
		editorBg: "#12130f",
		patternBg: "#fd971f",
		highlight: "rgba(0.9,0.9,0.9,0.05)",
	done: "#080",
	playbtnColor:"#fff",
	chanL:"#3AB55F",
chanR:"#7AB265",
hueRotate: "0deg",
	saturation: "1.0",
	contrast: "1.0"
	},
"Mirage": {
		boxcolor: "#1f2335",
		buttons: "#24283b",
		textcolor: "#c0caf5",
		channelTextColor:"#c0caf5",
		pianoRollAndInputsBg: "#16161e",
		tracksTextAndPianoWhite: "#a9b1d6",
		blackPianoAndTrackbg: "#0f0f14",
		tracksBg: "#1a1b26",
		inputAndDoneRename: "#0d0d12",
		channelsColor: "#2e3c64",
		editorBg: "#0b0c10",
		patternBg: "#7aa2f7",
		highlight: "rgba(0.9,0.9,0.9,0.05)",
	done: "#080",
	playbtnColor:"#fff",
	chanL:"#36F7FF",
chanR:"#FFDB36",
hueRotate: "0deg",
	saturation: "1.0",
	contrast: "1.0"
	},
"Github Dark": {
		boxcolor: "#101012",
		buttons: "#21262d",
		textcolor: "#c9d1d9",
		channelTextColor:"#c9d1d9",
		pianoRollAndInputsBg: "#21262d",
		tracksTextAndPianoWhite: "#8b949e",
		blackPianoAndTrackbg: "#010409",
		tracksBg: "#161b22",
		inputAndDoneRename: "#0d1117",
		channelsColor: "#30363d",
		editorBg: "#010409",
		patternBg: "#0d2117",
		highlight: "rgba(0.9,0.9,0.9,0.05)",
	done: "#080",
	playbtnColor:"#fff",
	chanL:"#36F7FF",
chanR:"#FFDB36",
hueRotate: "0deg",
	saturation: "1.0",
	contrast: "1.0"
	},
"SunsetDrive": {
	boxcolor: "#2b1d2e",
	buttons: "#3a253f",
	textcolor: "#ffd6ff",
	channelTextColor:"#ffd6ff",
	pianoRollAndInputsBg: "#1a0f1f",
	tracksTextAndPianoWhite: "#ff9ae6",
	blackPianoAndTrackbg: "#120814",
	tracksBg: "#25152a",
	inputAndDoneRename: "#100712",
	channelsColor: "#4b2a52",
	editorBg: "#0c050f",
	patternBg: "#ff4d9d",
	highlight: "rgba(255, 0, 128, 0.08)",
	done: "#00ff99",
	playbtnColor:"#fff",
	chanL:"#FF36AC",
chanR:"#FF3636",
hueRotate: "0deg",
	saturation: "1.0",
	contrast: "1.0"
},
"Deep Ocean": {
	boxcolor: "#0f1b2b",
	buttons: "#16263a",
	textcolor: "#d6ecff",
	channelTextColor:"#d6ecff",
	pianoRollAndInputsBg: "#0a1420",
	tracksTextAndPianoWhite: "#7fbfff",
	blackPianoAndTrackbg: "#08101a",
	tracksBg: "#122033",
	inputAndDoneRename: "#060d16",
	channelsColor: "#1c3550",
	editorBg: "#050b14",
	patternBg: "#0096c7",
	highlight: "rgba(0,150,200,0.08)",
	done: "#00e676",
	playbtnColor:"#fff",
	chanL:"#0E59FF",
chanR:"#2E189A",
hueRotate: "0deg",
	saturation: "1.0",
	contrast: "1.0"
},
"Frost Light": {
	boxcolor: "#e8f0f8",
	buttons: "#dce7f2",
	textcolor: "#1c2a38",
	channelTextColor:"#fff",
	pianoRollAndInputsBg: "#ffffff",
	tracksTextAndPianoWhite: "#2e4057",
	blackPianoAndTrackbg: "#cfd9e6",
	tracksBg: "#b8c7d9",
	inputAndDoneRename: "#ffffff",
	channelsColor: "#d0dceb",
	editorBg: "#f4f8fc",
	patternBg: "#4da3ff",
	highlight: "rgba(0,0,0,0.05)",
	done: "#2ecc71",
	playbtnColor:"#fff",
	chanL:"#A6FBFF",
chanR:"#36FFFB",
hueRotate: "0deg",
	saturation: "1.0",
	contrast: "1.0"
},
"Toxicy": {
	boxcolor: "#141414",
	buttons: "#1f1f1f",
	textcolor: "#39ff14",
	channelTextColor:"#39ff14",
	pianoRollAndInputsBg: "#0c0c0c",
	tracksTextAndPianoWhite: "#b3ff00",
	blackPianoAndTrackbg: "#050505",
	tracksBg: "#121212",
	inputAndDoneRename: "#080808",
	channelsColor: "#1a1a1a",
	editorBg: "#000000",
	patternBg: "#ff00aa",
	highlight: "rgba(57,255,20,0.08)",
	done: "#00ffcc",
	playbtnColor:"#fff",
	chanL:"#22A248",
chanR:"#00DA6D",
hueRotate: "0deg",
	saturation: "1.0",
	contrast: "1.0"
},
"Doom Theme": {
	boxcolor: "#3b0000",
	buttons: "#550000",
	textcolor: "#fff300",
	channelTextColor:"#fff300",
	pianoRollAndInputsBg: "#1a0000",
	tracksTextAndPianoWhite: "#ff6600",
	blackPianoAndTrackbg: "#0f0000",
	tracksBg: "#2a0000",
	trackFinnalBg:"#1a0000",
	patternStroke: "#a00",
	patternStroke2: "#d00",
	inputAndDoneRename: "#120000",
	channelsColor: "#660000",
	editorBg: "#100000",
	patternBg: "#440000",
	highlight: "rgba(255, 0, 0, 0.15)",
	done: "#ff4500",
	playbtnColor:"#fff",
	chanL:"#FF3636",
chanR:"#FFDB36",
hueRotate: "0deg",
	saturation: "1.0",
	contrast: "1.0"
},
"Forest": {
	boxcolor: "#1b3b2f",
	buttons: "#234d3b",
	textcolor: "#e6f4ea",
	channelTextColor:"#e6f4ea",
	pianoRollAndInputsBg: "#102019",
	tracksTextAndPianoWhite: "#cfe8d4",
	blackPianoAndTrackbg: "#0b1813",
	tracksBg: "#152e24",
	inputAndDoneRename: "#08140f",
	channelsColor: "#2f5a46",
	editorBg: "#07110d",
	patternBg: "#3c7d52",
	highlight: "rgba(0, 128, 64, 0.12)",
	done: "#2ecc71",
	playbtnColor:"#fff",
	chanL:"#359C25",
chanR:"#46B05B",
hueRotate: "0deg",
	saturation: "1.0",
	contrast: "1.0"
},
"Micro Theme": {
	boxcolor: "#38554E",
	buttons: "#2A7E69",
	textcolor: "#93B6AD",
	channelTextColor:"#B6ABA0",
	pianoRollAndInputsBg: "#281F23",
	tracksTextAndPianoWhite: "#edc",
	blackPianoAndTrackbg: "#456",
	tracksBg: "#333333",
	inputAndDoneRename: "#004634",
	channelsColor: "#416752",
	editorBg: "#000000",
	patternBg: "#FF5561",
	highlight: "rgba(47,255,250,0.15)",
	done: "#4A9E69" ,
	playbtnColor:"#93B6AD",
	chanL:"#5CBC8E",
chanR:"#57A8B4",
hueRotate: "0deg",
	saturation: "1.0",
	contrast: "1.0"
},
"Fiolet": {
	boxcolor: "#463454",
	buttons: "#7E589A",
	textcolor: "#C6F8FF",
	channelTextColor: "#DCEAFF",
	pianoRollAndInputsBg: "#1E222F",
	tracksTextAndPianoWhite: "#F2F2F2",
	blackPianoAndTrackbg: "#35243B",
	tracksBg: "#1E222F",
	inputAndDoneRename: "#89688F",
	channelsColor: "#504167",
	editorBg: "#191819",
	patternBg: "#020522",
	highlight: "rgba(255, 47, 208, 0.35)",
	done: "#A32AAE",
	playbtnColor: "#AEACFF",
	chanL: "#DB4A99",
	chanR: "#A4A7EF",
	hueRotate: "0deg",
	saturation: "1.0",
	contrast: "1.0"
},
"Grayish": {
	boxcolor: "#9F9F9F",
	buttons: "#7E7E7E",
	textcolor: "#FFFFFF",
	channelTextColor: "#DDD",
	pianoRollAndInputsBg: "#818B89",
	tracksTextAndPianoWhite: "#F2F2F2",
	blackPianoAndTrackbg: "#272727",
	tracksBg: "#5B5C61",
	inputAndDoneRename: "#434343",
	channelsColor: "#AAAAAA",
	editorBg: "#383838",
	patternBg: "#5D5D5D",
	highlight: "rgba(90, 184, 255, 0.35)",
	done: "#2AAE72",
	playbtnColor: "#fff",
	chanL: "#6CF7FF",
	chanR: "#FFFCA1",
	hueRotate: "60deg",
	saturation: "1.0",
	contrast: "1.0"
},
"Pink Lead": {
	boxcolor: "#0b0f19",
	buttons: "#111827",
	textcolor: "#00ffe0",
	channelTextColor: "#00ffe0",
	pianoRollAndInputsBg: "#060912",
	tracksTextAndPianoWhite: "#00ffe0",
	blackPianoAndTrackbg: "#04070c",
	tracksBg: "#0f1724",
	inputAndDoneRename: "#05080f",
	channelsColor: "#121c2d",
	editorBg: "#02040a",
	patternBg: "#ff00ff30",
	highlight: "rgba(0, 255, 255, 0.12)",
	done: "#00ff99",
	playbtnColor: "#fff",
	chanL: "#00ffd5",
	chanR: "#00b7ff",
	hueRotate: "90deg",
	saturation: "1.6",
	contrast: "1.05"
},
"Light Gray": {
	boxcolor: "#9e9e9e",
	buttons: "#b0b0b0",
	textcolor: "#1f1f1f",
	channelTextColor: "#d0d0d0",
	pianoRollAndInputsBg: "#c2c2c2",
	tracksTextAndPianoWhite: "#2a2a2a",
	tracksText: "#3c3c3c",
	blackPianoAndTrackbg: "#7f7f7f",
	tracksBg: "#777",
	inputAndDoneRename: "#bcbcbc",
	channelsColor: "#aaaaaa",
	editorBg: "#b0b0b0",
	patternBg: "#7a7a7a",
	highlight: "rgba(0,0,0,0.1)",
	done: "#2e8b57",
	playbtnColor: "#1f1f1f",
	chanL: "#4a4a4a",
	chanR: "#6b6b6b",
	hueRotate: "0deg",
	saturation: "1.0",
	contrast: "0.97"
},
"Ultra Grey": {
	boxcolor: "#2b2c31",
	buttons: "#3e404a",
	textcolor: "#ffffff",
	channelTextColor: "#ffffff",
	pianoRollAndInputsBg: "#1c1d22",
	tracksTextAndPianoWhite: "#d4d4d5",
	blackPianoAndTrackbg: "#111111",
	tracksBg: "#222222",
	inputAndDoneRename: "#2d2d2d",
	channelsColor: "#444444",
	editorBg: "#191919",
	patternBg: "#3A3A3A",
	done: "#00aa00",
	playbtnColor: "#ddd",
	patternStroke:"#666",
	patternStroke2:"#6a6",
	chanL: "#ffd500",
	chanR: "#36F7FF",
	highlight: "rgba(0,0,0,0.08)",
	hueRotate: "17deg",
	saturation: "0.5",
	contrast: "0.95"
} ,
	"Nordic Ice": {
		boxcolor: "#2e3440",
		buttons: "#434c5e",
		textcolor: "#eceff4",
		channelTextColor: "#88c0d0",
		pianoRollAndInputsBg: "#242933",
		tracksTextAndPianoWhite: "#d8dee9",
		blackPianoAndTrackbg: "#1a1e25",
		tracksBg: "#3b4252",
		inputAndDoneRename: "#242933",
		channelsColor: "#4c566a",
		editorBg: "#1e222a",
		patternBg: "#81a1c1",
		patternAlpha:0.2,
		highlight: "rgba(136, 192, 208, 0.1)",
		done: "#a3be8c",
		playbtnColor: "#fff",
		chanL: "#88c0d0",
		chanR: "#8fbcbb",
		hueRotate: "0deg",
		saturation: "0.9",
		contrast: "1.0"
	},
	"Vaporwave": {
		boxcolor: "#2d1b4d",
		buttons: "#ff71ce",
		textcolor: "#01cdfe",
		channelTextColor: "#fffb96",
		pianoRollAndInputsBg: "#1a0d2e",
		tracksTextAndPianoWhite: "#b967ff",
		blackPianoAndTrackbg: "#120621",
		tracksBg: "#24143c",
		inputAndDoneRename: "#05eda4",
		channelsColor: "#3f2b63",
		editorBg: "#0b0416",
		patternBg: "#ff71ce",
		highlight: "rgba(255, 113, 206, 0.2)",
		done: "#05eda4",
		playbtnColor: "#fff",
		chanL: "#ff71ce",
		chanR: "#01cdfe",
		hueRotate: "0deg",
		saturation: "1.5",
		contrast: "1.0"
	},
	"Coffee Bean": {
		boxcolor: "#3c2f2f",
		buttons: "#4b3832",
		textcolor: "#be9b7b",
		channelTextColor: "#fff4e6",
		pianoRollAndInputsBg: "#251e1e",
		tracksTextAndPianoWhite: "#be9b7b",
		blackPianoAndTrackbg: "#1b1414",
		tracksBg: "#2d2424",
		inputAndDoneRename: "#1b1414",
		channelsColor: "#4b3832",
		editorBg: "#120d0d",
		patternBg: "#854442",
		highlight: "rgba(190, 155, 123, 0.1)",
		done: "#6b8e23",
		playbtnColor: "#be9b7b",
		chanL: "#be9b7b",
		chanR: "#854442",
		hueRotate: "0deg",
		saturation: "0.8",
		contrast: "1.0"
	},
	"Bloodline": {
		boxcolor: "#1a0505",
		buttons: "#330000",
		textcolor: "#ff3333",
		channelTextColor: "#ff3333",
		pianoRollAndInputsBg: "#0d0000",
		tracksTextAndPianoWhite: "#880000",
		blackPianoAndTrackbg: "#050000",
		tracksBg: "#140000",
		inputAndDoneRename: "#000000",
		channelsColor: "#260000",
		editorBg: "#000000",
		patternBg: "#ff0000",
		highlight: "rgba(255, 0, 0, 0.15)",
		done: "#990000",
		playbtnColor: "#000",
		chanL: "#ff0000",
		chanR: "#660000",
		hueRotate: "0deg",
		saturation: "1.6",
		contrast: "1.2"
	},
	"Solarized": {
		boxcolor: "#073642",
		buttons: "#586e75",
		textcolor: "#93a1a1",
		channelTextColor: "#268bd2",
		pianoRollAndInputsBg: "#002b36",
		tracksTextAndPianoWhite: "#839496",
		blackPianoAndTrackbg: "#001e26",
		tracksBg: "#073642",
		inputAndDoneRename: "#002b36",
		channelsColor: "#073642",
		editorBg: "#001e26",
		patternBg: "#b58900",
		highlight: "rgba(147, 161, 161, 0.05)",
		done: "#859900",
		playbtnColor: "#eee8d5",
		chanL: "#2aa198",
		chanR: "#268bd2",
		hueRotate: "0deg",
		saturation: "1.0",
		contrast: "1.0"
	},
	"Dracula": {
	boxcolor: "#282a36",
	buttons: "#44475a",
	textcolor: "#f8f8f2",
	channelTextColor: "#f8f8f2",
	pianoRollAndInputsBg: "#1e1f29",
	tracksTextAndPianoWhite: "#bd93f9",
	blackPianoAndTrackbg: "#191a21",
	tracksBg: "#21222c",
	inputAndDoneRename: "#16171d",
	channelsColor: "#303241",
	editorBg: "#13141a",
	patternBg: "#ff79c6",
	highlight: "rgba(255,121,198,0.12)",
	done: "#50fa7b",
	playbtnColor: "#fff",
	chanL: "#8be9fd",
	chanR: "#ffb86c",
	hueRotate: "0deg",
	saturation: "1.2",
	contrast: "1.05"
},
"Shadow Night": {
	boxcolor: "#1a1b26",
	buttons: "#24283b",
	textcolor: "#c0caf5",
	channelTextColor: "#7aa2f7",
	pianoRollAndInputsBg: "#16161e",
	tracksTextAndPianoWhite: "#a9b1d6",
	blackPianoAndTrackbg: "#0f0f14",
	tracksBg: "#1f2335",
	inputAndDoneRename: "#14141b",
	channelsColor: "#2e3c64",
	editorBg: "#0b0c10",
	patternBg: "#bb9af7",
	highlight: "rgba(122,162,247,0.12)",
	done: "#9ece6a",
	playbtnColor: "#fff",
	chanL: "#7dcfff",
	chanR: "#f7768e",
	hueRotate: "0deg",
	saturation: "1.1",
	contrast: "1.0",
	patternStroke: "#6a6",
	patternStroke2: "#7dcfff",
},
"Arctic Blue": {
	boxcolor: "#0f172a",
	buttons: "#1e293b",
	textcolor: "#e2e8f0",
	channelTextColor: "#e2e8f0",
	pianoRollAndInputsBg: "#0b1220",
	tracksTextAndPianoWhite: "#93c5fd",
	blackPianoAndTrackbg: "#070d18",
	tracksBg: "#162033",
	inputAndDoneRename: "#0a0f1a",
	channelsColor: "#23324d",
	editorBg: "#050914",
	patternBg: "#3b82f6",
	highlight: "rgba(59,130,246,0.15)",
	done: "#22c55e",
	playbtnColor: "#fff",
	chanL: "#60a5fa",
	chanR: "#38bdf8",
	hueRotate: "0deg",
	saturation: "1.0",
	contrast: "1.05",
	patternStroke: "#fff",
	patternStroke2: "#7dcfff",
},
"Retro Terminal": {
	boxcolor: "#001100",
	buttons: "#002200",
	textcolor: "#33ff33",
	channelTextColor: "#33ff33",
	pianoRollAndInputsBg: "#000a00",
	tracksTextAndPianoWhite: "#66ff66",
	blackPianoAndTrackbg: "#000600",
	tracksBg: "#001a00",
	inputAndDoneRename: "#000f00",
	channelsColor: "#003300",
	editorBg: "#000800",
	patternBg: "#00ff66",
	highlight: "rgba(51,255,51,0.12)",
	done: "#00ff00",
	playbtnColor: "#000",
	chanL: "#00ff99",
	chanR: "#99ff00",
	hueRotate: "0deg",
	saturation: "1.3",
	contrast: "1.1",
	patternStroke: "#0f0",
	patternStroke2: "#0f0",
},
"Lemmbox?": {
	boxcolor: "#020009",
	buttons: "#191721",
	textcolor: "white",
	channelTextColor: "#fff570",
	pianoRollAndInputsBg: "#44444A",
	tracksTextAndPianoWhite: "#fff",
	blackPianoAndTrackbg: "#131200",
	tracksBg: "#191721",
	inputAndDoneRename: "#403b4f",
	channelsColor: "#585858",
	editorBg: "#020009",
	patternBg: "#444",
	patternAlpha: 0.08,
	highlight: "rgba(255,255,0,0.15)",
	done: "#fff570",
	playbtnColor: "#000",
	chanL: "#c2a855",
	chanR: "#fff570",
	hueRotate: "0deg",
	saturation: "1",
	contrast: "1",
	brightness: 1,
	patternStroke: "#555555",
	patternStroke2: "#777777",
	PatternColorAlgorithm: [
		[30, 360, 0],
		[0.3, 0.9, 0.01],
		[0.1, 1.9, 0.01]
	]
},
"Neon Pink": {
	boxcolor: "#14001f",
	buttons: "#1f0033",
	textcolor: "#ffd6ff",
	channelTextColor: "#ffd6ff",
	pianoRollAndInputsBg: "#0c0014",
	tracksTextAndPianoWhite: "#ff9ae6",
	blackPianoAndTrackbg: "#08000f",
	tracksBg: "#1a0029",
	inputAndDoneRename: "#0a0012",
	channelsColor: "#2a0040",
	editorBg: "#05000a",
	patternBg: "#ff9ae6",
	patternAlpha:0.1,
	highlight: "rgba(255,46,136,0.18)",
	done: "#00ffcc",
	playbtnColor: "#000",
	chanL: "#ff00aa",
	chanR: "#00f0ff",
	hueRotate: "10deg",
	saturation: "1.9",
	contrast: "1.1",
	patternStroke: "#611C8F",
	patternStroke2: "#7dcfff",
	PatternColorAlgorithm: [
	[180, 190, 5],
	[0.3, 0.6, 0.05],
	[0.4, 0.8, 0.1]
],
},
"Scratch 3.0": {
	boxcolor: "#4D97FF",
	buttons: "#855CD6",
	textcolor: "#FFFFFF",
	channelTextColor: "#FFFFFF",
	pianoRollAndInputsBg: "#855CD6",
	pianoRollBg:"#aaa",
	tracksTextAndPianoWhite: "#ddd",
	blackPianoAndTrackbg: "#2C3E50",
	tracksBg: "#5B9FFF",
	inputAndDoneRename: "#4D97FF",
	channelsColor: "#3C7DD9",
	editorBg: "#1F2937",
	patternBg: "#855CD6",
	highlight: "rgba(255,255,255,0.1)",
	done: "#2ECC71",
	playbtnColor: "#FFFFFF",
	chanL: "#0ff",
	chanR: "#fff",
	hueRotate: "0deg",
	saturation: "1.0",
	contrast: "1.0"
},
"Game Boy": {
	boxcolor: "#0f380f",
	buttons: "#306230",
	textcolor: "#000",
	channelTextColor: "#8bac0f",
	pianoRollAndInputsBg: "#9bbc0f",
	tracksTextAndPianoWhite: "#0f380f",
	blackPianoAndTrackbg: "#306230",
	tracksBg: "#8bac0f",
	inputAndDoneRename: "#0f380f",
	channelsColor: "#306230",
	editorBg: "#0f380f",
	patternBg: "#9bbc0f",
	highlight: "rgba(255,255,255,0.08)",
	done: "#306230",
	playbtnColor: "#0f380f",
	chanL: "#306230",
	chanR: "#8bac0f",
	hueRotate: "0deg",
	saturation: "1.0",
	contrast: "1.0",
	PatternColorAlgorithm: [
	[140, 140, 5], 	[0.3, 0.6, 0.05],	[0.4, 0.8, 0.1]  ],
},
"Retro Slate": {
	boxcolor: "#2c3e50",
	buttons: "#34495e",
	textcolor: "#ecf0f1",
	channelTextColor: "#3498db",
	pianoRollAndInputsBg: "#1a252f",
	tracksTextAndPianoWhite: "#bdc3c7",
	blackPianoAndTrackbg: "#141d26",
	tracksBg: "#212f3d",
	inputAndDoneRename: "#2980b9",
	channelsColor: "#2c3e50",
	editorBg: "#10171e",
	patternAlpha:0.1,
	patternBg: "#3498db",
	highlight: "rgba(236, 240, 241, 0.08)",
	done: "#27ae60",
	playbtnColor: "#fff",
	chanL: "#3498db",
	chanR: "#2980b9",
	hueRotate: "0deg",
	saturation: "0.8",
	contrast: "1.0",
	PatternColorAlgorithm: [
		[200, 220, 2],
		[0.4, 0.6, 0.02],
		[0.2, 0.5, 0.05]
	],
},
"Volcanic": {
	boxcolor: "#1a1a1b",
	buttons: "#3b3b3b",
	textcolor: "#ff4d00",
	channelTextColor: "#ff4d00",
	pianoRollAndInputsBg: "#111111",
	tracksTextAndPianoWhite: "#d6d6d6",
	blackPianoAndTrackbg: "#080808",
	tracksBg: "#161616",
	inputAndDoneRename: "#222",
	channelsColor: "#2d2d2d",
	editorBg: "#050505",
	patternBg: "#ff4d00",
	highlight: "rgba(255, 77, 0, 0.15)",
	done: "#ff0000",
	playbtnColor: "#fff",
	chanL: "#ff7b00",
	chanR: "#ff0000",
	hueRotate: "0deg",
	saturation: "1.2",
	contrast: "1.1",
	PatternColorAlgorithm: [
		[0, 30, 1],
		[0.3, 0.6, 0.05],
		[0.7, 1.0, 0.1]
	],
},
"Sandstone": {
	boxcolor: "#D4A373",
	buttons: "#BC6C25",
	textcolor: "#FEFAE0",
	channelTextColor: "#C7CDBF",
	pianoRollAndInputsBg: "#B8BAA2",
	tracksTextAndPianoWhite: "#a28d3e",
	tracksText:"#FEFAE0",
	blackPianoAndTrackbg: "#ccd5ae",
	tracksBg: "#ae6b35",
	inputAndDoneRename: "#bc6c25",
	channelsColor: "#dda15e",
	editorBg: "#fefae0",
	patternBg: "#b7aa7a",
	highlight: "rgba(40, 54, 24, 0.1)",
	done: "#283618",
	playbtnColor: "#fefae0",
	chanL: "#606c38",
	chanR: "#bc6c25",
	hueRotate: "0deg",
	saturation: "0.9",
	contrast: "1.0"
},
"Undefined": {
	boxcolor: "#2b2b2b",
	buttons: "#3a3a3a",
	textcolor: "#d6d6d6",
	channelTextColor: "#d6d6d6",
	pianoRollAndInputsBg: "#242424",
	tracksTextAndPianoWhite: "#c0c0c0",
	blackPianoAndTrackbg: "#1a1a1a",
	tracksBg: "#303030",
	inputAndDoneRename: "#262626",
	channelsColor: "#3d3d3d",
	editorBg: "#181818",
	patternBg: "#4a4a4a",
	patternAlpha: 0.08,
	highlight: "rgba(120,120,120,0.15)",
	done: "#00bfa5",
	playbtnColor: "#000",
	chanL: "#7a7a7a",
	chanR: "#5a5a5a",
	hueRotate: "0deg",
	saturation: "0.5",
	contrast: "1.05",
	patternStroke: "#555555",
	patternStroke2: "#777777",
	brightness:1.5,
	PatternColorAlgorithm: [
	[30, 360, 0],
	[0.3, 0.9, 0.01],
	[0.1, 1.9, 0.01]
],
},
"Lumen": {
boxcolor: "#fdf6e3",
buttons: "#eee8d5",
textcolor: "#657b83",
channelTextColor: "#fff",
pianoRollAndInputsBg: "#f9f2d1",
tracksTextAndPianoWhite: "#ffffff",
blackPianoAndTrackbg: "#eee8d5",
tracksBg: "#fdf6e3",
tracksText: "#657b83",
inputAndDoneRename: "#eee8d5",
channelsColor: "#f2e9c1",
editorBg: "#fdf6e3",
patternBg: "#b58900",
patternAlpha: 0.12,
highlight: "rgba(181, 137, 0, 0.15)",
done: "#859900",
playbtnColor: "#fff",
chanL: "#93a1a1",
chanR: "#839496",
hueRotate: "45deg",
saturation: "0.8",
contrast: "0.95",
patternStroke: "#d3af37",
patternStroke2: "#b58900",
brightness: 1.1,
PatternColorAlgorithm: [
[45, 65, 1],
[0.6, 0.9, 0.05],
[0.4, 0.8, 0.05]
]
},
"Lumen Yellow": {
	boxcolor: "#fdf6e3",
	buttons: "#eee8d5",
	textcolor: "#657b83",
	channelTextColor: "#fff",
	pianoRollAndInputsBg: "#f9f2d1",
	tracksTextAndPianoWhite: "#ffffff",
	blackPianoAndTrackbg: "#eee8d5",
	tracksBg: "#fdf6e3",
	tracksText: "#657b83",
	inputAndDoneRename: "#eee8d5",
	channelsColor: "#f2e9c1",
	editorBg: "#fdf6e3",
	patternBg: "#b58900",
	patternAlpha: 0.12,
	highlight: "rgba(181, 137, 0, 0.15)",
	done: "#859900",
	playbtnColor: "#fff",
	chanL: "#93a1a1",
	chanR: "#839496",
	hueRotate: "360deg",
	saturation: "0.8",
	contrast: "0.95",
	patternStroke: "#d3af37",
	patternStroke2: "#b58900",
	brightness: 1.1,
	PatternColorAlgorithm: [
		[45, 65, 1],
		[0.6, 0.9, 0.05],
		[0.4, 0.8, 0.05]
	]
}

};
window.theme =  buildInThemes.Dark
const lastTheme = SavedLocalData.get('user_theme');
const savedSettings = SavedLocalData.get('user_settings');
if (lastTheme && buildInThemes[lastTheme]) {
	window.theme = buildInThemes[lastTheme]
}
function saveSettings() {
    SavedLocalData.set('user_settings', settings);
}
Object.assign(settings, savedSettings);
c.style.touchAction = "none"
function noteToName(n) {
	const names = ["C", "C#", "D", "D#", "E", "F",
		"F#", "G", "G#", "A", "A#", "B"
	];
	const octave = Math.floor(n / 12) - 1;
	return names[n % 12] + octave;
}
function clamp(value, min, max) {
 return Math.min(Math.max(value, min), max)
}
let W, H, dpr, scrollY = 0,
 activeMenu = null,
 view = "DAW",
 view2 = "";
let dawZoomX = 2;
let dawZoomY = 100;
let dawScrollY = 0;
window.NavH = 45
window.trackW=60
function rgbFromHue(h) {
 const a = h / 60,
 dr=0.8
  x = 0.8 - Math.abs(a % 2 - 0.8)
 let r = 0,
  g = 0,
  b = 0
 if (a < 1) { r = 0.8;
  g = x }
 else if (a < 2) { r = x;
  g = 0.8 }
 else if (a < 3) { g = 0.8;
  b = x }
 else if (a < 4) { g = x;
  b = 0.8 }
 else if (a < 5) { r = x;
  b = 0.8 }
 else { r = 0.8;
  b = x }
 return `rgb(${r*255|0},${g*255|0},${b*255|0})`
}
let isPlaying = false;
let followPlayhead = false;
let playStartTime = 0;
let playStartScroll = 0;
let tracks = [{
    name: 'CH 1',
    muted: false,
    color: rgbFromHue(180),
    patterns: [ ],
    activePatternIdx: 0,
    instrument: "none" ,
    instance:0
}];
const instrumentInstances = {
};
let patterns = {
};
let selectedPattern = 0;
let nextPatternId = 1;
let currentTrack = null;
let renameDialog = { active: false, track: null, text: '', input:false };
let globalOpacityForPatterBg=false
let KEY_W = 50,
 NOTE_H = 20,
 STEP_W = 12,
 KEYS = 96+12 ,
 BARS = 128,
 STEPS_PER_BAR = 16;
const TOTAL_STEPS = BARS * STEPS_PER_BAR,
 black = [1, 3, 6, 8, 10];
let rhythmOptions = ["Free",4, 8, 12, 16, 32],
 rhythmIndex = 1;
let pScrollX = 0,
 pScrollY = 0,
 pDrag = null,
 pMode = null,
 pMoved = false,
 pDownOnNote = false;
const dw = {
 layers: [],
 add: (l, d, h = null) => { if (!dw.layers[l]) dw.layers[l] = [];
  dw.layers[l].push({ draw: d, hit: h }); },
 clear: () => { dw.layers = []; },
 render: () => {
  dw.layers.forEach(l => { if (l) l.forEach(i => i.draw()); }); },
 drawRect: (x, y, w, h, f, s) => { if (f) { ctx.fillStyle = f;
   ctx.fillRect(x, y, w, h) } if (s) { ctx.strokeStyle = s;
   ctx.strokeRect(x, y, w, h) } return { x, y, w, h }; },
 inObj: (o, x, y) => o && x >= o.x && x <= o.x + o.w && y >= o.y && y <= o.y + o.h,
 text: (t, x, y, c = theme.textcolor, a = "left", size = 10) => {
  ctx.fillStyle = c;
  ctx.textAlign = a;
  ctx.font = `${size}px sans-serif`;
  ctx.fillText(t, x, y);
 }
};
dw.img = (src, x, y, w, h) => {
 if (!dw._imgCache) dw._imgCache = {};
 if (!dw._imgCache[src]) {
  const img = new Image();
  img.src = src;
  img.onload = () => draw();
  dw._imgCache[src] = img;
 }
 const img = dw._imgCache[src];
 if (img.complete) ctx.drawImage(img, x, y, w, h);
};
function parseColor(col) {
	if (col[0] === "#") {
		let c = col.substring(1);
		if (c.length === 3) {
			c = c.split("").map(x => x + x).join("");
		}
		const num = parseInt(c, 16);
		return {
			r: (num >> 16) & 255,
			g: (num >> 8) & 255,
			b: num & 255
		};
	}
	const m = col.match(/\d+/g);
	if (m) {
		return { r: +m[0], g: +m[1], b: +m[2] };
	}
	return { r: 0, g: 0, b: 0 };
}
function getContrastTextColor(bgColor) {
	const { r, g, b } = parseColor(bgColor);
	const luminance = 0.299 * r + 0.587 * g + 0.114 * b;
	if (r > 150 && g < 100 && b < 100) {
		return "#fff";
	}
	return luminance > 140 ? "#000" : "#fff";
}
let selectedNotes = new Set();
let isSelecting = false;
let selectRect = null;
let selectStart = null;
function getPatternColorByAlgorithm(color) {
	if (color && typeof color === "object" && color.color) {
		color = color.color;
	}
	if (typeof color !== "string") {
		color = String(color ?? "");
	}
	const alg = theme.PatternColorAlgorithm;
	if (!alg) return color === "default" ? theme.textcolor : color;
	if (color === "default") color = theme.textcolor;
	const { r, g, b } = parseColorToRGB(color);
	let { h, s, l } = rgbToHsl(r, g, b);
	function clampAndStep(value, min, max, step) {
		value = Math.max(min, Math.min(max, value));
		if (step > 0) {
			value = min + Math.round((value - min) / step) * step;
			value = Math.max(min, Math.min(max, value));
		}
		return value;
	}
	if (alg[0]) {
		const [minH, maxH, stepH] = alg[0];
		h = clampAndStep(h, minH, maxH, stepH);
	}
	if (alg[1]) {
		const [minL, maxL, stepL] = alg[1];
		l = clampAndStep(l, minL, maxL, stepL);
	}
	if (alg[2]) {
		const [minS, maxS, stepS] = alg[2];
		s = clampAndStep(s, minS, maxS, stepS);
	}
	const rgb = hslToRgb(h, s, l);
	return `rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`;
}
function parseColorToRGB(color) {
	if (color && typeof color === "object" && color.color) {
		color = color.color;
	}
	if (typeof color !== "string") {
		color = String(color ?? "");
	}
	if (color.startsWith("#")) {
		let hex = color.slice(1);
		if (hex.length === 3) {
			hex = hex.split("").map(x => x + x).join("");
		}
		const num = parseInt(hex, 16);
		return {
			r: (num >> 16) & 255,
			g: (num >> 8) & 255,
			b: num & 255
		};
	}
	if (color.startsWith("rgb")) {
		const match = color.match(/\d+/g);
		if (match) {
			return {
				r: parseInt(match[0]) || 0,
				g: parseInt(match[1]) || 0,
				b: parseInt(match[2]) || 0
			};
		}
	}
	return { r: 0, g: 0, b: 0 };
}
function lighten(color, amount = 0.2) {
	if (color && typeof color === "object" && color.color) {
		color = color.color;
	}
	if (typeof color !== "string") {
		color = String(color ?? "");
	}
	let r = 0, g = 0, b = 0;
	if (color.startsWith("#")) {
		let hex = color.slice(1);
		if (hex.length === 3) {
			hex = hex.split("").map(c => c + c).join("");
		}
		const num = parseInt(hex, 16);
		r = (num >> 16) & 255;
		g = (num >> 8) & 255;
		b = num & 255;
	} else if (color.startsWith("rgb")) {
		const match = color.match(/\d+/g);
		if (match) {
			r = parseInt(match[0]) || 0;
			g = parseInt(match[1]) || 0;
			b = parseInt(match[2]) || 0;
		}
	} else {
		return color;
	}
	r = Math.min(255, Math.round(r + (255 - r) * amount));
	g = Math.min(255, Math.round(g + (255 - g) * amount));
	b = Math.min(255, Math.round(b + (255 - b) * amount));
	return `rgb(${r}, ${g}, ${b})`;
}
function darken(color, amount = 0.2) {
	if (color && typeof color === "object" && color.color) {
		color = color.color;
	}
	if (typeof color !== "string") {
		color = String(color ?? "");
	}
	let r = 0, g = 0, b = 0;
	if (color.startsWith("#")) {
		let hex = color.slice(1);
		if (hex.length === 3) {
			hex = hex.split("").map(c => c + c).join("");
		}
		const num = parseInt(hex, 16);
		r = (num >> 16) & 255;
		g = (num >> 8) & 255;
		b = num & 255;
	} else if (color.startsWith("rgb")) {
		const match = color.match(/\d+/g);
		if (match) {
			r = parseInt(match[0]) || 0;
			g = parseInt(match[1]) || 0;
			b = parseInt(match[2]) || 0;
		}
	} else {
		return color;
	}
	r = Math.max(0, Math.round(r * (1 - amount)));
	g = Math.max(0, Math.round(g * (1 - amount)));
	b = Math.max(0, Math.round(b * (1 - amount)));
	return `rgb(${r}, ${g}, ${b})`;
}
function rgbToHsl(r, g, b) {
    r /= 255; g /= 255; b /= 255;
    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    let h, s;
    const l = (max + min) / 2;
    if (max === min) {
        h = s = 0;
    } else {
        const d = max - min;
        s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
        switch (max) {
        case r: h = (g - b) / d + (g < b ? 6 : 0); break;
        case g: h = (b - r) / d + 2; break;
        case b: h = (r - g) / d + 4; break;
        }
        h *= 60;
    }
    return { h, s, l };
}
function hslToRgb(h, s, l) {
    h = ((h % 360) + 360) % 360;
    s = Math.max(0, Math.min(1, s));
    l = Math.max(0, Math.min(1, l));
    const c = (1 - Math.abs(2 * l - 1)) * s;
    const x = c * (1 - Math.abs((h / 60) % 2 - 1));
    const m = l - c / 2;
    let r1, g1, b1;
    if (h < 60) [r1, g1, b1] = [c, x, 0];
    else if (h < 120) [r1, g1, b1] = [x, c, 0];
    else if (h < 180) [r1, g1, b1] = [0, c, x];
    else if (h < 240) [r1, g1, b1] = [0, x, c];
    else if (h < 300) [r1, g1, b1] = [x, 0, c];
    else [r1, g1, b1] = [c, 0, x];
    return {
        r: Math.round((r1 + m) * 255),
        g: Math.round((g1 + m) * 255),
        b: Math.round((b1 + m) * 255)
    };
}
SongPlugins={}
const pr = {
 rStep: () =>  { if(rhythmOptions[rhythmIndex]=="Free") {return 0.04 }else{return STEPS_PER_BAR / rhythmOptions[rhythmIndex] } },
 quantize: (x) => {
  const s = pr.rStep()
  return Math.floor(x / s) * s
 },
 draw: (targetTrack, x, y, w, h, isMini) => {
 	let color = "black"
 targetTrack.patterns.forEach((pat, index) => {
			const [startX, endX, patternId] = pat;
			const pattern = patterns[patternId];
			if (!pattern) return;
			const stepW = 4 * dawZoomX;
			const px = x + startX * stepW - dawScrollX;
			const pw = endX * stepW;
			if (px + pw < x || px > x + w) return;
		 color = pattern.color == "default" ? getPatternColorByAlgorithm(targetTrack.color) : getPatternColorByAlgorithm(pattern.color);
   });
  ctx.save();
  let N_Offset = 44
  if (!isMini) {
   ctx.fillStyle = theme.pianoRollBg || theme.pianoRollAndInputsBg;
   ctx.fillRect(0, 0, W, H);
   ctx.save()
   let region = new Path2D();
   region.rect(0, y, w, h);
   ctx.clip(region)
   ctx.translate(0, y)
   const vx0 = Math.floor(pScrollX / STEP_W),
    vx1 = vx0 + Math.floor((W - KEY_W) / STEP_W) + 2;
   ctx.lineWidth = 1;
   for (let i = vx0 - (vx0 % 4); i < vx1; i += 4) {
    let px = KEY_W + i * STEP_W - pScrollX;
    ctx.globalAlpha = (i/2 % 16 === 0) ? 0.4 : 0.1;
    ctx.strokeStyle= (i/2 % 16 === 0)? theme.patternStroke2||theme.textcolor: theme.patternStroke||theme.textcolor
    ctx.beginPath();
    ctx.moveTo(px, 0);
    ctx.lineTo(px, H);
    ctx.stroke();
   }
   const vy0 = Math.floor(pScrollY / NOTE_H),
    vy1 = vy0 + Math.floor(H / NOTE_H) + 2;
   for (let j = vy0; j < vy1; j++) {
    let py = j * NOTE_H - pScrollY;
    ctx.globalAlpha = 0.1;
    ctx.strokeStyle = theme.textcolor;
    ctx.beginPath();
    ctx.moveTo(KEY_W, py);
    ctx.lineTo(W, py);
    ctx.stroke();
   }
   ctx.globalAlpha = 1;
   const activePattern = patterns[selectedPattern];
   const NOTE_NAMES = ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"];
function noteToNameFull(noteIndex) {
	const note = NOTE_NAMES[noteIndex % 12];
	const octave = Math.floor(noteIndex / 12) -1;
	return note + octave;
}
if (activePattern) {
 activePattern.notes.forEach(n => {
 	const showVolume = isDraggingForVolume && pDrag && pDrag.n === n;
const nx = KEY_W + n.x * STEP_W - pScrollX,
ny = (KEYS - 1 - n.y) * NOTE_H - pScrollY;
let vel = n.v ?? 1;
let col = color
if (selectedNotes && selectedNotes.has(n.x + ":" + n.y)) {
	col = lighten(color, 0.4);
}
let alpha = Math.max(0.06, n.v ?? 1);
ctx.globalAlpha = alpha;
dw.drawRect(nx, ny, n.w * STEP_W - 1, NOTE_H - 1, col);
if (showVolume) {
	const vol = (n.v ?? 1).toFixed(2);
	ctx.save();
	ctx.globalAlpha = 1;
	ctx.font = "10px sans-serif";
	const tw = ctx.measureText(vol).width;
	const cx = nx + (n.w * STEP_W) / 2;
	ctx.fillStyle = darken(col, 0.6);
	ctx.fillRect(cx - tw / 2 - 3, ny - 14, tw + 6, 12);
	ctx.fillStyle = getContrastTextColor(col);
	ctx.textAlign = "center";
	ctx.fillText(vol, cx, ny - 4);
	ctx.restore();
}
    let textColor = getContrastTextColor(col);
    if(STEP_W>4){
    dw.text(noteToNameFull(n.y), nx, ny + NOTE_H-4, textColor, "left", clamp(NOTE_H+(n.w-10)-1,0,NOTE_H));
    dw.drawRect(nx + n.w * STEP_W - 6, ny, 4, NOTE_H - 1, "rgba(255,255,255,0.4)");
    }
   });
   ctx.globalAlpha=1
}
if (selectRect) {
	ctx.fillStyle = color
	ctx.globalAlpha=0.5
	ctx.translate(0, -y)
	ctx.fillRect(
		selectRect.x1 - pScrollX , selectRect.y1 - pScrollY,
		selectRect.x2 - (selectRect.x1 ),
		selectRect.y2 - (selectRect.y1 )
	);
	ctx.globalAlpha=1
	ctx.translate(0, y)
}
   for (let k = vy0; k < vy1; k++) {
    let py = k * NOTE_H - pScrollY;
    let noteIndex = KEYS - 1 - k;
    dw.drawRect(0, py, KEY_W, NOTE_H+1, theme.tracksTextAndPianoWhite);
    if (black.includes(noteIndex % 12)) {
        dw.drawRect(0, py, KEY_W * 0.7, NOTE_H,  theme.blackPianoAndTrackbg);
    }
    if (noteIndex % 12 === 0 && noteIndex > -1) {
        const name = noteToName(noteIndex);
        dw.text(name, 5, py + NOTE_H - 4, theme.blackPianoAndTrackbg, "left", clamp(NOTE_H-5,0,18));
    }
}
   ctx.restore()
} else if (isMini) {
	ctx.save();
	ctx.fillStyle = theme.trackFinnalBg || theme.blackPianoAndTrackbg;
	ctx.fillRect(x, y, w, h);
	ctx.beginPath();
	ctx.rect(x, y, w, h);
	ctx.clip();
	const range = getNoteRange(targetTrack);
	const span = range.max + 3 - range.min;
	const stepW = 4 * dawZoomX;
	const startStep = Math.floor(dawScrollX / stepW);
	const endStep = startStep + Math.ceil(w / stepW) + 2;
	ctx.globalAlpha = 0.1;
	ctx.lineWidth = 1;
	for (let i = startStep; i <= endStep; i++) {
		const pxLine = x + i * stepW - dawScrollX;
		ctx.strokeStyle = (i % (8 * 4) === 0) ? theme.patternStroke2 || "white" : theme.patternStroke || "white";
		ctx.globalAlpha = (i % (8 * 4) === 0) ? 0.4 : 0.1;
		ctx.beginPath();
		ctx.moveTo(pxLine, y);
		ctx.lineTo(pxLine, y + h);
		ctx.stroke();
	}
	let combinedBg = new Path2D();
	let patternsToDraw = [];
	targetTrack.patterns.forEach((pat) => {
		const [startX, endX, patternId] = pat;
		const pattern = patterns[patternId];
		if (!pattern) return;
		const px = x + startX * stepW - dawScrollX;
		const pw = endX * stepW;
		if (px + pw < x || px > x + w) return;
		combinedBg.rect(px, y, pw, h);
		patternsToDraw.push({ pat, px, pw, pattern });
	});
	if (globalOpacityForPatterBg) {
		ctx.save();
		ctx.globalAlpha = theme.patternAlpha||0.4;
		ctx.fillStyle =theme.patternBg;
		ctx.fill(combinedBg);
		ctx.restore();
	}
	let index=0
	patternsToDraw.forEach(({ pat, px, pw, pattern }) => {
		index++
		let headerH = (dawZoomY > 50) ? (10 + clamp((dawZoomY - 60) / 5, 0, 10)) : 0;
		let color = pattern.color == "default" ? getPatternColorByAlgorithm(targetTrack.color) : getPatternColorByAlgorithm(pattern.color)
		ctx.globalAlpha = 1;
		if (!globalOpacityForPatterBg) {
			ctx.globalAlpha = theme.patternAlpha|| 0.4;
			dw.drawRect(px, y, pw, h, theme.patternBg);
			ctx.globalAlpha = 1;
		}
		if (headerH > 0) {
			dw.drawRect(px, y, pw, headerH, darken(color, 0.4));
			ctx.save();
			let textClip = new Path2D();
			textClip.rect(px, y, pw, headerH);
			ctx.clip(textClip);
			let textX = px < window.trackW ? Math.max(px + 2, window.trackW+2) : px + 2;
			if (textX > (px + pw) - 10) textX = (px + pw) - 10;
			dw.text(pattern.name, textX, y + headerH - 2, theme.channelTextColor, "left", headerH * 0.8);
			ctx.restore();
		}
		const availableH = h - headerH;
		const drawYStart = y + headerH;
		ctx.save();
		let clipPath = new Path2D();
		clipPath.rect(px, drawYStart, pw, availableH);
		ctx.clip(clipPath);
	if (pattern.type === "mod") {
	const pts = (pattern.points || []).slice();
	if (pts.length === 0) return;
	pts.sort((a, b) => a.x - b.x);
	const first = pts[0];
	const last = pts[pts.length - 1];
	const availableH = h - headerH;
const modMargin = Math.min(headerH, availableH);
const modDrawYStart = drawYStart + modMargin;
const modAvailableH = availableH - modMargin;
	const startX = px;
	const startY = modDrawYStart + (1 - first.y) * modAvailableH;
	const endX = px + pw;
	const endY = modDrawYStart + (1 - last.y) * modAvailableH;
	ctx.beginPath();
	ctx.lineWidth = 2;
	ctx.strokeStyle = color;
	ctx.globalAlpha = 1;
	ctx.moveTo(startX, startY);
	pts.forEach(p => {
		const ax = px + p.x * stepW;
		const ay = modDrawYStart + (1 - p.y) * modAvailableH;
		ctx.lineTo(ax, ay);
		if (isDraggingAutomationPoint && dragPoint === p) {
	const pMin = pattern.min ?? 0;
	const pMax = pattern.max ?? 1;
	const displayVal = (pMin + p.y * (pMax - pMin)).toFixed(2);
	ctx.save();
	ctx.font = "10px sans-serif";
	const tw = ctx.measureText(displayVal).width;
	ctx.fillStyle = "rgba(0,0,0,0.7)";
	ctx.fillRect(ax - (tw / 2) - 2, ay - 18, tw + 4, 12);
	ctx.fillStyle = "#fff";
	ctx.textAlign = "center";
	ctx.fillText(displayVal, ax, ay - 9);
	ctx.restore();
}
	});
	ctx.lineTo(endX, endY);
	ctx.stroke();
	ctx.lineTo(endX, modDrawYStart + modAvailableH);
	ctx.lineTo(startX, modDrawYStart + modAvailableH);
	ctx.closePath();
	ctx.globalAlpha = 0.15;
	ctx.fillStyle = color;
	ctx.fill();
	ctx.globalAlpha = 1;
	if (stepW > 6 && !isPlaying) {
		pts.forEach(p => {
			const ax = px + p.x * stepW;
			const ay = modDrawYStart + (1 - p.y) * modAvailableH;
			ctx.beginPath();
			ctx.arc(ax, ay, 4, 0, Math.PI * 2);
			ctx.fillStyle = color;
			ctx.fill();
		});
	}
} else {
			pattern.notes.forEach(n => {
				let alpha = Math.max(0.1, n.v ?? 1);
				ctx.globalAlpha = alpha;
				const py = drawYStart + ((range.max - n.y) / span) * availableH;
				const nx = px + n.x * stepW;
				const nw = n.w * stepW;
				const nh = Math.max(2, availableH / span);
				dw.drawRect(nx, py, nw - clamp(nw / 15, 0, 3), nh, color);
			});
		}
		ctx.restore();
	});
	ctx.globalAlpha = 1;
	ctx.restore();
}
  ctx.restore();
 }
};
let lastNoteLength = 4
function getNoteRange(track) {
    let min = Infinity,
        max = -Infinity;
    let hasNotes = false;
    track.patterns.forEach(pat => {
        const pattern = patterns[pat[2]];
        if (pattern && pattern?.notes && pattern.notes.length > 0) {
        hasNotes = true;
        pattern.notes.forEach(n => {
        if (n.y < min) min = n.y;
        if (n.y > max) max = n.y;
        });
        }
    });
    if (!hasNotes) return { min: 48, max: 60 };
    let octaveMin = Math.floor(min / 12) * 12;
    let octaveMax = Math.ceil((max + 1) / 12) * 12;
    if (octaveMax - octaveMin < 12) {
        octaveMax = octaveMin + 12;
    }
    return { min: octaveMin, max: octaveMax };
}
let instrumentUI = null;

class PluginManager {
    constructor(registry, storage) {
        this.registry = registry;
        this.storage = storage;
        this.suffix="_inst_"
    }
     initAll() {
	Object.keys(this.registry).forEach(name => {
		const item = this.registry[name];
		if (!item) return;
 
		const state = this.getState(name, 0);
		 
		const proxy = this.createProxy(state, false, null);
		try {
			const runInterface = new Function('int', 'globalRoot', item.interface);
			runInterface(proxy, { add: () => {}, children: [] });
		} catch (e) {
			console.error(`Error initAll ${name}:`, e);
		}
		if (proxy.automations) {
			state.automations = proxy.automations;
		}
	});
}
    getState(name, id) {
    const key = `${name}${this.suffix}${id}`;
    if (!this.storage[key]) {
        this.storage[key] = { _values: {}, saved: {} };
    }
    if (!this.storage[key]._values) this.storage[key]._values = {};
    if (!this.storage[key].saved) this.storage[key].saved = {};
    return this.storage[key];
    }
    createProxy(state, isUI, container) {
        return new Proxy(state, {
            set(target, prop, value) {
                if (prop === 'saved') {
                    target.saved = { ...(target.saved || {}), ...value };
                    return true;
                }
                const isControl = value && typeof value === 'object' && 
                                 (value.constructor.name === 'Knob' || value.constructor.name === 'Slider' || value.constructor.name === 'Textarea' );
                if (isControl) {
                    target[prop] = value;
                    if (target._values[prop] !== undefined) {
                        const savedVal = target._values[prop];
                        if (isUI) {
                            setTimeout(() => {
                            if (value.constructor.name === 'Textarea') {	value._value = savedVal._value; } else {value.val = savedVal;}
                                if (value.draw) value.draw();
                            }, 0);
                        } else {
                            if (value.constructor.name === 'Textarea') {	value._value = savedVal._value; } else {	value.val = savedVal;}
                        }
                    } else {
                        target._values[prop] = value.val;
                    }
                    const originalOnInput = value.onInput;
                    value.onInput = (v) => {
                        target._values[prop] = v;
                        if (originalOnInput) originalOnInput(v);
                    };
                } else {
                    target[prop] = value;
                    if (prop !== '_values') target._values[prop] = value;
                }
                return true;
            },
         get(target, prop) {
									if (prop === 'saved') return target.saved || (target.saved = {});
         	if (prop === 'automations') return target.automations || (target.automations = {});
          	return (prop in target) ? target[prop] : target._values[prop];
         }
        });
    }
  init(name, patternId, container = null, manualIdx = null, suffix) {
    this.suffix = suffix ? suffix : "_inst_";
    const pat = patterns ? patterns[patternId] : null;
    const instIdx = (manualIdx !== null) ? manualIdx : (pat?.instance || 0);
    const item = this.registry[name];
    if (!item) return;
    
    const state = this.getState(name, instIdx);
     
    const isUI = !!container;
    const proxy = this.createProxy(state, isUI, container);
        const root = container || {
        add: () => {},
        children: [],
        style: {},
        remove: () => {}
    };
    if (container) container.children = [];
    try {
        const runInterface = new Function('int', 'globalRoot', item.interface);
        runInterface(proxy, root);
    } catch (e) {
        console.warn(`Plugin UI Init Skip [${name}]:`, e.message);
    }
    return proxy;
}
    copyState(proxy) {
	const dataToCopy = {};
	const values = proxy._values || {};
	Object.keys(values).forEach(key => {
		const val = values[key];
		if (typeof val !== 'object' || val === null) {
			dataToCopy[key] = val;
		}
	});
	if (proxy.saved) {
		dataToCopy._saved = JSON.parse(JSON.stringify(proxy.saved));
	}
	return dataToCopy;
}
pasteState(targetProxy, sourceData, container = null) {
    if (!sourceData) return;
    Object.keys(sourceData).forEach(key => {
        if (key === '_saved') {
        targetProxy.saved = { ...sourceData._saved };
        return;
        }
        if (targetProxy._values && targetProxy._values.hasOwnProperty(key)) {
        targetProxy[key] = sourceData[key];
        if (container && container.children) {
        const component = container.children.find(c => c.prop === key || c.label === key);
        if (component) {
        if (component.type === 'knob' || component.type === 'slider') {
        component.val = sourceData[key];
        } else if (component.type === 'inputfile' && key === 'fileName') {
        component.value = sourceData[key];
        }
        }
        }
        }
    });
    if (container && sourceData._saved && sourceData._saved.b64data) {
        const fileInput = container.children.find(c => c.type === 'inputfile');
        if (fileInput) {
        fileInput.value = sourceData._saved.fileName || "Restored File";
        }
    }
}
}

let pluginClipboard = null;
const InstrumentManager = new PluginManager(Instruments, instrumentStates);
function initializeInstrumentState(name, patternId) {
    InstrumentManager.init(name, patternId);
}
let currentOpenedProxy = null;
let openedEffect=false
let lastData=[]
function openInstrumentUI(name, patternId) {
    const pat = patterns[patternId];
    if (pat) {
        if (pat.instrument !== name) {
        const instIdx = pat.instance || 0;
        const suffix = "_inst_";
        const cacheKey = `${pat.instrument}${suffix}${instIdx}${patternId}`;
        proxyCache.delete(cacheKey);
        const stateKey = `${pat.instrument}${suffix}${instIdx}`;
        if (instrumentStates[stateKey]) {
        delete instrumentStates[stateKey];
        }
        pat.instrument = name;
        }
    }
    lastData = [name, patternId];
    currentOpenedProxy = InstrumentManager.init(name, patternId, instrumentInside);
    instrumentBox.style.opacity = 1;
    instrumentNav.value = "Instrument - " + name;
      
    const version =   Instruments[name].version || "N/A";
instrumentVersion.value = "VERSION: " + version;
    openedEffect = false;
}
function openEffectUI(name, patternId, instanceIdx) {
	lastData=[name, patternId, instanceIdx]
    currentOpenedProxy = FXManager.init(name, patternId, instrumentInside, instanceIdx, "_fx_");
    instrumentBox.style.opacity = 1;
    instrumentNav.value = "Effect - " + name;
    const version =  Effects[name].version || "N/A";
    instrumentVersion.value = "VERSION: " + version;
    openedEffect=true
}
const FXManager = new PluginManager(Effects, effectStates);
function initializeEffectState(name, patternId, instanceIdx) {
	FXManager.init(name, patternId, null, instanceIdx, "_fx_");
}
let menuCopy=null
function renderAutomationMenu(track, localX, activeMenuX, originalId = null) {
    activeMenu = null;
    menuBox.style.opacity = 0;
    instrumentPickBoxBg.style.opacity = 0.5;
    instrumentPickBox.scroll.y = 0;
    instrumentPickBox.children = [];
    const types = ["Instrument", "Effect","Song Tempo"];
    types.forEach(type => {
        const row = new Node({
            value: type.toUpperCase(),
            style: { w: "100%", h: "40px", bg: theme.tracksBg, textleft: 10, color: "window(theme.textcolor)" }
        });
        row.onClick = () => {
   if (type === "Song Tempo") {
    instrumentBox.style.opacity = 1;
    instrumentNav.value = "Automation: Song Tempo";
    instrumentInside.children = [];
    const container = new Node({ style: { w:"100vw",h:"100vh", pos:"abs",t:0,l:0, bg:"window(theme.editorBg)" } });
    container.add(new Node({ value: "BPM MIN:", style: { color: "window(theme.textcolor)", h: "30px" } }));
    const minInput = new Textarea({ value: "120", style: { w: "100%", h: "40px", bg: "#222", color: "window(theme.textcolor)", bg:"window(theme.boxcolor)" } });
    container.add(minInput);
    container.add(new Node({ value: "BPM MAX:", style: { color: "window(theme.textcolor)", h: "30px", t: "10px" } }));
    const maxInput = new Textarea({ value: "160", style: { t:"15", w: "100%", h: "40px", bg: "#222", color: "window(theme.textcolor)", bg:"window(theme.boxcolor)" } });
    container.add(maxInput);
    const applyBtn = new Node({
        value: "CREATE SONG TEMPO AUTOMATION",
        style: { w: "100%", h: "50px", bg: "window(theme.done)", color: "window(theme.textcolor)", t: "20px", texttop: 15 }
    });
    applyBtn.onClick = () => {
        const bMin = parseFloat(minInput.value) || 120;
        const bMax = parseFloat(maxInput.value) || 160;
        
        const pat = patterns[originalId];
        pat.name = "Tempo: " + bMin + "-" + bMax;
        pat.associated = ["SONG", "BPM"]; 
        pat.min = bMin;
        pat.max = bMax;
        
        instrumentBox.style.opacity = 0;
        instrumentPickBoxBg.style.opacity = 0;
        draw();
    };
    
    container.add(applyBtn);
    instrumentInside.add(container);
    instrumentPickBoxBg.style.opacity = 0; 
}
else if (type === "Instrument") {
                renderInstanceSelection(track, "instrument", localX, originalId);
            } else {
                renderInstanceSelection(track, "effect", localX, originalId);
            }
        };
        instrumentPickBox.add(row);
    });
}

function renderInstanceSelection(track, category, localX, originalId = null) {
    instrumentPickBox.children = [];
    instrumentPickBox.scroll.y = 0;
    const states = category === "instrument" ? instrumentStates : effectStates;
    const suffix = category === "instrument" ? "_inst_" : "_fx_";
    Object.keys(states).forEach(key => {
        const parts = key.split(suffix);
        const name = parts[0];
        const idx = parseInt(parts[1]) + 1;
        const row = new Node({
            value: `${name.toUpperCase()} (Inst ${idx})`,
            style: { w: "100%", h: "40px", bg: theme.tracksBg, textleft: 10, color: "window(theme.textcolor)" }
        });
        row.onClick = () => {
            renderParameterSelection(track, category, key, localX, originalId);
        };
        instrumentPickBox.add(row);
    });
}

function renderParameterSelection(track, category, selectedStateKey, localX, originalId) {
    instrumentPickBox.children = [];
    instrumentPickBox.scroll.y = 0;
    const suffix = category === "instrument" ? "_inst_" : "_fx_";
    const parts = selectedStateKey.split(suffix);
    const pluginName = parts[0];
    const instIdx = parseInt(parts[1]);

    const proxy = getCachedProxy(category, pluginName, instIdx, suffix);
    const source = category === "instrument" ? window.Instruments[pluginName] : window.Effects[pluginName];

    if (!proxy.automations && source && source.interface) {
        try {
            const uiCode = new Function("int", "audioCtx", "globalRoot", "Node", "Knob", "CanvasNode", source.interface);
            uiCode(proxy, audioCtx, null, Node, Knob, null);
        } catch (e) {}
    }

    const automations = proxy.automations || {};
    Object.keys(automations).forEach(paramKey => {
        const config = automations[paramKey];
        const row = new Node({
            value: paramKey.toUpperCase(),
            style: {
                w: "100%",
                h: "40px",
                bg: theme.tracksBg,
                textleft: 10,
                color: "window(theme.textcolor)"
            }
        });
        row.onClick = () => {
            const min = config.min ?? 0;
            const max = config.max ?? 1;
            const step = config.step ?? 0.01;

            if (originalId && patterns[originalId]) {
                const pat = patterns[originalId];
                const oldMin = pat.min ?? 0;
                const oldMax = pat.max ?? 1;

                pat.points = pat.points.map(pt => {
                    const realValue = oldMin + pt.y * (oldMax - oldMin);
                    const normalized = (realValue - min) / (max - min);
                    return {
                        x: pt.x,
                        y: Math.max(0, Math.min(1, normalized))
                    };
                });

                pat.associated = category === "instrument" ? [pluginName, selectedStateKey, paramKey] : [selectedStateKey, paramKey];
                pat.min = min;
                pat.max = max;
                pat.step = step;
                pat.category = category === "instrument" ? "inst" : "fx";
                pat.name = `${paramKey.toUpperCase()} Clip`;
            } else {
                const patId = "pat_" + Date.now();
                patterns[patId] = {
                    type: "mod",
                    category: category === "instrument" ? "inst" : "fx",
                    associated: category === "instrument" ? [pluginName, selectedStateKey, paramKey] : [selectedStateKey, paramKey],
                    points: [{ x: 0, y: 0.5 }, { x: 16, y: 0.5 }],
                    min: min,
                    max: max,
                    step: step,
                    name: paramKey.toUpperCase()
                };
                track.patterns.push([localX, 16, patId]);
            }
            instrumentPickBoxBg.style.opacity = 0;
            draw();
        };
        instrumentPickBox.add(row);
    });
}

let WheelDAWDisabled=0
function draw() {
	window.NavH=45*settings.interfaceScale
	window.trackW=60 * settings.interfaceScale
	const hue = theme.hueRotate || "0deg";
const sat = theme.saturation || "1";
const con = theme.contrast || "1";
const bright = theme.brightness || "1";
c.style.filter = `hue-rotate(${hue}) saturate(${sat}) contrast(${con}) brightness(${bright})`;
 dw.clear();
 if (view2 === "Rename") {
  renameBox.style.opacity=0.5
 }else{
 }
 if (view === "DAW") {
 	bottomNav.style.opacity=1;
 	addBtn.style.opacity=1
  let ty = window.NavH - dawScrollY;
  ctx.fillStyle=theme.boxcolor
  dw.add(0, () => {
   dw.drawRect(0, 0, window.trackW, innerHeight, theme.tracksBg );
  });
    tracks.forEach((t, i) => {
    const cty = ty;
    const trackHeight = dawZoomY;
    const margin = 1;
    const pianoHeight = trackHeight;
    dw.add(1, () => {
        dw.drawRect(0, cty, W, trackHeight, theme.channelsColor);
        dw.drawRect(0, cty, window.trackW, trackHeight, theme.channelsColor);
        ctx.save();
        ctx.beginPath();
        ctx.rect(2, cty + 2, window.trackW - 4, trackHeight - 4);
        ctx.clip();
        drawLetterWrap(t.name, 2, cty + 2, window.trackW - 10, 14, theme.tracksText || theme.tracksTextAndPianoWhite);
        ctx.restore();
        ctx.beginPath();
        ctx.fillStyle = t.muted ? "#666" : "#26a226";
        ctx.arc(window.trackW - 10, cty + trackHeight - 10, 5, 0, Math.PI * 2);
        ctx.fill();
        t._btnPiano = { x: window.trackW, y: cty, w: W - window.trackW, h: pianoHeight };
        dw.drawRect(t._btnPiano.x, t._btnPiano.y, t._btnPiano.w, t._btnPiano.h, theme.trackFinnalBg ||  theme.blackPianoAndTrackbg);
        pr.draw(t, t._btnPiano.x, t._btnPiano.y, t._btnPiano.w, t._btnPiano.h, true);
    }, {
        mute: { x: window.trackW - 20, y: cty + trackHeight - 20, w: 20, h: 20 },
        piano: { x: window.trackW, y: cty, w: W - window.trackW, h: pianoHeight }
    });
    ty += trackHeight + margin;
});
function drawLetterWrap(text, x, y, maxWidth, lineHeight, color = theme.textcolor , maxLines = 3) {
    ctx.save();
    ctx.beginPath();
    ctx.rect(x, y, maxWidth+2, lineHeight * maxLines + 5);
    ctx.clip();
    ctx.fillStyle = color;
    ctx.textBaseline = "top";
    ctx.font = `${14}px sans-serif`;
    let line = "";
    let currentY = y;
    let lineCount = 0;
    for (let i = 0; i < text.length; i++) {
        const testLine = line + text[i];
        const metrics = ctx.measureText(testLine);
        if (metrics.width > maxWidth && line) {
        ctx.fillText(line, x+2, currentY+5);
        line = text[i];
        currentY += lineHeight;
        lineCount++;
        if (lineCount >= maxLines - 1) {
        const remainingText = text.slice(i);
        let clipped = "";
        for (let j = 0; j < remainingText.length; j++) {
        if (ctx.measureText(clipped + remainingText[j] + "...").width > maxWidth) break;
        clipped += remainingText[j];
        }
        ctx.fillText(clipped + "...", x+2, currentY+5);
        break;
        }
        } else {
        line = testLine;
        }
    }
    if (lineCount < maxLines) {
        ctx.fillText(line, x+2, currentY+5);
    }
    ctx.restore();
}
pianoRollNav.style.opacity=0
 } else {
  dw.add(1, () => pr.draw(currentTrack, 0, window.NavH, W, H - window.NavH, false));
  pianoRollNav.style.opacity=1
  bottomNav.style.opacity=0
  addBtn.style.opacity=0
  }
 if (activeMenu) {
 	WheelDAWDisabled=true
 	menuBox.style.opacity=1
 	menuBoxBg.style.opacity=0.5
 	menuBox.children=[]
 	function hexToRgb(hex) {
	hex = hex.replace('#', '');
	if (hex.length === 3) {
		hex = hex.split('').map(x => x + x).join('');
	}
	const num = parseInt(hex, 16);
	return {
		r: (num >> 16) & 255,
		g: (num >> 8) & 255,
		b: num & 255
	};
}
function blendHexWithRgba(hex, rgba) {
	const b = hexToRgb(hex);
	const m = rgba.match(/rgba?\(([^)]+)\)/)[1].split(',');
	const h = {
		r: parseFloat(m[0]),
		g: parseFloat(m[1]),
		b: parseFloat(m[2]),
		a: parseFloat(m[3] ?? 1)
	};
	const r = b.r * (1 - h.a) + h.r * h.a;
	const g = b.g * (1 - h.a) + h.g * h.a;
	const b2 = b.b * (1 - h.a) + h.b * h.a;
	return `rgb(${r|0},${g|0},${b2|0})`;
}
function renderFxMenu(o, i, currentOption, orginalOption) {
    if (activeMenu !== null) { menuCopy = activeMenu; }
    const patId = menuCopy.pattern[2];
    const currentPat = patterns[patId];
    if (!currentPat.fx) currentPat.fx = [];
    activeMenu = null;
    menuBox.style.opacity = 0;
    menuBoxBg.style.opacity = 0;
    instrumentPickBoxBg.style.opacity = 0.5;
    instrumentPickBox.scroll.y=0;
    instrumentPickBox.children = [];
    currentPat.fx.forEach((fxKey, index) => {
        const parts = fxKey.split("_fx_");
        const type = parts[0];
        const instIdx = parts[1];
        const row = new Node({
        value: `${type.toUpperCase()} (${parseInt(instIdx) + 1})`,
        style: { w: "100%", h: "45px", bg: "window(theme.tracksBg)", textleft: 85, texttop: 12, color:"window(theme.textcolor)" }
        });
        const checkBtn = new Node({
        value: "X",
        style: { l: 5, t: 5, w: "35px", h: "35px", bg: "window(theme.channelsColor)", color: "white", textleft: 10, texttop: 5,color:"window(theme.textcolor)" }
        });
        checkBtn.onClick = () => {
        currentPat.fx.splice(index, 1);
        renderFxMenu(o, i, currentOption,orginalOption);
        draw();
        };
        const btnUp = new Node({
        value: "⇧",
        style: {pos:"abs", r: 90, t: 5, w: "30px", h: "35px", bg: "window(theme.channelsColor)", color: "white", textleft: 5, texttop: 5 ,color:"window(theme.textcolor)"}
        });
        btnUp.onClick = () => {
        if (index > 0) {
        [currentPat.fx[index], currentPat.fx[index - 1]] = [currentPat.fx[index - 1], currentPat.fx[index]];
        renderFxMenu(o, i, currentOption,orginalOption);
        }
        };
        const btnDown = new Node({
        value: "⇩",
        style: {pos:"abs", r: 50, t: 5, w: "30px", h: "35px", bg: "window(theme.channelsColor)", color: "white", textleft: 5, texttop: 5,color:"window(theme.textcolor)" }
        });
        btnDown.onClick = () => {
        if (index < currentPat.fx.length - 1) {
        [currentPat.fx[index], currentPat.fx[index + 1]] = [currentPat.fx[index + 1], currentPat.fx[index]];
        renderFxMenu(o, i, currentOption,orginalOption);
        }
        };
        const editBtn = new Node({
        value: "E",
        style: {pos:"abs", r: 5, t: 5, w: "40px", h: "35px", bg: "window(theme.channelsColor)", color: "white", textleft: 5, texttop: 5,color:"window(theme.textcolor)" }
        });
        editBtn.onClick = () => {
        openEffectUI(type, patId, parseInt(instIdx));
        instrumentPickBoxBg.style.opacity = 0;
        instrumentPickBox.children = [];
        draw();
        };
        row.add(checkBtn);
        row.add(btnUp);
        row.add(btnDown);
        row.add(editBtn);
        instrumentPickBox.add(row);
    });
    instrumentPickBox.add(new Node({ value: "AVAILABLE EFFECT", style: { w: "100%", h: "25px", size: 10, textleft: 10, color:"window(theme.textcolor)" } }));
    Object.keys(Effects).filter(k => k !== "none").forEach(effKey => {
        const row = new Node({
        value: effKey.toUpperCase(),
        style: { w: "100%", h: "40px", bg: theme.tracksBg, textleft: 10, texttop: 10, color:"window(theme.textcolor)" }
        });
        row.onClick = () => renderFxInstances(effKey, patId, o, i, currentOption, orginalOption);
        instrumentPickBox.add(row);
    });
    draw();
}
function renderFxInstances(effKey, patId, o, i, currentOption, orginalOption) {
    instrumentPickBox.children = [];
    instrumentPickBox.scroll.y=0;
    const currentPat = patterns[patId];
    const allKeys = Object.keys(effectStates)
        .filter(key => key.startsWith(effKey + "_fx_"))
        .sort((a, b) => parseInt(a.split("_fx_")[1]) - parseInt(b.split("_fx_")[1]));
    if (allKeys.length === 0) {
        const firstKey = effKey + "_fx_0";
        effectStates[firstKey] = { _values: {}, saved: {} };
        allKeys.push(firstKey);
    }
    allKeys.forEach(key => {
        const instIdx = parseInt(key.split("_fx_")[1]);
        const isAlreadyInPattern = currentPat.fx.includes(key);
        const row = new Node({
        value: `${effKey.toUpperCase()} Instance ${instIdx + 1}`,
        style: {
        w: "100%",
        h: "40px",
        bg: isAlreadyInPattern ? "window(theme.button)" : "window(theme.tracksBg)",
        textleft: 10,
        color: "window(theme.textcolor)"
        }
        });
        row.onClick = () => {
        if (!isAlreadyInPattern) currentPat.fx.push(key);
        renderFxMenu(o, i, currentOption, orginalOption);
        };
        const removeBtn = new Node({
        value: "X",
        style: {
        pos: "abs",
        l: "calc(100% - 40px)",
        t: 0,
        w: "40px",
        h: "40px",
        bg: "red",
        color: "white",
        textleft: 15
        }
        });
        removeBtn.onClick = (event) => {
        instrumentPickBox.children = [];
        instrumentPickBox.scroll.y=0;
        const confirmYes = new Node({
        value: `Confirm: Delete ${effKey.toUpperCase()} Instance ${instIdx + 1}`,
        style: { w: "100%", h: "40px", bg: "#a22", color: "white", textleft: 10, texttop: 10 }
        });
        confirmYes.onClick = () => {
        delete effectStates[key];
        Object.values(patterns).forEach(p => {
        if (p.fx && Array.isArray(p.fx)) {
        p.fx = p.fx.filter(fxKey => fxKey !== key);
        }
        });
        renderFxInstances(effKey, patId, o, i, currentOption, orginalOption);
        draw();
        };
        const confirmNo = new Node({
        value: "Cancel",
        style: { w: "100%", h: "40px", bg: "#444", color: "white", textleft: 10, texttop: 10 }
        });
        confirmNo.onClick = () => {
        renderFxInstances(effKey, patId, o, i, currentOption, orginalOption);
        draw();
        };
        instrumentPickBox.add(confirmYes);
        instrumentPickBox.add(confirmNo);
        draw();
        };
        row.add(removeBtn);
        instrumentPickBox.add(row);
    });
    const addInstanceBtn = new Node({
        value: "+ Create New Instance",
        style: { w: "100%", h: "40px", bg: "#2a2", color: "white", textleft: 10 }
    });
    addInstanceBtn.onClick = () => {
    	let maxIdx = -1;
        Object.keys(effectStates).forEach(k => {
        if(k.startsWith(effKey + "_fx_")) {
        const val = parseInt(k.split("_fx_")[1]);
        if (val > maxIdx) maxIdx = val;
        }
        });
        const newKey = `${effKey}_fx_${maxIdx + 1}`;
        effectStates[newKey] = { _values: {}, saved: {} };
        renderFxInstances(effKey, patId, o, i, currentOption, orginalOption);
    };
    instrumentPickBox.add(addInstanceBtn);
    draw();
}
function parsePlugin(text) {
	const nameMatch = text.match(/^#name\s+"([^"]+)"/m);
	const typeMatch = text.match(/^#type\s+"([^"]+)"/m);
	const versionMatch = text.match(/^#version\s+"([^"]+)"/m);
	const modelMatch = text.match(/^#model\s+"([^"]+)"/m);
	
	const sharedMatch = text.match(/^#sharedobjs\s*\[([^\]]*)\]/m);
	
	const interfaceIdx = text.indexOf("#interface:");
	const processIdx = text.indexOf("#process:");
	
	let interfaceCode = "";
	let processCode = "";
	
	if (interfaceIdx !== -1) {
		const start = interfaceIdx + "#interface:".length;
		const end = (processIdx !== -1 && processIdx > interfaceIdx) ? processIdx : text.length;
		interfaceCode = text.substring(start, end).trim();
	}
	
	if (processIdx !== -1) {
		const start = processIdx + "#process:".length;
		processCode = text.substring(start).trim();
	}
	
	let shared = [];
	if (sharedMatch) {
		shared = sharedMatch[1]
			.split(",")
			.map(s => s.trim().replace(/["']/g, ""))
			.filter(Boolean);
	}
	
	return {
		interface: interfaceCode,
		process: processCode,
		sharedobjs: shared,
		meta: {
			name: nameMatch ? nameMatch[1] : "Unknown",
			type: typeMatch ? typeMatch[1] : "instrument",
			model: modelMatch ? modelMatch[1] : "ops1"
		},
		version: versionMatch ? versionMatch[1] : "0.0.0",
	};
}

function renderPlugins() {
	menuBox.children = [];
	const pluginsRow = new Node({
		style: { w: "100%", float: "top" }
	});
	Object.entries(SongPlugins).forEach(([name, plugin]) => {
		const row = new Node({
			style: { w: "100%", h: "40px", float: "left", bg: theme.tracksBg }
		});
		const optsrow = new Node({
 	style: { w: "100%", h: "30px", l: "calc(100% - 200px)", t:-2, bg: theme.tracksBg }
  });
		const label = new Node({
			value: name,
			style: { float: "left", w: "200px", texttop: 10, color: "window(theme.textcolor)" }
		});
		const downloadBtn = new Node({
			value: "Download",
			style: { float: "left", w: "100px", h: "30px" ,bg: "window(theme.buttons)"},
			onClick: () => {
				const binary = Uint8Array.from(atob(plugin.data), c => c.charCodeAt(0));
				const blob = new Blob([binary], { type: "application/octet-stream" });
				const a = document.createElement("a");
				a.href = URL.createObjectURL(blob);
				a.download = name + ".opsnh";
				a.click();
				renderPlugins()
			}
		});
		const deleteBtn = new Node({
    value: "Delete",
    style: { float: "left", w: "100px", h: "30px", bg: "window(theme.buttons)" },
    onClick: () => {
        const pluginToDelete = SongPlugins[name];
        if (!pluginToDelete) return;
        const type = pluginToDelete.parsed.meta.type;
        const isInst = type === "instrument";
        if (isInst) {
        delete window.Instruments[name];
        } else if (type === "fx") {
        delete window.Effects[name];
        }
        const states = isInst ? instrumentStates : effectStates;
        const suffix = isInst ? "_inst_" : "_fx_";
        Object.keys(states).forEach(key => {
        if (key.startsWith(name + suffix)) {
        delete states[key];
        }
        });
        if (typeof proxyCache !== 'undefined') {
        proxyCache.forEach((value, key) => {
        if (key.startsWith(name + suffix)) {
        proxyCache.delete(key);
        }
        });
        }
        delete SongPlugins[name];
        if (currentOpenedProxy && lastData[0] === name) {
        instrumentBox.style.opacity = 0;
        currentOpenedProxy = null;
        }
        renderPlugins();
    }
    });
		row.add(label);
		optsrow.add(downloadBtn);
		optsrow.add(deleteBtn);
		row.add(optsrow)
		pluginsRow.add(row);
	});
	const addRow = new Node({
		style: { w: "100%", h: "40px", float: "left" }
	});
const addBtn = new Node({
	value: "Add Plugin",
	style: { float: "left", w: "100%", h: "40px", bg: "window(theme.buttons)" }
});
addBtn.onClick = () => {
	fileInput.onchange = null;
	fileInput.onchange = (e) => {
		const file = e.target.files[0];
		if (!file) return;
		const reader = new FileReader();
		reader.onload = () => {
			try {
				const arr = reader.result;
				const text = new TextDecoder().decode(arr);
				const match = text.match(/#name\s+"([^"]+)"/);
				const synthName = match ? match[1] : file.name;
				const base64 = btoa(String.fromCharCode(...new Uint8Array(arr)));
				SongPlugins[synthName] = {
   	data: base64,
	   source: text,
   	parsed: parsePlugin(text)
    };
    if (SongPlugins[synthName].parsed.meta.type === "fx") {
        window.Effects[synthName] = {
        interface: SongPlugins[synthName].parsed.interface,
        sharedobject: JSON.parse("["+JSON.stringify(SongPlugins[synthName].parsed.sharedobjs)+"]"),
        process: SongPlugins[synthName].parsed.process,
        version: SongPlugins[synthName].parsed.version,
        model: SongPlugins[synthName].parsed.model,
        };
    }
    if (SongPlugins[synthName].parsed.meta.type === "instrument") {
        window.Instruments[synthName] = {
        interface: SongPlugins[synthName].parsed.interface,
        sharedobject: JSON.parse("["+JSON.stringify(SongPlugins[synthName].parsed.sharedobjs)+"]"),
        synth: SongPlugins[synthName].parsed.process,
        version: SongPlugins[synthName].parsed.version,
       	model: SongPlugins[synthName].parsed.model,
        };
    }
				renderPlugins();
				addBtn.value = "LOADED: " + synthName;
			} catch (e) {
				addBtn.value = "ERROR LOADING FILE: "+e;
			}
		};
		reader.readAsArrayBuffer(file);
	};
	fileInput.value = "";
	fileInput.click();
};
	addRow.add(addBtn);
	menuBox.add(pluginsRow);
	menuBox.add(addRow);
}
function renderInstancesMenu(o,i,currentOption,orginalName){
 	if(activeMenu!==null){	menuCopy = activeMenu}
 		const targetInst = orginalName;
   const patId = menuCopy.pattern[2];
   activeMenu=null
   menuBox.style.opacity = 0;
   menuBoxBg.style.opacity = 0;
   instrumentPickBoxBg.style.opacity = 0.5;
   instrumentPickBox.scroll.y=0;
   instrumentPickBox.children = [];
  const existingKeys = Object.keys(instrumentStates)
	.filter(key => key.startsWith(targetInst + "_inst_"))
	.sort((a, b) =>
		parseInt(a.split("_inst_")[1]) -
		parseInt(b.split("_inst_")[1])
	);
  if (existingKeys.length === 0) {
 	const firstKey = targetInst + "_inst_0";
 	instrumentStates[firstKey] = { _values: {} };
 	existingKeys.push(firstKey);
   }
	existingKeys.forEach((key) => {
			const instanceId = parseInt(key.split("_inst_")[1]);
			let label = `Instance ${parseInt(key.split("_inst_")[1])+1}`;
			let bgcolor  = theme.tracksBg
			const currentPat = patterns[patId];
			if (
				currentPat &&
				currentPat.instrument === targetInst &&
				currentPat.instance === instanceId
			) {
				bgcolor=blendHexWithRgba(theme.tracksBg,"rgba(200,255,200,0.4)")
			}
			const row = new Node({
  value: label,style: { w: "100%",h: "40px",bg: bgcolor,textleft: 10,texttop: 10
		}
	});
	row.onClick = () => {
		patterns[patId].instrument = targetInst;
		patterns[patId].instance = instanceId;
		openInstrumentUI(targetInst, patId);
		instrumentPickBoxBg.style.opacity = 0;
		instrumentPickBox.children = [];
		draw();
	};
	const removeBtn = new Node({
		value: "X",style: {r: "0px",textleft: 15,t: 0,w: "40px",h: "40px",bg: "red",color: "white"
		}
	});
	removeBtn.onClick = () => {
	instrumentPickBox.children = [];
	const instanceId = parseInt(key.split("_inst_")[1]);
	const confirmYes = new Node({
	value: `Yeah im sure to delete Instance ${instanceId + 1}`,
	style: { w: "100%", h: "40px", bg: "#a22", color: "white", textleft: 10, texttop: 10 }
});
confirmYes.onClick = () => {
	instrumentStates[key] = { _values: {} }
	delete instrumentStates[key];
	Object.values(patterns).forEach(p => {
		if (p.instrument === targetInst && p.instance === instanceId) {
			p.instrument = null;
			p.instance = null;
		}
	});
	instrumentPickBoxBg.style.opacity = 0;
	renderInstancesMenu(o, i, currentOption,orginalName);
	draw();
};
	const confirmNo = new Node({
		value: "No i dont want to delete that instance!",
		style: {w: "100%",h: "40px",bg: "#444",color: "white",textleft: 10,texttop: 10
		}
	});
	confirmNo.onClick = () => {
		renderInstancesMenu(o, i, currentOption,orginalName);
		draw();
	};
	instrumentPickBox.add(confirmYes);
	instrumentPickBox.add(confirmNo);
	draw();
};
	row.add(removeBtn);
	instrumentPickBox.add(row);
});
const addBtn = new Node({
	value: "+ Add Instance",
	style: {
		w: "100%",
		h: "40px",
		bg: "#2a2",
		color: "white",
		textleft: 10,
		texttop: 10
	}
});
addBtn.onClick = () => {
	const used = existingKeys.map(k =>
		parseInt(k.split("_inst_")[1])
	);
	let newIdx = 0;
	while (used.includes(newIdx)) {
		newIdx++;
	}
	const newKey = targetInst + "_inst_" + newIdx;
	instrumentStates[newKey] = { _values: {} };
	renderInstancesMenu(o, i, currentOption, orginalName);
	draw();
};
instrumentPickBox.add(addBtn);
draw();
}
if(activeMenu && activeMenu.type == "select"){
activeMenu.opts.forEach(o => {
	const label = o[0];
	const action = o[1];
	const row = new Node({
		value: label,
		style: { w: "100%", h: "40px", bg: theme.tracksBg, color: "window(theme.textcolor)", textleft: 10 }
	});
	row.onClick = () => {
		if (typeof action === "function") {
			action();
		}
		activeMenu = null;
		menuBox.style.opacity = 0;
		menuBoxBg.style.opacity = 0;
		draw();
	};
	menuBox.add(row);
});
}else{
activeMenu.opts.forEach((o, i) =>{
const currentOption = activeMenu.orginalOpst?.[i];let displayValue = o;
let isInstrument = false;
let instKey = activeMenu.orginalOpst?.[i]
let isEffect = false;
if (Instruments[instKey]) {
	isInstrument = true;
	if (activeMenu.type === "pattern" && activeMenu.pattern) {
		let currentInst = null;
		if (activeMenu.type === "pattern" && activeMenu.pattern && activeMenu.pattern[2] !== undefined) {
			const patId = activeMenu.pattern[2];
			if (patterns[patId]) {
				currentInst = patterns[patId].instrument;
			}
		}
		if (currentInst === instKey) {
			displayValue = "> " + o;
		}
	}
}
if (Effects[instKey]) {
 isEffect = true;
 if (activeMenu.type === "pattern" && activeMenu.pattern) {
  let currentFx = null;
  if (activeMenu.type === "pattern" && activeMenu.pattern && activeMenu.pattern[2] !== undefined) {
   const patId = activeMenu.pattern[2];
   if (patterns[patId]) {
    currentFx = patterns[patId].instrument;
   }
  }
  if (currentInst === instKey) {
   displayValue = "> " + o;
  }
 }
}
let	btn = new Node({ value:displayValue, style: {"textleft":10 ,"texttop":10, "size":15 ,t:"0",l:"2px",  w: '100%', h: '40px', bg :"window(theme.tracksBg)" , color:"window(theme.textcolor)" } });
   if(PointedNode?.value == btn.value){
   	btn.style.bg = blendHexWithRgba(theme.tracksBg, theme.highlight);
}
if (isInstrument && activeMenu.type === "pattern") {
	btn.onClick = () => {
		renderInstancesMenu(o, i, currentOption, activeMenu.orginalOpst?.[i]);
	};
}else if (activeMenu && activeMenu.type === "Audio Menu") {
		menuBox.children = [];
		const outputRow = new Node({
			style: { w: "100%", h: "40px", float: "top" }
		});
		const outputLabel = new Node({
			value: "Audio Output",
			style: { float: "left", w: "120px", h: "40px", texttop: 10 ,color:"window(theme.textcolor)"}
		});
const outputSelect = new Node({
	value: "Empty",
	style: {float:"left", w: "auto", h: "40px", bg: theme.tracksBg, color: "window(theme.textcolor)", textleft: 10  },
	onClick: (el) => {
		activeMenu = {
			type: "select",
			opts: [["Real-time Synth",()=>{settings.buildMusicBeforePlay=0; saveSettings() }], ["Build Buffer",()=>{settings.buildMusicBeforePlay=1; saveSettings() }]]
		};
		menuBox.scroll.y = 0;draw()
	}
});
outputSelect.value=settings.buildMusicBeforePlay?"Build Buffer":"Real-time Synth"
		outputRow.add(outputLabel);
		outputRow.add(outputSelect);
		menuBox.add(outputRow);
		const volumeRow = new Node({
			style: { w: "100%", h: "60px", float: "left" }
		});
		const volumeLabel = new Node({
			value: "Output Volume",
			style: { float: "left", w: "120px", texttop: 10 , color:"window(theme.textcolor)"}
		});
		const volumeSlider = new Slider({
			min: 0,
			max: 1,
			value: settings.songVolume ?? 1,
			step: 0.01,
			style: {   t:"5px", l:"120px", w: 'calc(100% - 140px)', h: '20px', bg:"window(theme.tracksBg)" , thumb: { w: 10, h: 20, bg: '#fff', rad: 5 } },
			onInput: (v) => {
				settings.songVolume = v;
				saveSettings()
			}
		});
		volumeRow.add(volumeLabel);
		volumeRow.add(volumeSlider);
		const uiLabel = new Node({
			value: "Ui Scale",
			style: { float: "left", w: "120px", texttop: 10 , color:"window(theme.textcolor)"}
		});
		const uiSlider = new Slider({
			min: 0.6,
			max: 1.4,
			value: settings.interfaceScale ?? 1,
			step: 0.01,
			style: {   t:"5px", l:"120px", w: 'calc(100% - 140px)', h: '20px', bg:"window(theme.tracksBg)" , thumb: { w: 10, h: 20, bg: '#fff', rad: 5 } },
			onInput: (v) => {
				settings.interfaceScale = v;
				saveSettings()
			}
		});
		volumeRow.add(uiLabel);
		volumeRow.add(uiSlider);
		const dpiLabel = new Node({
	value: "DPR Level",
	style: { float: "left", w: "120px", texttop: 10, color: "window(theme.textcolor)" }
});
const dpiSlider = new Slider({
	min: 0.25,
	max: 1.4,
	value: settings.dpi ?? 1,
	step: 0.01,
	style: { t: "5px", l: "120px", w: 'calc(100% - 140px)', h: '20px', bg: "window(theme.tracksBg)", thumb: { w: 10, h: 20, bg: '#fff', rad: 5 } },
	onInput: (v) => {
		settings.dpi = v;
		saveSettings()
	}
});
volumeRow.add(dpiLabel);
volumeRow.add(dpiSlider);
		menuBox.add(volumeRow);
const cleanPatLabel = new Node({
			value: "Clean Patterns",
			style: { float: "left", w: "120px", h: "40px", texttop: 10 ,color:"window(theme.textcolor)"}
		});
const pattSelect = new Node({
	value: "Empty",
	style: {float:"left", w: "auto", h: "40px", bg: theme.tracksBg, color: "window(theme.textcolor)", textleft: 10  },
	onClick: (el) => {
		activeMenu = {
			type: "select",
			opts: [["True",()=>{settings.cleanPatterns=true; saveSettings() }], ["False",()=>{settings.cleanPatterns=false; saveSettings() }]]
		};
		menuBox.scroll.y = 0;draw()
	}
});
pattSelect.value=settings.cleanPatterns?"True":"False"
		outputRow.add(cleanPatLabel);
		outputRow.add(pattSelect);
		
		menuBox.style.opacity = 1;
		menuBoxBg.style.opacity = 0.5;
		activeMenu=null
		return;
} else if (activeMenu && activeMenu.type === "Song Plugins") {
	renderPlugins();
	menuBox.style.opacity = 1;
	menuBoxBg.style.opacity = 0.5;
	activeMenu = null;
	return;
}
else if (o === "Pattern Instrument") {
    btn.onClick = () => {
        activeMenu = {
        type: "pattern",
        pattern: activeMenu.pattern,
        opts: Object.keys(Instruments).filter(k => k !== "none").map(k => k.toUpperCase()),
        orginalOpst: Object.keys(Instruments).filter(k => k !== "none").map(k => k),
        instance: activeMenu.pattern.instance
        };
        menuBox.scroll.y = 0;draw()
    };
}else if (o === "Pattern Effects") {
	btn.onClick = () => {
		renderFxMenu(o, i, currentOption, activeMenu.orginalOpst?.[i])
		draw();
	};
}
else if (o === "New Pattern") {
	btn.onClick = () => {
	 if (dw.layers[1]) {
 dw.layers[1].forEach((item, i) => {
    if (dw.inObj(item.hit.piano, activeMenu.x, activeMenu.y)) {
		const track = activeMenu.track;
		const newId = nextPatternId++;
		patterns[newId] = {
			name: "Pattern " + newId,
			type: "notes",
			notes: [],
			color: "default",
			instrument: null,
			instance: null,
			fx: []
		};
		const stepW = 4 * dawZoomX;
const localX = (activeMenu.x - item.hit.piano.x + dawScrollX) / stepW;
		const length = 16*2;
		track.patterns.push([localX, length, newId]);
		activeMenu = null;
		menuBox.style.opacity = 0;
		menuBoxBg.style.opacity = 0;
		draw();
    }});}
	};
}
else if (o === "New Automation Clip") {
	btn.onClick = () => {
		const track = activeMenu.track;
		const newId = nextPatternId++;
		if (dw.layers[1]) {
 dw.layers[1].forEach((item, i) => {
    if (dw.inObj(item.hit.piano, activeMenu.x, activeMenu.y)) {
						  const min = 5, max = 6, step = 0.1;
        const initialY = 0;
						const length = 16*2;
		patterns[newId] = {
	name: "Automation Clip",
	type: "mod",
	points: [{ x: 0, y: initialY }, { x: length, y: initialY }],
	min,max,step,
	color: "default",
	instrument: null,
	instance: null,
	fx: []
};
				const stepW = 4 * dawZoomX;
				const localX = (activeMenu.x - item.hit.piano.x + dawScrollX) / stepW;
		track.patterns.push([localX, length, newId]);
		activeMenu = null;
		menuBox.style.opacity = 0;
		menuBoxBg.style.opacity = 0;
		draw();
	}
				})
		}
	}
}else if (o === "Merge Same Patterns/Clips") {
	btn.onClick = () => {
		const track = activeMenu.track;
		const groups = {};
		track.patterns.forEach(p => {
	const pat = patterns[p[2]];
	if (!pat) return;
	const key = JSON.stringify({
		type: pat.type,
		instrument: pat.instrument,
		instance: pat.instance,
		fx: pat.fx || []
	});
	if (!groups[key]) groups[key] = [];
	groups[key].push(p);
});
		Object.values(groups).forEach(group => {
			if (group.length < 2) return;
			group.sort((a, b) => a[0] - b[0]);
			const baseEntry = group[0];
			const basePattern = patterns[baseEntry[2]];
			const baseStart = baseEntry[0];
			let maxEnd = baseStart + baseEntry[1];
			group.slice(1).forEach(entry => {
	const pat = patterns[entry[2]];
	const entryStart = entry[0];
	const entryEnd = entryStart + entry[1];
	if (entryEnd > maxEnd) maxEnd = entryEnd;
	if (pat.type !== "mod") {
		pat.notes.forEach(n => {
			basePattern.notes.push({
				...n,
				x: n.x + (entryStart - baseStart)
			});
		});
	}
	if (basePattern.type === "mod") {const sortedGroups = Object.values(groups)
	.filter(group => group.length >= 2)
	.sort((gA, gB) => {
		const maxEndA = Math.max(...gA.map(e => e[0] + e[1]));
		const maxEndB = Math.max(...gB.map(e => e[0] + e[1]));
		return maxEndA - maxEndB;
	});
sortedGroups.forEach(group => {
	group.sort((a, b) => a[0] - b[0]);
	const baseEntry = group[0];
	const basePattern = patterns[baseEntry[2]];
	const baseStart = baseEntry[0];
	let maxEnd = baseStart + baseEntry[1];
	group.slice(1).forEach(entry => {
		const pat = patterns[entry[2]];
		const entryStart = entry[0];
		const entryEnd = entryStart + entry[1];
		if (entryEnd > maxEnd) maxEnd = entryEnd;
		if (pat.type !== "mod") {
			pat.notes.forEach(n => {
				basePattern.notes.push({
					...n,
					x: n.x + (entryStart - baseStart)
				});
			});
		}
		if (basePattern.type === "mod") {
			if (!basePattern.points) basePattern.points = [];
			const sortedGroup = group.slice().sort((a, b) => a[0] - b[0]);
			let lastEndValue = null;
			sortedGroup.forEach((entry, idx) => {
				const pat = patterns[entry[2]];
				if (!pat) return;
				const clipStart = entry[0];
				const clipLen = entry[1];
				const clipEnd = clipStart + clipLen;
				const offset = clipStart - baseStart;
				const pts = (pat.points || []).slice().sort((a, b) => a.x - b.x);
				if (pts.length === 0) return;
				const first = pts[0];
				const last = pts[pts.length - 1];
				if (lastEndValue !== null && clipStart > baseStart) {
					basePattern.points.push({
						x: clipStart - baseStart,
						y: lastEndValue
					});
				}
				basePattern.points.push({
					x: offset,
					y: first.y
				});
				pts.forEach(p => {
					basePattern.points.push({
						x: p.x + offset,
						y: p.y
					});
				});
				basePattern.points.push({
					x: offset + clipLen,
					y: last.y
				});
				lastEndValue = last.y;
				if (idx !== 0) {
					delete patterns[entry[2]];
				}
			});
			basePattern.points.sort((a, b) => a.x - b.x);
		}
	});
});}
	delete patterns[entry[2]];
});
			baseEntry[1] = maxEnd - baseStart;
			track.patterns = track.patterns.filter(p =>
				p === baseEntry || !group.includes(p)
			);
		});
		activeMenu = null;
		menuBox.style.opacity = 0;
		menuBoxBg.style.opacity = 0;
		draw();
	};
}
 else if (o === "Export As .MP3") {
	btn.onClick = () => {
		exportAsMP3()
		activeMenu = null;
		menuBox.style.opacity = 0;
		menuBoxBg.style.opacity = 0;
	};
}
else if (o === "Export As .MID") {
	btn.onClick = () => {
		exportAsMID()
		activeMenu = null;
		menuBox.style.opacity = 0;
		menuBoxBg.style.opacity = 0;
	};
}
else if (o === "Export As .OPS") {
	btn.onClick =  () => {
		saveProjectToFile()
	 activeMenu = null;
	 menuBox.style.opacity = 0;
menuBoxBg.style.opacity = 0;
	};
}else if (o === "Import .OPS") {
    btn.onClick = () => {
        fileInput.onchange = (e) => {
        const file = e.target.files[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = () => {
        importProject(reader.result);
        };
        reader.readAsText(file);
        };
        fileInput.value = "";
        fileInput.click();
        activeMenu = null;
        menuBox.style.opacity = 0;
        menuBoxBg.style.opacity = 0;
    };
}
else if (o === "+ New Blank Song") {
	btn.onClick = () => {
		activeMenu = null;
		menuBox.style.opacity = 0;
		menuBoxBg.style.opacity = 0;
		
instrumentPickBoxBg.style.opacity = 0.5;
instrumentPickBox.scroll.y = 0;
instrumentPickBox.children = [];
		
		const confirmYes = new Node({
			value: "Yes, create blank song",
			style: { w: "100%", h: "40px", bg: "#a22", color: "white", textleft: 10, texttop: 10 }
		});
		confirmYes.onClick = () => {
			instrumentPickBox.children = [];
			instrumentPickBoxBg.style.opacity = 0
			resetToBlank();
			draw();
		};
		
		const confirmNo = new Node({
			value: "No, cancel",
			style: { w: "100%", h: "40px", bg: "#444", color: "white", textleft: 10, texttop: 10 }
		});
		confirmNo.onClick = () => {
			instrumentPickBox.children = [];
			instrumentPickBoxBg.style.opacity = 0
			draw();
		};
		const infoLabel = new Node({
			value: "Unsaved changes can't be restored. Are you sure to create blank song?",
			style: { w: "100%", h: "40px", bg: "#222", color: "yellow", textleft: 10, texttop: 10 }
		});
		instrumentPickBox.add(infoLabel);
		instrumentPickBox.add(confirmYes);
		instrumentPickBox.add(confirmNo);
		draw();
	};
}
else if (o === "Import .MID") {
	btn.onClick = () => {
		fileInput.onchange = (e) => {
			const file = e.target.files[0];
			if (!file) return;
			importMID(file);
		};
		fileInput.value = "";
		fileInput.click();
		activeMenu = null;
		menuBox.style.opacity = 0;
		menuBoxBg.style.opacity = 0;
	};
}
else if (o === "Themes") {
	btn.onClick = () => {
		activeMenu = {
			type: "themeSelect",
			opts: Object.keys(buildInThemes)
		};
		draw();
	};
} else if (activeMenu && o === "Import Plugins To Song") {
	btn.onClick = () => {
		activeMenu = {
			type: "Song Plugins",
			opts: [""]
		};
		menuBox.style.opacity = 1;
		menuBoxBg.style.opacity = 0.5;
		draw();
	};
} else if (activeMenu && o === "Options") {
	btn.onClick = () => {
		activeMenu = {
			type: "Audio Menu",
			opts: [""]
		};
		menuBox.style.opacity = 1;
		menuBoxBg.style.opacity = 0.5;
		draw();
	};
}else
if (activeMenu && activeMenu.type === "themeSelect") {
	btn.onClick = () => {
		const selected = buildInThemes[o];
		SavedLocalData.set('user_theme', o);
 	theme= selected
		menuBox.style.bg = theme.boxcolor;
		renameBox.style.bg = theme.inputAndDoneRename;
		activeMenu = null;
		menuBox.style.opacity = 0;
		menuBoxBg.style.opacity=0;
		draw();
	};
}
else if (o === "Edit Clip") {
	btn.onClick = () => {
		const t = activeMenu.track;
		const original = activeMenu.pattern;
		if (!original) return;
		const originalId = original[2];
		const originalData = patterns[originalId];
		if (originalData && originalData.type === "mod") {
			const stepW = 4 * dawZoomX;
			const localX = original[0];
			renderAutomationMenu(t, localX, activeMenu.x, originalId);
		}
		activeMenu = null;
		menuBox.style.opacity = 0;
		menuBoxBg.style.opacity = 0;
		draw();
	};
}
else if (o === "Duplicate Clip") {
	btn.onClick = () => {
		const t = activeMenu.track;
		const original = activeMenu.pattern;
		if (!original) return;
		const originalData = patterns[original[2]];
		const newId = nextPatternId++;
		function safeClone(obj) {
			return JSON.parse(JSON.stringify(obj));
		}
		patterns[newId] = {
			...safeClone(originalData),
			fx: originalData.fx ? [...originalData.fx] : []
		};
		const newStart = original[0] + original[1];
		t.patterns.push([newStart, original[1], newId]);
		activeMenu = null;
		menuBox.style.opacity = 0;
		menuBoxBg.style.opacity = 0;
		draw();
	};
}
else  if (o === "Duplicate Pattern") {
    btn.onClick = () => {
        const t = activeMenu.track;
        const originalPat = activeMenu.pattern;
        const originalData = patterns[originalPat[2]];
        const newId = nextPatternId++;
        function safeClone(obj) {
        return JSON.parse(JSON.stringify(obj, (key, value) => {
        if (key === "parent") return undefined;
        if (key === "children") return undefined;
        return value;
        }));
        }
        patterns[newId] = {
        notes: safeClone(originalData.notes),
        color: originalData.color,
        name: originalData.name ,
        instrument: originalData.instrument,
        instance: originalData.instance,
        fx: originalData.fx ? [...originalData.fx] : []
        };
        const newStart = originalPat[0] + originalPat[1];
        t.patterns.push([newStart, originalPat[1], newId]);
        initializeInstrumentState(patterns[newId].instrument, newId);
        if (newId != null) {
        	setTimeout(function (){
        		patterns[newId].playingMidi = patterns[newId].playingMidi || new Set();
        patterns[newId].playingMidi.clear();
       	playNote(60, 0.5, patterns[newId].instrument, newId,lastVolume,true);
        	},20);
        }
        activeMenu = null;
        menuBox.style.opacity = 0;
        menuBoxBg.style.opacity=0;
        draw();
    };
}
else if (o === "Remove Pattern" || o === "Remove Clip") {
    btn.onClick = () => {
        const t = activeMenu.track;
        const patToRemove = activeMenu.pattern;
        const patId = patToRemove[2];
        t.patterns = t.patterns.filter(p => p !== patToRemove);
        if (patterns[patId]) {
        delete patterns[patId];
        }
        activeMenu = null;
        menuBox.style.opacity = 0;
        menuBoxBg.style.opacity=0;
        draw();
    };
}
else
if (o === "Rename Pattern" || o === "Rename Clip") {
    btn.onClick = () => {
        const patId = activeMenu.pattern[2];
        const patternObj = patterns[patId];
        startRenamePattern(patternObj);
        activeMenu = null;
        menuBox.style.opacity = 0;
        menuBoxBg.style.opacity=0;
        draw();
    };
}
else
if (o === "Set Color" && activeMenu.type === "pattern") {
    btn.onClick = () => {
        const patId = activeMenu.pattern[2];
        colorPickerBox.currentTrack = patterns[patId];
        colorPickerBox.style.opacity = 1;
        menuBox.style.opacity = 0;
        menuBoxBg.style.opacity=0;
        activeMenu = null;
        draw();
    };
}
else
if (o === "Use Default Channel Color") {
    btn.onClick = () => {
        const patId = activeMenu.pattern[2];
        patterns[patId].color = "default";
        activeMenu = null;
        menuBox.style.opacity = 0;
        menuBoxBg.style.opacity=0;
        draw();
    };
}
else if (o === "Remove Channel") {
    btn.onClick = () => {
        const t = activeMenu.track;
        t.patterns.forEach(p => {
        delete patterns[p[2]];
        });
        tracks = tracks.filter(x => x !== t);
        activeMenu = null;
        menuBox.style.opacity = 0;
        menuBoxBg.style.opacity=0;
        draw();
    }
}
else
if (o === "Set Color") {
    btn.onClick = () => {
        colorPickerBox.style.opacity = 1;
        menuBox.style.opacity = 0;
        menuBoxBg.style.opacity=0;
        colorPickerBox.currentTrack = activeMenu.track;
        activeMenu = null;
        draw();
    }
}
else
if (o === "Rename") {
    btn.onClick = () => {
        const t = activeMenu.track;
        startRename(t);
        activeMenu = null;
        menuBox.style.opacity = 0;
        menuBoxBg.style.opacity=0;
        draw();
    }
}
   	menuBox.add(btn)
   })
}
 }else{
 	WheelDAWDisabled=false
 	if( instrumentPickBoxBg.style.opacity !== 0|| exportBg.style.opacity !== 0 || view2=="Rename"){
 		WheelDAWDisabled=true
 	}
 }
 dw.render();
}
function addAutomationPoint(pattern, localX, localY, h) {
	const x = pr.quantize(localX);
	const y = clamp(1 - (localY / h), 0, 1);
	pattern.points.push({ x, y });
	pattern.points.sort((a, b) => a.x - b.x);
}
let dragPoint = null;
let dragPattern = null;
let dragBounds = null;
let isDraggingAutomationPoint = false;
function handleDAW(x, y, isLong) {
	let hitSomething = false;
	if (dw.layers[1]) {
		dw.layers[1].forEach((item, i) => {
			if (dw.inObj(item.hit.mute, x, y)) {
				tracks[i].muted = !tracks[i].muted;
				hitSomething = true;
				return;
			}
			if (dw.inObj(item.hit.piano, x, y)) {
				const track = tracks[i];
				const stepW = 4 * dawZoomX;
				const localX = (x - item.hit.piano.x + dawScrollX) / stepW;
				const clickedPat = track.patterns.find(p =>
					localX >= p[0] && localX <= p[0] + p[1]
				);
				if (clickedPat && !bufferLoaded ) {
					const patternId = clickedPat[2];
					const pattern = patterns[patternId];
					if (pattern && pattern.type === "mod") {
	const startX = clickedPat[0];
	const length = clickedPat[1];
	const px = item.hit.piano.x + startX * stepW - dawScrollX;
	const pw = length * stepW;
	let headerH = (dawZoomY > 50) ? (10 + clamp((dawZoomY - 60) / 5, 0, 10)) : 0;
	const availableH = item.hit.piano.h - headerH;
	const drawYStart = item.hit.piano.y + headerH;
	const localStep = (x - px) / stepW;
	const localY = y - drawYStart;
	if (localStep < 0 || localStep > length) return;
	const pts = pattern.points;
	let found = null;
	for (let p of pts) {
		const ax = px + p.x * stepW;
		const ay = drawYStart + (1 - p.y) * availableH;
		if (Math.hypot(x - ax, y - ay) < 6) {
			found = p;
			break;
		}
	}
	if (found) {
		dragPoint = found;
		dragPattern = pattern;
		dragBounds = { px, stepW, drawYStart, availableH, length };
	} else {
		const pMin = pattern.min ?? 0;
const pMax = pattern.max ?? 1;
const pStep = pattern.step ?? 0.01;
let val = pMin + localY / availableH * (pMax - pMin);
val = Math.round(val / pStep) * pStep;
let newY = (val - pMin) / (pMax - pMin);
		const newPoint = {
			x: (localStep),
			y: clamp(1 - newY, 0, 1)
		};
		pattern.points.push(newPoint);
		pattern.points.sort((a, b) => a.x - b.x);
		dragPoint = newPoint;
		dragPattern = pattern;
		dragBounds = { px, stepW, drawYStart, availableH, length };
	}
	draw();
	return;
}
					selectedPattern = patternId;
					view = "PianoRoll";
					currentTrack = track;
					currentTrack.activePatternIdx = track.patterns.indexOf(clickedPat);
					pScrollX = 0;
					pScrollY = 700;
				} else if(!bufferLoaded){
					const newId = nextPatternId++;
					const startStep = Math.floor(localX / 16) * 16;
					patterns[newId] = {
						notes: [],
						color: "default",
						name: "Pattern",
						instrument: "square",
						instance: 0,
					};
					track.patterns.push([startStep, 32, newId]);
					initializeInstrumentState(patterns[newId].instrument, newId);
					track.activePatternIdx = track.patterns.length - 1;
				}
				hitSomething = true;
			}
		});
	}
	draw();
}
function clearSelection() {
	selectedNotes = new Set();
	if (typeof removeBtnpr !== 'undefined') {
		removeBtnpr.style.opacity = 0;
		duplicateBtn.style.opacity = 0;
		removeBtnpr.style.pointerEvents = "none";
		duplicateBtn.style.pointerEvents = "none";
	}
	draw();
}
function handlePRDown(x, y) {
 if (y < 44) { return; }
 if (x > W - 40 && y > H - 30) { rhythmIndex = (rhythmIndex + 1) % rhythmOptions.length;
  draw();   return; } else {
  	if (selectBtn.active) {
	isSelecting = true;
selectStart = {
	x: x + pScrollX,
	y: y + pScrollY
};
	selectRect = null;
	return;
}
 const nx = (x + pScrollX - KEY_W) / STEP_W;
 const ny = KEYS - 1 - Math.floor((y - window.NavH + pScrollY) / NOTE_H);
 const pattern = patterns[selectedPattern];
 let hit  = false;
if (pattern) {
  hit = pattern.notes.find(n => nx >= n.x && nx < n.x + n.w && ny === n.y);
}
 if (hit) {
  pDownOnNote = true;
  pMoved = false;
  const effectiveW = hit.w * STEP_W;
const noteScreenX = KEY_W + (hit.x * STEP_W) - pScrollX;
const edgeX = noteScreenX + effectiveW;
const dist = Math.abs(x - edgeX);
if (dist < 10) {
	pMode = "resize";
} else {
	pMode = "move";
}
const dragData = {
	n: hit,
	x,
	y,
	ox: nx - hit.x,
	baseV: hit.v
};
const key = hit.x + ":" + hit.y;
if (selectedNotes && !selectedNotes.has(key)) {
	clearSelection();
}
dragData.baseStartX = hit.x;
dragData.baseStartY = hit.y;
if (selectedNotes && selectedNotes.has(key)) {
	dragData.group = [];
	const pattern = patterns[selectedPattern];
	pattern.notes.forEach(n => {
		const k = n.x + ":" + n.y;
		if (selectedNotes.has(k)) {
			dragData.group.push({
				note: n,
				startX: n.x,
				startY: n.y,
				v: n.v
			});
		}
	});
	dragData.groupStartStep =
		pr.quantize((x + pScrollX - KEY_W) / STEP_W - dragData.ox);
	dragData.groupStartY =
		KEYS - 1 - Math.floor((y - window.NavH + pScrollY) / NOTE_H);
}
pDrag = dragData;
 } else {
  pMode = "scroll";
  pDrag = { x, y, sx: pScrollX, sy: pScrollY };
  pDownOnNote = false;
  pMoved = false;
 }
  }
}
let pointerThreshold = 10;
let wasMovinNote=false
let lastPRX=null
let lastVolume = 1;
let lastPRY=null
function handlePRMove(x, y, pointerId) {
 if (!pDrag) return;
 if (isSelecting && selectStart) {
	selectRect = {
	x1: Math.min(selectStart.x, x + pScrollX),
	x2: Math.max(selectStart.x, x + pScrollX),
	y1: Math.min(selectStart.y, y + pScrollY),
	y2: Math.max(selectStart.y, y + pScrollY)
};
	lastPRX = x
  lastPRY = y
	draw();
}
 const dx = x - pDrag.x;
 const dy = y - pDrag.y;
 if (y < window.NavH && selectedNotes.size>0) return;
 if (!pMoved && Math.hypot(dx, dy) < pointerThreshold) return;
 pMoved = true;
 if (pMode === "scroll" && Object.keys(pDrag).length>0) {
  pScrollX = Math.max(0, pDrag.sx + (pDrag.x - x));
  pScrollY = Math.max(0, Math.min(pDrag.sy + (pDrag.y - y), KEYS * NOTE_H - H + 80));
 }  else if (pMode === "move") {
if (volumeBtn.active && pDrag.n) {
	const sensitivity = 200;
	const dy = pDrag.y - y;
	const delta = dy / sensitivity;
	const key = pDrag.n.x + ":" + pDrag.n.y;
	if (selectedNotes.has(key)) {
		const pattern = patterns[selectedPattern];
		pattern.notes.forEach(n => {
			const k = n.x + ":" + n.y;
			if (selectedNotes.has(k)) {
				n.v = Math.max(0, Math.min(1, pDrag.baseV + delta));
			}
		});
	} else {
		pDrag.n.v = Math.max(0, Math.min(1, pDrag.baseV + delta));
	}
	isDraggingForVolume=true
	lastVolume = pDrag.n.v;
	wasMovinNote = pDrag;
	draw();
	return;
}
	lastPRX = x
lastPRY = y
	const newStep =
		pr.quantize((x + pScrollX - KEY_W) / STEP_W - pDrag.ox);
	const newY =
		KEYS - 1 - Math.floor((y - window.NavH + pScrollY) / NOTE_H);
	if (pDrag.group) {
	const deltaX = newStep - pDrag.baseStartX;
	const deltaY = newY - pDrag.baseStartY;
	const nextSelectedNotes = new Set();
	pDrag.group.forEach(g => {
		g.note.x = Math.max(0, g.startX + deltaX);
		g.note.y = Math.max(0, Math.min(KEYS - 1, g.startY + deltaY));
		nextSelectedNotes.add(g.note.x + ":" + g.note.y);
	});
	selectedNotes = nextSelectedNotes;
} else {
		pDrag.n.x = Math.max(0, newStep);
		pDrag.n.y = Math.max(0,
			Math.min(KEYS - 1, newY)
		);
	}
	wasMovinNote = pDrag;
} else if (pMode === "resize") {
	lastPRX = x
lastPRY = y
  let newW = pr.quantize((x + pScrollX - KEY_W) / STEP_W) - pDrag.n.x;
  pDrag.n.w = Math.max(pr.rStep(), newW);
  lastNoteLength = pDrag.n.w;
}
 draw();
}
function handlePRUp(x, y, pMode,nonext) {
	if (isSelecting && selectRect) {
	const pattern = patterns[selectedPattern];
	if (pattern) {
		selectedNotes = new Set();
		pattern.notes.forEach(n => {
			const nx = KEY_W + n.x * STEP_W ;
			const ny = (KEYS - 1 - n.y) * NOTE_H + window.NavH ;
			const nw = n.w * STEP_W;
			const nh = NOTE_H;
			if (nx < selectRect.x2 && nx + nw > selectRect.x1 &&
				ny < selectRect.y2 && ny + nh > selectRect.y1) {
				selectedNotes.add(n.x + ":" + n.y);
			}
			if(selectedNotes.size!==0){
				selectBtn.active=false
				selectBtn.style.bg = !selectBtn.active ? "window(theme.buttons)" : "window(theme.done)"
    isSelecting=false
draw();
			}
		});
	}
const hasSelection = selectedNotes && selectedNotes.size > 0;
removeBtnpr.style.opacity = hasSelection ? 1 : 0;
duplicateBtn.style.opacity = hasSelection ? 1 : 0;
copyBtn.style.opacity = hasSelection ? 1 : 0;
removeBtnpr.style.pointerEvents = hasSelection ? "auto" : "none";
duplicateBtn.style.pointerEvents = hasSelection ? "auto" : "none";
pDrag = null;
isSelecting = false;
selectRect = null;
	draw();
}
if(nonext)return
 if (!pDrag) return;
 if (oneTimeClick) return;
if (pMode === "scroll" && !pMoved) {
	let nx = pr.quantize((x + pScrollX - KEY_W) / STEP_W);
	let ny = KEYS - 1 - Math.round((y -NOTE_H/2 - window.NavH + pScrollY) / NOTE_H);
	const pattern = patterns[selectedPattern];
	if(x>60){
if (pattern && ny > -1) {
    const alreadyExists = pattern.notes.some(n => n.x === nx && n.y === ny);
    if (!alreadyExists) {
    	clearSelection()
        const newNote = {
        x: nx,
        y: ny,
        w: lastNoteLength,
        v: lastVolume
        };
        pattern.notes.push(newNote);
        pattern.playingMidi = pattern.playingMidi || new Set();
        pattern.playingMidi.clear();
        playNote(ny, 1, pattern.instrument, selectedPattern, lastVolume,true);
    }
	}
	}else{
		pattern.playingMidi = pattern.playingMidi || new Set();
pattern.playingMidi.clear();
		playNote(ny, 1, pattern.instrument, selectedPattern,lastVolume,true);
	}
} else if (pMode === "move" && !pMoved && pDownOnNote) {
  let nx = pr.quantize((x + pScrollX - KEY_W) / STEP_W);
let ny = KEYS - 1 - Math.round((y - window.NavH + pScrollY) / NOTE_H);
const pattern = patterns[selectedPattern];
if (pattern) {
  pattern.notes= pattern.notes.filter(n => n !== pDrag.n);
}
 }
 pDrag = null;
 pMode = null;
 draw();
}
let pointers = new Map()
let isMovedPointer = false
let oneTimeClick = false
let isPinching = false;
let longPressTimer = null;
let longPressStart = null;
let longPressTrack = null;
function getTrackIndexFromY(y) {
 const ty = window.NavH - dawScrollY
 const h = dawZoomY + 4
 const idx = Math.floor((y - ty) / h)
 if (idx < 0 || idx >= tracks.length) return null
 return idx
}
function getTrackIndexFromY(py) {
    const relativeY = py - window.NavH + dawScrollY;
    const trackFullHeight = dawZoomY + 1;
    const index = Math.floor(relativeY / trackFullHeight);
    if (index >= 0 && index < tracks.length) return index;
    return null;
}
function startRenamePattern(patternObj) {
    renameDialog.active = true;
    renameDialog.pattern = patternObj;
    renameDialog.track = null;
    view2 = "Rename";
    renameNav.value = "Rename Pattern";
    inputRename.value = patternObj.name;
    hI.value = patternObj.name;
    activeInput = inputRename;
}
let isDraggingForVolume=false;
function startRename(track) {
    renameDialog.active = true;
    renameDialog.track = track;
    renameDialog.pattern = null;
    renameDialog.text = track.name;
    view2 = "Rename";
    renameNav.value = "Rename Channel";
    inputRename.value = track.name;
    hI.value = track.name;
    activeInput = inputRename;
}
async function onDown(e) {
	isDraggingForVolume=false
	PointedNode = root.findTarget(e.clientX, e.clientY);
if (PointedNode) {
	draw();
}
wasMovinNote=null
 oneTimeClick = false
 pointers.set(e.pointerId, { x: e.clientX, y: e.clientY, sx: e.clientX, sy: e.clientY })
 const p = pointers.values().next().value
 target = root.findTarget(p.x, p.y)
if (menuBoxBg.style.opacity > 0) {
    const hitTarget = root.findTarget(e.clientX, e.clientY);
    let isInsideMenu = false;
    let temp = hitTarget;
    while(temp) {
        if (temp === menuBox) {isInsideMenu = true;  }
        temp = temp.parent;
    }
    if (!isInsideMenu) {
        activeMenu = null;
        menuBox.style.opacity = 0;
        menuBoxBg.style.opacity = 0;
        draw();
        oneTimeClick = true;
        return;
    }
}
isMovedPointer = false
if (target) {
	capturedNode = target;
	return;
}
 UpPoint=false
 c.setPointerCapture(e.pointerId)
 if (pointers.size === 1) {
 if (view2 === "Rename") {
    const p = pointers.get(e.pointerId);
    const inp = renameDialog.input;
    if (inp && dw.inObj(inp, p.x, p.y)) {
        activeInput = inp;
        caret = inp.text.length;
        draw();
        return;
    } else {
    }
  }
  if (e.button === 1) {
	e.preventDefault();
	longPressStart = { x: e.clientX, y: e.clientY };
	longPressTimer = setTimeout(() => {
		UpPoint = true;
	}, 350);
	if (view === "PianoRoll") {
		isSelecting = true;
		selectStart = { x: e.clientX + pScrollX, y: e.clientY + pScrollY };
		selectRect = null;
	}
	return;
}
   if (view === "DAW") {
    const ti = getTrackIndexFromY(p.y);
if (dw.layers[1]) {
		dw.layers[1].forEach((item, i) => {
let x=p.x; let y=p.y
if (dw.inObj(item.hit.piano, x, y)) {
	const track = tracks[i];
	const stepW = 4 * dawZoomX;
	const localX = (x - item.hit.piano.x + dawScrollX) / stepW;
	const clickedPat = track.patterns.find(p =>
		localX >= p[0] && localX <= p[0] + p[1]
	);
	if (clickedPat && !bufferLoaded ) {
		const patternId = clickedPat[2];
		const pattern = patterns[patternId];
		if (pattern && pattern.type === "mod") {
			const startX = clickedPat[0];
			const length = clickedPat[1];
			const px = item.hit.piano.x + startX * stepW - dawScrollX;
			const pw = length * stepW;
			let headerH = (dawZoomY > 50) ? (10 + clamp((dawZoomY - 60) / 5, 0, 10)) : 0;
			const availableH = item.hit.piano.h - headerH;
			const drawYStart = item.hit.piano.y + headerH;
			const localStep = (x - px) / stepW;
			const localY = y - drawYStart;
			if (localStep < 0 || localStep > length) return;
			const pts = pattern.points;
			let found = null;
			for (let p of pts) {
				const ax = px + p.x * stepW;
				const ay = drawYStart + (1 - p.y) * availableH;
				if (Math.hypot(x - ax, y - ay) < 20) {
					found = p;
					break;
				}
			}
			if (found) {
				dragPoint = found;
				dragPattern = pattern;
				dragBounds = { px, stepW, drawYStart:drawYStart-5, availableH, length };
			}
		}}
}
});
}
   if (ti !== null && !bufferLoaded) {
    longPressStart = { x: p.x, y: p.y };
    longPressTrack = ti;
    longPressTimer = setTimeout(() => {
        UpPoint = true;
        const track = tracks[longPressTrack];
        const piano = track._btnPiano;
        const stepW = 4 * dawZoomX;
        const localX = (p.x - piano.x + dawScrollX) / stepW;
        const localY = (p.y - piano.y + dawScrollY)  ;
        const pat = track.patterns.find(p_ => localX >= p_[0] && localX <= p_[0] + p_[1]);
        if (pat && p.x>trackW) {
        	if(patterns[pat[2]].type=="mod"){
        		activeMenu = {
        x: p.x,
        track: track,
        pattern: pat,
        type: "pattern",
        opts: ["Edit Clip","Duplicate Clip", "Remove Clip", "Rename Clip", "Set Color", "Use Default Channel Color"]
        };menuBox.scroll.y = 0;draw()
        	}else{
        activeMenu = {
        x: p.x,
        track: track,
        pattern: pat,
        type: "pattern",
        opts: ["Duplicate Pattern", "Remove Pattern", "Rename Pattern", "Set Color", "Use Default Channel Color","Pattern Effects","Pattern Instrument"]
        };menuBox.scroll.y = 0;draw()
        	}
        selectedPattern = pat[2];
        } else {
       if (p.x < window.trackW) {
        activeMenu = {
        x: p.x,
        track: track,
        type: "track",
        opts: ["Remove Channel", "Set Color", "Rename"]
        };menuBox.scroll.y = 0;draw()
       } else {
        activeMenu = {
        x: p.x,
        y: p.y,
        track: track,
        type: "trackArea",
        opts: [
        "New Automation Clip",
        "New Wave File",
        "New Pattern",
        "Merge Same Patterns/Clips"
        ]
        };
        menuBox.scroll.y = 0;draw()
        }
       }
        draw();
    }, 350);
    }
    if (ti !== null) {
        const track = tracks[ti];
        const piano = track._btnPiano;
        const stepW = 4 * dawZoomX;
        const localX = (p.x - piano.x + dawScrollX) / stepW;
        const pat = track.patterns.find(p_ => localX >= p_[0] && localX <= p_[0] + p_[1]);
        if (pat) {
        let headerH = (dawZoomY > 50) ? (10 + clamp((dawZoomY - 60) / 5, 0, 10)) : 0;
        const distFromEnd = (pat[0] + pat[1]) - localX;
        if (distFromEnd < 4 / dawZoomX) {
        	lastPRX = p.x
        lastPRY = null
        pMode = "resizePattern";
        pDrag = { track, pat, startW: pat[1], startX: p.x, sx:dawScrollX };
        }
        else if (headerH > 0 && p.y  >= piano.y && p.y  <= piano.y + headerH*2) {
        pMode = "movePattern";
        pDrag = { track, pat, ox: localX - pat[0], sx: dawScrollX };
        } else {
        pMode = "scroll";
        pDrag = { x: p.x, y: p.y, sx: dawScrollX, sy: dawScrollY };
        }
        } else {
        pMode = "scroll";
        pDrag = { x: p.x, y: p.y, sx: dawScrollX, sy: dawScrollY };
        }
    }
}
  if (view === "DAW" && pMode !== "movePattern"&& pMode !== "resizePattern") {
   pMode = "scroll";
   pDrag = { x: p.x, y: p.y, sx: dawScrollX, sy: dawScrollY };
  }
  else if(pMode !== "movePattern"&& pMode !== "resizePattern" ){handlePRDown(p.x, p.y)}
 }
}
let lastDist = null
function handlePinch(e) {
 if (pointers.size !== 2) return
 const [a, b] = [...pointers.values()]
 const dx = a.x - b.x
 const dy = a.y - b.y
 const dist = Math.hypot(dx, dy)
 isPinching = true;
 if (lastDist) {
  const d = dist - lastDist
  if (view === "DAW") {
   if (Math.abs(dy) > Math.abs(dx)) {
    dawZoomY = clamp(dawZoomY + d * 0.1, 20, 200);
   } else {
   	if(isPlaying)return;
    dawZoomX = clamp(dawZoomX + d * 0.003, 0.25, 15);
   }
  } else {
   if (Math.abs(dy) > Math.abs(dx)) {
    NOTE_H = clamp(NOTE_H + d * 0.04, 6, 80)
    selectRect = null;
   } else {
    STEP_W = clamp(STEP_W + d * 0.04, 2, 120)
    selectRect = null;
   }
  }
 }
 lastDist = dist
}
let dawScrollX = 0;
let lastScrollX = dawScrollX;
const totalWidth = TOTAL_STEPS * STEP_W;
function scrollDAWX(delta) {
	if(isPlaying)return;
	if(!delta)return;
 dawScrollX = clamp(dawScrollX + delta, 0, Math.max(0, TOTAL_STEPS * STEP_W - W));
 draw();
}
function pointHighlight(e){
PointedNode = root.findTarget(e.clientX, e.clientY);
if (PointedNode) {
	draw();
}
}
function onMove(e) {
	if (!pointers.has(e.pointerId)) return;
	if (isPinching && pointers.size === 1) return;
	const p = pointers.get(e.pointerId);
	pointers.set(e.pointerId, { ...p, x: e.clientX, y: e.clientY });
	dx = p.x - p.sx;
	dy = p.y - p.sy;
	if (longPressStart ) {
		dx = p.x - longPressStart.x;
		dy = p.y - longPressStart.y;
		if (Math.hypot(dx, dy) > 5) {
			clearTimeout(longPressTimer);
			longPressStart = null;
		}
	}
	if (!pDrag?.x) { pointHighlight(e); }
	if (!isMovedPointer && Math.hypot(dx, dy) > 20) { isMovedPointer = true; }
	if (capturedNode !== null) return;
	if (pointers.size === 1) {
		const p = pointers.values().next().value;
		if (dragPoint && dragPattern && dragBounds && !bufferLoaded) {
			const { px, stepW, drawYStart, availableH, length } = dragBounds;
			const localStep = (p.x - px) / stepW;
			const localY = p.y - 10 - drawYStart;
			let newX = clamp(localStep, 0, length);
			const rawY = clamp(1 - (localY / availableH), 0, 1);
			const pMin = dragPattern.min ?? 0;
			const pMax = dragPattern.max ?? 1;
			const pStep = dragPattern.step ?? 0.01;
			let val = pMin + rawY * (pMax - pMin);
			val = Math.round(val / pStep) * pStep;
			let newY = (val - pMin) / (pMax - pMin);
			const pts = dragPattern.points;
			const idx = pts.indexOf(dragPoint);
			let leftLimit = 0;
			let rightLimit = length;
			if (idx > 0) { leftLimit = pts[idx - 1].x + 0.0001; }
			if (idx < pts.length - 1) { rightLimit = pts[idx + 1].x - 0.0001; }
			dragPoint.x = clamp(newX, leftLimit, rightLimit);
			dragPoint.y = newY;
			if (p.y < drawYStart - 20) {
				pts.splice(idx, 1);
				dragPoint = null;
				dragPattern = null;
				dragBounds = null;
				draw();
				return;
			}
			isDraggingAutomationPoint = true;
			draw();
			return;
		}
if(isDraggingAutomationPoint)return
		if ((view === "DAW" && pMode === "scroll") && !bufferLoaded) {
			dx = p.x - pDrag.x;
			dy = p.y - pDrag.y;
			scrollDAWX(-dx);
			pDrag.x = p.x;
			if (pDrag.sy !== undefined) {
				const totalHeight = tracks.length * (dawZoomY + 9);
				dawScrollY = clamp(pDrag.sy - dy, 0, Math.max(0, totalHeight - H / 2));
			} else {
				pDrag = { x: p.x, y: p.y, sx: dawScrollX, sy: dawScrollY };
			}
		} else if (pMode === "movePattern" && !bufferLoaded ) {
			const stepW = 4 * dawZoomX;
			const pianoX = pDrag.track._btnPiano.x;
			const newX = (p.x - pianoX + dawScrollX) / stepW - pDrag.ox;
			pDrag.pat[0] = Math.max(0, Math.round(newX));
			lastPRX = p.x;
			const newTrackIdx = getTrackIndexFromY(p.y);
			lastPRY = p.y;
			if (newTrackIdx !== null && tracks[newTrackIdx] !== pDrag.track) {
				const targetTrack = tracks[newTrackIdx];
				pDrag.track.patterns = pDrag.track.patterns.filter(pa => pa !== pDrag.pat);
				targetTrack.patterns.push(pDrag.pat);
				pDrag.track = targetTrack;
			}
			draw();
		} else if (pMode === "resizePattern" && !bufferLoaded ) {
			const stepW = 4 * dawZoomX;
			const diffX = (p.x - pDrag.startX + (dawScrollX - pDrag.sx)) / stepW;
			pDrag.pat[1] = Math.max(1, Math.round(pDrag.startW + diffX));
			lastPRX = p.x;
			draw();
		} else {
			handlePRMove(p.x, p.y);
		}
	}
	if (pointers.size === 2) {
	handlePinch()
	draw()
}
}
function onUp(e) {
	isDraggingAutomationPoint=false
	lastPRX = null
lastPRY = null
dragPoint = null;
dragPattern = null;
dragBounds = null;
clearTimeout(longPressTimer)
	setTimeout(function (){
	PointedNode=null;
		pDrag={}
	},100);
	if (oneTimeClick) { pointers.delete(e.pointerId);clearTimeout(longPressTimer);
longPressStart = null; return; }
 lastPmode=pMode
 pMode=""
 if(wasMovinNote){
 	wasMovinNote.playingMidi = wasMovinNote.playingMidi || new Set();
wasMovinNote.playingMidi.clear();
 	playNote(wasMovinNote.n.y, 1, wasMovinNote.instrument, selectedPattern,lastVolume,true);
 }
 if (!pointers.has(e.pointerId)) return
 const target = root.findTarget(e.clientX, e.clientY);
if (target && target.onClick && longPressStart == null && isMovedPointer == false) {
	const p = pointers.get(e.pointerId)
 target.onClick(target,p);
}
 if(capturedNode!==null){capturedNode=null; pointers.delete(e.pointerId); clearTimeout(longPressTimer);
longPressStart = null; return;}
 if(UpPoint){pointers.delete(e.pointerId); clearTimeout(longPressTimer);
longPressStart = null;return;}
 const p = pointers.get(e.pointerId)
 if (view2 === "Rename") {
    const hitDone = dw.inObj({x: W / 2 - 60, y: H * 0.55, w: 120, h: 40}, p.x, p.y)
    if (hitDone) {
        renameDialog.track.name = renameDialog.text
        view2 = ""
        clearTimeout(longPressTimer);
longPressStart = null;
        pointers.delete(e.pointerId);
        draw()
    }
    return
}
 if (pointers.size === 1) {
 	clearTimeout(longPressTimer)
  if (isMovedPointer !== false) { if((view === "PianoRoll")){handlePRUp(p.x, p.y,lastPmode,true)} }
  else if (view === "DAW") { handleDAW(p.x, p.y, false) }
  else if (view === "PianoRoll") {
   const layer = dw.layers[2];
   if (layer) {
    const hit = layer[0].hit;
   }
   if (p.y < window.NavH) {
 pointers.delete(e.pointerId)
 if (pointers.size < 1) {
  lastDist = null;
  isPinching = false;
 }
 clearTimeout(longPressTimer)
 longPressStart = null
 if (pointers.size < 2) lastDist = null
 return;
}
   handlePRUp(p.x, p.y,lastPmode)
  } else {
   handlePRUp(p.x, p.y,lastPmode)
  }
 }
 pointers.delete(e.pointerId)
 if (pointers.size < 1) {
  lastDist = null;
  isPinching = false;
 }
 clearTimeout(longPressTimer)
 longPressStart = null
 if (pointers.size < 2) lastDist = null
}
c.addEventListener("pointerdown", onDown)
c.addEventListener("pointermove", onMove)
c.addEventListener("pointerup", onUp)
c.addEventListener("pointercancel", onUp)
c.addEventListener("pointerleave", onUp)
let vKey = false;
window.addEventListener("keydown", e => {
	if (e.key.toLowerCase() === "v") vKey = true;
});
window.addEventListener("keyup", e => {
	if (e.key.toLowerCase() === "v") vKey = false;
});
function getNoteUnderMouse(mx, my) {
	const pattern = patterns[selectedPattern];
	if (!pattern) return null;
	for (let i = pattern.notes.length - 1; i >= 0; i--) {
		const n = pattern.notes[i];
		const nx = KEY_W + n.x * STEP_W - pScrollX;
		const ny = (KEYS - 1 - n.y) * NOTE_H - pScrollY + window.NavH;
		if (mx >= nx && mx <= nx + n.w * STEP_W &&
			my >= ny && my <= ny + NOTE_H) {
			return n;
		}
	}
	return null;
}
c.addEventListener("wheel", e => {
	if(WheelDAWDisabled)return
 e.preventDefault();
 if (view === "DAW") {
  if (e.altKey) {
   scrollDAWX(e.deltaY);
  }else
  if (e.shiftKey) {
   dawZoomY = clamp(dawZoomY - e.deltaY * 0.05, 20, 200);
  } else if (e.ctrlKey) {
  	if(isPlaying)return;
   dawZoomX = clamp(dawZoomX - e.deltaY * 0.001, 0.25, 15);
  }else {
  	const totalHeight = tracks.length * (dawZoomY + 9);
	dawScrollY = clamp(dawScrollY + e.deltaY* 0.3, 0, Math.max(0, totalHeight - H / 2));
  }
 }else if (view === "PianoRoll" && vKey) {
		const rect = c.getBoundingClientRect();
		const mx = e.clientX - rect.left;
		const my = e.clientY - rect.top;
		const note = getNoteUnderMouse(mx, my);
		if (note) {
			pDrag = {
        n: note
    };
			const sensitivity = 0.0015;
			const delta = -e.deltaY * sensitivity;
			const key = note.x + ":" + note.y;
			if (selectedNotes.has(key)) {
				const pattern = patterns[selectedPattern];
				pattern.notes.forEach(n => {
					const k = n.x + ":" + n.y;
					if (selectedNotes.has(k)) {
						n.v = Math.max(0, Math.min(1, (n.v ?? 1) + delta));
					}
				});
			} else {
				note.v = Math.max(0, Math.min(1, (note.v ?? 1) + delta));
			}
 isDraggingForVolume=true
			lastVolume = note.v;
			draw();
			return;
		}
	} else if (view === "PianoRoll" ) {
  if (e.shiftKey) {
   NOTE_H = clamp(NOTE_H - e.deltaY * 0.05, 6, 80);
   selectRect = null;
  } else if (e.ctrlKey) {
   STEP_W = clamp(STEP_W - e.deltaY * 0.05, 2, 120);
   selectRect = null;
  } else if (e.altKey){
   pScrollX = Math.max(0, pScrollX + e.deltaY);
  }else{
  	pScrollY = Math.max(0, pScrollY + e.deltaY);
  }
 }
 draw();
}, { passive: false });
let root;
let draggingSlider = null;
let draggingKnob = null;
let navbarDAW
let menuBox;
let menuBoxBg;
let sLT =0; let vLT=0
let lastFrameTime = 0;
function validateBPM() {
    let val = parseInt(bpmInput.value);
    if ( (isNaN(val) || val <= 0)) {
        BPM = 155;
        bpmInput.value = "155";
    } else {
        BPM = val;
    }
}
let instrumentInside,instrumentBox;
let bottomNav,addBtn,removeBtnpr,selectBtn,volumeBtn,scopeCanvas,duplicateBtn,instrumentPickBoxBg,instrumentPickBox,instrumentNav,instrumentOk,exportContainer,exportProgress,exportBg,exportLabel,instrumentVersion
var copyBtn,pasteBtn,rythmselectBtn,backbtn
function init() {
canvas = c
root = new Node({ style: {  w: '100vw', h: '100vh' } });
menuBoxBg = new Node({ style: {pos:"abs", t:"0",l:"0",  w: '100vw', h: '100vh', bg :"#000", opacity :0} });
menuBox = new Node({ style: {pos:"abs", t:"5vh",l:"5vw",  w: '90vw', h: '90vh', bg :"window(theme.boxcolor)", opacity :0,ovy:"hid scroll"} });
menuBoxBg.add(menuBox)
renameBox = new Node({ style: {pos:"abs", t:"0",l:"0",  w: '100vw', h: '100vh', bg :"window(theme.inputAndDoneRename)", opacity :0.5} });
renameBox.style.opacity=0
renameModal = new Node({ style: {pos:"abs", t:"5vh",l:"5vw",  w: 'calc(100vw -10vw)', h: '90vh', bg :"window(theme.buttons)", opacity :1} });
renameNav = new Node({ value:"Rename Channel", style: {pos:"abs", t:"0",l:"0",  w: '90vw', h: '40px', bg :"#444", opacity :1} });
inputAndDoneRename = new Node({ style: { t:"25%",l:"0%"} });
function getCaretFromClick(el, clickX) {
    const s = el.style;
    const localX = clickX
        - el.box.x
        - s.textleft
        + el.scroll.x;
    ctx.font = `${s.size}px Arial`;
    let acc = 0;
    for (let i = 0; i < el.value.length; i++) {
        const w = ctx.measureText(el.value[i]).width;
        if (localX < acc + w / 2) {
        return i;
        }
        acc += w;
    }
    return el.value.length;
}
inputRename = new Node({
    type: "input",
    value: "",
    placeholder: "Empty",
    onClick: (el, p) => {
     caretDisable=false
        activeEl = el;
        hI.value = el.value;
        hI.style.width = '1px';
hI.style.height = '1px';
hI.style.opacity = '0.0';
hI.style.left = p.x + 'px';
hI.style.top = p.y + 'px';
hI.style.pointerEvents = 'auto';
activeInput = this
hI.focus();
const caretIndex = getCaretFromClick(el, p.x);
const len = getCaretFromClick(el, p.x);
el.caret = len
setTimeout(function() {
	hI.focus();
	hI.style.left = "-99999px";
	hI.setSelectionRange(len, len);
	caret = len;
}, 10);
    },
    style: { t: "0", l: "25%", w: "50%", h: "40px", bg:"window(theme.inputAndDoneRename)" , highlight:"window(theme.highlight)", color:"window(theme.textcolor)", float: "top", ovx: "hid scroll" }
});
doneRename = new Node({ value: "DONE", style: {  t: "20px", l: "25%", w: '50%', h: '40px', bg: "#2a2" ,color:"window(theme.textcolor)" , float:"top"} });
doneRename.onClick = () => {
    if (renameDialog.pattern) {
        renameDialog.pattern.name = inputRename.value;
    } else if (renameDialog.track) {
        renameDialog.track.name = inputRename.value;
    }
    view2 = "";
    renameBox.style.opacity = 0;
    renameDialog.pattern = null;
    renameDialog.track = null;
    activeInput = null;
    activeEl = null;
    draw();
};
inputAndDoneRename.add(inputRename)
inputAndDoneRename.add(doneRename)
renameBox.add(renameModal)
renameModal.add(renameNav)
renameBox.add(inputAndDoneRename)
pianoRollNav = new Node({
	style: { pos: 'abs', t: '0', l: '0', w: '100%', h: "window(window.NavH)", ov: 'hid', bg:"window(theme.boxcolor)" }
});
backbtn = new Node({
value:"OK",	style: {   t: '4px', l: '4px', w: 'auto',
h: "calc(window(window.NavH)-8)",
texttop:"calc( (window(window.NavH)-8)/4)",  ovx:"...",
ov: 'hid',highlight:"window(theme.highlight)", bg:"window(theme.buttons)", color:"window(theme.textcolor)",float:"left" }
});
backbtn.onClick=()=>{
	view = "DAW";
pDrag = null;
draw();
oneTimeClick = true;
return;
}
pianoRollNav.add(backbtn);
rythmselectBtn = new Node({
value:"Free",	style: {   t: '4px', l: '4px', w: 'auto', h: "calc(window(window.NavH)-8)",
	texttop:"calc( (window(window.NavH)-8)/4)", ov: 'hid', bg: "window(theme.buttons)", highlight:"window(theme.highlight)", color:"window(theme.textcolor)",float:"left" }
});
rythmselectBtn.onClick=(e)=>{
	rhythmIndex = (rhythmIndex + 1) % rhythmOptions.length;
pMode = false;
pDrag = false;
draw();
oneTimeClick = true;
e.value=rhythmOptions[rhythmIndex]=="Free"? "Free" : ("1/" + rhythmOptions[rhythmIndex])
}
rythmselectBtn.value=rhythmOptions[rhythmIndex]=="Free"? "Free" : ("1/" + rhythmOptions[rhythmIndex])
pianoRollNav.add(rythmselectBtn);
selectBtn = new Node({
value:"Select",	style: {   t: '4px', l: '4px', w: 'auto', h: "calc(window(window.NavH)-8)",
	texttop:"calc( (window(window.NavH)-8)/4)", ov: 'hid', bg: "window(theme.buttons)", highlight:"window(theme.highlight)", color:"window(theme.textcolor)",float:"left" }
});
selectBtn.onClick=(e)=>{
selectBtn.active = !selectBtn.active;
selectBtn.style.bg=  !selectBtn.active ? "window(theme.buttons)":"window(theme.done)"
isSelecting = selectBtn.active;
if(!selectBtn.active){
	selectRect = null;
}
draw();
}
pianoRollNav.add(selectBtn);
volumeBtn = new Node({
value:"Volume",	style: {   t: '4px', l: '4px', w: 'auto', h: "calc(window(window.NavH)-8)",
	texttop:"calc( (window(window.NavH)-8)/4)",ov: 'hid', bg: "window(theme.buttons)", highlight:"window(theme.highlight)", color:"window(theme.textcolor)",float:"left" }
});
volumeBtn.onClick=(e)=>{
volumeBtn.active = !volumeBtn.active;
volumeBtn.style.bg=  !volumeBtn.active ? "window(theme.buttons)":"window(theme.done)"
draw();
}
pianoRollNav.add(volumeBtn);
removeBtnpr = new Node({
	value: "Remove",
	style: { t: '4px', l: '4px', w: 'auto', h: "calc(window(window.NavH)-8)",
	texttop:"calc( (window(window.NavH)-8)/4)",ov: 'hid', bg: "#555", highlight: "window(theme.highlight)", float: "left",opacity:0 }
});
duplicateBtn = new Node({
	value: "Clone",
	style: { t: '4px', l: '4px', w: 'auto', h: "calc(window(window.NavH)-8)",
	texttop:"calc( (window(window.NavH)-8)/4)",ov: 'hid', bg: "#555", highlight: "window(theme.highlight)", float: "left", opacity: 0 }
});
duplicateBtn.onClick = () => {
	const pattern = patterns[selectedPattern];
	if (!pattern || selectedNotes.size === 0) return;
	let minX = Infinity;
	let maxX = -Infinity;
	pattern.notes.forEach(n => {
		const key = n.x + ":" + n.y;
		if (selectedNotes.has(key)) {
			if (n.x < minX) minX = n.x;
			if (n.x > maxX) maxX = n.x;
		}
	});
	const selectionWidth = (maxX - minX) + 1;
	const barOffset = selectionWidth;
	const newSelected = new Set();
	const clones = [];
	pattern.notes.forEach(n => {
		const key = n.x + ":" + n.y;
		if (selectedNotes.has(key)) {
			const clone = {
				x: n.x + barOffset,
				y: n.y,
				w: n.w,
				v: n.v
			};
			clones.push(clone);
			newSelected.add(clone.x + ":" + clone.y);
		}
	});
	pattern.notes.push(...clones);
	selectedNotes = newSelected;
	selectBtn.active = false;
	selectBtn.style.bg = "window(theme.buttons)";
	isSelecting = false;
	selectRect = null;
	removeBtnpr.style.opacity = 0;
	copyBtn.style.opacity = 0;
	pasteBtn.style.opacity = 0;
	duplicateBtn.style.opacity = 0;
	draw();
};
removeBtnpr.onClick = (e) => {
	if (selectedNotes.size!==0) {
	const pattern = patterns[selectedPattern];
	selectBtn.active = false
selectBtn.style.bg = !selectBtn.active ? "window(theme.buttons)" : "window(theme.done)"
isSelecting = selectBtn.active;
if (!selectBtn.active) {
	selectRect = null;
}
	if (pattern) {
		pattern.notes = pattern.notes.filter(n =>
	!selectedNotes.has(n.x + ":" + n.y)
);
	}
	selectedNotes.clear();
	removeBtnpr.style.opacity = 0;
	duplicateBtn.style.opacity = 0;
	copyBtn.style.opacity = 0;
pasteBtn.style.opacity = 0;
	draw();
}
}
copyBtn = new Node({
    value: "Copy",
    style: { t: '4px', l: '4px', w: 'auto', h: "calc(window(window.NavH)-8)", bg: "#444", color: "white", float: "left", textleft: 10, texttop:"calc( (window(window.NavH)-8)/4)", ov: 'hid' }
});
copyBtn.onClick = () => {
    const pattern = patterns[selectedPattern];
    if (!pattern || selectedNotes.size === 0) return;
    let minX = Infinity;
    noteClipboard = [];
    pattern.notes.forEach(n => {
        if (selectedNotes.has(n.x + ":" + n.y)) {
        if (n.x < minX) minX = n.x;
        }
    });
    pattern.notes.forEach(n => {
        if (selectedNotes.has(n.x + ":" + n.y)) {
        noteClipboard.push({
        relX: n.x - minX,
        y: n.y,
        w: n.w,
        v: n.v
        });
        }
    });
    pasteBtn.style.opacity=1;
};
pasteBtn = new Node({
    value: "Paste",
    style: { t: '4px', l: '4px', w: 'auto', h: "calc(window(window.NavH)-8)", bg: "#444", color: "white", float: "left", textleft: 10, texttop:"calc( (window(window.NavH)-8)/4)", ov: 'hid', opacity:0 }
});
pasteBtn.onClick = () => {
    const pattern = patterns[selectedPattern];
    if (!pattern || noteClipboard.length === 0) return;
    const pasteX = Math.round(pScrollX / STEP_W);
    const newSelected = new Set();
    const pastedNotes = noteClipboard.map(cn => {
        const newNote = {
        x: pasteX + cn.relX,
        y: cn.y,
        w: cn.w,
        v: cn.v
        };
        newSelected.add(newNote.x + ":" + newNote.y);
        return newNote;
    });
    pattern.notes.push(...pastedNotes);
    selectedNotes = newSelected;
    pasteBtn.style.opacity = 0;
    draw();
};
;
pianoRollNav.add(removeBtnpr);
pianoRollNav.add(duplicateBtn)
pianoRollNav.add(copyBtn)
pianoRollNav.add(pasteBtn)
navbarDAW = new Node({
    style: { pos: 'abs', t: '0', l: '0', w: '100%', h: "calc(window(window.NavH))", ovx: 'hid',bg:"window(theme.boxcolor)" }
});
fileBtn = new Node({
value:"File",	style: {   t: '4px', l: '4px', w: 'auto', h: "calc(window(window.NavH)-8)", size: "calc( (window(window.NavH)-8)/2)", ovx:"...",
	texttop: "calc( (window(window.NavH)-8)/4)", ov: 'hid', bg:"window(theme.buttons)" , highlight:"window(theme.highlight)" , color:"window(theme.textcolor)"  , float:"left" }
});
fileBtn.onClick = (p) => {
	activeMenu = {
		type: "file",
		opts: ["Export As .OPS","Export As .MP3", "Export As .MID" ,"Import .OPS","Import .MID","+ New Blank Song"]
	};
	menuBox.scroll.y = 0;
	draw()
}
editBtn = new Node({
value:"Edit",	style: {   t: '4px', l: '4px', ovx:"...", w: 'auto', h: "calc(window(window.NavH)-8)", size: "calc( (window(window.NavH)-8)/2)", ovx:"...",
	texttop: "calc( (window(window.NavH)-8)/4)",ov: 'hid', bg:"window(theme.buttons)",highlight:"window(theme.highlight)", color:"window(theme.textcolor)"  , float:"left" }
});
editBtn.onClick = (p) => {
	activeMenu = {
		type: "settings",
		opts: ["Import Plugins To Song"]
	};
	menuBox.scroll.y = 0;
	draw()
}
optsBtn = new Node({
value:"Settings",	style: {   t: '4px', l: '4px', ovx:"...", w: 'auto', h: "calc(window(window.NavH)-8)", size: "calc( (window(window.NavH)-8)/2)", ovx:"...",
	texttop: "calc( (window(window.NavH)-8)/4)",ov: 'hid', bg:"window(theme.buttons)" , highlight:"window(theme.highlight)" , color:"window(theme.textcolor)" , float:"left" }
});
 scopeCanvas = new CanvasNode({
    style: {
        w: '220px',
        t: "0",
        h: "calc(window(window.NavH)*2)",
        size: "calc( (window(window.NavH)-8)/2)", ovx:"...",
        bg: theme.boxcolor,
        float: "left"
    },
    onDraw: (ctx, w, h) => {
        ctx.fillStyle = theme.boxcolor;
        ctx.fillRect(0, 0, w, h);
        analyserL.getByteTimeDomainData(dataArrayL);
        analyserR.getByteTimeDomainData(dataArrayR);
        const sliceWidth = w / dataArrayL.length;
        const centerY = h /4;
        const drawChannel = (data, color) => {
        ctx.strokeStyle = color;
        ctx.lineWidth = 1;
        ctx.beginPath();
        for (let i = 0; i < data.length; i++) {
        const v = data[i] / 128.0;
        const y = v * centerY;
        const x = i * sliceWidth;
        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
        }
        ctx.stroke();
        };
        ctx.globalAlpha = 0.8;
        drawChannel(dataArrayL, theme.chanL || "#00ffff");
        drawChannel(dataArrayR, theme.chanR || "#ff00ff");
        ctx.globalAlpha = 1.0;
        ctx.strokeStyle = "rgba(255,255,255,0.05)";
        ctx.beginPath();
        ctx.moveTo(0, centerY);
        ctx.lineTo(w, centerY);
        ctx.stroke();
    }
});
optsBtn.onClick=(p)=>{
	activeMenu = {
	type: "settings",
	opts: ["Themes","Options"]
};
menuBox.scroll.y = 0;
draw()
}
addBtn = new Node({
value:"+",	style: { textleft:"calc(window(window.trackW)/2.5)", texttop : "calc((window(window.NavH)/2)-12)", pos:"abs" , b: '0', l: '0', w: 'window(window.trackW)', h: "calc(window(window.NavH)-8)",
	 ov: 'hid', bg:"window(theme.buttons)", highlight:"window(theme.highlight)", color:"window(theme.textcolor)" , float:"left" }
});
bpmInput = new Node({
	type: "input",
	value: "155",
	placeholder: "BPM",
	onClick: (el, p) => {
		caretDisable = false
		activeEl = el;
		hI.value = el.value;
hI.style.width = '1px';
hI.style.height = '1px';
hI.style.opacity = '0.0';
hI.style.left = p.x + 'px';
hI.style.top = p.y + 'px';
hI.style.pointerEvents = 'auto';
activeInput = this
hI.focus();
		const caretIndex = getCaretFromClick(el, p.x);
		const len = getCaretFromClick(el, p.x);
		el.caret = len
		setTimeout(function() {
			hI.focus();
			hI.style.left = "-99999px";
			hI.setSelectionRange(len, len);
			caret = len;
		}, 10);
	},
	style: {
		t: '4px',
		l: '4px',
		w: '80px',
		h: "calc(window(window.NavH)-8)",
		size: "calc( (window(window.NavH)-8)/2)", ovx:"...",
	texttop: "calc( (window(window.NavH)-8)/4)",
		bg: "window(theme.pianoRollAndInputsBg)",
		highlight: "window(theme.highlight)",
		color: "window(theme.textcolor)",
		float: "left"
	}
});
playBtn = new Node({
    value: "PLAY",
    style: { t:'4px', l:'4px', w:'auto', h: "calc(window(window.NavH)-8)",
    size: "calc( (window(window.NavH)-8)/2)", ovx:"...",
	texttop: "calc( (window(window.NavH)-8)/4)", bg:"window(theme.done)" ,highlight:"window(theme.highlight)" ,float:"left" , color:"window(theme.playbtnColor)" }
});
ToStartBtn = new Node({
    value: "<",
    style: { t:'4px', l:'4px', w:'auto', h: "calc(window(window.NavH)-8)",
    size: "calc( (window(window.NavH)-8)/2)", ovx:"...",
	texttop: "calc( (window(window.NavH)-8)/4)", bg:"window(theme.buttons)", highlight:"window(theme.highlight)", color:"window(theme.textcolor)" ,float:"left" }
});
bottomNav = new Node({
 style: { pos: 'abs', b: '0', l: '0', w: '100%', h: "calc(window(window.NavH)-8)",
	texttop: "calc( (window(window.NavH)-8)/4)", ov: 'hid', bg:"window(theme.boxcolor)" }
});
playBtn.onClick = async () => {
    validateBPM();
    enableTempoScroll(false);
    stopAllSynths();
    if (isPlaying) {
     bufferLoaded = false;
     renderAbort = true
        stopAllSynths();
        proxyCache.clear();
        isPlaying = false;
        playBtn.value = "PLAY";
        return;
    }
    bufferLoaded = false;
    playBtn.value = "...";
    root.update(0, 0, window.innerWidth, window.innerHeight);
    root.draw();
    setTimeout(async function() {
        isPlaying = true;
        try {
        if (audioCtx.state === "suspended") {
        await audioCtx.resume();
        }
        const startStep = dawScrollX / (4 * dawZoomX);
        if (settings.buildMusicBeforePlay == 1) {
        isLoading=true
        renderAbort = false
        const bufferPromise = renderSongBuffer(startStep);
        bufferPromise.then(buffer => {
        if (!isPlaying) return;
        bufferLoaded = true;
        lastFrameTime = performance.now();
        const src = audioCtx.createBufferSource();
        const gainNode = audioCtx.createGain();
        gainNode.connect(analyser);
        src.buffer = buffer;
        gainNode.gain.value = settings.songVolume ?? 1;
        src.connect(gainNode);
        src.start();
        currentBufferSource = src;
        playheadStep = startStep;
        playBtn.value = "STOP";
        src.onended = () => {
        if (!isPlaying) return;
        isPlaying = false;
        isLoading= false
        bufferLoaded = false;
        playBtn.value = "PLAY";
        playBtn.disabled = false;
        enableTempoScroll(true);
        };
        });
        playBtn.value = "STOP";
        if(bufferLoaded == false){
        playBtn.value = "...";
        }
        return;
        }
        for (const track of tracks) {
        for (const patInfo of track.patterns) {
        const pattern = patterns[patInfo[2]];
        if (!pattern) continue;
        if(pattern.type!=="mod"){
        for (const note of pattern.notes) {
        note.played = false;
        }
        }
        }
        }
        lastFrameTime = performance.now();
        playheadStep = startStep;
        playBtn.value = "STOP";
        bufferLoaded = false;
        isLoading=false
        enableTempoScroll(true);
        }
        catch (e) {
        console.error(e);
        isPlaying = false;
        isLoading=false
        }
    }, 20);
}
ToStartBtn.onClick = () => {
	if(isPlaying)return;
    dawScrollX=0
};
addBtn.onClick=()=>{tracks.push({ name: 'CH ' + (tracks.length + 1), muted: false, patterns: [], color: rgbFromHue(((tracks.length + 190) * 60) % 360),instrument: "none",instance:0 });}
root.add(bottomNav);
root.add(addBtn);
navbarDAW.add(fileBtn);
navbarDAW.add(editBtn);
navbarDAW.add(optsBtn);
navbarDAW.add(bpmInput);
navbarDAW.add(playBtn);
navbarDAW.add(ToStartBtn);
navbarDAW.add(scopeCanvas)
root.add(navbarDAW);
root.add(pianoRollNav);
root.add(renameBox);
instrumentPickBoxBg = new Node({ style: { pos: "abs", t: "0", l: "0", w: '100vw', h: '100vh', bg: "#000", opacity: 0 } });
instrumentPickBox = new Node({ style: { pos: "abs", t: "5vh", l: "5vw", w: '90vw', h: '90vh', bg: "window(theme.boxcolor)", opacity: 1, ovy: "hid scroll" } });
instrumentPickBoxBg.add(instrumentPickBox)
root.add(instrumentPickBoxBg);
instrumentPickBoxBg.onClick=()=>{
	instrumentPickBoxBg.style.opacity=0;
}
instrumentBox = new Node({ style: { pos: "abs", t: "0", l: "0", w: '100vw', h: '100vh', bg: "#000", opacity: 0.5 } });
instrumentInside = new Node({ style: { pos: "abs", t: "40px", l: "0", w: '100vw', h: 'calc(100vh - 40px)', bg: "#000", opacity: 0.5 } });
instrumentBox.style.opacity=0
instrumentNav = new Node({ value: "Instrument", style: { pos: "abs", t: "0", l: "0", w: '100vw', h: '40px', bg: "window(theme.boxcolor)", color:"window(theme.textcolor)", opacity: 1 } })
instrumentVersion = new Node({ value: "0.0", style: {  l:"0", textleft:"0", t:"15px", w: '100vw', h: '40px',  color:"window(theme.textcolor)", opacity: 0.2 } })
instrumentPaste = new Node({ value: "PASTE", style: { pos: "abs", t: "5px", texttop:5, r: 120, w: 'auto', h: '30px', bg: "window(theme.tracksBg)", color:"window(theme.textcolor)", opacity: 1 } });instrumentNav.add(instrumentPaste)
instrumentCopy = new Node({ value: "COPY", style: { pos: "abs", t: "5px", texttop:5, r: 55, w: 'auto', h: '30px', bg: "window(theme.tracksBg)", opacity: 1 , color:"window(theme.textcolor)"} });instrumentNav.add(instrumentCopy)
instrumentCopy.onClick = () => {
    if (!currentOpenedProxy) return;
    const isFx = instrumentNav.value.startsWith("Effect");
    const manager = isFx ? FXManager : InstrumentManager;
    pluginClipboard = manager.copyState(currentOpenedProxy);
    instrumentCopy.style.bg = "#44aa44";
    setTimeout(() => instrumentCopy.style.bg = "window(theme.tracksBg)", 300);
    draw();
};
instrumentPaste.onClick = () => {
    if (!pluginClipboard || !currentOpenedProxy) return;
    const isFx = instrumentNav.value.startsWith("Effect");
    const manager = isFx ? FXManager : InstrumentManager;
    manager.pasteState(currentOpenedProxy, pluginClipboard, instrumentInside);
    instrumentPaste.style.bg = "#44aa44";
    if(lastData.length>2){
    openEffectUI(lastData[0], lastData[1], lastData[2]);
    }else{
    	openInstrumentUI(lastData[0], lastData[1]);
    }
    setTimeout(() => instrumentPaste.style.bg = "window(theme.tracksBg)", 300);
    draw();
};
instrumentOk = new Node({ value: "OK", style: { pos: "abs", t: "5px", texttop:5, r: 5, w: 'auto', h: '30px', bg: "window(theme.done)", opacity: 1 } });instrumentNav.add(instrumentOk)
instrumentOk.onClick=()=>{
	instrumentBox.style.opacity=0
	if (selectedPattern != null) {
	setTimeout(function (){patterns[selectedPattern].playingMidi = patterns[selectedPattern].playingMidi || new Set();
        patterns[selectedPattern].playingMidi.clear();
	playNote(60, 0.5, patterns[selectedPattern].instrument, selectedPattern,lastVolume,true);
	},20);
}
}
instrumentBox.add(instrumentInside)
instrumentNav.add(instrumentVersion)
instrumentBox.add(instrumentNav)
root.add(instrumentBox);
colorPickerBox = new Node({ style: {pos:"abs", t:"0",l:"0",  w: '100vw', h: '100vh', bg :"#000", opacity :0.5} });
colorPickerBox.style.opacity=0
colorPickerMenu = new Node({ style: {pos:"abs", t:"5vh",l:"5vw",  w: '90vw', h: '90vh', bg :"#444", opacity :1} });
let hue = 0;
let selectedColor = '#ff0000';
function hsvToRgb(h, s, v) {
	let f = (n, k = (n + h / 60) % 6) => v - v * s * Math.max(Math.min(k, 4 - k, 1), 0);
	return `rgb(${Math.round(f(5) * 255)}, ${Math.round(f(3) * 255)}, ${Math.round(f(1) * 255)})`;
}
const colorCanvas = new CanvasNode({
	style: { t: '5%', l: 'calc(50%-150)', w: '300px', h: '300px', bg: '#fff', border: 2, borderColor: '#444' },
	onDraw: (ctx, w, h) => {
		if(colorPickerBox.opacity==0)return;
		const size = 5;
		ctx.lineWidth = 0;
		for (let y = 0; y < h; y += size) {
			for (let x = 0; x < w; x += size) {
				const sx = x / w;
				const sy = y / h;
				const color = hsvToRgb(hue, sx, 1 - sy);
				ctx.fillStyle = getPatternColorByAlgorithm(color);
				ctx.fillRect(x, y, size+0.5, size+0.5);
			}
		}
		ctx.beginPath();
		ctx.strokeStyle = '#fff';
		ctx.lineWidth = 2;
		ctx.arc(selX, selY, 5, 0, Math.PI * 2);
		ctx.stroke();
	}
});
let selX = 0,
	selY = 0;
let draggingColor = false;
colorCanvas.onClick = (el) => {
	draggingColor = true;
};
c.addEventListener('pointerdown', e => {
	const target = root.findTarget(e.clientX, e.clientY);
	if (target === colorCanvas) draggingColor = true;
});c.addEventListener('pointermove', e => {
	if (!draggingColor) return;
	const rect = c.getBoundingClientRect();
	selX = Math.max(0, Math.min(colorCanvas.box.w, e.clientX - colorCanvas.box.x));
	selY = Math.max(0, Math.min(colorCanvas.box.h, e.clientY - colorCanvas.box.y));
 sLT = selX / colorCanvas.box.w;
 vLT = 1 - selY / colorCanvas.box.h;
	selectedColor = hsvToRgb(hue, sLT, vLT);
});c.addEventListener('pointerup', e => draggingColor = false);
const hueSlider = new Slider({
	style: { pos: '', t: '5%', l: 'calc(50%-150)', w: '300px', h: '20px', bg:"window(theme.tracksBg)" , thumb: { w: 10, h: 20, bg: '#fff', rad: 5 } },
	min: 0,
	max: 360,
	value: hue,
	step:1,
	onInput: (val) => {
		hue = val;
		selectedColor = hsvToRgb(hue, sLT, vLT);
	}
});
doneColor = new Node({ value: "DONE", style: { pos:"abs", b:"0px", r: "0%", w: 'auto', h: '40px', bg: "#2a2",color:"window(theme.textcolor)", float:"top"} });
doneColor.onClick = () => {
    if (colorPickerBox.currentTrack) {
        colorPickerBox.currentTrack.color = selectedColor;
    }
    colorPickerBox.style.opacity = 0;
    draw();
}
colorPickerMenu.add(colorCanvas);
colorPickerMenu.add(hueSlider);
colorPickerMenu.add(doneColor);
colorPickerBox.add(colorPickerMenu);root.add(colorPickerBox);
    setupEventListeners();
    hI.oninput = (e) => {  if (activeEl) {activeEl.caret = e.target.selectionStart;; activeEl.value = e.target.value;
				render(); }
				if (activeEl&&activeEl.onInput) {
					activeEl.onInput(activeEl);
				}
    	let val = parseInt(bpmInput.value);
if ((isNaN(val) || val < 0 )) {
	BPM = 155;
	bpmInput.value = "155";
} else {
	BPM = val;
}
    };
				hI.onblur = () => {
    let val = parseInt(bpmInput.value);
    if (isNaN(val) || val < 0) {
        BPM = 155;
        bpmInput.value = "155";
    } else {
        BPM = val;
    }
};
exportBg = new Node({
	style: {
		pos: "abs",
		t: "0",
		l: "0",
		w: "100vw",
		h: "100vh",
		bg: "#000",
		ov: "hid",
		opacity: 0.0
	}
});
exportContainer = new Node({
	style: {
		pos: "abs",
		t: "5vh",
		l: "5vw",
		w: "90vw",
		h: "90vh",
		bg: "window(theme.boxcolor)",
		ov: "hid",
		opacity: 1
	}
});
 exportLabel = new Node({
	value:"Exporting MP3 Please Be Patient ...",
	style: {
		t: "calc(50% - 20px)",
		l: "25%",
		w: "50%",
		h: "10px",
		color: "window(theme.textcolor)"
	}
});
let exportProgressBar = new Node({
	style: {
		t: "50%",
		l: "25%",
		w: "50%",
		h: "10px",
		bg: "window(theme.editorBg)"
	}
});
exportProgress = new Node({
	style: {
		t: "0px",
		l: "0%",
		w: "0%",
		h: "10px",
		bg: "window(theme.done)"
	}
});
exportProgressBar.add(exportProgress)
const exportCancel = new Node({
	value: "Cancel",
	style: {
		pos:"abs",
		t: "calc(90vh - 34px)",
		l: "calc(90vw - 72px)",
		w: "70px",
		h: "32px",
		bg: "window(theme.editorBg)",
		color: "window(theme.textcolor)"
	}
});
exportCancel.onClick = () => {
	renderAbort = true;
	exportBg.style.opacity = 0;
};
exportBg.add(exportContainer);
exportContainer.add(exportLabel)
exportContainer.add(exportProgressBar);
exportContainer.add(exportCancel);
root.add(exportBg);
root.add(menuBoxBg);
    requestAnimationFrame(function loop() {
        render();
        requestAnimationFrame(loop);
    });
}
let deltaSec
let bufferLoaded=false
function render() {
	document.title = "OPS VERSION:"+VERSION;
	 ctx.clearRect(0, 0, W, H);
if ((isSelecting || pMode === "move"|| pMode === "resize" ) && !isPlaying) {
	const margin = 30;
	if (lastPRY < margin && lastPRY!==null ) {
		pScrollY = Math.max(0, pScrollY - 8);
	}if (lastPRY > H - margin && lastPRY!==null ) {
		pScrollY += 8;
	}if (lastPRX < margin && lastPRX!==null ) {
		pScrollX = Math.max(0, pScrollX - 8);
	}if (lastPRX > W - margin && lastPRX!==null ) {
		pScrollX += 8;
	}	pScrollY = Math.max(0, Math.min(pScrollY, KEYS * NOTE_H - H + 80));
	draw();
}else if ((pMode === "resizePattern"||pMode === "movePattern") && !isPlaying ) {
 const margin = 40;
 if (lastPRX != null) {
  if (lastPRX < margin) dawScrollX = Math.max(0, dawScrollX - 8);
  if (lastPRX > W - margin) dawScrollX += 4;
 }
 if (lastPRY != null) {
  if (lastPRY < margin) dawScrollY = Math.max(0, dawScrollY - 8);
  if (lastPRY > H - margin) dawScrollY += 4;
 }
 let totalHeight = tracks.length * (dawZoomY + 9);
 dawScrollY = clamp(dawScrollY, 0, Math.max(0, totalHeight - H / 2));
 draw();
}
	const now = performance.now();
 deltaSec = (now - lastFrameTime) / 1000;
	lastFrameTime = now;
	globalOpacityForPatterBg=isPlaying || settings.cleanPatterns
	if (isPlaying && anabledScroll) {
		const beatsPerSec = BPM / 60;
		const stepsPerBeat = STEPS_PER_BAR / 4;
		const stepsPerSec = beatsPerSec * stepsPerBeat;
		dawScrollX += deltaSec * stepsPerSec * 4 * dawZoomX;
		updatePlayback(deltaSec);
		if (dawScrollX / (4 * dawZoomX) >= TOTAL_STEPS) {
			dawScrollX = 0;
			for (const track of tracks) {
				for (const pattern of track.patterns) {
					for (const note of pattern.notes) note.played = false;
				}
			}
		}
	}
if (isPlaying && bufferLoaded == true) {
const beatsPerSec = BPM / 60;
const stepsPerBeat = STEPS_PER_BAR / 4;
const stepsPerSec = beatsPerSec * stepsPerBeat;
dawScrollX += deltaSec * stepsPerSec * 4 * dawZoomX;
updatePlayback(deltaSec);
if (dawScrollX / (4 * dawZoomX) >= TOTAL_STEPS) {
	dawScrollX = 0;
	for (const track of tracks) {
		for (const pattern of track.patterns) {
			for (const note of pattern.notes) note.played = false;
		}
	}
}
}
W = innerWidth;
H = innerHeight;
dpr = settings.dpi*2
if (c.width !== window.innerWidth * dpr) {
	c.width = window.innerWidth * dpr;
	c.height = window.innerHeight * dpr;
	ctx.scale(dpr, dpr);
}
function resizeNavButtons() {
	const buttons = [fileBtn, editBtn, optsBtn, bpmInput, playBtn];
	const scope = scopeCanvas;
	const toStart = ToStartBtn;
	const margin = 6;
	const flex = {
		normal: 1,
		toStart: 0.5,
		scope: 2
	};
	const totalFlex = (buttons.length * flex.normal) + flex.toStart + flex.scope;
	const available = W - margin * (buttons.length + 2);
	const unit = available / totalFlex;
	let x = margin;
	buttons.forEach(b => {
		b.style.pos = "abs";
		b.style.l = x + "px";
		b.style.w = unit * flex.normal + "px";
		x += unit * flex.normal + margin;
	});
	toStart.style.pos = "abs";
	toStart.style.l = x + "px";
	toStart.style.w = unit * flex.toStart + "px";
	x += unit * flex.toStart + margin;
	scope.style.pos = "abs";
	scope.style.l = x + "px";
	scope.style.w = unit * flex.scope + "px";
	resizePRNavButtons()
}
function resizePRNavButtons() {
    const prButtons = [
        backbtn,
        rythmselectBtn,
        selectBtn,
        volumeBtn,
        removeBtnpr,
        duplicateBtn,
        copyBtn,
        pasteBtn
    ];
    const margin = 6;
    const visibleButtons = prButtons;
    const availableWidth = W - (margin * (visibleButtons.length + 1));
    const buttonWidth = availableWidth / visibleButtons.length;
    let currentX = margin;
    visibleButtons.forEach(btn => {
        btn.style.pos = "abs";
        btn.style.l = currentX + "px";
        btn.style.textleft = 3 + "px";
        btn.style.w = buttonWidth + "px";
        currentX += buttonWidth + margin;
    });
}
if(view=="DAW"){
 resizeNavButtons()
	navbarDAW.style.opacity=1
}else{
	resizeNavButtons()
	navbarDAW.style.opacity=0
}
c.width = W * dpr;
c.height = H * dpr;
ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
ctx.fillStyle = theme.editorBg
ctx.fillRect(0, 0, innerWidth, innerHeight)
ctx.imageSmoothingEnabled = false;
draw()
root.update(0, 0, window.innerWidth, window.innerHeight);
root.draw();
if (theme.pixelate && theme.pixelate > 1) {
	const px = theme.pixelate;
	const temp = document.createElement("canvas");
	temp.width = Math.floor(c.width / px);
	temp.height = Math.floor(c.height / px);
	const tctx = temp.getContext("2d");
	tctx.imageSmoothingEnabled = false;
	tctx.drawImage(c, 0, 0, temp.width/dpr, temp.height/dpr);
	ctx.save();
	ctx.imageSmoothingEnabled = false;
	ctx.drawImage(temp, 0, 0, c.width, c.height);
	ctx.restore();
}
copyBtn.style.opacity = selectedNotes.size>0? 1:0;
}
window.onload = ()=>{init();render();}
async function unlockAudioOnce() {
	await unlockAudio();
	document.removeEventListener('click', unlockAudioOnce);
}
document.addEventListener('click', unlockAudioOnce);
document.body.onkeydown = function(e) {
    if (activeInput == null  ) {
        if (e.key === " " || e.code === "Space" || e.keyCode === 32) {
        e.preventDefault();
        if(view == "PianoRoll"){
        view = "DAW";
        }else{
        playBtn.onClick();
        }
        }
        if (e.key === "Backspace" || e.keyCode === 8 || e.key === "z" || e.key === "Z") {
        e.preventDefault();
        ToStartBtn.onClick();
        }
    }
};