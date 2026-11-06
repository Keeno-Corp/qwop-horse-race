The last builder's section and the last judge's verdict; paprika-loop/PROGRESS.md holds every session's.

### Judge 3

**Judge 3 verdict**

1. **Plays as DESIGN.md's Core loop and Controls say: 7.**
   - The Q P W O rhythm at 6 frames per key took `horses.2` ("YOU") to x=5.16 at raceT 2.17, level with Dusty Rhodes at 5.22 and ahead of the other two AI. The player keeps up now.
   - A second run ended in a plant replay at raceT 6.9 with YOU at x=7.39. The stronger drive makes the player plant too, which suits the mistimed-keys goal.
   - A third run of 10 s of the same rhythm also reached a replay by raceT 6.9. I never saw a 60 m finish, 2-player mode or R restart (the R in the first step may have restarted the race, but it was not checked).

2. **Real Rapier jointed ragdoll horses, face-plant and auto-right: 7.**
   - By raceT 6.8, `horses.0` and `horses.1` were `state: "down"` with `plants: 1` and `tangles: 1`. The `dust*` particles and the PILE-UP and FACE-PLANT popups show.
   - I did not see an auto-right or time it.

3. **Replay (last ~4 s, 0.25x, REPLAY banner, Space skips): 7.**
   - `phase: "replay"` with `kind: "plant"` shows the REPLAY banner and "SPACE to skip".
   - The camera now follows the horse that planted. The `player` mesh fills 3.9% of the frame and the grandstand is behind it.
   - The AI that planted are small at the right edge: `horse0-*` is 0.24% of the frame. This replay was never framed on a tangle of several horses.
   - I did not see the finish replay.

4. **Photo finish and tangled AI collapse within the first minute: 6.**
   - The tangle is confirmed at raceT 6.8. Two AI are down and the third is partway down (pitch -0.75).
   - I never reached a finish, so the photo-finish gap, the ~0.1 s target, is still unmeasured.

5. **Results with most face-plants award: 4.**
   - Not reached in this session.

6. **Looks as LOOK.md says: 8.**
   - Check 1 (sky near #7bbaff) now passes: (640,10) is #78b0ed. (640,40) is #9ac2ea and sits on the grandstand roof, not sky.
   - The four coats (chestnut, grey, black, red-bay) plus cloths on `horse0`–`horse3` and `player` read clearly.
   - `#chips`, `#tips` and `#keys` don't overlap. There is no `Lighting:` line.
   - There are no clouds in frame. At the start `player` is only 0.8% of the frame.

7. **window.__game convention, index.html at root, static deploy: 9.**
   - `observe` returns the state JSON with keys and metadata. There are no network assets (0 MB).

8. **Clip moments in the first minute with no input: 8.**
   - With no input, FACE-PLANT and PILE-UP popups, dust and a visible tangle appear at 6.8 s. A stranger could laugh within about 10 s.
   - The photo-finish half is still unproven.

9. **Controls feel learnable: 6.**
   - Rhythm input keeps pace and mistimed input plants the horse. A 60 m finish under 60 s was not demonstrated.
   - The player may now be too strong or too fragile. It planted at about 7 m in the longer run.

10. **Horses read as horses, match refs/01.jpg: 8.**
   - Heads, manes, tails, socks, the covered grandstand with crowd, white rails, "10 m" signs and green hills match the reference. Clouds are still missing.

11. **Juice: 7.**
   - Sounds fired (cheer, thud, gasp, powerup) and the commentator popups show.
   - I did not run `feel`, so camera shake is unverified.

12. **Local 2-player, discoverable from the HUD: 6.**
   - The `2 PLAYERS (2)` button is visible. I did not play it.

13. **Static page at root, vendored lib, no network: 9.**
   - `perf` gave 380 draw calls and 33k triangles, with 0 MB assets. A frame takes 95 ms on SwiftShader, which says nothing about a real GPU.

**Faults: 7.**
- There are no console errors. The only console line is a PCFSoftShadowMap warning.
- `Never visible` read "dust (0 units, in view, behind track)" at the first look and "none" once the horses were running.
- The replay look reported `grandstand` box faces sharing a plane (y = 0.00). It is minor.
- The 380 draw calls are mostly crowd and `horse*` meshes.

**Next:**
1. **Prove the full race and the results screen (asked again).**
   - Add a time-based auto-play or a debug action, for example `__game.act`, so one `interact` run drives the player through all 60 m.
   - Tune `driveF` so a steady rhythm finishes in about 40–55 s with a few plants.
   - Check with `interact` `until: {phase: "results"}`. `observe` should show `finishT` on all four horses, a top-two gap of about 0.1 s, and the most-face-plants award on screen in `look`.
2. **Frame the replays on the action.**
   - For a `kind: "plant"` replay, aim the camera at the centroid of the planted horses or the tangle, not the player.
   - For a finish replay, use a side view of the line.
   - `interact` with `until: {phase: "replay"}` and `look` should show at least 2 `down` horses filling more than 3% of the frame.
3. **Add the clouds and a closer opening camera.**
   - Add low-poly clouds in `look`'s view, at sky (640,10) or higher, as in refs/01.jpg.
   - Start the camera closer, so `player` takes more than 3% of the opening frame instead of 0.8%.
   - Then run `feel` on a face-plant to confirm the camera shake, and play 2-player with Q W E R against U I O P to check it.

SCORE: 7.1

## Iteration 4
**Did** game.js: `__game.setState({auto:true, autoPeriod})` makes the human horse run a perfect Q+P / W+O rhythm (`AUTO`, in `physStep`) so one `interact` plays all 60 m. `subjectAt` now returns the centroid of horses within 5 m of the planted one, so plant replays frame the tangle. Replay camera 5.5 m out. `clouds` group (14 icosahedron-blob clouds, drifting, behind the hills at y 34-52). Opening countdown camera closer (z 7.2, y 2.6). `driveF` rebalanced to 30 + catch-up (max 0) minus a lead penalty (8/m beyond 1 m ahead of AI mean).
**Saw** Auto-rhythm full race: finishes at raceT 22.0 s, results screen shows (podium, DIRT EATER / SMOOTH OPERATOR awards, "DNF · 11 m short" for slower AI), 0 plants for the player; AI at 48-56 m at finish. Second-place gap ~ not within 0.1 s (AI too slow; only YOU and sometimes one more finish). Before the tune the player was 49 m at 16 s. Plant replay look: player mesh 1.9% of frame, tangle framing not re-checked after the centroid change. Clouds and the opening camera were not looked at. No console errors beyond the PCFSoftShadowMap warning. perf, feel, 2P not run.
**Next** (1) Speed up the AI (`AI.base` 0.74-0.86 -> ~0.6) and strengthen the rubber band so the AI finish within ~0.1-1 s of the player; check `finishT` on all four and the PHOTO FINISH popup. (2) `look` at the opening frame and at a plant replay to verify the clouds, the closer camera and the centroid framing (>3% for 2 down horses). (3) `feel` on a face-plant (shake), 2P Q W E R vs U I O P test, instancing the crowd to cut the 380 draw calls.
**Open** Race is ~22 s with perfect rhythm, shorter than the 40-60 s target (a human will be slower). DNF AI at the finish; photo-finish still unproven.
