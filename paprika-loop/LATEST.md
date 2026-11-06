The last builder's section and the last judge's verdict; paprika-loop/PROGRESS.md holds every session's.

### Judge 42

**Verdict, session 42**

1. **Plays as DESIGN.md's Core loop and Controls say: 8.** `phase` went countdown → race → replay. `div#top-r` holds `1 PLAYER`, `2 PLAYERS (2)` and `RESTART`. `div#keys` shows the Q, W, O, P caps. `div#tips` says "Alternate legs: Q+P then W+O". I did not press R after a finish.
2. **Real Rapier jointed ragdoll, face-plant, auto-right: 8.** The `YOU` ragdoll has jointed legs. At `raceT` 6.7 it was `state` "down" with a pitch of -1.6. The blue-saddle horse sprawls convincingly in the replay.
3. **Replay: 8.** I saw `phase` "replay" with `kind` "plant", `rate` 0.25, the REPLAY banner and "SPACE to skip". The side camera shows the sprawl and a "20 m" marker. Brightness is 37%, but 18% of pixels are near black. That comes from the letterbox bars.
4. **Photo finish and tangled AI collapse: 8.** `tangles` was 1 at `raceT` 6.7. `Sir Trips-a-Lot` and `Hoof Hearted` were both "down", with 1 plant each. I did not check the photo finish this session.
5. **Results with most face-plants award: 8.** Not re-viewed this session. It is carried over from session 39.
6. **Looks as LOOK.md says: 8.** The look shows `grandstand` with a blocky crowd, a white rail, orange-brown `track`, green `hills`, and horses with white socks and dark manes. Saturation is 67% and 0% is near black. `player-body` takes only 1.1% of the frame. The `Surfaces:` fault on the two hidden `grandstand` boxes at y = 0.00 is still there.
7. **window.__game convention, index.html at root: 9.** `observe` returns `phase`, `raceT`, `tangles`, `replay` and `horses`.
8. **Clip moments in the first minute: 8.** The pile-up happened at `raceT` 6.7, so inside 10 s. `Dusty Rhodes` was still running. The two pops don't overlap. The photo finish was not seen.
9. **Controls feel learnable: 6.** With 14-frame holds, `YOU` reached x 11.9 at `raceT` 3.1, about 4 m/s, with pitch -0.07 and 0 plants. Continuing the same rhythm, `YOU` pitched to -1.6 and face-planted at x 23 by `raceT` 6.7. So the "safe" rhythm still dumps the horse after about 5 s of steady play. I have not seen a finish, which is now four sessions unproven.
10. **Horses read as horses, match refs/01.jpg: 9.** The `horse3-body` grey, `player-body` white and chestnut horses have heads, manes, tails, white socks and dark hooves. The sunny stand, rail and hills fit refs/01.jpg.
11. **Juice: 8.** Thud, gasp and cheer sounds fired at the pile-up. The `div#chips` plant counts, the GO! banner, the blue player ring and the 20 m marker all show. I did not run `feel` on the shake.
12. **Local 2-player discoverable from the HUD: 9.** The `2 PLAYERS (2)` button is in `div#top-r`. I did not play 2-player.
13. **Static page, vendored lib, no network: 9.** `perf` shows 378 draw calls, 33.5k triangles and 0 MB of assets. The 69 ms frame is SwiftShader and not counted.

**Faults: 8.** I saw no console errors. The `Never visible` object is `sky`, which is a backdrop. The `Surfaces:` line on `grandstand` is minor. The jitter spread is still unverified.

**Next:**
1. **Make a steady human rhythm survive to the finish (asked again).** A Q+P / W+O rhythm with 14-frame holds goes from pitch -0.07 at x 12 to a -1.6 face-plant at x 23. Trace `horses.2.pitch` over the 5–7 s window. Then add a pitch-recovery torque or cap the stride drive on the player horse, so a steady rhythm doesn't sprawl. `interact` with the same 14-frame loop and `until {"horses.2.finished":true}` should end with `YOU.finishT` under 60 and `plants` 0 or 1.
2. **Verify the AI jitter spread (asked again).** Set `deadHeat` off, run 3 seeds to the results, and check that `results[*].finishT` spreads by more than 0.3 s. Report the numbers in Open.
3. **Raise the `player-body` share of the frame, and fix the `grandstand` overlap.** `player-body` takes 1.1% of the frame in the start camera, so tighten the camera or enlarge the blue player ring. Move one hidden `grandstand` box 0.001 off y = 0.00 so the `Surfaces:` line goes. Then run `feel` on the face-plant shake.

SCORE: 8.1

## Iteration 43
**Did** game.js line 246: human `h.assist` now fades 5 -> 2.5 over the first 5 s and stays there (was 5 -> 1). The cause of the 5-7 s face-plant was the assist falling to 1 after raceT 5.
**Saw** 14-frame Q+P / W+O loop, no errors: `YOU` x 27.96 at raceT 7.02, pitch -0.03 (low -0.05), plants 0, state "run". The AIs are at x ~20.7 at that time, so the player now leads by about 7 m. Last session `YOU` had dumped at x 23 by raceT 6.7. Not run to the finish; jitter spread and the `grandstand` y overlap not done.
**Next** (1) Run to `horses.2.finished` and record `finishT`; with the lead, check whether AI pace needs a bump so the race stays close. (2) Verify jitter spread over 3 seeds with `deadHeat` off. (3) Fix `grandstand` y = 0.00 overlap, enlarge the player ring, `feel` on the shake.
**Open** The assist floor of 2.5 may make a human race too easy; the finish is unverified.
