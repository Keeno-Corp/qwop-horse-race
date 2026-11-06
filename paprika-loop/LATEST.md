The last builder's section and the last judge's verdict; paprika-loop/PROGRESS.md holds every session's.

### Judge 65

**Judge 65: scores**

1. **Plays as DESIGN.md says: 7.** Digit1 gives the "3-2-1" countdown card with the `keys` panel and the Q+P / W+O tip. In my run, `YOU` stood at x 2.05 at frame 543, with `legs` "0000". That was a replay of the countdown opener, so I don't count it as a play result. The solo race ran to `phase` "results". The player did not finish: "YOU DNF · 56 M SHORT". This session proves no human finish. Last session's alternating run reached x 24.7 in 4.8 s.
2. **Real Rapier ragdolls, face-plant and auto-right: 8.** Sir Trips-a-Lot logged `plants` 6 and Hoof Hearted 2. Sir Trips-a-Lot ended with `pitch` 3.12, upside down and DNF 3 m short, so a horse can fail to auto-right. The legs and motors are visible in the pictures.
3. **Replay and photo-finish look: 6.5.** The results card says "PHOTO FINISH · 0.19s". I did not see the sepia replay, grain, scratches, gate weave or the "PHOTO FINISH" frame. This is the fourth session without it.
4. **Photo finish and tangled AI collapse within a minute, no input: 8.5.** Hoof Hearted finished at 24.35 s and Dusty Rhodes at 24.54 s, a 0.19 s margin. `tangles` was 1 and Sir Trips-a-Lot collapsed 3 m short. All of it happened inside 29 s.
5. **Results with most face-plants award: 9.** The card shows "DIRT EATER · MOST FACE-PLANTS" on Sir Trips-a-Lot (6 plants) and a "SMOOTH OPERATOR" badge. It also has a podium, per-horse face-plant counts and "PRESS R".
6. **Looks as LOOK.md says: 6.5.** The toon steps, outlines, warm light and CRT/VHS pass hold. The ground is still flat yellow-olive with big diagonal shadow polygons. `hills` is a 1 px sliver (0.13%) and `track` a 4 px strip. `grandstand` and `crowd` never read as a place, because `crowd` is "behind the camera".
7. **`__game` convention, static, no network: 9.** `__game` returns its keys. Assets are 0.32 MB with vendored fonts, and there were no console errors.
8. **Horses match CHARACTERS.md: 8.** The silks read: the red diamonds, the green stripes, the blue polka dots on cream, and the "4" cloth on orange. The big eyes, bristly mane, tufted tail and bridle also read. The hooves and white socks are still small. The longer legs now give a less squat horse.
9. **Broadcast overlay: 9.** The `tote` has silks, face-plant counts and live odds (YOU went from 5-2 to 30-1, and the winner shows "WIN"). The LIVE bug, the clock (3:58 PM to 4:02 PM), the race-time bug, the progress bar and the `lower` commentator all show. The commentator changed to HANK "HOOFBEAT" PRUITT with a fitting line, "GOING TO THE PHOTOGRAPHERS". `look` reports 0 overlaps.
10. **Camera: 7.** The side-tracking telephoto works. I did not see the head-on cut or the replay cams.
11. **Learnable controls: 6.** No human finish is proven in 11 sessions. In last session's run, `YOU` sat low for about 0.9 s at the start before standing.
12. **Local 2-player, discoverable: 8.** The "2 PLAYERS (2)" button and the "2 = TWO PLAYERS" tips bar show it. I did not play it.
13. **Style judged as hard as gameplay: 7.** The HUD, results card and horses carry the 70s feel. The empty ground and the missing stand weaken the picture.

**Faults: 7.** There were no console errors. `perf` read 120 ms a frame on SwiftShader (266 draw calls, 126k triangles, host load 2.3), which is no signal on a software renderer. The `look` of results says the last frame drew only into a render target, so the canvas shows an earlier frame. That suggests a missing `setRenderTarget(null)` in the replay or post pass, and it needs checking. `lake`, `posts`, `crowd`, `merged` and `basic-merged` are all "never visible". The `merged` z-fight is unfixed.

**Next:**
1. **Prove a human finish, with no early dog-sit (asked again, eleven sessions).**
   - In `physics.js`, lower the leg motor torque or add damping. Add a short stand-up assist for the first second.
   - Check `until` is not mis-set: `horses.2.finished` never became true.
   - Done when `interact` alternates Q+P and W+O at 18 frames a hold, with `until` `{"horses.2.finished": true}` and `max` 3600, gives `finishT` under 60.
2. **Make the world behind the horses read (asked again).**
   - Tilt the race camera up, or move the `grandstand` body and `crowd` into view under the "GRAND STAND" sign.
   - Pull a `hills` treeline into the upper third.
   - Replace the flat yellow ground with a grass-to-dirt gradient and cut the big shadow polygons.
   - Done when `look` with `sample` at [300, 40] and [900, 600] gives clearly different colours, and `On screen` lists `crowd` and `grandstand`.
3. **Show the sepia photo-finish replay and the head-on cut (asked again).**
   - Run `look` with a `sheet` at about 1 s and 4 s after the finish of a no-input race, so the replay and the head-on cut appear as separate shots.
   - Fix the render-target-left-bound warning in the same pass.
   - Hide or offset `merged` to end the z-fight.
   - Done when the sheet shows sepia, grain, scratches and a "PHOTO FINISH" frame, and `look` no longer reports the render target warning.

SCORE: 7.6

## Iteration 66
**Did**
- No code change. Ran the Judge 65 item 1 check: `interact` alternating Q+P / W+O at 18 frames a hold (Digit1, 200-frame countdown wait first; Space to skip the mid-race plant replay).
**Saw**
- `YOU` (horses.2) finished: `finished` true, `finishT` 14.32 s (Dusty Rhodes 14.52 s, AI Sir Trips-a-Lot and Hoof Hearted face-planted, plants 3 each, ended upside down `pitch` 3.12). `YOU` plants 0, ran ~4.5 m/s steadily, no early dog-sit seen (y 1.2–1.5 from raceT 3.6 s). Judge 65's DNF came from the 200-frame countdown still running (`phase` "countdown" till frame 55 of the second call), so `until` and holds must wait it out. Not run: `look`, `perf`, replay sheet.
**Next**
- 14 s is far under the 60 s target; the pace is likely too easy: add leg torque loss or fatigue, or slow the top speed, so a clean run takes ~25–40 s.
- Stand legibility (`crowd`, `grandstand`, `hills`, flat yellow ground); sepia photo-finish replay and head-on cut sheet; `merged` z-fight; render-target-left-bound warning.
**Open**
- AI horses fall in the first 5 s and often fail to auto-right (pitch 3.12 upside down, DNF).
