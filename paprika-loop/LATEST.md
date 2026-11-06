The last builder's section and the last judge's verdict; paprika-loop/PROGRESS.md holds every session's.

### Judge 64

**Judge 64: scores**

1. **Plays as DESIGN.md says: 7.5.** Digit1 starts a "3-2-1" countdown card. After that, alternating Q+P and W+O (18 frames a hold) took `YOU` to x 10.1 by raceT 2.57 s, ahead of all three AI, with `legs` "0110" and `keys` lighting up. `YOU` ended that picture sitting low in a dog-sit. I did not play to the line, so a human finish under 60 s is still unproven.
2. **Real Rapier ragdolls, face-plant and auto-right: 8.** The horses show jointed legs mid-gallop, and `pitch` and `state` run. `plants` stayed 0 in this run, so I saw no face-plant or auto-right this session.
3. **Replay and photo-finish look: 6.5.** I did not reach a finish, so no sepia replay, grain, scratches or "PHOTO FINISH" frame was seen. Replay quality is unverified for the third session running.
4. **Photo finish and tangled AI collapse within a minute, no input: 8.** Last session's no-input run gave a 0.13 s photo finish and a DNF tangle. I did not rerun it.
5. **Results with most face-plants award: 8.5.** I did not reach results. The last verified card showed "DIRT EATER · MOST FACE-PLANTS".
6. **Looks as LOOK.md says: 6.5.** The toon steps, outlines, warm light and CRT/VHS pass hold, and the white fence and orange track stripes read as 70s. The ground is still flat yellow-olive with large diagonal shadow polygons. A "GRAND STAND" sign and a tan awning now enter the top edge. But the `grandstand` body, `crowd` and `hills` (a 1 px sliver) still never read as a place.
7. **`__game` convention, static, no network: 9.** `__game` returns its keys, assets are 0.32 MB with vendored fonts, and there were no console errors.
8. **Horses match CHARACTERS.md: 8.** The silks (blue polka dots, a "4" chevron cloth, red diamonds, green stripes), big eyes, bristly mane, tufted tail and bridle all read. The hooves and white socks are still small.
9. **Broadcast overlay: 9.** The `tote` has silks and live-moving odds (Sir Trips-a-Lot went from 5-1 to 8-1). The LIVE bug, `3:58 PM` clock, race-time bug, progress bar and lower-third commentator lines all show, with 0 overlaps. The commentator changed from WALT DUNMORE to HANK "HOOFBEAT" PRUITT between pictures.
10. **Camera: 7.** The side-tracking telephoto works. I did not see the head-on cut or the replay cams.
11. **Learnable controls: 6.5.** The alternating gait moves `YOU` ahead, but the horse dog-sits, and no human finish has been shown.
12. **Local 2-player, discoverable: 8.** The "2 PLAYERS (2)" button and the tips bar show it. I did not play it.
13. **Style judged as hard as gameplay: 7.** The HUD and horses carry the 70s feel. The empty ground and the stand cropped at the top edge weaken the picture.

**Faults: 7.** There were no console errors. `perf` read 111 ms a frame on SwiftShader (266 draw calls, 126k triangles, host load 1.8), which is no signal on a software renderer. `lake`, `posts`, `crowd`, `merged` and `basic-merged` are all "never visible" (behind the camera). `track` is only a 4 px strip. The `merged` z-fight is unfixed.

**Next:**
1. **Make the world behind the horses read (asked again).**
   - Tilt the race camera up slightly further, or push the `grandstand` body down and forward, so the stand's seating and `crowd` show under the "GRAND STAND" sign.
   - Pull a `hills` treeline into the upper third; it is still a 1 px sliver.
   - Replace the flat yellow ground with a grass-to-dirt gradient and cut the big shadow polygons.
   - Done when `look` with `sample` at [300, 40] and [900, 600] gives clearly different stand and ground colours, and `On screen` lists `crowd` and `grandstand`.
2. **Prove a human finish, with no dog-sit (asked again, ten sessions).** Soften the leg motor torque or add damping in `physics.js`, and lengthen `DIM.upper` and `DIM.lower` about 15%.
   - Done when `interact` alternates Q+P and W+O at 18 frames a hold, with `until` `{"horses.2.finished": true}` and `max` 3600, gives `finishT` under 60.
3. **Show the photo-finish replay and the head-on cut (asked again).** Run `look` with a `sheet` after a no-input finish at about frame 2045, with the moments set via `state`. It should show the sepia replay (grain, scratches, "PHOTO FINISH" frame) and the head-on cut as separate shots. The `merged` z-fight is still open; hide or offset `merged`.

SCORE: 7.7

## Iteration 65
**Did**
- `physics.js` `DIM.upper` 0.6→0.69, `DIM.lower` 0.66→0.76 (+15%), `STAND_H` updated to match (0.18+0.69+0.76+0.03). Leg torque untouched.
**Saw**
- `interact` Q+P / W+O at 18 frames a hold: `YOU` sat low (y 1.09) for the first ~0.9 s, then stood (y 1.49–1.53, state "run", plants 0) and reached x 24.7 by raceT 4.8 s (~5 m/s), ahead of all AI. A plant replay (rate 0.25) started mid-run from an AI face-plant. Finish not reached in the steps I ran, so `finishT` is not measured; the pace suggests well under 60 s. Not run: `look`, `perf`, replay and head-on sheet, stand/ground work.
**Next**
- Run the full human finish and read `horses.2.finishT`; check the pace is not too easy (5 m/s) and retune if so.
- Stand legibility: `crowd` behind camera, `hills` sliver, flat yellow ground (Judge 64 item 1).
- Photo-finish replay and head-on cut look sheet; `merged` z-fight.
**Open**
- Longer legs not checked for AI behaviour in a full no-input race (AI plants happened: 2 of 3 AI fell in the first 5 s). Early dog-sit for ~0.9 s at the start remains.
