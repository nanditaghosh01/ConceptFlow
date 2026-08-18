(function(){
"use strict";

/* ======================= CONVERSION ENGINE ======================= */
const DIGITS = "0123456789ABCDEF";
const BASE_NAMES = {2:"Binary", 8:"Octal", 10:"Decimal", 16:"Hexadecimal"};
const BASE_COLOR_VAR = {2:"--base2", 8:"--base8", 10:"--base10", 16:"--base16"};
const BASE_CLASS = {2:"2", 8:"8", 10:"10", 16:"16"};

function isValidDigit(ch, base){
  const v = DIGITS.indexOf(ch.toUpperCase());
  return v !== -1 && v < base;
}
function validateNumber(str, base){
  if(!str || !str.length) return "Enter a value first.";
  for(const ch of str){
    if(!isValidDigit(ch, base)){
      const allowed = DIGITS.slice(0, base).split("").join(", ");
      return `"${ch}" isn't valid in base ${base}. Base ${base} (${BASE_NAMES[base]}) only uses digits ${allowed}.`;
    }
  }
  return null;
}
function toDecimalSteps(str, base){
  str = str.toUpperCase().replace(/^0+(?=.)/, "");
  const digits = str.split("");
  const n = digits.length;
  const steps = []; const contributions = []; let sum = 0;
  digits.forEach((d,i)=>{
    const pos = n-1-i;
    const val = DIGITS.indexOf(d);
    const power = Math.pow(base,pos);
    const contribution = val*power;
    contributions.push(contribution);
    sum += contribution;
    steps.push({type:"expand-digit", phase:"to-decimal", digitIndex:i,
      title:`Digit "${d}" sits at position ${pos}`,
      detail:`${val} × ${base}^${pos} = ${val} × ${power} = ${contribution}`});
  });
  steps.push({type:"expand-sum", phase:"to-decimal",
    title:"Add every contribution together",
    detail:`${contributions.join(" + ")} = ${sum}`, result:sum});
  return {steps, result:sum, digits, contributions};
}
function fromDecimalSteps(value, base){
  const steps = []; const rows = [];
  if(value === 0){
    steps.push({type:"divide-zero", phase:"from-decimal", title:"The value is already 0", detail:`0 in base ${base} is just 0.`});
    return {steps, result:"0", rows};
  }
  let v = value;
  while(v>0){
    const q = Math.floor(v/base), r = v%base;
    rows.push({dividend:v, quotient:q, remainder:r, digit:DIGITS[r]});
    steps.push({type:"divide", phase:"from-decimal", title:`${v} ÷ ${base}`,
      detail:`${v} ÷ ${base} = ${q} remainder ${r} (digit "${DIGITS[r]}")`});
    v = q;
  }
  const result = rows.map(r=>r.digit).reverse().join("");
  steps.push({type:"divide-result", phase:"from-decimal", title:"Read the remainders bottom to top",
    detail:rows.map(r=>r.digit).reverse().join(" → ") + ` = ${result}`, result});
  return {steps, result, rows};
}
function convert(valueStr, fromBase, toBase){
  const err = validateNumber(valueStr, fromBase);
  if(err) return {error:err};
  const clean = valueStr.toUpperCase().replace(/^0+(?=.)/, "") || "0";

  if(fromBase === toBase){
    return {steps:[{type:"trivial", phase:"same", title:"Same base — nothing to convert",
      detail:`${clean} is already written in base ${toBase}.`}], result:clean};
  }
  let out;
  if(fromBase === 10){
    const dec = parseInt(clean,10);
    const f = fromDecimalSteps(dec, toBase);
    out = {steps:f.steps, result:f.result, rows:f.rows};
  } else if(toBase === 10){
    const t = toDecimalSteps(clean, fromBase);
    out = {steps:t.steps, result:String(t.result), digits:t.digits, contributions:t.contributions};
  } else {
    const t = toDecimalSteps(clean, fromBase);
    const f = fromDecimalSteps(t.result, toBase);
    const bridge = {type:"bridge", phase:"bridge",
      title:`${clean} (base ${fromBase}) equals ${t.result} in decimal`,
      detail:`Now convert ${t.result} (decimal) into base ${toBase}.`};
    out = {steps:[...t.steps, bridge, ...f.steps], result:f.result,
      digits:t.digits, contributions:t.contributions, rows:f.rows};
  }
  out.steps.forEach((s,i)=> s.idx = i);
  out.input = clean; out.fromBase = fromBase; out.toBase = toBase;
  return out;
}

/* ======================= STATE ======================= */
const state = {
  fromBase:10, toBase:2, valueStr:"13",
  conversion:null, currentIndex:-1, playing:false, timer:null, speed:1
};

/* ======================= DOM REFS ======================= */
const $ = (id)=>document.getElementById(id);
const fromBaseSel = $("fromBase"), toBaseSel = $("toBase"), valueInput = $("valueInput");
const errorMsg = $("errorMsg"), stage = $("stage");
const stepLabel = $("wsStepLabel"), progressFill = $("wsProgressFill");
const panelTitle = $("panelStepTitle"), panelDetail = $("panelStepDetail"), tipBox = $("tipBox");
const timelineFill = $("timelineFill"), timelineCount = $("timelineCount"), timelineBar = $("timelineBar");
const playBtn = $("playBtn"), prevBtn = $("prevBtn"), nextBtn = $("nextBtn"), restartBtn = $("restartBtn");
const speedSlider = $("speedSlider"), difficultySelect = $("wsDifficulty");
const novaToggle = $("novaToggle"), novaMsg = $("novaMsg");

/* ======================= RUN / RENDER ======================= */
function baseVar(base){ return `var(${BASE_COLOR_VAR[base]})`; }

function runConversion(){
  clearInterval(state.timer); state.playing = false; playBtn.textContent = "▶";
  const c = convert(valueInput.value.trim(), state.fromBase, state.toBase);
  if(c.error){
    errorMsg.textContent = c.error;
    stage.innerHTML = `<p class="plain-msg">Fix the value on the left, and the visualization will appear here.</p>`;
    stepLabel.textContent = "Step 0 of 0";
    progressFill.style.width = "0%";
    timelineFill.style.width = "0%"; timelineCount.textContent = "0 / 0";
    panelTitle.textContent = "Waiting on a valid value";
    panelDetail.textContent = c.error;
    return;
  }
  errorMsg.textContent = "";
  state.conversion = c;
  state.currentIndex = 0;
  renderAll();
}

function renderAll(){
  const c = state.conversion;
  if(!c) return;
  const total = c.steps.length;
  const idx = Math.max(0, Math.min(state.currentIndex, total-1));
  stepLabel.textContent = `Step ${idx+1} of ${total}`;
  const pct = total<=1 ? 100 : Math.round((idx/(total-1))*100);
  progressFill.style.width = pct + "%";
  timelineFill.style.width = pct + "%";
  timelineCount.textContent = `${idx+1} / ${total}`;

  const step = c.steps[idx];
  panelTitle.textContent = step.title;
  panelDetail.textContent = step.detail;

  renderTip(c);
  renderStage(c, idx);
}

function renderTip(c){
  const {fromBase, toBase} = c;
  let tip = "";
  const pairKey = [fromBase,toBase].sort((a,b)=>a-b).join("-");
  if(pairKey === "2-16") tip = "Shortcut: group binary digits in sets of 4 from the right — each group maps directly to one hex digit.";
  else if(pairKey === "2-8") tip = "Shortcut: group binary digits in sets of 3 from the right — each group maps directly to one octal digit.";
  else if(pairKey === "8-16") tip = "There's no single-step shortcut here — going through decimal (or via binary) is the cleanest path.";
  else if(fromBase===10 || toBase===10) tip = "Decimal is the bridge every other base is defined against — powers of the base going one way, repeated division the other.";
  tipBox.textContent = tip;
}

function reveal(list, upToIdx){ return list.filter(s=> s.idx <= upToIdx); }

function renderStage(c, idx){
  const revealed = c.steps.slice(0, idx+1);
  const trivial = revealed.find(s=>s.type==="trivial");
  const zero = revealed.find(s=>s.type==="divide-zero");

  if(trivial){
    stage.innerHTML = `<p class="plain-msg">${trivial.detail}</p>`;
    return;
  }

  let html = "";

  // EXPAND (to-decimal) scene
  if(c.digits){
    const expandDigitsRevealed = revealed.filter(s=>s.type==="expand-digit").length;
    const sumRevealed = revealed.some(s=>s.type==="expand-sum");
    const color = baseVar(c.fromBase);
    html += `<div class="digit-row">`;
    c.digits.forEach((d,i)=>{
      const pos = c.digits.length-1-i;
      const power = Math.pow(c.fromBase,pos);
      const isRevealed = i < expandDigitsRevealed;
      html += `<div class="digit-cell ${isRevealed?"revealed":""}">
        <div class="digit-box" style="border-color:${isRevealed?color:"var(--border)"}; color:${isRevealed?color:"var(--text)"};">${d}</div>
        <div class="digit-power">${c.fromBase}<sup>${pos}</sup> = ${power}</div>
        <div class="digit-calc">${isRevealed? "= "+c.contributions[i] : ""}</div>
      </div>`;
    });
    html += `</div>`;
    html += `<div class="sum-row ${sumRevealed?"show":""}">
      <span>${c.contributions.join(" + ")}</span>
      <span class="sum-eq">=</span>
      <span class="result-box" style="border-color:${color}; color:${color};">${c.digits.length? (sumRevealed? (c.steps.find(s=>s.type==="expand-sum")||{}).result : "?") : ""}</span>
    </div>`;
  }

  // BRIDGE
  const bridgeStep = c.steps.find(s=>s.type==="bridge");
  if(bridgeStep && bridgeStep.idx <= idx){
    html += `<div class="bridge-note">↓ &nbsp; ${bridgeStep.detail}</div>`;
  }

  // DIVIDE (from-decimal) scene
  if(c.rows){
    const divideRevealedCount = revealed.filter(s=>s.type==="divide").length;
    const resultRevealed = revealed.some(s=>s.type==="divide-result");
    const color = baseVar(c.toBase);
    html += `<div class="divide-list">`;
    c.rows.forEach((r,i)=>{
      const shown = i < divideRevealedCount;
      html += `<div class="divide-row ${shown?"show":""}">
        <span>${r.dividend} ÷ ${c.toBase} = ${r.quotient}</span>
        <span class="divide-remainder" style="background:color-mix(in srgb, ${color} 18%, transparent); color:${color};">${r.digit}</span>
      </div>`;
    });
    html += `</div>`;
    if(c.rows.length){
      html += `<div class="divide-readout ${resultRevealed?"show":""}">`;
      html += [...c.rows].reverse().map(r=>`<span class="readout-chip" style="background:color-mix(in srgb, ${color} 18%, transparent); color:${color};">${r.digit}</span>`).join(`<span style="color:var(--text-faint)">→</span>`);
      html += `<span style="color:var(--text-faint); margin:0 4px;">=</span><span class="result-box" style="border-color:${color}; color:${color};">${resultRevealed? c.result : "?"}</span>`;
      html += `</div>`;
    }
  }

  if(zero){
    html += `<p class="plain-msg">${zero.detail}</p>`;
  }

  stage.innerHTML = html || `<p class="plain-msg">${c.result}</p>`;
}

/* ======================= TIMELINE CONTROLS ======================= */
function goTo(i){
  if(!state.conversion) return;
  const total = state.conversion.steps.length;
  state.currentIndex = Math.max(0, Math.min(i, total-1));
  renderAll();
  if(state.currentIndex >= total-1){ pause(); }
}
function step(delta){ goTo(state.currentIndex + delta); }
function play(){
  if(!state.conversion) return;
  const total = state.conversion.steps.length;
  if(state.currentIndex >= total-1) state.currentIndex = -1;
  state.playing = true; playBtn.textContent = "❚❚";
  clearInterval(state.timer);
  state.timer = setInterval(()=>{
    if(state.currentIndex >= total-1){ pause(); return; }
    step(1);
  }, 1400 / state.speed);
  step(1);
}
function pause(){ state.playing = false; playBtn.textContent = "▶"; clearInterval(state.timer); }
function togglePlay(){ state.playing ? pause() : play(); }

playBtn.addEventListener("click", togglePlay);
prevBtn.addEventListener("click", ()=>{ pause(); step(-1); });
nextBtn.addEventListener("click", ()=>{ pause(); step(1); });
restartBtn.addEventListener("click", ()=>{ pause(); goTo(0); });
timelineBar.addEventListener("click", (e)=>{
  if(!state.conversion) return;
  pause();
  const rect = timelineBar.getBoundingClientRect();
  const pct = Math.min(1, Math.max(0, (e.clientX-rect.left)/rect.width));
  goTo(Math.round(pct*(state.conversion.steps.length-1)));
});
speedSlider.addEventListener("input", ()=>{ state.speed = parseFloat(speedSlider.value); if(state.playing){ play(); } });

/* keyboard nav when workspace focused */
document.addEventListener("keydown",(e)=>{
  const ws = document.getElementById("converter");
  const r = ws.getBoundingClientRect();
  const inView = r.top < window.innerHeight && r.bottom > 0;
  if(!inView) return;
  if(e.key === "ArrowRight"){ pause(); step(1); }
  if(e.key === "ArrowLeft"){ pause(); step(-1); }
  if(e.key === " " && document.activeElement !== valueInput){ e.preventDefault(); togglePlay(); }
});

/* ======================= INPUTS ======================= */
fromBaseSel.addEventListener("change", ()=>{ state.fromBase = parseInt(fromBaseSel.value,10); runConversion(); });
toBaseSel.addEventListener("change", ()=>{ state.toBase = parseInt(toBaseSel.value,10); runConversion(); });
valueInput.addEventListener("input", ()=>{ runConversion(); });
$("swapBtn").addEventListener("click", ()=>{
  const f = fromBaseSel.value, t = toBaseSel.value;
  fromBaseSel.value = t; toBaseSel.value = f;
  state.fromBase = parseInt(fromBaseSel.value,10); state.toBase = parseInt(toBaseSel.value,10);
  runConversion();
});
difficultySelect.addEventListener("change", ()=>{ $("wsDifficulty").nextElementSibling; });
// difficulty pill just mirrors selection text on the header pill area handled below
document.getElementById("difficultySelect").addEventListener("change", (e)=>{
  const pill = document.querySelector(".ws-pill");
  pill.textContent = e.target.value;
});

/* "I don't understand" helpers */
function pulseNova(text){
  panelDetail.textContent = text;
}
$("helpSimple").addEventListener("click", ()=>{
  if(!state.conversion) return;
  const s = state.conversion.steps[Math.max(0,state.currentIndex)];
  pulseNova("In plain words: " + simplify(s));
});
$("helpAnalogy").addEventListener("click", ()=>{
  pulseNova(analogyFor(state.conversion));
});
$("helpAgain").addEventListener("click", ()=>{
  if(!state.conversion) return;
  const s = state.conversion.steps[Math.max(0,state.currentIndex)];
  panelTitle.textContent = s.title;
  panelDetail.textContent = s.detail;
});
function simplify(s){
  if(s.type==="expand-digit") return "we take this digit, see how far it is from the right, and multiply it by the base raised to that distance.";
  if(s.type==="expand-sum") return "once every digit has a value, we just add them all up to get the final number.";
  if(s.type==="divide") return "we keep dividing by the target base — the leftover (remainder) each time becomes one digit of the answer.";
  if(s.type==="divide-result") return "the first remainder we found is actually the last digit, so we read them backwards.";
  if(s.type==="bridge") return "decimal is the common middle ground, so we land there first, then build the new number from it.";
  return "this step is already about as simple as it gets — try 'another way' from the library for a different angle.";
}
function analogyFor(c){
  if(!c) return "Pick a conversion first.";
  if(c.digits) return "Think of each position like a container that can only hold a certain 'batch size' (a power of the base) — you're counting how many full batches fit in each slot.";
  return "Think of repeated division like handing out items into groups of the new base size — whatever's left over each round becomes a digit, from the inside out.";
}

/* ======================= HERO LIVE DEMO ======================= */
const heroBits = $("heroBits"), heroExpr = $("heroExpr"), heroResult = $("heroResult"), heroBadge = $("heroBadge");
const heroSample = "1011";
function runHeroDemo(){
  const c = toDecimalSteps(heroSample, 2);
  heroBits.innerHTML = c.digits.map((d,i)=>`<div class="hero-bit" data-i="${i}">${d}</div>`).join("");
  heroResult.textContent = "0"; heroResult.classList.remove("show"); heroExpr.textContent = "";
  const cells = [...heroBits.querySelectorAll(".hero-bit")];
  let i = 0;
  clearInterval(runHeroDemo._t);
  runHeroDemo._t = setInterval(()=>{
    if(i < cells.length){
      cells[i].classList.add("active");
      heroExpr.textContent = c.steps[i].detail;
      i++;
    } else if(i === cells.length){
      heroExpr.textContent = c.contributions.join(" + ") + " = " + c.result;
      heroResult.textContent = c.result;
      heroResult.classList.add("show");
      i++;
    } else {
      clearInterval(runHeroDemo._t);
      setTimeout(runHeroDemo, 1800);
    }
  }, 650);
}

/* ======================= LIBRARY GRID ======================= */
const libPairs = [
  {from:2, to:10, label:"Binary → Decimal", desc:"Powers of two, expanded and summed."},
  {from:10, to:2, label:"Decimal → Binary", desc:"Repeated division, remainders read backwards."},
  {from:16, to:10, label:"Hex → Decimal", desc:"Powers of sixteen, one hex digit at a time."},
  {from:10, to:16, label:"Decimal → Hex", desc:"Divide by sixteen, remainders become A–F."},
  {from:8, to:10, label:"Octal → Decimal", desc:"Powers of eight, expanded and summed."},
  {from:10, to:8, label:"Decimal → Octal", desc:"Divide by eight, remainders build the digits."},
  {from:2, to:16, label:"Binary → Hex", desc:"Bridges through decimal, or group in 4s."},
  {from:16, to:2, label:"Hex → Binary", desc:"Bridges through decimal, or expand each digit."},
];
const libGrid = $("libGrid");
libGrid.innerHTML = libPairs.map(p=>`
  <button class="lib-card" data-from="${p.from}" data-to="${p.to}">
    <span class="lib-chip bg-${p.from}">BASE ${p.from}</span>
    <span class="lib-pair">${p.label}</span>
    <span class="lib-desc">${p.desc}</span>
  </button>`).join("");
libGrid.addEventListener("click",(e)=>{
  const btn = e.target.closest(".lib-card");
  if(!btn) return;
  fromBaseSel.value = btn.dataset.from;
  toBaseSel.value = btn.dataset.to;
  state.fromBase = parseInt(btn.dataset.from,10);
  state.toBase = parseInt(btn.dataset.to,10);
  const sample = {2:"1011", 8:"17", 10:"23", 16:"1F"};
  valueInput.value = sample[state.fromBase];
  runConversion();
  document.getElementById("converter").scrollIntoView({behavior:"smooth", block:"start"});
});

/* ======================= PRACTICE MODE ======================= */
const practiceExpr = $("practiceExpr"), practiceAnswer = $("practiceAnswer");
const practiceFeedback = $("practiceFeedback"), practiceSteps = $("practiceSteps");
let currentProblem = null;
function newProblem(){
  const pair = libPairs[Math.floor(Math.random()*libPairs.length)];
  let val;
  if(pair.from===10){ val = String(Math.floor(Math.random()*200)+2); }
  else if(pair.from===2){ val = Math.floor(Math.random()*30+4).toString(2); }
  else if(pair.from===8){ val = Math.floor(Math.random()*60+4).toString(8); }
  else { val = Math.floor(Math.random()*250+4).toString(16).toUpperCase(); }
  currentProblem = {...pair, val};
  practiceExpr.textContent = `${val}  (base ${pair.from})  →  base ${pair.to}`;
  practiceAnswer.value = "";
  practiceFeedback.textContent = ""; practiceFeedback.className = "practice-feedback";
  practiceSteps.textContent = "Solve it above — the worked steps will appear here after you check your answer.";
}
$("practiceCheck").addEventListener("click", ()=>{
  if(!currentProblem) return;
  const c = convert(currentProblem.val, currentProblem.from, currentProblem.to);
  const userAns = practiceAnswer.value.trim().toUpperCase().replace(/^0+(?=.)/,"");
  const correctAns = String(c.result).toUpperCase();
  if(userAns === correctAns){
    practiceFeedback.textContent = "Correct ✓ — nice work.";
    practiceFeedback.className = "practice-feedback correct";
  } else {
    practiceFeedback.textContent = `Not quite ✗ — the correct answer is ${correctAns}.`;
    practiceFeedback.className = "practice-feedback wrong";
  }
  practiceSteps.innerHTML = c.steps.map(s=>`<div>${s.detail}</div>`).join("");
});
$("practiceNew").addEventListener("click", newProblem);

/* ======================= THEME + NOVA TOGGLE ======================= */
$("themeToggle").addEventListener("click", ()=>{
  const html = document.documentElement;
  const next = html.getAttribute("data-theme") === "dark" ? "light" : "dark";
  html.setAttribute("data-theme", next);
  $("themeToggle").textContent = next === "dark" ? "🌙" : "☀️";
});
novaToggle.addEventListener("change", ()=>{
  novaMsg.style.display = novaToggle.checked ? "flex" : "none";
});
/* ======================= INIT ======================= */
fromBaseSel.value = "10"; toBaseSel.value = "2";
runConversion();
runHeroDemo();
newProblem();
})();