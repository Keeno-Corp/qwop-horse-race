The last builder's section and the last judge's verdict; paprika-loop/PROGRESS.md holds every session's.

### Judge 50

**Photo Finish Fiasco, judge 50**

I ran `open`, one `interact` (Enter, alternating Q+P and W+O, then `until` the replay phase) with a `look`, `perf` with `costs`, and a second `interact` (Space, then Q+P) with a `look`. I did not play to a human finish, so no finish replay, 2-player mode or head-on cut was seen. Those scores carry over.

1. **Plays as DESIGN.md's Core loop and Controls say: 7.**
   - Space after the replay did not just skip it. It started a fresh race at `countdown` 3.8 with the title card up.
   - My Q+P keys landed in that countdown, so `horses.2.legs` stayed "0000" and YOU stayed at x≈2.09.
   - In the first run, YOU was at x=1.99 at `raceT` 9.9 while the AI were at x=20 to 25. My steps released the keys after about 40 frames and never pressed them again, so no human running was shown.
2. **Real Rapier ragdoll, face-plant collapse and auto-right: 8.** The first run reached `phase:"replay"`, `kind:"plant"`, with "Hoof Hearted" `state:"down"`, `plants:1`, `pitch` 0.24, and `tangles:1`. The collapse and the plant replay trigger both work.
3. **Replay (sepia, 0.25x, Space skips): 7.**
   - The "INSTANT REPLAY · 0.25X" tag and "SPACE to skip" show.
   - The plant replay is not sepia in the `look`: it is the normal orange palette with no visible grain or "PHOTO FINISH" frame. That may be right for a plant replay, but the finish version was not seen.
   - Space then jumped straight to a new race, so I could not tell whether it skips to the result or to a restart.
4. **Photo finish and tangled AI collapse within the first minute: 8.** An AI face-plant and `tangles:1` happened by `raceT` 9.9. No finish was seen.
5. **Results with most face-plants award: 9.** `div#tote` shows "FACE-PLANTS 0" under each horse. The results screen was not reached.
6. **Looks as LOOK.md says: 8.**
   - The toon steps, outlines, `div#crt` and the 70s orange, yellow and brown palette hold.
   - The horse silks (diamond, polka-dot, stripe) read clearly in the replay.
   - The title card, the "TOP-CAT TIRES" and "GOLDEN HOOF OATS" billboards, and the crowd with its numbered board are in place.
   - The grandstand fills the upper half and `hills` is still "Never visible".
7. **window.__game convention, static deploy: 9.** `index.html` is at the root, assets are 0.32 MB and there is no runtime network use.
8. **Horses match CHARACTERS.md and horse.png: 8.** Socks, hooves, round eyes, manes, blinkers and numbered saddle cloths are all there. The merged vertex-colour horses look unchanged.
9. **Broadcast overlay: 9.** `div#tote` has odds (4-1, 3-1, 3-1, 2-1) and silks. `div#lower` has the Walt Dunmore "PLAY-BY-PLAY" line. The LIVE bug, 3:58 PM clock, "RACE TIME", progress bar, `div#keys`, `div#tips`, the "1 PLAYER / 2 PLAYERS (2) / RESTART" buttons and the "The Photo Finish Fiasco Stakes" title card are all present.
10. **Camera: 8.** The side tracking framed the replay pack well. The head-on cut was not seen.
11. **Controls feel learnable: 6.** No human finish has been seen in several sessions. The countdown also swallows early keys, and nothing on screen says when keys start to count.
12. **Local 2-player: 7.** The "2 PLAYERS (2)" button is visible. It was not played.
13. **Style judged as hard as gameplay: 8.** The 70s TV look holds.

**Faults: 6.**
- `perf` shows 266 draw calls (down from 410) and 141k triangles. The 160 ms frame is SwiftShader at host load 3.7, so it is not a budget signal.
- `hills` is "Never visible".
- The `look` after the replay says "every render call drew into a render target, none to the screen, so the canvas still shows an earlier frame". This is probably the post pass with the replay's own pass, but check that `setRenderTarget(null)` runs on the replay path.
- No console errors were seen.

**Next:**
1. **Play to a human finish (asked again, third time).**
   - Make Space during `phase:"replay"` skip to results or resume the race, not start a new race. That is what the second `interact` hit.
   - Then run `interact` with Enter, `wait` until `countdown` is 0, alternating Q+P and W+O (about 15 frames each, repeated), `until` `{"horses.2.finished":true}` and `max` 3000, with `trace` on `horses.2.legs`.
   - Success is `legs` showing "1001" and "0110" and `horses.2.x` rising past 40.
   - Add a "GO!" cue at the start of play so a player knows keys now count.
2. **Draw calls (266, asked again).**
   - `Mesh` (59 calls, 6.7 MB of textures) and `merged-outline` (45) are the biggest left. Merge the outline hulls across all horses into one mesh per horse, not per limb, and merge `mesh-outline` (18).
   - Instance or merge `tail` (16 calls).
   - Thin `crowd` (47.9k triangles, 4 calls) since it is a third of the triangles.
   - `perf` with `costs` should show under 200 draw calls.
3. **Hills and sky behind the grandstand.** Lower the roof or raise the camera pitch so `hills` shows. A plain `look` should then not list `hills` under "Never visible". After that, check the finish replay: take a `look` with `sample` at two frames to show sepia, grain and the "PHOTO FINISH" frame.

SCORE: 7.7

## Iteration 51
**Did**
- No code change. Verified Judge 50's Next item 1 by playing: Space in `phase:"replay"` already calls `endReplay()` and resumes `race` (or goes to results after a finish replay); it does not start a new race. The judge's second `interact` was a fresh page, so Space did nothing and Q+P landed in the countdown.
**Saw**
- Enter then 260 frames: `countdown` ends, the "GO!" cue fires at that point. Held Q+P then W+O gave `horses.2.legs` "1001", "0110" and `x` 2 → 4.4, so the human keys work.
- Autoplay: plant replay at `raceT` 8.7 (tag "INSTANT REPLAY · 0.25X", "SPACE to skip"); Space returned to `race`. YOU then finished (`finished:true`, `finishT` 12.32, x 61) and phase went to `finishing`, with the Tote showing "WIN".
- `look`: brightness 45-52%, no console errors. `hills` is still "Never visible". `crowd` has two coplanar faces at z=-7.41 and z=-7.48 (z-fight warning).
**Next**
- Remove or offset the duplicate `crowd` faces. Lower the roof or raise the camera pitch so `hills` shows.
- Draw calls: merge outline hulls per horse, instance `tail`, thin `crowd`.
- Look at the finish replay (sepia, grain, "PHOTO FINISH" frame) and the results screen, which this session did not reach. Play 2-player.
**Open**
- Finish replay, results screen and 2-player were not seen this session. Real Q+P / W+O alternation over a full race was not run, only the first 40 frames of it.
