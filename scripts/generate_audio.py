"""
Procedural soundtrack + SFX library for the Cloud Codes membership reel.

Everything is synthesised from scratch (no samples), so the audio is
royalty-free and reproducible:  python3 scripts/generate_audio.py

Outputs
  public/audio/music.wav      120 BPM track, 80 beats (40 s), arranged to the edit
  public/audio/sfx/*.wav      UI + transition sound effects
"""

import os

import numpy as np
from scipy import signal
from scipy.io import wavfile

SR = 48000
BPM = 120
BEAT = 60 / BPM
TOTAL_BEATS = 80
OUT = os.path.join(os.path.dirname(__file__), '..', 'public', 'audio')
rng = np.random.default_rng(20260930)


# ───────────────────────────── helpers ─────────────────────────────

def T(d):
    return np.arange(int(round(d * SR))) / SR


def noise(n):
    return rng.standard_normal(n)


def butter(x, kind, fc, order=2):
    nyq = SR / 2
    if kind == 'band':
        sos = signal.butter(order, [fc[0] / nyq, min(fc[1] / nyq, 0.99)], 'bandpass', output='sos')
    else:
        sos = signal.butter(order, min(fc / nyq, 0.99), kind, output='sos')
    return signal.sosfilt(sos, x, axis=0)


def lp(x, fc, order=2):
    return butter(x, 'low', fc, order)


def hp(x, fc, order=2):
    return butter(x, 'high', fc, order)


def bp(x, lo, hi, order=2):
    return butter(x, 'band', (lo, hi), order)


def sweep_filter(x, cutoffs, curve, kind='low'):
    """Time-varying filter by crossfading between fixed-cutoff versions.
    curve: array (len x) in [0, 1] selecting position along `cutoffs`."""
    versions = [butter(x, kind, c, 2) for c in cutoffs]
    pos = np.clip(curve, 0, 1) * (len(cutoffs) - 1)
    i0 = np.clip(np.floor(pos).astype(int), 0, len(cutoffs) - 2)
    frac = pos - i0
    out = np.zeros_like(x)
    for k in range(len(cutoffs) - 1):
        m = i0 == k
        out[m] = versions[k][m] * (1 - frac[m]) + versions[k + 1][m] * frac[m]
    return out


def saw(freq, t, phase=0.0):
    return signal.sawtooth(2 * np.pi * freq * t + phase)


def midi(n):
    return 440.0 * 2 ** ((n - 69) / 12)


def adsr(n, a, d, s, r, hold):
    """n samples; a,d,r in seconds; hold = seconds before release starts."""
    t = np.arange(n) / SR
    env = np.where(t < a, t / max(a, 1e-4), 1.0)
    dec = np.clip((t - a) / max(d, 1e-4), 0, 1)
    env = np.where(t >= a, 1 - (1 - s) * dec, env)
    rel = np.clip((t - hold) / max(r, 1e-4), 0, 1)
    return env * (1 - rel)


def stereo(x, pan=0.0, width=0.0):
    """pan -1..1; width adds a tiny Haas delay for space."""
    l = x * np.cos((pan + 1) * np.pi / 4)
    r = x * np.sin((pan + 1) * np.pi / 4)
    if width > 0:
        d = int(width * SR)
        r = np.concatenate([np.zeros(d), r[:-d] if d else r])
    return np.stack([l, r], axis=1)


def reverb(x, secs=1.8, mix=0.25, pre=0.012, bright=6000):
    """Convolution reverb with a synthetic stereo tail."""
    n = int(secs * SR)
    t = np.arange(n) / SR
    tails = []
    for ch in range(2):
        ir = noise(n) * np.exp(-t * (6.9 / secs))
        ir = lp(ir, bright)
        ir[: int(pre * SR)] = 0
        tails.append(ir / np.sqrt(np.sum(ir ** 2)))
    if x.ndim == 1:
        x = np.stack([x, x], axis=1)
    wet = np.stack([signal.fftconvolve(x[:, c], tails[c])[: len(x)] for c in range(2)], axis=1)
    return x * (1 - mix) + wet * mix * 2.2


def norm(x, peak=0.89):
    m = np.max(np.abs(x))
    return x * (peak / m) if m > 0 else x


def fade(x, fin=0.002, fout=0.01):
    n = len(x)
    a = int(fin * SR)
    b_ = int(fout * SR)
    env = np.ones(n)
    if a:
        env[:a] = np.linspace(0, 1, a)
    if b_:
        env[-b_:] *= np.linspace(1, 0, b_)
    return x * (env[:, None] if x.ndim == 2 else env)


def write(name, x, peak=0.89, normalize=True):
    if x.ndim == 1:
        x = np.stack([x, x], axis=1)
    x = fade(x)
    if normalize:
        x = norm(x, peak)
    path = os.path.join(OUT, name)
    wavfile.write(path, SR, (np.clip(x, -1, 1) * 32767).astype(np.int16))
    return x


def place(buf, x, at):
    """Mix stereo x into buf starting at seconds `at`."""
    if x.ndim == 1:
        x = np.stack([x, x], axis=1)
    i = int(round(at * SR))
    if i >= len(buf):
        return
    j = min(len(buf), i + len(x))
    buf[i:j] += x[: j - i]


# ───────────────────────────── drum voices ─────────────────────────────

def kick(d=0.5, f0=165, f1=46, drive=2.2, click=0.35):
    t = T(d)
    freq = f1 + (f0 - f1) * np.exp(-t * 30)
    body = np.sin(2 * np.pi * np.cumsum(freq) / SR) * np.exp(-t * 8)
    knock = np.sin(2 * np.pi * 210 * t) * np.exp(-t * 45) * 0.35
    clk = hp(noise(len(t)), 2500) * np.exp(-t * 380) * click
    return np.tanh((body + knock + clk) * drive) / np.tanh(drive)


def clap(d=0.4):
    t = T(d)
    n = bp(noise(len(t)), 850, 3200)
    env = np.zeros_like(t)
    for k, off in enumerate([0, 0.009, 0.019, 0.03]):
        env += (t >= off) * np.exp(-np.clip(t - off, 0, None) * (260 if k < 3 else 18))
    return n * env


def snare(d=0.3, tune=1.0):
    t = T(d)
    tone = (np.sin(2 * np.pi * 185 * tune * t) + 0.6 * np.sin(2 * np.pi * 330 * tune * t)) * np.exp(-t * 28)
    nz = bp(noise(len(t)), 1500, 9000) * np.exp(-t * 20)
    return tone * 0.7 + nz


def hat(open_=False):
    d = 0.32 if open_ else 0.07
    t = T(d)
    metal = sum(signal.square(2 * np.pi * f * t) for f in (3140, 4270, 5510, 6920, 8250, 9960))
    x = hp(metal * 0.25 + noise(len(t)), 7000)
    return x * np.exp(-t * (13 if open_ else 85))


def crash(d=2.6):
    t = T(d)
    metal = sum(np.sin(2 * np.pi * f * t + rng.uniform(0, 6)) for f in rng.uniform(3000, 12000, 40))
    x = hp(noise(len(t)) + metal * 0.05, 4200)
    return x * (np.exp(-t * 2.2) * 0.8 + np.exp(-t * 12) * 0.4)


# ───────────────────────────── tonal voices ─────────────────────────────

CHORD = {  # Fmaj7 · G6 · Em7 · Am(add9)
    'F': {'bass': 41, 'notes': [53, 57, 60, 64]},
    'G': {'bass': 43, 'notes': [55, 59, 62, 64]},
    'Em': {'bass': 40, 'notes': [52, 55, 59, 62]},
    'Am': {'bass': 45, 'notes': [57, 60, 64, 71]},
}

# one chord per bar (bar = 4 beats); bar 10 is the build, bar 11 the drop
BAR_CHORDS = {
    2: 'F', 3: 'G', 4: 'Em', 5: 'Am',
    6: 'F', 7: 'G', 8: 'Em', 9: 'Am',
    10: 'G',
    11: 'F', 12: 'G', 13: 'Am',
    14: 'F', 15: 'G', 16: 'Em',
    17: 'Am',
}


def supersaw(freq, d, voices=7, detune=0.18, stereo_spread=True):
    t = T(d)
    L = np.zeros_like(t)
    R = np.zeros_like(t)
    for v in range(voices):
        cents = (v - (voices - 1) / 2) / ((voices - 1) / 2) * detune * 100
        f = freq * 2 ** (cents / 1200)
        ph = rng.uniform(0, 2 * np.pi)
        w = saw(f, t, ph)
        pan = (v / (voices - 1)) * 2 - 1 if stereo_spread else 0
        L += w * np.cos((pan + 1) * np.pi / 4)
        R += w * np.sin((pan + 1) * np.pi / 4)
    return np.stack([L, R], axis=1) / voices


def pluck(freq, d=0.3, bright=5200, dark=700, k=16):
    t = T(d)
    x = saw(freq, t) + 0.5 * signal.square(2 * np.pi * freq * 2.001 * t) * 0.3
    e = np.exp(-t * k)
    y = lp(x, bright) * e + lp(x, dark) * (1 - e)
    return y * np.exp(-t * 7.5) * np.clip(t / 0.002, 0, 1)


def bass_note(freq, d, style='pluck'):
    t = T(d)
    sub = np.sin(2 * np.pi * freq * t)
    grit = lp(saw(freq, t), 1100 if style == 'pluck' else 800)
    if style == 'pluck':
        env = np.clip(t / 0.004, 0, 1) * np.exp(-t * 9)
    else:
        env = adsr(len(t), 0.006, 0.2, 0.85, 0.06, d - 0.06)
    return (sub * 0.85 + grit * 0.75) * env


def sidechain(n, start_beat=0.0, depth=0.65, speed=9.0):
    """Ducking envelope that pumps on every beat."""
    t = np.arange(n) / SR + start_beat * BEAT
    since = np.mod(t, BEAT)
    return 1 - depth * np.exp(-since * speed)


# ───────────────────────────── music ─────────────────────────────

def music():
    dur = TOTAL_BEATS * BEAT + 1.5
    N = int(dur * SR)
    drums = np.zeros((N, 2))
    bass = np.zeros((N, 2))
    pads = np.zeros((N, 2))
    arps = np.zeros((N, 2))
    fx = np.zeros((N, 2))

    def at(beat):
        return beat * BEAT

    K = kick()
    K_soft = lp(kick(f0=140, drive=1.6), 900)
    C = clap()
    HC = hat()
    HO = hat(True)
    CR = crash()

    # --- intro (b0–b8): drone + filtered kick build
    t = T(at(8))
    drone = (np.sin(2 * np.pi * midi(33) * t) + 0.5 * np.sin(2 * np.pi * midi(40) * t)) * np.clip(t / 2.5, 0, 1) * 0.16
    place(pads, stereo(drone), 0)
    intro_pad = supersaw(midi(57), at(8)) + supersaw(midi(60), at(8)) + supersaw(midi(64), at(8))
    curve = np.clip(np.linspace(0, 1, len(intro_pad)) ** 1.6, 0, 1)
    intro_pad = np.stack([sweep_filter(intro_pad[:, c], [250, 500, 1000, 2000, 3500], curve) for c in range(2)], axis=1)
    intro_pad *= np.clip(np.linspace(0, 1.4, len(intro_pad)), 0, 1)[:, None] * 0.22
    place(pads, intro_pad, 0)
    for bt in np.arange(4, 8, 1):
        place(drums, stereo(K_soft * 0.55 * (0.6 + 0.1 * (bt - 4))), at(bt))
    for bt in np.arange(6, 8, 0.25):
        place(drums, stereo(snare(tune=1 + (bt - 6) * 0.15) * 0.12 * (bt - 5.5)), at(bt))

    # --- main sections
    def section(b0, b1, kind):
        for bt in np.arange(b0, b1, 1):
            if kind in ('A', 'B', 'drop', 'perks', 'build1'):
                place(drums, stereo(K * (1.0 if kind in ('drop', 'perks') else 0.9)), at(bt))
            if kind in ('B', 'drop', 'perks') and int(bt) % 2 == 1:
                place(drums, stereo(C * 0.55, 0.0, 0.004), at(bt))
            if kind in ('A', 'B', 'drop', 'perks', 'build1'):
                place(drums, stereo(HC * 0.17, 0.3), at(bt + 0.5))
                if kind in ('drop', 'perks', 'B'):
                    place(drums, stereo(HC * 0.12, -0.3), at(bt + 0.25))
                    place(drums, stereo(HC * 0.12, -0.3), at(bt + 0.75))
            if kind in ('B', 'drop') and int(bt) % 2 == 0:
                place(drums, stereo(HO * 0.12, 0.4), at(bt + 0.5))

    section(8, 24, 'A')
    section(24, 40, 'B')
    section(40, 42, 'build1')
    section(44, 56, 'drop')
    section(56, 68, 'perks')

    # crashes on section downbeats
    for bt, g in [(8, 0.4), (24, 0.28), (44, 0.5), (56, 0.35), (72, 0.3)]:
        place(drums, stereo(CR * g, 0.1, 0.006), at(bt))

    # snare roll build (b40–b43.5)
    rolls = [(40, 41, 0.5), (41, 42.5, 0.25), (42.5, 43.5, 0.125)]
    for s0, s1, step in rolls:
        for bt in np.arange(s0, s1, step):
            prog = (bt - 40) / 3.5
            place(drums, stereo(snare(tune=1 + prog * 0.6) * (0.18 + 0.5 * prog)), at(bt))

    # bass
    def bars(b0, b1):
        for bar in range(int(b0 // 4), int(b1 // 4)):
            yield bar, CHORD[BAR_CHORDS[bar]]

    for bar, ch in bars(8, 40):
        f = midi(ch['bass'])
        for k in range(4):
            place(bass, stereo(bass_note(f, 0.22, 'pluck') * 0.8), at(bar * 4 + k + 0.5))
            if bar >= 6:
                place(bass, stereo(bass_note(f * 2, 0.12, 'pluck') * 0.35), at(bar * 4 + k + 0.75))
    for bar, ch in bars(44, 68):
        f = midi(ch['bass'])
        note = bass_note(f, 4 * BEAT, 'sustain')
        note = note * sidechain(len(note), 0, 0.75, 8)
        place(bass, stereo(note * 0.95), at(bar * 4))
    # build: rising bass
    t = T(at(3.5))
    fb = midi(43) * 2 ** (np.clip(t / t[-1], 0, 1) * 1.0)
    rise = np.sin(2 * np.pi * np.cumsum(fb) / SR) * np.linspace(0.2, 0.7, len(t))
    place(bass, stereo(rise), at(40))

    # pads
    def pad_chord(ch, d, cutoff, gain):
        x = sum(supersaw(midi(n), d) for n in ch['notes'])
        x = np.stack([lp(x[:, c], cutoff) for c in range(2)], axis=1)
        env = adsr(len(x), 0.08, 0.4, 0.8, 0.25, d - 0.25)
        return x * env[:, None] * gain

    for bar, ch in bars(8, 40):
        g = 0.13 if bar < 6 else 0.16
        p = pad_chord(ch, 4 * BEAT + 0.2, 1800 if bar < 6 else 3400, g)
        p *= sidechain(len(p), 0, 0.5, 8)[:, None]
        place(pads, p, at(bar * 4))
    # build pad (filter opens)
    ch = CHORD['G']
    p = sum(supersaw(midi(n), at(3.5)) for n in ch['notes'])
    curve = np.linspace(0, 1, len(p)) ** 1.5
    p = np.stack([sweep_filter(p[:, c], [400, 900, 2000, 4500, 9000], curve) for c in range(2)], axis=1)
    place(pads, p * np.linspace(0.08, 0.22, len(p))[:, None], at(40))
    # drop: big supersaw chords, pumping
    for bar, ch in bars(44, 68):
        notes = ch['notes'] + [ch['notes'][0] + 12, ch['notes'][2] + 12]
        x = sum(supersaw(midi(n), 4 * BEAT + 0.1, voices=9, detune=0.22) for n in notes)
        x = np.stack([lp(x[:, c], 5200 if bar < 14 else 3800) for c in range(2)], axis=1)
        env = adsr(len(x), 0.01, 0.3, 0.9, 0.1, 4 * BEAT)
        x *= env[:, None] * sidechain(len(x), 0, 0.8, 7)[:, None]
        place(pads, x * (0.2 if bar < 14 else 0.15), at(bar * 4))
    # outro: breakdown pad + final chord
    for bar, ch in bars(68, 72):
        p = pad_chord(ch, 4 * BEAT + 0.3, 2600, 0.3)
        place(pads, p, at(bar * 4))
    for bt in range(68, 72):
        place(drums, stereo(K_soft * 0.5), at(bt))
        place(drums, stereo(HC * 0.1, 0.3), at(bt + 0.5))
    fin = sum(supersaw(midi(n), 7.5, voices=9, detune=0.2) for n in [53, 57, 60, 64, 65, 69, 72])
    fin = np.stack([lp(fin[:, c], 3200) for c in range(2)], axis=1)
    fin *= adsr(len(fin), 0.02, 1.5, 0.55, 3.0, 4.2)[:, None]
    place(pads, fin * 0.22, at(72))
    sub_fin = bass_note(midi(29), 6.0, 'sustain') * np.exp(-T(6.0) * 0.5)
    place(bass, stereo(sub_fin * 0.9), at(72))

    # arps (16ths)
    pattern = [0, 1, 2, 3, 2, 1, 2, 3, 0, 2, 1, 3, 2, 3, 1, 2]
    for bar, ch in bars(16, 40):
        for k in range(16):
            n = ch['notes'][pattern[k]] + 12
            v = 0.16 if k % 4 == 0 else 0.1
            place(arps, stereo(pluck(midi(n), 0.28) * v, 0.35 if k % 2 else -0.35), at(bar * 4 + k * 0.25))
    for bar, ch in bars(56, 72):
        for k in range(16):
            n = ch['notes'][pattern[k]] + (24 if bar >= 17 else 12)
            v = 0.12 if k % 4 == 0 else 0.07
            if bar >= 17 and k % 2:
                continue
            place(arps, stereo(pluck(midi(n), 0.3, bright=6500) * v, 0.35 if k % 2 else -0.35), at(bar * 4 + k * 0.25))
    # end card sparkle arpeggio
    for i, n in enumerate([72, 76, 79, 84, 88]):
        place(arps, stereo(pluck(midi(n), 0.8, bright=8000, k=8) * 0.12, (i - 2) * 0.3), at(72) + i * 0.09)

    # sub rumble into the drop + silence gap
    gap0, gap1 = int(at(43.5) * SR), int(at(44) * SR)
    for buf in (drums, bass, pads, arps):
        buf[gap0:gap1] *= np.linspace(1, 0, gap1 - gap0)[:, None] ** 3

    arps = reverb(arps, 1.4, 0.3)
    pads = reverb(pads, 2.4, 0.25)
    drums_v = reverb(drums, 1.0, 0.12)
    mix = drums_v * 0.85 + bass * 0.75 + pads * 1.7 + arps * 1.6 + fx
    # gentle master glue + fade tail
    mix = np.tanh(mix * 1.2) / np.tanh(1.2)
    end = int(TOTAL_BEATS * BEAT * SR)
    mix = mix[:end]
    tail = int(1.2 * SR)
    mix[-tail:] *= np.linspace(1, 0, tail)[:, None] ** 2
    return mix


# ───────────────────────────── SFX ─────────────────────────────

def sfx_click():
    t = T(0.09)
    x = hp(noise(len(t)), 2000) * np.exp(-t * 700) * 0.8
    x += np.sin(2 * np.pi * 2400 * t) * np.exp(-t * 900) * 0.5
    x += np.sin(2 * np.pi * 180 * t) * np.exp(-t * 90) * 0.5
    t2 = T(0.09)
    x2 = hp(noise(len(t2)), 3000) * np.exp(-t2 * 900) * 0.4
    out = np.zeros(len(t) + int(0.045 * SR))
    out[: len(x)] += x
    out[int(0.045 * SR): int(0.045 * SR) + len(x2)] += x2
    return out


def sfx_tick(freq=3200, d=0.05):
    t = T(d)
    return np.sin(2 * np.pi * freq * t) * np.exp(-t * 180) + hp(noise(len(t)), 4000) * np.exp(-t * 600) * 0.3


def sfx_pop(f0=380, f1=1100, d=0.16):
    t = T(d)
    f = f0 + (f1 - f0) * (1 - np.exp(-t * 60))
    x = np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-t * 28)
    return x + hp(noise(len(t)), 3000) * np.exp(-t * 400) * 0.2


def sfx_blip(n=84, d=0.18):
    t = T(d)
    f = midi(n)
    return (np.sin(2 * np.pi * f * t) + 0.3 * np.sin(2 * np.pi * f * 2 * t)) * np.exp(-t * 22) * np.clip(t / 0.002, 0, 1)


def sfx_whoosh(d=0.7, lo=300, hi=5000, peak=0.55, pan_move=True):
    t = T(d)
    n = noise(len(t))
    shape = np.where(t / d < peak, np.sin(np.pi / 2 * (t / d) / peak) ** 3, np.cos(np.pi / 2 * ((t / d) - peak) / (1 - peak)) ** 2)
    curve = np.clip(shape, 0, 1)
    x = sweep_filter(n, [lo, lo * 2, (lo + hi) / 3, hi * 0.7, hi], curve, 'low')
    x = hp(x, 120) * shape
    if pan_move:
        pan = np.linspace(-0.7, 0.7, len(t))
        return np.stack([x * np.cos((pan + 1) * np.pi / 4), x * np.sin((pan + 1) * np.pi / 4)], axis=1)
    return x


def sfx_whoosh_big(d=1.2):
    w = sfx_whoosh(d, 150, 3500, 0.6)
    t = T(d)
    rumble = np.sin(2 * np.pi * (60 - 25 * t / d) * t) * np.sin(np.pi * t / d) ** 2 * 0.5
    return w + np.stack([rumble, rumble], axis=1)


def sfx_reverse_swell(d=0.9):
    t = T(d)
    x = hp(noise(len(t)), 2500) * (t / d) ** 3
    tone = saw(midi(69), t) * (t / d) ** 4 * 0.2
    x = lp(x + tone, 9000)
    return reverb(x, 0.8, 0.3)


def sfx_impact(d=2.8, big=True):
    t = T(d)
    f = 30 + 70 * np.exp(-t * 7)
    sub = np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-t * (1.6 if big else 3.5))
    crack = bp(noise(len(t)), 200, 6000) * np.exp(-t * 16)
    body = lp(noise(len(t)), 900) * np.exp(-t * 5) * 0.5
    x = np.tanh((sub * 1.4 + crack * 0.6 + body) * 1.6)
    return reverb(x, 2.2 if big else 1.2, 0.28)


def sfx_riser(d=2.0, f0=200, f1=2400):
    t = T(d)
    p = t / d
    n = noise(len(t))
    x = sweep_filter(n, [f0, f0 * 2, f0 * 4, f1, f1 * 3], p ** 1.3, 'low') * p ** 2
    freq = f0 * (f1 / f0) ** (p ** 1.5) / 2
    tone = signal.sawtooth(2 * np.pi * np.cumsum(freq) / SR) * p ** 2.5 * 0.25
    tone = lp(tone, 5000)
    wob = 1 + 0.25 * np.sin(2 * np.pi * (4 + 12 * p) * t)
    return reverb((x + tone) * wob, 1.0, 0.2)


def sfx_shimmer(d=1.2, base=84, count=26):
    t = T(d)
    x = np.zeros(len(t))
    for i in range(count):
        st = rng.uniform(0, d * 0.6)
        n = base + rng.choice([0, 3, 7, 10, 12, 15, 19, 24])
        tt = np.clip(t - st, 0, None)
        g = (t >= st) * np.exp(-tt * rng.uniform(8, 16)) * rng.uniform(0.3, 1)
        x += np.sin(2 * np.pi * midi(n) * tt) * g
    return reverb(stereo(x / count * 3, 0, 0.012), 1.5, 0.35)


def bell(freq, d=1.4, bright=1.0):
    t = T(d)
    ratios = [1, 2.0, 2.76, 5.4, 8.93]
    amps = [1, 0.5, 0.35 * bright, 0.2 * bright, 0.1 * bright]
    decays = [3, 4.5, 6, 9, 13]
    return sum(a * np.sin(2 * np.pi * freq * r * t) * np.exp(-t * dk) for r, a, dk in zip(ratios, amps, decays))


def sfx_success():
    out = np.zeros(int(1.8 * SR))
    for i, n in enumerate([72, 76, 79, 84]):
        x = bell(midi(n), 1.4) * (0.9 if i == 3 else 0.7)
        s = int(i * 0.075 * SR)
        out[s: s + len(x)] += x[: len(out) - s]
    return reverb(stereo(out, 0, 0.01), 1.6, 0.3)


def sfx_bell_ding():
    x = bell(midi(88), 1.1) * 0.8 + bell(midi(83), 1.1) * 0.4
    return reverb(stereo(x, 0.2), 1.0, 0.25)


def sfx_member_chime():
    out = np.zeros(int(1.6 * SR))
    for i, n in enumerate([79, 86, 91]):
        x = bell(midi(n), 1.2, 0.7)
        s = int(i * 0.11 * SR)
        out[s: s + len(x)] += x[: len(out) - s] * (0.8 - i * 0.15)
    return reverb(stereo(out, 0, 0.01), 1.4, 0.3)


def sfx_card_insert():
    t = T(0.35)
    thump = np.sin(2 * np.pi * (90 + 120 * np.exp(-t * 40)) * t) * np.exp(-t * 22)
    slide = bp(noise(len(t)), 1500, 6000) * np.exp(-((t - 0.02) ** 2) / 0.0006) * 0.4
    clk = sfx_click()
    out = np.zeros(len(t) + len(clk))
    out[: len(t)] += thump * 0.9 + slide
    out[int(0.06 * SR): int(0.06 * SR) + len(clk)] += clk * 0.7
    return out


def sfx_unlock():
    a = sfx_click() * 0.8
    t = T(0.25)
    clack = bp(noise(len(t)), 800, 5000) * np.exp(-t * 60) + np.sin(2 * np.pi * 1400 * t) * np.exp(-t * 70) * 0.5
    out = np.zeros(int(0.5 * SR))
    out[: len(a)] += a
    s = int(0.09 * SR)
    out[s: s + len(clack)] += clack
    sh = sfx_shimmer(0.5, 96, 8)
    out2 = stereo(out)
    place(out2, sh * 0.5, 0.08)
    return out2


def sfx_confetti():
    d = 1.2
    t = T(d)
    pop = sfx_pop(250, 700, 0.12) * 0.9
    crackle = np.zeros(len(t))
    for _ in range(90):
        st = rng.uniform(0.03, d * 0.8)
        i = int(st * SR)
        L = int(0.006 * SR)
        crackle[i: i + L] += hp(noise(L), 3000) * rng.uniform(0.1, 0.5) * np.exp(-np.arange(L) / (0.0015 * SR))
    crackle *= np.exp(-t * 2.2)
    out = crackle
    out[: len(pop)] += pop
    return reverb(stereo(out, 0, 0.01), 0.8, 0.2)


def sfx_chat():
    return sfx_blip(91, 0.12) * 0.6


def sfx_processing(d=1.4):
    t = T(d)
    x = np.zeros(len(t))
    for k in np.arange(0, d, 0.1):
        i = int(k * SR)
        tk = sfx_tick(2600 + 400 * np.sin(k * 7), 0.03) * 0.35
        x[i: i + len(tk)] += tk[: len(x) - i]
    hum = np.sin(2 * np.pi * 110 * t) * 0.08 * np.sin(np.pi * t / d)
    return x + hum


def sfx_glint():
    return sfx_shimmer(0.6, 96, 10)


def sfx_swoosh_up(d=0.35):
    t = T(d)
    x = sweep_filter(noise(len(t)), [800, 1600, 3200, 6400, 9000], (t / d) ** 0.8, 'low')
    return hp(x, 400) * np.sin(np.pi * t / d) ** 2


def sfx_hover():
    return sfx_tick(1800, 0.04) * 0.5


# ───────────────────────────── master ─────────────────────────────

MUSIC_GAIN = 0.72


def limiter(x, ceiling=0.89, look=0.003, hold=0.025):
    """Transparent look-ahead peak limiter (min-filter + smoothed gain)."""
    from scipy.ndimage import minimum_filter1d, uniform_filter1d

    peak = np.max(np.abs(x), axis=1)
    g = np.minimum(1.0, ceiling / np.maximum(peak, 1e-9))
    h = int(hold * SR)
    g = minimum_filter1d(g, size=2 * h + 1)
    g = uniform_filter1d(g, size=h)
    g = minimum_filter1d(g, size=int(look * SR) * 2 + 1)
    return x * g[:, None], g


def master(music_x, bank, cues, fps):
    mix = music_x * MUSIC_GAIN
    mix = np.concatenate([mix, np.zeros((int(0.5 * SR), 2))])
    for cue in cues:
        place(mix, bank[cue['sfx']] * cue['volume'], cue['at'] / fps)
    mix = mix[: len(music_x)]
    pre_peak = np.max(np.abs(mix))
    out, g = limiter(mix)
    print(f'master: pre-limit peak {pre_peak:.2f}, max gain reduction {20 * np.log10(g.min()):.1f} dB, '
          f'limited {100 * np.mean(g < 0.999):.1f}% of samples')
    return out


def generate():
    os.makedirs(os.path.join(OUT, 'sfx'), exist_ok=True)
    fx = {
        'click': sfx_click(),
        'tick': sfx_tick(),
        'hover': sfx_hover(),
        'pop': sfx_pop(),
        'pop_soft': lp(sfx_pop(260, 700, 0.2), 3000),
        'blip': sfx_blip(),
        'blip_hi': sfx_blip(91, 0.14),
        'whoosh': sfx_whoosh(0.6),
        'whoosh_fast': sfx_whoosh(0.32, 500, 7000, 0.6),
        'whoosh_big': sfx_whoosh_big(1.1),
        'swoosh_up': sfx_swoosh_up(),
        'reverse_swell': sfx_reverse_swell(0.9),
        'impact': sfx_impact(2.8, True),
        'impact_soft': sfx_impact(1.4, False),
        'riser': sfx_riser(2.0),
        'riser_long': sfx_riser(4.0, 150, 3200),
        'shimmer': sfx_shimmer(1.3),
        'glint': sfx_glint(),
        'success': sfx_success(),
        'bell': sfx_bell_ding(),
        'member_chime': sfx_member_chime(),
        'card_insert': sfx_card_insert(),
        'unlock': sfx_unlock(),
        'confetti': sfx_confetti(),
        'chat': sfx_chat(),
        'processing': sfx_processing(),
    }
    bank = {}
    for name, x in fx.items():
        bank[name] = write(os.path.join('sfx', f'{name}.wav'), x, 0.89)
    m = write('music.wav', music(), 0.84)
    print('wrote', len(fx), 'sfx + music', f'({len(m) / SR:.2f}s)')

    cue_file = os.path.join(os.path.dirname(__file__), 'cues.json')
    if os.path.exists(cue_file):
        import json

        data = json.load(open(cue_file))
        mix = master(m, bank, data['cues'], data['fps'])
        write('mix.wav', mix, normalize=False)
        print('wrote mix.wav with', len(data['cues']), 'cues')


if __name__ == '__main__':
    generate()
