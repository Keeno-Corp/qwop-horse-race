**Judge 68: scores**

1. **Plays as DESIGN.md says: 6.5.** Digit1 gives the countdown, then the race. The `keys` panel (Q FL, W FR, O BL, P BR) and the "ALTERNATE LEGS: Q+P THEN W+O" tip bar show. The no-input race finishes at about 24 s with a "PHOTO" tote, "CARTWHEEL!" and "HOOF HEARTED IS DOING GYMNASTICS!". I did not prove a human finish, now 13 sessions without one.
2. **Rapier ragdolls, face-plant and auto-right: 8.** Sir Trips-a-Lot, Hoof Hearted and YOU run with visible leg motion in the "mid" shot. Hoof Hearted does a cartwheel with `plants` 2 on the tote.
3. **Replay and photo-finish look: 8.5.** The sheet shows two replays. The "INSTANT REPLAY · 0.25X" banner appears over the mid-race replay. At finish+8 s the sepia "PHOTO FINISH" frame has a film border and perforations, a "REPLAY 0.25X" tag, a "WINNER: SIR TRIPS-A-LOT · BY 0.13 SEC" caption, and visible grain and a scratch line. This is the first session in which I saw it. The replay camera sits very close to the horse, so the finish line itself is hard to read.
4. **Photo finish and tangled AI collapse within a minute, no input: 8.5.** The tote shows PHOTO for horses 1 and 4 at about 24.5 s, and Hoof Hearted cartwheels.
5. **Results with most face-plants award: 8.** Judge 67 saw the DIRT EATER badge. The tote's FACE-PLANTS counters (2, 2, 0, 0) are live. I did not re-open the results card this session.
6. **Looks as LOOK.md says: 8.** The toon 3-step shading, thick outlines, warm golden light and CRT/VHS pass hold. The stand roof, crowd on benches, ad boards (GOLDEN HOOF OATS, TOP-CAT TIRES, PRON...), the "10" board, a green-to-orange track and a sky gradient now read as a 70s race broadcast. The "GRAND STAND" sign is clear of the HUD at finish+4 s but is still partly hidden at the start. Remaining flaws: the ground is flat orange with large shadow polygons, the treeline is missing, and the horizon is weak.
7. **`__game` convention, static, no network: 9.** `__game` returns its keys, assets total 0.32 MB with vendored fonts, and there were no console errors.
8. **Horses match CHARACTERS.md: 8.** The red diamonds, green stripes, blue polka dots and orange "4" cloth read, with blinkers, big eyes and bristly mane. The white socks and hooves are visible but still small.
9. **Broadcast overlay: 9.** The `tote` has silks and live odds (30-1, 4-1, PHOTO). The LIVE bug, 3:58 PM and 4:00 PM channel-7 clock, race time, progress bar, `lower` commentator (Walt Dunmore, then Hank "Hoofbeat" Pruitt), and the "CARTWHEEL!" and "INSTANT REPLAY" banners all show. `look` reports 0 overlaps.
10. **Camera: 8.** The side-tracking telephoto, the replay cam and the close sepia photo-finish cam work. The countdown "1" is huge in the start picture. I did not see the head-on cut.
11. **Learnable controls: 6.** No human finish is proven. In the start picture YOU stands upright.
12. **Local 2-player, discoverable: 8.** The "2 PLAYERS (2)" button and the "2 = TWO PLAYERS" tips bar show it. I did not play it.
13. **Style judged as hard as gameplay: 8.** The HUD, background, replay and horses now cohere as a 70s broadcast.

**Faults: 7.5.** There were no console errors. `perf` read 89.7 ms a frame (266 draw calls, 126k triangles) on SwiftShader, which is not a signal. The Never-visible list still names `crowd`, `lake`, `posts`, `merged` and `basic-merged` as "behind the camera", and `hills` as 560 units "in view" but with no pixel. `crowd` is plainly on screen, so that is a stale bounding-sphere reading. The `dust` object has 0 units. The ground has no texture or gradient.

**Next:**
1. **Prove a human finish (asked again, thirteen sessions).**
   - Add a stand-up assist for the first second (a damped torso-pitch spring), lower the leg torque or add damping, and make alternating Q+P / W+O reliably advance the horse.
   - Done when `interact` alternates Q+P and W+O at 18 frames a hold, with `until` `{"horses.2.finished": true}` and `max` 3600, gives `finishT` under 60.
2. **Finish the background: ground and horizon.**
   - Give the `track` and ground a dirt-to-grass gradient and grain texture, and shrink or soften the large diagonal shadow polygons.
   - Check that the `hills` treeline reads in the top third at z below -60 and is not fully hazed out.
   - Move the "GRAND STAND" sign out from under `top-r` at the start.
   - Done when `look` with `sample` at [300, 560], [900, 600] and [600, 120] gives three clearly different colours and the treeline silhouette shows in the top third.
3. **Show the head-on cut and the results card.**
   - Take a `look` sheet at the finish and about 12 s later, and check the head-on cut, the results card (DIRT EATER badge, podium, "PRESS R") and the 2-player mode with Digit2.
   - Widen the photo-finish replay framing so the finish line and both horses' noses show, not just one horse's chest.
   - Fix the `merged` z-fight and the stale Never-visible bounds by recomputing `crowd` and `merged` bounding spheres.
   - Done when the sheet shows the head-on shot, the replay frame holds both horses and the line, and `look` no longer lists `crowd` as behind the camera.

SCORE: 8.0
