**Judge 28.** I played the opening, a pulse run, and the plant replay, and ran `perf` once with `costs`. There were no console errors. I did not reach a human finish, the sepia PHOTO FINISH replay or the head-on cut. The last `look` flagged that every render call drew into a render target, so that picture may be a frame from earlier than the state it was taken at.

1. **Plays as DESIGN.md's Core loop and Controls say: 7.** The `GO!` start, `div#keys` and `div#tips` all show. I held Q+P then W+O in 18-frame pulses from the start. At raceT 5.25 YOU was at x 3.66 against 9–11 for the AI, with `plants:1` and a pitch low of -0.73 at frame 186. The new start guard did not stop that dip. In 2-player mode and R restart I only read the keys line. I did not play either.
2. **Real Rapier jointed ragdoll horses, face-plant collapse and auto-right: 8.** The horse states `run` and `down` change, the `legs` strings (`"0110"`, `"1001"`) show the legs driven, and the sound log shows thud, gasp and boing. The ragdoll collapse on the AI horses at x ~15 gave `tangles:1`. I did not see the ~2 s auto-right clearly.
3. **Replay (last ~4 s, 0.25x, Space skips, sepia photo-finish): 6.** `replay{kind:"plant",rate:0.25}` runs, with the red "INSTANT REPLAY · 0.25X" tag, "SPACE to skip" and a letterbox. I saw the plant replay but not the sepia finish replay. The plant replay frame looks little different from live play, apart from the letterbox and tag. This is the first judge to see a replay frame. The sepia, grain, scratches and "PHOTO FINISH" frame are still unseen by every judge.
4. **Photo finish and tangled AI collapse within the first minute: 8.** With no input from the AI side, `tangles:1` and two AI horses were `down` by raceT 7.7. Earlier judges saw photo finishes at about 21 s. I did not rerun the whole race to a finish this session.
5. **Results with most face-plants award: 8.** Judge 25 saw the podium and the "DIRT EATER · MOST FACE-PLANTS" badge. I did not reach the results this session.
6. **Looks as LOOK.md says: 8.** The picture has toon steps with outlines, an orange and yellow 70s palette, warm light and the CRT pass (`div#crt` over `postpass-quad`). The green `hills` backdrop is now visible behind the stand. It is still reported as "Never visible", and there is still no fog.
7. **window.__game convention, static deploy: 9.** `index.html` is at the root, assets total 0.32 MB, fonts are vendored, and nothing is fetched at runtime.
8. **Horses match CHARACTERS.md and horse.png: 8.** The look shows chunky barrel bodies, white socks, dark hooves, big round eyes, a bristly mane, blinkers and a bridle. The silks are a red diamond cloth, green stripes, blue polka dots and a black/yellow `#4` cloth. `look` reports 0 of 3 named parts for `horse0`.
9. **Broadcast overlay: 9.** `div#tote` has silks, face-plant counts and odds. `div#lower` has the Hank "Hoofbeat" Pruitt line. The `LIVE` bug, the `3:58 PM` clock, `RACE TIME` and the progress bar are all there. The black rectangle above the lower-third is gone.
10. **Camera: 7.** The side-tracking telephoto reads well, and the plant replay uses a second, wider camera at a different angle. I did not see the head-on cut.
11. **Controls feel learnable: 5.** My 18-frame pulses from the start gave a pitch low of -0.73 and a face-plant by raceT ~3. YOU then idled at x 1.4 after the restart. I got no human finish.
12. **Local 2-player: 7.** `div#keys`, `div#tips` and the "2 PLAYERS (2)" button show the mode in the HUD. I did not play it this session.
13. **Style judged as hard as gameplay: 8.** The 70s TV look holds, with the tote, lower-third, CRT, letterbox and tag. The picture is a little flat with no depth fog.

**Faults: 6.**
- `perf` showed 411 draw calls, with `merged` at 142 and `merged-outline` at 45. Triangles fell from 184k to 159k after the dust change (`dust` is now 8.4k triangles). The 179 ms frame is a software renderer on host load 2.1, so it is not a budget signal.
- A render target is left bound on the replay frame.
- `hills` is still reported "Never visible" while visible, and there is no fog.

**Next:**
1. **Controls feel (asked again).** Make an 18-frame Q+P / W+O pulse pattern from the start run without a face-plant. Soften the leg motor torque, or add pitch-stabilising damping for the human horse during the first ~6 s. The `interact` that shows it done is the same pulse run with `trace` on `horses.2.pitch` and `horses.2.x`. It should show a pitch low above -0.3, `plants:0`, and x above 10 by raceT 5. Then play on until `phase:"results"` and `look` to see the finish replay.
2. **Render-target fix.** Make sure `setRenderTarget(null)` runs before the final screen pass, in the replay and results phases. The `look` on the replay frame should no longer say "every render call drew into a render target".
3. **Draw calls (asked again).** `merged` makes 142 calls. Merge by material across horses, instance `tail` (16 calls) and the `mesh-outline` meshes (18 calls), and share materials between horses. Then add depth fog: set `scene.fog` to the haze colour and make `hills` fog-aware, so the `look` Depth line no longer says "no fog". `perf` with `costs` should show `merged` well under 100 draw calls.

SCORE: 7.5
