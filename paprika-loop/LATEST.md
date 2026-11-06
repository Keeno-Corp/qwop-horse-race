The last builder's section and the last judge's verdict; paprika-loop/PROGRESS.md holds every session's.

## Iteration 48
**Did** game.js: finish-replay camera pulled back (`tp` FINISH_X+4.5, y 2.6, z 15, fov 34→31); hoof dust in the foot loop now fires at `f.y<0.2`, `|v.x|>1.5`, 3 chunks every 0.07 s; AI late catch-up past x 40 strengthened (`lead*0.1`, clamp ±0.4).
**Saw** The judge's "results never appears" was a test error: `interact {action:'autoplay'}` does nothing (needs `act({type:'autoplay'})` or `setState({auto:true})`), so `YOU` sat at x 1.4 with legs "0000". With `setState({auto:true})` the race reaches `results` (raceT 24.9). `look` in the plant replay shows dust (`dust*` ×51 on screen, Never visible: none). Results `look` shows YOU WINS!, podium, "SMOOTH OPERATOR" and "DIRT EATER · MOST FACE-PLANTS" award, DNF rows. Winner gap 1.40 s (not under 1 s). Two AIs end 'down'/'run' upside-down at pitch -2.7 because the results phase sets `guard` 99 for all. No console errors. `perf` not run.
**Next** (1) Photo-finish gap still 1.4 s: pull the second AI toward the player beyond x 45. (2) AIs flip 5–6 times each; check why `rise()` re-flips (hop height / guard 1.6). (3) Results phase should call `rise()` on 'down' horses so no one lies upside-down behind the panel.
**Open** The interact tool's `{action:'autoplay'}` form doesn't work; use setState auto. One race tested per change.

### Judge 48

**Verdict, session 48**

1. **Plays as DESIGN.md's Core loop and Controls say: 8.** `setState({auto:true})` ran the race to `phase` "results" at `raceT` 24.88. `YOU` finished at `finishT` 21.28, ahead of `Dusty Rhodes` at 22.68. The HUD shows the Q W O P key chips and the tips line. I did not test 2-player play or R.
2. **Real Rapier jointed ragdoll, face-plant, auto-right: 6.** `Sir Trips-a-Lot` (`plants` 5) and `Hoof Hearted` (`plants` 6) end with `state` "down" and `pitch` -2.67 and -2.84. They are still on their backs at results, and the builder's notes say the results phase locks the auto-right. They flip 5–6 times each in 25 s, which is too many.
3. **Replay: 8.** Carried from session 47 (`kind` "finish", `rate` 0.25, `REPLAY` banner). I did not run the replay this session.
4. **Photo finish and tangled AI collapse: 6.** `tangles` is 1 and the AIs pile up. The finish gap is +1.40 s, so it is not a photo finish.
5. **Results with most face-plants award: 9.** The results box shows "YOU WINS!", a podium, "SMOOTH OPERATOR" on `YOU` and "DIRT EATER · MOST FACE-PLANTS" on `Hoof Hearted`. The DNF rows read "22 m short" and "29 m short".
6. **Looks as LOOK.md says: 8.** `track`, `grandstand` with blocky crowd, white rail, `finish-line` checker, `hills` and sky all show. Saturation is 60%, with 0% near black and 0% blown out. There were no `Lighting:` or `Surfaces:` fault lines. In the results look, the panel covers the horses and the `player-body` is only 0.27% of the picture.
7. **window.__game convention, index.html at root: 9.** `observe` and `setState` both work.
8. **Clip moments in the first minute: 7.** The pile-up happens with no input. The slow-motion replay exists, but the photo finish is not tight.
9. **Controls feel learnable: 6.** Only autoplay was tested. `interact` with `{action:'autoplay'}` does nothing, which is a harness quirk. No human-rhythm run was done, so there is no new evidence.
10. **Horses read as horses, match refs/01.jpg: 9.** Head, mane, saddle, socks and hooves show beside the `grandstand` and fence.
11. **Juice: 8.** 43 sounds fired (blip, powerup, cheer, thud, gasp, boing). The popups and the results panel work. I did not run `feel` on the shake.
12. **Local 2-player discoverable from the HUD: 8.** The "2 PLAYERS (2)" button sits in `div#top-r`. I did not play it.
13. **Static page, vendored lib, no network: 9.** `perf` shows 377 draw calls, 33.5k triangles and 0 MB of assets. The 96 ms frame is SwiftShader and does not count.

**Faults: 7.** There were no console errors. `Never visible` lists `dust`, "in view, behind finish-line", while the builder saw dust in the plant replay. Two horses lie upside-down at results.

**Next:**
1. **Photo-finish gap (asked again).** The winner gap is still 1.40 s. Pull the nearest AI toward the leader from about x 40, with a stronger rubber-band that is skipped when the AI is face-planted. This should give a gap under 0.5 s in most seeds. Check: run `interact` with `setState({auto:true})` and `until {phase:'results'}`. The results row for 2nd should then read "(+0.4x)" or less.
2. **Stop the AI flip loop and results-phase upside-down horses (asked again).** In `rise()`, check why the AIs re-flip 5–6 times; the cause may be the hop height or `guard` 1.6. Also call `rise()` on every horse in "down" state when `phase` becomes "results". Check: after `phase` "results", `observe` should show no horse with `|pitch|` > 1.2, and `plants` should be 3 or fewer for each AI.
3. **Show the horses and the dust at the finish.** In the results `look`, the panel hides the horses. Move the panel to the side or lower it, or add a small win pose for the winner. Also check that `dust` is visible on the `track` in the normal race camera. Check: `look` after `interact` with `until {raceT:8}` should show dust puffs and have `Never visible` empty.

SCORE: 7.7
