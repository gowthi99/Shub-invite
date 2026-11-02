// Gentle generative ambient loop built with the Web Audio API — no audio files.
// A soft pad plays a I–V–vi–IV progression while a plucked, bell-like melody wanders over a
// major pentatonic scale, through a lowpass filter and a feedback delay for a dreamy space.

type Ctx = AudioContext;

const BPM = 66;
const BEAT = 60 / BPM;
const BAR = BEAT * 4;
const ROOT = 62; // D4

// Progression in semitones from root: I, V, vi, IV
const CHORDS = [
  [0, 4, 7],
  [7, 11, 14],
  [9, 12, 16],
  [5, 9, 12],
];
const PENTA = [0, 2, 4, 7, 9, 12, 14, 16, 19, 21];

const midiHz = (m: number) => 440 * Math.pow(2, (m - 69) / 12);

export class AmbientMusic {
  private ctx: Ctx | null = null;
  private master: GainNode | null = null;
  private bus: GainNode | null = null;
  private timer: ReturnType<typeof setInterval> | null = null;
  private nextBarTime = 0;
  private bar = 0;
  private lastNote = 4;
  playing = false;

  /** Must be called from a user gesture (tap) the first time. */
  async start() {
    if (typeof window === "undefined") return;
    const AC: typeof AudioContext | undefined =
      window.AudioContext ?? (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
    if (!AC) return;
    if (!this.ctx) {
      const ctx = new AC();
      this.ctx = ctx;
      const master = ctx.createGain();
      master.gain.value = 0;
      const comp = ctx.createDynamicsCompressor();
      comp.threshold.value = -18;
      comp.ratio.value = 3;
      master.connect(comp).connect(ctx.destination);

      const lp = ctx.createBiquadFilter();
      lp.type = "lowpass";
      lp.frequency.value = 2600;
      lp.Q.value = 0.4;

      const bus = ctx.createGain();
      bus.gain.value = 1;
      bus.connect(lp);
      lp.connect(master);

      // Feedback delay "reverb"
      const delay = ctx.createDelay(2);
      delay.delayTime.value = BEAT * 0.75;
      const fb = ctx.createGain();
      fb.gain.value = 0.38;
      const wet = ctx.createGain();
      wet.gain.value = 0.35;
      const dlp = ctx.createBiquadFilter();
      dlp.type = "lowpass";
      dlp.frequency.value = 1800;
      lp.connect(delay);
      delay.connect(dlp).connect(fb).connect(delay);
      dlp.connect(wet).connect(master);

      this.master = master;
      this.bus = bus;
    }
    const ctx = this.ctx;
    if (ctx.state === "suspended") await ctx.resume().catch(() => {});
    if (this.playing) return;
    this.playing = true;
    const now = ctx.currentTime;
    this.master!.gain.cancelScheduledValues(now);
    this.master!.gain.setValueAtTime(this.master!.gain.value, now);
    this.master!.gain.linearRampToValueAtTime(0.32, now + 2.5);
    this.nextBarTime = Math.max(this.nextBarTime, now + 0.1);
    this.schedule();
    this.timer = setInterval(() => this.schedule(), 250);
  }

  stop() {
    if (!this.ctx || !this.master || !this.playing) return;
    this.playing = false;
    const now = this.ctx.currentTime;
    this.master.gain.cancelScheduledValues(now);
    this.master.gain.setValueAtTime(this.master.gain.value, now);
    this.master.gain.linearRampToValueAtTime(0, now + 0.6);
    if (this.timer) clearInterval(this.timer);
    this.timer = null;
    const ctx = this.ctx;
    setTimeout(() => {
      if (!this.playing) ctx.suspend().catch(() => {});
    }, 700);
  }

  dispose() {
    if (this.timer) clearInterval(this.timer);
    this.timer = null;
    this.playing = false;
    this.ctx?.close().catch(() => {});
    this.ctx = null;
    this.master = null;
    this.bus = null;
  }

  private schedule() {
    const ctx = this.ctx;
    if (!ctx || !this.playing) return;
    // Look ahead ~1.5 bars
    while (this.nextBarTime < ctx.currentTime + BAR * 1.5) {
      this.playBar(this.nextBarTime, this.bar);
      this.nextBarTime += BAR;
      this.bar++;
    }
  }

  private playBar(t: number, bar: number) {
    const chord = CHORDS[bar % CHORDS.length];
    // Pad: low root + chord tones
    this.pad(midiHz(ROOT - 24 + chord[0]), t, BAR * 1.05, 0.05);
    chord.forEach((n) => this.pad(midiHz(ROOT - 12 + n), t, BAR * 1.05, 0.03));

    // Melody: gentle pentatonic walk, 5–7 notes per bar, resolving to chord tones on downbeats
    const steps = [0, 1, 1.5, 2, 3, 3.5];
    for (const s of steps) {
      if (s !== 0 && Math.random() < 0.3) continue;
      let idx: number;
      if (s === 0) {
        const chordTone = chord[Math.floor(Math.random() * chord.length)] % 12;
        idx = PENTA.findIndex((p) => p % 12 === chordTone);
        if (idx < 0) idx = this.lastNote;
        if (Math.abs(idx - this.lastNote) > 4 && idx + 5 < PENTA.length) idx += 5;
      } else {
        const move = [-2, -1, -1, 1, 1, 2][Math.floor(Math.random() * 6)];
        idx = Math.min(PENTA.length - 1, Math.max(0, this.lastNote + move));
      }
      this.lastNote = idx;
      this.pluck(midiHz(ROOT + PENTA[idx]), t + s * BEAT, s === 0 ? 0.11 : 0.075);
    }
  }

  private pad(freq: number, t: number, dur: number, vol: number) {
    const ctx = this.ctx!;
    const g = ctx.createGain();
    g.gain.setValueAtTime(0, t);
    g.gain.linearRampToValueAtTime(vol, t + dur * 0.35);
    g.gain.linearRampToValueAtTime(vol * 0.8, t + dur * 0.7);
    g.gain.linearRampToValueAtTime(0, t + dur);
    g.connect(this.bus!);
    for (const detune of [-6, 6]) {
      const o = ctx.createOscillator();
      o.type = "triangle";
      o.frequency.value = freq;
      o.detune.value = detune;
      o.connect(g);
      o.start(t);
      o.stop(t + dur + 0.05);
    }
  }

  private pluck(freq: number, t: number, vol: number) {
    const ctx = this.ctx!;
    const g = ctx.createGain();
    g.gain.setValueAtTime(0, t);
    g.gain.linearRampToValueAtTime(vol, t + 0.012);
    g.gain.exponentialRampToValueAtTime(0.0008, t + 2.2);
    g.connect(this.bus!);
    const o = ctx.createOscillator();
    o.type = "sine";
    o.frequency.value = freq;
    o.connect(g);
    // soft bell overtone
    const o2 = ctx.createOscillator();
    o2.type = "sine";
    o2.frequency.value = freq * 3;
    const g2 = ctx.createGain();
    g2.gain.setValueAtTime(vol * 0.18, t);
    g2.gain.exponentialRampToValueAtTime(0.0005, t + 0.8);
    o2.connect(g2).connect(this.bus!);
    o.start(t);
    o2.start(t);
    o.stop(t + 2.3);
    o2.stop(t + 0.9);
  }
}
