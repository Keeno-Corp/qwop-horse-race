The last builder's section and the last judge's verdict; paprika-loop/PROGRESS.md holds every session's.

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

### Judge 80

**Judge 80: scores**

1. **Plays as DESIGN.md says: 8.** The `countdown` and `tote` work, and the "1 PLAYER / 2 PLAYERS (2) / RESTART" buttons and the `keys` Q/W/O/P strip are visible. Alternating Q+P / W+O pairs took `YOU` from x 5.8 to 11.2 in 84 frames with `plants` 0 (about 3.9 m/s). That would be about 16 s for 60 m, but I did not run to `finished`, so the finish is extrapolated.
2. **Rapier ragdolls, face-plant, auto-right: 8.** All four horses stayed in `state` "run" in this session's opening seconds, with `pitch` near 0 and `legs` bit strings changing. I did not see a plant this session. Judge 79 saw `down` and recovery.
3. **Replay and photo-finish look: 6.** Not re-looked this session. Per the builder, the new side-on camera at the line works, but only after a 20-frame wait, when the first `look` showed a stale picture. The "render target left bound" warning is also still reported.
4. **Photo finish and tangled AI collapse with no input: 7.** I did not run a no-input race this session; Judge 79 saw one finish by 0.19 s with a tangle. One run is not a rate.
5. **Results with most face-plants award: 7.** The `tote` has a per-horse "FACE-PLANTS" column. I did not see the results card this session.
6. **Looks as LOOK.md says: 8.** The toon shading, outlines, warm grade and CRT pass are good. The orange `track` is still flat and there is no dirt-to-grass edge. `hills` is still "Never visible (outside the view)" even though a green hill shows at the left, so another object is drawing it.
7. **`__game` convention, static, no network: 9.** `observe` works, assets are 0.32 MB, and I saw no console errors.
8. **Horses match CHARACTERS.md: 8.** The polka-dot `YOU`, the chevron and diamond horses, the cloth numbers, big eyes, white socks, dark hooves and blinkers all read well. The legs are still shorter than `refs/sheets/horse.png`.
9. **Broadcast overlay: 9.** The `tote` with silks and odds, the `top-r` LIVE bug with the 3:58 PM clock and "RACE TIME 1.5s", and the `lower` third ("PLAY-BY-PLAY · HANK "HOOFBEAT" PRUITT", "AND THEY'RE OFF, FOLKS!") all read as 70s TV. The `tips` footer is there too.
10. **Camera: 7.** The side-tracking telephoto is good, with the horses crowded left in the frame. I did not see the head-on cut this session.
11. **Learnable controls: 7.** Simple pair alternation moves the horse steadily with no plants. Judge 78 saw a similar speed.
12. **Local 2-player, discoverable: 8.** The "2 PLAYERS (2)" button and the footer line are visible. I did not play it.
13. **Style judged as hard as gameplay: 8.** The picture reads as a 70s broadcast. The flat ground and the short legs are the weak spots.

**Faults: 7.** There were no console errors.
- `perf` read 95 ms on SwiftShader (265 draw calls, 126k triangles), which is not a budget signal.
- `hills` is still listed as never visible.
- The replay-start stale frame and the render-target warning are still there.

**Next:**
1. **Finish the replay-start fix and prove the replay (asked again).**
   - Make the first drawn frame of `replay.kind` "finish" already show the line and the horses. For example, render once after the camera move, or start the replay a few frames later.
   - Check with `interact` `{"until":{"replay.kind":"finish"}}` and `look` with no wait. Done when two or more horses appear at `t` 0 and the render-target warning goes.
2. **Fix the flat ground and `hills` (asked again).**
   - Find which object draws the green hill at the left while `hills` reports as outside the view.
   - Add a dirt-to-grass edge and hoof-print or rake-stripe variation to `track`.
   - Done when `look` with `sample` at (500, 560) and (500, 480) gives different oranges and the "Never visible: hills" line is gone.
3. **Lengthen the legs toward `refs/sheets/horse.png`, and show the human finish.**
   - Raise the leg segment lengths about 20% so the horses look long-legged and wobbly.
   - Then play the human with `{"until":{"horses.2.finished":true},"max":3600}` and show `finishT` under 60 and the results card with "MOST FACE-PLANTS".

SCORE: 7.7
