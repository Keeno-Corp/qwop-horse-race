**Verdict, session 41**

1. **Plays as DESIGN.md's Core loop and Controls say: 8.** `phase` went countdown → race. `div#top-r` holds `1 PLAYER`, `2 PLAYERS (2)` and `RESTART`. `div#keys` shows the Q, W, O, P caps, and `div#tips` says "Alternate legs: Q+P then W+O · R restart · 2 = two players". I did not finish a race or press R after one.
2. **Real Rapier jointed ragdoll, face-plant, auto-right: 8.** The `YOU` ragdoll has jointed legs (`legs` "0010"). At `raceT` 1.62 it is sprawled on the track with a pitch of -0.55 while `state` still says "run". The dust at the hooves reads well.
3. **Replay: 7.** I did not view a replay. This is carried over from session 39 (`replay.kind` "plant", 0.25x, REPLAY banner, Space skips).
4. **Photo finish and tangled AI collapse: 8.** Carried over from session 40: `tangles` was 1 at about 6 s, with a live pile-up camera and an occasional `deadHeat`. I did not check finish-time spread this session.
5. **Results with most face-plants award: 8.** Not re-viewed. Session 39 saw the podium and the "DIRT EATER" badge.
6. **Looks as LOOK.md says: 8.** The look shows `grandstand` with a blocky crowd, red/blue/yellow tiers, white rail, orange-brown `track` and low-poly horses with white socks. Saturation is 67% and brightness 36%, with 0% near black and 0% blown out. `player-body` stands out at 2.8% of the frame. The look reports `Surfaces:` on two hidden `grandstand` boxes whose faces share the plane y = 0.00. They face away from the camera, so it is a minor fault.
7. **window.__game convention, index.html at root: 9.** `observe` returns `phase`, `raceT` and `horses` (`name`, `x`, `state`, `plants`, `finishT`, `legs`).
8. **Clip moments in the first minute: 8.** Carried over from session 40: a pile-up at about 6 s and an occasional photo finish. The two pops no longer overlap, per the builder's Saw (0 overlap), and this look also reports 0 overlap.
9. **Controls feel learnable: 6.** I alternated Q P W O at 8-frame intervals. By `raceT` 1.62, `YOU` was at `x` 5.73 but already tipped over (pitch -0.55). The Q+P / W+O rhythm that was safe in session 40 can sprawl the horse early. I have still not seen a finish under 60 s, which has now gone three sessions unproven.
10. **Horses read as horses, match refs/01.jpg: 9.** Dark manes and tails, white socks, dark hooves, a stand with crowd, a rail and green hills in a sunny palette.
11. **Juice: 8.** Blip, powerup and cheer sounds fired. The dust particles (`dust*`), the `div#chips` plant counts and the blue player ring and marker all show. I did not run `feel` on the camera shake.
12. **Local 2-player discoverable from the HUD: 9.** The `2 PLAYERS (2)` button is in `div#top-r`. I did not play 2-player.
13. **Static page, vendored lib, no network: 9.** `perf` shows 378 draw calls, 33.5k triangles and 0 MB of assets. The 73.5 ms frame is SwiftShader, so it is not a fault.

**Faults: 8.** I saw no console errors. The `Never visible` object is `sky`, which is a backdrop. The `Surfaces:` line on the `grandstand` boxes is the only fault, and it is minor. The frame time is software-rendered, so I did not count it.

**Next:**
1. **Prove or fix the human finish (asked again).** Run `interact` with a longer Q P W O loop (about 25 s) and check that `YOU.finishT` is under 60 s. At 8-frame intervals `YOU` pitched to -0.55 by `raceT` 1.6, so first try a slower or longer-hold rhythm, or soften the early torque on the player horse, and tune from `YOU.pitch` and `YOU.plants`. `until {"horses.2.finished":true}` shows it done, with `finishT` under 60.
2. **Add per-horse speed jitter (asked again), applied after the rubber-band `band`.** Seed it per race in `resetRace`. Check across several seeds with `deadHeat` off: `results[*].finishT` should spread by more than 0.3 s.
3. **Run `feel` on the face-plant camera shake, and brighten the replay.** Replay brightness was 32% in session 39, so add a fill light in the replay camera. Then fix the `grandstand` y = 0.00 face overlap by moving one box 0.001 off the plane or removing the hidden face, so the `Surfaces:` line goes away.

SCORE: 8.1
