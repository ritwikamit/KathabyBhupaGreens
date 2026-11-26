'use client';

let sharedAudioCtx: AudioContext | null = null;
let sharedNoiseBuffer: AudioBuffer | null = null;

function getAudioContext(): AudioContext | null {
  if (typeof window === 'undefined') return null;
  const Ctx =
    window.AudioContext ||
    (window as unknown as { webkitAudioContext?: typeof AudioContext })
      .webkitAudioContext;
  if (!Ctx) return null;

  if (!sharedAudioCtx) {
    try {
      sharedAudioCtx = new Ctx();
    } catch {
      return null;
    }
  }

  if (sharedAudioCtx.state === 'suspended') {
    sharedAudioCtx.resume().catch(() => undefined);
  }

  return sharedAudioCtx;
}

/**
 * Creates a reusable 1-second organic pink-noise buffer (natural paper texture).
 */
function getPinkNoiseBuffer(ctx: AudioContext): AudioBuffer {
  if (sharedNoiseBuffer && sharedNoiseBuffer.sampleRate === ctx.sampleRate) {
    return sharedNoiseBuffer;
  }

  const length = Math.floor(ctx.sampleRate * 1.0);
  const buffer = ctx.createBuffer(1, length, ctx.sampleRate);
  const output = buffer.getChannelData(0);

  let b0 = 0;
  let b1 = 0;
  let b2 = 0;
  let b3 = 0;
  let b4 = 0;
  let b5 = 0;
  let b6 = 0;

  for (let i = 0; i < length; i++) {
    const white = Math.random() * 2 - 1;
    b0 = 0.99886 * b0 + white * 0.0555179;
    b1 = 0.99332 * b1 + white * 0.0750759;
    b2 = 0.96900 * b2 + white * 0.1538520;
    b3 = 0.86650 * b3 + white * 0.3104856;
    b4 = 0.55000 * b4 + white * 0.5329522;
    b5 = -0.7616 * b5 - white * 0.0168980;
    const pink = b0 + b1 + b2 + b3 + b4 + b5 + b6 + white * 0.5362;
    b6 = white * 0.115926;
    output[i] = Math.max(-1, Math.min(1, pink * 0.11));
  }

  sharedNoiseBuffer = buffer;
  return buffer;
}

/**
 * Synthesizes a realistic crisp paper page-turn sound:
 * 1) Initial thumb/paper friction rustle
 * 2) Sweeping mid-high fibrous air swoosh across the arch of the turn
 * 3) Soft muted paper settle onto the opposing stack
 */
export function playPageTurnSound(direction: 1 | -1 = 1) {
  try {
    const ctx = getAudioContext();
    if (!ctx) return;

    const now = ctx.currentTime;
    const noiseBuffer = getPinkNoiseBuffer(ctx);

    // Master gentle level tailored for warm dining ambiance
    const masterGain = ctx.createGain();
    masterGain.gain.setValueAtTime(0.42, now);
    masterGain.connect(ctx.destination);

    // Layer 1: Crisp paper edge friction & sweep
    const sweepSrc = ctx.createBufferSource();
    sweepSrc.buffer = noiseBuffer;
    sweepSrc.playbackRate.setValueAtTime(direction > 0 ? 1.0 : 0.94, now);

    const bandpass = ctx.createBiquadFilter();
    bandpass.type = 'bandpass';
    bandpass.Q.setValueAtTime(1.35, now);
    bandpass.frequency.setValueAtTime(direction > 0 ? 2200 : 1850, now);
    bandpass.frequency.exponentialRampToValueAtTime(3400, now + 0.075);
    bandpass.frequency.exponentialRampToValueAtTime(920, now + 0.27);

    const sweepGain = ctx.createGain();
    sweepGain.gain.setValueAtTime(0.0001, now);
    sweepGain.gain.linearRampToValueAtTime(0.24, now + 0.032);
    sweepGain.gain.exponentialRampToValueAtTime(0.11, now + 0.15);
    sweepGain.gain.exponentialRampToValueAtTime(0.001, now + 0.30);

    sweepSrc.connect(bandpass);
    bandpass.connect(sweepGain);
    sweepGain.connect(masterGain);

    sweepSrc.start(now, Math.random() * 0.25);
    sweepSrc.stop(now + 0.32);

    // Layer 2: Delicate high-frequency parchment crispness
    const crispSrc = ctx.createBufferSource();
    crispSrc.buffer = noiseBuffer;

    const highpass = ctx.createBiquadFilter();
    highpass.type = 'highpass';
    highpass.frequency.setValueAtTime(3800, now);

    const crispGain = ctx.createGain();
    crispGain.gain.setValueAtTime(0.0001, now);
    crispGain.gain.linearRampToValueAtTime(0.075, now + 0.024);
    crispGain.gain.exponentialRampToValueAtTime(0.001, now + 0.14);

    crispSrc.connect(highpass);
    highpass.connect(crispGain);
    crispGain.connect(masterGain);

    crispSrc.start(now, 0.35 + Math.random() * 0.2);
    crispSrc.stop(now + 0.16);

    // Layer 3: Soft muffled paper landing settle
    const settleTime = now + 0.21;
    const settleOsc = ctx.createOscillator();
    settleOsc.type = 'triangle';
    settleOsc.frequency.setValueAtTime(175, settleTime);
    settleOsc.frequency.exponentialRampToValueAtTime(72, settleTime + 0.075);

    const settleGain = ctx.createGain();
    settleGain.gain.setValueAtTime(0.0001, settleTime);
    settleGain.gain.linearRampToValueAtTime(0.055, settleTime + 0.012);
    settleGain.gain.exponentialRampToValueAtTime(0.0001, settleTime + 0.085);

    settleOsc.connect(settleGain);
    settleGain.connect(masterGain);

    settleOsc.start(settleTime);
    settleOsc.stop(settleTime + 0.095);
  } catch {
    // Gracefully ignore audio context errors on restricted browsers
  }
}

/**
 * Synthesizes a warm hardcover book open/close leather rustle + soft felt settle.
 */
export function playBookCoverSound(opening: boolean) {
  try {
    const ctx = getAudioContext();
    if (!ctx) return;

    const now = ctx.currentTime;
    const noiseBuffer = getPinkNoiseBuffer(ctx);

    const masterGain = ctx.createGain();
    masterGain.gain.setValueAtTime(0.38, now);
    masterGain.connect(ctx.destination);

    const rustleSrc = ctx.createBufferSource();
    rustleSrc.buffer = noiseBuffer;

    const filter = ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.Q.setValueAtTime(1.1, now);
    filter.frequency.setValueAtTime(opening ? 950 : 1400, now);
    filter.frequency.exponentialRampToValueAtTime(
      opening ? 2100 : 520,
      now + 0.28,
    );

    const rustleGain = ctx.createGain();
    rustleGain.gain.setValueAtTime(0.0001, now);
    rustleGain.gain.linearRampToValueAtTime(0.16, now + 0.045);
    rustleGain.gain.exponentialRampToValueAtTime(0.001, now + 0.34);

    rustleSrc.connect(filter);
    filter.connect(rustleGain);
    rustleGain.connect(masterGain);

    rustleSrc.start(now, Math.random() * 0.3);
    rustleSrc.stop(now + 0.36);

    // Subtle bound spine thud
    const thudTime = opening ? now + 0.02 : now + 0.22;
    const osc = ctx.createOscillator();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(opening ? 130 : 115, thudTime);
    osc.frequency.exponentialRampToValueAtTime(52, thudTime + 0.11);

    const thudGain = ctx.createGain();
    thudGain.gain.setValueAtTime(0.0001, thudTime);
    thudGain.gain.linearRampToValueAtTime(0.095, thudTime + 0.015);
    thudGain.gain.exponentialRampToValueAtTime(0.0001, thudTime + 0.13);

    osc.connect(thudGain);
    thudGain.connect(masterGain);

    osc.start(thudTime);
    osc.stop(thudTime + 0.14);
  } catch {
    // Gracefully ignore audio context restrictions
  }
}
