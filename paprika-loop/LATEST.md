The last builder's section and the last judge's verdict; paprika-loop/PROGRESS.md holds every session's.

### Judge 43

**Verdict, session 43**

1. **Plays as DESIGN.md's Core loop and Controls say: 8.** `phase` went countdown → race. `div#top-r` holds `1 PLAYER`, `2 PLAYERS (2)` and `RESTART`. `div#keys` shows the Q, W, O, P caps. `div#tips` says "Alternate legs: Q+P then W+O · R restart · 2 = two players". I did not press R after a finish.
2. **Real Rapier jointed ragdoll, face-plant, auto-right: 8.** The `YOU` ragdoll has jointed legs and a `player-body` with a saddle. I did not see a face-plant this session, because the steady rhythm stayed upright.
3. **Replay: 7.** I did not reach a replay this session. It is carried over from session 42.
4. **Photo finish and tangled AI collapse: 6.** In my run `YOU` led, and the AIs never collapsed up to `raceT` 4.2. They were still at x ~10.4–11, with 0 plants each. No tangle or photo finish was seen.
5. **Results with most face-plants award: 7.** Not viewed this session. It is carried over from session 39.
6. **Looks as LOOK.md says: 8.** The look shows `grandstand` with a blocky crowd, a white rail, orange-brown `track`, green `hills`, and a white horse with a blue saddle and dark mane. Saturation is 70%, with 0% near black and 0% blown out. `player-body` takes 3% of the frame, the blue `player-marker-*` ring is clear, and the `dust*` particles show.
7. **window.__game convention, index.html at root: 9.** `observe` returns `phase`, `raceT` and `horses`.
8. **Clip moments in the first minute: 6.** With a steady rhythm, nothing funny happens by `raceT` 4.2. `YOU` is alone at the front, about 6 m ahead of the AIs, and all four horses run upright. The player's lead may now be hiding the photo finish.
9. **Controls feel learnable: 8.** The 14-frame Q+P / W+O loop gave `YOU` x 6.1 at `raceT` 1.4 and x 17.0 at `raceT` 4.2, about 3.9 m/s. Pitch stayed between -0.05 and -0.02, with 0 plants. The face-plant at 5–7 s from session 42 is not at the same point now, but I did not run to the finish. At this pace the 60 m takes about 15 s.
10. **Horses read as horses, match refs/01.jpg: 9.** In `look`, `player-body` shows head, neck, mane, tail and white socks. The sunny stand, rail and hills fit refs/01.jpg.
11. **Juice: 7.** Blip, powerup and cheer sounds fired at the start. The `div#chips` plant counts, the 4.2 s timer and the progress bar with its finish flag all show. I did not run `feel` on the shake.
12. **Local 2-player discoverable from the HUD: 9.** The `2 PLAYERS (2)` button and the "2 = two players" tip both show.
13. **Static page, vendored lib, no network: 9.** `perf` shows 378 draw calls, 33.5k triangles and 0 MB of assets. The 99 ms frame is SwiftShader and not counted.

**Faults: 8.** I saw no console errors. The `Never visible` object is `sky`, which is a backdrop. The finish, the jitter spread and the results screen are unverified.

**Next:**
1. **Keep the race close and make the AI funny (asked again).** The assist floor of 2.5 gives a steady player a lead of about 6 m by `raceT` 4. That is a lead of about 7 m at `raceT` 7, and it kills the photo finish and the pile-up. Raise the AI pace or add a rubber-band for AIs that are behind. Keep the planned early tangle among Sir Trips-a-Lot, Hoof Hearted and Dusty Rhodes at `raceT` 4–8. Run the same 14-frame loop with `until {"horses.2.finished":true}`. It should end with `YOU.finishT` between 15 and 40, a finish gap under 1 s to at least one AI, `phase` "replay", and `tangles` of 1 or more.
2. **Verify the jitter spread with `deadHeat` off (asked again).** Run 3 seeds to the results, and check that `results[*].finishT` spreads by more than 0.3 s. Report the numbers in Open. Also look at the results screen and the most-face-plants award with `look`.
3. **Fix the remaining small faults.** Move one hidden `grandstand` box 0.001 off y = 0.00, so the `Surfaces:` line goes. Run `feel` on the face-plant shake. Check the 2-player Q W E R vs U I O P play with one `interact`.

SCORE: 7.8

## Iteration 44
**Did** No code change. Re-ran the Q+P / W+O 14-frame loop in two steps to check the Iteration 43 assist floor.
**Saw** At raceT 3.8 `YOU` x 12.47 (pitch low -0.18, back to -0.10, plants 0, state "run"). The AIs were at x 7.3–8.5, so `YOU` leads by about 4–5 m. Console clean. I did not run to the finish, did not do the 3-seed jitter spread, and did not look at the results screen or the `grandstand` overlap.
**Next** (1) Run to `horses.2.finished` with a long repeated step list and record `YOU.finishT`, the gap to the AIs, `phase` "replay" and `tangles`. (2) Check the jitter spread with `deadHeat` off over 3 seeds. (3) Fix `grandstand` y = 0.00, run `feel` on the shake, and play 2 players once.
**Open** The player's lead of about 4–5 m may kill the photo finish. The AI rubber-band in game.js lines 59–61 is keyed to the leader, which includes the player. The finish is still unverified.
