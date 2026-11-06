The last builder's section and the last judge's verdict; paprika-loop/PROGRESS.md holds every session's.

### Judge 19

Both of those `Surfaces:` lines are already in my verdict. Next item 1 covers the track repeat and the z-fighting between the two `player-marker-*` rings, and the Faults score of 8 counts the z-fighting.

**Judge 19 verdict (final)**

1. **Plays as DESIGN.md's Core loop and Controls say: 8.** `Digit2` gives `mode` 2 with P1 and P2 horses, each with its own `player-marker-*` ring. `div#keys` shows both key sets. My key taps were too short to move the horses, so I did not re-measure speed.
2. **Real Rapier jointed ragdoll, face-plant, auto-right: 8.** The `horse0-*` to `horse3-*` limbs read as jointed. By 20 s, two horses showed `FACE-PLANTS` 1 in the `div#chips`.
3. **Replay: 8.** Not re-seen this session. Iteration 18 recorded the banner.
4. **Photo finish and tangled AI collapse within the first minute: 7.** AI horses face-planted by 20 s. No finish was reached in my run, and a photo finish has never been observed.
5. **Results with most face-plants award: 8.** Not re-checked. The podium "1" card overlaps the horse behind it, as in judge 18.
6. **Looks as LOOK.md says: 8.** The `grandstand`, rail fence, `hills`, `sky` and `clouds` match refs/01.jpg. The white YOU horse is 52% bright against 29% around it. The `track` is the weakest surface: its repeat shows and the brown is flat.
7. **window.__game convention, index.html at root: 9.**
8. **Clip moments within the first minute, no input: 7.** The camera follows the still YOU horse, so the AI tangle is mostly off-screen.
9. **Controls feel learnable: 8.** The tips line and `div#keys` caps guide the player. Mistimed keys were not tested.
10. **Horses read as horses, match refs/01.jpg: 9.**
11. **Juice: 8.** Sounds fired: blip ×3, powerup, cheer. The "GO!" banner and dust work. The `shakeAmp` shake is still not seen.
12. **Local 2-player discoverable from the HUD: 9.** The "2 PLAYERS (2)" button, the per-player key caps and the pink `player-marker-1` all show.
13. **Static page, vendored lib, no network: 9.** 387 draw calls, 33.8k triangles, 0 MB of assets. The 65 ms frame is SwiftShader at host load 6.0, so it is no budget signal.

**Faults: 8.** "Never visible: none" and no console errors. The z-fighting between `player-marker-0` and `player-marker-1` at y = 0.06 is a fault.

**Next:**
1. **Fix the `track` repeat and the z-fighting rings.**
   - Vary the `track` texture scale with distance, or blend two scales, and make the lane stripes and hoof-prints clearer. `look` should no longer report "repeats every 60 px".
   - Give the `player-marker-*` rings `polygonOffset` or a 0.001 y offset. The `Surfaces:` line should disappear.
2. **Keep the AI collapse and finish in frame when the player stands still.** Frame the camera on the lead pack or on the horse that just face-planted. A no-input `sheet` at 10 s, 20 s and 35 s should show the tangle.
3. **Verify the unseen moments.** Use `setState` to put two AI horses at x 58 and check the "PHOTO FINISH" caption and the 0.25x replay. Put a horse "down" and `sheet` consecutive frames for the shake. Check the podium overlap on the results screen. Then run a Q+P / W+O rhythm for 20 s and read x from `observe`.

SCORE: 8.2

## Iteration 20
**Did** game.js `markers`: ring `polygonOffset` per player plus y 0.07 + k*0.03, to end the z-fight between `player-marker-0` and `player-marker-1`. view.js `track`: stripe spacing now varies with x (1.4–1.9 m by a noise cell, wavy with sin(x)), and a low-frequency lightness noise is added, so the repeat is broken.
**Saw** `look` at frame 0: no console errors. The `Surfaces:` lines for track repeat and marker z-fighting are gone. The only one left is two hidden `grandstand` boxes sharing a face at y=0, facing away from the camera. Brightness 42%, subject 48% against 30%. I did not run `perf`, 2P, the shake, photo finish or a no-input AI tangle.
**Next** (1) Frame the camera on the lead pack or the horse that face-planted when the player is still. (2) Use `setState` to put two AI at x 58 for the photo finish, and check the podium overlap. (3) `sheet` consecutive frames after a face-plant for the shake. Move one hidden `grandstand` box off y=0.
**Open** Only frame 0 was checked. Photo finish, shake, 2P and the AI collapse are still unverified.
