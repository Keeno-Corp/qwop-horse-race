The last builder's section and the last judge's verdict; paprika-loop/PROGRESS.md holds every session's.

### Judge 79

Judge 79 so far: I've seen the opening race, a plant replay and the photo-finish replay, and `perf` is done. I'm writing the verdict now.

**Judge 79: scores**

1. **Plays as DESIGN.md says: 7.** The `countdown` and `tote` work. The "1 PLAYER / 2 PLAYERS (2) / RESTART" buttons and the `keys` Q/W/O/P strip are visible. With no input, a solo race ran and ended: `results` ["Hoof Hearted","Dusty Rhodes","Sir Trips-a-Lot","YOU"]. I did not play the human to a finish this session. A human finish under 60 s is still unshown.
2. **Rapier ragdolls, face-plant, auto-right: 8.** `Sir Trips-a-Lot` and `Hoof Hearted` went `down` at x ≈ 12 (`plants` 1) with thud and gasp sounds. `Sir Trips-a-Lot` was back in `run` later, with `plants` 6 and `pitch` 2.92 near the line. The recovery works.
3. **Replay and photo-finish look: 5.** The plant replay ("INSTANT REPLAY · 0.25x", "SPACE to skip", `rate` 0.25) is fine. The photo-finish replay has the sepia grade, `PHOTO FINISH` title, film-sprocket frame, scratch line, `pfc` caption ("WINNER: Hoof Hearted · BY 0.19 SEC") and flash. But at replay `t` 0 the picture is nearly all empty yellow `track` and no horse is on screen. Only the blue marker and a distant grandstand show. The camera does not frame the finish.
4. **Photo finish and tangled AI collapse with no input: 8.** With no input, `tangles` reached 1 and both AI horses went `down` by 7 s. The finish came at about 24 s with a 0.19 s margin and the photo-finish replay. One run is not a rate.
5. **Results with most face-plants award: 7.** `results` order is in the state, but I did not see the card this session. Judge 77 saw it.
6. **Looks as LOOK.md says: 8.** The toon shading, outlines, warm grade, CRT overlay and grandstand with the "GRAND STAND" sign all read well. In the opening look a green hill is now visible at the left. `look` still lists `hills` as "Never visible (outside the view)", so the check is not satisfied. The ground is a flat orange.
7. **`__game` convention, static, no network: 9.** `observe` works, assets are 0.32 MB, and there were no console errors.
8. **Horses match CHARACTERS.md: 8.** The polka-dot `YOU` and the chevron/diamond horses have cloth numbers, big googly eyes, white socks, dark hooves, a bristly mane and a blinker. The legs are still shorter than `refs/sheets/horse.png`.
9. **Broadcast overlay: 9.** The `tote` shows silks, odds and per-horse "FACE-PLANTS"; the `top-r` panel has the LIVE bug, the 3:58 PM clock and "RACE TIME 2.1s"; the `lower` third shows "PLAY-BY-PLAY · HANK 'HOOFBEAT' PRUITT" with a commentary line; the progress bar and `tips` footer are there.
10. **Camera: 7.** The side-tracking telephoto is good. The replay cam in the photo-finish shot points at empty ground. I did not see the head-on cut this session.
11. **Learnable controls: 6.** This was not played this session. Judge 78 saw about 4 m/s from alternation, but the human still has not been shown to finish.
12. **Local 2-player, discoverable: 8.** The "2 PLAYERS (2)" button and footer line are visible. I did not play it.
13. **Style judged as hard as gameplay: 8.** It reads as a 70s broadcast. The flat orange ground and the empty replay frame are the weak spots.

**Faults: 6.**
- `hills` is still "Never visible (outside the view)", even though a green hill shows in the picture, so something else is drawing it. The next builder should check which object that is.
- `look` again reports that every render call drew into a render target and none to the screen, in both replay looks. `broadcast.js:98` calls `setRenderTarget(null)`, so either the replay pass leaves a target bound or the tool misreads the post pass.
- `perf` read 112 ms on SwiftShader (265 draw calls, 126k triangles, host load 2.0). That is a software renderer, so it is not a budget signal.

**Next:**
1. **Frame the horses in the photo-finish replay.**
   - At `replay.kind` "finish", `t` 0, the camera shows empty ground and no horse is on screen.
   - Point the photo-finish cam at the line (x ≈ 60) with the leaders' z range in view, as a low side-on shot.
   - Check with `interact` `{"until":{"replay.kind":"finish"}}` and `look`. Done when `horses.1` and `horses.3` appear in the sepia frame.
2. **Prove the human finishes (asked again).**
   - Play ~30 Q+P / W+O pairs, then `{"until":{"horses.2.finished":true},"max":3600}`.
   - Done when `horses.2.finishT` is under 60 and the results card shows "MOST FACE-PLANTS".
3. **Fix `hills` and the flat ground (asked again).**
   - Find out why `look` calls `hills` outside the view while a hill shows at the left.
   - Add a dirt-to-grass edge and hoof-print variation to `track`.
   - `look` with `sample` at (500, 420) should show more than one orange, and the "Never visible: hills" line should go.
   - Also lengthen the leg segments toward `refs/sheets/horse.png`.

SCORE: 7.5

## Iteration 80
**Did**
- game.js `startFinishReplay` and `updateCamera` (replay kind 'finish'): the camera moves from (FINISH_X+7, 1.1, 3.2) to (FINISH_X+4, 1.3, 10), looking at (FINISH_X-0.5, 1.0, 0), fov 34→30. It is now a side-on shot of the line, where the old cam looked down the track at empty ground.
**Saw**
- Photo-finish replay at t≈5 (a wait of 20 frames after the replay started): 2 horses (Sir Trips-a-Lot, Dusty Rhodes) sit in the sepia frame with the checker line, rail, ad boards and crowd. The picture was stale at t=0 on the first look.
- The "render target left bound" warning is still there on the look; the picture is only correct after a wait. `hills` is still "Never visible (outside the view)" in the replay. No console errors. No `perf`, no human finish played.
**Next**
- Play the human to `horses.2.finished` (Q+P / W+O pairs) and check `finishT` under 60 and the results card.
- `hills`: the ground is still flat yellow-orange; add a dirt-to-grass edge and hoof-print variation to `track`.
- Longer legs toward `refs/sheets/horse.png`.
**Open**
- The human finish is still not shown. The hills cause is unknown. The replay start may be early: the horses were only at the line after a 20-frame wait.
