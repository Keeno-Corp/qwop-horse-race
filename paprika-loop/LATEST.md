The last builder's section and the last judge's verdict; paprika-loop/PROGRESS.md holds every session's.

## Iteration 12
**Did** game.js `physStep`: human `driveF` multiplier 1 → 2.4 (auto stays 0.5). physics.js `step`: once `finished`, pitch torque levels the body to about -0.1 (gain 2600, no clamp). index.html: `.pop span` own text-shadow (the ghost subtitle), `body.replaying .pop{top:30vh}` so the popup clears the REPLAY tag.
**Saw** The "stuck auto YOU" was only the `auto` flag being unset: `interact` with `state:{auto:true}` drives it, and it reaches x 15.6 by frame 600. Human rhythm (Q+P / W+O every 10 frames) was 0.8 m/s before, about 2 m/s after (x 2.06 → 4.47 in 1.2 s). Auto run to the finish replay at frame 2361: finishT Sir Trips 22.30, Hoof Hearted 22.32, YOU 25.55; finishers `pitch` -0.13..-0.21, legs 0000, standing. Look: PHOTO FINISH popup and REPLAY tag no longer overlap (0 overlap), single subtitle. `dust` is still "Never visible" (behind track). Only console warning is the three shadowmap one.
**Next** (1) Lift `dust` above `track` so "Never visible" goes. (2) Break the `track` texture repeat with a larger-scale noise. (3) `feel` on a plant for the camera shake; check the human run for a full 60 m with the real rubber-band.
**Open** Human 2.4x drive is unproven over a full run (the catch-up term may make it too easy or too hard). Dusty Rhodes ended tumbled at x 54.9 in that seed.

### Judge 12

**Judge 12 verdict**

1. **Plays as DESIGN.md's Core loop and Controls say: 6.**
   - With `state:{auto:true}`, `YOU` (`horses.2`) now runs to the line: `finishT` 21.75, x 59.47 at results. The results order is Dusty Rhodes, YOU, Sir Trips-a-Lot, Hoof Hearted.
   - I did not measure the solo Q W O P loop itself over a full race. My one 20-frame human rhythm test only reached x 1.49.
2. **Real Rapier jointed ragdoll, face-plant and auto-right: 8.**
   - The finishers now stand: `Sir Trips-a-Lot` `pitch` -0.05, `YOU` -0.24, `Dusty Rhodes` -0.18, all with `legs` "0000".
   - `Hoof Hearted` has `plants` 3 and `legs` "1111" at x 52. It was still running when the results screen came up.
3. **Replay (last ~4 s, 0.25x, REPLAY banner, Space skips): 8.**
   - I did not re-look at the replay this session. The Iteration 12 `Did` and `Saw` report that `div.pop` now clears `div.tag`.
4. **Photo finish and tangled AI collapse within the first minute: 8.**
   - `tangles` is 1. The photo finish gives "Dusty Rhodes by 0.08s" (`finishT` 21.67 against 21.75), which lands before 25 s.
5. **Results with most face-plants award: 8.**
   - The results `div.box` shows podium cards, per-horse times and "DIRT EATER · MOST FACE-PLANTS" on Hoof Hearted.
   - A horse that never finished shows "still racing · 6 m short". That reads oddly on a results screen.
6. **Looks as LOOK.md says: 8.**
   - The `grandstand` crowd, rail fence, `finish-line` checkers, dirt `track` and `hills` all match refs/01.jpg.
   - The `track` shows a brown panel repeat. The `Surfaces:` line shows no fault.
   - The player blends in: "Stands out" is 57% against 50%, edge contrast 0.033.
7. **window.__game convention, index.html at root, static deploy: 9.**
8. **Clip moments within the first minute, no input: 8.**
   - `tangles` is 1 early. The photo finish lands at about 22 s.
9. **Controls feel learnable: 5.**
   - Iteration 12 raised the human `driveF` to 2.4x, and the builder reports about 2 m/s.
   - My 20-frame test gave only 0.09 m of travel, with a Motion line saying the direction turned 169°. That is too little to confirm anything.
   - No full human run to 60 m has been done by anyone. Iteration 12's Open still lists it as unproven.
10. **Horses read as horses, match refs/01.jpg: 8.**
    - The head, mane and saddle read in the results backdrop and in last session's replay.
    - `horse3-*` (the player) takes only 0.65% of the frame at the results camera.
11. **Juice: 8.**
    - 22 sounds fired in one run (blip, powerup, cheer, thud, gasp, boing).
    - Camera shake is still unmeasured by `feel`.
12. **Local 2-player discoverable from the HUD: 8.**
    - `div#top-r` shows the "1 PLAYER" and "2 PLAYERS (2)" buttons plus RESTART.
13. **Static page, vendored lib, no network: 9.**
    - 384 draw calls, 33.7k triangles, 0 MB of assets.
    - The 63 ms frame comes from the SwiftShader software renderer at host load 2.0, so it is noise, not a fault.

**Faults: 7.**
- `dust` is still "Never visible" (behind `finish-line`).
- There are no console errors. The only warning is the shadowmap one.
- The results screen is still waiting on `Hoof Hearted` (still racing, `legs` "1111").

**Next:**
1. **Prove or tune the human run to 60 m.**
   - Run `interact` with a long loop of Q+P, then W+O every 10 frames. Use about 1800 frames and `trace:["horses.2.x"]`.
   - `YOU` should reach x 60 by about frame 3000 (50 s) and show non-zero `plants` only on mistimed keys.
   - If it is too slow or too easy, adjust the `driveF` and rubber-band terms in `physStep`.
2. **Lift `dust` above the `track` and tie it to hoof thuds.**
   - The `Never visible: dust` line is flagged again; the last verdict also asked for this.
   - A `look` should then list `dust` with pixels, and a `feel` on a plant should show particles.
   - Run `feel` on a plant at the same time to measure the camera shake.
3. **Make the player stand out and break the `track` texture repeat.**
   - Add a coloured outline, a name flag or a marker ring on `player-*`. `look` should then report a subject contrast well above 0.033.
   - Blend a larger-scale dirt noise into the `track` texture to remove the brown panels.
   - End the results wait: when the player and the rest have finished, list a non-finisher as "DNF" instead of "still racing".

SCORE: 7.7
