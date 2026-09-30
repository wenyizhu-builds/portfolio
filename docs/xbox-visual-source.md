# Xbox public campaign visual

- Downloaded: 2026-09-30
- Local file: `.local-assets/xbox-launch/genshin-xbox-official-banner-en.png`
- Dimensions: 1881 × 1080 px (PNG)
- Source page: https://act.hoyoverse.com/ys/event/e20240816natlan-iseatr/index.html
- Source configuration: https://fastcdn.hoyoverse.com/mi18n/hk4e_global/m20240708hy29ca3j0g/m20240708hy29ca3j0g-en-us.json
- Resource key: `banner_3_img`
- Original image: https://fastcdn.hoyoverse.com/mi18n/hk4e_global/m20240708hy29ca3j0g/upload/0b8396672cd2c9aceb9b9b264f9e4675_1948806863007306989.png
- Official banner title: Genshin Impact Is Coming to Xbox
- SHA-256: cd90b26b8b727443413c353a828486bf795b926d49772f46afdfa23ac5d3fffb
- Visually matched to the owner-provided screenshot; downloaded unchanged. Public availability is verified; no reuse license was verified.

- QR-blurred candidate: `.local-assets/xbox-launch/genshin-xbox-banner-en-qr-blurred.png` (imagegen edit; original preserved).
- Owner decision 2026-09-30: keep both image candidates local, defer gallery layout and website integration. `.local-assets/` is ignored by Git and excluded from the public build.

## 2026-09-30 — floating visual experiment

Owner supplied a clean, borderless, already QR-blurred PNG (2246 × 1248). Preserved as `.local-assets/xbox-launch/genshin-xbox-owner-clean-qr-blurred.png`. The public assets are JPEG encodings of that supplied image: `public/media/xbox-launch/genshin-xbox-banner-en-qr-blurred.jpg` (full size) and `genshin-xbox-thumb.jpg` (640 px wide). No additional generative edits were made.

Xbox now uses one floating thumbnail, sampled only in the upper half of the map area. The entire right column, including the gap between INDEX and the case card, is excluded. DOM bounds of nodes and connectors are checked with clearance; when no safe position exists, the thumbnail stays hidden. Click opens a modal full-image viewer; close button / Escape return to the case. No Map/Visual toggle. Fixed startup delay removed; thumbnail is about 87 KB rather than loading the 4.3 MB PNG.

Validation: build:file passed; desktop browser confirmed visible upper-half placement, zero map overlaps, outside the card column, and successful modal open/close. Mobile uses a dedicated image block. Not pushed in this iteration.
