/* ============ SUONI (generati al volo con la Web Audio API, niente file da caricare) ============ */
let soundEnabled = (function(){
  try{ const v = localStorage.getItem('lv_sound'); return v===null ? true : v==='1'; }
  catch(e){ return true; }
})();
function toggleSound(){
  soundEnabled = !soundEnabled;
  try{ localStorage.setItem('lv_sound', soundEnabled?'1':'0'); }catch(e){}
  render();
}

let audioCtx = null;
function getAudioCtx(){
  if(!soundEnabled) return null;
  if(typeof window === 'undefined') return null;
  const Ctor = window.AudioContext || window.webkitAudioContext;
  if(!Ctor) return null;
  if(!audioCtx){
    try{ audioCtx = new Ctor(); }catch(e){ return null; }
  }
  if(audioCtx.state==='suspended'){ audioCtx.resume().catch(()=>{}); }
  return audioCtx;
}
function playTone(freq, duration, type, volume){
  const ctx = getAudioCtx();
  if(!ctx) return;
  try{
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = type || 'sine';
    osc.frequency.value = freq;
    gain.gain.setValueAtTime(volume || 0.12, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + duration);
  }catch(e){}
}
function playCorrectSound(){
  playTone(880, 0.12, 'sine', 0.13);
  setTimeout(()=>playTone(1318, 0.15, 'sine', 0.11), 90);
}
function playWrongSound(){
  playTone(170, 0.22, 'sawtooth', 0.09);
}
function playVictorySound(){
  [523, 659, 784, 1047].forEach((f,i)=> setTimeout(()=>playTone(f, 0.18, 'sine', 0.12), i*100));
}
