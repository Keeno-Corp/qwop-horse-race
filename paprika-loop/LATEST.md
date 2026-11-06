The last builder's section and the last judge's verdict; paprika-loop/PROGRESS.md holds every session's.

### Judge 46

**Verdict, session 46**

1. **Plays as DESIGN.md's Core loop and Controls say: 8.** I held the Q+P / W+O loop (14 frames each). `YOU` went from x 6.1 at `raceT` 1.4 to x 15.2 at `raceT` 3.73 with `plants` 0 and `legs` cycling. `div#keys` shows the Q, W, O and P caps, and `div#top-r` holds `1 PLAYER`, `2 PLAYERS (2)` and `RESTART`. I did not press R after a finish or play 2-player.
2. **Real Rapier jointed ragdoll, face-plant, auto-right: 7.** The `player-body` ragdoll runs with `pitch` about -0.03 and its legs move under the motors. I saw no face-plant or auto-right this session, so that part is carried over.
3. **Replay: 7.** Not reached this session. Last session's replay (`kind` "plant", `rate` 0.25, `REPLAY` banner) is carried over.
4. **Photo finish and tangled AI collapse: 6.** `tangles` stayed 0 for the first 3.7 s. The AIs are 5.7 m behind, so a photo finish looks unlikely, and I have never seen one.
5. **Results with most face-plants award: 6.** Still not reached, so it is carried over.
6. **Looks as LOOK.md says: 8.** I saw the white low-poly horse with a blue saddle, dark mane and tail, a white rail, an orange-brown `track` and a covered `grandstand` with a blocky crowd. `hills` and `dust*` show. Saturation was 69%, with 0% near black and 0% blown out. The `player-marker-*` ring is clear. `look` has no `Surfaces:` line now, so the grandstand fix worked.
7. **window.__game convention, index.html at root: 9.** `window.__game` exposes `subject`, `describe`, `observe`, `act` and `setState`.
8. **Clip moments in the first minute: 6.** With the loop held, no tangle appeared in 3.7 s and the AIs were spread out. The funny pile-up only happened last session after input stopped. It depends on the player's behaviour, not on the AIs alone.
9. **Controls feel learnable: 7.** The rhythm gives about 4 m/s with 0 plants, and the player leads easily. The race is too easy and too empty, so there is no drama in it.
10. **Horses read as horses, match refs/01.jpg: 9.** I saw head, neck, dark mane and tail, a blue saddle and dark hooves. The fence, `grandstand` and green `hills` all show.
11. **Juice: 8.** The sounds that fired were blip, powerup and cheer. The `div#chips` plant counts, the progress bar, the timer and the commentary tips all show. I did not run `feel` on the shake.
12. **Local 2-player discoverable from the HUD: 9.** The `2 PLAYERS (2)` button and the "2 = two players" tip both show.
13. **Static page, vendored lib, no network: 9.** `perf` shows 378 draw calls, 33.5k triangles and 0 MB of assets. The 77 ms frame is SwiftShader and not counted.

**Faults: 8.** I saw no console errors and no `Surfaces:` or `Lighting:` lines. The `Never visible` object is `sky`, which is a backdrop. The finish, the results screen and the jitter spread are unverified for the fourth session running.

**Next:**
1. **The catch-up change did not work (asked again).** Same loop at `raceT` 3.73: `YOU` x 15.2 against AIs at 8.57, 9.12 and 9.46, about 5.7 m behind and almost the same gap as session 45. The factor at game.js line 63 is not taking effect, or it is too weak. Log it in `observe`, then rubber-band hard: give AIs behind the leader a speed bonus of up to 40%, or directly cap the lead at about 2 m. Check with the same loop. At `raceT` 3.7 the AIs should be at x 13 or more.
2. **Verify the finish and results (asked again).** Add `window.__game.act({type:'autoplay'})`, which holds the Q+P / W+O rhythm, so one `interact` can run to `horses.2.finished`. Report `finishT` (15–40 s), the gap to the nearest AI (under 1 s), the finish replay and the results screen with the most-face-plants award. Put the numbers in Open.
3. **Make the AI pile-up happen on its own.** With no input, `tangles` should reach 1 or more by `raceT` 8, from AI lanes drifting together or a forced collapse of two neighbours. Check with `interact` and no keys: `tangles` ≥ 1 and the replay by `raceT` 10. Then run `feel` on the shake and play 2-player once.

SCORE: 7.6

## Iteration 47
**Did** game.js: strengthened the AI catch-up at line 63 to `(1 - clamp((AI.leadX - px - 1) * 0.06, 0, 0.4))` (up to 40% faster when behind). `act({type:'autoplay'})` now sets `S.auto` (the existing Q+P / W+O rhythm) so one `interact` runs a whole race.
**Saw** Autoplay from raceT 0: at raceT 6.8 `YOU` 13.9 and AIs 14.1 / 14.4, so the pack is level (was 5.7 m behind). Natural pile-up at raceT 8.67: `tangles` 1 and a `plant` replay (`rate` 0.25) with no input from me. Skipped the replay with Space; reached `results` at raceT 23.4: order YOU, Dusty Rhodes, Hoof Hearted, Sir Trips-a-Lot. `YOU` finishT 19.62, nearest AI 21.55 (gap 1.9 s). Two AIs ended with 5 plants. Did not run `look` or `perf`.
**Next** (1) Tighten the finish gap to under 1 s (the dead-heat sprint at AI.leadX > 34). (2) Check the results screen visually for the most-face-plants award with `look`. (3) `feel` on the shake, one 2-player play.
**Open** The catch-up may now be strong enough that AIs sometimes pass the player; only one race tested. Results screen award text unseen. Jitter spread unverified.
