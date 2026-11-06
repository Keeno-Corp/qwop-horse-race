**Judge 18 verdict**

1. **Plays as DESIGN.md's Core loop and Controls say: 8.**
   - This session I pressed Q+P then W+O, but the 20-frame holds were too short. `YOU` was at x 1.41 after 2.57 s, with `legs` "0000", `pitch` 0 and `state` "run". The AI horses were at x 3 to 5.5.
   - `div#keys`, `div#tips` and `div#top-r` ("1 PLAYER", "2 PLAYERS (2)", "RESTART") are visible.
   - Judge 17 measured about 2.3 m/s with a longer rhythm, so I did not re-measure it.
2. **Real Rapier jointed ragdoll, face-plant and auto-right: 8.**
   - The `horse0-*` to `horse3-*` limbs and the dust bursts from the hooves read as jointed running.
   - No face-plant happened in this run, so face-plant and auto-right were not re-seen.
3. **Replay: 8.**
   - Iteration 18 recorded the REPLAY banner and "SPACE to skip". I did not re-check them.
4. **Photo finish and tangled AI collapse within the first minute: 7.**
   - No collapse happened in the first 2.6 s. All four `plants` were 0.
   - A photo finish with two horses within 0.3 s has still never been observed.
5. **Results with most face-plants award: 8.**
   - Iteration 18 recorded the "YOU WINS!" box with the "DIRT EATER · MOST FACE-PLANTS" badge. I did not re-check it. The podium "1" card overlaps the horse behind it.
6. **Looks as LOOK.md says: 8.**
   - The `grandstand` with its blocky crowd, the white rail fence, `hills`, `sky` and `track` read as sunny low-poly like refs/01.jpg.
   - The blue `player-marker-*` ring and arrow are clear.
   - The cream `horse3-*` (YOU) is 44% bright against 45% around it. That is lower than judge 17's 47% against 31%, because the grey and tan horses sit right next to it. It stands out only through the blue ring.
   - The `track` is still a flat brown with visible panel repeats.
7. **window.__game convention, index.html at root: 9.**
8. **Clip moments within the first minute, no input: 7.**
   - The tangle and the auto replay were seen earlier, but not in this run.
9. **Controls feel learnable: 8.**
   - Judge 17's Q+P / W+O rhythm gave steady progress with no plants. Mistimed keys were not tested this session.
10. **Horses read as horses, match refs/01.jpg: 9.**
    - Head, mane, tail, white socks, dark hooves and saddle colours all read in the look.
11. **Juice: 8.**
    - Sounds fired: blip ×3, powerup, cheer. Dust flies and the `div#chips` counters work.
    - The `shakeAmp` 0.3 change from iteration 18 is still not seen visually.
12. **Local 2-player discoverable from the HUD: 8.**
    - The cream coat per player index was not checked.
13. **Static page, vendored lib, no network: 9.**
    - 387 draw calls, 33.8k triangles, 0 MB of assets.
    - The 67 ms frame is SwiftShader at host load 1.6, so it is no budget signal.

**Faults: 9.**
- "Never visible: none". The only console message is the shadowmap warning.

**Next:**
1. **Make the player horse (`horse3-*` / `YOU`) stand out and show shake.**
   - Give the player a saturated or white coat, or a brighter saddle, so it separates from the tan and grey neighbours.
   - Check with `look` `sample` on the player body and on the horse beside it, and expect a clear colour difference.
   - Then use `setState` to put `Hoof Hearted` "down" and take a `sheet` of consecutive frames. Expect a visible camera offset that decays within about 0.5 s.
2. **Break up the `track` repeat and the flat brown.**
   - Add noise, hoof-prints and lighter lane stripes to the `track` canvas texture.
   - Check with a `look` `zoom` on the track at the start line, and expect no visible panel repeat.
3. **Check 2-player mode, a mistimed-key run and a photo finish.**
   - Press `Digit2` and look for a distinct `player-marker-*` and coat on each horse.
   - Teleport two AI horses to x 58 with different speeds. Expect a "PHOTO FINISH" caption and a side replay.
   - Also dim the results box background so the podium "1" card no longer overlaps the horse behind it.

SCORE: 8.2
