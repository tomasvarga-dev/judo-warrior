import { useState, useEffect, useRef, useCallback } from "react";

// ===== AUDIO ENGINE =====
const AudioCtx = typeof window !== "undefined" ? (window.AudioContext || window.webkitAudioContext) : null;
let audioCtx = null;

function getAudioCtx() {
  if (!audioCtx && AudioCtx) {
    audioCtx = new AudioCtx();
  }
  return audioCtx;
}

function playBeep(freq = 880, duration = 0.12, vol = 0.3) {
  try {
    const ctx = getAudioCtx();
    if (!ctx) return;
    if (ctx.state === "suspended") ctx.resume();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = "sine";
    osc.frequency.value = freq;
    gain.gain.setValueAtTime(vol, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(ctx.currentTime);
    osc.stop(ctx.currentTime + duration);
  } catch (e) {}
}

function playCountdownBeep() { playBeep(660, 0.08, 0.25); }
function playGoBeep() {
  playBeep(1100, 0.15, 0.4);
  setTimeout(() => playBeep(1400, 0.2, 0.4), 160);
}
function playDoneBeep() {
  playBeep(880, 0.12, 0.35);
  setTimeout(() => playBeep(1100, 0.12, 0.35), 140);
  setTimeout(() => playBeep(1400, 0.25, 0.45), 280);
}
function playRestBeep() { playBeep(440, 0.15, 0.2); }

// ===== BELT RANKS (full list) =====
const BELT_RANKS = [
  { name: "Biely opasok", colors: ["#FFFFFF", "#FFFFFF"], xp: 0 },
  { name: "Bielo-žltý opasok", colors: ["#FFFFFF", "#FFD700"], xp: 100 },
  { name: "Žltý opasok", colors: ["#FFD700", "#FFD700"], xp: 250 },
  { name: "Žlto-oranžový opasok", colors: ["#FFD700", "#FF8C00"], xp: 450 },
  { name: "Oranžový opasok", colors: ["#FF8C00", "#FF8C00"], xp: 700 },
  { name: "Oranžovo-zelený opasok", colors: ["#FF8C00", "#4CAF50"], xp: 1000 },
  { name: "Zelený opasok", colors: ["#4CAF50", "#4CAF50"], xp: 1400 },
  { name: "Zeleno-modrý opasok", colors: ["#4CAF50", "#2196F3"], xp: 1850 },
  { name: "Modrý opasok", colors: ["#2196F3", "#2196F3"], xp: 2400 },
  { name: "Modro-hnedý opasok", colors: ["#2196F3", "#8D6E63"], xp: 3000 },
  { name: "Hnedý opasok", colors: ["#8D6E63", "#8D6E63"], xp: 3700 },
  { name: "Hnedo-čierny opasok", colors: ["#8D6E63", "#212121"], xp: 4500 },
  { name: "Čierny opasok", colors: ["#212121", "#212121"], xp: 5500 },
];

// ===== EXERCISE DEMOS =====
function ExerciseDemo({ exerciseId, isRunning }) {
  const dur = "1.2s";
  const color = "#FFE082";
  const glow = "#FF8C00";
  const stroke = 3.5;
  const common = { stroke: color, strokeWidth: stroke, strokeLinecap: "round", fill: "none" };
  const head = { cx: 50, r: 7, fill: "none", stroke: color, strokeWidth: stroke };

  const demos = {
    run: (
      <svg viewBox="0 0 100 100" width="150" height="150">
        <circle {...head} cy="20"><animate attributeName="cy" values="20;18;20" dur={dur} repeatCount="indefinite" /></circle>
        <line x1="50" y1="27" x2="50" y2="55" {...common}><animate attributeName="y1" values="27;25;27" dur={dur} repeatCount="indefinite" /><animate attributeName="y2" values="55;53;55" dur={dur} repeatCount="indefinite" /></line>
        <polyline points="50,35 38,45 32,38" {...common}><animate attributeName="points" values="50,35 38,45 32,38;50,33 58,43 62,36;50,35 38,45 32,38" dur={dur} repeatCount="indefinite" /></polyline>
        <polyline points="50,35 62,45 68,38" {...common}><animate attributeName="points" values="50,35 62,45 68,38;50,33 38,43 32,36;50,35 62,45 68,38" dur={dur} repeatCount="indefinite" /></polyline>
        <polyline points="50,55 40,70 42,85" {...common}><animate attributeName="points" values="50,55 40,70 42,85;50,53 38,55 35,65;50,55 40,70 42,85" dur={dur} repeatCount="indefinite" /></polyline>
        <polyline points="50,55 60,70 58,85" {...common}><animate attributeName="points" values="50,55 60,70 58,85;50,53 62,72 65,85;50,55 60,70 58,85" dur={dur} repeatCount="indefinite" /></polyline>
        <text x="50" y="98" textAnchor="middle" fill="#aaa" fontSize="7" fontFamily="Fredoka">Kolená vysoko!</text>
      </svg>
    ),
    jumpingjacks: (
      <svg viewBox="0 0 100 100" width="150" height="150">
        <circle {...head} cy="18"><animate attributeName="cy" values="18;14;18" dur={dur} repeatCount="indefinite" /></circle>
        <line x1="50" y1="25" x2="50" y2="55" {...common}><animate attributeName="y1" values="25;21;25" dur={dur} repeatCount="indefinite" /><animate attributeName="y2" values="55;51;55" dur={dur} repeatCount="indefinite" /></line>
        <line x1="50" y1="33" x2="35" y2="48" {...common}><animate attributeName="x2" values="35;25;35" dur={dur} repeatCount="indefinite" /><animate attributeName="y2" values="48;18;48" dur={dur} repeatCount="indefinite" /></line>
        <line x1="50" y1="33" x2="65" y2="48" {...common}><animate attributeName="x2" values="65;75;65" dur={dur} repeatCount="indefinite" /><animate attributeName="y2" values="48;18;48" dur={dur} repeatCount="indefinite" /></line>
        <line x1="50" y1="55" x2="42" y2="80" {...common}><animate attributeName="x2" values="42;28;42" dur={dur} repeatCount="indefinite" /></line>
        <line x1="50" y1="55" x2="58" y2="80" {...common}><animate attributeName="x2" values="58;72;58" dur={dur} repeatCount="indefinite" /></line>
        <text x="50" y="98" textAnchor="middle" fill="#aaa" fontSize="7" fontFamily="Fredoka">Ruky hore + nohy do strany!</text>
      </svg>
    ),
    pushup: (
      <svg viewBox="0 0 120 80" width="170" height="113">
        <circle cx="90" cy="22" r="7" {...common}><animate attributeName="cy" values="22;30;22" dur={dur} repeatCount="indefinite" /></circle>
        <line x1="83" y1="25" x2="35" y2="35" {...common}><animate attributeName="y1" values="25;33;25" dur={dur} repeatCount="indefinite" /><animate attributeName="y2" values="35;43;35" dur={dur} repeatCount="indefinite" /></line>
        <polyline points="78,28 78,50 78,50" {...common}><animate attributeName="points" values="78,28 78,50 78,50;78,36 78,50 78,50;78,28 78,50 78,50" dur={dur} repeatCount="indefinite" /></polyline>
        <line x1="35" y1="35" x2="20" y2="50" {...common}><animate attributeName="y1" values="35;43;35" dur={dur} repeatCount="indefinite" /></line>
        <circle cx="20" cy="50" r="2.5" fill={color} />
        <text x="55" y="70" textAnchor="middle" fill="#aaa" fontSize="7" fontFamily="Fredoka">Telo rovno! Dole a hore.</text>
      </svg>
    ),
    squat: (
      <svg viewBox="0 0 100 100" width="150" height="150">
        <circle {...head} cy="18"><animate attributeName="cy" values="18;32;18" dur={dur} repeatCount="indefinite" /></circle>
        <line x1="50" y1="25" x2="50" y2="52" {...common}><animate attributeName="y1" values="25;39;25" dur={dur} repeatCount="indefinite" /><animate attributeName="y2" values="52;58;52" dur={dur} repeatCount="indefinite" /></line>
        <line x1="50" y1="32" x2="35" y2="40" {...common}><animate attributeName="y1" values="32;44;32" dur={dur} repeatCount="indefinite" /><animate attributeName="x2" values="35;28;35" dur={dur} repeatCount="indefinite" /><animate attributeName="y2" values="40;44;40" dur={dur} repeatCount="indefinite" /></line>
        <line x1="50" y1="32" x2="65" y2="40" {...common}><animate attributeName="y1" values="32;44;32" dur={dur} repeatCount="indefinite" /><animate attributeName="x2" values="65;72;65" dur={dur} repeatCount="indefinite" /><animate attributeName="y2" values="40;44;40" dur={dur} repeatCount="indefinite" /></line>
        <polyline points="50,52 42,68 40,82" {...common}><animate attributeName="points" values="50,52 42,68 40,82;50,58 35,68 32,82;50,52 42,68 40,82" dur={dur} repeatCount="indefinite" /></polyline>
        <polyline points="50,52 58,68 60,82" {...common}><animate attributeName="points" values="50,52 58,68 60,82;50,58 65,68 68,82;50,52 58,68 60,82" dur={dur} repeatCount="indefinite" /></polyline>
        <text x="50" y="98" textAnchor="middle" fill="#aaa" fontSize="7" fontFamily="Fredoka">Zadok dozadu, kolená nad prstami!</text>
      </svg>
    ),
    plank: (
      <svg viewBox="0 0 120 70" width="170" height="100">
        <circle cx="92" cy="22" r="7" {...common}><animate attributeName="cy" values="22;21;23;22" dur="2s" repeatCount="indefinite" /></circle>
        <line x1="85" y1="26" x2="30" y2="32" {...common}><animate attributeName="y2" values="32;31;33;32" dur="2s" repeatCount="indefinite" /></line>
        <polyline points="78,28 78,42 85,42" {...common} />
        <line x1="30" y1="32" x2="18" y2="42" {...common}><animate attributeName="y1" values="32;31;33;32" dur="2s" repeatCount="indefinite" /></line>
        <circle cx="18" cy="42" r="2.5" fill={color} />
        <line x1="55" y1="18" x2="55" y2="13" stroke="#EF535060" strokeWidth="1.5"><animate attributeName="opacity" values="0;1;0" dur="0.8s" repeatCount="indefinite" /></line>
        <line x1="60" y1="16" x2="62" y2="11" stroke="#EF535060" strokeWidth="1.5"><animate attributeName="opacity" values="0;1;0" dur="1s" repeatCount="indefinite" begin="0.3s" /></line>
        <text x="55" y="60" textAnchor="middle" fill="#aaa" fontSize="7" fontFamily="Fredoka">Drž rovno! Nepadni!</text>
      </svg>
    ),
    taisabaki: (
      <svg viewBox="0 0 100 100" width="150" height="150">
        <g opacity="0.15">
          <circle cx="40" cy="22" r="7" stroke={color} strokeWidth={stroke} fill="none" />
          <line x1="40" y1="29" x2="40" y2="55" stroke={color} strokeWidth={stroke} />
          <line x1="40" y1="36" x2="28" y2="46" stroke={color} strokeWidth={stroke} />
          <line x1="40" y1="36" x2="52" y2="46" stroke={color} strokeWidth={stroke} />
          <line x1="40" y1="55" x2="33" y2="78" stroke={color} strokeWidth={stroke} />
          <line x1="40" y1="55" x2="47" y2="78" stroke={color} strokeWidth={stroke} />
        </g>
        <g><animateTransform attributeName="transform" type="translate" values="0,0;20,0;0,0" dur="2s" repeatCount="indefinite" />
          <circle cx="40" cy="22" r="7" {...common} /><line x1="40" y1="29" x2="40" y2="55" {...common} />
          <line x1="40" y1="36" x2="28" y2="46" {...common} /><line x1="40" y1="36" x2="52" y2="46" {...common} />
          <line x1="40" y1="55" x2="33" y2="78" {...common} /><line x1="40" y1="55" x2="47" y2="78" {...common} />
        </g>
        <path d="M 55,50 Q 65,40 60,30" fill="none" stroke="#64B5F6" strokeWidth="1.5" strokeDasharray="3,2"><animate attributeName="opacity" values="0.3;1;0.3" dur="2s" repeatCount="indefinite" /></path>
        <polygon points="59,28 63,33 56,32" fill="#64B5F6"><animate attributeName="opacity" values="0.3;1;0.3" dur="2s" repeatCount="indefinite" /></polygon>
        <text x="50" y="96" textAnchor="middle" fill="#aaa" fontSize="7" fontFamily="Fredoka">Otoč telo na jednej nohe!</text>
      </svg>
    ),
    mountainclimber: (
      <svg viewBox="0 0 120 80" width="170" height="113">
        <circle cx="92" cy="20" r="7" {...common}><animate attributeName="cy" values="20;22;20" dur={dur} repeatCount="indefinite" /></circle>
        <line x1="85" y1="25" x2="45" y2="42" {...common}><animate attributeName="y1" values="25;27;25" dur={dur} repeatCount="indefinite" /></line>
        <line x1="85" y1="28" x2="85" y2="50" {...common} />
        <polyline points="45,42 55,52 50,52" {...common}><animate attributeName="points" values="45,42 55,52 50,52;45,42 70,35 75,42;45,42 55,52 50,52" dur={dur} repeatCount="indefinite" /></polyline>
        <polyline points="45,42 70,37 75,44" {...common}><animate attributeName="points" values="45,42 70,37 75,44;45,42 55,52 50,52;45,42 70,37 75,44" dur={dur} repeatCount="indefinite" /></polyline>
        <text x="55" y="70" textAnchor="middle" fill="#aaa" fontSize="7" fontFamily="Fredoka">Striedaj nohy rýchlo!</text>
      </svg>
    ),
    jumpup: (
      <svg viewBox="0 0 100 100" width="150" height="150">
        <circle {...head} cy="22"><animate attributeName="cy" values="22;10;22" dur={dur} repeatCount="indefinite" /></circle>
        <line x1="50" y1="29" x2="50" y2="55" {...common}><animate attributeName="y1" values="29;17;29" dur={dur} repeatCount="indefinite" /><animate attributeName="y2" values="55;43;55" dur={dur} repeatCount="indefinite" /></line>
        <line x1="50" y1="35" x2="35" y2="45" {...common}><animate attributeName="y1" values="35;23;35" dur={dur} repeatCount="indefinite" /><animate attributeName="x2" values="35;30;35" dur={dur} repeatCount="indefinite" /><animate attributeName="y2" values="45;12;45" dur={dur} repeatCount="indefinite" /></line>
        <line x1="50" y1="35" x2="65" y2="45" {...common}><animate attributeName="y1" values="35;23;35" dur={dur} repeatCount="indefinite" /><animate attributeName="x2" values="65;70;65" dur={dur} repeatCount="indefinite" /><animate attributeName="y2" values="45;12;45" dur={dur} repeatCount="indefinite" /></line>
        <polyline points="50,55 43,70 42,82" {...common}><animate attributeName="points" values="50,55 43,70 42,82;50,43 42,55 40,65;50,55 43,70 42,82" dur={dur} repeatCount="indefinite" /></polyline>
        <polyline points="50,55 57,70 58,82" {...common}><animate attributeName="points" values="50,55 57,70 58,82;50,43 58,55 60,65;50,55 57,70 58,82" dur={dur} repeatCount="indefinite" /></polyline>
        <text x="50" y="98" textAnchor="middle" fill="#aaa" fontSize="7" fontFamily="Fredoka">Vyskoč čo najvyššie!</text>
      </svg>
    ),
    superman: (
      <svg viewBox="0 0 120 70" width="170" height="100">
        <circle cx="85" cy="28" r="6" {...common}><animate attributeName="cy" values="28;24;28" dur="1.5s" repeatCount="indefinite" /></circle>
        <line x1="80" y1="30" x2="35" y2="34" {...common} />
        <line x1="80" y1="32" x2="98" y2="28" {...common}><animate attributeName="y2" values="28;20;28" dur="1.5s" repeatCount="indefinite" /></line>
        <line x1="35" y1="34" x2="18" y2="32" {...common}><animate attributeName="y2" values="32;24;32" dur="1.5s" repeatCount="indefinite" /></line>
        <line x1="95" y1="18" x2="95" y2="12" stroke="#FFD70060" strokeWidth="1.5"><animate attributeName="opacity" values="0;1;0" dur="1.5s" repeatCount="indefinite" /></line>
        <line x1="20" y1="22" x2="20" y2="16" stroke="#FFD70060" strokeWidth="1.5"><animate attributeName="opacity" values="0;1;0" dur="1.5s" repeatCount="indefinite" /></line>
        <text x="55" y="56" textAnchor="middle" fill="#aaa" fontSize="7" fontFamily="Fredoka">Zdvihni ruky aj nohy naraz!</text>
      </svg>
    ),
    stretch: (
      <svg viewBox="0 0 100 100" width="150" height="150">
        <circle cx="62" cy="30" r="7" {...common}><animate attributeName="cx" values="62;55;62" dur="2s" repeatCount="indefinite" /><animate attributeName="cy" values="30;34;30" dur="2s" repeatCount="indefinite" /></circle>
        <line x1="58" y1="35" x2="45" y2="55" {...common}><animate attributeName="x1" values="58;52;58" dur="2s" repeatCount="indefinite" /><animate attributeName="y1" values="35;40;35" dur="2s" repeatCount="indefinite" /></line>
        <line x1="60" y1="38" x2="30" y2="55" {...common}><animate attributeName="x1" values="60;54;60" dur="2s" repeatCount="indefinite" /><animate attributeName="x2" values="30;22;30" dur="2s" repeatCount="indefinite" /><animate attributeName="y2" values="55;60;55" dur="2s" repeatCount="indefinite" /></line>
        <line x1="45" y1="55" x2="20" y2="60" {...common} />
        <circle cx="20" cy="60" r="2" fill={color} />
        <text x="50" y="80" textAnchor="middle" fill="#aaa" fontSize="6.5" fontFamily="Fredoka">Siahni na prsty! Pomaly dýchaj.</text>
      </svg>
    ),
  };
  const map = { "Rozbehanie na mieste":"run","Jumping Jacks":"jumpingjacks","High knees":"run","Kliky":"pushup","Drepy":"squat","Plank":"plank","Bočný plank":"plank","Brušáky":"superman","Tai sabaki":"taisabaki","Mountain climbers":"mountainclimber","Burpees":"jumpup","Beh na mieste so zrýchľovaním":"run","Výskoky":"jumpup","Superman":"superman","Predklon + Motýlik":"stretch" };
  const demo = demos[map[exerciseId]];
  if (!demo) return null;
  return (
    <div style={{
      background: "radial-gradient(ellipse at center, #FF8C0010 0%, transparent 70%)",
      borderRadius: 20, padding: "8px 0", display: "flex", justifyContent: "center",
      opacity: isRunning ? 1 : 0.5, transition: "opacity 0.3s",
    }}>{demo}</div>
  );
}

// ===== EXERCISE POOLS =====
const WARMUPS = [
  { name: "Rozbehanie na mieste", icon: "🏃", duration: 40, desc: "Rozbehaj sa! Kolená hore!", category: "Rozcvička" },
  { name: "Jumping Jacks", icon: "⭐", duration: 30, desc: "Hviezdicové výskoky – rozhýb celé telo", category: "Rozcvička" },
  { name: "High knees", icon: "🦿", duration: 35, desc: "Kolená čo najvyššie, rýchlo!", category: "Rozcvička" },
];

const STRENGTH = [
  { name: "Kliky", icon: "💪", duration: 30, desc: "Koľko zvládneš! Telo rovno ako doska.", category: "Sila" },
  { name: "Drepy", icon: "🦵", duration: 35, desc: "Hlboké drepy – sila do nôh pre hody!", category: "Sila" },
  { name: "Plank", icon: "🧱", duration: 35, desc: "Drž sa! Nesmieš sa prehýbať.", category: "Sila" },
  { name: "Výskoky", icon: "🦘", duration: 30, desc: "Vyskoč čo najvyššie! Mäkko dopadni.", category: "Sila" },
  { name: "Superman", icon: "🦸", duration: 30, desc: "Na bruchu – zdvihni ruky aj nohy, drž!", category: "Sila" },
  { name: "Brušáky", icon: "🔥", duration: 30, desc: "Pomalé a kontrolované – sila brucha!", category: "Sila" },
  { name: "Bočný plank", icon: "🧱", duration: 25, desc: "Na boku – drž 12s, otoč, ďalších 12s!", category: "Sila" },
];

const CARDIO = [
  { name: "Mountain climbers", icon: "🏔️", duration: 30, desc: "Horolezec – rýchlo striedaj nohy!", category: "Kardio" },
  { name: "Burpees", icon: "🐸", duration: 30, desc: "Celé telo pracuje – dole a hore!", category: "Kardio" },
  { name: "Beh na mieste so zrýchľovaním", icon: "💨", duration: 35, desc: "Začni pomaly, každých 10s zrýchli!", category: "Kardio" },
];

const JUDO = [
  { name: "Tai sabaki", icon: "⚡", duration: 45, desc: "Otáčanie tela – pohyb nôh ako na tatami!", category: "Judo" },
];

const STRETCH = [
  { name: "Predklon + Motýlik", icon: "🦋", duration: 40, desc: "Strečing – dotkni sa prstov, potom motýlik", category: "Strečing" },
];

const DAY_NAMES_SK = ["Nedeľný", "Pondelkový", "Utorkový", "Stredajší", "Štvrtokový", "Piatkový", "Sobotný"];

// Seeded random for consistent daily workouts
function seededRandom(seed) {
  let s = seed;
  return () => { s = (s * 16807 + 11) % 2147483647; return (s - 1) / 2147483646; };
}

// Shuffle array with seeded RNG (Fisher-Yates)
function shuffle(arr, rng) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

// Generate today's workout — guaranteed no duplicates
function generateWorkout() {
  const now = new Date();
  const seed = now.getFullYear() * 10000 + (now.getMonth() + 1) * 100 + now.getDate();
  const rng = seededRandom(seed);
  const dayName = DAY_NAMES_SK[now.getDay()];

  const usedNames = new Set();
  const exercises = [];

  // 1) Pick 2 unique warmups
  const warmups = shuffle(WARMUPS, rng);
  for (const w of warmups) {
    if (exercises.length >= 2) break;
    if (!usedNames.has(w.name)) { exercises.push(w); usedNames.add(w.name); }
  }

  // 2) Pick 4 unique strength exercises
  const strength = shuffle(STRENGTH, rng);
  let added = 0;
  for (const s of strength) {
    if (added >= 4) break;
    if (!usedNames.has(s.name)) { exercises.push(s); usedNames.add(s.name); added++; }
  }

  // 3) Pick 1 judo (max 1, no tatami needed)
  for (const j of JUDO) {
    if (!usedNames.has(j.name)) { exercises.push(j); usedNames.add(j.name); break; }
  }

  // 4) Pick 1 unique cardio
  const cardio = shuffle(CARDIO, rng);
  for (const c of cardio) {
    if (!usedNames.has(c.name)) { exercises.push(c); usedNames.add(c.name); break; }
  }

  // 5) Always end with stretch
  for (const s of STRETCH) {
    if (!usedNames.has(s.name)) { exercises.push(s); usedNames.add(s.name); break; }
  }

  return {
    name: `${dayName} Warrior tréning`,
    exercises,
  };
}

const REST_DURATION = 10;

const CAT_COLORS = {
  "Rozcvička": { color: "#42A5F5", bg: "#42A5F515", glow: "#42A5F530" },
  "Judo": { color: "#FFAB40", bg: "#FFAB4015", glow: "#FFAB4030" },
  "Sila": { color: "#FF5252", bg: "#FF525215", glow: "#FF525230" },
  "Kardio": { color: "#26C6DA", bg: "#26C6DA15", glow: "#26C6DA30" },
  "Strečing": { color: "#CE93D8", bg: "#CE93D815", glow: "#CE93D830" },
};

// ===== BELT BADGE =====
function BeltBadge({ colors, name, small }) {
  const h = small ? 10 : 14;
  const w = small ? 60 : 90;
  return (
    <div style={{ display: "inline-flex", alignItems: "center", gap: 6 }}>
      <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`}>
        <rect x="0" y="0" width={w/2} height={h} rx="2" fill={colors[0]} stroke="#00000030" strokeWidth="0.5" />
        <rect x={w/2} y="0" width={w/2} height={h} rx="2" fill={colors[1]} stroke="#00000030" strokeWidth="0.5" />
        <rect x={w/2-4} y={h/2-4} width="8" height="8" rx="4" fill={colors[1]} stroke={colors[0]} strokeWidth="1.5" />
      </svg>
      {!small && <span style={{ fontSize: 12, color: "#ccc", fontWeight: 600 }}>{name}</span>}
    </div>
  );
}

// ===== CIRCLE TIMER =====
function CircleTimer({ timeLeft, totalTime, isRunning, accent = "#FFAB40" }) {
  const r = 58;
  const circ = 2 * Math.PI * r;
  const progress = totalTime > 0 ? timeLeft / totalTime : 0;
  const offset = circ * (1 - progress);
  const urgent = timeLeft <= 5 && timeLeft > 0 && isRunning;
  const col = urgent ? "#FF5252" : accent;
  return (
    <svg width="150" height="150" viewBox="0 0 150 150" style={{ display: "block", margin: "0 auto", filter: urgent ? "drop-shadow(0 0 16px #FF525080)" : `drop-shadow(0 0 12px ${accent}40)` }}>
      <defs>
        <linearGradient id="tg" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor={col} />
          <stop offset="100%" stopColor={urgent ? "#FF8A80" : "#FFD740"} />
        </linearGradient>
      </defs>
      <circle cx="75" cy="75" r={r} fill="none" stroke="#ffffff08" strokeWidth="10" />
      <circle cx="75" cy="75" r={r} fill="none"
        stroke="url(#tg)" strokeWidth="10" strokeLinecap="round"
        strokeDasharray={circ} strokeDashoffset={offset}
        transform="rotate(-90 75 75)"
        style={{ transition: "stroke-dashoffset 0.3s linear" }}
      />
      <text x="75" y="70" textAnchor="middle" dominantBaseline="central"
        fill="#fff" fontSize="40" fontFamily="'Fredoka', sans-serif" fontWeight="700"
        style={{ animation: urgent ? "pulse 0.5s ease infinite" : "none" }}>{timeLeft}</text>
      <text x="75" y="96" textAnchor="middle" fill="#888" fontSize="11" fontFamily="'Fredoka', sans-serif">sekúnd</text>
    </svg>
  );
}

// ===== PARTICLES =====
function Particles({ count = 20, colors = ["#FF8C00", "#FFD700", "#FF5252", "#FFAB40"] }) {
  const particles = useRef(Array.from({ length: count }, (_, i) => ({
    x: Math.random() * 100, y: Math.random() * 100,
    size: 2 + Math.random() * 3, speed: 0.3 + Math.random() * 0.7,
    color: colors[i % colors.length], delay: Math.random() * 5,
  }))).current;
  return (
    <div style={{ position: "fixed", inset: 0, pointerEvents: "none", zIndex: 0, overflow: "hidden" }}>
      {particles.map((p, i) => (
        <div key={i} style={{
          position: "absolute", left: `${p.x}%`, top: `${p.y}%`,
          width: p.size, height: p.size, borderRadius: "50%",
          background: p.color, opacity: 0.3,
          animation: `floatParticle ${3 + p.speed * 4}s ease-in-out ${p.delay}s infinite alternate`,
        }} />
      ))}
    </div>
  );
}

// ===== MAIN APP =====
// ===== PROGRESS PERSISTENCE =====
const STORAGE_KEY = "judo-warrior-progress";

function loadProgress() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw);
  } catch (e) {}
  return { totalXP: 0, totalWorkouts: 0, completedDates: [], bestStreak: 0, currentStreak: 0 };
}

function saveProgress(progress) {
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(progress)); } catch (e) {}
}

function getDateStr(d = new Date()) {
  return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;
}

function calculateStreak(dates) {
  if (!dates.length) return 0;
  const sorted = [...new Set(dates)].sort().reverse();
  const today = getDateStr();
  const yesterday = getDateStr(new Date(Date.now() - 86400000));
  if (sorted[0] !== today && sorted[0] !== yesterday) return 0;
  let streak = 1;
  for (let i = 1; i < sorted.length; i++) {
    const diff = (new Date(sorted[i-1]) - new Date(sorted[i])) / 86400000;
    if (diff === 1) streak++; else break;
  }
  return streak;
}

export default function TodayWorkout() {
  const [workout] = useState(() => generateWorkout());
  const [progress, setProgress] = useState(() => loadProgress());
  const [phase, setPhase] = useState("intro");
  const [exIdx, setExIdx] = useState(0);
  const [timeLeft, setTimeLeft] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [completedCount, setCompletedCount] = useState(0);
  const [totalTimeSpent, setTotalTimeSpent] = useState(0);
  const [autoMode, setAutoMode] = useState(true);
  const [newBeltUnlocked, setNewBeltUnlocked] = useState(null);
  const timerRef = useRef(null);

  // Save progress whenever it changes
  useEffect(() => { saveProgress(progress); }, [progress]);

  const todayStr = getDateStr();
  const todayCompleted = progress.completedDates.includes(todayStr);

  const ex = workout.exercises[exIdx];
  const catStyle = CAT_COLORS[ex?.category] || CAT_COLORS["Sila"];

  // Sound on countdown
  useEffect(() => {
    if (isRunning && timeLeft > 0 && timeLeft <= 3) {
      playCountdownBeep();
    }
    if (isRunning && timeLeft === 0) {
      if (phase === "workout") playDoneBeep();
      if (phase === "rest") playGoBeep();
    }
  }, [timeLeft, isRunning]);

  // Timer logic
  useEffect(() => {
    if (isRunning && timeLeft > 0) {
      timerRef.current = setTimeout(() => {
        setTimeLeft(t => t - 1);
        if (phase === "workout") setTotalTimeSpent(t => t + 1);
      }, 1000);
    } else if (isRunning && timeLeft === 0) {
      setIsRunning(false);
      if (phase === "workout") {
        setCompletedCount(c => c + 1);
        if (exIdx < workout.exercises.length - 1) {
          setPhase("rest");
          setTimeLeft(REST_DURATION);
          // auto-start rest countdown
          setTimeout(() => setIsRunning(true), 200);
        } else {
          finishWorkout();
        }
      } else if (phase === "rest") {
        // Auto-advance to next exercise
        const next = exIdx + 1;
        setExIdx(next);
        setTimeLeft(workout.exercises[next].duration);
        setPhase("workout");
        if (autoMode) {
          setTimeout(() => setIsRunning(true), 400);
        }
      }
    }
    return () => clearTimeout(timerRef.current);
  }, [isRunning, timeLeft, phase, exIdx, autoMode]);

  const xpEarned = completedCount * 12;

  // Belt from total XP (persistent + session)
  const getBeltIdx = useCallback((xp) => {
    for (let i = BELT_RANKS.length - 1; i >= 0; i--) {
      if (xp >= BELT_RANKS[i].xp) return i;
    }
    return 0;
  }, []);

  const currentTotalXP = progress.totalXP + (phase === "done" ? xpEarned : 0);
  const displayXP = phase === "done" ? currentTotalXP : progress.totalXP + xpEarned;
  const beltIdx = getBeltIdx(displayXP);
  const belt = BELT_RANKS[beltIdx];
  const nextBelt = BELT_RANKS[beltIdx + 1];

  // Finish workout — save progress permanently
  const finishWorkout = useCallback(() => {
    const oldBeltIdx = getBeltIdx(progress.totalXP);
    const newXP = progress.totalXP + xpEarned;
    const newBeltIdx = getBeltIdx(newXP);
    const newDates = [...new Set([...progress.completedDates, todayStr])];
    const streak = calculateStreak(newDates);

    setProgress({
      totalXP: newXP,
      totalWorkouts: progress.totalWorkouts + 1,
      completedDates: newDates,
      currentStreak: streak,
      bestStreak: Math.max(progress.bestStreak, streak),
    });

    if (newBeltIdx > oldBeltIdx) {
      setNewBeltUnlocked(BELT_RANKS[newBeltIdx]);
    }

    finishWorkout();
  }, [progress, xpEarned, todayStr, getBeltIdx]);

  const startWorkout = () => {
    // Init audio context on user gesture
    getAudioCtx();
    setPhase("workout");
    setExIdx(0);
    setTimeLeft(workout.exercises[0].duration);
    setIsRunning(false);
    setCompletedCount(0);
    setTotalTimeSpent(0);
  };

  const skipRest = () => {
    clearTimeout(timerRef.current);
    setIsRunning(false);
    const next = exIdx + 1;
    setExIdx(next);
    setTimeLeft(workout.exercises[next].duration);
    setPhase("workout");
    if (autoMode) setTimeout(() => setIsRunning(true), 300);
  };

  const skipExercise = () => {
    clearTimeout(timerRef.current);
    setIsRunning(false);
    setCompletedCount(c => c + 1);
    if (exIdx < workout.exercises.length - 1) {
      setPhase("rest");
      setTimeLeft(REST_DURATION);
      setTimeout(() => setIsRunning(true), 200);
    } else {
      finishWorkout();
    }
  };

  const progressPct = (completedCount / workout.exercises.length) * 100;
  const totalTime = workout.exercises.reduce((s, e) => s + e.duration, 0);

  return (
    <div style={{
      minHeight: "100vh", minHeight: "100dvh",
      background: "linear-gradient(160deg, #0a0a18 0%, #121228 30%, #0d1b2a 60%, #0a0a18 100%)",
      fontFamily: "'Fredoka', sans-serif",
      maxWidth: 430, margin: "0 auto",
      color: "#fff", position: "relative", overflow: "hidden",
    }}>
      <Particles />
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Fredoka:wght@400;500;600;700&display=swap');
        @keyframes slideUp { 0% { transform: translateY(30px); opacity: 0; } 100% { transform: translateY(0); opacity: 1; } }
        @keyframes slideDown { 0% { transform: translateY(-20px); opacity: 0; } 100% { transform: translateY(0); opacity: 1; } }
        @keyframes popIn { 0% { transform: scale(0); opacity: 0; } 60% { transform: scale(1.15); } 100% { transform: scale(1); opacity: 1; } }
        @keyframes pulse { 0%,100% { transform: scale(1); } 50% { transform: scale(1.06); } }
        @keyframes float { 0%,100% { transform: translateY(0); } 50% { transform: translateY(-10px); } }
        @keyframes confetti { 0% { transform: translateY(0) rotate(0); opacity:1; } 100% { transform: translateY(-280px) rotate(720deg); opacity:0; } }
        @keyframes shimmer { 0% { background-position: 200% 0; } 100% { background-position: -200% 0; } }
        @keyframes breathe { 0%,100% { box-shadow: 0 0 12px #FFAB4040; } 50% { box-shadow: 0 0 32px #FFD74080; } }
        @keyframes floatParticle { 0% { transform: translateY(0) translateX(0); } 100% { transform: translateY(-30px) translateX(15px); } }
        @keyframes glow { 0%,100% { filter: drop-shadow(0 0 8px #FFAB4040); } 50% { filter: drop-shadow(0 0 20px #FFD74060); } }
        @keyframes borderGlow { 0%,100% { border-color: #FFAB4030; } 50% { border-color: #FFD74060; } }
        * { box-sizing: border-box; -webkit-tap-highlight-color: transparent; }
        body { margin: 0; background: #0a0a18; }
      `}</style>

      {/* ====== INTRO ====== */}
      {phase === "intro" && (
        <div style={{ padding: "32px 20px", textAlign: "center", minHeight: "100vh", display: "flex", flexDirection: "column", justifyContent: "center", position: "relative", zIndex: 1 }}>
          <div style={{ animation: "float 3s ease-in-out infinite, glow 3s ease-in-out infinite", fontSize: 80, marginBottom: 12 }}>🥋</div>
          <h1 style={{
            fontSize: 26, fontWeight: 700, margin: "0 0 4px",
            background: "linear-gradient(90deg, #FFAB40, #FFD740, #FF8C00)",
            backgroundSize: "200%", animation: "shimmer 4s linear infinite",
            WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
          }}>{workout.name}</h1>
          <p style={{ color: "#888", fontSize: 14, margin: "0 0 6px" }}>
            {workout.exercises.length} cvikov • ~{Math.round((totalTime + REST_DURATION * (workout.exercises.length - 1)) / 60)} minút
          </p>

          {/* Progress stats */}
          <div style={{ display: "flex", gap: 8, justifyContent: "center", marginBottom: 8 }}>
            <BeltBadge colors={belt.colors} name={belt.name} small />
            <span style={{ fontSize: 13, color: "#FFAB40", fontWeight: 600 }}>⚡{progress.totalXP} XP</span>
            {progress.currentStreak > 0 && <span style={{ fontSize: 13, color: "#FF5252" }}>🔥{progress.currentStreak}</span>}
          </div>
          {nextBelt && (
            <div style={{ width: "60%", margin: "0 auto 16px", height: 6, background: "#ffffff08", borderRadius: 3, overflow: "hidden" }}>
              <div style={{
                width: `${Math.min(((progress.totalXP - belt.xp) / (nextBelt.xp - belt.xp)) * 100, 100)}%`,
                height: "100%", borderRadius: 3,
                background: "linear-gradient(90deg, #FF8C00, #FFD740)",
                boxShadow: "0 0 8px #FF8C0040",
              }} />
            </div>
          )}

          {/* Today completed badge */}
          {todayCompleted && (
            <div style={{
              marginBottom: 16, padding: "8px 16px", borderRadius: 12,
              background: "#43A04715", border: "1px solid #43A04730",
              color: "#81C784", fontSize: 13, fontWeight: 600,
            }}>✅ Dnes už odcvičené! Môžeš trénovať znova.</div>
          )}

          <div style={{
            background: "linear-gradient(135deg, #ffffff06, #ffffff03)",
            backdropFilter: "blur(10px)",
            borderRadius: 20, padding: 16, marginBottom: 24,
            border: "1px solid #ffffff10", textAlign: "left",
          }}>
            {workout.exercises.map((e, i) => (
              <div key={i} style={{
                display: "flex", alignItems: "center", gap: 10, padding: "9px 4px",
                borderBottom: i < workout.exercises.length - 1 ? "1px solid #ffffff08" : "none",
                animation: `slideUp 0.4s ease ${i * 0.04}s both`,
              }}>
                <div style={{
                  width: 30, height: 30, borderRadius: 10, display: "flex", alignItems: "center", justifyContent: "center",
                  background: `linear-gradient(135deg, ${CAT_COLORS[e.category]?.bg}, transparent)`,
                  border: `1px solid ${CAT_COLORS[e.category]?.color}20`,
                  fontSize: 12, color: CAT_COLORS[e.category]?.color, fontWeight: 700, flexShrink: 0,
                }}>{i + 1}</div>
                <span style={{ fontSize: 20 }}>{e.icon}</span>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 14, fontWeight: 600, color: "#eee" }}>{e.name}</div>
                  <div style={{ fontSize: 11, color: "#666" }}>{e.duration}s</div>
                </div>
              </div>
            ))}
          </div>

          <button onClick={startWorkout} style={{
            width: "100%", padding: "16px 0", borderRadius: 16, border: "none",
            background: "linear-gradient(135deg, #FF8C00, #FFAB40, #FFD740)",
            color: "#0a0a18", fontSize: 20, fontWeight: 700, cursor: "pointer",
            boxShadow: "0 4px 30px #FF8C0060, 0 0 60px #FF8C0020",
            animation: "breathe 2.5s ease infinite",
            fontFamily: "'Fredoka', sans-serif", letterSpacing: 0.5,
          }}>⚡ IDEME NA TO!</button>
        </div>
      )}

      {/* ====== WORKOUT ====== */}
      {phase === "workout" && ex && (
        <div style={{ padding: "16px 16px", minHeight: "100vh", position: "relative", zIndex: 1 }}>
          {/* Top bar */}
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10, animation: "slideDown 0.3s ease" }}>
            <button onClick={() => { setIsRunning(false); clearTimeout(timerRef.current); setPhase("intro"); }}
              style={{ background: "none", border: "none", color: "#666", fontSize: 22, cursor: "pointer", padding: 4 }}>←</button>
            <div style={{ flex: 1, height: 6, background: "#ffffff08", borderRadius: 3, overflow: "hidden" }}>
              <div style={{
                width: `${progressPct}%`, height: "100%",
                background: "linear-gradient(90deg, #FF8C00, #FFD740)",
                borderRadius: 3, transition: "width 0.5s",
                boxShadow: "0 0 8px #FF8C0040",
              }} />
            </div>
            <div style={{ fontSize: 12, color: "#FFAB40", fontWeight: 600 }}>⚡{xpEarned}</div>
          </div>

          <div style={{ textAlign: "center" }}>
            <div key={exIdx} style={{ animation: "slideUp 0.35s ease" }}>
              <div style={{
                display: "inline-block", padding: "5px 16px", borderRadius: 20, marginBottom: 12,
                background: catStyle.bg, border: `1px solid ${catStyle.color}30`,
                color: catStyle.color, fontSize: 12, fontWeight: 600,
                boxShadow: `0 0 12px ${catStyle.glow}`,
              }}>
                Cvik {exIdx + 1}/{workout.exercises.length} • {ex.category}
              </div>

              <h2 style={{ fontSize: 22, fontWeight: 700, margin: "0 0 4px", color: "#fff" }}>{ex.icon} {ex.name}</h2>
              <p style={{ fontSize: 13, color: "#999", margin: "0 0 10px", padding: "0 16px" }}>{ex.desc}</p>
            </div>

            <ExerciseDemo exerciseId={ex.name} isRunning={isRunning} />
            <div style={{ marginTop: 10 }}>
              <CircleTimer timeLeft={timeLeft} totalTime={ex.duration} isRunning={isRunning} accent={catStyle.color} />
            </div>

            <div style={{ marginTop: 20, display: "flex", flexDirection: "column", alignItems: "center", gap: 10 }}>
              {!isRunning ? (
                <button onClick={() => { getAudioCtx(); setIsRunning(true); }} style={{
                  padding: "14px 60px", borderRadius: 16, border: "none",
                  background: "linear-gradient(135deg, #43A047, #66BB6A, #81C784)",
                  color: "#fff", fontSize: 18, fontWeight: 700, cursor: "pointer",
                  boxShadow: "0 4px 24px #43A04750, 0 0 40px #43A04720",
                  fontFamily: "'Fredoka', sans-serif",
                  animation: "breathe 2s ease infinite",
                }}>{timeLeft === ex.duration ? "▶ ŠTART" : "▶ POKRAČUJ"}</button>
              ) : (
                <button onClick={() => setIsRunning(false)} style={{
                  padding: "14px 60px", borderRadius: 16, border: "none",
                  background: "linear-gradient(135deg, #E53935, #EF5350, #FF8A80)",
                  color: "#fff", fontSize: 18, fontWeight: 700, cursor: "pointer",
                  boxShadow: "0 4px 24px #E5393550",
                  fontFamily: "'Fredoka', sans-serif",
                }}>⏸ PAUZA</button>
              )}
              {!isRunning && (
                <button onClick={skipExercise} style={{
                  padding: "8px 24px", borderRadius: 12, border: "1px solid #ffffff12",
                  background: "transparent", color: "#555", fontSize: 12, cursor: "pointer", fontFamily: "'Fredoka', sans-serif",
                }}>Preskočiť ⏭️</button>
              )}
            </div>

            {exIdx < workout.exercises.length - 1 && (
              <div style={{
                marginTop: 20, padding: "8px 16px", borderRadius: 12,
                background: "#ffffff05", display: "inline-flex", alignItems: "center", gap: 8,
                border: "1px solid #ffffff08",
              }}>
                <span style={{ fontSize: 10, color: "#555" }}>ĎALEJ:</span>
                <span style={{ fontSize: 16 }}>{workout.exercises[exIdx + 1].icon}</span>
                <span style={{ fontSize: 12, color: "#777" }}>{workout.exercises[exIdx + 1].name}</span>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ====== REST ====== */}
      {phase === "rest" && (
        <div style={{
          padding: "20px 16px", minHeight: "100vh",
          display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
          position: "relative", zIndex: 1,
        }}>
          {/* Progress */}
          <div style={{ width: "100%", marginBottom: 20 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <div style={{ flex: 1, height: 6, background: "#ffffff08", borderRadius: 3, overflow: "hidden" }}>
                <div style={{ width: `${progressPct}%`, height: "100%", background: "linear-gradient(90deg, #FF8C00, #FFD740)", borderRadius: 3, boxShadow: "0 0 8px #FF8C0040" }} />
              </div>
              <div style={{ fontSize: 12, color: "#FFAB40", fontWeight: 600 }}>⚡{xpEarned}</div>
            </div>
          </div>

          <div style={{ textAlign: "center", animation: "slideUp 0.3s ease" }}>
            <div style={{ fontSize: 52, animation: "float 2s ease-in-out infinite" }}>😤</div>
            <h2 style={{ fontSize: 20, fontWeight: 700, color: "#64B5F6", margin: "10px 0 0" }}>Oddych</h2>
            <div style={{
              fontSize: 72, fontWeight: 700, margin: "8px 0",
              background: timeLeft <= 3 ? "linear-gradient(90deg, #FF5252, #FF8A80)" : "linear-gradient(90deg, #FFD740, #FFAB40)",
              WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
              animation: timeLeft <= 3 ? "pulse 0.5s ease infinite" : "none",
              filter: timeLeft <= 3 ? "drop-shadow(0 0 12px #FF525060)" : "drop-shadow(0 0 12px #FFD74040)",
            }}>{timeLeft}</div>

            {exIdx + 1 < workout.exercises.length && (
              <div style={{
                background: "linear-gradient(135deg, #ffffff06, #ffffff03)",
                borderRadius: 18, padding: 16, marginBottom: 16,
                border: "1px solid #ffffff10",
                animation: "borderGlow 2s ease infinite",
              }}>
                <div style={{ fontSize: 10, color: "#555", textTransform: "uppercase", marginBottom: 10, letterSpacing: 1.5 }}>Priprav sa na</div>
                <div style={{ opacity: 0.5, transform: "scale(0.65)", transformOrigin: "center" }}>
                  <ExerciseDemo exerciseId={workout.exercises[exIdx + 1].name} isRunning={true} />
                </div>
                <div style={{ fontSize: 18, fontWeight: 700, color: "#fff", marginTop: 4 }}>
                  {workout.exercises[exIdx + 1].icon} {workout.exercises[exIdx + 1].name}
                </div>
                <div style={{ fontSize: 11, color: "#888", marginTop: 4 }}>{workout.exercises[exIdx + 1].desc}</div>
              </div>
            )}

            <button onClick={skipRest} style={{
              padding: "12px 36px", borderRadius: 14,
              border: "2px solid #FFAB4030", background: "#FFAB4010",
              color: "#FFAB40", fontSize: 15, fontWeight: 600, cursor: "pointer",
              fontFamily: "'Fredoka', sans-serif",
            }}>Preskočiť ⏭️</button>
          </div>
        </div>
      )}

      {/* ====== DONE ====== */}
      {phase === "done" && (
        <div style={{
          padding: "40px 20px", minHeight: "100vh",
          display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
          textAlign: "center", position: "relative", zIndex: 1,
        }}>
          {[...Array(20)].map((_, i) => (
            <div key={i} style={{
              position: "fixed", left: `${5 + Math.random() * 90}%`, top: `${50 + Math.random() * 40}%`,
              fontSize: 28 + Math.random() * 12,
              animation: `confetti ${1.2 + Math.random() * 1.5}s ease-out ${Math.random() * 0.8}s forwards`,
              zIndex: 10,
            }}>{["🎉","⭐","🥋","💪","🔥","✨","🏆","💎","🎊","⚡"][i % 10]}</div>
          ))}

          <div style={{ animation: "popIn 0.5s ease", fontSize: 90, marginBottom: 8, filter: "drop-shadow(0 0 20px #FFD74060)" }}>🏆</div>

          <h1 style={{
            fontSize: 32, fontWeight: 700, margin: "0 0 8px",
            background: "linear-gradient(90deg, #FFD740, #FF8C00, #FF5252, #FFD740)",
            backgroundSize: "300%", animation: "shimmer 3s linear infinite",
            WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
          }}>VÝBORNE! 🎉</h1>

          <p style={{ fontSize: 16, color: "#999", margin: "0 0 20px" }}>Tréning dokončený, šampión!</p>

          <div style={{
            fontSize: 44, fontWeight: 700, margin: "0 0 20px",
            background: "linear-gradient(90deg, #FFD740, #FFAB40)",
            WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
            filter: "drop-shadow(0 0 12px #FFD74040)",
            animation: "popIn 0.5s ease 0.3s both",
          }}>+{xpEarned} XP ⚡</div>

          {/* New belt unlocked! */}
          {newBeltUnlocked && (
            <div style={{
              marginBottom: 16, padding: "12px 20px", borderRadius: 16,
              background: "linear-gradient(135deg, #FFD74020, #FF8C0010)",
              border: "1px solid #FFD74040", animation: "popIn 0.6s ease 0.35s both",
              textAlign: "center",
            }}>
              <div style={{ fontSize: 16, fontWeight: 700, color: "#FFD740", marginBottom: 6 }}>🎊 NOVÝ OPASOK! 🎊</div>
              <BeltBadge colors={newBeltUnlocked.colors} name={newBeltUnlocked.name} />
            </div>
          )}

          <div style={{ marginBottom: 24, animation: "slideUp 0.5s ease 0.4s both" }}>
            <BeltBadge colors={belt.colors} name={belt.name} />
            <div style={{ fontSize: 13, color: "#FFAB40", marginTop: 6, fontWeight: 600 }}>
              Celkom: {progress.totalXP} XP
            </div>
            {nextBelt && (
              <div style={{ fontSize: 11, color: "#666", marginTop: 4 }}>
                Ďalší: {nextBelt.name} ({nextBelt.xp - progress.totalXP} XP)
              </div>
            )}
          </div>

          <div style={{
            display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, width: "100%", maxWidth: 300,
            animation: "slideUp 0.5s ease 0.5s both",
          }}>
            {[
              { label: "Cviky", value: completedCount, icon: "✅" },
              { label: "XP získané", value: `${xpEarned} ⚡`, icon: "" },
              { label: "Séria", value: `${progress.currentStreak} 🔥`, icon: "" },
              { label: "Tréningy", value: progress.totalWorkouts, icon: "💪" },
            ].map((s, i) => (
              <div key={i} style={{
                background: "linear-gradient(135deg, #ffffff06, #ffffff03)",
                borderRadius: 16, padding: "16px 12px",
                border: "1px solid #ffffff10",
                backdropFilter: "blur(10px)",
              }}>
                <div style={{ fontSize: 24, marginBottom: 4 }}>{s.icon}</div>
                <div style={{ fontSize: 22, fontWeight: 700, color: "#FFD740" }}>{s.value}</div>
                <div style={{ fontSize: 11, color: "#666", marginTop: 2 }}>{s.label}</div>
              </div>
            ))}
          </div>

          <button onClick={() => { setPhase("intro"); setExIdx(0); setCompletedCount(0); setTotalTimeSpent(0); setNewBeltUnlocked(null); }} style={{
            marginTop: 28, padding: "14px 48px", borderRadius: 14, border: "none",
            background: "linear-gradient(135deg, #FF8C00, #FFAB40, #FFD740)",
            color: "#0a0a18", fontSize: 18, fontWeight: 700, cursor: "pointer",
            boxShadow: "0 4px 30px #FF8C0060",
            fontFamily: "'Fredoka', sans-serif",
            animation: "slideUp 0.5s ease 0.7s both",
          }}>🔄 Trénovať znova</button>
        </div>
      )}
    </div>
  );
}
