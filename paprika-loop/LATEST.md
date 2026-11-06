The last builder's section and the last judge's verdict; paprika-loop/PROGRESS.md holds every session's.

### Judge 22

**Verdict, session 22**

1. **Plays as DESIGN.md's Core loop and Controls say: 8.** `div#keys` (Q W O P) lights the held key caps, and the 1 PLAYER, 2 PLAYERS (2) and RESTART buttons show. After a `setState` jump, a Space press moved the game from the `replay` phase to the `results` phase. I did not run a real key rhythm over 60 m, and I did not press 2 for two players.
2. **Real Rapier jointed ragdoll, face-plant, auto-right: 7.** The `horse*` parts are jointed and the legs move with the keys. This session had no face-plant: `plants` was 0 for all four horses. Auto-right is still unseen.
3. **Replay: 8.** The REPLAY banner and "SPACE to skip" show over a side view of the finish. The 0.25x rate was not measured.
4. **Photo finish and tangled AI collapse: 8.** The `div.pop` reads "PHOTO FINISH! YOU by a nose (0.43s)!" over the replay, with the `finish-line` checker in view. The caption is semi-transparent and fights the crowd behind it. No tangle appeared this run.
5. **Results with most face-plants award: 7.** The podium (YOU 1, Hoof Hearted 2, Sir Trips-a-Lot 3) and a table with a face-plants column show, and the podium does not overlap the table. With 0 face-plants everywhere there was no "most face-plants" award line, so the award itself is unverified.
6. **Looks as LOOK.md says: 8.** `grandstand`, white rail, `hills`, `clouds` and the dirt `track` match refs/01.jpg, and there are no `Lighting:` or `Surfaces:` lines. The `player` subject is 1.3% of the frame in the race and 0.11% on results, so it only just stands out. There is a `player-marker-*` triangle and a blue ring, which help.
7. **window.__game convention, index.html at root: 9.** `observe` returns phase, horses, replay and results.
8. **Clip moments in the first minute: 7.** The photo finish and replay work. The tangle needs a face-plant, which this run did not produce, so the "laugh" is only reliable in the replay of a tangle.
9. **Controls feel learnable: 7.** The tip "Alternate legs: Q+P then W+O" and the key caps guide the player. A 300-frame rhythm moved `YOU` only 1.4 m to 2.98 m, and a 60 m run was not tested.
10. **Horses read as horses, match refs/01.jpg: 9.** Head, mane, tail, white socks, dark hooves and saddle cloths all show at close range.
11. **Juice: 8.** Sounds fired (blip, powerup, cheer), and the popups, dust, FINISH banner and results box show. I did not feel the camera shake.
12. **Local 2-player discoverable from the HUD: 9.** The "2 PLAYERS (2)" button is visible.
13. **Static page, vendored lib, no network: 9.** `perf` gave 387 draw calls, 33.8k triangles and 0 MB of assets. The 64 ms frame is SwiftShader at host load 4.5, so it is no budget signal.

**Faults: 8.** No errors. The only console line is the three.js "PCFSoftShadowMap has been removed" warning, a trivial one. There is no `Never visible` object. The `player` is 0.11% of the frame on the results screen.

**Next:**
1. **Verify a face-plant, auto-right and the most-face-plants award.** Use `interact` with `{ state: ... }` to give a horse a pitch of about 1.4, then `observe`. It should show `plants` of 1 or more, a `state` that returns to "run" after about 2 s, and a "most face-plants" line in the results `div.box`. If the results never name that award, add it.
2. **Play a real rhythm and 2P.** Use `interact` with Q+P then W+O for 10 frames each over about 1800 frames, and `trace` `horses.2.x`. It should reach 60 m in under 60 s. Then press `2` and send Q W E R and U I O P, which should move two `human` horses.
3. **Make the player stand out on results and in the race.** Keep the `player` horse at 3% or more of the frame, for example by framing the camera on the player and nearest rivals, and make the PHOTO FINISH `div.pop` opaque, with a dark backing. `look` with `sample` on the caption pixels should show a solid colour behind the text.

SCORE: 8.0

## Iteration 23
**Did** index.html `.pop`: opaque dark backing (rgba .92), padding, border so the PHOTO FINISH caption reads over the crowd. The "DIRT EATER · MOST FACE-PLANTS" award already exists in game.js results (shown when maxP > 0).
**Saw** Not run through look this session (short on room); CSS-only change.
**Next** (1) force a face-plant via setState and confirm auto-right. (2) Real Q+P/W+O rhythm trace, then 2P. (3) frame camera so `player` is ≥3% of frame.
**Open** Face-plant, auto-right, 2P, rhythm still unverified; pop backing unchecked visually.
