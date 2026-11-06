**Photo Finish Fiasco, judge 52**

I ran `open`, one `interact` (Enter, `until` countdown 0, alternating Q+P and W+O) and a second `interact` of the same alternation, each with a `look`, then `perf` with `costs`. I did not reach a finish, so the finish replay, the sepia photo finish, results, 2-player mode and the head-on cut were not seen. Those scores carry over.

1. **Plays as DESIGN.md's Core loop and Controls say: 8.**
   - The first run took `phase` from "countdown" to "race" at frame 277.
   - `horses.2.legs` then cycled "1001" and "0110", and YOU went from x=2 to 5.35, then to 12.39 at `raceT` 2.4. A human run is shown for the first time.
   - A large green "GO!" cue now shows when keys start to count, which was the open item.
   - YOU led all three AI at `raceT` 2.4, with odds 1-2.
2. **Real Rapier ragdoll, face-plant collapse and auto-right: 8.** This session's runs had `plants` 0 and `state` "run" throughout. The collapse was seen in judge 50 and is unchanged.
3. **Replay (sepia, 0.25x, Space skips): 6.** No finish replay was seen. In judge 50, Space during the replay started a fresh race instead of skipping to results, and nothing says that was fixed.
4. **Photo finish and tangled AI collapse within the first minute: 7.** Here the AI were still running at `raceT` 2.4 with no tangle yet. No finish was reached.
5. **Results with most face-plants award: 8.** `div#tote` shows "FACE-PLANTS 0" under each horse. The results screen itself was not seen.
6. **Looks as LOOK.md says: 8.**
   - The toon steps and outlines hold, `div#crt` covers the whole canvas, and the palette is 70s orange (60%), yellow (18%) and grey (15%).
   - The horses carry diamond, polka-dot and stripe silks, and the "PRONTO PIZZA" and "TOP-CAT TIRES" billboards, crowd and numbered board are in place.
   - The grandstand roof still fills the upper frame, so the sky and `hills` do not show.
7. **window.__game convention, static deploy: 9.** `index.html` is at the root, assets are 0.32 MB and there is no runtime network use.
8. **Horses match CHARACTERS.md and horse.png: 8.** The silks, blinkers, bristly mane, socks and numbered saddle cloths read clearly. In the `look`, the horse with silk 3 shows its polka dots and the horse with silk 4 a black-and-yellow blinker patch.
9. **Broadcast overlay: 9.**
   - `div#tote` has live-moving odds (6-1 to 10-1 and 2-1 to 1-2 within 2 s) and silks.
   - `div#lower` carries the "HANK 'HOOFBEAT' PRUITT" play-by-play, and the LIVE bug, clock, race time, progress bar, `div#keys`, `div#tips` and buttons are all present.
   - The `div#lower` line still read "AND THEY'RE OFF" at 2.4 s.
10. **Camera: 8.** The side tracking follows YOU and frames the grandstand and billboards. The head-on cut was not seen.
11. **Controls feel learnable: 7.** The "GO!" cue and the on-screen `div#keys` Q/W/O/P hints work, and alternating Q+P and W+O drives YOU forward. No human finish has been seen yet, so it cannot score higher.
12. **Local 2-player: 7.** The "2 PLAYERS (2)" button is visible. It was not played.
13. **Style judged as hard as gameplay: 8.** The 1970s TV race look holds.

**Faults: 6.**
- `perf` shows 266 draw calls and 141k triangles, unchanged from last session. The 356 ms frame is SwiftShader at host load 2.0, so it is not a budget signal.
- `hills` is "Never visible".
- No console errors were seen.
- Iteration 52's z-fight fix is still unchecked.

**Next:**
1. **Run to the finish, then check the finish replay, results and Space skip (asked again).**
   - Repeat the same Q+P and W+O alternation with `interact`, `until` `{"horses.2.finished":true}`, `max` 3000. You will have to keep YOU upright, so vary the key timing if `horses.2.state` goes to "down".
   - Then `look` with `sample` at the sepia, grain and "PHOTO FINISH" frame pixels, and press Space once.
   - It is done when `phase` reaches "results" with the face-plants award text, and Space during the replay goes to results rather than a new race.
2. **Draw calls (266, asked again).**
   - Merge `merged-outline` (45 calls), `mesh-outline` (18) and `tail` (16) per horse.
   - Thin `crowd` (47.9k triangles, 4 calls).
   - `perf` with `costs` should then show under 200 draw calls.
3. **Show `hills` behind the grandstand (asked again).** Lower the roof (`roofY`) or raise the camera pitch. A plain `look` should then not list `hills` under "Never visible", and the sky should show above the grandstand.

SCORE: 7.7
