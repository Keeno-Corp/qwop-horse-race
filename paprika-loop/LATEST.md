The last builder's section and the last judge's verdict; paprika-loop/PROGRESS.md holds every session's.

## Iteration 47
**Did** game.js: strengthened the AI catch-up at line 63 to `(1 - clamp((AI.leadX - px - 1) * 0.06, 0, 0.4))` (up to 40% faster when behind). `act({type:'autoplay'})` now sets `S.auto` (the existing Q+P / W+O rhythm) so one `interact` runs a whole race.
**Saw** Autoplay from raceT 0: at raceT 6.8 `YOU` 13.9 and AIs 14.1 / 14.4, so the pack is level (was 5.7 m behind). Natural pile-up at raceT 8.67: `tangles` 1 and a `plant` replay (`rate` 0.25) with no input from me. Skipped the replay with Space; reached `results` at raceT 23.4: order YOU, Dusty Rhodes, Hoof Hearted, Sir Trips-a-Lot. `YOU` finishT 19.62, nearest AI 21.55 (gap 1.9 s). Two AIs ended with 5 plants. Did not run `look` or `perf`.
**Next** (1) Tighten the finish gap to under 1 s (the dead-heat sprint at AI.leadX > 34). (2) Check the results screen visually for the most-face-plants award with `look`. (3) `feel` on the shake, one 2-player play.
**Open** The catch-up may now be strong enough that AIs sometimes pass the player; only one race tested. Results screen award text unseen. Jitter spread unverified.

### Judge 47

**Verdict, session 47**

1. **Plays as DESIGN.md's Core loop and Controls say: 7.** I started `act({type:'autoplay'})` and ran up to 2400 frames. `YOU` was stuck at x 2.29 at `raceT` 29.55 with `legs` "0000" and `plants` 1. `Dusty Rhodes` finished at `finishT` 23.03. Session 47 reported autoplay winning the race, so this run did not repeat it. Either autoplay dies after a face-plant, or the result depends on the seed. I did not test 2-player play or R.
2. **Real Rapier jointed ragdoll, face-plant, auto-right: 7.** `Sir Trips-a-Lot` and `Hoof Hearted` each had `plants` 6 and `pitch` about -2 (-2.22 and -1.94), while their `state` still read "run". Those horses are lying upside-down and still marked running, so the auto-right may be failing. The legs and white socks read well in the replay.
3. **Replay: 8.** The finish replay ran with `kind` "finish", `rate` 0.25, the `REPLAY` banner and "SPACE to skip".
4. **Photo finish and tangled AI collapse: 6.** `tangles` reached 1 and the AIs piled up, which is funny. The finish was not a photo finish: the nearest horses were at x 37–38 while the winner was already over the line.
5. **Results with most face-plants award: 5.** `phase` stayed "replay" through 2400 frames and never reached "results". The award text has not been seen in 5 sessions. The `results` array is filled in, with `YOU` last.
6. **Looks as LOOK.md says: 8.** The `track`, `grandstand` with blocky crowd, white rail, `finish-line` checker, `hills` and a red-brown horse with a yellow saddle and white socks all show. Saturation was 53%, 20% near black and 1% blown out. The look had no `Lighting:` or `Surfaces:` lines. The camera sits very close during the replay and crops the horse's body. The `WINNER!` text overlaps the crowd and is hard to read because it is faint.
7. **window.__game convention, index.html at root: 9.** `observe` and `act` both work and the state is full.
8. **Clip moments in the first minute: 7.** The pile-up now happens on its own, with `tangles` 1 and plants of 6, 6 and 0 across the AIs. The photo finish is still missing.
9. **Controls feel learnable: 6.** A held rhythm worked in session 47. This session the player ended at x 2.29. I did not check whether autoplay or the physics stopped it.
10. **Horses read as horses, match refs/01.jpg: 9.** Head, neck, dark mane and tail, saddle, socks and dark hooves show next to the stands and fence.
11. **Juice: 8.** 48 sounds fired: blip, powerup, cheer, thud, gasp and boing. The `div.pop` "WINNER!" popup, the banner and the finish checker all show. I did not run `feel` on the shake.
12. **Local 2-player discoverable from the HUD: 8.** This was carried over from session 46, and I did not play it.
13. **Static page, vendored lib, no network: 9.** `perf` shows 378 draw calls, 33.5k triangles and 0 MB of assets. The 85 ms frame is SwiftShader and does not count.

**Faults: 6.** There were no console errors. `Never visible` lists `dust`, which should show on a dirt track. In `look`, `player-body` drew no pixel and the replay camera framed an AI instead. The `results` phase did not appear within 2400 frames, and AIs in "run" state lie upside-down with `pitch` -2.

**Next:**
1. **The results screen never appears (asked again).** After the finish replay, `phase` stayed "replay" for thousands of frames and the race never ended. Find why the replay or the finish does not hand over to `results`. The cause may be that the race waits for every horse, including the upside-down AIs with `state` "run". Then end the race a few seconds after the first finish, or when the player finishes. Check: `interact` with `act({type:'autoplay'})` and `until {phase:'results'}`, then `look` should show the face-plants award text.
2. **Fix horses stuck upside-down and make autoplay reliable.** `Sir Trips-a-Lot` and `Hoof Hearted` have `pitch` about -2 with `plants` 6 but never recover. Check that the auto-right fires after about 2 s and sets `state` to "plant" while down. Also make autoplay re-hold keys after a face-plant, so `YOU` finishes every run. Check: `interact` with autoplay, where `YOU.finished` should be true by `raceT` 30 and no horse should have `|pitch|` > 1.2 for more than 3 s.
3. **Fix the `dust` and the finish drama.** `dust` is "Never visible", so make the hoof dust spawn visibly on the `track` at the horses' feet. Add a gentle clamp so the winner and the second horse are under 1 s apart, which gives the photo finish. Also move the replay camera back so the full horse and the line show. Check: `look` during the replay should show dust puffs, and `observe` should show a gap under 1 s.

SCORE: 7.2
