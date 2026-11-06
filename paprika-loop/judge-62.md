**Judge 62: scores**

1. **Plays as DESIGN.md says: 7.5.** Digit1 starts the race. With no input, YOU sat at x 1.99 with `legs` "0000" while the AI ran. No human finish has been played for seven sessions.
2. **Real Rapier ragdolls, face-plant and auto-right: 8.** At 9.9 s Hoof Hearted was `state` "down" with `pitch` 0.24 and `plants` 1, and `tangles` was 1. The thud and gasp sounds fired. I did not see the auto-right.
3. **Replay and photo-finish look: 7.** `replay.kind` "plant" ran at `rate` 0.25, with the "INSTANT REPLAY · 0.25x" tag and "SPACE to skip". The replay picture is a real moment: four horses bunched at mid-race with the `grandstand` behind. So it is not the stale start frame that session 61 feared. `look` still prints the render-target-left-bound line, which looks like a tool artefact. I did not see the sepia photo finish.
4. **Photo finish and tangled AI collapse within a minute, no input: 7.5.** One AI horse was down and `tangles` was 1 by 9.9 s. I did not reach a finish.
5. **Results with most face-plants award: 8, carried over, not viewed.**
6. **Looks as LOOK.md says: 6.5.** The toon steps, outlines, CRT vignette and warm light hold. The ground is still flat yellow-olive with only faint stripes. The `hills` object is out of frame, so the top is empty. The `grandstand` is a floating tan beam with a cut-off "GRAND STAN" sign.
7. **`__game` convention, static, no network: 9.** `window.__game` returns its keys, assets are 0.32 MB, fonts are vendored, and I saw no console errors.
8. **Horses match CHARACTERS.md: 7.5.** The silks (diamonds, stripes, dots), numbered saddle cloth, big eyes and bristly mane show. The lower camera shows legs better, but the bunched horses overlap and the hooves are still small.
9. **Broadcast overlay: 8.5.** The replay tag and skip hint show with 0 overlaps. The HUD elements were not re-viewed this session.
10. **Camera: 7.** The lower pitch is better and the horses are bigger in frame. I did not see the head-on cut or the replay cams as separate shots.
11. **Learnable controls: 7.** A finish under 60 s is still unproven.
12. **Local 2-player, discoverable: 8, carried over.**
13. **Style judged as hard as gameplay: 7.** The 70s fence, the orange track strip and the CRT pass work. The empty yellow ground and the floating stand weaken the frame.

**Faults: 7.** I saw no console errors. `look` flagged the render-target line again, which `broadcast.js` already resets, so I treat it as a tool artefact. `perf` read 111 ms a frame on SwiftShader (266 draw calls, 126k triangles). The host load was 1.7, but this is a software renderer, so it is no signal. `track` is only a 4 px strip, and the `postpass-quad` hides the horse parts from `look`'s ID image.

**Next:**
1. **Ground and grandstand (asked again).** Give the `grandstand` a base and a crowd tier so its feet touch the ground. Replace the flat yellow ground with a grass-to-dirt gradient and stronger stripes. Add a treeline or hill strip at the top of the frame. Done when `look` with `sample` at [300, 600] and [900, 150] gives clearly different colours (dirt, grass or sky) and the stand has a visible base.
2. **Playable human finish (asked again).** In `physics.js`, soften the leg motor torque or add damping, and lengthen `DIM.upper` and `DIM.lower` by about 15%. Done when `interact` alternates Q+P and W+O at about 18 frames a hold, with `until` `{"horses.2.finished": true}` and `max` 3600, gives `finishT` under 60.
3. **Show the other shots.** Make a `look` `sheet` of the head-on cut and the photo-finish replay (sepia, grain, "PHOTO FINISH" frame), so the sheet shows them as separate shots. If a close finish is not near-certain with no input, add rubber-band AI tuning.

SCORE: 7.5
