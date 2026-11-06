The last builder's section and the last judge's verdict; paprika-loop/PROGRESS.md holds every session's.

### Judge 29

**Verdict, session 29**

1. **Plays as DESIGN.md's Core loop and Controls say: 8.** My Q/P/W/O 10-frame rhythm took `YOU` from x 1.38 to 5.0 in about 1.5 s with `plants 0` and `state "run"`. The `1 PLAYER`, `2 PLAYERS (2)` and `RESTART` buttons, `div#tips`, `div#keys` and `div#chips` all show. The second rhythm call didn't continue the same race: `raceT` read 0.13 and `phase` race with a GO! overlay, so a restart happened in between. I didn't find the cause, and I did not reach a full 60 m finish.
2. **Real Rapier jointed ragdoll, face-plant, auto-right: 8.** Sir Trips-a-Lot and Hoof Hearted went `state:"down"` with `plants 1` in the tangle, and their `horse*-body` and `horse*-head` parts are jointed. I did not watch auto-right.
3. **Replay (last ~4 s, 0.25x, REPLAY banner, Space skips): 8.** The `plant` replay (`rate` 0.25, `of` 592) now frames the pile-up. `horse0-body` and `horse1-body` sit in the middle with the grandstand behind. A white rail still runs across the foreground and hides the horses' lower half. The `REPLAY` banner and "SPACE to skip" show.
4. **Photo finish and tangled AI collapse: 7.** The tangle fires at raceT 9.9 (`tangles` 1) and is now the subject of the replay. Per the builder, the replay opens before the collapse, so the first moments show horses still running. I did not check the finish margin, so a photo finish remains unconfirmed.
5. **Results with most face-plants award: 7.** The `div#chips` FACE-PLANTS counters show. I did not open the results screen.
6. **Looks as LOOK.md says: 8.** The start look shows saddle-clothed low-poly horses, a covered `grandstand` with a blocky crowd, white rail, hills and a blue `player-marker` ring. The `Subject: player-body` stands out at brightness 53% against 33%. There is no `Lighting:` fault. The only `Surfaces:` line is two hidden grandstand faces coplanar at y 0, out of view. In the replay look the subject drew no pixel, which is expected since the camera follows the pair.
7. **window.__game convention, index.html at root: 9.** `observe` gives `phase`, `raceT`, `replay`, `tangles` and `horses`.
8. **Clip moments in the first minute: 8.** The pile-up replay now shows the two tangled horses large and legible within about 10 s, and it is funny. The photo-finish half is still unseen.
9. **Controls feel learnable: 8.** The rhythm gives steady progress with `plants 0`. I did not confirm a human finishing the 60 m.
10. **Horses read as horses, match refs/01.jpg: 9.** Head, mane, tail, white socks, dark hooves, dirt track and covered stand all show.
11. **Juice: 8.** Sound events (blip, powerup, cheer, thud, gasp) fired. The GO! overlay, REPLAY banner and dust chunks show. I did not measure shake with `feel`.
12. **Local 2-player discoverable from the HUD: 7.** The `2 PLAYERS (2)` button and "2 = two players" in `div#tips` are visible. I did not run 2P.
13. **Static page, vendored lib, no network: 9.** `perf` shows 384 draw calls, 33.6k triangles and 0 MB of assets. The 67 ms frame is SwiftShader, so it is not a fault.

**Faults: 8.** The only console line is the PCFSoftShadowMap warning, and `Never visible` is none. Frame time is over budget on a software renderer, so I'm not scoring it as a fault. The unexplained mid-race restart in my second call is unconfirmed.

**Next:**
1. **Clear the rail from the plant replay (asked again).** Raise the replay camera y, or move it inside the fence (z below the rail), so the white rail no longer crosses the horses. Done when `interact until {phase:"replay"}` with `look:true` shows `horse0-body` and `horse1-body` with no rail between them and the lens.
2. **Start the plant replay on the collapse.** Shift `rp.pos` forward so the 0.25x clip opens as the horses go down, not while they are still running. Check `observe replay.pos` and a `look` at `t:0`, where both horses should already be `down` or mid-fall.
3. **Photo-finish margin and the unverified paths.** Run a full rhythm race and read the `finishT` gap between `YOU` and Dusty. Tighten the AI tuning until it is under ~0.3 s. Then check the results screen, 2P (`Digit2`, then Q W E R and U I O P) and the R and Enter restarts. Also check what restarted the race mid-play in my second call.

SCORE: 8.1

## Iteration 30
**Did** game.js: plant replay camera now y 2.0→3.0 and z clamped to ≤3.4 (inside the rail); replay clip starts at `end-75` instead of `end-110` so it opens nearer the collapse.
**Saw** `interact until replay` + 20 frames, `look` at replay pos 402/472: rail no longer crosses the horses; horse0/horse1 (down) sit mid-frame with the grandstand behind, but horse3 (Dusty, running) fills the foreground and hides part of them. Only the PCFSoftShadowMap warning. Not run: perf, finish margin, 2P, results.
**Next** (1) Replay camera should avoid a third horse in front: pick the side/angle by the nearest other horse's z, or lower the aim. (2) Full rhythm race: finishT gap vs Dusty, results screen. (3) 2P and R/Enter restarts; the mid-race restart the judge saw.
**Open** Replay opening frame not checked at t:0 for whether horses are already down.
