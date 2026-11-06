**Judge 69: scores**

1. **Plays as DESIGN.md says: 6.** The Digit1 start gives a "2" countdown and then the race. The `keys` panel and the "ALTERNATE LEGS: Q+P THEN W+O" tip bar show. I held Q and P for 18 frames and YOU (`horses.2.x`) went 2.0 → peak 2.15 → 2.1, so it did not advance. That is a 14th session without a proven human finish.
2. **Rapier ragdolls, face-plant and auto-right: 8.** The `horses` state reads `run` with `plants` counters, and the legs move in the "mid" shot. The tote shows Hoof Hearted at 4 FACE-PLANTS by finish+12 s.
3. **Replay and photo-finish look: 7.5.** I did not re-check it this session. Judge 68 saw the sepia frame, but its framing is too tight to show the line.
4. **Photo finish and tangled AI collapse within a minute, no input: 8.** At race time 25.75 s the tote shows PHOTO for horses 1 and 4, with the commentator saying "HOOF HEARTED EATS DIRT!".
5. **Results with most face-plants award: 7.** The tote's FACE-PLANTS counters are live. I did not see the results card this session.
6. **Looks as LOOK.md says: 8.** The toon shading, outlines, golden light and CRT pass hold. The stand roof, benches of crowd, the ad boards (GOLDEN HOOF OATS, TOP-CAT TIRES, PRON...) and the "10" board read as a 70s broadcast. The ground is still flat orange with big shadow shapes, and there is no treeline.
7. **`__game` convention, static, no network: 9.** `__game` returns its keys, assets total 0.32 MB with vendored fonts, and I saw no console errors.
8. **Horses match CHARACTERS.md: 8.** The red diamonds, green stripes, blue polka dots and orange "4" cloth read, with blinkers and an eye. The socks and hooves are small.
9. **Broadcast overlay: 9.** The `tote`, the LIVE bug, the 3:58 and 4:00 PM channel-7 clock, the race-time readout, the progress bar and the Walt Dunmore lower-third all show.
10. **Camera: 7.5.** The side-tracking telephoto and the countdown cam work. I did not see the head-on cut.
11. **Learnable controls: 5.** The Q+P hold above moved YOU by 0.15 m at most, and YOU does not advance from key input.
12. **Local 2-player, discoverable: 8.** The 2p sheet cell shows a pink marker, "P1 / P2" tote names, a Q W E R | U I O P key panel and a "2 PLAYERS (2)" button. I did not play it.
13. **Style judged as hard as gameplay: 8.** The HUD, set and horses cohere as a 70s broadcast.

**Faults: 7.** `perf` read 104.8 ms a frame on SwiftShader (265 draw calls, 126k triangles), which is not a signal. The "GRAND STAND" sign is still clipped under the `top-r` HUD in the start and 2p pictures, so the iteration 69 move did not fix it. The sign reads "GRAND STAN" at the top edge in the start, mid and 2p cells. I saw no console errors.

**Next:**
1. **Prove a human finish (asked again, 14 sessions).**
   - Add a stand-up assist (a damped torso-pitch spring), lower the leg torque or add damping, and make a Q+P then W+O alternation move YOU forward.
   - Done when `interact` alternates Q+P and W+O at 18 frames a hold, with `until` `{"horses.2.finished": true}` and `max` 3600, gives `finishT` under 60. Alternatively, `horses.2.x` should pass 10 within 300 frames.
2. **Fix the "GRAND STAND" sign (asked again).**
   - Raise it or shift it left in `view.js` so the camera sees the whole word clear of the `top-r` HUD (the iteration 69 move was not enough).
   - Done when `look` at the start shows "GRAND STAND" in full with no HUD over it.
3. **Finish the ground and horizon.**
   - Give the `track` a dirt-to-grass gradient and grain, soften the shadow polygons, and make the `hills` treeline read in the top third.
   - Done when `look` with `sample` at [300, 560], [900, 600] and [600, 120] gives three clearly different colours.
   - After that, take a `look` sheet to show the head-on cut and the results card.

SCORE: 7.6
