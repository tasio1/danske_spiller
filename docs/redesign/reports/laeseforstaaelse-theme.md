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

## Phone tune (laese-ux-tune)
Theme file only. At <=639 px: shared bar 56 -> 36 px (MENU link keeps a 44 px box via negative margin), game header 56 -> 48 px (44 px buttons, inset frames), docked sheet 52 -> 40 dvh. Docked panel (<=1023 portrait too): expanded toggle reads "Skjul spørgsmål" (peek stays in the accessible name, visually hidden), peek with number + question only when collapsed; the wrong-answer box is ordered first in the panel (CSS `order`, DOM unchanged). `.dc-tts-button` opacity forced to 1 (DanskCore sets an inline .5 when no speech voice exists; icon #E6E2D8 on #1F2328 and mustard frame on dark paper, both >3:1).
Measured (reader px / % of viewport), bar 36 + header 48 = 84 px chrome:

| viewport | mode | panel open | panel collapsed | panel px | after wrong |
|---|---|---|---|---|---|
| 360x640 | mc, skim, insert, cloze | 300 / 47 % | 492 / 77 % | 256 | 300 / 47 %, "Næste"/"Prøv igen" 0-100 px below the panel fold (panel scrolls, page never) |
| 390x844 | mc, skim, insert, cloze | 422 / 50 % | 696 / 82 % | 338 | 422 / 50 %, button in view except cloze (panel scroll) |
| before (360 / 390) | all | 195 / 31 % ; 293 / 35 % | 452 / 71 % ; 656 / 78 % | 333 ; 439 | |

Peek visible while expanded: false in all 16 cases (duplicate removed). Active gap visible in insert/cloze, skim notice heading below the nav, page never scrolls, no horizontal overflow. 820x1180: reader 55 / 45 % (open / wrong), unchanged by the tune.
