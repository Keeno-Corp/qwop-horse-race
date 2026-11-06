The last builder's section and the last judge's verdict; paprika-loop/PROGRESS.md holds every session's.

## Iteration 2
**Did**
- `followTarget()` in game.js: the camera blends from the player to `leader - 3.5` (smoothstep on gap 5→17 m) so an idle or far-behind player no longer pins the camera; zoom-out `far` is damped by the blend. The `YOU nn m` off-screen tag still shows the player.
- Black lower-left rectangle: judged to be the 4× MSAA `WebGLRenderTarget` in broadcast.js (software-renderer tile artifact); set `samples: 0`. Not visible in the later looks (replay, results).
- Tote: the winner shows `PHOTO` and any horse within 0.15 s of the winner shows `PHOTO`, not `—` (dead heat).
- `__game.subject` is now `'track'`.
**Saw**
- No-input race, t=13 s: camera on the leader (Dusty Rhodes) with fence, ads and dust; FACE-PLANT pop on screen; `YOU 29 m` tag on the left.
- Plant replay (sepia, 0.25x, INSTANT REPLAY tag) seen. Results card seen at 27.7 s: `PHOTO FINISH · 0.025`, podium, DIRT EATER and SMOOTH OPERATOR awards, results show 2 finishers and DNF with metres short.
- Real keys Q/P/W/O held 20 frames each: YOU x 1.4→4.57, so the keys work. perf not run.
**Next**
- The finish photo-finish replay (kind `finish`, PHOTO FINISH frame) was not seen: the plant replay played first and Space skipped it. Check with `interact` until phase `replay` with kind `finish`.
- `look` still says `subject` "track" is not in the scene (the name check may need a mesh named exactly so; the track mesh has `name='track'`): verify, or drop it.
- Check the z-fighting (merged meshes x=0.80, planes at y=0.09), 453 draw calls, and 2-player (`Digit2`).
**Open**
- Black rectangle fix is inferred; the earlier zoom `look` of the lower-left (frame 1101, before the MSAA change) still showed near-black there, and I did not re-zoom after.
- Dead heat at 0.9 chance still looks scripted-ish; not examined.

### Judge 2

**Scores (Must have, in order)**

1. **Plays as DESIGN.md says: 6.** Solo with 3 AI runs start to finish with no input. The camera now follows the leader pack (`followTarget`), and the idle `YOU` shows as the `◀ YOU 19 M` tag. The key panel (`div#keys`), the `1 PLAYER` and `2 PLAYERS (2)` buttons and `RESTART` are all on screen. I pressed no real keys this session, and I did not play 2-player or the results card.
2. **Rapier ragdoll horses, face-plant and auto-right: 7.** `Sir Trips-a-Lot` and `Hoof Hearted` went `state:"down"` and were back to `"run"` within the replay window. `Dusty Rhodes` ended at `pitch:3.12`, `plants:5`, a cartwheel-style collapse. The tangle count reached 2.
3. **Replay and sepia photo finish: 8.** I saw both replays:
   - The plant replay (`INSTANT REPLAY · 0.25x`) played at the start of the race, at about 7 s.
   - The finish replay (`kind:"finish"`, rate 0.25) has the sprocket frame, the `PHOTO FINISH` title, a vertical scratch, the sepia grade and `div#flash`. `div#pfc` reads `WINNER: Sir Trips-a-Lot · BY 0.00 SEC · HOLD ALL TICKETS`.
   - The first replay frame (`t:0`) is a nearly black picture (brightness 9%).
   - `look` says the finish-replay frame was drawn into a render target and never to the screen, so the canvas still shows an earlier frame. The replay picture is identical to the live frame, so the replay camera and the live camera look the same.
   - `div.tag "REPLAY 0.25x"` and `div#pfc` overlap in the lower left.
4. **Photo finish and tangled AI collapse within a minute: 8.** With no input the race finished at 24.1 s with a dead heat at 0.00 s. There were 2 tangles and a collapse by `Dusty Rhodes`. It still reads slightly scripted, because both leaders have `finishT` 24.1 exactly. I only watched one run.
5. **Results with most face-plants award: 5.** The last session saw the card (`DIRT EATER` and `SMOOTH OPERATOR` awards). I did not reach it this session.
6. **Looks as LOOK.md says: 7.** Toon shading with outlines, the warm 70s palette, the sepia grade and the CRT vignette all hold. The black rectangle in the lower-left is a fault in the picture. It sits at about [14,475,268,615] in the 1024-wide picture, above `div#lower`, in the live race look (look-3). The MSAA change did not fix it.
7. **`window.__game` convention, static, no network: 7.** `observe` works and assets are 0.32 MB with fonts vendored. `perf` shows 443 draw calls and 184k triangles. The 220 ms frame is a software renderer (host load 1.9), so it is not a fault, but 441 draw calls for the scene is heavy. `subject` is `"track"` and `look` still says it is not in the scene.
8. **Horses match CHARACTERS.md and horse.png: 7.** The replay close-up shows the chunky barrel body, white socks, dark hooves, the round eye with blinker, bristly mane, tufted tail, and the saddle-cloth number with stripes. The legs are shorter than the "long wobbly" brief.
9. **Broadcast overlay: 8.** `div#tote` has silks, odds and face-plant counts. `div#top-r` has the `LIVE` bug and the `3:59 PM` clock bug. `div#lower` has the `PLAY-BY-PLAY · HANK "HOOFBEAT" PRUITT` lower-third with one-liners. The title card was not seen this session. Both the black rectangle and the lower-left overlap hurt this part.
10. **Camera: 7.** The side-tracking telephoto on the leader pack reads well, and the dust, ad boards and grandstand sit behind it. The replay cams were seen. I did not see the head-on cut.
11. **Controls feel learnable: 5.** Last session real keys moved `YOU` from x 1.4 to 4.57. I did not play any real keys this session.
12. **Local 2-player, discoverable: 6.** The `2 PLAYERS (2)` button and the tips line are on screen. I did not play it.
13. **Style judged as hard as gameplay: 7.** The 70s broadcast and the replay frame both read well. The black rectangle and the dark first replay frame spoil it. `reference` against `LOOK-board.png` was not run.

**Faults: 4.** The black rectangle is still there, even though the last Iteration said it was fixed. `YOU` sits idle at x≈1–2 m all race. The first replay frame is nearly black. `look` reports that the replay frame was drawn into a render target and not to the screen. `__game.subject` still names an object that is not found. The 441 draw calls are heavy, but `perf` is not a fault on this host.

**Next:**
1. **Remove the black rectangle** (asked again). Neither the MSAA change nor the earlier `#lower.flash .line` fix worked. Find the element at about x 14–268, y 475–615 with `look` `at` points at [100,520] and [100,580] in a look of their own, then check the `#crt` background image, `.pop`, `#lower::before` and any replay-inset div. One `look` with `sample` at (100,520) and (100,580) should read the track or grass colour, not near-black. In the live race picture they now read near-black.
2. **Fix the replay render pass.** Make sure `setRenderTarget(null)` runs before the final draw so the replay frame reaches the screen. Start the replay on a lit frame, not black at `t:0`. Give the finish replay a different camera from the live one, such as a head-on or low line-of-finish camera. Move `div.tag "REPLAY 0.25x"` so it does not overlap `div#pfc`. A `look` at `replay.t` of about 30 should show the sepia frame from the new angle, with no overlap boxes.
3. **Play with real keys and reach the results card.** Run `interact` with Q, P, W and O held in alternation through a full race, then `Digit2` for 2-player. Keep the idle `YOU` from dominating by showing the player in the pack, or by stopping the `YOU` tag from sitting over the grandstand. Also drop `__game.subject` or point it at a real named mesh. To cut draw calls, merge the crowd and fence into instanced meshes. A `perf` after that should show under 250 draw calls.

SCORE: 6.5
