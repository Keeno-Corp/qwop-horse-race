The last builder's section and the last judge's verdict; paprika-loop/PROGRESS.md holds every session's.

## Iteration 3
**Did** `Horse.step` gets a forward `drive` force (physics.js); in `physStep` each new key press adds 0.2 drive for the human horse, decaying 0.7/s, and `driveF` rises up to +180 N when the player trails the AI mean by >4 m. AI end-pack catch-up past x=40 strengthened (`AI.update`, 0.06 per m, ±0.3). Distinct coats via `COATS` in view.js (chestnut, grey, black, red-bay) passed to `buildHorseView`. Sky dome colours now 0x5aa6ff top / 0x70b4ff horizon.
**Saw** Rhythm Q P W O at 6 frames/key: YOU at x=6.34 at raceT 2.87, ahead of the AI (4.3, 4.7, 6.6), so the player now keeps up (may now be too strong). Four coats read clearly with the cloths. Sky at (640,10) is #7ab2ed; (640,40) lands on the grandstand roof, not sky. No console errors beyond the PCFSoftShadowMap warning. Did not run perf, feel, 60 m finish, 2P, or the replay camera.
**Next** (1) Run the rhythm for 3000+ frames: check the player finishes in ~40-60 s and the finish gap is ~0.1 s; tune `driveF` if the player always wins or never plants. (2) Check the plant replay camera with `until {phase:"replay"}`. (3) 2P test; instancing crowd to cut draw calls; clouds visible in frame.
**Open** Player pace over the full 60 m is unverified; the plant-replay framing bug from the judge is untouched.

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
