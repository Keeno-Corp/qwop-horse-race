**Verdict, session 24**

1. **Plays as DESIGN.md's Core loop and Controls say: 8.** The `1 PLAYER`, `2 PLAYERS (2)` and `RESTART` buttons, `div#tips` and `div#keys` all show. Q+P / W+O alternation now moves `YOU` (`horses.2.x`). It went 1.4 → 5.5 m at 1.9 s and 16.3 m at 5.2 s, with `plants` 0 and `pitch` within ±0.03. I did not run it to the finish line or press R.
2. **Real Rapier jointed ragdoll, face-plant, auto-right: 8.** The `legs` bitmasks follow the keys. In this session's runs the AI horses stayed in `state:"run"`. Face-plant and auto-right were seen last session, not in this one.
3. **Replay: 7.** Last session's `REPLAY` banner and Space skip hold. I did not trigger a replay this session, and the 0.25x rate is still unmeasured.
4. **Photo finish and tangled AI collapse: 7.** Last session's `tangles:1` and "PHOTO FINISH · 0.10s" hold. This session's quick runs showed no AI collapse. With `YOU` now fast, the tangle and photo finish depend on the AI, so the clip moments need re-checking.
5. **Results with most face-plants award: 8.** Not replayed this session. Last session's "DIRT EATER" badge and face-plants column stand.
6. **Looks as LOOK.md says: 8.** `grandstand` with its blocky crowd, white rail, `hills`, dirt `track`, `dust*`, socks, saddle cloths and the `GO!` banner match refs/01.jpg. There are no `Lighting:` lines. The `Subject:` line says `player` is 0.66–1.1% of the picture with 0 of its named parts showing, because the `player-marker-*` and `horse*` parts are all that is named. The player horse is drawn among its rivals, but the camera is not framed on it.
7. **window.__game convention, index.html at root: 9.** `observe` returns phase, mode, raceT and horses with their `legs`, `plants` and `pitch`.
8. **Clip moments in the first minute: 7.** The race has horses bunched in the first 2 s with dust. The AI face-plants and tangles were not seen this session, and the faster `YOU` may change the timing of both.
9. **Controls feel learnable: 7.** The alternation now holds about 3.3 m/s from 5 to 16 m (11 m in 3.3 s), which would put 60 m at roughly 20 s. Last session it managed 1–2 m in 30 s. I did not run it to 60 m or test mistimed keys, and `YOU` led the AI by 3 m at 5 s.
10. **Horses read as horses, match refs/01.jpg: 9.** Head, mane, tail, saddle cloth, white socks and dark hooves read clearly in both looks.
11. **Juice: 8.** Sounds fired (blip, powerup, cheer). The `GO!` banner, `div#chips` and the `player-marker` arrow and ring show. Shake was not measured.
12. **Local 2-player discoverable from the HUD: 8.** `2` gives `mode:2` with the `P1` and `P2` horses (`human` 0 and 1), `div#keys` for both players and the tips line. With Q, E, U and O held both horses moved (`legs` "1010"). Neither was played through a race.
13. **Static page, vendored lib, no network: 9.** `perf` gave 386 draw calls, 33.8k triangles and 0 MB of assets. The 85 ms frame is SwiftShader, not a budget signal.

**Faults: 8.** The console has only the PCFSoftShadowMap warning, and `Never visible` is none, so `dust*` is now seen. The player horse still shows 0 named parts in `Subject`.

**Next:**
1. **Frame the camera on `YOU` plus the nearest rival (asked again).** The `Subject: player` line gives 0.66–1.1% of the picture with 0 named parts. Follow the human horse's x, or the midpoint of the humans in 2P, and keep a slightly closer fov. A mid-race `look` should show `player` at 3% or more with its named parts listed.
2. **Re-check the clip moments now that `YOU` is fast.** Check that the AI still tangles and face-plants in the first minute, that a player running a good rhythm still gets a close finish, and that a replay and a results screen fire. `interact` the rhythm for about 1500 frames with `until` `phase` "results", then `observe` `tangles` and `results`. Slow the player's drive slightly, or give the AI a rubber-band, so the finish stays close.
3. **Add a mistimed-key test and measure the replay and shake.** Press Q+W+O+P together or a single leg, and confirm a dog-sit, cartwheel or face-plant with `plants` rising. Run `feel` on a face-plant for the camera shake, and time the 0.25x replay against `replay.t` for wall-clock.

SCORE: 7.9
