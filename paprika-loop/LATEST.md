The last builder's section and the last judge's verdict; paprika-loop/PROGRESS.md holds every session's.

### Judge 32

**Judge 32.** I opened the page, played a Q, P, W, O pulse (20 frames each, then 200 idle) with a `look`, and ran `perf` with `costs`. There were no console errors. I did not play the finish replay, 2-player mode or the head-on cut this session.

1. **Plays as DESIGN.md's Core loop and Controls say: 7.** The `div#keys` strip, `div#tips`, the "1 PLAYER / 2 PLAYERS (2) / RESTART" buttons and `RACE TIME 4.15s` all show. All four horses stayed in `state:"run"`. I did not play on to `results` this session.
2. **Real Rapier jointed ragdoll horses, face-plant collapse and auto-right: 8.** The `legs` strings differ per horse ("1001", "0110", "0000", "1001"), and the pack runs with dust. No face-plant happened this session, so this rests on earlier judges' `down` states.
3. **Replay (last ~4 s, 0.25x, Space skips, sepia photo finish): 7.** I did not see it, so the softened grain is still unchecked (asked in Judge 30 and Iteration 32).
4. **Photo finish and tangled AI collapse within the first minute: 8.** This rests on earlier measurements. I did not re-measure it.
5. **Results with most face-plants award: 9.** From earlier judges. I did not reach it this session.
6. **Looks as LOOK.md says: 8.** The `look` shows toon steps with thick outlines, an orange and yellow palette, warm light and the CRT pass (`div#crt` over `postpass-quad`), and it reads like a 70s broadcast. The `hills` backdrop is now a paler green at the left edge, so the haze helps. It is still a soft blob with no depth cue in the main frame, and `look` still lists `hills` as "Never visible".
7. **window.__game convention, static deploy: 9.** `index.html` is at the root, assets are 0.32 MB, and the fonts are vendored.
8. **Horses match CHARACTERS.md and horse.png: 8.** `horse0` has blue polka dots, the second horse a red diamond cloth, the third green stripes and the fourth black and yellow stripes. They have white socks, dark hooves, big eyes, a mane and blinkers. The tool reports 0 of 3 parts for `horse0`, which is the shader limit.
9. **Broadcast overlay: 9.** `div#tote` has silks, odds and face-plant counts. `div#lower` has the Hank "Hoofbeat" Pruitt line. `LIVE`, the `3:58 PM` clock, the progress bar and the Top-Cat Tires billboards are all there.
10. **Camera: 7.** The side-tracking telephoto reads well. I did not see the head-on cut or a replay cam this session.
11. **Controls feel learnable: 6.** After the same pulses YOU was at x 4.1 at raceT 4.1 s, against the AI at 6.8 to 9.3. Over the whole run `horses.2.x` peaked at 4.91 and then drifted back to 4.11 while idle. `plants` stayed 0. A short pulse still gives little forward speed, and no human finish was seen.
12. **Local 2-player: 7.** The "2 PLAYERS (2)" button and `div#keys` show it. It was not played.
13. **Style judged as hard as gameplay: 8.** The 70s TV look holds. The open issues are the depth of the backdrop and the `hills`.

**Faults: 6.**
- `perf` shows 414 draw calls and 159,044 triangles. `merged` is 142 calls, `Mesh` 56, `merged-outline` 45, `mesh-outline` 18 and `tail` 16, and `crowd` is 48k triangles. The 270 ms frame is a software renderer at host load 2.2, so it is not a budget signal.
- `hills` is "Never visible" while in view. This is the same as in Judge 30.
- The grain softening is still unchecked.

**Next:**
1. **Controls feel (asked again, third time).** YOU is far behind on short pulses and drifts back when idle. Give the human horse a stride-synced forward drive or a higher leg motor speed, so alternating Q+P then W+O covers ground. Check with the same `interact` pulses and `trace` on `horses.2.x`. It should pass x 15 by raceT 7 with `plants:0`.
2. **Draw calls (asked again).** Merge `merged` (142 calls) and `Mesh` (56) by material across horses, merge `merged-outline` (45) and `mesh-outline` (18), instance `tail` (16), and cut `crowd` from 48k triangles. Check with `perf` and `costs`, which should show under 250 calls. Also give `hills` real depth, for example a second, farther and paler hill layer or distance fog. Check with `look` and `sample` on the blob and a foreground grass pixel. The blob should be clearly paler and bluer.
3. **Verify the finish replay and 2-player (asked again).** Use `interact` with `until:{replay:{kind:"finish"}}`, then `look` with `sample` on a corner pixel (the sepia read, R>G>B) and a `zoom` on the "PHOTO FINISH" frame. The grain should be visible but not harsh. Then play 2-player once (key 2, then Q W E R and U I O P) and `look` at the head-on cut.

SCORE: 7.6

## Iteration 33
**Did**
- Controls feel: key-edge `h.drive` boost 0.5→0.8 (cap 1.6→2.2) in `game.js`, and `drive` decay in `physics.js` 0.7→0.45/s, so a pulse pushes the human horse forward longer.
**Saw**
- One `interact` pulse run (Q,P,W,O 20 frames each): `horses.2.x` 1.4 → peak 2.93 → 2.02, plants 0, no errors. The 200-frame wait was mostly countdown, so raceT was only 3.4 s: not a clean comparison with Judge 32 (YOU x 4.1 at 4.1 s). Not run: `perf`, replay, 2-player.
**Next**
- Re-test controls with a wait until `phase:"race"`; trace `horses.2.x` (target x 15 by raceT 7). Find why x drifts back when idle (drag or leg poses).
- Draw-call merging (`merged` 142, `Mesh` 56, outlines, `tail`), `crowd` triangles.
- Verify finish replay grain and 2-player.
**Open**
- Drive tweak unproven; draw calls (414) untouched.
