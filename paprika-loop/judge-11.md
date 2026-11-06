**Judge 11 verdict**

1. **Plays as DESIGN.md's Core loop and Controls say: 5.**
   - The race runs from countdown to a results order of Dusty Rhodes, Sir Trips-a-Lot, Hoof Hearted, YOU.
   - The auto `YOU` still sits at x 1.4–2.4 with `legs` "0000" in `interact`, for the whole race.
   - There is still no auto-recovery for `YOU`.
2. **Real Rapier jointed ragdoll, face-plant and auto-right: 7.**
   - The `horse3-*` and `horse0-*` legs pose and collapse: `plants` 1–2, and the replay shows a clear tumble.
   - Both finishers end at `pitch` about -0.9 with `legs` "0000". The post-line pose is still wrong.
3. **Replay (last ~4 s, 0.25x, REPLAY banner, Space skips): 8.**
   - The `kind:"plant"` and `kind:"finish"` replays both show the REPLAY tag and "SPACE to skip".
   - The finish replay is held on the `finish-line` checkers and reads well.
   - The `div.pop` "PHOTO FINISH!" overlaps the `div.tag` "REPLAY", and its subtitle is drawn twice as a ghost.
4. **Photo finish and tangled AI collapse within the first minute: 8.**
   - `tangles` is 1 by 7.9 s.
   - The finish gives "Dusty Rhodes by a nose (0.10s)": `finishT` 23.92 against 24.02.
   - Both horses lie in a heap on the line, which is funny.
   - The pull is deterministic, so this is a real fix.
5. **Results with most face-plants award: 7.**
   - The results order holds four names, and the `DIRT EATER` award was present last session.
   - I did not re-look at the results screen this session.
6. **Looks as LOOK.md says: 8.**
   - `grandstand` crowd, rail fence, `finish-line`, dirt `track` and `hills` all match refs/01.jpg.
   - The `track` texture repeat is still visible as brown panels.
   - The `Surfaces:` line only flags `grandstand` faces turned away from this camera.
7. **window.__game convention, index.html at root, static deploy: 9.**
8. **Clip moments within the first minute, no input: 8.**
   - The tangle and plant replay land by about 8 s.
   - The photo finish replay lands at about 24 s.
9. **Controls feel learnable: 4.**
   - I alternated Q+P and W+O every 10 frames. `YOU` went from x 1.4 to 2.2 in about 1 s, which is about 0.8 m/s.
   - At that rate 60 m takes about 75 s, over the 60 s target.
   - The `legs` string toggles between "1001" and "0110" correctly, so the keys work.
10. **Horses read as horses, match refs/01.jpg: 8.**
    - The head, mane, tail, white socks, dark hooves and saddle all read in the replay close-up.
11. **Juice: 7.**
    - 10 to 11 sounds fire per run (cheer, gasp, thud, boing, powerup).
    - Camera shake is still unmeasured.
12. **Local 2-player discoverable from the HUD: 8.**
    - The `describe()` lists the Digit2 and two-player keys.
    - I did not re-look at `div#top-r` this session.
13. **Static page, vendored lib, no network: 9.**
    - 385 draw calls, 34k triangles and 0 MB of assets.
    - The 140 ms frame is SwiftShader noise at host load 1.0.

**Faults: 6.**
- `dust` is still "Never visible" (19 units, behind `track` in the first look, outside the view in the second).
- The finished horses stay at `pitch` -0.9.
- The auto `YOU` is stuck.
- The "PHOTO FINISH!" popup overlaps the REPLAY tag and has a ghost duplicate subtitle.

**Next:**
1. **Fix the auto `YOU` bot and speed up human forward motion (asked again).**
   - In `physStep`, the `AUTO` branch leaves `YOU` at `legs` "0000" and at x 2.4 forever. Alternate Q+P and W+O every ~10 frames.
   - Raise the drive per stride so that the same rhythm covers 60 m in under about 50 s, which is at least 1.3 m/s.
   - One call shows it done: `interact` with `until:{phase:"results"}` and `trace:["horses.2.x"]`. `YOU` should end at x 50 or more. The human-rhythm run should also reach about x 20 by frame 1500.
2. **Level the post-line pose and fix the popup (asked again).**
   - After `finished`, release the legs and ease `pitch` to about -0.1. Standing winners will make a better finish replay.
   - Give `div.pop` its own position below `div.tag`, and remove the duplicate subtitle.
   - One call shows it done: `interact` with `until:{replay.kind:"finish"}` and `look`. The popup should not overlap REPLAY, and the finishers should stand.
3. **Move `dust` and break the track texture repeat.**
   - Lift the `dust` particles above the `track` surface and tie them to hoof thuds, so the `Never visible` line disappears.
   - Blend a second, larger-scale dirt noise into the `track` texture to break the brown panels.
   - Run `feel` on a plant to measure the camera shake.

SCORE: 7.0
