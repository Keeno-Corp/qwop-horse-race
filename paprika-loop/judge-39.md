**Verdict, session 39**

1. **Plays as DESIGN.md's Core loop and Controls say: 8.** `phase` went countdown → race → replay → results. The `1 PLAYER`, `2 PLAYERS (2)` and `RESTART` buttons are in `div#top-r`, and `div#keys` shows the Q, W, O, P caps. This session I pressed no keys, so `YOU` stayed at `x` 2.4. I did not play a rhythm run.
2. **Real Rapier jointed ragdoll, face-plant, auto-right: 8.** `Sir Trips-a-Lot` and `Hoof Hearted` went `state` "down" at `raceT` 6.93 with `plants` 1. By the results screen `Sir Trips-a-Lot` was back in "run" with `plants` 5. I did not time down → run with a trace.
3. **Replay: 8.** The plant replay at `replay.kind` "plant", `rate` 0.25, now frames `horse1-body`, `horse3-body` and `horse0-body` side-on and fully in frame, with the grandstand and fence behind. The REPLAY tag and "SPACE to skip" show. Brightness is 32%, a little low but readable. I did not view the finish replay this session.
4. **Photo finish and tangled AI collapse: 7.** The results banner reads "PHOTO FINISH · 0.02s" with `finishT` 21.77 against 21.78, and `tangles` was 1 at 6.93. That 0.02 s gap has appeared in sessions 38 and 39, so it looks scripted. The live camera follows `YOU` only, so the pile-up is seen only in the replay.
5. **Results with most face-plants award: 9.** The panel shows a podium, the badges "SMOOTH OPERATOR" and "DIRT EATER · MOST FACE-PLANTS" on Sir Trips-a-Lot with 5 plants, and DNF distances ("14 m short"). It also says "Press R for another race".
6. **Looks as LOOK.md says: 8.** `grandstand` with its crowd, rail, `finish-line` checker, `hills` and the dirt `track` all show. Saturation is 60% and no blown-out highlights.
7. **window.__game convention, index.html at root: 9.** The state has `phase`, `raceT`, `horses`, `replay`, `results` and `tangles`.
8. **Clip moments in the first minute: 7.** The pile-up at 7 s and the photo finish at about 22 s both happen with no input. The pile-up is shown only in the replay, not live. The results screen ended the race while `Sir Trips-a-Lot` and `YOU` were still running, which is fine.
9. **Controls feel learnable: 6.** I did not test it this session. Session 38's rhythm run reached a lead and then face-planted. Nobody has confirmed a clean finish in under 60 s.
10. **Horses read as horses, match refs/01.jpg: 9.** The replay shows grey, chestnut and bay horses with saddles, white socks, dark hooves, mane, tail, the stand and a "10 m" marker.
11. **Juice: 8.** Boing, thud, gasp, cheer and powerup all fired, and `div#chips` shows live face-plant counts. I did not run `feel` for camera shake.
12. **Local 2-player discoverable from the HUD: 9.** The `2 PLAYERS (2)` button is in `div#top-r`. I did not play 2-player.
13. **Static page, vendored lib, no network: 9.** `perf` shows 378 draw calls, 33.5k triangles and 0 MB of assets. The 85.7 ms frame is SwiftShader, so it is not a fault.

**Faults: 8.** I saw no console errors and no `Never visible` object. The only open note is that the AI finish times look engineered, and the live camera misses the pile-up. Host load was 1.8, so the frame time is noise.

**Next:**
1. **Show the pile-up live (asked again).** When two or more AI horses go "down" within about 3 m, ease the race camera toward them for about 1.5 s, then return to `YOU`. The check is `interact` `until {tangles:1}` followed by `look`: `horse0-*` and `horse1-*` should both be in frame, with the "PILE-UP!" pop over them. Today the live camera stays on `YOU` at `x` 1.4 while the tangle is at `x` about 14.
2. **Vary the AI finish times and keep the photo finish occasional.** Add per-horse speed jitter, seeded per race, so `finishT` values differ by more than 0.3 s in most races. Trigger the 0.02 s dead heat only on some races. In a run with no input, `results[*].finishT` should not be within 0.05 s of each other every time.
3. **Prove the human path to the finish.** Use `interact` to alternate Q+P then W+O at about 8-frame intervals for about 50 s, and check that `YOU.finishT` is under 60 s. If it is not, ease the stumble rate for alternating keys. Then add a replay fill light (brightness 32% against a 35% target) and run `feel` on the camera shake at a face-plant.

SCORE: 8.1
