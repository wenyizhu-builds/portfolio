/* v64.16 — the promo video's own controls (owner: needs pause, a YouTube-style progress bar to jump around, and no endless loop).
   Markup from videoHtml(), behaviour from wireVideo(). Plays once, muted, then stops on a replay button. */
import { L } from './blocks';
import { esc, reducedMotion } from './state';

const ICON = {
  play: '<path class="fill" d="M8 5.5v13l10.5-6.5z"/>',
  pause: '<path class="fill" d="M7 5h3.5v14H7zM13.5 5H17v14h-3.5z"/>',
  replay: '<path d="M4.5 12a7.5 7.5 0 1 0 2.2-5.3"/><path d="M4.5 4.5v4h4"/>',
  sound: '<path class="fill" d="M4 9h4l5-4v14l-5-4H4z"/><path class="on" d="M16.5 8.5a5 5 0 0 1 0 7M19 6a8.5 8.5 0 0 1 0 12"/><path class="off" d="M16 9l6 6M22 9l-6 6"/>',
};
const svg = (k: keyof typeof ICON) => `<svg viewBox="0 0 24 24" aria-hidden="true">${ICON[k]}</svg>`;
const clock = (s: number) => { const v = Math.max(0, Math.floor(s || 0)); return `${Math.floor(v / 60)}:${String(v % 60).padStart(2, '0')}`; };

export function videoHtml(sources: string[], poster: string, w: number, h: number) {
  return `<div class="pv${reducedMotion.matches ? ' is-paused' : ''}">
    <video poster="${esc(poster)}" width="${w}" height="${h}" muted playsinline preload="metadata"${reducedMotion.matches ? '' : ' autoplay'}>${sources
      .map((s) => `<source src="${esc(s)}" type="video/${s.split('.').pop()}"/>`).join('')}</video>
    <div class="pv-ctl">
      <button class="pv-btn pv-play" type="button" aria-label="${esc(L('pause'))}">${svg('play')}${svg('pause')}${svg('replay')}</button>
      <div class="pv-bar" role="slider" tabindex="0" aria-label="${esc(L('videoProgress'))}" aria-valuemin="0" aria-valuemax="0" aria-valuenow="0"><i class="pv-fill"></i><b class="pv-knob"></b></div>
      <span class="pv-time">0:00 / 0:00</span>
      <button class="pv-btn pv-sound" type="button" aria-label="${esc(L('soundOn'))}">${svg('sound')}</button>
    </div></div>`;
}

export function wireVideo(root: HTMLElement) {
  const box = root.querySelector<HTMLElement>('.pv');
  const v = box?.querySelector('video');
  if (!box || !v) return;
  const bar = box.querySelector<HTMLElement>('.pv-bar')!, fill = box.querySelector<HTMLElement>('.pv-fill')!, knob = box.querySelector<HTMLElement>('.pv-knob')!;
  const time = box.querySelector<HTMLElement>('.pv-time')!, play = box.querySelector<HTMLButtonElement>('.pv-play')!, sound = box.querySelector<HTMLButtonElement>('.pv-sound')!;
  let raf = 0, dragging = false;

  const draw = () => {
    const d = v.duration || 0, p = d ? v.currentTime / d : 0;
    fill.style.transform = `scaleX(${p})`;
    knob.style.left = `${p * 100}%`;
    time.textContent = `${clock(v.currentTime)} / ${clock(d)}`;
    bar.setAttribute('aria-valuemax', String(Math.round(d)));
    bar.setAttribute('aria-valuenow', String(Math.round(v.currentTime)));
    bar.setAttribute('aria-valuetext', time.textContent);
  };
  // the bar moves smoothly only while the video plays; nothing runs when it is paused (L4)
  const tick = () => { draw(); raf = v.paused ? 0 : requestAnimationFrame(tick); };
  const state = () => {
    box.classList.toggle('is-paused', v.paused && !v.ended);
    box.classList.toggle('is-ended', v.ended);
    play.setAttribute('aria-label', L(v.ended ? 'replay' : v.paused ? 'play' : 'pause'));
    if (!v.paused && !raf) raf = requestAnimationFrame(tick);
    draw();
  };
  ['play', 'pause', 'ended', 'loadedmetadata', 'seeked'].forEach((e) => v.addEventListener(e, state));

  const toggle = () => { if (v.paused || v.ended) void v.play().catch(() => {}); else v.pause(); };
  play.onclick = toggle;
  v.onclick = toggle;
  sound.onclick = () => {
    v.muted = !v.muted;
    if (!v.muted && (v.paused || v.ended)) void v.play().catch(() => {});
    sound.classList.toggle('is-on', !v.muted);
    sound.setAttribute('aria-label', L(v.muted ? 'soundOn' : 'soundOff'));
  };

  // seeking: click or drag anywhere on the bar; every way a drag can end goes through one function (L5)
  const seekTo = (x: number) => { const r = bar.getBoundingClientRect(); if (v.duration) v.currentTime = Math.min(1, Math.max(0, (x - r.left) / r.width)) * v.duration; draw(); };
  const end = (e: PointerEvent) => { if (!dragging) return; dragging = false; box.classList.remove('is-seeking'); if (bar.hasPointerCapture(e.pointerId)) bar.releasePointerCapture(e.pointerId); };
  bar.addEventListener('pointerdown', (e) => { dragging = true; box.classList.add('is-seeking'); bar.setPointerCapture(e.pointerId); seekTo(e.clientX); });
  bar.addEventListener('pointermove', (e) => { if (dragging) seekTo(e.clientX); });
  ['pointerup', 'pointercancel', 'lostpointercapture'].forEach((n) => bar.addEventListener(n, (e) => end(e as PointerEvent)));
  bar.addEventListener('keydown', (e) => {
    const step = { ArrowLeft: -5, ArrowRight: 5, Home: -Infinity, End: Infinity }[e.key];
    if (step === undefined || !v.duration) return;
    e.preventDefault(); v.currentTime = Math.min(v.duration, Math.max(0, v.currentTime + step)); draw();
  });
  state();
}

/** Pause the promo video (when the prototype opens or the gallery is left). Returns whether it was playing. */
export function pauseVideo(root: HTMLElement): HTMLVideoElement | null {
  const v = root.querySelector<HTMLVideoElement>('.pv video');
  if (!v || v.paused) return null;
  v.pause();
  return v;
}
