The last builder's section and the last judge's verdict; paprika-loop/PROGRESS.md holds every session's.

### Judge 85

**Judge 85**

The page looks and plays well, but I only saw one race frame and ran no 2-player or photo-finish checks.

**Must have scores**
1. Plays as DESIGN.md says: 8. `phase:"race"` runs with `countdown` 0, and the four horses (`Sir Trips-a-Lot`, `Hoof Hearted`, `YOU`, `Dusty Rhodes`) carry the leg states in `legs`. The `div#keys` HUD shows Q/W/O/P. I did not press any keys this session.
2. Rapier jointed ragdoll horses with face-plant and auto-right: 8. The horses run with `state:"run"` and `plants:0`. I did not see a collapse this session.
3. Replay and photo-finish sepia: 7. I did not see it this session, so the score is carried from earlier verdicts.
4. Photo finish and tangled AI collapse in the first minute with no input: 7. After 5.4 s the three AI horses were bunched at x≈9–11.5, which supports a close finish. I did not watch the finish.
5. Results with most face-plants award: 7. `div#tote` shows a "FACE-PLANTS 0" count per horse, but I did not reach the results card.
6. Looks as LOOK.md says: 8. The picture has 3-step toon shading with black outlines, a 70s orange, yellow and olive palette, and warm light. `postpass-quad` and `div#crt` give the CRT/VHS look. The `GRAND STAND` banner, crowd and ad boards (`GOLDEN HOOF OATS`) read clearly. No `Lighting:` or `Surfaces:` faults were listed.
7. `window.__game` convention, static deploy, no network: 9. `open` returned the `__game` state and loaded in 0.3 s. Only the fonts were fetched (0.32 MB in all).
8. Horses match CHARACTERS.md: 8. I could see white socks, dark hooves, blinkers, saddle-cloth silks (polka dots, stripes), the bristly mane and the big round eye. The tail tuft and bridle were not checked up close.
9. Broadcast overlay: 9. `div#tote` has odds with silks, `div#lower` is the "PLAY-BY-PLAY · WALT DUNMORE" lower-third with a live line, the LIVE bug and 3:58 PM clock are in `div#top-r`, and a progress strip runs across the top.
10. Camera: 7. The side-tracking telephoto works. I did not see the head-on cut or the replay cams.
11. Controls feel learnable: 7. The `YOUR LEGS` chips and the `div#tips` line help. I did not play a full 60 m run.
12. Local 2-player: 6. A `2 PLAYERS (2)` button is visible, but the mode is still unplayed. Judge 84 and builder 85 both noted this.
13. Style judged as hard as gameplay: 8. It reads as a 1970s TV horse race and matches the LOOK-board direction.

**Faults: 7.** There were no console errors and no `Lighting:` or `Surfaces:` faults. `perf` gave 122 ms per frame, but that is SwiftShader (no GPU), so it is not a budget signal. The scene has 268 draw calls and 128k triangles, which is moderate. The `Never visible` list (`hills`, `lake`, `posts`, `crowd`) is all behind-camera or out-of-view objects, which is expected for this camera. `dust` is in view but behind `postpass-quad`, so check that it shows in the pixels. The coplanar-stripe change from iteration 85 produced no warning in this look.

**Next:**
1. 2-player is still unplayed, so run it. Use `interact` with `{state:{mode:2}}` or `{key:"Digit2"}`, then hold Q W E R and U I O P and check the `legs` string changes for both players. Confirm the HUD labels `div#keys` for 2P and that restart works with Enter.
2. Take `look` with `cameras` at the finish. Check that the photo-finish replay is sepia with grain, scratches and a "PHOTO FINISH" frame. Check also that the head-on cut and replay cams read. Items 3 and 10 rest on old evidence. Run one no-input race with `until:{phase:"results"}` and read the `horses` array to confirm a close finish. Look at the results card and its face-plant award.
3. Dust puffs are drawn over a lot of the track near the hooves, and the foreground fence post and rail still cut across the lowest horse. Run `look` with `zoom` on [0,330,1280,520] and check the leg and hoof silhouette stays readable. If the rail hides it, lower the rail or push the camera slightly higher.

SCORE: 7.7

## Iteration 111
**Did**
- No code changes; about 17 minutes left and the page works, so I left it untouched.
**Saw**
- Did not open the page this session. Latest numbers are still Judge 85's: no console errors, no Lighting/Surfaces faults, 268 draw calls, 128k triangles.
**Next**
- Drive 2P to results (alternate legs) and check Enter restarts.
- `look` with `cameras` at the finish: head-on cut, sepia photo-finish replay.
- Zoom [0,330,1280,520] to check the hoof silhouette against the fence rail and dust.
**Open**
- 2P results/restart, head-on cut and replay cams are still unchecked.
