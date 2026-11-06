The last builder's section and the last judge's verdict; paprika-loop/PROGRESS.md holds every session's.

## Iteration 63
**Did**
- `view.js` ground (`hills` mesh colours): mowing stripe lightness ±0.05→±0.09; far ground (wz −4…−16) lerps to a greener 0x4f9a3c. (A dirt lerp is wired in but multiplied by 0, so it does nothing.)
- `view.js` `stand()`: added a `slab` plinth box under each grandstand so its base touches the ground.
**Saw**
- Look at the intro card (frame 0): page loads, no console errors, 0 HTML overlaps. Ground reads green-olive with visible stripes. Not checked: race frame, grandstand base, `perf`, replay, human finish.
**Next**
- Look at the race frame and sample ground and sky colours, then check the grandstand base. The sagging tan beam in the intro look may be the roof edge: check it from the race camera.
- Playable human finish (`physics.js` leg torque, `DIM.upper` and `DIM.lower` +15%): undone eight sessions.
- Look sheet of the head-on cut and the photo-finish replay.
**Open**
- Human finish, replay and photo-finish pictures, and a real dirt gradient are undone.

### Judge 63

Both runs are played and `perf` is done. I'm writing the verdict now.

**Judge 63: scores**

1. **Plays as DESIGN.md says: 7.5.** Digit1 starts the race, the "GO!" card shows, and the `keys` and `tips` HUD read clearly. With no input YOU stayed at x 2.01 with `legs` "0000", ending DNF 56 m short. A human finish has still not been shown in eight sessions.
2. **Real Rapier ragdolls, face-plant and auto-right: 8.** Hoof Hearted took 4 `plants` and `pitch` reached 0.67. The thud, gasp and boing sounds fired, and `tangles` was 1. I did not see the auto-right.
3. **Replay and photo-finish look: 6.5.** I got the "PHOTO FINISH · 0.13s" result card, but I did not view the sepia replay, grain or "PHOTO FINISH" frame. `look` again reports the render-target-left-bound line.
4. **Photo finish and tangled AI collapse within a minute, no input: 8.5.** In a no-input race Dusty Rhodes finished at 20.73 s and Sir Trips-a-Lot at 20.86 s, a 0.13 s photo finish. Hoof Hearted face-planted 4 times and was DNF. The results phase came at 25 s.
5. **Results with most face-plants award: 9.** The card shows the "DIRT EATER · MOST FACE-PLANTS" badge on Hoof Hearted, the "SMOOTH OPERATOR" badge, the podium and the DNF "56 M SHORT" line.
6. **Looks as LOOK.md says: 6.5.** The toon steps, outlines, warm light, CRT pass and 70s fence hold, and the stripes are a bit stronger. But the ground is still mostly flat yellow-olive with big shadow polygons. The `hills` object is only a 1 px sliver at the top, and the `grandstand` was not visible in the race frame, so this session could not check the plinth. The `crowd` and `posts` are listed as behind the camera.
7. **`__game` convention, static, no network: 9.** `__game` returns its keys, assets are 0.32 MB with vendored fonts, and I saw no console errors.
8. **Horses match CHARACTERS.md: 8.** The silks show clearly: red diamonds, green stripes, blue polka dots and the numbered "4" saddle cloth. The big eyes, bristly mane and tufted tail show too. The hooves and white socks are still small.
9. **Broadcast overlay: 9.** The `tote` has silks and live odds ("PHOTO" on the two finishers), the LIVE bug, the `3:58 PM` clock, the progress bar and the "HANK HOOFBEAT PRUITT" lower-third. There were 0 overlaps and the black rectangle is gone. One line, "GO!", fits.
10. **Camera: 7.** The side-tracking telephoto is good. I did not see the head-on cut or the replay cams as separate shots.
11. **Learnable controls: 6.5.** A finish under 60 s is still unproven, and the `legs` stayed "0000" for the player.
12. **Local 2-player, discoverable: 8.** The "2 PLAYERS (2)" button is in the HUD. It was not played this session.
13. **Style judged as hard as gameplay: 7.** The HUD and horses carry it. The empty ground and the missing stand and sky weaken the picture.

**Faults: 7.** I saw no console errors. `perf` read 133 ms a frame on SwiftShader (266 draw calls, 126k triangles), which is no signal on a software renderer. The `crowd`, `posts`, `lake` and `merged` objects are all "never visible" from the race camera. `track` is only a 4 px strip.

**Next:**
1. **Show the world behind the horses (asked again).** The `grandstand`, `crowd` and `hills` never appear in the race frame, so the plinth cannot be checked.
   - Raise the camera lookAt, or move the `grandstand`, `crowd` and a `hills` treeline into the upper third of the frame.
   - Replace the flat ground with a clear grass-to-dirt gradient; the dirt lerp is still multiplied by 0.
   - Done when `look` with `sample` at [300, 150] and [900, 600] gives sky/stand and ground colours that clearly differ, and `On screen` lists `grandstand` and `crowd`.
2. **Playable human finish (asked again, nine sessions).** In `physics.js`, soften the leg motor torque or add damping, and lengthen `DIM.upper` and `DIM.lower` by about 15%.
   - Done when `interact` alternates Q+P and W+O at about 18 frames a hold, with `until` `{"horses.2.finished": true}` and `max` 3600, gives `finishT` under 60.
3. **Show the photo-finish replay.** Run `look` with a `sheet` after the no-input finish at about frame 2045. It should show the sepia photo-finish replay (grain, scratches, "PHOTO FINISH" frame) and the head-on cut as separate shots. If either never appears, fix that first.

SCORE: 7.7
