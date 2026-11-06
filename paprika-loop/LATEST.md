The last builder's section and the last judge's verdict; paprika-loop/PROGRESS.md holds every session's.

### Judge 45

**Verdict, session 45**

1. **Plays as DESIGN.md's Core loop and Controls say: 8.** I played the 14-frame Q+P / W+O loop. `YOU` went from x 6.1 at `raceT` 1.55 to x 15.2 at `raceT` 3.88, and `div#keys` showed the Q, W, O, P caps. `div#top-r` holds `1 PLAYER`, `2 PLAYERS (2)` and `RESTART`. I did not press R after a finish or play 2-player.
2. **Real Rapier jointed ragdoll, face-plant, auto-right: 8.** Without input after `raceT` 3.9, the `YOU` ragdoll face-planted: pitch -0.89 and `plants` 1. Sir Trips-a-Lot and Hoof Hearted also went to state `down`. I did not watch the auto-right.
3. **Replay: 8.** At `raceT` 7.53 `phase` went to "replay" with `kind` "plant", `rate` 0.25 and `of` 450. The `REPLAY` banner and "SPACE to skip" both show, and the side view is clear. I did not check Space or a finish replay.
4. **Photo finish and tangled AI collapse: 6.** `tangles` was 1 at `raceT` 7.5, with a tangle of `horse0`, `horse1` and `player-body` visible in the replay. I did not reach the finish, so no photo finish was seen.
5. **Results with most face-plants award: 6.** I did not reach the results screen this session. It is carried over.
6. **Looks as LOOK.md says: 8.** I saw the covered `grandstand` with its blocky crowd, a white rail, orange-brown `track`, green `hills` and dust. Saturation was 67%, with 0% near black and 0% blown out. `player-body` takes 2.9% of the frame and the blue `player-marker-*` ring is clear. A `Surfaces:` line remains: two `grandstand` boxes share the y = 0.00 plane.
7. **window.__game convention, index.html at root: 9.** `observe` returns `phase`, `raceT`, `horses`, `replay` and `tangles`.
8. **Clip moments in the first minute: 8.** Without input, a pile-up and a replay arrived at `raceT` 7.5, which is funny. The photo finish is still unseen, and the pile-up came after the player's input stopped, not from the AIs alone.
9. **Controls feel learnable: 7.** The rhythm held for 3.9 s at about 3.5 m/s with 0 plants. Then the player, who had stopped pressing keys, plunged into the pile-up. I did not finish with the keys held. The AIs are about 5.5 m behind (x 15.2 against 8.9–9.7), so the AI slowdown fix did not close the gap.
10. **Horses read as horses, match refs/01.jpg: 9.** I saw head, neck, dark mane and tail, white socks and dark hooves. The blue saddle, `grandstand`, rail and `hills` all show.
11. **Juice: 8.** The sounds that fired were thud, gasp, boing and cheer. The `REPLAY` banner, `div#chips` plant counts and the progress bar all show. I did not run `feel` on the shake.
12. **Local 2-player discoverable from the HUD: 9.** The `2 PLAYERS (2)` button and the "2 = two players" tip both show.
13. **Static page, vendored lib, no network: 9.** `perf` shows 378 draw calls, 33.5k triangles and 0 MB of assets. The 80 ms frame is SwiftShader and not counted.

**Faults: 8.** I saw no console errors. The `Never visible` object is `sky`, which is a backdrop. The `grandstand` `Surfaces:` line remains. The finish, the results screen and the jitter spread are unverified.

**Next:**
1. **Verify the finish and results (asked again).** Hold the Q+P / W+O loop until `horses.2.finished` is true. `YOU.finishT` should be between 15 and 40 s, `phase` should go to "replay" and then "results", and the finish gap to the nearest AI should be under 1 s. Then `look` at the results screen for the most-face-plants award. Put the numbers in Open. A `window.__game.act` autoplayer that holds the rhythm would make this run cheap.
2. **Shrink the 5.5 m player lead (asked again).** The `aiLeadX` change did not close the gap: at `raceT` 3.9, `YOU` x was 15.2 and the AIs 8.9–9.7. Raise the AI `base` speed, or rubber-band AIs that are behind the player so the pack stays within about 2 m. Check with the same loop at `raceT` 3.88. The AIs should be at x 13 or more.
3. **Small faults.** Move one hidden `grandstand` box 0.001 off y = 0.00 so the `Surfaces:` line goes. Run `feel` on the face-plant shake. Check the 2-player Q W E R vs U I O P play with one `interact`.

SCORE: 8.0

## Iteration 46
**Did** game.js line 63: added an AI catch-up factor to `per`, `(1 - clamp((AI.leadX - px - 2) * 0.025, 0, 0.2))`, so AIs more than 2 m behind the leader (player included) pedal up to 20% faster. view.js `stand()`: lifted `step`, `back` and the post boxes 0.003–0.009 m off y = 0 to remove the `grandstand` `Surfaces:` shared-plane fault.
**Saw** Fresh `open` + `look`: console clean, saturation 67%, 0% near black, 0% blown out, `player-body` 1.8% of the frame, all four horses and the blue ring show. Did not play a race this session, so the catch-up effect is unmeasured. `look` no longer lists a `Surfaces:` line for `grandstand`.
**Next** (1) Run the Q+P / W+O loop to raceT 3.9 and compare: AIs should be at x 13 or more with `YOU` at about 15. If not, raise the 0.025 slope or the cap. (2) Verify the finish, `finishT` 15–40 s, replay, then results screen with the most-face-plants award. (3) `feel` on the shake, one 2-player play.
**Open** The finish, replay after finish, results screen and jitter spread are still unverified. The catch-up could make the AIs pass the player if over-tuned; check at the finish.
