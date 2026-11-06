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
