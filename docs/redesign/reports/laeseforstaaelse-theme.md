# Læseforståelse - theme report (designer, not the tester)

Files: `shared/themes/laeseforstaaelse.css` (new), `laeseforstaaelse/index.html` (head links, start sprite, sd-arr arrows, guarded fx hooks, results sprite).
Screenshots: `docs/redesign/screenshots/laeseforstaaelse/<viewport>-<screen>.png` (1440x900, 820x1180, 360x640: start, play per mode, correct/wrong per mode, results, sepia/dark, reduced).

## Decisions
- The game's paper switch (`data-paper`) drives every colour, including all `--sd-*` tokens the shared bar/TTS button read, so the shared MØRK toggle cannot desync the chrome from the reading paper. The bar's MØRK/LYD buttons are hidden (duplicates of the game's Papir/Lyd).
- Reading pane stays calm: system serif, no motion, highlighter #E0B43C (dark paper: #6F540C fill, #FFF1C4 text, gold frame) plus a pixel frame, so evidence is never colour-only.
- Wrong colour is rose #B3174F (not #9B3D3D) to avoid the Skrivekontrollen proof red #A13D3D; sepia paper #EADFC8 is within a hair of Skrivekontrollen's #E8E0C8 (collision, PM to decide).
- Wrong feedback: icon + "Ikke rigtigt" tag + text, no shake. Correct: pop + burst on the answered button only; results use a local burst by the sprite instead of confetti over the text.
- `.sd-pre{pointer-events:none}` so the first-visit curtain never swallows the first click or delays the 700-900 ms auto-advance.

## Checks
smoke exit 0. Spec (sections minus `round`): 169 PASS, 2 FAIL, both already failing on the base (data validator expects 0,1,0,0; persist scroll). `round` section crashes at `#btn-continue` identically on base and after (stale single-text assumption in the test; 17 PASS before the crash in both).
Contrast (spec, all papers, both widths) all >= 4.5: light body 14.9 / evidence 8.7, sepia 11.6 / 8.7, dark 13.6 / 6.3, marginNumber >= 6.3. Chars per line unchanged: median 64, max 69 at 1920/1440/1280/1024/820.

## Requests / notes
- Sprite: no reading/newspaper sprite exists; start uses `lup` (belongs to Ordstillingsdetektiven). Request `avis`.
- 360x640 reading pane is 195 px (was ~250) because of the shared bar; a `data-sd-nobar` or slimmer bar on phones would help.
- Dark paper: the shared `.dc-tts-button` icon looks dim (tts-button.css, frozen).
