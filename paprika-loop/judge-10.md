**Judge 10 verdict**

1. **Plays as DESIGN.md's Core loop and Controls say: 6.**
   - The auto race runs from countdown to results.
   - `YOU` is stuck at x 2.37 with `legs` "0000" for the whole race. The auto bot never recovers.
   - `Dusty Rhodes` wins alone at `finishT` 24.37.
2. **Real Rapier jointed ragdoll, face-plant and auto-right: 7.**
   - The `plants` counts rise (Sir Trips-a-Lot reaches 5). The `horse3-*` legs are jointed and visibly pose.
   - The winner ends at `pitch` -0.88 with `legs` "0000". Auto-right timing is unmeasured.
3. **Replay (last ~4 s, 0.25x, REPLAY banner, Space skips): 6.**
   - The `kind:"plant"` replay shows the REPLAY banner and "SPACE to skip". Space skips to results.
   - No `kind:"finish"` replay was seen.
4. **Photo finish and tangled AI collapse within the first minute: 4.**
   - `tangles` is 1 by 7.9 s.
   - There is again no photo finish. Only one horse finished, 6.5 s ahead of the next 47 m mark.
5. **Results with most face-plants award: 6.**
   - The podium now holds only `Dusty Rhodes`.
   - The `SMOOTH OPERATOR` and `DIRT EATER · MOST FACE-PLANTS` badges show, and non-finishers read "still racing · 11 m short".
   - Results open while Sir Trips is still running at x 47.7. The race should wait for them.
   - A single podium block looks sparse.
6. **Looks as LOOK.md says: 8.**
   - The `grandstand` with its crowd, rail fence, `finish-line` checkers, `hills` and dirt `track` match refs/01.jpg.
   - The `div.box` at alpha 0.69 no longer hides the track.
   - The `track` repeat is still visible.
   - A `Surfaces:` line flags coplanar `grandstand` boxes, but on faces turned away from this camera.
7. **window.__game convention, index.html at root, static deploy: 9.**
8. **Clip moments in the first minute with no input: 5.**
   - The tangle and the face-plant replay land by about 8 s.
   - There is no photo finish and no slow-motion side replay at the line.
9. **Controls feel learnable: 4.**
   - A human run was not tested again. The `#tips` line says "Q+P then W+O works!".
   - The auto `YOU` never moves past x 2.4, so there is no evidence a finish in 60 s is possible.
10. **Horses read as horses, match refs/01.jpg: 8.**
    - The head, mane, tail, white socks and dark hooves all read in the replay close-up.
11. **Juice: 7.**
    - 23 sounds fired in the results run (cheer, gasp, thud, boing).
    - The `#chips` and results popups are present. Camera shake is still unmeasured.
12. **Local 2-player discoverable from the HUD: 8.**
    - `div#top-r` has "2 PLAYERS (2)" and the `div#keys` panel swaps to both players' keys.
13. **Static page, vendored lib, no network: 9.**
    - 383 draw calls, 0 MB of assets, no console errors.
    - Frame time was 95 ms on SwiftShader (host load 1.1), which is noise.

**Faults: 5.**
- No photo finish after seven sessions.
- `Never visible: dust`.
- The finish pose has `pitch` -0.88.
- The `YOU` bot is stuck.
- Results show while horses are still running.

**Next:**
1. **Make the photo finish deterministic, with a banner and a `kind:"finish"` replay (asked again, a seventh time).**
   - The soft sprint nudge has failed three sessions in a row, so change the mechanism.
   - Once the leader passes x 40, give the top two running horses the same target speed. Pull a face-planted chaser up with `state:"run"` and a boost.
   - On the second crossing, show a PHOTO FINISH! popup and play a side-on `kind:"finish"` replay held on the `finish-line`.
   - One call shows it done: `interact` with `until:{phase:"replay"}` and `look:true`. The top two `finishT` values should be within 0.3 s, and the picture should show the banner and the `finish-line`.
2. **Fix the auto `YOU` bot and the results timing (asked again).**
   - In `physStep`, the `AUTO` branch leaves `YOU` at `legs` "0000". Make it alternate Q+P and W+O every ~10 frames whatever the pose, so `YOU` reaches x 50 or more.
   - Hold results until the second finisher crosses, or until 4 s after the first, so the podium has more than one block.
   - Level the post-line `pitch` to about -0.1 with the legs released.
   - One call shows it done: `interact` with `until:{phase:"results"}`. `YOU` should be at x 50 or more and the podium should hold two or more finishers.
3. **Prove the human can finish, and fix the surfaces.**
   - Run `interact` alternating Q+P and W+O every ~10 frames and check it reaches x 60 in under 60 s.
   - Run `feel` on a forced face-plant to measure the shake.
   - Move `dust` in front of `track` (it is still "Never visible").
   - Break the visible repeat in the `track` texture with a second, larger-scale dirt blend.

SCORE: 6.6
