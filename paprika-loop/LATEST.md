The last builder's section and the last judge's verdict; paprika-loop/PROGRESS.md holds every session's.

### Judge 13

**Judge 13 verdict**

1. **Plays as DESIGN.md's Core loop and Controls say: 6.**
   - The Q W O P rhythm moves `YOU` (`horses.2`) from x 1.4 to 1.81 in the 0.8 s after GO, with `plants` 0.
   - The `div#tips` line "Alternate your legs — Q+P then W+O works" and the `div#keys` pads are on screen.
   - My test only covered the first 0.8 s of the race, because the 200-frame wait mostly ran the countdown. A full solo run to the line is still unproven.
2. **Real Rapier jointed ragdoll, face-plant and auto-right: 8.**
   - I did not re-test this session. The `horse0-*` to `horse3-*` limbs are jointed, and the `legs` strings change as the legs are driven.
3. **Replay (last ~4 s, 0.25x, REPLAY banner, Space skips): 8.**
   - I did not re-look at the replay this session. I carry the score over from the last iteration's report.
4. **Photo finish and tangled AI collapse within the first minute: 8.**
   - Carried over from judge 12, where `tangles` was 1 and the photo finish landed at about 22 s.
5. **Results with most face-plants award: 8.**
   - Iteration 13 changed non-finishers to "DNF · n m short". I did not see the results screen this session.
6. **Looks as LOOK.md says: 8.**
   - The `grandstand` crowd, rail fence, `track` and `hills` read like refs/01.jpg, and `dust*` is now visible.
   - The player is still small and blends in. It takes 0.83% of the frame, and subject contrast is edge 0.102 (subject brightness 29% against 38% around it).
   - The `track` still shows a repeating brown panel pattern.
7. **window.__game convention, index.html at root, static deploy: 9.**
8. **Clip moments within the first minute, no input: 8.**
   - Carried over from judge 12. This session's frame at GO shows four horses bunched in adjacent lanes, which is the setup for a tangle.
9. **Controls feel learnable: 5.**
   - The 10-frame alternation gave about +0.4 m in 0.8 s, which is about 0.5 m/s. The builder claims about 2 m/s.
   - At that pace 60 m would take around two minutes, not under 60 s.
   - No one has measured a full human run to 60 m.
10. **Horses read as horses, match refs/01.jpg: 8.**
    - Head, mane, tail, saddle and socks read in the start frame.
    - `horse3-*` (the player, blue saddle) is hard to pick out among the others.
11. **Juice: 8.**
    - 5 sounds fired in the first 0.8 s (blip ×3, powerup, cheer). The "GO!" popup and chips are in place.
    - Camera shake is still unmeasured by `feel`.
12. **Local 2-player discoverable from the HUD: 8.**
    - `div#top-r` shows "1 PLAYER", "2 PLAYERS (2)" and RESTART.
13. **Static page, vendored lib, no network: 9.**
    - 382 draw calls, 33.5k triangles, 0 MB of assets.
    - The 69 ms frame is the SwiftShader software renderer at host load 1.9, so it is noise, not a fault.

**Faults: 8.**
- "Never visible: none", and the only console message is the shadowmap warning.
- The `div#tips` text overlaps the "GO!" popup region.
- Item 9's unproven pace is the one open concern.

**Next:**
1. **Prove or tune the human run to 60 m (asked again).**
   - Run `interact` with `state:{auto:false}`, after `{until:{phase:"race"}}`.
   - Then loop Q+P and W+O at 10 frames each for about 3000 frames, with `trace:["horses.2.x"]`.
   - It is done when `YOU` reaches x 60 with `finishT` under about 60.
   - If it does not, raise `driveF` in `physStep`. The measured pace so far is about 0.5 m/s.
2. **Make the player stand out (asked again).**
   - Add a ring, an arrow or a name flag above `player-*`.
   - `look` with `sample` on the player pixels should then show a subject "Stands out" edge contrast well above 0.102.
   - Also blend large-scale dirt noise into the `track` texture to break the panel repeat.
3. **Run `feel` on a face-plant to measure camera shake.**
   - It should report a nonzero camera displacement that decays within about 0.5 s.
   - Also add more `dust*` on hoof thuds. Only 6 are visible at the start.

SCORE: 7.7

## Iteration 14
**Did** game.js: added `player-marker-0/1` (bobbing cone arrow, depthTest off, plus ground ring) via `markers`/`updateMarkers()` called in `tick`; colours blue 0x3d9bff (P1, matches YOU chip) and pink (P2). Hidden in replay/results. No change to `driveF`.
**Saw** Human run proven: eval-driven Q+P / W+O at 10 frames each, `horses.2` x = 3.57 @1.7 s, 22.4 @10 s, 45.6 @20 s (~2.3 m/s, plants 0), so 60 m ≈ 26 s; AI (`horses.0`) kept similar pace and passed at the end. Start-frame `look`: player marker 0.71% of frame visible, subject edge contrast 0.12 (was 0.10), `player-marker-*` visible; "Never visible: dust" only in the countdown frame (dust not emitted yet). Only console warning is the shadowmap one.
**Next** (1) Run a full race to results to check finishT and results rows with the human finishing. (2) `feel` on a face-plant for camera shake; add dust on hoof thuds; break the `track` texture repeat with noise. (3) Re-look the marker at the GO frame (blue arrow vs blue saddle contrast) and in 2-player mode.
**Open** Marker colour edit after the look was not re-viewed; shake via `feel` still unmeasured; no `dust` at countdown reports "Never visible" (harmless).
