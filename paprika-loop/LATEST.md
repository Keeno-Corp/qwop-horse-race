The last builder's section and the last judge's verdict; paprika-loop/PROGRESS.md holds every session's.

## Iteration 81
**Did**
- view.js horse legs: `u.scale.y` and `l.scale.y` 1.2 → 1.32 (about 10% longer legs, visual only).
**Saw**
- Race start look (300 frames): 4 horses in `run`, legs visibly longer, no console errors, no plants. `hills` still "Never visible" at the start camera; the `track` already has a dirt-to-grass far edge in the code (view.js ~353). No `perf`, no replay or human finish checked.
**Next**
- Replay first-frame fix (render once after the camera move), then play the human to `horses.2.finished` and show the results card.
- Find what draws the green hill so `hills` stops reporting as unseen; add hoof-print variation on `track`.
**Open**
- Legs were only scaled visually; if the ragdoll joints look stretched in a plant, check against physics.js segment lengths.

### Judge 81

**Judge 81: scores**

1. **Plays as DESIGN.md says: 7.** The `countdown`, `tote`, the "1 PLAYER / 2 PLAYERS (2) / RESTART" buttons and the `keys` strip all show. A solo no-input race ran to `replay.kind` "finish" at `raceT` 28.9. After pressing R, the countdown picture is wrong. It is a huge "1" over empty yellow-green grass, with the horses at x 0–3 nowhere in the frame. The Q/P/W/O presses landed during the countdown, so `YOU` did not move (x 2.08). I did not run a human to `finished` this session.
2. **Rapier ragdolls, face-plant, auto-right: 8.** In the AI race `Sir Trips-a-Lot` had `plants` 6 and still ended in `run` at x 57.8, so collapse and recovery are happening. The `pitch` of 2.92 shows a flip. I did not check the joints for stretch after the legs were lengthened.
3. **Replay and photo-finish look: 8.** The look is a good sepia frame, with the "PHOTO FINISH" `cap2`, the "REPLAY 0.25x" `tag`, the "SPACE to skip" `sk`, the `pfc` "WINNER: Hoof Hearted · BY 0.19 SEC · HOLD ALL TICKETS" and a scratch line. Horses, grandstand and ads show at `t` 0. The "render target left bound" warning is still reported on the last frame.
4. **Photo finish and tangled AI collapse with no input: 8.** A no-input run gave `tangles` 1 and a 0.19 s photo finish (`Hoof Hearted` 24.35 vs `Dusty Rhodes` 24.54) at 28.9 s. That is two clean photo-finish races in a row (Judge 79 and this one), but still only a small sample.
5. **Results with most face-plants award: 7.** The `tote` shows a per-horse "FACE-PLANTS" column. I did not see the results card.
6. **Looks as LOOK.md says: 7.** The toon shading, outlines, warm grade and CRT pass all fit. The countdown picture is a flat, nearly empty yellow ground and reads badly. `track` is still thin, 0.2% of the frame, and `hills` is still "Never visible".
7. **`__game` convention, static, no network: 9.** `observe` works, assets are 0.32 MB, and there were no console errors.
8. **Horses match CHARACTERS.md: 8.** In the replay frame the polka-dot `YOU`, the chevron and diamond cloths, the big eyes, the white socks and the dark hooves all read. The legs are longer than last session but still stubbier than `refs/sheets/horse.png`.
9. **Broadcast overlay: 9.** The `tote` with silks and odds, the `top-r` LIVE bug with the 3:58 PM clock, the `lower` third ("PLAY-BY-PLAY · WALT DUNMORE", "GOOD AFTERNOON FROM CHANNEL 7!") and the `tips` footer all read as 70s TV.
10. **Camera: 6.** The finish side-on camera is good. The countdown camera after a restart loses the horses completely. I did not see the head-on cut.
11. **Learnable controls: 6.** I could not test this, because the keys did nothing during the countdown. Judge 80 measured about 3.9 m/s with pair alternation.
12. **Local 2-player, discoverable: 8.** The "2 PLAYERS (2)" button and the footer line are visible. I did not play it.
13. **Style judged as hard as gameplay: 8.** The replay frame reads as a 70s broadcast. The countdown frame lets it down.

**Faults: 6.**
- **Countdown shot:** the camera shows no horses.
- **`perf`:** 139 ms median on SwiftShader (266 draw calls, 126k triangles). The host load was 1.9 on 8 cores, so the time is noise rather than a budget signal.
- **Render target:** the "render target left bound" warning is still there.
- **`hills`:** still "Never visible".
- **Console:** no errors.

**Next:**
1. **Fix the countdown camera after R (new).**
   - Frame the four horses at x 0–3, side-on, during `countdown`. After a restart the camera appears to start from the replay or finish position and point at bare ground.
   - Check with `interact` `{"key":"KeyR"},{"wait":30}` and `look`. Done when all four horses and the `lane` rail show, and `look` with `sample` at (640, 500) gives something other than flat yellow.
2. **Fix the render-target warning and the `hills` report (asked again).**
   - Call `setRenderTarget(null)` after the last pass, and find which object draws the green hill at the left, so `hills` is no longer listed as never visible.
   - Check with `look` during the replay. Done when the "every render call drew into a render target" line and "Never visible: hills" are both gone.
3. **Show the human finish and the results card (asked again).**
   - Start with Q/P then W/O after `countdown` reaches 0, and play with `{"until":{"horses.2.finished":true},"max":3600}`.
   - Done when `finishT` is under 60 and the results card shows "MOST FACE-PLANTS".
   - If time allows, add hoof-print or rake-stripe variation to `track` so it covers more than 0.2% of the frame.

SCORE: 7.5
