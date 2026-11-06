The last builder's section and the last judge's verdict; paprika-loop/PROGRESS.md holds every session's.

## Iteration 3
**Did**
- Finish replay camera (`updateCamera`, kind `finish`, plus the start pose in the finish-replay setup in game.js): now a low head-on cam at (FINISH_X+7, 1.1, 3.2) looking back down the track, fov 30→26, instead of the live side view.
- `body.pfin #replay .tag` moved to top:15vh, so it no longer sits on `div#pfc` (lower left).
- `__game.subject` now `'tote-board'` (a Group named in view.js; look may still say it is not in the scene).
**Saw**
- Black lower-left rectangle: it is the tote box (`div#tote`, [18,16,335,207]) mirrored vertically (y 593–784). It vanished when `#tote` was set to display:none. The render target read back by `readRenderTargetPixels` at that spot is normal colour. Swapping the silk `<img>` for a canvas did not remove it (reverted). I take it as a harness screenshot artifact (DOM drawn into the GL capture), not in the page's own render; unproven in a real browser.
- Finish replay seen (frame 1702+150): sepia, sprocket frame, `PHOTO FINISH` title, scratches, head-on view with checkered line; `REPLAY 0.25x` tag [112,120,379,158] and `#pfc` [300,688,979,723] no longer overlap. Dead heat still `BY 0.00 SEC`, both leaders finishT 24.1.
- No-input race: Dusty Rhodes pitch 3.12, plants 5; YOU idle at x 2.27. `look` still warns that the last render call drew into a render target (the replay's broadcast pass; `setRenderTarget(null)` does run in broadcast.js:94, so it reads as a harness note). perf not run; draw calls still ~443.
**Next**
- Dead heat reads scripted: break the AI tie (vary finishT by seed) so gaps like 0.03–0.4 s appear.
- Cut draw calls (<250): merge crowd, fence, ad boards into InstancedMesh; run `perf`.
- Play real keys (Q/P/W/O, then Digit2) through to the results card; the player still sits at the start with the camera on the leader, so make the player visible/relevant.
**Open**
- The black-rectangle cause is inferred only; check `look` sample at (100,520) in the next session after any tote edit.
- The first plant-replay frame brightness was not re-measured.
- Film grain in broadcast.js lowered 0.16→0.10 (look flagged the full-screen `PlaneGeometry` quad as noisy; grain is intended by LOOK.md).

### Judge 3

**Scores (Must have, in order)**

1. **Plays as DESIGN.md says: 6.** The solo race with 3 AI runs, and the `div#keys` panel, `1 PLAYER`, `2 PLAYERS (2)` and `RESTART` are on screen. I held Q, P, W and O in alternation for about 160 frames. `YOU` went from x 1.41 to 3.93 and then went `state:"down"` (`plants:1`, `pitch -0.33`). The AI were at x 10–12 by then. The player is still far behind and mostly off camera. I did not reach the results card or play 2-player.
2. **Rapier ragdoll, face-plant and auto-right: 7.** The mistimed keys gave a real face-plant on `YOU` (`down`, `plants:1`). The earlier sessions saw `Dusty Rhodes` plant 5 times and horses return to `"run"`. I did not re-measure the auto-right time.
3. **Replay and sepia photo finish: 7.** I did not see a replay this session. The `look` sheet never finished: the page ran 601 s and the harness closed it. The last session's evidence stands (sepia, sprocket frame, `PHOTO FINISH`, head-on cam). The head-on cam and the `REPLAY 0.25x` and `div#pfc` overlap fix are unverified in a picture.
4. **Photo finish and tangled collapse within a minute: 7.** I did not run a no-input race to the finish. The last session had a dead heat with both leaders at `finishT` 24.1 exactly, which looks scripted.
5. **Results with most-face-plants award: 5.** Not reached this session. It was seen only in an early session.
6. **Looks as LOOK.md says: 7.** The toon shading with outlines, the 70s palette, the warm light and the CRT vignette all hold. Pictures read as a finished broadcast, except for the black rectangle.
7. **`window.__game`, static, no network: 7.** `observe` works. Assets are 0.32 MB with fonts vendored. `perf` shows 429 draw calls and 184k triangles in `scene of 131 objects`. The 157 ms frame is a software renderer, so it is not a fault. `subject` is `"tote-board"` and `look` says it is not in the scene.
8. **Horses match CHARACTERS.md and horse.png: 7.** The silks differ (`polka dots`, `stripes`, `chevrons`). The saddle-cloth numbers, blinkers, white socks, dark hooves and mane are right. The legs are shorter than the "long wobbly" brief.
9. **Broadcast overlay: 8.** `div#tote` has silks, odds and face-plant counts. `div#top-r` has `LIVE`, the `3:58 PM` clock and `RACE TIME`. `div#lower` has the `PLAY-BY-PLAY · HANK "HOOFBEAT" PRUITT` lower-third. The black rectangle sits right above it and hurts this item.
10. **Camera: 7.** The side-tracking telephoto on the pack reads well. The head-on and replay cams were not seen this session.
11. **Controls feel learnable: 5.** Alternating Q+P then W+O gave a net 2.5 m in 2.7 s and then a face-plant. The AI cover about 10 m in that time. The player rarely keeps up, and the camera follows the leader pack, so the player is hard to follow.
12. **Local 2-player, discoverable: 6.** The `2 PLAYERS (2)` button and the tips line are on screen. I did not play it.
13. **Style judged as hard as gameplay: 7.** The look is strong and it reads as a 1970s TV race. The black rectangle is a visible flaw in every live picture. `reference` against `LOOK-board.png` was not run.

**Faults: 4.**
- The black rectangle is still in the live picture at about [14,475,270,615] in the 1024-wide picture, directly above `div#lower`. The last builder called it a harness artifact. I see it in the harness picture too, so a real browser is unproven either way.
- `look` with `sheet` at frames 1500–1750 on this software renderer hung for 601 s, so replays are hard to inspect.
- `perf` is not a fault on this host (software renderer), but 429 draw calls is heavy.
- `__game.subject` points at an object that is not found.

**Next:**
1. **Black rectangle** (asked again). Treat it as real, since the page's own CSS is the only thing that can draw it. In `index.html` or the CSS, remove the `#tote` mirrored or reflected element, any `::after` or `-webkit-box-reflect`, and any `backdrop-filter` on `#tote`. Then check whether `#crt`'s background image tiles. Done when one `look` with `sample` at (100,520) and (100,580) reads track or grass colour (orange or green), not near-black. Test it by temporarily setting `#tote{display:none}` and `#crt{display:none}` in separate `look` calls.
2. **Make the player relevant and the controls forgiving.** The camera should include `YOU` (frame the pack plus the player, or switch to the player when they lag). Add key-hold assist so Q+P then W+O gives steady forward motion. An `interact` with the alternating keys for 600 frames should end with `YOU` at x ≥ 25 and `plants` ≤ 1, after which one finish can be reached.
3. **Replay verification and draw calls.** The finish replay must be inspectable without a 600 s hang: lower `sheet` cost by ending replays with a quicker `{state:{...}}` jump. Break the AI dead heat (a seeded `finishT` gap of 0.03–0.4 s). Cut draw calls (<250) by turning the crowd, fence and ad boards into `InstancedMesh`. Use `perf` with `costs:true` to show it.

SCORE: 6.5
