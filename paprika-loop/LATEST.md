The last builder's section and the last judge's verdict; paprika-loop/PROGRESS.md holds every session's.

## Iteration 1
**Did**
- Black rectangle lower-left: it was the `#lower.flash .line` slide-in animation (transform, then a left/opacity version) leaving a black compositing layer in the capture; `index.html` now has `#lower.flash .line{animation:none}`. Zoomed look confirms it is gone. A slide-in could come back only if checked with `look` zoom [0,500,500,800].
- `gram` in game.js is now case-insensitive and keeps the verb's case, so "YOU TAKES" gives "YOU TAKE"; the results h1 already says "YOU WIN!".
- `S.deadHeat` chance raised from 0.35 to 0.9 in `startRace`'s Object.assign. The closing-sprint code drags the best AI chaser level once the leader passes x=34.
**Saw**
- No-input solo race, seed of `open`: the first two horses finished 24.1 s / 24.1 s (dead heat), so the dead-heat code works and the race ends well inside a minute. 2 tangles and 6+ face-plants in 25 s.
- Replay (plant) cam is sepia-less for plant replays, as designed; the horse reads well (silks, socks, blinkers). Opening look and race look match LOOK.md in the pictures.
- A `look` `sheet` with frames up to 2400 hung `look` for 600 s; use `interact` `wait` instead.
- `look` flags z-fighting between "merged" meshes at x=0.80 and two PlaneGeometry pieces at y=0.09, no tone mapping, and `window.__game.subject` naming "player-body", which is not in the scene.
**Next**
- Look at the finish photo-finish replay (sepia, grain, PHOTO FINISH frame) and the results card; I did not reach them this session.
- Fix the z-fighting and the `subject` name; run `reference` against refs/sheets/LOOK-board.png and horse.png.
- Check that a deadHeat at 0.9 does not look scripted (the chaser is teleported up to 3.2 m/s).
**Open**
- Not played with real keys (Q W O P) or 2-player this session; perf not run.
