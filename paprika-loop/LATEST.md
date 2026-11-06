The last builder's section and the last judge's verdict; paprika-loop/PROGRESS.md holds every session's.

## Iteration 37
**Did** game.js `AI.update`: added rubber-band for x 6–22 (a trailing AI speeds up to 45% when `YOU` leads by >1.5 m). Plant-replay camera in `updateCamera` pulled back (d 5.5→8, pair 6.5→9, fov 38→42) so the fallen horse and neighbours fit.
**Saw** Syntax check only (`node --check`); no look or race run this session.
**Next** (1) Run a Q+P / W+O rhythm to results and check the margin to AI `finishT` is under ~1–3 s. (2) `look` during a plant replay to confirm framing and brightness. (3) Trace `horses.2.state` down→run, and look at the finish replay.
**Open** Both changes unverified in the browser; if the rhythm player now loses badly, soften the 0.09 slope.

### Judge 37

**Verdict, session 37**

1. **Plays as DESIGN.md's Core loop and Controls say: 9.** After the countdown, `phase` went to "race". A Q+P then W+O rhythm took `YOU` (`horses.2`) to `x` 35 at `raceT` 9.1, with 0 `plants`. The `1 PLAYER`, `2 PLAYERS (2)` and `RESTART` buttons are in `div#top-r`.
2. **Real Rapier jointed ragdoll, face-plant, auto-right: 8.** At `raceT` 9 the AI `Sir Trips-a-Lot` and `Hoof Hearted` both went `state` "down" with `plants` 1. I did not see either return to "run" this session.
3. **Replay (last ~4 s, 0.25x, REPLAY banner, Space skips): 6.** `pendingReplay` was true and `tangles` was 1, but I did not reach `phase` "replay". The widened plant-replay camera (d 8, fov 42) is still unseen. The builder only ran `node --check`.
4. **Photo finish and tangled AI collapse: 6.** The pop "PILE-UP! A tangle of legs!" and two AI plants happened by 9 s. No photo finish is possible while `YOU` leads by about 15 m.
5. **Results with most face-plants award: 8.** I did not reach results this session. Iteration 36 recorded the badges.
6. **Looks as LOOK.md says: 8.** The look shows the white rail, the stand with its blocky crowd, green `hills`, the dirt `track` and the dust chips. `player-body` shows 47% brightness against 33% around it, with a blue saddle and a `player-marker-*` ring. The only `Surfaces:` note is the hidden `grandstand` face plane.
7. **window.__game convention, index.html at root: 9.** The state has `phase`, `raceT`, `horses`, `pendingReplay` and `tangles`.
8. **Clip moments in the first minute: 7.** The AI tangle came at about 9 s, but the player camera shows only `YOU`, running alone. The face-plant and pile-up pops sit over empty track, so the viewer cannot see the pile-up itself.
9. **Controls feel learnable: 5.** A plain rhythm held about 4 m/s. `YOU` led by 6 m at 3.2 s, 11 m at 6.4 s and 15 m at 9.1 s. The iteration 37 rubber-band did nothing visible: the AI `x` values were 10.9, 11.5 and 13.8 against `YOU` at 24.9. A rhythm player wins by a huge margin.
10. **Horses read as horses, match refs/01.jpg: 9.** The look shows head, neck, mane, tail, white socks and dark hooves on a sunny low-poly scene.
11. **Juice: 8.** The sounds thud, gasp and cheer all fired. The pops and `dust*` chips showed. I did not run `feel` for camera shake.
12. **Local 2-player discoverable from the HUD: 9.** The `2 PLAYERS (2)` button is in `div#top-r`, and `div#tips` says "2 = two players".
13. **Static page, vendored lib, no network: 9.** `perf` shows 378 draw calls, 33.5k triangles and 0 MB of assets. The 63.9 ms frame is SwiftShader, so it is not a fault.

**Faults: 8.** I saw no console errors. The hidden `grandstand` face plane is a minor `Surfaces:` note. `sky` shows as "Never visible" though it is in view. Host load was 2.3, so the frame time is noise. The iteration 37 changes are still unverified, which is a risk.

**Next:**
1. **Make the rubber-band actually work (asked again).** In `AI.update`, `YOU` leads by 15 m at 9 s but the AI barely moves faster. Scale the AI speed with the lead, for example +6% per metre of lead and uncapped up to about 2× base, and apply it from x 0 rather than only x 6–22. Run the same Q+P / W+O rhythm to `phase` "results". Success is `YOU` finishing within about 1–3 s of the first AI `finishT`, with the AI `x` values within about 3 m of `YOU` at `raceT` 9.
2. **Show the tangle and the replay (asked again).** After a plant, `interact` with `until {phase:"replay"}` and `look` with `sample` at the left and right edges. The replay should show the fallen horse and its neighbours fully in frame, at brightness above 35%. Also let the live camera pan toward a pile-up that happens near the player's lane. Then `interact` with `trace` on `horses.0.state` for about 150 frames to show "down" then "run" at about 2 s.
3. **Reach the finish, results and replay.** With the pace fixed, play to `phase` "results" and `look` once at the finish `replay` (`kind` "finish", REPLAY banner, 0.25x side-on shot). Then `look` at the results screen for the "DIRT EATER" badge. This is the first time the photo finish and the finish replay are seen since session 36.

SCORE: 7.7
