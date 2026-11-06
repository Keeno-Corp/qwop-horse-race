**Photo Finish Fiasco, judge 49**

I ran `open`, one `interact` (Enter, alternating Q+P and W+O for 30 frames each, then 240 frames) with a `look`, and `perf` with `costs`. I did not play to a finish, the replay, 2-player or the head-on cut, so those scores carry over.

1. **Plays as DESIGN.md's Core loop and Controls say: 7.** The "GO!" banner shows and `phase:"race"` runs. The `interact` replies show the human's `legs` reading "0000" at `raceT` 0.57 despite the held keys, so the input was either not registered in that window or is not shown. No human finish has been seen.
2. **Real Rapier ragdoll, face-plant collapse and auto-right: 8.** All four horses are in `state:"run"` with `plants:0`. No collapse was seen this session, so this carries over.
3. **Replay (sepia, 0.25x, Space skips): 8.** Carried over, not seen.
4. **Photo finish and tangled AI collapse within the first minute: 8.** Carried over. The four horses are bunched at the start, but no finish was seen.
5. **Results with most face-plants award: 9.** `div#tote` shows "FACE-PLANTS 0" under each horse.
6. **Looks as LOOK.md says: 8.**
   - The toon steps and outlines, the orange and golden palette, `div#crt` and the "GOLDEN HOOF OATS" billboard all hold.
   - The grandstand `crowd` is readable, but the grandstand fills the upper half of the frame.
   - `hills` is hidden behind the grandstand.
7. **window.__game convention, static deploy: 9.** `index.html` is at the root, assets are 0.32 MB and there is no runtime network use.
8. **Horses match CHARACTERS.md and horse.png: 8.** The diamond, polka-dot, stripe and chevron silks, the numbers, hooves, white socks, eyes, manes and blinkers all show. The player's horse is whole and in frame, with the blue marker over it.
9. **Broadcast overlay: 9.** `div#tote` has odds (5-1, 4-1, 2-1, 3-2) and silks. `div#lower` has the Hank "Hoofbeat" Pruitt line. The LIVE bug, 3:58 PM clock, "RACE TIME 0.65", progress bar, `div#keys`, `div#tips` and the "GO!" banner are all present.
10. **Camera: 8.** The `followTarget` cap works: at the start the whole pack, YOU included, sits in frame. A trailing player at `raceT` ≈ 5 was not checked this session, and neither were the head-on cut and replay cams.
11. **Controls feel learnable: 7.** `div#tips` and `div#keys` are clear, but no human finish has been seen.
12. **Local 2-player: 7.** The "2 PLAYERS (2)" button is visible. It was not played.
13. **Style judged as hard as gameplay: 8.** The 70s TV look holds.

**Faults: 6.**
- `perf` shows 410 draw calls and 141k triangles. The 203 ms frame is SwiftShader at host load 2.2, so it is not a budget signal. The draw-call count is the fault.
- `hills` is "Never visible" in the plain `look`.
- No console errors were seen.

**Next:**
1. **Draw calls (asked again, seventeenth time).**
   - Merge `merged` (142 calls) and `Mesh` (59) by material across all horses, not per group. Merge `merged-outline` (45) and `mesh-outline` (18) the same way.
   - Instance `tail` (16 calls), and thin `crowd` (47.9k triangles).
   - `perf` with `costs` should show under 250 draw calls.
2. **Play to a finish (asked again).**
   - Run `interact` with alternating Q+P and W+O, `until` `{"horses.2.finished":true}`, with `max` 3000. First confirm the human's `legs` string shows "1001" and "0110" while the keys are held.
   - Then press `Digit2` and play Q W E R against U I O P.
   - Take a `look` of the sepia replay with `sample` at two frames to show grain and flicker.
3. **Hills and sky behind the grandstand.**
   - Lower the grandstand roof or raise the camera pitch so `hills` and the sky show above the stand.
   - A plain `look` should then not list `hills` under "Never visible".

SCORE: 7.8
